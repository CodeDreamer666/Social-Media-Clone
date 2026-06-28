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
                                interest: [],
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

    return (
        <>
            <StatusMessage
                message={message}
                isSuccess={isSuccess}
                closeMessage={closeMessage}
            />

            <div className="min-h-screen bg-black pb-10">

                <PostItem
                    post={selectedPost}
                />

                <section className="mt-6 w-[92%] mx-auto max-w-112.5">
                    <div className="mb-4 flex items-center justify-between">
                        <h2 className="text-[15px] font-semibold text-white">
                            Comments
                        </h2>
                        <button
                            onClick={() => setIsOpen(true)}
                            className="h-9 cursor-pointer rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 px-4 text-[13px] font-medium text-white shadow-md shadow-blue-500/20 transition-all duration-200 hover:brightness-110 active:scale-95"
                        >
                            Make a comment
                        </button>
                    </div>

                    <ul className="flex flex-col gap-3">
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
                        <div className="fixed inset-0 z-9999 flex items-center justify-center bg-black/70 px-4 backdrop-blur-sm">
                            <section className="w-full max-w-2xl rounded-3xl border border-white/[0.06] bg-zinc-900/80 p-6 shadow-[0_8px_30px_rgba(0,0,0,0.45)] backdrop-blur-xl">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <h2 className="text-xl font-semibold tracking-tight text-white">
                                            Add comment
                                        </h2>
                                        <p className="mt-1 text-[13px] text-zinc-500">
                                            Share your thoughts on this post.
                                        </p>
                                    </div>

                                    <button
                                        onClick={() => setIsOpen(false)}
                                        className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-full text-zinc-500 transition-colors duration-200 hover:bg-white/5 hover:text-white"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="size-4">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                                        </svg>
                                    </button>
                                </div>

                                <div className="mt-6 flex items-center gap-3">
                                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 text-[15px] font-semibold text-white shadow-md shadow-blue-500/20">
                                        {currentUser.name[0]?.toUpperCase()}
                                    </div>
                                    <div>
                                        <h3 className="text-[14px] font-semibold text-white">
                                            {currentUser.name}
                                        </h3>
                                        <p className="text-[12px] text-zinc-500">
                                            {currentUser.username ?? `@${currentUser.name.toLowerCase().replace(/\s/g, "")}`}
                                        </p>
                                    </div>
                                </div>

                                <textarea
                                    value={commentContent}
                                    onChange={(event) => setCommentContent(event.target.value)}
                                    placeholder="Write a comment..."
                                    className="mt-5 h-40 w-full resize-none bg-transparent text-[15px] leading-7 text-white outline-none placeholder:text-zinc-500"
                                />

                                <div className="mt-6 flex flex-col gap-3 border-t border-white/[0.06] pt-4 xs:flex-row xs:items-center xs:justify-between">
                                    <p className="text-[13px] text-zinc-500">
                                        Keep it respectful and meaningful.
                                    </p>

                                    <button
                                        disabled={createComment.isPending || commentContent === ""}
                                        onClick={() => createComment.mutate({ postId: params.postId, commentContent })}
                                        type="submit"
                                        className="h-10 cursor-pointer rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 px-5 text-[14px] font-medium text-white shadow-md shadow-blue-500/20 transition-all duration-200 hover:brightness-110 active:scale-95 disabled:cursor-not-allowed disabled:bg-none disabled:bg-zinc-800 disabled:text-zinc-500 disabled:shadow-none"
                                    >
                                        Comment
                                    </button>

                                </div>
                            </section>
                        </div>
                    </>
                )}
            </div>
        </>
    )
}