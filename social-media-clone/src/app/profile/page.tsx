"use client"
import { api } from "~/trpc/react";
import { useRouter, usePathname } from "next/navigation";
import Loader from "../components/shared/Loader";
import { TRPCClientError } from "@trpc/client";
import { useState, useEffect } from "react";
import Link from "next/link";
import StatusMessage from "~/app/components/shared/StatusMessage"
import useStatusMessage from "~/app/hooks/useStatusMessage"
import ServerError from "../components/shared/ServerError";

export default function Profile() {
    const [isLike, setIsLike] = useState(false);
    const [isDirecting, setIsDirecting] = useState(false);
    const pathname = usePathname();
    const router = useRouter();
    // const utils = api.useUtils();

    const { data: userSession, isLoading, error } = api.user.getUserInfo.useQuery();

    // const updateAccountPrivacy = api.user.editUserAccountPrivacy.useMutation({
    //     onMutate: async (newData) => {
    //         await utils.user.getUserInfo.cancel();

    //         const previousUserInfo = utils.user.getUserInfo.getData();

    //         utils.user.getUserInfo.setData(undefined, (old) => {
    //             if (!old) return old;

    //             return {
    //                 ...old,
    //                 isPublic: newData.isPublic
    //             }
    //         });

    //         return { previousUserInfo };
    //     },

    //     onSuccess: (newData) => {
    //         setIsSuccess(newData.success);
    //         setMessage(newData.message);
    //         return;
    //     },

    //     onError: (error, newData, context) => {
    //         if (context?.previousUserInfo) {
    //             utils.user.getUserInfo.setData(undefined, context.previousUserInfo);
    //             setIsSuccess(false);
    //             setMessage("Something went wrong. Please try again");
    //             return;
    //         }

    //         if (error instanceof TRPCClientError) {
    //             if (error.data?.code === "UNAUTHORIZED") {
    //                 router.replace(`/auth?redirect=${encodeURIComponent(pathname)}`);
    //                 return;
    //             }

    //             setIsSuccess(false);
    //             setMessage(error.data.zodError[0].message ?? "Something went wrong. Please try again.");
    //             return;
    //         }
    //     },

    //     onSettled: async () => {
    //         await utils.post.getAllPost.invalidate()
    //     }
    // });

    const {
        isSuccess,
        message,
        setIsSuccess,
        setMessage,
        closeMessage
    } = useStatusMessage()

    useEffect(() => {
        if (!isDirecting) return;

        const timer = setTimeout(() => {
            setIsDirecting(false);
        }, 3000)

        return () => clearTimeout(timer);
    }, [isDirecting])

    if (isLoading) return <Loader />

    if (error) {
        if (error instanceof TRPCClientError) {
            router.replace(`/auth?redirect=${encodeURIComponent(pathname)}`);
            return;
        }
    }

    if (!userSession) return <ServerError />

    return (
        <section className="px-4">

            <StatusMessage
                message={message}
                isSuccess={isSuccess}
                closeMessage={closeMessage}
            />

            <div className="flex flex-col" >
                <div className="flex gap-2 items-center justify-between w-full">
                    <div className="flex gap-2 items-center">

                        <div className="flex h-12 w-12 text-2xl items-center justify-center rounded-full bg-sky-500 font-semibold text-white">
                            {userSession.name[0]?.toUpperCase()}
                        </div>


                        <div>
                            <h2 className="text-2xl font-semibold text-white">
                                {userSession.name}
                            </h2>
                            <p className="text-sm text-neutral-400">
                                {userSession.username ?? `@${userSession.name.toLowerCase().replace(/\s/g, "")}`}
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-6">
                        <div className="text-center">
                            <h3 className="text-xl font-semibold text-white">
                                {userSession.postsCount}
                            </h3>

                            <p className="text-sm text-neutral-400">
                                Posts
                            </p>
                        </div>

                        {/* Followers Count */}
                        {/* <div className="text-center">
                            <h3 className="text-xl font-semibold text-white">
                                {userSession.followersCount}
                            </h3>

                            <p className="text-sm text-neutral-400">
                                Followers
                            </p>
                        </div> */}

                        {/* Followering Count */}
                        {/* <div className="text-center">
                            <h3 className="text-xl font-semibold text-white">
                                {userSession.followingCount}
                            </h3>

                            <p className="text-sm text-neutral-400">
                                Following
                            </p>
                        </div> */}
                    </div>
                </div>

                <p className="mt-5 max-w-lg text-sm text-neutral-300">
                    {userSession.bio}
                </p>


                <div className="flex w-full gap-2 mt-4">
                    <Link
                        href="/profile/edit"
                        className="h-11 flex items-center justify-center w-full rounded-xl bg-sky-500 cursor-pointer px-6 text-sm font-medium text-white transition-colors duration-300 hover:bg-sky-400"
                    >
                        Edit Profile
                    </Link>

                    {/* Edit Account Privacy */}
                    {/* <button
                        onClick={() => {
                            updateAccountPrivacy.mutate({
                                isPublic: userSession.isPublic ? false : true
                            });
                            router.refresh();
                        }}
                        disabled={updateAccountPrivacy.isPending}
                        className="h-11 disabled:bg-neutral-800
                                 disabled:text-neutral-500
                                   disabled:cursor-not-allowed
                                 disabled:hover:bg-neutral-800 
                                 w-full rounded-xl bg-sky-500 cursor-pointer 
                                 px-6 text-sm font-medium text-white transition-colors 
                                 duration-300 hover:bg-sky-400"
                    >
                        {userSession.isPublic ? (
                            "Go Private"
                        ) : (
                            "Go Public"
                        )}
                    </button> */}
                </div>
            </div >

            <section className="mt-8">
                <h2 className="mb-4 text-2xl font-semibold text-white">
                    Posts
                </h2>

                {userSession.posts.length === 0 && (
                    <div className="flex flex-col items-center justify-center rounded-3xl border border-neutral-800 bg-neutral-900 px-6 py-16 text-center">

                        {/* Icon */}
                        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-neutral-950 border border-neutral-800">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                strokeWidth={1.5}
                                stroke="currentColor"
                                className="h-7 w-7 text-neutral-400"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125V5.25m-6.75 0v1.875A1.125 1.125 0 0 1 5.625 8.25h-1.5A3.375 3.375 0 0 0 .75 11.625v2.625m18 0a3 3 0 0 1-3 3h-3m6 0a3 3 0 0 1-3 3h-3m-9-6v6a3 3 0 0 0 3 3h3m-6-3a3 3 0 0 0 3 3h3"
                                />
                            </svg>
                        </div>

                        {/* Text */}
                        <h2 className="mt-2 text-lg font-semibold text-white">
                            No posts yet
                        </h2>

                        <p className="mt-2 text-sm text-neutral-400">
                            Start sharing your thoughts with other people
                        </p>

                        {/* CTA */}
                        <Link
                            href="/create"
                            className="mt-6 h-11 flex justify-center items-center rounded-xl cursor-pointer bg-sky-500 px-5 text-sm font-medium text-white transition-colors duration-200 hover:bg-sky-400"
                        >
                            Create Post
                        </Link>

                    </div>
                )}

                <div className="flex flex-col gap-4">
                    {userSession.posts.map((post) => {
                        return (
                            <div
                                key={post.id}
                                className="rounded-2xl border border-neutral-800 bg-neutral-900 p-5"
                            >
                                <p className="text-sm leading-7 text-neutral-200">
                                    {post.content}
                                </p>
                                <div className="mt-5 flex items-center gap-6 border-t border-neutral-800 pt-4">
                                    <button
                                        onClick={() => setIsLike(!isLike)}
                                        className="flex items-center gap-2 text-sm text-neutral-400 cursor-pointer transition-colors duration-200 hover:text-white"
                                    >
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            fill={isLike ? "red" : "none"}
                                            viewBox="0 0 24 24"
                                            strokeWidth={1.5}
                                            stroke="currentColor"
                                            className={`size-6 ${isLike ? "text-red-500" : ""}`}
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z"
                                            />
                                        </svg>
                                        <span>{post.likeCount}</span>
                                    </button>

                                    <button
                                        className="flex cursor-pointer items-center gap-2 text-neutral-400 transition-colors duration-200 hover:text-white"
                                    >
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            strokeWidth={1.5}
                                            stroke="currentColor"
                                            className="size-6"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                d="M2.25 12.76c0 1.6 1.123 2.994 2.707 3.227 1.087.16 2.185.283 3.293.369V21l4.076-4.076a1.526 1.526 0 0 1 1.037-.443 48.282 48.282 0 0 0 5.68-.494c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0 0 12 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018Z"
                                            />
                                        </svg>
                                        <span>{post.commentCount}</span>
                                    </button>
                                </div>
                            </div>
                        )
                    })}
                </div>
            </section >

        </section>
    )
}