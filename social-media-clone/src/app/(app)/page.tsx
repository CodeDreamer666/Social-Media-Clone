"use client"
import "~/styles/globals.css"
import PostItem from "../components/posts/PostItem"
import { api } from "~/trpc/react"
import Loader from "../components/shared/Loader"
import ServerError from "../components/shared/ServerError"
import useStatusMessage from "../hooks/useStatusMessage"
import StatusMessage from "../components/shared/StatusMessage"
import { usePathname, useRouter } from "next/navigation"
import { authClient } from "~/server/better-auth/client"
import handleTRPCError from "../libs/handleTRPCError"
import { updatePostLike } from "../libs/likeUpdater"

export default function HomePage() {
    const {
        data: postsData,
        isLoading,
        error
    } = api.post.getAllPost.useQuery();

    const utils = api.useUtils();
    const router = useRouter();
    const pathname = usePathname();

    const {
        data: currentUser
    } = authClient.useSession();

    // Like or unlike post
    const changePostLikeState = api.like.changePostLikeState.useMutation({
        onMutate: async (newData) => {
            await utils.post.getAllPost.cancel();

            const previousInfo = utils.post.getAllPost.getData();

            utils.post.getAllPost.setData(undefined, (old) => {
                if (!old || !currentUser?.user.id) return old;

                return old.map((post) => {
                    if (post.id !== newData.postId) {
                        return post;
                    }

                    return updatePostLike(post, {
                        currentUserId: currentUser.user.id,
                        isLike: newData.isLike,
                        postId: newData.postId
                    });
                });
            });

            return { previousInfo };
        },

        onError: (error, newData, context) => {
            if (context?.previousInfo) {
                utils.post.getAllPost.setData(undefined, context.previousInfo);
            }

            handleTRPCError({
                error, setMessage, setIsSuccess, router, pathname
            })
        },

        onSettled: async () => {
            await utils.invalidate()
        }
    });

    const {
        isSuccess,
        message,
        setIsSuccess,
        setMessage,
        closeMessage
    } = useStatusMessage();

    if (isLoading) return <Loader />

    if (error || !postsData || !currentUser) return <ServerError />

    return (
        <>
            <div className="min-h-screen bg-black pb-10">
                <StatusMessage
                    message={message}
                    isSuccess={isSuccess}
                    closeMessage={closeMessage}
                />

                <ul className="flex flex-col gap-2">
                    {postsData.map((post) => {
                        const isLike = post.likes.some((like) => {
                            return like.postId === post.id && like.userId === currentUser.user.id
                        });

                        return <PostItem
                            key={post.id}
                            post={post}
                            isLike={isLike}
                            mutation={changePostLikeState}
                            onClickMutation={() => changePostLikeState.mutate({
                                postId: post.id,
                                isLike: !isLike
                            })}
                        />
                    })}
                </ul>
            </div>
        </>
    )
}

