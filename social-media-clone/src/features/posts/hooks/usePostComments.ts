"use client";

import { usePathname, useRouter } from "next/navigation";
import type { RouterOutputs } from "~/trpc/react";
import handleTRPCError from "~/lib/handleTRPCError";
import { api } from "~/trpc/react";

type CurrentUser = NonNullable<RouterOutputs["user"]["getUserInfo"]>;

type UsePostCommentsProps = {
    currentUser: CurrentUser;
    setMessage: React.Dispatch<React.SetStateAction<string>>;
    setIsSuccess: React.Dispatch<React.SetStateAction<boolean | "IDLE">>;
    onSuccess: () => void;
};

export default function usePostComments({
    currentUser,
    setMessage,
    setIsSuccess,
    onSuccess
}: UsePostCommentsProps) {
    const utils = api.useUtils();
    const router = useRouter();
    const pathname = usePathname();

    const createComment = api.comment.createComment.useMutation({
        onSuccess,

        onMutate: async (newData) => {
            await utils.post.getSelectedPost.cancel();

            const previousInfo = utils.post.getSelectedPost.getData({
                postId: newData.postId
            });

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
                                interestsUpdatedAt: null,
                            },
                            id: crypto.randomUUID(),
                            userId: currentUser.id,
                            postId: newData.postId,
                            content: newData.commentContent,
                            createdAt: new Date(),
                            updatedAt: new Date()
                        }
                    ]
                };
            });

            return { previousInfo };
        },

        onError: (error, newData, context) => {
            if (context?.previousInfo) {
                utils.post.getSelectedPost.setData(
                    { postId: newData.postId },
                    context.previousInfo
                );
            }

            handleTRPCError({
                error,
                setMessage,
                setIsSuccess,
                router,
                pathname
            });
        },

        onSettled: async () => {
            await utils.invalidate();
        }
    });

    return createComment;
}
