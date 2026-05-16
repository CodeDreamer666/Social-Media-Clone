"use client"
import "~/styles/globals.css"
import PostItemHome from "./components/posts/PostItemHome"
import { useState } from "react"
import { api } from "~/trpc/react"
import Loader from "./components/shared/Loader"
import ServerError from "./components/shared/ServerError"

export default function HomePage() {
  const [isLike, setIsLike] = useState(false);
  const { data: postsData, isLoading, error } = api.post.getAllPost.useQuery();

  if (isLoading) return <Loader />

  if (error || !postsData) return <ServerError />

  return (
    <section>
      <ul>
        {postsData.map((post) => {
          return <PostItemHome
            key={post.id}
            post={post}
          />
        })}
      </ul>
    </section>
  )
}