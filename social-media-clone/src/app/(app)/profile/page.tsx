"use client"
import { api } from "~/trpc/react";
import Loader from "../../components/shared/Loader";
import Link from "next/link";
import useStatusMessage from "../../hooks/useStatusMessage";
import StatusMessage from "../../components/shared/StatusMessage";
import ServerError from "~/app/components/shared/ServerError";
import { useRouter, usePathname } from "next/navigation";
import handleTRPCError from "~/app/libs/handleTRPCError";
import CommentIcon from "~/app/components/shared/CommentIcon";

export default function Profile() {
    const {
        data: currentUser,
        isLoading,
        error
    } = api.user.getUserInfo.useQuery();

    const utils = api.useUtils();
    const router = useRouter();
    const pathname = usePathname();

    const {
        setIsSuccess,
        setMessage,
        isSuccess,
        message,
        closeMessage
    } = useStatusMessage();

    if (isLoading) return <Loader />

    if (error || !currentUser) return <ServerError />

    return (
        <div className="min-h-screen bg-black pb-10">
            <section className="px-4 max-w-2xl mx-auto">

                <StatusMessage
                    closeMessage={closeMessage}
                    isSuccess={isSuccess}
                    message={message}
                />

                <section className="flex flex-col rounded-3xl border border-white/[0.06] bg-zinc-900/60 p-6 shadow-[0_8px_30px_rgba(0,0,0,0.35)] backdrop-blur-xl">
                    {/* Current user profile information */}
                    <div className="flex gap-2 items-center justify-between w-full">
                        <div className="flex gap-3 items-center">

                            <div className="flex h-14 w-14 shrink-0 text-2xl items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 font-semibold text-white shadow-md shadow-blue-500/20">
                                {currentUser.name[0]?.toUpperCase()}
                            </div>

                            <div>
                                <h2 className="text-xl font-semibold tracking-tight text-white">
                                    {currentUser.name}
                                </h2>
                                <p className="text-[13px] text-zinc-500">
                                    {currentUser.username ?? `@${currentUser.name.toLowerCase().replace(/\s/g, "")}`}
                                </p>
                            </div>
                        </div>
                    </div>

                    <p className="mt-5 max-w-lg text-[14px] leading-7 text-zinc-300">
                        {currentUser.bio}
                    </p>

                    <Link
                        href="/profile/edit"
                        className="h-11 mt-5 flex items-center justify-center w-full rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 cursor-pointer px-6 text-[14px] font-medium text-white shadow-md shadow-blue-500/20 transition-all duration-200 hover:brightness-110 active:scale-[0.99]"
                    >
                        Edit profile
                    </Link>
                </section>

                <section className="mt-8">
                    <h2 className="mb-4 text-xl font-semibold tracking-tight text-white">
                        Posts
                    </h2>

                    {/* No Post Modal */}
                    {currentUser.posts.length === 0 && (
                        <section className="flex flex-col items-center justify-center rounded-3xl border border-white/[0.06] bg-zinc-900/60 px-6 py-16 text-center backdrop-blur-xl">

                            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-white/5 border border-white/[0.06]">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    strokeWidth={1.5}
                                    stroke="currentColor"
                                    className="h-7 w-7 text-zinc-400"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125V5.25m-6.75 0v1.875A1.125 1.125 0 0 1 5.625 8.25h-1.5A3.375 3.375 0 0 0 .75 11.625v2.625m18 0a3 3 0 0 1-3 3h-3m6 0a3 3 0 0 1-3 3h-3m-9-6v6a3 3 0 0 0 3 3h3m-6-3a3 3 0 0 0 3 3h3"
                                    />
                                </svg>
                            </div>

                            <h2 className="mt-4 text-lg font-semibold text-white">
                                No posts yet
                            </h2>

                            <p className="mt-2 text-[13px] text-zinc-500">
                                Start sharing your thoughts with other people
                            </p>

                            <Link
                                href="/posts/create"
                                className="mt-6 h-11 flex justify-center items-center rounded-full cursor-pointer bg-gradient-to-br from-blue-500 to-indigo-600 px-5 text-[14px] font-medium text-white shadow-md shadow-blue-500/20 transition-all duration-200 hover:brightness-110 active:scale-95"
                            >
                                Create post
                            </Link>
                        </section>
                    )}

                    {/* Post content */}
                    <ul className="flex flex-col gap-3">
                        {currentUser.posts.map((post) => {
                            return (
                                <section
                                    key={post.id}
                                    className="rounded-2xl border border-white/[0.06] bg-zinc-900/60 p-5 backdrop-blur-xl transition-colors duration-200 hover:border-white/[0.1]"
                                >
                                    <p className="text-[14px] leading-7 text-zinc-200">
                                        {post.content}
                                    </p>

                                    <div className="mt-4 flex items-center gap-6 border-t border-white/[0.06] pt-4">
                                        <CommentIcon
                                            postId={post.id}
                                        />
                                    </div>
                                </section>
                            )
                        })}
                    </ul>
                </section >

            </section>
        </div>
    )
}