"use client"
import { api } from "~/trpc/react";
import { useRouter, usePathname } from "next/navigation"
import { TRPCClientError } from "@trpc/client";
import type { SetStateAction } from "react";

type Parameter = {
    setMessage: React.Dispatch<SetStateAction<string>>,
    setIsSuccess: React.Dispatch<SetStateAction<boolean | "IDLE">>,
    currentUserId: string | null | undefined
}

export default function changePostLikeStateAction({
    setMessage,
    setIsSuccess,
    currentUserId
}: Parameter) {
    const utils = api.useUtils();
    const router = useRouter();
    const pathname = usePathname();

    const changePostLikeState = api.like.changePostLikeState.useMutation({
        onMutate: async (newData) => {
            await utils.user.getUserInfo.cancel();

            const previousUser = utils.user.getUserInfo.getData();

            utils.user.getUserInfo.setData(undefined, (old) => {
                if (!old) return old;

                if (!currentUserId) return old;

                return {
                    ...old,
                    posts: old.posts.map((post) => {
                        if (post.id === newData.postId) {
                            return {
                                ...post,
                                likeCount: newData.isLike ? post.likeCount + 1 : post.likeCount - 1,
                                likes: newData.isLike ? [
                                    ...post.likes,
                                    {
                                        id: crypto.randomUUID(),
                                        userId: currentUserId,
                                        postId: newData.postId
                                    }
                                ] : post.likes.filter(like =>
                                    !(like.userId === currentUserId && like.postId === post.id)
                                )
                            }
                        } else {
                            return post
                        }
                    })
                }
            });

            return { previousUser };
        },

        onError: (error, newData, context) => {
            if (context?.previousUser) {
                utils.user.getUserInfo.setData(undefined, context.previousUser);
            }

            setIsSuccess(false);

            if (!(error instanceof TRPCClientError)) {
                setMessage("Something went wrong. Please try again.");
                return;
            }

            const code = error.data?.code;

            const zodError = error.data?.zodError;

            if (zodError) {
                setMessage(error.data.zodError[0].message ?? "Invalid input");
                return;
            }

            switch (code) {
                case "BAD_REQUEST":
                    setMessage("Invalid request.");
                    return;

                case "UNAUTHORIZED":
                    router.replace(`/auth?redirect=${encodeURIComponent(pathname)}`);
                    return;

                case "FORBIDDEN":
                    setMessage("You do not have permission to do this.");
                    return;

                case "NOT_FOUND":
                    setMessage("The requested resource was not found.");
                    return;

                case "CONFLICT":
                    setMessage("This action conflicts with existing data.");
                    return;

                case "TOO_MANY_REQUESTS":
                    setMessage("Too many requests. Please try again later.");
                    return;

                case "INTERNAL_SERVER_ERROR":
                    setMessage("Server error. Please try again later.");
                    return;

                default:
                    setMessage(error.message || "Something went wrong.");
                    return;
            }
        },

        onSettled: async () => {
            await utils.user.getUserInfo.invalidate()
        }
    });

    return { changePostLikeState }
}