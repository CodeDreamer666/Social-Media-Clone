"use client"
import { useRouter, usePathname } from "next/navigation"
import type { SetStateAction } from "react"
import { authClient } from "~/server/better-auth/client"
import CommentIcon from "../../components/shared/CommentIcon"
import LikeIcon from "../../components/shared/LikeIcon"
import Loader from "../../components/shared/Loader"
import { useEffect } from "react"

type Post = {
    post: {
        comments: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            userId: string;
            content: string;
            postId: string;
        }[];
        likes: {
            id: string;
            userId: string;
            postId: string;
        }[];
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        content: string;
        likeCount: number;
        commentCount: number;
    },
    setMessage: React.Dispatch<SetStateAction<string>>,
    setIsSuccess: React.Dispatch<SetStateAction<boolean | "IDLE">>,
}

export default function ProfilePost({
    post,
    setIsSuccess,
    setMessage,
}: Post) {
    const router = useRouter();
    const pathname = usePathname();

    const { data: currentUser, isPending } = authClient.useSession();

    useEffect(() => {
        if (isPending) return;

        if (!currentUser) {
            router.replace(`/auth?redirect=${encodeURIComponent(pathname)}`);
        }
    }, [currentUser, isPending, pathname, router]);

    if (isPending || !currentUser) {
        return <Loader />
    }

    let isLike = post.likes.some((like) => {
        return like.postId === post.id && like.userId === currentUser.user.id
    });

    return (
        <section className="rounded-2xl border border-neutral-800 bg-neutral-900 p-5">
            <p className="text-sm leading-7 text-neutral-200">
                {post.content}
            </p>

            <div className="mt-5 flex items-center gap-6 border-t border-neutral-800 pt-4">
                <LikeIcon
                    postLikeCount={post.likeCount}
                    setIsSuccess={setIsSuccess}
                    setMessage={setMessage}
                    isLike={!isLike}
                    postId={post.id}
                    currentUserId={currentUser.user.id}
                />

                <CommentIcon
                    postCommentCount={post.commentCount}
                    postId={post.id}
                />
            </div>
        </section>
    )
}