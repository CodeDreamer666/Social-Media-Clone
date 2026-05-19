import { TRPCError } from "@trpc/server";
import { z } from "zod";

import {
    createTRPCRouter,
    protectedProcedure,
    publicProcedure,
} from "~/server/api/trpc";

export const commentRouter = createTRPCRouter({
    createComment: protectedProcedure
        .input(z.object({
            postId: z.string().trim().nonempty(),
            commentContent: z.string().trim().nonempty("Comment cannot be empty")
        }))
        .mutation(async ({ ctx, input }) => {
            const userId = ctx.session.user.id;

            const post = await ctx.db.post.findUnique({
                where: {
                    id: input.postId,
                    userId
                }
            });

            if (!post) {
                throw new TRPCError({
                    code: "BAD_REQUEST",
                    message: "Post not found"
                })
            }

            await ctx.db.$transaction(async (tx) => {
                await tx.comment.create({
                    data: {
                        userId,
                        content: input.commentContent,
                        postId: input.postId
                    }
                });

                await tx.post.update({
                    where: {
                        userId,
                        id: input.postId
                    },
                    data: {
                        commentCount: await tx.comment.count({
                            where: {
                                postId: input.postId
                            }
                        })
                    }
                })
            });

            return { success: true }
        }),

    getPostComment: protectedProcedure
        .input(z.object({ postId: z.string().trim().nonempty() }))
        .query(async ({ ctx, input }) => {
            const post = await ctx.db.post.findUnique({
                where: {
                    id: input.postId
                }
            });

            if (!post) throw new TRPCError({
                code: "BAD_REQUEST",
                message: "Post not found"
            });

            return await ctx.db.comment.findMany({
                where: {
                    postId: input.postId
                }
            })
        })
})