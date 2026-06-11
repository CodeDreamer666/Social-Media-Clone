"use client"
import { api } from "~/trpc/react";
import { useRouter, usePathname } from "next/navigation";
import useStatusMessage from "~/app/hooks/useStatusMessage";
import StatusMessage from "~/app/components/shared/StatusMessage";
import Loader from "~/app/components/shared/Loader";
import ServerError from "~/app/components/shared/ServerError";
import { useState } from "react";
import Link from "next/link";
import handleTRPCError from "~/app/libs/handleTRPCError";
import LoadingIcon from "~/app/components/shared/LoadingIcon";
import PostEditForm from "~/app/components/profile/PostEditForm";

export default function EditProfile() {
    const {
        data: currentUser,
        isLoading,
        error
    } = api.user.getUserInfo.useQuery();

    const [username, setUsername] = useState(
        currentUser?.username ?? `@${currentUser?.name.toLowerCase().replace(/\s/g, "")}`
    );
    const [bio, setBio] = useState(currentUser?.bio ?? "A new social media user");

    const utils = api.useUtils();
    const pathname = usePathname();
    const router = useRouter();

    const {
        isSuccess,
        message,
        setIsSuccess,
        setMessage,
        closeMessage
    } = useStatusMessage();

    // Edit user information mutation
    const editUserInfo = api.user.editUserInfo.useMutation({
        onMutate: async (newData) => {
            await utils.user.getUserInfo.cancel();

            const previousUser = utils.user.getUserInfo.getData();

            utils.user.getUserInfo.setData(undefined, (old) => {
                if (!old) return old;

                return {
                    ...old,
                    username: newData.username,
                    bio: newData.bio
                }
            });

            return { previousUser };
        },

        onSuccess: (newData) => {
            setIsSuccess(newData.success);
            setMessage(newData.message);
        },

        onError: (error, newData, context) => {
            if (context?.previousUser) {
                utils.user.getUserInfo.setData(undefined, context.previousUser);
            }

            handleTRPCError({
                error, setMessage, setIsSuccess, router, pathname
            })
        },

        onSettled: async () => {
            await utils.invalidate()
        }
    });

    if (isLoading) return <Loader />

    if (error || !currentUser) return <ServerError />

    return (
        <section className="min-h-screen bg-black pb-10">
            <div className="mx-auto w-full max-w-2xl px-4">

                <StatusMessage
                    message={message}
                    isSuccess={isSuccess}
                    closeMessage={closeMessage}
                />

                <section className="mb-6 flex flex-col justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-semibold tracking-tight text-white">
                            Edit profile
                        </h1>
                        <p className="mt-2 text-[13px] text-zinc-500">
                            Manage your profile and account settings.
                        </p>
                    </div>
                    <Link
                        className="h-11 flex items-center justify-center rounded-full bg-white/5 border border-white/[0.06] cursor-pointer px-6 text-[14px] font-medium text-white transition-colors duration-200 hover:bg-white/10"
                        href="/profile"
                    >
                        Back to profile
                    </Link>
                </section>

                <section className="flex flex-col gap-6">
                    {/* Edit user information form */}
                    <section className="rounded-3xl border border-white/[0.06] bg-zinc-900/60 p-6 shadow-[0_8px_30px_rgba(0,0,0,0.35)] backdrop-blur-xl">

                        <h2 className="mb-4 text-[15px] font-semibold text-white">
                            Profile
                        </h2>

                        <div className="mb-6">
                            <label
                                htmlFor="username"
                                className="mb-2 block text-[13px] font-medium text-zinc-300"
                            >
                                Username
                            </label>
                            <input
                                value={username}
                                onChange={(event) => setUsername(event.target.value)}
                                type="text"
                                name="username"
                                id="username"
                                autoComplete="off"
                                placeholder="Tell people about yourself..."
                                className="w-full mb-4 resize-none rounded-2xl border border-white/[0.06] bg-black/40 px-4 py-3 text-[14px] leading-7 text-white outline-none transition-colors duration-200 placeholder:text-zinc-500 focus:border-blue-500/50"
                            />

                            <label
                                htmlFor="bio"
                                className="mb-2 block text-[13px] font-medium text-zinc-300"
                            >
                                Bio
                            </label>
                            <textarea
                                name="bio"
                                id="bio"
                                value={bio}
                                onChange={(event) => setBio(event.target.value)}
                                placeholder="Tell people about yourself..."
                                className="h-40 w-full resize-none rounded-2xl border border-white/[0.06] bg-black/40 px-4 py-3 text-[14px] leading-7 text-white outline-none transition-colors duration-200 placeholder:text-zinc-500 focus:border-blue-500/50"
                            />
                        </div>

                        <button
                            disabled={editUserInfo.isPending || username.length === 0 || bio.length === 0}
                            onClick={() => {
                                editUserInfo.mutate({
                                    username,
                                    bio
                                });
                            }}
                            className="h-11 cursor-pointer rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 px-5 text-[14px] font-medium text-white shadow-md shadow-blue-500/20 transition-all duration-200 hover:brightness-110 active:scale-95 disabled:cursor-not-allowed disabled:bg-none disabled:bg-zinc-800 disabled:text-zinc-500 disabled:shadow-none"
                        >
                            {editUserInfo.isPending ? (
                                <div className="flex items-center justify-center gap-2">
                                    <LoadingIcon />
                                    <p>Saving changes...</p>
                                </div>
                            ) : "Save changes"}
                        </button>
                    </section>

                    {/* Manage Posts */}
                    <section className="rounded-3xl border border-white/[0.06] bg-zinc-900/60 p-6 shadow-[0_8px_30px_rgba(0,0,0,0.35)] backdrop-blur-xl">
                        <h2 className="mb-6 text-[15px] font-semibold text-white">
                            Manage posts
                        </h2>

                        {/* No Post Modal */}
                        {currentUser.posts.length === 0 && (
                            <section className="flex flex-col items-center justify-center rounded-2xl border border-white/[0.06] bg-black/30 px-6 py-16 text-center">

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

                        <ul className="flex flex-col gap-3">
                            {currentUser.posts.map((post) => {
                                return (
                                    <PostEditForm
                                        key={post.id}
                                        setIsSuccess={setIsSuccess}
                                        setMessage={setMessage}
                                        post={post}
                                    />
                                )
                            })}
                        </ul>
                    </section>
                </section>
            </div>
        </section>
    )
}