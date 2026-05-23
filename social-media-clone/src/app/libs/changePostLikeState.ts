"use client"
import { api } from "~/trpc/react";
import { useRouter, usePathname } from "next/navigation"
import type { SetStateAction } from "react";
import handleTRPCError from "./handleTRPCError";
import { updatePostLike } from "./likeUpdater";

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
            await utils.post.getAllPost.cancel();

            const previousInfo = utils.post.getAllPost.getData();

            utils.post.getAllPost.setData(undefined, (old) => {
                if (!old || !currentUserId) return old;

                return old.map((post) => {
                    if (post.id !== newData.postId) {
                        return post;
                    }

                    return updatePostLike(post, {
                        currentUserId,
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

    return { changePostLikeState }
}