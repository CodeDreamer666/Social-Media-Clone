import { TRPCError } from "@trpc/server";
import { z } from "zod";
import sanitizeHtml from "sanitize-html"

import {
    createTRPCRouter,
    protectedProcedure,
} from "~/server/api/trpc";
import { interestValues } from "~/lib/interests";
import { canViewPrivateContent } from "~/server/permissions";

export const postRouter = createTRPCRouter({
    createPost: protectedProcedure
        .input(z.object({
            content: z.string().trim(),
            interest: z.enum(interestValues, {
                message: "Please choose an interest",
            }),
            imageUrl: z
                .string()
                .url()
                .refine((url) => url.startsWith("https://tomato-voluntary-clam-90.mypinata.cloud/ipfs/"), {
                    message: "Invalid image URL.",
                })
                .optional(),
            imageCid: z
                .string()
                .min(10, "Invalid image CID")
                .max(120, "Invalid image CID")
                .optional(),
        }))
        .mutation(async ({ ctx, input }) => {
            const hasImage = Boolean(input.imageUrl && input.imageCid);

            if ((input.imageUrl && !input.imageCid) || (!input.imageUrl && input.imageCid)) {
                throw new TRPCError({
                    code: "BAD_REQUEST",
                    message: "Invalid image data",
                });
            }

            const cleanContent = sanitizeHtml(input.content, {
                allowedTags: [],
                allowedAttributes: {},
            }).trim();

            if (!cleanContent && !hasImage) {
                throw new TRPCError({
                    code: "BAD_REQUEST",
                    message: "Add text or an image",
                });
            }

            await ctx.db.$transaction(async (tx) => {
                const post = await tx.post.create({
                    data: {
                        content: cleanContent,
                        interest: input.interest,
                        imageUrl: input.imageUrl ?? null,
                        imageCid: input.imageCid ?? null,
                        userId: ctx.session.user.id,
                    },
                });

                if (hasImage) {
                    await tx.uploadedImage.updateMany({
                        where: {
                            userId: ctx.session.user.id,
                            imageUrl: input.imageUrl,
                            imageCid: input.imageCid
                        },
                        data: {
                            isIncludeInPost: true,
                            postId: post.id
                        }
                    })
                }
            })

            return {
                success: true,
                message: "Create post successfully"
            }
        }),

    getAllPost: protectedProcedure
        .query(async ({ ctx }) => {
            const userId = ctx.session.user.id;
            const currentUser = await ctx.db.user.findUnique({
                where: {
                    id: userId
                },
                select: {
                    interest: true
                }
            });
            const selectedInterests = currentUser?.interest ?? [];
            const hasSelectedInterests = selectedInterests.length > 0;
            const interestFilter = hasSelectedInterests
                ? {
                    interest: {
                        in: selectedInterests
                    }
                }
                : {};

            return await ctx.db.post.findMany({
                where: {
                    OR: [
                        {
                            userId
                        },
                        {
                            userId: {
                                not: userId
                            },
                            user: {
                                isPublic: true
                            },
                            ...interestFilter
                        },
                        {
                            userId: {
                                not: userId
                            },
                            user: {
                                isPublic: false,
                                OR: [
                                    {
                                        sentConnections: {
                                            some: {
                                                responseUserId: userId,
                                                status: "ACCEPTED"
                                            }
                                        }
                                    },
                                    {
                                        receivedConnections: {
                                            some: {
                                                requestUserId: userId,
                                                status: "ACCEPTED"
                                            }
                                        }
                                    }
                                ]
                            },
                            ...interestFilter
                        }
                    ]
                },
                include: {
                    user: true,
                },
                orderBy: [
                    {
                        createdAt: "desc"
                    },
                    {
                        id: "desc"
                    }
                ]
            });
        }),

    getSelectedPost: protectedProcedure
        .input(z.object({ postId: z.string().trim().nonempty() }))
        .query(async ({ ctx, input }) => {
            const viewerId = ctx.session.user.id;
            const selectedPost = await ctx.db.post.findUnique({
                where: {
                    id: input.postId
                },
                include: {
                    user: true,
                    comments: {
                        include: {
                            user: true
                        }
                    }
                }
            });

            if (!selectedPost) {
                throw new TRPCError({
                    code: "BAD_REQUEST",
                    message: "Post not found"
                })
            }

            const canViewPost = await canViewPrivateContent({
                db: ctx.db,
                viewerId,
                authorId: selectedPost.userId,
                authorIsPublic: selectedPost.user.isPublic
            });

            if (!canViewPost) {
                throw new TRPCError({
                    code: "FORBIDDEN",
                    message: "Connect with this user to view this post"
                });
            }

            return selectedPost;
        })

});
