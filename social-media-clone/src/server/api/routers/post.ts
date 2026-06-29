import { TRPCError } from "@trpc/server";
import { z } from "zod";
import sanitizeHtml from "sanitize-html"

import {
    createTRPCRouter,
    protectedProcedure,
    publicProcedure,
} from "~/server/api/trpc";

export const postRouter = createTRPCRouter({
    createPost: protectedProcedure
        .input(z.object({
            content: z.string().trim().nonempty("Post content cannot be empty"),
            interest: z.enum([
                "Coding",
                "Design",
                "Psychology",
                "Finance",
                "Books",
                "Study",
                "Productivity",
                "Life_thoughts",
                "Business",
                "Art",
                "Technology",
                "Self_improvement",
            ], {
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

            if (!cleanContent) {
                throw new TRPCError({
                    code: "BAD_REQUEST",
                    message: "Post content cannot be empty",
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
            })

            return {
                success: true,
                message: "Create post successfully"
            }
        }),

    getAllPost: protectedProcedure
        .query(async ({ ctx }) => {
            return await ctx.db.post.findMany({
                include: {
                    user: true,
                },
                orderBy: {
                    id: "desc"
                }
            });
        }),

    getSelectedPost: protectedProcedure
        .input(z.object({ postId: z.string().trim().nonempty() }))
        .query(async ({ ctx, input }) => {
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

            return selectedPost;
        })

});
