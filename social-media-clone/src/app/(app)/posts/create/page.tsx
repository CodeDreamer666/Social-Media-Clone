"use client"
import { api } from "~/trpc/react"
import StatusMessage from "~/app/components/shared/StatusMessage";
import useStatusMessage from "~/app/hooks/useStatusMessage";
import LoadingIcon from "~/app/components/shared/LoadingIcon";
import { useState } from "react";
import Loader from "~/app/components/shared/Loader";
import ServerError from "~/app/components/shared/ServerError";
import { useRouter, usePathname } from "next/navigation";
import handleTRPCError from "~/app/libs/handleTRPCError";

export default function CreatePost() {
    const [postContent, setPostContent] = useState("");
    const utils = api.useUtils();
    const router = useRouter();
    const pathname = usePathname();
    const {
        isSuccess,
        message,
        setIsSuccess,
        setMessage,
        closeMessage
    } = useStatusMessage()

    const {
        data: currentUser,
        isLoading,
        error
    } = api.user.getUserInfo.useQuery();

    // Create post mutation
    const createPost = api.post.createPost.useMutation({
        onSuccess: (newData) => {
            router.replace("/");
        },

        onError: (error) => {
            handleTRPCError({
                error, setMessage, setIsSuccess, router, pathname
            })
        },

        onSettled: async () => {
            await utils.invalidate();
        }
    });

    if (isLoading) return <Loader />

    if (error || !currentUser) return <ServerError />

    return (
        <>
            <StatusMessage
                message={message}
                isSuccess={isSuccess}
                closeMessage={closeMessage}
            />

            <div className="mx-auto flex  w-full max-w-2xl flex-col justify-center px-4">
                <form
                    onSubmit={(event) => {
                        event.preventDefault();
                        if (!postContent.trim()) {
                            setIsSuccess(false);
                            setMessage("Post content cannot be empty");
                            return;
                        }

                        createPost.mutate({ content: postContent })
                    }}
                    className="rounded-3xl border border-white/[0.06] bg-zinc-900/60 p-6 shadow-[0_8px_30px_rgba(0,0,0,0.35)] backdrop-blur-xl"
                >

                    <div className="mb-6 flex items-center gap-3">
                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 text-xl font-semibold text-white shadow-md shadow-blue-500/20">
                            {currentUser.name[0]?.toUpperCase()}
                        </div>
                        <div>
                            <h2 className="text-[15px] font-semibold text-white">
                                {currentUser.name}
                            </h2>

                            <p className="text-[13px] text-zinc-500">
                                {currentUser.username ?? `@${currentUser.name.toLowerCase().replace(/\s/g, "")}`}
                            </p>
                        </div>
                    </div>

                    <textarea
                        value={postContent}
                        onChange={(event) => setPostContent(event.target.value)}
                        placeholder="What's happening?"
                        className="h-80 w-full resize-none bg-transparent text-[15px] leading-7 text-white outline-none placeholder:text-zinc-500"
                    />

                    <div className="mt-6 flex items-center justify-between border-t border-white/[0.06] pt-4">
                        <p className="text-[13px] text-zinc-500">
                            Keep it simple and meaningful.
                        </p>
                        <button
                            disabled={createPost.isPending || postContent === ""}
                            type="submit"
                            className="h-10 cursor-pointer rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 px-5 text-[14px] font-medium text-white shadow-md shadow-blue-500/20 transition-all duration-200 hover:brightness-110 active:scale-95 disabled:cursor-not-allowed disabled:bg-none disabled:bg-zinc-800 disabled:text-zinc-500 disabled:shadow-none"
                        >
                            {createPost.isPending ? (
                                <div className="flex items-center gap-2">
                                    <LoadingIcon />
                                    <p>Posting...</p>
                                </div>
                            ) : "Post"}
                        </button>
                    </div>

                </form>
            </div>
        </>
    )
}