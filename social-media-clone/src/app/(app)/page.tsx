"use client"
import "~/styles/globals.css"
import PostItem from "../components/posts/PostItemHome"
import { api } from "~/trpc/react"
import Loader from "../components/shared/Loader"
import ServerError from "../components/shared/ServerError"
import useStatusMessage from "../hooks/useStatusMessage"
import StatusMessage from "../components/shared/StatusMessage"

export default function HomePage() {
    const { data: postsData, isLoading, error } = api.post.getAllPost.useQuery();

    const {
        isSuccess,
        message,
        setIsSuccess,
        setMessage,
        closeMessage
    } = useStatusMessage();
    
    if (isLoading) return <Loader />

    if (error || !postsData) return <ServerError />

    return (
        <section>

            <StatusMessage
                message={message}
                isSuccess={isSuccess}
                closeMessage={closeMessage}
            />

            <ul>
                {postsData.map((post) => {
                    return <PostItem
                        setIsSuccess={setIsSuccess}
                        setMessage={setMessage}
                        key={post.id}
                        post={post}
                    />
                })}
            </ul>
        </section>
    )
}