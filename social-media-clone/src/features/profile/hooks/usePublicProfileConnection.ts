"use client";

import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import type { RouterOutputs } from "~/trpc/react";
import handleTRPCError from "~/lib/handleTRPCError";
import { api } from "~/trpc/react";

type ConnectionState = RouterOutputs["connection"]["connectionWithUser"];

type UsePublicProfileConnectionProps = {
  user: { id: string } | null;
  connectionState: ConnectionState | undefined;
  setMessage: React.Dispatch<React.SetStateAction<string>>;
  setIsSuccess: React.Dispatch<React.SetStateAction<boolean | "IDLE">>;
};

export default function usePublicProfileConnection({
  user,
  connectionState,
  setMessage,
  setIsSuccess,
}: UsePublicProfileConnectionProps) {
  const router = useRouter();
  const pathname = usePathname();
  const utils = api.useUtils();
  const [buttonState, setButtonState] = useState<
    "IDLE" | "SENT" | "PENDING" | "LOADING"
  >("IDLE");

  async function invalidateConnectionQueries() {
    await Promise.all([
      utils.connection.connectionWithUser.invalidate(),
      utils.connection.userReceivedConnections.invalidate(),
      utils.connection.userRequestConnections.invalidate(),
      utils.connection.userConnections.invalidate(),
      utils.user.getSelectedUserInfo.invalidate(),
      utils.post.getAllPost.invalidate(),
      utils.post.getSelectedPost.invalidate(),
    ]);
  }

  const requestConnection = api.connection.requestConnection.useMutation({
    onMutate: () => {
      setButtonState("LOADING");
    },

    onSuccess: () => {
      setButtonState("SENT");

      setTimeout(() => {
        setButtonState("PENDING");
      }, 2000);
    },

    onError: (error) => {
      setButtonState("IDLE");
      handleTRPCError({
        error,
        setMessage,
        setIsSuccess,
        router,
        pathname,
      });
    },

    onSettled: async () => {
      await invalidateConnectionQueries();
    },
  });

  const acceptConnectionRequest =
    api.connection.acceptConnectionRequest.useMutation({
      onSuccess: () => {
        setButtonState("IDLE");
      },

      onError: (error) => {
        handleTRPCError({
          error,
          setMessage,
          setIsSuccess,
          router,
          pathname,
        });
      },

      onSettled: async () => {
        await invalidateConnectionQueries();
      },
    });

  const rejectConnectionRequest =
    api.connection.rejectConnectionRequest.useMutation({
      onSuccess: () => {
        setButtonState("IDLE");
      },

      onError: (error) => {
        handleTRPCError({
          error,
          setMessage,
          setIsSuccess,
          router,
          pathname,
        });
      },

      onSettled: async () => {
        await invalidateConnectionQueries();
      },
    });

  const hasReceivedPendingRequest =
    Boolean(user) &&
    connectionState?.status === "PENDING" &&
    connectionState.direction === "INCOMING";

  const hasSentPendingRequest =
    buttonState === "SENT" ||
    buttonState === "PENDING" ||
    (connectionState?.status === "PENDING" &&
      connectionState.direction === "OUTGOING");

  const isConnected = connectionState?.status === "ACCEPTED";

  return {
    buttonState,
    requestConnection,
    acceptConnectionRequest,
    rejectConnectionRequest,
    hasReceivedPendingRequest,
    hasSentPendingRequest,
    isConnected,
  };
}
