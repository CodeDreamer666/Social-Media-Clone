"use client"
import { api } from "~/trpc/react"
import { useState } from "react"
import { useParams, useRouter, usePathname } from "next/navigation"
import StatusMessage from "~/app/components/shared/StatusMessage"
import useStatusMessage from "~/app/hooks/useStatusMessage"
import Comment from "~/app/components/comments/Comment"
import ServerError from "~/app/components/shared/ServerError"
import Loader from "~/app/components/shared/Loader"
import handleTRPCError from "~/app/libs/handleTRPCError"
import PostItem from "~/app/components/posts/PostItem"
import { updatePostLike } from "~/app/libs/likeUpdater"

export default function Page() {
    const [isOpen, setIsOpen] = useState(false);
    const [commentContent, setCommentContent] = useState("");
    const utils = api.useUtils();
    const router = useRouter();
    const pathname = usePathname();
    const params = useParams<{ postId: string }>()
    const {
        isSuccess,
        message,
        setIsSuccess,
        setMessage,
        closeMessage
    } = useStatusMessage();

    const {
        data: selectedPost,
        isLoading: isSelectedPostLoading,
        error: selectedPostError
    } = api.post.getSelectedPost.useQuery({ postId: params.postId });

    const {
        data: currentUser,
        isLoading: isCurrentUserLoading,
        error: currentUserError
    } = api.user.getUserInfo.useQuery();

    // Like or unlike post
    const changePostLikeState = api.like.changePostLikeState.useMutation({
        onMutate: async (newData) => {
            await utils.post.getSelectedPost.cancel({ postId: params.postId });

            const previousInfo = utils.post.getSelectedPost.getData({ postId: params.postId });

            utils.post.getSelectedPost.setData({ postId: params.postId }, (old) => {
                if (!old || !currentUser) return old;

                return updatePostLike(old, {
                    currentUserId: currentUser.id,
                    isLike: newData.isLike,
                    postId: newData.postId
                })

            });

            return { previousInfo };
        },

        onError: (error, newData, context) => {
            if (context?.previousInfo) {
                utils.post.getSelectedPost.setData({ postId: params.postId }, context.previousInfo);
            }

            handleTRPCError({
                error, setMessage, setIsSuccess, router, pathname
            })
        },

        onSettled: async () => {
            await utils.invalidate()
        }
    });

    // Create comment mutation
    const createComment = api.comment.createComment.useMutation({
        onSuccess: () => setIsOpen(false),

        onMutate: async (newData) => {
            await utils.post.getSelectedPost.cancel();

            const previousInfo = utils.post.getSelectedPost.getData({ postId: newData.postId });

            utils.post.getSelectedPost.setData({ postId: newData.postId }, (old) => {
                if (!old || !currentUser?.id) return old;

                return {
                    ...old,
                    comments: [
                        ...old.comments,
                        {
                            user: {
                                name: "",
                                id: crypto.randomUUID(),
                                createdAt: new Date(),
                                updatedAt: new Date(),
                                username: null,
                                bio: "",
                                followersCount: 0,
                                followingCount: 0,
                                postsCount: 0,
                                email: "",
                                emailVerified: true,
                                image: null,
                                isPublic: true,
                            },
                            id: crypto.randomUUID(),
                            userId: currentUser.id,
                            postId: newData.postId,
                            content: newData.commentContent,
                            createdAt: new Date(),
                            updatedAt: new Date()
                        }
                    ]
                }
            });

            return { previousInfo };
        },

        onError: (error, newData, context) => {
            if (context?.previousInfo) {
                utils.post.getSelectedPost.setData({ postId: newData.postId }, context.previousInfo);
            }

            handleTRPCError({
                error, setMessage, setIsSuccess, router, pathname
            })
        },

        onSettled: async () => {
            await utils.invalidate()
        }
    });

    const isLoading = isSelectedPostLoading || isCurrentUserLoading;
    const error = selectedPostError || currentUserError

    if (isLoading) return <Loader />

    if (
        error ||
        !currentUser ||
        !selectedPost
    ) return <ServerError />

    let isLike = selectedPost.likes.some((like) => {
        return like.postId === selectedPost.id && like.userId === currentUser.id
    })

    return (
        <>
            <StatusMessage
                message={message}
                isSuccess={isSuccess}
                closeMessage={closeMessage}
            />

            <PostItem
                post={selectedPost}
                isLike={isLike}
                mutation={changePostLikeState}
                onClickMutation={() => changePostLikeState.mutate({
                    postId: selectedPost.id,
                    isLike: !isLike
                })}
            />

            <section className="mt-6 w-[90%] mx-auto max-w-112.5">
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

                <ul>
                    {selectedPost.comments.map((comment) => {
                        return (
                            <Comment
                                key={comment.id}
                                comment={comment}
                            />
                        )
                    })}
                </ul>
            </section>

            {/* Create comment modal */}
            {isOpen && (
                <>
                    <div className="fixed inset-0 z-9999 flex items-center justify-center bg-black/60 px-4 backdrop-blur-sm">
                        <section className="w-full max-w-2xl rounded-3xl border border-neutral-800 bg-neutral-900 p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h2 className="text-xl font-semibold text-white">
                                        Add Comment
                                    </h2>
                                    <p className="mt-1 text-sm text-neutral-400">
                                        Share your thoughts on this post.
                                    </p>
                                </div>

                                <button
                                    onClick={() => setIsOpen(false)}
                                    className="flex cursor-pointer h-10 w-10 items-center justify-center rounded-full text-neutral-400 transition-colors duration-200 hover:bg-neutral-800 hover:text-white"
                                >
                                    ✕
                                </button>
                            </div>

                            <div className="mt-6 flex items-center gap-3">
                                <div className="flex h-11 w-11 items-center justify-center rounded-full bg-sky-500 text-sm font-semibold text-white">
                                    {currentUser.name[0]?.toUpperCase()}
                                </div>
                                <div>
                                    <h3 className="text-sm font-semibold text-white">
                                        {currentUser.name}
                                    </h3>
                                    <p className="text-xs text-neutral-400">
                                        {currentUser.username ?? `@${currentUser.name.toLowerCase().replace(/\s/g, "")}`}
                                    </p>
                                </div>
                            </div>

                            <textarea
                                value={commentContent}
                                onChange={(event) => setCommentContent(event.target.value)}
                                placeholder="Write a comment..."
                                className="mt-5 h-60 w-full resize-none bg-transparent text-[15px] leading-7 text-white outline-none placeholder:text-neutral-500"
                            />

                            <div className="mt-6 flex items-center justify-between border-t border-neutral-800 pt-4">
                                <p className="text-sm text-neutral-500">
                                    Keep it respectful and meaningful.
                                </p>

                                <button
                                    disabled={createComment.isPending || commentContent === ""}
                                    onClick={() => createComment.mutate({ postId: params.postId, commentContent })}
                                    type="submit"
                                    className="h-11 disabled:hover:bg-neutral-800 cursor-pointer rounded-xl bg-sky-500 px-5 text-sm font-medium text-white transition-colors duration-200 hover:bg-sky-400 disabled:cursor-not-allowed disabled:bg-neutral-800 disabled:text-neutral-500"
                                >
                                    Comment
                                </button>

                            </div>
                        </section>
                    </div>
                </>
            )}
        </>
    )
}