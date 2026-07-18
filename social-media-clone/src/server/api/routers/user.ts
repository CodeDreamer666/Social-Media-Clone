import { TRPCError } from "@trpc/server";
import sanitizeHtml from "sanitize-html";
import { z } from "zod";

import {
  BIO_MAX_LENGTH,
  SEARCH_QUERY_MAX_LENGTH,
  SEARCH_QUERY_MIN_LENGTH,
  USERNAME_MAX_LENGTH,
  USERNAME_MIN_LENGTH,
} from "~/lib/contentLimits";
import {
  getNextInterestUpdateAt,
  INTEREST_UPDATE_COOLDOWN_MS,
} from "~/lib/interestCooldown";
import { interestValues } from "~/lib/interests";
import { pinata } from "~/lib/pinata";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import {
  publicProfileSelect,
  publicUserIdentitySelect,
} from "~/server/api/userSelections";
import { canViewPrivateContent } from "~/server/permissions";
import { protectPostImage } from "~/server/postPresentation";

const usernameSchema = z
  .string()
  .trim()
  .transform((username) => username.replace(/^@/, "").toLowerCase())
  .pipe(
    z
      .string()
      .min(
        USERNAME_MIN_LENGTH,
        `Username must be at least ${USERNAME_MIN_LENGTH} characters`,
      )
      .max(
        USERNAME_MAX_LENGTH,
        `Username can be up to ${USERNAME_MAX_LENGTH} characters`,
      )
      .regex(
        /^[a-z0-9_]+$/,
        "Use only letters, numbers, and underscores in your username",
      ),
  );

const postSummarySelect = {
  id: true,
  userId: true,
  content: true,
  interest: true,
  imageUrl: true,
  createdAt: true,
  updatedAt: true,
} as const;

