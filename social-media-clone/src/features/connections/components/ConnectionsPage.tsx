"use client";

import { useState } from "react";
import Loader from "~/components/shared/Loader";
import ServerError from "~/components/shared/ServerError";
import StatusMessage from "~/components/shared/StatusMessage";
import useConnectionsPage from "../hooks/useConnectionsPage";
import ConnectionSection from "./ConnectionSection";
import ConnectionUserRow from "./ConnectionUserRow";
import DisconnectConfirmationModal from "./DisconnectConfirmationModal";

type PendingDisconnectUser = {
    id: string;
    name: string;
};

export default function ConnectionsPage() {
    const [pendingDisconnectUser, setPendingDisconnectUser] =
        useState<PendingDisconnectUser | null>(null);
    const {
        statusMessage,
        requestsQuery,
        receivedConnectionsQuery,
        connectionsQuery,
        currentUserQuery,
        cancelConnection,
        rejectConnectionRequest,
        acceptConnectionRequest,
        disconnectConnection
    } = useConnectionsPage();

    const requests = requestsQuery.data;
    const receivedConnections = receivedConnectionsQuery.data;
    const connections = connectionsQuery.data;
    const currentUser = currentUserQuery.data;

    if (
        requestsQuery.isLoading ||
        receivedConnectionsQuery.isLoading ||
        connectionsQuery.isLoading ||
        currentUserQuery.isLoading
    ) {
        return <Loader />;
    }

    if (
        requestsQuery.error ||
        receivedConnectionsQuery.error ||
        connectionsQuery.error ||
        currentUserQuery.error ||
        !currentUser
    ) {
        return <ServerError />;
    }

    return (
        <div className="min-h-screen bg-black pb-10 lg:px-8 lg:py-8">
            <StatusMessage
                isSuccess={statusMessage.isSuccess}
                message={statusMessage.message}
                closeMessage={statusMessage.closeMessage}
            />

            <section className="mx-auto max-w-7xl px-4">
                <section className="mb-6">
                    <h1 className="text-2xl font-semibold tracking-tight text-white">
                        Connections
                    </h1>
                    <p className="mt-2 text-[13px] text-zinc-500">
                        Manage who you are connected with.
                    </p>
                </section>

                <div className="flex flex-col gap-6">
                    <ConnectionSection
                        title="Received requests"
                        emptyText="No received requests"
                        hasItems={Boolean(receivedConnections?.length)}
                    >
                        {receivedConnections?.map((connection) => {
                            return (
                                <ConnectionUserRow
                                    key={connection.id}
                                    href={`/profile/${connection.requestUserId}`}
                                    user={connection.requestUser}
                                    actions={(
                                        <>
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    acceptConnectionRequest.mutate({
                                                        requestUserId: connection.requestUserId
                                                    });
                                                }}
                                                className={[
                                                    "flex h-10 cursor-pointer items-center justify-center rounded-full",
                                                    "bg-gradient-to-br from-blue-500 to-indigo-600 px-5",
                                                    "text-[14px] font-medium text-white shadow-md shadow-blue-500/20",
                                                    "transition-all duration-200 hover:brightness-110 active:scale-[0.99]",
                                                ].join(" ")}
                                            >
                                                Accept
                                            </button>

                                            <button
                                                type="button"
                                                onClick={() => {
                                                    rejectConnectionRequest.mutate({
                                                        requestUserId: connection.requestUserId
                                                    });
                                                }}
                                                className={[
                                                    "flex h-10 cursor-pointer items-center justify-center rounded-full",
                                                    "border border-white/[0.08] bg-white/5 px-5",
                                                    "text-[14px] font-medium text-white transition-colors duration-200",
                                                    "hover:bg-white/10 active:scale-[0.99]",
                                                ].join(" ")}
                                            >
                                                Decline
                                            </button>
                                        </>
                                    )}
                                />
                            );
                        })}
                    </ConnectionSection>

                    <ConnectionSection
                        title="Sent requests"
                        emptyText="0 sent requests"
                        hasItems={Boolean(requests?.length)}
                    >
                        {requests?.map((request) => {
                            return (
                                <ConnectionUserRow
                                    key={request.id}
                                    href={`/profile/${request.responseUserId}`}
                                    user={request.responseUser}
                                    actions={(
                                        <button
                                            type="button"
                                            onClick={() => {
                                                cancelConnection.mutate({
                                                    responseUserId: request.responseUser.id
                                                });
                                            }}
                                            className={[
                                                "flex h-10 cursor-pointer items-center justify-center rounded-full",
                                                "border border-white/[0.08] bg-white/5 px-5",
                                                "text-[14px] font-medium text-white transition-colors duration-200",
                                                "hover:bg-white/10 active:scale-[0.99]",
                                            ].join(" ")}
                                        >
                                            Cancel request
                                        </button>
                                    )}
                                />
                            );
                        })}
                    </ConnectionSection>

                    <ConnectionSection
                        title="Connected people"
                        emptyText="No connections yet."
                        hasItems={Boolean(connections?.length)}
                    >
                        {connections?.map((connection) => {
                            const connectedUser =
                                connection.requestUserId === currentUser.id
                                    ? connection.responseUser
                                    : connection.requestUser;

                            return (
                                <ConnectionUserRow
                                    key={connection.id}
                                    href={`/profile/${connectedUser.id}`}
                                    user={connectedUser}
                                    actions={(
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setPendingDisconnectUser({
                                                    id: connectedUser.id,
                                                    name: connectedUser.name
                                                });
                                            }}
                                            className={[
                                                "flex h-10 cursor-pointer items-center justify-center rounded-full",
                                                "border border-red-500/20 bg-red-500/10 px-5",
                                                "text-[14px] font-medium text-red-200 transition-colors duration-200",
                                                "hover:bg-red-500/15 active:scale-[0.99]",
                                            ].join(" ")}
                                        >
                                            Disconnect
                                        </button>
                                    )}
                                />
                            );
                        })}
                    </ConnectionSection>
                </div>
            </section>

            {pendingDisconnectUser && (
                <DisconnectConfirmationModal
                    userName={pendingDisconnectUser.name}
                    isPending={disconnectConnection.isPending}
                    onCancel={() => {
                        setPendingDisconnectUser(null);
                    }}
                    onConfirm={() => {
                        disconnectConnection.mutate(
                            {
                                connectedUserId: pendingDisconnectUser.id
                            },
                            {
                                onSuccess: () => {
                                    setPendingDisconnectUser(null);
                                }
                            }
                        );
                    }}
                />
            )}
        </div>
    );
}
