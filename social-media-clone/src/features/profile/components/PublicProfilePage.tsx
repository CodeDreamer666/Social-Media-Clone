"use client";

import { redirect, useParams } from "next/navigation";
import Loader from "~/components/shared/Loader";
import ServerError from "~/components/shared/ServerError";
import StatusMessage from "~/components/shared/StatusMessage";
import useStatusMessage from "~/lib/useStatusMessage";
import { authClient } from "~/server/better-auth/client";
import { api } from "~/trpc/react";
import usePublicProfileConnection from "../hooks/usePublicProfileConnection";
import ProfilePostList from "./ProfilePostList";
import ProfileSummaryCard from "./ProfileSummaryCard";
import PublicProfileConnectionActions from "./PublicProfileConnectionActions";

export default function PublicProfilePage() {
    const params = useParams<{ id: string }>();
    const {
        setIsSuccess,
        setMessage,
        isSuccess,
        message,
        closeMessage
    } = useStatusMessage();

    const {
        data: user,
        isLoading,
        error
    } = api.user.getSelectedUserInfo.useQuery({ userId: params.id });

    const {
        data: currentUser
    } = authClient.useSession();

    const selectedUserId = user && "redirecting" in user ? "" : user?.id ?? "";
    const {
        data: connectionState,
        isLoading: isConnectionLoading,
        error: connectionError
    } = api.connection.connectionBetweenUsers.useQuery({
        userOneId: currentUser?.user.id ?? "",
        userTwoId: selectedUserId,
    });

    const connection = usePublicProfileConnection({
        user: user && !("redirecting" in user) ? user : null,
        connectionState,
        currentUserId: currentUser?.user.id ?? "",
        setMessage,
        setIsSuccess
    });

    if (isLoading || isConnectionLoading) return <Loader />;

    if (error || connectionError || !user || !currentUser) return <ServerError />;

    if ("redirecting" in user) return redirect("/profile");

    const isPrivateProfileLocked =
        !user.isPublic &&
        !connection.isConnected;

    return (
        <div className="min-h-screen bg-black pb-10">
            <section className="max-w-2xl px-4">
                <StatusMessage
                    isSuccess={isSuccess}
                    message={message}
                    closeMessage={closeMessage}
                />

                <ProfileSummaryCard
                    user={user}
                    action={(
                        <PublicProfileConnectionActions
                            userId={user.id}
                            connection={connection}
                        />
                    )}
                />

                {isPrivateProfileLocked ? (
                    <section className="mt-8 rounded-3xl border border-white/[0.06] bg-zinc-900/60 p-6 text-center shadow-[0_8px_30px_rgba(0,0,0,0.35)] backdrop-blur-xl">
                        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-white/5 text-zinc-400">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                strokeWidth={1.5}
                                stroke="currentColor"
                                className="size-6"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M16.5 10.5V6.75a4.5 4.5 0 0 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z"
                                />
                            </svg>
                        </div>

                        <h2 className="mt-4 text-lg font-semibold tracking-tight text-white">
                            Private profile
                        </h2>

                        <p className="mx-auto mt-2 max-w-sm text-[14px] leading-7 text-zinc-500">
                            Connect with this user to see their posts.
                        </p>
                    </section>
                ) : (
                    <ProfilePostList posts={user.posts} />
                )}
            </section>
        </div>
    );
}
