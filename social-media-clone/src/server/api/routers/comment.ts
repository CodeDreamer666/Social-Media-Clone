import { TRPCError } from "@trpc/server";
import { z } from "zod";
import sanitizeHtml from "sanitize-html"

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
                }
            });

            const cleanCommentContentInput = sanitizeHtml(input.commentContent, {
                allowedAttributes: {},
                allowedTags: []
            })


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
                        content: cleanCommentContentInput,
                        postId: input.postId
                    }
                });

                await tx.post.update({
                    where: {
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
        })
})