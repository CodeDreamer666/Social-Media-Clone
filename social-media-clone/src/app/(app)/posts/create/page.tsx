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

            <div className="mx-auto w-full max-w-2xl min-h-[85vh] flex flex-col justify-center px-4">
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
                    className="rounded-3xl border border-neutral-800 bg-neutral-900 p-6"
                >

                    <div className="mb-6 flex items-center gap-3">
                        <div className="flex h-12 w-12 text-2xl items-center justify-center rounded-full bg-sky-500 font-semibold text-white">
                            C
                        </div>
                        <div>
                            <h2 className="text-sm font-semibold text-white">
                                {currentUser.name}
                            </h2>

                            <p className="text-xs text-neutral-400">
                                {currentUser.username ?? `@${currentUser.name.toLowerCase().replace(/\s/g, "")}`}
                            </p>
                        </div>
                    </div>

                    <textarea
                        value={postContent}
                        onChange={(event) => setPostContent(event.target.value)}
                        placeholder="What’s happening?"
                        className="h-80 w-full resize-none bg-transparent text-[15px] leading-7 text-white outline-none placeholder:text-neutral-500"
                    />

                    <div className="mt-6 flex items-center justify-between border-t border-neutral-800 pt-4">
                        <p className="text-sm text-neutral-500">
                            Keep it simple and meaningful.
                        </p>
                        <button
                            disabled={createPost.isPending || postContent === ""}
                            type="submit"
                            className="h-10 disabled:bg-neutral-800 disabled:text-neutral-500 disabled:hover:bg-neutral-800 disabled:cursor-not-allowed cursor-pointer rounded-xl bg-sky-500 px-5 text-sm font-medium text-white transition-colors duration-200 hover:bg-sky-400"
                        >
                            {createPost.isPending ? (
                                <div className="flex gap-2 items-center">
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