import { z } from "zod";

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";

export const postRouter = createTRPCRouter({
  createPost: protectedProcedure
    .input(z.object({
      content: z.string().trim().nonempty("Post content cannot be empty")
    }))
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.session.user.id;

      await ctx.db.post.create({
        data: {
          content: input.content,
          userId
        }
      });

      return {
        success: true,
        message: "Create post successfully"
      }
    }),

  getAllPost: publicProcedure
    .query(async ({ ctx }) => {
      return await ctx.db.post.findMany();
    })
});
