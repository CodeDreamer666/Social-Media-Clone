"use client"
import { api } from "~/trpc/react";
import useStatusMessage from "~/app/hooks/useStatusMessage";
import StatusMessage from "~/app/components/shared/StatusMessage";
import Loader from "~/app/components/shared/Loader";
import ServerError from "~/app/components/shared/ServerError";
import ConnectionCard from "~/app/components/connections/ConnectionCard";

export default function Connections() {
    const {
        setIsSuccess,
        setMessage,
        isSuccess,
        message,
        closeMessage
    } = useStatusMessage();

    const {
        data: requests,
        isLoading,
        error
    } = api.connection.userRequestConnections.useQuery();

    const {
        data: receivedConnections,
        isLoading: isLoadingTwo,
        error: errorTwo
    } = api.connection.userReceivedConnections.useQuery();

    const {
        data: connections,
        isLoading: isLoadingThree,
        error: errorThree
    } = api.connection.userConnections.useQuery();

    if (isLoading || isLoadingTwo || isLoadingThree) return <Loader />

    if (error || errorTwo || errorThree) return <ServerError />

    return (
        <div className="min-h-screen bg-black pb-10">

            <StatusMessage
                isSuccess={isSuccess}
                message={message}
                closeMessage={closeMessage}
            />

            <section className="mx-auto max-w-2xl px-4">
                <section className="mb-6">
                    <h1 className="text-2xl font-semibold tracking-tight text-white">
                        Connections
                    </h1>
                    <p className="mt-2 text-[13px] text-zinc-500">
                        Manage who you are connected with.
                    </p>
                </section>

                <div className="flex flex-col gap-6">
                    <section
                        className={[
                            "rounded-3xl border border-white/[0.06] bg-zinc-900/60 p-6",
                            "shadow-[0_8px_30px_rgba(0,0,0,0.35)] backdrop-blur-xl",
                        ].join(" ")}
                    >
                        <h2 className="mb-4 text-[15px] font-semibold text-white">
                            Received requests
                        </h2>

                        {receivedConnections && receivedConnections.length > 0 ? (
                            <ul className="flex flex-col gap-3">
                                {receivedConnections.map((connection) => (
                                    <ConnectionCard
                                        key={connection.id}
                                        user={connection.requestUser}
                                        primaryAction="Accept"
                                        secondaryAction="Decline"
                                    />
                                ))}
                            </ul>
                        ) : (
                            <div
                                className={[
                                    "rounded-2xl border border-white/[0.06] bg-black/30",
                                    "px-5 py-8 text-center",
                                ].join(" ")}
                            >
                                <p className="text-[14px] text-zinc-500">
                                    No received requests
                                </p>
                            </div>
                        )}
                    </section>

                    <section
                        className={[
                            "rounded-3xl border border-white/[0.06] bg-zinc-900/60 p-6",
                            "shadow-[0_8px_30px_rgba(0,0,0,0.35)] backdrop-blur-xl",
                        ].join(" ")}
                    >
                        <h2 className="mb-4 text-[15px] font-semibold text-white">
                            Sent requests
                        </h2>

                        {requests && requests.length > 0 ? (
                            <ul className="flex flex-col gap-3">
                                {requests.map((request) => (
                                    <ConnectionCard
                                        key={request.id}
                                        user={request.responseUser}
                                        secondaryAction="Cancel request"
                                    />
                                ))}
                            </ul>
                        ) : (
                            <div
                                className={[
                                    "rounded-2xl border border-white/[0.06] bg-black/30",
                                    "px-5 py-8 text-center",
                                ].join(" ")}
                            >
                                <p className="text-[14px] text-zinc-500">
                                    0 sent requests
                                </p>
                            </div>
                        )}
                    </section>

                    <section
                        className={[
                            "rounded-3xl border border-white/[0.06] bg-zinc-900/60 p-6",
                            "shadow-[0_8px_30px_rgba(0,0,0,0.35)] backdrop-blur-xl",
                        ].join(" ")}
                    >
                        <h2 className="mb-4 text-[15px] font-semibold text-white">
                            Connected people
                        </h2>

                        {connections && connections.length > 0 ? (
                            <ul className="flex flex-col gap-3">
                                {connections.map((connection) => (
                                    <ConnectionCard
                                        key={connection.id}
                                        user={connection.responseUser}
                                        dangerAction="Disconnect"
                                    />
                                ))}
                            </ul>
                        ) : (
                            <div
                                className={[
                                    "rounded-2xl border border-white/[0.06] bg-black/30",
                                    "px-5 py-8 text-center",
                                ].join(" ")}
                            >
                                <p className="text-[14px] text-zinc-500">
                                    No connections yet.
                                </p>
                            </div>
                        )}
                    </section>
                </div>
            </section>
        </div>
    )
}
