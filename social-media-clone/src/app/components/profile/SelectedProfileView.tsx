"use client"
import ProfilePost from "~/app/components/profile/ProfilePost"
import StatusMessage from "~/app/components/shared/StatusMessage"
import useStatusMessage from "~/app/hooks/useStatusMessage"
import TopPartProfile from "./TopPartProfile"
import type { User } from "~/app/types/types"

type SelectedProfileView = {
    user: User
}

export default function SelectedProfileView({ user }: SelectedProfileView) {
    const {
        setIsSuccess,
        setMessage,
        isSuccess,
        message,
        closeMessage
    } = useStatusMessage()

    return (
        <section className="px-4">

            <StatusMessage
                isSuccess={isSuccess}
                message={message}
                closeMessage={closeMessage}
            />

            <div className="flex flex-col" >
                <TopPartProfile
                    user={user}
                />
            </div >

            <section className="mt-8">
                <h2 className="mb-4 text-2xl font-semibold text-white">
                    Posts
                </h2>

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
                            />
                        )
                    })}
                </ul>
            </section >
        </section>
    )
}