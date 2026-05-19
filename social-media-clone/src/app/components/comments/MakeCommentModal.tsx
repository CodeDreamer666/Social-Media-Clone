"use client"
import { useState } from "react"
import type { SetStateAction } from "react"
import createCommentAction from "~/app/libs/createComment"
import type { SinglePost, User } from "~/app/types/types"

type Parameter = {
    setIsOpen: React.Dispatch<SetStateAction<boolean>>,
    setMessage: React.Dispatch<SetStateAction<string>>,
    setIsSuccess: React.Dispatch<SetStateAction<boolean | "IDLE">>,
    currentUser: User,
    post: SinglePost
}

export default function MakeCommentModal({
    setIsOpen,
    currentUser,
    setIsSuccess,
    setMessage,
    post
}: Parameter) {
    const [commentContent, setCommentContent] = useState("");

    const { createComment } = createCommentAction({
        onSuccess: () => setIsOpen(false),
        setIsSuccess,
        setMessage,
        currentUserId: currentUser.id
    })

    return (
        <>
            <div className="fixed inset-0 z-9999 flex items-center justify-center bg-black/60 px-4 backdrop-blur-sm">
                <section className="w-full max-w-2xl rounded-3xl border border-neutral-800 bg-neutral-900 p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <h2 className="text-xl font-semibold text-white">
                                Add Comment
                            </h2>
                            <p className="mt-1 text-sm text-neutral-400">
                                Share your thoughts on this post.
                            </p>
                        </div>

                        <button
                            onClick={() => setIsOpen(false)}
                            className="flex cursor-pointer h-10 w-10 items-center justify-center rounded-full text-neutral-400 transition-colors duration-200 hover:bg-neutral-800 hover:text-white"
                        >
                            ✕
                        </button>
                    </div>

                    <div className="mt-6 flex items-center gap-3">
                        <div className="flex h-11 w-11 items-center justify-center rounded-full bg-sky-500 text-sm font-semibold text-white">
                            {currentUser.name[0]?.toUpperCase()}
                        </div>
                        <div>
                            <h3 className="text-sm font-semibold text-white">
                                {currentUser.name}
                            </h3>
                            <p className="text-xs text-neutral-400">
                                {currentUser.username ?? `@${currentUser.name.toLowerCase().replace(/\s/g, "")}`}
                            </p>
                        </div>
                    </div>

                    <textarea
                        value={commentContent}
                        onChange={(event) => setCommentContent(event.target.value)}
                        placeholder="Write a comment..."
                        className="mt-5 h-60 w-full resize-none bg-transparent text-[15px] leading-7 text-white outline-none placeholder:text-neutral-500"
                    />

                    <div className="mt-6 flex items-center justify-between border-t border-neutral-800 pt-4">
                        <p className="text-sm text-neutral-500">
                            Keep it respectful and meaningful.
                        </p>

                        <button
                            disabled={createComment.isPending || commentContent === ""}
                            onClick={() => createComment.mutate({ postId: post.id, commentContent })}
                            type="submit"
                            className="h-11 disabled:hover:bg-neutral-800 cursor-pointer rounded-xl bg-sky-500 px-5 text-sm font-medium text-white transition-colors duration-200 hover:bg-sky-400 disabled:cursor-not-allowed disabled:bg-neutral-800 disabled:text-neutral-500"
                        >
                            Comment
                        </button>

                    </div>
                </section>
            </div>
        </>
    )
}