import { TRPCError } from "@trpc/server";
import sanitizeHtml from "sanitize-html";
import { z } from "zod";
import { COMMENT_CONTENT_MAX_LENGTH } from "~/lib/contentLimits";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { canViewPrivateContent } from "~/server/permissions";

export const commentRouter = createTRPCRouter({
  createComment: protectedProcedure
    .input(
      z.object({
        postId: z.string().uuid(),
        commentContent: z
          .string()
          .trim()
          .min(1, "Comment cannot be empty")
          .max(
            COMMENT_CONTENT_MAX_LENGTH,
            `Comments can be up to ${COMMENT_CONTENT_MAX_LENGTH.toLocaleString()} characters`,
          ),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.session.user.id;

      const post = await ctx.db.post.findUnique({
        where: {
          id: input.postId,
        },
        select: {
          userId: true,
          user: {
            select: {
              isPublic: true,
            },
          },
        },
      });

      if (!post) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Post not found",
        });
      }

      const canComment = await canViewPrivateContent({
        db: ctx.db,
        viewerId: userId,
        authorId: post.userId,
        authorIsPublic: post.user.isPublic,
      });

      if (!canComment) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "Connect with this user before commenting",
        });
      }

      const cleanContent = sanitizeHtml(input.commentContent, {
        allowedTags: [],
        allowedAttributes: {},
      }).trim();

      if (!cleanContent) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Comment cannot be empty",
        });
      }

      await ctx.db.comment.create({
        data: {
          userId,
          content: cleanContent,
          postId: input.postId,
        },
      });

      return { success: true };
    }),
});
