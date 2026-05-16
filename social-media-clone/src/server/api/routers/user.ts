import { z } from "zod";

import {
    createTRPCRouter,
    protectedProcedure,
    publicProcedure,
} from "~/server/api/trpc";

export const userRouter = createTRPCRouter({
    getUserInfo: protectedProcedure
        .query(async ({ ctx }) => {
            const userId = ctx.session.user.id

            return await ctx.db.user.findUnique({
                where: {
                    id: userId
                },
                include: {
                    posts: true
                }
            })
        }),

    // editUserAccountPrivacy: protectedProcedure
    //     .input(z.object({ isPublic: z.boolean() }))
    //     .mutation(async ({ ctx, input }) => {
    //         const userId = ctx.session.user.id

    //         await ctx.db.user.update({
    //             where: {
    //                 id: userId
    //             },
    //             data: {
    //                 isPublic: input.isPublic
    //             }
    //         });

    //         return {
    //             success: true,
    //             message: "Update Account Privacy Successfully"
    //         }
    //     }),

    editUserInfo: protectedProcedure
        .input(z.object({
            username: z.string().trim().nonempty("Username cannot be empty"),
            bio: z.string().trim().nonempty("Bio cannot be empty"),
        }))
        .mutation(async ({ ctx, input }) => {
            const userId = ctx.session.user.id;

            await ctx.db.user.update({
                where: {
                    id: userId
                },
                data: {
                    username: input.username,
                    bio: input.bio,
                }
            });

            return {
                success: true,
                message: "Update Profile Information Successfully"
            }
        }),

    editUserPosts: protectedProcedure
        .input(z.object({ postId: z.string().trim().nonempty() }))
        .mutation(async ({ ctx, input }) => {
            const userId = ctx.session.user.id;

            await ctx.db.post.delete({
                where: {
                    userId,
                    id: input.postId
                }
            });

            await ctx.db.user.update({
                where: {
                    id: userId
                },
                data: {
                    postsCount: {
                        decrement: 1
                    }
                }
            })

            return {
                success: true,
                message: "Delete post successfully"
            }
        })
})