import {
    createTRPCRouter,
    protectedProcedure,
} from "~/server/api/trpc";
import { z } from "zod";
import { TRPCError } from "@trpc/server";

function getConnectionPairKey(userOneId: string, userTwoId: string) {
    return [userOneId, userTwoId].sort().join(":");
}

function isUniqueConstraintError(error: unknown) {
    return (
        typeof error === "object" &&
        error !== null &&
        "code" in error &&
        error.code === "P2002"
    );
}

export const connectionRouter = createTRPCRouter({
    requestConnection: protectedProcedure
        .input(z.object({
            responseUserId: z.string().trim().nonempty()
        }))
        .mutation(async ({ input, ctx }) => {
            const requestUserId = ctx.session.user.id;
            const responseUserId = input.responseUserId;
            const pairKey = getConnectionPairKey(requestUserId, responseUserId);

            if (requestUserId === responseUserId) {
                throw new TRPCError({
                    code: "BAD_REQUEST",
                    message: "You cannot connect with yourself"
                });
            }

            const responseUser = await ctx.db.user.findUnique({
                where: {
                    id: responseUserId
                },
                select: {
                    id: true
                }
            });

            if (!responseUser) {
                throw new TRPCError({
                    code: "NOT_FOUND",
                    message: "User not found"
                });
            }

            const existingConnection = await ctx.db.connection.findUnique({
                where: {
                    pairKey
                }
            });

            if (existingConnection?.status === "PENDING") {
                throw new TRPCError({
                    code: "CONFLICT",
                    message: "A connection request already exists"
                });
            }

            if (existingConnection?.status === "ACCEPTED") {
                throw new TRPCError({
                    code: "CONFLICT",
                    message: "You are already connected"
                });
            }

            try {
                await ctx.db.connection.create({
                    data: {
                        requestUserId,
                        responseUserId,
                        pairKey,
                    }
                });
            } catch (error) {
                if (isUniqueConstraintError(error)) {
                    throw new TRPCError({
                        code: "CONFLICT",
                        message: "A connection already exists"
                    });
                }

                throw error;
            }

            return { success: true }
        }),

    connectionBetweenUsers: protectedProcedure
        .input(z.object({
            userOneId: z.string(),
            userTwoId: z.string()
        }))
        .query(async ({ ctx, input }) => {
            if (!input.userOneId || !input.userTwoId) {
                return null;
            }

            const pairKey = getConnectionPairKey(input.userOneId, input.userTwoId);

            const connection = await ctx.db.connection.findUnique({
                where: {
                    pairKey,
                },
            });

            return connection;
        }),

    userRequestConnections: protectedProcedure
        .query(async ({ ctx }) => {
            const userId = ctx.session.user.id;

            const requests = await ctx.db.connection.findMany({
                where: {
                    requestUserId: userId,
                    status: "PENDING",
                },
                include: {
                    requestUser: true,
                    responseUser: true
                }
            });

            return requests
        }),

    userReceivedConnections: protectedProcedure
        .query(async ({ ctx }) => {
            const userId = ctx.session.user.id;

            const receivedConnections = await ctx.db.connection.findMany({
                where: {
                    responseUserId: userId,
                    status: "PENDING",
                },
                include: {
                    responseUser: true,
                    requestUser: true
                }
            });

            return receivedConnections
        }),

    userConnections: protectedProcedure.query(async ({ ctx }) => {
        const userId = ctx.session.user.id;

        const connections = await ctx.db.connection.findMany({
            where: {
                status: "ACCEPTED",
                OR: [
                    {
                        requestUserId: userId,
                    },
                    {
                        responseUserId: userId,
                    },
                ],
            },
            include: {
                responseUser: true,
                requestUser: true,
            },
        });

        return connections;
    }),

    disconnectConnection: protectedProcedure
        .input(z.object({
            connectedUserId: z.string().trim().nonempty()
        }))
        .mutation(async ({ input, ctx }) => {
            const userId = ctx.session.user.id;
            const pairKey = getConnectionPairKey(userId, input.connectedUserId);

            if (input.connectedUserId === userId) {
                throw new TRPCError({
                    code: "BAD_REQUEST",
                    message: "You cannot disconnect from yourself"
                });
            }

            const disconnectedConnection = await ctx.db.connection.deleteMany({
                where: {
                    pairKey,
                    status: "ACCEPTED",
                }
            });

            if (disconnectedConnection.count === 0) {
                throw new TRPCError({
                    code: "NOT_FOUND",
                    message: "Connection not found"
                });
            }

            return { success: true }
        }),

    cancelConnectionRequest: protectedProcedure
        .input(z.object({
            responseUserId: z.string().trim().nonempty()
        }))
        .mutation(async ({ input, ctx }) => {
            const userId = ctx.session.user.id;
            const pairKey = getConnectionPairKey(userId, input.responseUserId);

            if (userId === input.responseUserId) {
                throw new TRPCError({
                    code: "BAD_REQUEST",
                    message: "You cannot cancel a self-request"
                });
            }

            const cancelledRequest = await ctx.db.connection.deleteMany({
                where: {
                    pairKey,
                    requestUserId: userId,
                    responseUserId: input.responseUserId,
                    status: "PENDING",
                }
            });

            if (cancelledRequest.count === 0) {
                throw new TRPCError({
                    code: "NOT_FOUND",
                    message: "Connection request not found"
                });
            }

            return { success: true }
        }),

    rejectConnectionRequest: protectedProcedure
        .input(z.object({
            requestUserId: z.string().trim().nonempty()
        }))
        .mutation(async ({ ctx, input }) => {
            const userId = ctx.session.user.id;
            const pairKey = getConnectionPairKey(userId, input.requestUserId);

            if (userId === input.requestUserId) {
                throw new TRPCError({
                    code: "BAD_REQUEST",
                    message: "You cannot reject a self-request"
                });
            }

            const rejectedRequest = await ctx.db.connection.deleteMany({
                where: {
                    pairKey,
                    responseUserId: userId,
                    requestUserId: input.requestUserId,
                    status: "PENDING",
                }
            });

            if (rejectedRequest.count === 0) {
                throw new TRPCError({
                    code: "NOT_FOUND",
                    message: "Connection request not found"
                });
            }

            return { success: true }
        }),

    acceptConnectionRequest: protectedProcedure
        .input(z.object({
            requestUserId: z.string().trim().nonempty()
        }))
        .mutation(async ({ ctx, input }) => {
            const userId = ctx.session.user.id;
            const pairKey = getConnectionPairKey(userId, input.requestUserId);

            if (userId === input.requestUserId) {
                throw new TRPCError({
                    code: "BAD_REQUEST",
                    message: "You cannot accept a self-request"
                });
            }

            const acceptedRequest = await ctx.db.connection.updateMany({
                where: {
                    pairKey,
                    responseUserId: userId,
                    requestUserId: input.requestUserId,
                    status: "PENDING",
                },
                data: {
                    status: "ACCEPTED"
                }
            });

            if (acceptedRequest.count === 0) {
                throw new TRPCError({
                    code: "NOT_FOUND",
                    message: "Connection request not found"
                });
            }

            return { success: true }
        }),
})
