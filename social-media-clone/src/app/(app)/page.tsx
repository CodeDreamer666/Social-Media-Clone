"use client"
import "~/styles/globals.css"
import PostItem from "../components/posts/PostItem"
import { api } from "~/trpc/react"
import Loader from "../components/shared/Loader"
import ServerError from "../components/shared/ServerError"
import useStatusMessage from "../hooks/useStatusMessage"
import StatusMessage from "../components/shared/StatusMessage"
import { usePathname, useRouter } from "next/navigation"
import { authClient } from "~/server/better-auth/client"
import handleTRPCError from "../libs/handleTRPCError"

export default function HomePage() {
    const {
        data: postsData,
        isLoading,
        error
    } = api.post.getAllPost.useQuery();

    const utils = api.useUtils();
    const router = useRouter();
    const pathname = usePathname();

    const {
        data: currentUser
    } = authClient.useSession();

    const {
        isSuccess,
        message,
        setIsSuccess,
        setMessage,
        closeMessage
    } = useStatusMessage();

    if (isLoading) return <Loader />

    if (error || !postsData || !currentUser) return <ServerError />

    return (
        <>
            <div className="min-h-screen bg-black pb-10">
                <StatusMessage
                    message={message}
                    isSuccess={isSuccess}
                    closeMessage={closeMessage}
                />

                <ul className="flex flex-col gap-2">
                    {postsData.map((post) => {
                        return <PostItem
                            key={post.id}
                            post={post}
                        />
                    })}
                </ul>
            </div>
        </>
    )
}

