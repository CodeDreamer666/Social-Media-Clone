"use client"
import useTimeAgo from "~/app/hooks/useTimeAgo"
import { api } from "~/trpc/react"
import Link from "next/link"
import { TRPCClientError } from "@trpc/client"
import { useRouter, usePathname } from "next/navigation"
import { useState } from "react"
import { authClient } from "~/server/better-auth/client"
import StatusMessage from "~/app/components/shared/StatusMessage"
import useStatusMessage from "~/app/hooks/useStatusMessage"
import type { SinglePost, User } from "~/app/types/types"
import LikeIcon from "~/app/components/shared/LikeIcon"
import CommentIcon from "~/app/components/shared/CommentIcon"
import ServerError from "~/app/components/shared/ServerError"
import Loader from "~/app/components/shared/Loader"
import MakeCommentModal from "../comments/MakeCommentModal"

type Post = {
    post: SinglePost
}

export default function PostView({
    post,
}: Post) {
    const [isOpen, setIsOpen] = useState(false);
    const router = useRouter();
    const pathname = usePathname();
    const {
        isSuccess,
        message,
        setIsSuccess,
        setMessage,
        closeMessage
    } = useStatusMessage();
    
    const { data: currentUser, isLoading, error } = api.user.getUserInfo.useQuery();

    const postTimeAgo = useTimeAgo(new Date(post.createdAt));

    if (isLoading) return <Loader />

    if (error) return <ServerError />

    let isLike = post.likes.some((like) => {
        return like.postId === post.id && like.userId === currentUser?.id
    })

    return (
        <>
            <StatusMessage
                message={message}
                isSuccess={isSuccess}
                closeMessage={closeMessage}
            />

            <section
                className="w-full max-w-112.5 mt-4 mx-auto rounded-2xl border border-neutral-800 bg-neutral-900 p-5"
            >

                <Link href={`/profile/${post.user.id}`}>
                    <div className="flex items-center gap-3">
                        <div className="flex h-11 w-11 items-center justify-center rounded-full bg-sky-500 font-semibold text-white">
                            {post.user.name[0]?.toUpperCase()}
                        </div>

                        <div>
                            <h2 className="text-lg font-semibold text-white">
                                {post.user.name}
                            </h2>

                            <p className="text-sm text-neutral-400">
                                {`${post.user.username}`} • {postTimeAgo}
                            </p>
                        </div>
                    </div>
                </Link>

                <p className="mt-4 leading-7 text-neutral-200">
                    {post.content}
                </p>

                <div className="mt-5 flex items-center gap-6 border-t border-neutral-800 pt-4">
                    <LikeIcon
                        postLikeCount={post.likeCount}
                        setIsSuccess={setIsSuccess}
                        setMessage={setMessage}
                        isLike={isLike}
                        postId={post.id}
                        currentUserId={currentUser?.id}
                    />

                    <CommentIcon
                        postCommentCount={post.commentCount}
                        postId={post.id}
                    />
                </div>
            </section>

            <section className="mx-auto mt-6 w-full max-w-112.5">
                <div className="mb-5 flex items-center justify-between">
                    <h2 className="text-lg font-semibold text-white">
                        Comments
                    </h2>
                    <button
                        onClick={() => setIsOpen(true)}
                        className="h-10 disabled:bg-neutral-800 disabled:text-neutral-500 disabled:hover:bg-neutral-800 disabled:cursor-not-allowed cursor-pointer rounded-xl bg-sky-500 px-5 text-sm font-medium text-white transition-colors duration-200 hover:bg-sky-400"
                    >
                        Make a comment
                    </button>
                </div>

                <div className="flex flex-col gap-4">
                    <div className="flex gap-3 rounded-2xl border border-neutral-800 bg-neutral-900 p-4">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-sky-500 text-sm font-medium text-white">
                            S
                        </div>
                        <div className="min-w-0 flex-1">
                            <div className="flex flex-wrap items-center gap-2">
                                <h3 className="text-sm font-medium text-white">
                                    Sophia Lee
                                </h3>
                                <p className="text-xs text-neutral-500">
                                    @sophial • 2h
                                </p>
                            </div>
                            <p className="mt-2 text-sm leading-7 text-neutral-200">
                                The spacing and typography here honestly look really clean.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {isOpen && (
                <MakeCommentModal
                    setIsSuccess={setIsSuccess}
                    setMessage={setMessage}
                    currentUser={currentUser as User}
                    post={post}
                    setIsOpen={setIsOpen}
                />
            )}
        </>
    )
}