import { TRPCError } from "@trpc/server";
import sanitizeHtml from "sanitize-html";
import { z } from "zod";
import { POST_CONTENT_MAX_LENGTH } from "~/lib/contentLimits";
import { getFeedInterests, interestValues } from "~/lib/interests";
import {
  getFeedVisibilityWhere,
  rankFeedPostsByInterest,
} from "~/server/api/feedVisibility";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { publicUserIdentitySelect } from "~/server/api/userSelections";
import { canViewPrivateContent } from "~/server/permissions";
import { protectPostImage } from "~/server/postPresentation";

const postContentSchema = z
  .string()
  .trim()
  .max(
    POST_CONTENT_MAX_LENGTH,
    `Posts can be up to ${POST_CONTENT_MAX_LENGTH.toLocaleString()} characters`,
  );

export const postRouter = createTRPCRouter({
  createPost: protectedProcedure
    .input(
      z.object({
        content: postContentSchema,
        interest: z.enum(interestValues, {
          message: "Please choose an interest",
        }),
        uploadedImageId: z.string().uuid().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.session.user.id;
      const cleanContent = sanitizeHtml(input.content, {
        allowedTags: [],
        allowedAttributes: {},
      }).trim();

      if (!cleanContent && !input.uploadedImageId) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Add text or an image",
        });
      }

      await ctx.db.$transaction(async (tx) => {
        const uploadedImage = input.uploadedImageId
          ? await tx.uploadedImage.findFirst({
              where: {
                id: input.uploadedImageId,
                userId,
                isIncludeInPost: false,
                postId: null,
              },
              select: {
                id: true,
                imageUrl: true,
                imageCid: true,
              },
            })
          : null;

        if (input.uploadedImageId && !uploadedImage) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "The uploaded image is unavailable",
          });
        }

        const post = await tx.post.create({
          data: {
            content: cleanContent,
            interest: input.interest,
            imageUrl: uploadedImage?.imageUrl ?? null,
            imageCid: uploadedImage?.imageCid ?? null,
            userId,
          },
        });

        if (uploadedImage) {
          const claimedImage = await tx.uploadedImage.updateMany({
            where: {
              id: uploadedImage.id,
              userId,
              isIncludeInPost: false,
              postId: null,
            },
            data: {
              isIncludeInPost: true,
              postId: post.id,
            },
          });

          if (claimedImage.count !== 1) {
            throw new TRPCError({
              code: "CONFLICT",
              message: "This image is already attached to a post",
            });
          }
        }
      });

      return {
        success: true,
        message: "Post created",
      };
    }),

  getAllPost: protectedProcedure.query(async ({ ctx }) => {
    const userId = ctx.session.user.id;
    const currentUser = await ctx.db.user.findUnique({
      where: {
        id: userId,
      },
      select: {
        interest: true,
      },
    });

    if (!currentUser) {
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message: "Your account is no longer available",
      });
    }

    const feedInterests = getFeedInterests(currentUser.interest);

    const posts = await ctx.db.post.findMany({
      where: getFeedVisibilityWhere(userId, feedInterests),
      select: {
        id: true,
        userId: true,
        content: true,
        interest: true,
        imageUrl: true,
        createdAt: true,
        updatedAt: true,
        user: {
          select: {
            ...publicUserIdentitySelect,
            isPublic: true,
          },
        },
      },
      orderBy: [{ createdAt: "desc" }, { id: "desc" }],
    });

    return rankFeedPostsByInterest(posts, feedInterests).map(protectPostImage);
  }),

  getSelectedPost: protectedProcedure
    .input(z.object({ postId: z.string().uuid() }))
    .query(async ({ ctx, input }) => {
      const viewerId = ctx.session.user.id;
      const selectedPost = await ctx.db.post.findUnique({
        where: {
          id: input.postId,
        },
        select: {
          id: true,
          userId: true,
          content: true,
          interest: true,
          imageUrl: true,
          createdAt: true,
          updatedAt: true,
          user: {
            select: {
              ...publicUserIdentitySelect,
              isPublic: true,
            },
          },
          comments: {
            select: {
              id: true,
              postId: true,
              userId: true,
              content: true,
              createdAt: true,
              updatedAt: true,
              user: {
                select: publicUserIdentitySelect,
              },
            },
            orderBy: [{ createdAt: "asc" }, { id: "asc" }],
          },
        },
      });

      if (!selectedPost) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Post not found",
        });
      }

      const canViewPost = await canViewPrivateContent({
        db: ctx.db,
        viewerId,
        authorId: selectedPost.userId,
        authorIsPublic: selectedPost.user.isPublic,
      });

      if (!canViewPost) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "Connect with this user to view this post",
        });
      }

      return protectPostImage(selectedPost);
    }),
});
