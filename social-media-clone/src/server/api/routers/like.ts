import { TRPCError } from "@trpc/server";
import { z } from "zod";

import {
    createTRPCRouter,
    protectedProcedure,
    publicProcedure,
} from "~/server/api/trpc";

export const likeRouter = createTRPCRouter({
    changePostLikeState: protectedProcedure.
        input(z.object({
            isLike: z.boolean(),
            postId: z.string().trim().nonempty()
        }))
        .mutation(async ({ ctx, input }) => {
            const userId = ctx.session.user.id;

            const post = await ctx.db.post.findUnique({
                where: {
                    id: input.postId
                }
            });

            if (!post) throw new TRPCError({
                code: "BAD_REQUEST",
                message: "Post not found"
            });

            await ctx.db.$transaction(async (tx) => {
                if (input.isLike) {
                    await tx.like.upsert({
                        where: {
                            userId_postId: {
                                userId,
                                postId: input.postId
                            }
                        },
                        create: {
                            userId,
                            postId: input.postId
                        },
                        update: {}
                    });
                } else {
                    await tx.like.deleteMany({
                        where: {
                            userId,
                            postId: input.postId
                        }
                    });
                }

                await tx.post.update({
                    where: {
                        id: input.postId,
                    },
                    data: {
                        likeCount: await tx.like.count({
                            where: {
                                postId: input.postId
                            }
                        })
                    }
                })
            })

            return { success: true }
        })
})