"use client";

import Loader from "~/components/shared/Loader";
import ServerError from "~/components/shared/ServerError";
import StatusMessage from "~/components/shared/StatusMessage";
import useStatusMessage from "~/lib/useStatusMessage";
import { api } from "~/trpc/react";
import ProfilePostList from "./ProfilePostList";
import ProfileSummaryCard from "./ProfileSummaryCard";

export default function ProfilePage() {
    const {
        data: currentUser,
        isLoading,
        error
    } = api.user.getUserInfo.useQuery();

    const {
        isSuccess,
        message,
        closeMessage
    } = useStatusMessage();

    if (isLoading) return <Loader />;

    if (error || !currentUser) return <ServerError />;

    return (
        <div className="min-h-screen bg-black pb-10">
            <section className="max-w-2xl px-4">
                <StatusMessage
                    closeMessage={closeMessage}
                    isSuccess={isSuccess}
                    message={message}
                />

                <ProfileSummaryCard
                    user={currentUser}
                    showEditLink
                />

                <ProfilePostList
                    posts={currentUser.posts}
                    showCreateLink
                />
            </section>
        </div>
    );
}
