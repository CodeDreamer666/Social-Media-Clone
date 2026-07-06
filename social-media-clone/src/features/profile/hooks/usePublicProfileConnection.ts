"use client";

import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import type { RouterOutputs } from "~/trpc/react";
import handleTRPCError from "~/lib/handleTRPCError";
import { api } from "~/trpc/react";

type ConnectionState = RouterOutputs["connection"]["connectionBetweenUsers"];

type UsePublicProfileConnectionProps = {
    user: { id: string } | null;
    connectionState: ConnectionState | undefined;
    currentUserId: string;
    setMessage: React.Dispatch<React.SetStateAction<string>>;
    setIsSuccess: React.Dispatch<React.SetStateAction<boolean | "IDLE">>;
};

export default function usePublicProfileConnection({
    user,
    connectionState,
    currentUserId,
    setMessage,
    setIsSuccess
}: UsePublicProfileConnectionProps) {
    const router = useRouter();
    const pathname = usePathname();
    const utils = api.useUtils();
    const [buttonState, setButtonState] = useState<"IDLE" | "SENT" | "PENDING" | "LOADING">("IDLE");

    async function invalidateConnectionQueries() {
        await utils.connection.connectionBetweenUsers.invalidate();
        await utils.connection.userReceivedConnections.invalidate();
        await utils.connection.userRequestConnections.invalidate();
        await utils.connection.userConnections.invalidate();
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
                pathname
            });
        },

        onSettled: async () => {
            await invalidateConnectionQueries();
        },
    });

    const acceptConnectionRequest = api.connection.acceptConnectionRequest.useMutation({
        onSuccess: () => {
            setButtonState("IDLE");
        },

        onError: (error) => {
            handleTRPCError({
                error,
                setMessage,
                setIsSuccess,
                router,
                pathname
            });
        },

        onSettled: async () => {
            await invalidateConnectionQueries();
        },
    });

    const rejectConnectionRequest = api.connection.rejectConnectionRequest.useMutation({
        onSuccess: () => {
            setButtonState("IDLE");
        },

        onError: (error) => {
            handleTRPCError({
                error,
                setMessage,
                setIsSuccess,
                router,
                pathname
            });
        },

        onSettled: async () => {
            await invalidateConnectionQueries();
        },
    });

    const hasReceivedPendingRequest =
        Boolean(user) &&
        connectionState?.status === "PENDING" &&
        connectionState.requestUserId === user?.id;

    const hasSentPendingRequest =
        buttonState === "SENT" ||
        buttonState === "PENDING" ||
        (
            connectionState?.status === "PENDING" &&
            connectionState.requestUserId === currentUserId
        );

    const isConnected = connectionState?.status === "ACCEPTED";

    return {
        buttonState,
        requestConnection,
        acceptConnectionRequest,
        rejectConnectionRequest,
        hasReceivedPendingRequest,
        hasSentPendingRequest,
        isConnected
    };
}
