import { TRPCError } from "@trpc/server";
import { z } from "zod";
import sanitizeHtml from "sanitize-html";

import {
    createTRPCRouter,
    protectedProcedure,
    publicProcedure,
} from "~/server/api/trpc";

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
                include: {
                    posts: {
                        include: {
                            comments: true
                        }
                    }
                }
            });

            if (!selectedUser) throw new TRPCError({
                code: "BAD_REQUEST",
                message: "User not found"
            })

            return selectedUser;
        }),

    editUserInfo: protectedProcedure
        .input(z.object({
            username: z.string().trim().nonempty("Username cannot be empty"),
            bio: z.string().trim().nonempty("Bio cannot be empty"),
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
                }
            });

            return {
                success: true,
                message: "Update Profile Information Successfully"
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