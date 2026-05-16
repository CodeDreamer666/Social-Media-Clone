"use client"
import useTimeAgo from "~/app/hooks/useTimeAgo"
import Link from "next/link"

type Post = {
    post: {
        user: {
            id: string;
            name: string;
            username: string | null;
            createdAt: Date;
            updatedAt: Date;
            bio: string;
            followersCount: number;
            followingCount: number;
            postsCount: number;
            email: string;
            emailVerified: boolean;
            image: string | null;
            isPublic: boolean;
        };
    } & {
        id: string;
        content: string;
        userId: string;
        likeCount: number;
        commentCount: number;
        createdAt: Date;
        updatedAt: Date;
    }
}

export default function PostItemHome({ post }: Post) {
    const postTimeAgo = useTimeAgo(new Date(post.createdAt))

    return (
        <section
            className="w-full max-w-112.5 mt-4 mx-auto rounded-2xl border border-neutral-800 bg-neutral-900 p-5"
        >

            {/* User Info */}
            <Link href={`/profile/${post.id}`}>
                <div className="flex items-center gap-3">
                    <div className="flex h-11 w-11 items-center justify-center rounded-full bg-sky-500 font-semibold text-white">
                        {post.user.name[0]?.toUpperCase()}
                    </div>

                    <div>
                        <h2 className="text-lg font-semibold text-white">
                            {post.user.name}
                        </h2>

                        <p className="text-sm text-neutral-400">
                            {`${post.user.username}`} • {postTimeAgo}
                        </p>
                    </div>
                </div>
            </Link>

            {/* Content */}
            <p className="mt-4 leading-7 text-neutral-200">
                {post.content}
            </p>

            {/* Actions */}
            <div className="mt-5 flex items-center gap-6 border-t border-neutral-800 pt-4">
                <button
                    className="flex items-center gap-2 text-sm text-neutral-400 cursor-pointer transition-colors duration-200 hover:text-white"
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className={`size-6`}
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z"
                        />
                    </svg>
                    <span>{post.likeCount}</span>
                </button>

                <button
                    className="flex cursor-pointer items-center gap-2 text-neutral-400 transition-colors duration-200 hover:text-white"
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className="size-6"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M2.25 12.76c0 1.6 1.123 2.994 2.707 3.227 1.087.16 2.185.283 3.293.369V21l4.076-4.076a1.526 1.526 0 0 1 1.037-.443 48.282 48.282 0 0 0 5.68-.494c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0 0 12 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018Z"
                        />
                    </svg>
                    <span>{post.commentCount}</span>
                </button>
            </div>

        </section>
    )
}