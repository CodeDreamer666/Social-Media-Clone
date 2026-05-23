"use client"
import useTimeAgo from "~/app/hooks/useTimeAgo"
import Link from "next/link"
import type { SinglePost } from "~/app/types/types"
import CommentIcon from "../shared/CommentIcon"
import LikeIcon from "../shared/LikeIcon"

type Post = {
    post: SinglePost,
    mutation: any,
    onClickMutation: any,
    isLike: boolean
}

export default function PostItem({
    post,
    mutation,
    onClickMutation,
    isLike
}: Post) {
    const postTimeAgo = useTimeAgo(new Date(post.createdAt))

    return (
        <section
            className="w-[90%] max-w-112.5 mt-4 mx-auto rounded-2xl border border-neutral-800 bg-neutral-900 p-5"
        >

            <Link href={`/profile/${post.user.id}`}>
                <div className="flex items-center gap-3">
                    <div className="flex h-11 w-11 items-center justify-center rounded-full bg-sky-500 font-semibold text-white">
                        {post.user.name[0]?.toUpperCase()}
                    </div>

                    <div>
                        <h2 className="text-lg font-semibold text-white">
                            {post.user.name}
                        </h2>

                        <p className="text-sm text-neutral-400">
                            {post.user.username ?? `@${post.user.name.toLowerCase().replace(/\s/g, "")}`} • {postTimeAgo}
                        </p>
                    </div>
                </div>
            </Link>

            <p className="mt-4 leading-7 text-neutral-200">
                {post.content}
            </p>

            <div className="mt-5 flex items-center gap-6 border-t border-neutral-800 pt-4">
                <LikeIcon
                    postLikeCount={post.likeCount}
                    isLike={isLike}
                    mutation={mutation}
                    onClickMutation={onClickMutation}
                />

                <CommentIcon
                    postCommentCount={post.commentCount}
                    postId={post.id}
                />
            </div>
        </section>
    )
}