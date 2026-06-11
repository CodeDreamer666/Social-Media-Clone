"use client"
import useTimeAgo from "~/app/hooks/useTimeAgo"
import { api } from "~/trpc/react";
import { TRPCClientError } from "@trpc/client";
import type { SetStateAction } from "react";
import { useRouter, usePathname } from "next/navigation";
import LoadingIcon from "~/app/components/shared/LoadingIcon";
import handleTRPCError from "~/app/libs/handleTRPCError";

type Post = {
    post: {
        id: string;
        userId: string;
        content: string;
        likeCount: number;
        commentCount: number;
        createdAt: Date;
        updatedAt: Date;
    },
    setIsSuccess: React.Dispatch<SetStateAction<boolean | "IDLE">>,
    setMessage: React.Dispatch<SetStateAction<string>>
}

export default function PostEditForm({ post, setIsSuccess, setMessage }: Post) {
    const postTimeAgo = useTimeAgo(new Date(post.createdAt));
    const utils = api.useUtils();
    const router = useRouter();
    const pathname = usePathname();

    // Edit user post mutation
    const editUserPosts = api.user.editUserPosts.useMutation({
        onSuccess: (newData) => {
            setIsSuccess(newData.success);
            setMessage(newData.message)
        },

        onMutate: async (newData) => {
            await utils.user.getUserInfo.cancel();

            const previousUserInfo = utils.user.getUserInfo.getData();

            utils.user.getUserInfo.setData(undefined, (old) => {
                if (!old) return old;

                return {
                    ...old,
                    posts: old.posts.filter(post => post.id !== newData.postId)
                }
            });

            return { previousUserInfo };
        },

        onError: (error, newData, context) => {
            if (context?.previousUserInfo) {
                utils.user.getUserInfo.setData(undefined, context.previousUserInfo);
            }

            handleTRPCError({
                error, setMessage, setIsSuccess, router, pathname
            })
        },

        onSettled: async () => {
            await utils.invalidate()
        }
    });

    return (
        <section className="rounded-2xl border border-white/[0.06] bg-black/30 p-5">
            <p className="text-[14px] leading-7 text-zinc-200">
                {post.content}
            </p>

            <div className="mt-4 flex items-center justify-between border-t border-white/[0.06] pt-4">
                <span className="text-[12px] text-zinc-500">
                    Posted {postTimeAgo} ago
                </span>

                <button
                    disabled={editUserPosts.isPending}
                    onClick={() => editUserPosts.mutate({ postId: post.id })}
                    className="text-[13px] disabled:bg-zinc-800 disabled:text-zinc-500 disabled:cursor-not-allowed disabled:hover:bg-zinc-800 font-medium cursor-pointer bg-[#ff453a]/10 text-[#ff453a] px-4 py-2 rounded-full transition-all duration-200 hover:bg-[#ff453a]/20"
                >
                    {editUserPosts.isPending ? (
                        <div className="flex gap-2 items-center">
                            <LoadingIcon />
                            <p>Removing...</p>
                        </div>
                    ) : "Remove"}

                </button>
            </div>
        </section>
    )
}