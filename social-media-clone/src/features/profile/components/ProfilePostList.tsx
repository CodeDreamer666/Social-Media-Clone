"use client";

import { useState } from "react";
import CommentIcon from "~/components/shared/CommentIcon";
import DesktopCommentPanel from "~/features/posts/components/DesktopCommentPanel";
import PostImage from "~/features/posts/components/PostImage";
import EmptyPostsCard from "./EmptyPostsCard";

type ProfilePost = {
    id: string;
    content: string;
    imageUrl: string | null;
};

type ProfilePostListProps = {
    posts: ProfilePost[];
    showCreateLink?: boolean;
};

export default function ProfilePostList({
    posts,
    showCreateLink = false
}: ProfilePostListProps) {
    const [selectedCommentPostId, setSelectedCommentPostId] =
        useState<string | null>(null);

    function closeDesktopComments() {
        setSelectedCommentPostId(null);
    }

    return (
        <section className="mt-8">
            <h2 className="mb-4 text-xl font-semibold tracking-tight text-white">
                Posts
            </h2>

            {posts.length === 0 && <EmptyPostsCard showCreateLink={showCreateLink} />}

            <ul className="flex flex-col gap-3">
                {posts.map((post) => {
                    const hasPostText = post.content.trim().length > 0;

                    return (
                        <section
                            key={post.id}
                            className={[
                                "rounded-2xl border border-white/[0.06] bg-zinc-900/60 p-5 backdrop-blur-xl",
                                "transition-colors duration-200 hover:border-white/[0.1]",
                            ].join(" ")}
                        >
                            {hasPostText && (
                                <p className="text-[14px] leading-7 text-zinc-200">
                                    {post.content}
                                </p>
                            )}

                            {post.imageUrl && <PostImage imageUrl={post.imageUrl} />}

                            <div className="mt-4 flex items-center justify-end gap-6 border-t border-white/[0.06] pt-4">
                                <CommentIcon
                                    postId={post.id}
                                    onOpenDesktopComments={setSelectedCommentPostId}
                                />
                            </div>
                        </section>
                    );
                })}
            </ul>

            {selectedCommentPostId && (
                <DesktopCommentPanel
                    postId={selectedCommentPostId}
                    onClose={closeDesktopComments}
                />
            )}
        </section>
    );
}
