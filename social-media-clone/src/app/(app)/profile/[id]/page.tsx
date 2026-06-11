"use client"
import StatusMessage from "~/app/components/shared/StatusMessage"
import useStatusMessage from "~/app/hooks/useStatusMessage"
import { api } from "~/trpc/react"
import Loader from "~/app/components/shared/Loader"
import ServerError from "~/app/components/shared/ServerError"
import { redirect, useParams, useRouter, usePathname } from "next/navigation"
import CommentIcon from "~/app/components/shared/CommentIcon"
import LikeIcon from "~/app/components/shared/LikeIcon"
import handleTRPCError from "~/app/libs/handleTRPCError"
import { authClient } from "~/server/better-auth/client"
import { updatePostLike } from "~/app/libs/likeUpdater"

export default function Page() {
    const params = useParams<{ id: string }>();
    const utils = api.useUtils();
    const router = useRouter();
    const pathname = usePathname();

    const {
        data: user,
        isLoading,
        error
    } = api.user.getSelectedUserInfo.useQuery({ userId: params.id });

    const {
        data: currentUser
    } = authClient.useSession();

    const {
        setIsSuccess,
        setMessage,
        isSuccess,
        message,
        closeMessage
    } = useStatusMessage();

    // Like or unlike post mutation
    const changePostLikeState = api.like.changePostLikeState.useMutation({
        onMutate: async (newData) => {
            await utils.user.getSelectedUserInfo.cancel({ userId: params.id });

            const previousInfo = utils.user.getSelectedUserInfo.getData({ userId: params.id });


            utils.user.getSelectedUserInfo.setData({ userId: params.id }, (old) => {
                if (!old || !currentUser?.user.id || "redirecting" in old) return old;

                return {
                    ...old,
                    posts: old.posts.map((post) => {
                        if (post.id !== newData.postId) {
                            return post;
                        }

                        return updatePostLike(post, {
                            currentUserId: currentUser.user.id,
                            isLike: newData.isLike,
                            postId: newData.postId
                        });
                    })
                }
            });

            return { previousInfo };
        },

        onError: (error, newData, context) => {
            if (context?.previousInfo) {
                utils.user.getSelectedUserInfo.setData({ userId: params.id }, context.previousInfo);
            }

            handleTRPCError({
                error, setMessage, setIsSuccess, router, pathname
            })
        },

        onSettled: async () => {
            await utils.invalidate()
        }
    });

    if (isLoading) return <Loader />

    if (error || !user || !currentUser) return <ServerError />

    if ("redirecting" in user) return redirect("/profile")

    return (
        <div className="min-h-screen bg-black pb-10">
            <section className="px-4 max-w-2xl mx-auto">

                <StatusMessage
                    isSuccess={isSuccess}
                    message={message}
                    closeMessage={closeMessage}
                />

                {/* User profile information */}
                <div className="flex flex-col rounded-3xl border border-white/[0.06] bg-zinc-900/60 p-6 shadow-[0_8px_30px_rgba(0,0,0,0.35)] backdrop-blur-xl">
                    <div className="flex gap-2 items-center justify-between w-full">
                        <div className="flex gap-3 items-center">

                            <div className="flex h-14 w-14 shrink-0 text-2xl items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 font-semibold text-white shadow-md shadow-blue-500/20">
                                {user.name[0]?.toUpperCase()}
                            </div>

                            <div>
                                <h2 className="text-xl font-semibold tracking-tight text-white">
                                    {user.name}
                                </h2>
                                <p className="text-[13px] text-zinc-500">
                                    {user.username ?? `@${user.name.toLowerCase().replace(/\s/g, "")}`}
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center gap-6">
                            <div className="text-center">
                                <h3 className="text-xl font-semibold text-white">
                                    {user.postsCount}
                                </h3>

                                <p className="text-[12px] text-zinc-500">
                                    Posts
                                </p>
                            </div>
                        </div>
                    </div>

                    <p className="mt-5 max-w-lg text-[14px] leading-7 text-zinc-300">
                        {user.bio}
                    </p>
                </div>

                <section className="mt-8">
                    <h2 className="mb-4 text-xl font-semibold tracking-tight text-white">
                        Posts
                    </h2>

                    {/* No Post Modal */}
                    {user.posts.length === 0 && (
                        <div className="flex flex-col items-center justify-center rounded-3xl border border-white/[0.06] bg-zinc-900/60 px-6 py-16 text-center backdrop-blur-xl">

                            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-white/5 border border-white/[0.06]">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    strokeWidth={1.5}
                                    stroke="currentColor"
                                    className="h-7 w-7 text-zinc-400"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125V5.25m-6.75 0v1.875A1.125 1.125 0 0 1 5.625 8.25h-1.5A3.375 3.375 0 0 0 .75 11.625v2.625m18 0a3 3 0 0 1-3 3h-3m6 0a3 3 0 0 1-3 3h-3m-9-6v6a3 3 0 0 0 3 3h3m-6-3a3 3 0 0 0 3 3h3"
                                    />
                                </svg>
                            </div>

                            <h2 className="mt-4 text-lg font-semibold text-white">
                                No posts yet
                            </h2>
                        </div>
                    )}

                    {/* Post content */}
                    <ul className="flex flex-col gap-3">
                        {user.posts.map((post) => {
                            const isLike = post.likes.some((like) => {
                                return like.postId === post.id && like.userId === currentUser.user.id
                            });

                            return (
                                <section
                                    key={post.id}
                                    className="rounded-2xl border border-white/[0.06] bg-zinc-900/60 p-5 backdrop-blur-xl transition-colors duration-200 hover:border-white/[0.1]"
                                >
                                    <p className="text-[14px] leading-7 text-zinc-200">
                                        {post.content}
                                    </p>

                                    <div className="mt-4 flex items-center gap-6 border-t border-white/[0.06] pt-4">
                                        <LikeIcon
                                            mutation={changePostLikeState}
                                            postLikeCount={post.likeCount}
                                            onClickMutation={() => changePostLikeState.mutate({
                                                postId: post.id,
                                                isLike: !isLike
                                            })}
                                            isLike={isLike}
                                        />

                                        <CommentIcon
                                            postCommentCount={post.commentCount}
                                            postId={post.id}
                                        />
                                    </div>
                                </section>
                            )
                        })}
                    </ul>
                </section>
            </section>
        </div>
    )
}