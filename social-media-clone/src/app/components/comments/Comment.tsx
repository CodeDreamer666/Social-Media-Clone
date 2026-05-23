import useTimeAgo from "~/app/hooks/useTimeAgo"

type CommentParameter = {
    comment: {
        user: {
            name: string;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            username: string | null;
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
        content: string;
        postId: string;
        id: string;
        userId: string;
        createdAt: Date;
        updatedAt: Date;
    }
}

export default function Comment({ comment }: CommentParameter) {
    const commentTimeAgo = useTimeAgo(new Date(comment.createdAt))

    return (
        <section className="flex flex-col gap-4">
            <div className="flex gap-3 rounded-2xl border border-neutral-800 bg-neutral-900 p-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-sky-500 text-sm font-medium text-white">
                    {comment.user.name[0]?.toUpperCase()}
                </div>
                <div className="">
                    <div className="flex flex-col">
                        <h3 className="text-sm font-medium text-white">
                            {comment.user.name}
                        </h3>
                        <p className="text-xs text-neutral-500">
                            {comment.user.username ?? `@${comment.user.name.toLowerCase().replace(/\s/g, "")}`} • {commentTimeAgo}
                        </p>
                    </div>
                    <p className="mt-2 text-sm text-neutral-200">
                        {comment.content}
                    </p>
                </div>
            </div>
        </section>
    )
}