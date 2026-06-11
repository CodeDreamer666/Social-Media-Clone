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
            className="mx-auto mt-4 w-[92%] max-w-112.5 rounded-3xl border border-white/[0.06] bg-zinc-900/60 p-5 shadow-[0_8px_30px_rgba(0,0,0,0.35)] backdrop-blur-xl transition-colors duration-200 hover:border-white/[0.1]"
        >

            <Link href={`/profile/${post.user.id}`} className="group">
                <div className="flex items-center gap-3">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 text-[17px] font-semibold text-white shadow-md shadow-blue-500/20">
                        {post.user.name[0]?.toUpperCase()}
                    </div>

                    <div className="min-w-0">
                        <h2 className="truncate text-[15px] font-semibold text-white transition-colors duration-200 group-hover:text-blue-400">
                            {post.user.name}
                        </h2>

                        <p className="truncate text-[13px] text-zinc-500">
                            {post.user.username ?? `@${post.user.name.toLowerCase().replace(/\s/g, "")}`} · {postTimeAgo}
                        </p>
                    </div>
                </div>
            </Link>

            <p className="mt-4 text-[15px] leading-7 text-zinc-200">
                {post.content}
            </p>

            <div className="mt-4 flex items-center gap-6 border-t border-white/[0.06] pt-4">
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