export const userRouter = createTRPCRouter({
  getUserInfo: protectedProcedure.query(async ({ ctx }) => {
    const user = await ctx.db.user.findUnique({
      where: {
        id: ctx.session.user.id,
      },
      select: {
        ...publicProfileSelect,
        interestsUpdatedAt: true,
        posts: {
          select: postSummarySelect,
          orderBy: [{ createdAt: "desc" }, { id: "desc" }],
        },
      },
    });

    if (!user) {
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message: "Your account is no longer available",
      });
    }

    const nextInterestUpdateAt = user.interestsUpdatedAt
      ? getNextInterestUpdateAt(user.interestsUpdatedAt)
      : null;

    return {
      ...user,
      nextInterestUpdateAt,
      canUpdateInterests:
        !nextInterestUpdateAt || nextInterestUpdateAt <= new Date(),
      posts: user.posts.map(protectPostImage),
    };
  }),

  searchAccounts: protectedProcedure
    .input(
      z.object({
        query: z.string().trim().max(SEARCH_QUERY_MAX_LENGTH),
      }),
    )
    .query(async ({ ctx, input }) => {
      if (input.query.length < SEARCH_QUERY_MIN_LENGTH) {
        return [];
      }

      const usernameQuery = input.query.startsWith("@")
        ? input.query.slice(1)
        : input.query;

      return ctx.db.user.findMany({
        where: {
          OR: [
            {
              name: {
                contains: input.query,
                mode: "insensitive",
              },
            },
            {
              username: {
                contains: usernameQuery,
                mode: "insensitive",
              },
            },
          ],
        },
        select: {
          ...publicUserIdentitySelect,
          isPublic: true,
        },
        orderBy: [{ name: "asc" }, { id: "asc" }],
        take: 20,
      });
    }),

  getSelectedUserInfo: protectedProcedure
    .input(z.object({ userId: z.string().trim().min(1) }))
    .query(async ({ ctx, input }) => {
      const currentUserId = ctx.session.user.id;

      if (currentUserId === input.userId) {
        return { redirecting: true } as const;
      }

      const selectedUser = await ctx.db.user.findUnique({
        where: {
          id: input.userId,
        },
        select: publicProfileSelect,
      });

      if (!selectedUser) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "User not found",
        });
      }

      const canViewPosts = await canViewPrivateContent({
        db: ctx.db,
        viewerId: currentUserId,
        authorId: input.userId,
        authorIsPublic: selectedUser.isPublic,
      });

      const posts = canViewPosts
        ? await ctx.db.post.findMany({
            where: {
              userId: input.userId,
            },
            select: postSummarySelect,
            orderBy: [{ createdAt: "desc" }, { id: "desc" }],
          })
        : [];

      return {
        ...selectedUser,
        posts: posts.map(protectPostImage),
      };
    }),

  editUserInfo: protectedProcedure
    .input(
      z.object({
        username: usernameSchema,
        bio: z
          .string()
          .trim()
          .min(1, "Bio cannot be empty")
          .max(BIO_MAX_LENGTH, `Bio can be up to ${BIO_MAX_LENGTH} characters`),
        isPublic: z.boolean(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.session.user.id;
      const cleanBio = sanitizeHtml(input.bio, {
        allowedAttributes: {},
        allowedTags: [],
      }).trim();

      if (!cleanBio) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Bio cannot be empty",
        });
      }

      const usernameOwner = await ctx.db.user.findFirst({
        where: {
          id: {
            not: userId,
          },
          username: {
            equals: input.username,
            mode: "insensitive",
          },
        },
        select: {
          id: true,
        },
      });

      if (usernameOwner) {
        throw new TRPCError({
          code: "CONFLICT",
          message: "That username is already in use",
        });
      }

      await ctx.db.user.update({
        where: {
          id: userId,
        },
        data: {
          username: input.username,
          bio: cleanBio,
          isPublic: input.isPublic,
        },
      });

      return {
        success: true,
        message: "Profile updated",
      };
    }),

  updateInterests: protectedProcedure
    .input(
      z.object({
        interests: z
          .array(z.enum(interestValues))
          .length(3, "Choose exactly 3 interests"),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.session.user.id;
      const uniqueInterests = new Set(input.interests);

      if (uniqueInterests.size !== 3) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Choose exactly 3 different interests",
        });
      }

      const now = new Date();
      const cooldownCutoff = new Date(
        now.getTime() - INTEREST_UPDATE_COOLDOWN_MS,
      );
      const updatedUser = await ctx.db.user.updateMany({
        where: {
          id: userId,
          OR: [
            { interestsUpdatedAt: null },
            { interestsUpdatedAt: { lte: cooldownCutoff } },
          ],
        },
        data: {
          interest: input.interests,
          interestsUpdatedAt: now,
        },
      });

      if (updatedUser.count === 0) {
        const currentUser = await ctx.db.user.findUnique({
          where: { id: userId },
          select: { interestsUpdatedAt: true },
        });

        if (!currentUser) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "User not found",
          });
        }

        if (currentUser.interestsUpdatedAt) {
          const nextUpdate = getNextInterestUpdateAt(
            currentUser.interestsUpdatedAt,
          );
          const formattedNextUpdate = nextUpdate.toLocaleString("en-US", {
            dateStyle: "medium",
            timeStyle: "short",
            timeZone: "UTC",
          });

          throw new TRPCError({
            code: "BAD_REQUEST",
            message: `You can change your interests after ${formattedNextUpdate} UTC`,
          });
        }

        throw new TRPCError({
          code: "CONFLICT",
          message: "Interests could not be updated. Please try again",
        });
      }

      return {
        success: true,
        message: "Interests updated",
        nextUpdateAt: getNextInterestUpdateAt(now),
      };
    }),

  editUserPosts: protectedProcedure
    .input(z.object({ postId: z.string().uuid() }))
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.session.user.id;
      const post = await ctx.db.post.findFirst({
        where: {
          id: input.postId,
          userId,
        },
        select: {
          id: true,
          uploadedImages: {
            select: {
              imageId: true,
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

      await ctx.db.$transaction([
        ctx.db.uploadedImage.deleteMany({
          where: { postId: post.id, userId },
        }),
        ctx.db.post.delete({
          where: { id: post.id, userId },
        }),
      ]);

      const imageIds = post.uploadedImages.map((image) => image.imageId);

      if (imageIds.length > 0) {
        try {
          await pinata.files.public.delete(imageIds);
        } catch (error) {
          console.error("Post deleted, but media cleanup failed", {
            postId: post.id,
            reason:
              error instanceof Error
                ? error.message
                : "Unknown media cleanup error",
          });
        }
      }

      return {
        success: true,
        message: "Post removed",
      };
    }),
});
