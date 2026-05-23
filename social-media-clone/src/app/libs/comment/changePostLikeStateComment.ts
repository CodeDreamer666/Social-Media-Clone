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
    postId: string
}

export default function changePostLikeStateCommentAction({
    setMessage,
    setIsSuccess,
    currentUserId,
    postId
}: Parameter) {
    const utils = api.useUtils();
    const router = useRouter();
    const pathname = usePathname();

    const changePostLikeStateComment = api.like.changePostLikeState.useMutation({
        onMutate: async (newData) => {
            await utils.post.getSelectedPost.cancel({ postId });

            const previousInfo = utils.post.getSelectedPost.getData({ postId });

            utils.post.getSelectedPost.setData({ postId }, (old) => {
                if (!old || !currentUserId) return old;

                return updatePostLike(old, {
                    currentUserId,
                    isLike: newData.isLike,
                    postId: newData.postId
                })

            });

            return { previousInfo };
        },

        onError: (error, newData, context) => {
            if (context?.previousInfo) {
                utils.post.getSelectedPost.setData({ postId }, context.previousInfo);
            }

            handleTRPCError({
                error, setMessage, setIsSuccess, router, pathname
            })
        },

        onSettled: async () => {
            await utils.invalidate()
        }
    });

    return { changePostLikeStateComment }
}