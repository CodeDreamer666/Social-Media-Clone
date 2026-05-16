"use client"
import useTimeAgo from "~/app/hooks/useTimeAgo"
import { api } from "~/trpc/react";
import { TRPCClientError } from "@trpc/client";
import type { SetStateAction } from "react";
import { useRouter, usePathname } from "next/navigation";
import LoadingIcon from "../shared/LoadingIcon";

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

export default function PostItem({ post, setIsSuccess, setMessage }: Post) {
    const postTimeAgo = useTimeAgo(new Date(post.createdAt));
    const utils = api.useUtils();
    const router = useRouter();
    const pathname = usePathname();

    const editUserPosts = api.user.editUserPosts.useMutation({
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

        onSuccess: (newData) => {
            setIsSuccess(newData.success);
            setMessage(newData.message);
            return;
        },

        onError: (error, newData, context) => {
            if (context?.previousUserInfo) {
                utils.user.getUserInfo.setData(undefined, context.previousUserInfo);
                setIsSuccess(false);
                setMessage("Something went wrong. Please try again");
                return;
            }

            if (error instanceof TRPCClientError) {
                if (error.data?.code === "UNAUTHORIZED") {
                    router.replace(`/auth?redirect=${encodeURIComponent(pathname)}`);
                    return;
                }

                setIsSuccess(false);
                setMessage(error.data.zodError[0].message ?? "Something went wrong. Please try again.");
                return;
            }
        },

        onSettled: async () => {
            await utils.user.getUserInfo.invalidate()
        }
    });

    return (
        <section className="rounded-2xl border border-neutral-800 bg-neutral-950 p-5">
            <p className="text-sm leading-7 text-neutral-200">
                {post.content}
            </p>

            <div className="mt-5 flex items-center justify-between">
                <span className="text-xs text-neutral-500">
                    Posted {postTimeAgo} ago
                </span>

                <button
                    disabled={editUserPosts.isPending}
                    onClick={() => editUserPosts.mutate({ postId: post.id })}
                    className="text-sm disabled:bg-neutral-800 disabled:text-neutral-500 disabled:cursor-not-allowed disabled:hover:bg-neutral-800 font-medium cursor-pointer bg-red-500 px-4 py-2 rounded-xl transition-all duration-200 hover:bg-red-600"
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