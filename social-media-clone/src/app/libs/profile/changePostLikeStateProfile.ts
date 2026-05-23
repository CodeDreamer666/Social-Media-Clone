"use client"
import { api } from "~/trpc/react";
import { useRouter, usePathname } from "next/navigation"
import type { SetStateAction } from "react";
import handleTRPCError from "../handleTRPCError";
import { updatePostLike } from "../likeUpdater";

type Parameter = {
    setMessage: React.Dispatch<SetStateAction<string>>,
    setIsSuccess: React.Dispatch<SetStateAction<boolean | "IDLE">>,
    currentUserId: string | null | undefined
}

export default function changePostLikeStateProfileAction({
    setMessage,
    setIsSuccess,
    currentUserId
}: Parameter) {
    const utils = api.useUtils();
    const router = useRouter();
    const pathname = usePathname();

    const changePostLikeStateProfile = api.like.changePostLikeState.useMutation({
        onMutate: async (newData) => {
            await utils.user.getUserInfo.cancel();

            const previousInfo = utils.user.getUserInfo.getData();

            utils.user.getUserInfo.setData(undefined, (old) => {
                if (!old || !currentUserId) return old;

                return {
                    ...old,
                    posts: old.posts.map((post) => {
                        if (post.id !== newData.postId) {
                            return post;
                        }

                        return updatePostLike(post, {
                            currentUserId,
                            isLike: newData.isLike,
                            postId: newData.postId
                        });
                    })
                };
            });

            return { previousInfo };
        },

        onError: (error, newData, context) => {
            if (context?.previousInfo) {
                utils.user.getUserInfo.setData(undefined, context.previousInfo);
            }

            handleTRPCError({
                error, setMessage, setIsSuccess, router, pathname
            })
        },

        onSettled: async () => {
            await utils.invalidate()
        }
    });

    return { changePostLikeStateProfile }
}