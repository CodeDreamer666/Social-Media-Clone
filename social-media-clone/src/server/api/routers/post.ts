import { TRPCClientError } from "@trpc/client";
import { TRPCError } from "@trpc/server";
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
                    userId,
                }
            });

            await ctx.db.user.update({
                where: {
                    id: userId
                },
                data: {
                    postsCount: {
                        increment: 1
                    }
                }
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
                    likes: true
                },
                orderBy: {
                    id: "asc"
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
                    likes: true,
                    comments: true
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
