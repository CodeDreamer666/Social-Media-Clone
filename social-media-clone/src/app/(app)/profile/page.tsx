"use client"
import { api } from "~/trpc/react";
import Loader from "../../components/shared/Loader";
import Link from "next/link";
import ProfilePost from "~/app/components/profile/ProfilePost"
import useStatusMessage from "../../hooks/useStatusMessage";
import StatusMessage from "../../components/shared/StatusMessage";
import ServerError from "~/app/components/shared/ServerError";

export default function Profile() {
    const {
        data: currentUser,
        isLoading,
        error
    } = api.user.getUserInfo.useQuery();

    const {
        setIsSuccess,
        setMessage,
        isSuccess,
        message,
        closeMessage
    } = useStatusMessage()

    if (isLoading) return <Loader />

    if (error || !currentUser) return <ServerError />

    return (
        <section className="px-4">

            <StatusMessage
                closeMessage={closeMessage}
                isSuccess={isSuccess}
                message={message}
            />

            <section className="flex flex-col" >
                {/* Current user profile information */}
                <div className="flex gap-2 items-center justify-between w-full">
                    <div className="flex gap-2 items-center">

                        <div className="flex h-12 w-12 text-2xl items-center justify-center rounded-full bg-sky-500 font-semibold text-white">
                            {currentUser.name[0]?.toUpperCase()}
                        </div>


                        <div>
                            <h2 className="text-2xl font-semibold text-white">
                                {currentUser.name}
                            </h2>
                            <p className="text-sm text-neutral-400">
                                {currentUser.username ?? `@${currentUser.name.toLowerCase().replace(/\s/g, "")}`}
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-6">
                        <div className="text-center">
                            <h3 className="text-xl font-semibold text-white">
                                {currentUser.postsCount}
                            </h3>

                            <p className="text-sm text-neutral-400">
                                Posts
                            </p>
                        </div>
                    </div>
                </div>

                <p className="mt-5 max-w-lg text-sm text-neutral-300">
                    {currentUser.bio}
                </p>

                <Link
                    href="/profile/edit"
                    className="h-11 mt-4 flex items-center justify-center w-full rounded-xl bg-sky-500 cursor-pointer px-6 text-sm font-medium text-white transition-colors duration-300 hover:bg-sky-400"
                >
                    Edit Profile
                </Link>
            </section>

            <section className="mt-8">
                <h2 className="mb-4 text-2xl font-semibold text-white">
                    Posts
                </h2>

                {/* No Post Modal */}
                {currentUser.posts.length === 0 && (
                    <section className="flex flex-col items-center justify-center rounded-3xl border border-neutral-800 bg-neutral-900 px-6 py-16 text-center">

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

                        <h2 className="mt-2 text-lg font-semibold text-white">
                            No posts yet
                        </h2>

                        <p className="mt-2 text-sm text-neutral-400">
                            Start sharing your thoughts with other people
                        </p>

                        <Link
                            href="/posts/create"
                            className="mt-6 h-11 flex justify-center items-center rounded-xl cursor-pointer bg-sky-500 px-5 text-sm font-medium text-white transition-colors duration-200 hover:bg-sky-400"
                        >
                            Create Post
                        </Link>
                    </section>
                )}

                <ul className="flex flex-col gap-4">
                    {currentUser.posts.map((post) => {
                        return <ProfilePost
                            key={post.id}
                            setIsSuccess={setIsSuccess}
                            setMessage={setMessage}
                            post={post}
                            typeOfQuery="ownerProfile"
                        />
                    })}
                </ul>
            </section >

        </section>
    )
}