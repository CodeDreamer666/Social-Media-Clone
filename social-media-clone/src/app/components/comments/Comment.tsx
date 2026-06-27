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
            <div className="flex flex-col gap-3 rounded-2xl border border-white/[0.06] bg-zinc-900/60 p-4 backdrop-blur-xl">
                <div className="flex items-center gap-2.5">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 text-[13px] font-semibold text-white shadow-md shadow-blue-500/20">
                        {comment.user.name[0]?.toUpperCase()}
                    </div>
                    <div className="flex flex-col">
                        <h3 className="text-[14px] font-semibold text-white">
                            {comment.user.name}
                        </h3>
                        <p className="text-[12px] text-zinc-500">
                            {comment.user.username ?? `@${comment.user.name.toLowerCase().replace(/\s/g, "")}`} · {commentTimeAgo}
                        </p>
                    </div>
                </div>
                <p className="text-[14px] leading-7 text-zinc-200">
                    {comment.content}
                </p>
            </div>
        </section>
    )
}