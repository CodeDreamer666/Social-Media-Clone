"use client"
import { api } from "~/trpc/react";
import { useRouter, usePathname } from "next/navigation"
import type { SetStateAction } from "react";
import handleTRPCError from "../handleTRPCError";
import { updatePostLike } from "../likeUpdater";

type Parameter = {
    setMessage: React.Dispatch<SetStateAction<string>>,
    setIsSuccess: React.Dispatch<SetStateAction<boolean | "IDLE">>,
    currentUserId: string | null | undefined,
    profileUserId?: string
}

export default function changePostLikeStateSelectedProfileAction({
    setMessage,
    setIsSuccess,
    currentUserId,
    profileUserId
}: Parameter) {
    const utils = api.useUtils();
    const router = useRouter();
    const pathname = usePathname();

    const changePostLikeStateSelectedProfile = api.like.changePostLikeState.useMutation({
        onMutate: async (newData) => {

            if (!profileUserId) return;

            await utils.user.getSelectedUserInfo.cancel({ userId: profileUserId });

            const previousInfo = utils.user.getSelectedUserInfo.getData({ userId: profileUserId });


            utils.user.getSelectedUserInfo.setData({ userId: profileUserId }, (old) => {
                if (!old || !currentUserId || "redirecting" in old) return old;

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
                }
            });

            return { previousInfo };
        },

        onError: (error, newData, context) => {
            if (context?.previousInfo) {
                if (!profileUserId) return;
                
                utils.user.getSelectedUserInfo.setData({ userId: profileUserId }, context.previousInfo);
            }

            handleTRPCError({
                error, setMessage, setIsSuccess, router, pathname
            })
        },

        onSettled: async () => {
            await utils.invalidate()
        }
    });

    return { changePostLikeStateSelectedProfile }
}