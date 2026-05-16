"use client"
import { api } from "~/trpc/react"
import StatusMessage from "~/app/components/shared/StatusMessage"
import useStatusMessage from "~/app/hooks/useStatusMessage"
import { useState, useEffect } from "react"
import { useRouter, usePathname } from "next/navigation";
import Loader from "~/app/components/shared/Loader"
import ServerError from "~/app/components/shared/ServerError"
import { TRPCClientError } from "@trpc/client"
import LoadingIcon from "~/app/components/shared/LoadingIcon"
import Link from "next/link"
import PostItem from "~/app/components/posts/PostItem"

export default function EditProfile() {
    const [username, setUsername] = useState("");
    const [bio, setBio] = useState("");
    const pathname = usePathname();
    const router = useRouter();
    const utils = api.useUtils();
    const { data: user, isLoading, error } = api.user.getUserInfo.useQuery();

    const editUserInfo = api.user.editUserInfo.useMutation({
        onMutate: async (newData) => {
            await utils.user.getUserInfo.cancel();

            const previousUserInfo = utils.user.getUserInfo.getData();

            utils.user.getUserInfo.setData(undefined, (old) => {
                if (!old) return old;

                return {
                    ...old,
                    username: newData.username,
                    bio: newData.bio
                }
            });

            return { previousUserInfo };
        },

        onSuccess: (newData) => {
            setIsSuccess(newData.success);
            setMessage(newData.message);
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

    const {
        isSuccess,
        message,
        setIsSuccess,
        setMessage,
        closeMessage
    } = useStatusMessage();

    useEffect(() => {
        if (!user) return;

        setUsername(user.username ?? `@${user.name.toLowerCase().replace(/\s/g, "")}`)
        setBio(user.bio)
    }, [user])


    if (isLoading) return <Loader />

    if (error && error instanceof TRPCClientError) {
        router.replace(`/auth?redirect=${encodeURIComponent(pathname)}`);
    }

    if (!user) return <ServerError />

    return (
        <div className="mx-auto w-full max-w-3xl px-4">

            <StatusMessage
                message={message}
                isSuccess={isSuccess}
                closeMessage={closeMessage}
            />

            {/* Page Title */}
            <div className="mb-6 flex items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-semibold text-white">
                        Edit Profile
                    </h1>
                    <p className="mt-2 text-sm text-neutral-400">
                        Manage your profile and account settings.
                    </p>
                </div>
                <Link
                    className="h-11 flex items-center justify-center rounded-xl bg-sky-500 cursor-pointer px-6 text-sm font-medium text-white transition-colors duration-300 hover:bg-sky-400"
                    href="/profile"
                >
                    Back to Profile
                </Link>
            </div>

            <div className="flex flex-col gap-6">
                <section className="rounded-3xl border border-neutral-800 bg-neutral-900 p-6">

                    <h2 className="mb-4 text-lg font-semibold text-white">
                        Profile
                    </h2>

                    {/* Bio */}
                    <div className="mb-6">
                        <label
                            htmlFor="username"
                            className="mb-2 block text-sm font-medium text-neutral-200"
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
                            className="w-full mb-4  resize-none rounded-2xl border border-neutral-800 bg-neutral-950 px-4 py-3 text-sm leading-7 text-white outline-none transition-colors duration-200 placeholder:text-neutral-500 focus:border-sky-500"
                        />

                        <label
                            htmlFor="bio"
                            className="mb-2 block text-sm font-medium text-neutral-200"
                        >
                            Bio
                        </label>
                        <textarea
                            name="bio"
                            id="bio"
                            value={bio}
                            onChange={(event) => setBio(event.target.value)}
                            placeholder="Tell people about yourself..."
                            className="h-40 w-full resize-none rounded-2xl border border-neutral-800 bg-neutral-950 px-4 py-3 text-sm leading-7 text-white outline-none transition-colors duration-200 placeholder:text-neutral-500 focus:border-sky-500"
                        />
                    </div>

                    {/* Account Visibility */}
                    {/* <div className="flex items-center justify-between rounded-2xl border border-neutral-800 bg-neutral-950 p-4">
                        <div>
                            <h3 className="text-sm font-medium text-white">
                                Private Account
                            </h3>
                            <p className="mt-1 text-sm text-neutral-400">
                                Only approved followers can view your posts.
                            </p>
                        </div>

                        <button
                            type="button"
                            onClick={() => setIsPrivate((prev) => !prev)}
                            className={`
                                relative h-7 w-12 rounded-full cursor-pointer transition-all 
                                duration-300 ease-in-out
                                ${isPrivate ? "bg-sky-500" : "bg-neutral-700"}
                           `}
                        >
                            <div className={`
                                absolute top-1 h-5 w-5 rounded-full bg-white
                                transition-all duration-300 ease-in-out
                                ${isPrivate ? "translate-x-6" : "translate-x-1"}
                            `}
                            />
                        </button>
                    </div> */}

                    {/* Save Button */}
                    <button
                        disabled={editUserInfo.isPending || username.length === 0 || bio.length === 0}
                        onClick={() => {
                            editUserInfo.mutate({
                                username,
                                bio
                            });
                        }}
                        className="disabled:bg-neutral-800 disabled:text-neutral-500
                                   disabled:cursor-not-allowed disabled:hover:bg-neutral-800  
                                   h-11 cursor-pointer rounded-xl bg-sky-500 px-5 text-sm font-medium 
                                   text-white transition-colors duration-200 hover:bg-sky-400"
                    >
                        {editUserInfo.isPending ? (
                            <div className="flex items-center gap-2">
                                <LoadingIcon />
                                <p>Saving changes...</p>
                            </div>
                        ) : " Save Changes"}
                    </button>
                </section>

                {/* Manage Posts */}
                <section className="rounded-3xl border border-neutral-800 bg-neutral-900 p-6">
                    <h2 className="mb-6 text-lg font-semibold text-white">
                        Manage Posts
                    </h2>

                    {user.posts.length === 0 && (
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

                    <ul className="flex flex-col gap-4">
                        {user.posts.map((post) => {
                            return (
                                <PostItem
                                    key={post.id}
                                    setIsSuccess={setIsSuccess}
                                    setMessage={setMessage}
                                    post={post}
                                />
                            )
                        })}
                    </ul>
                </section>
            </div>
        </div>
    )
}