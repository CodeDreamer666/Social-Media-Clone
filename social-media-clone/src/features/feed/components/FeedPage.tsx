"use client";

import { useState } from "react";
import Loader from "~/components/shared/Loader";
import ServerError from "~/components/shared/ServerError";
import PostItem from "~/features/posts/components/PostItem";
import { api } from "~/trpc/react";
import DesktopCommentPanel from "~/features/posts/components/DesktopCommentPanel";
import EmptyInterestFeed from "./EmptyInterestFeed";
import InterestPrompt from "./InterestPrompt";

export default function FeedPage() {
    const [selectedCommentPostId, setSelectedCommentPostId] =
        useState<string | null>(null);
    const {
        data: postsData,
        isLoading,
        error
    } = api.post.getAllPost.useQuery();

    const {
        data: currentUser,
        isLoading: isCurrentUserLoading,
        error: currentUserError
    } = api.user.getUserInfo.useQuery();

    if (isLoading || isCurrentUserLoading) return <Loader />;

    if (error || currentUserError || !postsData || !currentUser) return <ServerError />;

    const hasSelectedInterests = currentUser.interest.length === 3;
    const hasNoPostsForSelectedInterests =
        hasSelectedInterests &&
        postsData.length === 0;

    function closeDesktopComments() {
        setSelectedCommentPostId(null);
    }

    return (
        <div className="min-h-screen bg-black py-4">
            {!hasSelectedInterests && <InterestPrompt />}

            {hasNoPostsForSelectedInterests && <EmptyInterestFeed />}

            <ul className="max-lg:mx-auto flex max-w-xl flex-col items-stretch justify-center gap-4 px-4">
                {postsData.map((post) => {
                    return (
                        <PostItem
                            key={post.id}
                            post={post}
                            onOpenDesktopComments={setSelectedCommentPostId}
                        />
                    );
                })}
            </ul>

            {selectedCommentPostId && (
                <DesktopCommentPanel
                    postId={selectedCommentPostId}
                    onClose={closeDesktopComments}
                />
            )}
        </div>
    );
}
