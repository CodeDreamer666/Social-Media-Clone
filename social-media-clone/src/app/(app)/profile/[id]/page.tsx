"use client"
import ProfilePost from "~/app/components/profile/ProfilePost"
import StatusMessage from "~/app/components/shared/StatusMessage"
import useStatusMessage from "~/app/hooks/useStatusMessage"
import { api } from "~/trpc/react"
import Loader from "~/app/components/shared/Loader"
import ServerError from "~/app/components/shared/ServerError"
import { redirect, useParams } from "next/navigation"

export default function Page() {
    const params = useParams<{ id: string }>()

    const {
        data: user,
        isLoading,
        error
    } = api.user.getSelectedUserInfo.useQuery({ userId: params.id });

    const {
        setIsSuccess,
        setMessage,
        isSuccess,
        message,
        closeMessage
    } = useStatusMessage();

    if (isLoading) return <Loader />

    if (error || !user) return <ServerError />

    if ("redirecting" in user) return redirect("/profile")

    return (
        <section className="px-4">

            <StatusMessage
                isSuccess={isSuccess}
                message={message}
                closeMessage={closeMessage}
            />

            {/* User profile information */}
            <div className="flex flex-col" >
                <div className="flex gap-2 items-center justify-between w-full">
                    <div className="flex gap-2 items-center">

                        <div className="flex h-12 w-12 text-2xl items-center justify-center rounded-full bg-sky-500 font-semibold text-white">
                            {user.name[0]?.toUpperCase()}
                        </div>


                        <div>
                            <h2 className="text-2xl font-semibold text-white">
                                {user.name}
                            </h2>
                            <p className="text-sm text-neutral-400">
                                {user.username ?? `@${user.name.toLowerCase().replace(/\s/g, "")}`}
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-6">
                        <div className="text-center">
                            <h3 className="text-xl font-semibold text-white">
                                {user.postsCount}
                            </h3>

                            <p className="text-sm text-neutral-400">
                                Posts
                            </p>
                        </div>
                    </div>
                </div>

                <p className="mt-5 max-w-lg text-sm text-neutral-300">
                    {user.bio}
                </p>
            </div>

            <section className="mt-8">
                <h2 className="mb-4 text-2xl font-semibold text-white">
                    Posts
                </h2>

                {/* No Post Modal */}
                {user.posts.length === 0 && (
                    <div className="flex flex-col items-center justify-center rounded-3xl border border-neutral-800 bg-neutral-900 px-6 py-16 text-center">

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
                    </div>
                )}

                <ul className="flex flex-col gap-4">
                    {user.posts.map((post) => {
                        return (
                            <ProfilePost
                                key={post.id}
                                setIsSuccess={setIsSuccess}
                                setMessage={setMessage}
                                post={post}
                                typeOfQuery="othersProfile"
                                profileUserId={params.id}
                            />
                        )
                    })}
                </ul>
            </section >
        </section>
    )
}