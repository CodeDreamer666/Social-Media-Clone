"use client";

import { usePathname, useRouter } from "next/navigation";
import handleTRPCError from "~/lib/handleTRPCError";
import useStatusMessage from "~/lib/useStatusMessage";
import { api } from "~/trpc/react";

export default function useConnectionsPage() {
  const statusMessage = useStatusMessage();
  const { setIsSuccess, setMessage } = statusMessage;

  const utils = api.useUtils();
  const router = useRouter();
  const pathname = usePathname();

  const requestsQuery = api.connection.userRequestConnections.useQuery();
  const receivedConnectionsQuery =
    api.connection.userReceivedConnections.useQuery();
  const connectionsQuery = api.connection.userConnections.useQuery();
  const currentUserQuery = api.user.getUserInfo.useQuery();

  const currentUser = currentUserQuery.data;

  const cancelConnection = api.connection.cancelConnectionRequest.useMutation({
    onMutate: async (input) => {
      await utils.connection.userRequestConnections.cancel();

      const previousRequests =
        utils.connection.userRequestConnections.getData();

      utils.connection.userRequestConnections.setData(undefined, (old) => {
        if (!old) return old;

        return old.filter(
          (request) => request.responseUserId !== input.responseUserId,
        );
      });

      return {
        previousRequests,
      };
    },

    onError: (error, input, context) => {
      if (context?.previousRequests) {
        utils.connection.userRequestConnections.setData(
          undefined,
          context.previousRequests,
        );
      }

      handleTRPCError({
        error,
        setMessage,
        setIsSuccess,
        router,
        pathname,
      });
    },

    onSettled: async () => {
      await utils.invalidate();
    },
  });

  const rejectConnectionRequest =
    api.connection.rejectConnectionRequest.useMutation({
      onMutate: async (input) => {
        await utils.connection.userReceivedConnections.cancel();

        const previousRequests =
          utils.connection.userReceivedConnections.getData();

        utils.connection.userReceivedConnections.setData(undefined, (old) => {
          if (!old || !currentUser) return old;

          return old.filter(
            (request) =>
              !(
                request.requestUserId === input.requestUserId &&
                request.responseUserId === currentUser.id
              ),
          );
        });

        return {
          previousRequests,
        };
      },

      onError: (error, input, context) => {
        if (context?.previousRequests) {
          utils.connection.userReceivedConnections.setData(
            undefined,
            context.previousRequests,
          );
        }

        handleTRPCError({
          error,
          setMessage,
          setIsSuccess,
          router,
          pathname,
        });
      },

      onSettled: async () => {
        await utils.invalidate();
      },
    });

  const acceptConnectionRequest =
    api.connection.acceptConnectionRequest.useMutation({
      onMutate: async (input) => {
        await utils.connection.userReceivedConnections.cancel();

        const previousRequests =
          utils.connection.userReceivedConnections.getData();

        utils.connection.userReceivedConnections.setData(undefined, (old) => {
          if (!old || !currentUser) return old;

          return old.map((connection) => {
            if (
              connection.requestUserId === input.requestUserId &&
              connection.responseUserId === currentUser.id
            ) {
              return {
                ...connection,
                status: "ACCEPTED",
              };
            }

            return connection;
          });
        });

        return {
          previousRequests,
        };
      },

      onError: (error, input, context) => {
        if (context?.previousRequests) {
          utils.connection.userReceivedConnections.setData(
            undefined,
            context.previousRequests,
          );
        }

        handleTRPCError({
          error,
          setMessage,
          setIsSuccess,
          router,
          pathname,
        });
      },

      onSettled: async () => {
        await utils.invalidate();
      },
    });

  const disconnectConnection = api.connection.disconnectConnection.useMutation({
    onMutate: async (input) => {
      await utils.connection.userConnections.cancel();

      const previousConnections = utils.connection.userConnections.getData();

      utils.connection.userConnections.setData(undefined, (old) => {
        if (!old || !currentUser) return old;

        return old.filter((connection) => {
          const isConnectionWithUser =
            (connection.requestUserId === currentUser.id &&
              connection.responseUserId === input.connectedUserId) ||
            (connection.requestUserId === input.connectedUserId &&
              connection.responseUserId === currentUser.id);

          return !isConnectionWithUser;
        });
      });

      return {
        previousConnections,
      };
    },

    onError: (error, input, context) => {
      if (context?.previousConnections) {
        utils.connection.userConnections.setData(
          undefined,
          context.previousConnections,
        );
      }

      handleTRPCError({
        error,
        setMessage,
        setIsSuccess,
        router,
        pathname,
      });
    },

    onSettled: async () => {
      await utils.invalidate();
    },
  });

  return {
    statusMessage,
    requestsQuery,
    receivedConnectionsQuery,
    connectionsQuery,
    currentUserQuery,
    cancelConnection,
    rejectConnectionRequest,
    acceptConnectionRequest,
    disconnectConnection,
  };
}
