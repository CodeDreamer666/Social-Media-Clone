import { TRPCError } from "@trpc/server";
import { z } from "zod";
import sanitizeHtml from "sanitize-html";

import {
    createTRPCRouter,
    protectedProcedure,
} from "~/server/api/trpc";
import { interestValues } from "~/lib/interests";
import { canViewPrivateContent } from "~/server/permissions";

const INTEREST_UPDATE_COOLDOWN_DAYS = 7;
const INTEREST_UPDATE_COOLDOWN_MS =
    INTEREST_UPDATE_COOLDOWN_DAYS * 24 * 60 * 60 * 1000;

export const userRouter = createTRPCRouter({
    getUserInfo: protectedProcedure
        .query(async ({ ctx }) => {
            const userId = ctx.session.user.id

            return await ctx.db.user.findUnique({
                where: {
                    id: userId
                },
                include: {
                    posts: {
                        include: {
                            comments: true
                        },
                        orderBy: {
                            id: "desc"
                        }
                    }
                }
            })
        }),

    searchAccounts: protectedProcedure
        .input(z.object({
            query: z.string()
        }))
        .query(async ({ ctx, input }) => {
            const searchQuery = input.query.trim();
            const usernameQuery = searchQuery.startsWith("@")
                ? searchQuery.slice(1)
                : searchQuery;

            if (!searchQuery) {
                return [];
            }

            return await ctx.db.user.findMany({
                where: {
                    OR: [
                        {
                            name: {
                                contains: searchQuery,
                                mode: "insensitive"
                            }
                        },
                        {
                            username: {
                                contains: usernameQuery,
                                mode: "insensitive"
                            }
                        }
                    ]
                },
                select: {
                    id: true,
                    name: true,
                    username: true,
                    bio: true
                },
                orderBy: {
                    name: "asc"
                },
                take: 20
            });
        }),

    getSelectedUserInfo: protectedProcedure
        .input(z.object({ userId: z.string().trim().nonempty() }))
        .query(async ({ ctx, input }) => {
            const currentUserId = ctx.session.user.id;

            if (currentUserId === input.userId) {
                return {
                    redirecting: true
                }
            }

            const selectedUser = await ctx.db.user.findUnique({
                where: {
                    id: input.userId
                },
                select: {
                    isPublic: true
                }
            });

            if (!selectedUser) throw new TRPCError({
                code: "BAD_REQUEST",
                message: "User not found"
            })

            const canViewPosts = await canViewPrivateContent({
                db: ctx.db,
                viewerId: currentUserId,
                authorId: input.userId,
                authorIsPublic: selectedUser.isPublic
            });

            return await ctx.db.user.findUnique({
                where: {
                    id: input.userId
                },
                include: {
                    posts: {
                        where: canViewPosts
                            ? undefined
                            : {
                                id: {
                                    in: []
                                }
                            },
                        include: {
                            comments: true
                        },
                        orderBy: {
                            id: "desc"
                        }
                    }
                }
            });
        }),

    editUserInfo: protectedProcedure
        .input(z.object({
            username: z.string().trim().nonempty("Username cannot be empty"),
            bio: z.string().trim().nonempty("Bio cannot be empty"),
            isPublic: z.boolean(),
        }))
        .mutation(async ({ ctx, input }) => {
            const userId = ctx.session.user.id;

            const cleanUsernameInput = sanitizeHtml(input.username, {
                allowedAttributes: {},
                allowedTags: []
            })

            const cleanBioInput = sanitizeHtml(input.bio, {
                allowedAttributes: {},
                allowedTags: []
            })

            await ctx.db.user.update({
                where: {
                    id: userId
                },
                data: {
                    username: cleanUsernameInput,
                    bio: cleanBioInput,
                    isPublic: input.isPublic,
                }
            });

            return {
                success: true,
                message: "Update Profile Information Successfully"
            }
        }),

    updateInterests: protectedProcedure
        .input(z.object({
            interests: z
                .array(z.enum(interestValues))
                .length(3, "Choose exactly 3 interests")
        }))
        .mutation(async ({ ctx, input }) => {
            const userId = ctx.session.user.id;
            const uniqueInterests = new Set(input.interests);

            if (uniqueInterests.size !== 3) {
                throw new TRPCError({
                    code: "BAD_REQUEST",
                    message: "Choose exactly 3 different interests"
                });
            }

            const currentUser = await ctx.db.user.findUnique({
                where: {
                    id: userId
                }
            });

            if (!currentUser) {
                throw new TRPCError({
                    code: "NOT_FOUND",
                    message: "User not found"
                });
            }

            if (currentUser.interestsUpdatedAt) {
                const nextAllowedUpdate =
                    currentUser.interestsUpdatedAt.getTime() +
                    INTEREST_UPDATE_COOLDOWN_MS;
                const now = Date.now();

                if (now < nextAllowedUpdate) {
                    const remainingMs = nextAllowedUpdate - now;
                    const remainingDays = Math.ceil(
                        remainingMs / (24 * 60 * 60 * 1000)
                    );

                    throw new TRPCError({
                        code: "BAD_REQUEST",
                        message: `You can update your interests once every 7 days. Try again in ${remainingDays} days.`
                    });
                }
            }

            await ctx.db.user.update({
                where: {
                    id: userId
                },
                data: {
                    interest: input.interests,
                    interestsUpdatedAt: new Date()
                }
            });

            return {
                success: true,
                message: "Update interests successfully"
            }
        }),

    editUserPosts: protectedProcedure
        .input(z.object({ postId: z.string().trim().nonempty() }))
        .mutation(async ({ ctx, input }) => {
            const userId = ctx.session.user.id;

            await ctx.db.post.delete({
                where: {
                    userId,
                    id: input.postId
                }
            });
            
            return {
                success: true,
                message: "Delete post successfully"
            }
        })
})
