import { TRPCError } from "@trpc/server";
import { z } from "zod";
import sanitizeHtml from "sanitize-html"

import {
    createTRPCRouter,
    protectedProcedure,
} from "~/server/api/trpc";
import { canViewPrivateContent } from "~/server/permissions";

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
                },
                include: {
                    user: true
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

            const canComment = await canViewPrivateContent({
                db: ctx.db,
                viewerId: userId,
                authorId: post.userId,
                authorIsPublic: post.user.isPublic
            });

            if (!canComment) {
                throw new TRPCError({
                    code: "FORBIDDEN",
                    message: "Connect with this user before commenting"
                });
            }

            await ctx.db.comment.create({
                data: {
                    userId,
                    content: cleanCommentContentInput,
                    postId: input.postId
                }
            });

            return { success: true }
        })
})
