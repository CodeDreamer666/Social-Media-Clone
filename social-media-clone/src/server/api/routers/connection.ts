import {
    createTRPCRouter,
    protectedProcedure,
    publicProcedure,
} from "~/server/api/trpc";
import { z } from "zod"
import { TRPCError } from "@trpc/server";

export const connectionRouter = createTRPCRouter({
    requestConnecction: protectedProcedure
        .input(z.object({
            responseUserId: z.string().nonempty()
        }))
        .mutation(async ({ input, ctx }) => {
            const requestUserId = ctx.session.user.id;

            await ctx.db.connection.create({
                data: {
                    requestUserId,
                    responseUserId: input.responseUserId
                }
            });

            return { success: true }
        }),

    connectionBetweenTwoUser: protectedProcedure
        .input(z.object({
            userOneId: z.string(),
            userTwoId: z.string()
        }))
        .query(async ({ ctx, input }) => {
            const connectionOne = await ctx.db.connection.findUnique({
                where: {
                    requestUserId_responseUserId: {
                        requestUserId: input.userOneId,
                        responseUserId: input.userTwoId,
                    },
                },
            });

            const connectionTwo = await ctx.db.connection.findUnique({
                where: {
                    requestUserId_responseUserId: {
                        requestUserId: input.userTwoId,
                        responseUserId: input.userOneId,
                    },
                },
            });

            return connectionOne ?? connectionTwo ?? null;
        }),

    userRequestConnections: protectedProcedure
        .query(async ({ ctx, input }) => {
            const userId = ctx.session.user.id;

            const requests = await ctx.db.connection.findMany({
                where: {
                    requestUserId: userId
                },
                include: {
                    requestUser: true,
                    responseUser: true
                }
            });

            return requests
        }),

    userReceivedConnections: protectedProcedure
        .query(async ({ input, ctx }) => {
            const userId = ctx.session.user.id;

            const receivedConnections = await ctx.db.connection.findMany({
                where: {
                    responseUserId: userId
                },
                include: {
                    responseUser: true,
                    requestUser: true
                }
            });

            return receivedConnections
        }),

    userConnections: protectedProcedure
        .query(async ({ input, ctx }) => {
            const userId = ctx.session.user.id;

            const connections = await ctx.db.connection.findMany({
                where: {
                    requestUserId: userId,
                    status: "ACCEPTED"
                },
                include: {
                    responseUser: true,
                    requestUser: true
                }
            });

            return connections;
        })


})