import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { publicUserIdentitySelect } from "~/server/api/userSelections";
import { getConnectionPairKey } from "~/server/permissions";

function isUniqueConstraintError(error: unknown) {
  return (
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    error.code === "P2002"
  );
}

const otherUserInput = z.object({
  userId: z.string().trim().min(1),
});

export const connectionRouter = createTRPCRouter({
  requestConnection: protectedProcedure
    .input(z.object({ responseUserId: z.string().trim().min(1) }))
    .mutation(async ({ input, ctx }) => {
      const requestUserId = ctx.session.user.id;
      const responseUserId = input.responseUserId;

      if (requestUserId === responseUserId) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "You cannot connect with yourself",
        });
      }

      const responseUser = await ctx.db.user.findUnique({
        where: { id: responseUserId },
        select: { id: true },
      });

      if (!responseUser) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "User not found",
        });
      }

      const pairKey = getConnectionPairKey(requestUserId, responseUserId);

      const existingConnection = await ctx.db.connection.findUnique({
        where: { pairKey },
        select: { status: true },
      });

      if (existingConnection) {
        throw new TRPCError({
          code: "CONFLICT",
          message:
            existingConnection.status === "ACCEPTED"
              ? "You are already connected"
              : "A connection request already exists",
        });
      }

      try {
        await ctx.db.connection.create({
          data: {
            requestUserId,
            responseUserId,
            pairKey,
          },
        });
      } catch (error) {
        if (isUniqueConstraintError(error)) {
          throw new TRPCError({
            code: "CONFLICT",
            message: "A connection already exists",
          });
        }

        throw error;
      }

      return { success: true };
    }),

  connectionWithUser: protectedProcedure
    .input(otherUserInput)
    .query(async ({ ctx, input }) => {
      const currentUserId = ctx.session.user.id;

      if (input.userId === currentUserId) {
        return null;
      }

      const connection = await ctx.db.connection.findUnique({
        where: {
          pairKey: getConnectionPairKey(currentUserId, input.userId),
        },
        select: {
          status: true,
          requestUserId: true,
        },
      });

      if (!connection) {
        return null;
      }

      return {
        status: connection.status,
        direction:
          connection.requestUserId === currentUserId
            ? ("OUTGOING" as const)
            : ("INCOMING" as const),
      };
    }),

  userRequestConnections: protectedProcedure.query(async ({ ctx }) => {
    return ctx.db.connection.findMany({
      where: {
        requestUserId: ctx.session.user.id,
        status: "PENDING",
      },
      select: {
        id: true,
        requestUserId: true,
        responseUserId: true,
        createdAt: true,
        responseUser: {
          select: publicUserIdentitySelect,
        },
      },
      orderBy: [{ createdAt: "desc" }, { id: "desc" }],
    });
  }),

  userReceivedConnections: protectedProcedure.query(async ({ ctx }) => {
    return ctx.db.connection.findMany({
      where: {
        responseUserId: ctx.session.user.id,
        status: "PENDING",
      },
      select: {
        id: true,
        requestUserId: true,
        responseUserId: true,
        createdAt: true,
        requestUser: {
          select: publicUserIdentitySelect,
        },
      },
      orderBy: [{ createdAt: "desc" }, { id: "desc" }],
    });
  }),

  userConnections: protectedProcedure.query(async ({ ctx }) => {
    const userId = ctx.session.user.id;

    return ctx.db.connection.findMany({
      where: {
        status: "ACCEPTED",
        OR: [{ requestUserId: userId }, { responseUserId: userId }],
      },
      select: {
        id: true,
        requestUserId: true,
        responseUserId: true,
        updatedAt: true,
        responseUser: {
          select: publicUserIdentitySelect,
        },
        requestUser: {
          select: publicUserIdentitySelect,
        },
      },
      orderBy: [{ updatedAt: "desc" }, { id: "desc" }],
    });
  }),

  disconnectConnection: protectedProcedure
    .input(z.object({ connectedUserId: z.string().trim().min(1) }))
    .mutation(async ({ input, ctx }) => {
      const userId = ctx.session.user.id;

      if (input.connectedUserId === userId) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "You cannot disconnect from yourself",
        });
      }

      const disconnectedConnection = await ctx.db.connection.deleteMany({
        where: {
          pairKey: getConnectionPairKey(userId, input.connectedUserId),
          status: "ACCEPTED",
        },
      });

      if (disconnectedConnection.count === 0) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Connection not found",
        });
      }

      return { success: true };
    }),

  cancelConnectionRequest: protectedProcedure
    .input(z.object({ responseUserId: z.string().trim().min(1) }))
    .mutation(async ({ input, ctx }) => {
      const userId = ctx.session.user.id;

      if (userId === input.responseUserId) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "You cannot cancel a self-request",
        });
      }

      const cancelledRequest = await ctx.db.connection.deleteMany({
        where: {
          pairKey: getConnectionPairKey(userId, input.responseUserId),
          requestUserId: userId,
          responseUserId: input.responseUserId,
          status: "PENDING",
        },
      });

      if (cancelledRequest.count === 0) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Connection request not found",
        });
      }

      return { success: true };
    }),

  rejectConnectionRequest: protectedProcedure
    .input(z.object({ requestUserId: z.string().trim().min(1) }))
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.session.user.id;

      if (userId === input.requestUserId) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "You cannot reject a self-request",
        });
      }

      const rejectedRequest = await ctx.db.connection.deleteMany({
        where: {
          pairKey: getConnectionPairKey(userId, input.requestUserId),
          responseUserId: userId,
          requestUserId: input.requestUserId,
          status: "PENDING",
        },
      });

      if (rejectedRequest.count === 0) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Connection request not found",
        });
      }

      return { success: true };
    }),

  acceptConnectionRequest: protectedProcedure
    .input(z.object({ requestUserId: z.string().trim().min(1) }))
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.session.user.id;

      if (userId === input.requestUserId) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "You cannot accept a self-request",
        });
      }

      const acceptedRequest = await ctx.db.connection.updateMany({
        where: {
          pairKey: getConnectionPairKey(userId, input.requestUserId),
          responseUserId: userId,
          requestUserId: input.requestUserId,
          status: "PENDING",
        },
        data: {
          status: "ACCEPTED",
        },
      });

      if (acceptedRequest.count === 0) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Connection request not found",
        });
      }

      return { success: true };
    }),
});
