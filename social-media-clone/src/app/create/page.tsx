"use client"
import { api } from "~/trpc/react"
import { authClient } from "~/server/better-auth/client";
import useStatusMessage from "../hooks/useStatusMessage";
import StatusMessage from "../components/shared/StatusMessage";
import { useRouter, usePathname } from "next/navigation"
import LoadingIcon from "../components/shared/LoadingIcon";
import { TRPCClientError } from "@trpc/client";
import { useState } from "react";

export default function CreatePost() {
    const [postContent, setPostContent] = useState("");
    const router = useRouter();
    const pathname = usePathname();
    const {
        isSuccess,
        message,
        setIsSuccess,
        setMessage,
        closeMessage
    } = useStatusMessage()
    const utils = api.useUtils();

    const createPost = api.post.createPost.useMutation({
        onSuccess: (newData) => {
            setIsSuccess(newData.success);
            setMessage(newData.message);
            setTimeout(() => {
                router.push("/");
            }, 1500)
        },

        onError: (error) => {
            if (error instanceof TRPCClientError) {
                if (error.data?.code === "UNAUTHORIZED") {
                    router.replace(`/auth?redirect=${encodeURIComponent(pathname)}`);
                    return;
                }

                setIsSuccess(false);
                setMessage(error.data.zodError[0].message ?? "Something went wrong. Please try again.");
                return;
            }
        },

        onSettled: async () => {
            await utils.post.getAllPost.invalidate()
        }
    });

    const { data: userSession } = authClient.useSession();

    if (!userSession || !userSession.user.image) return null;

    return (
        <>
            <StatusMessage
                message={message}
                isSuccess={isSuccess}
                closeMessage={closeMessage}
            />

            <div className="mx-auto w-full max-w-2xl px-4">
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
                        <img
                            className="
                         flex h-11 w-11 items-center justify-center rounded-full 
                         text-sm font-semibold text-white
                        "
                            src={userSession.user.image}
                            loading="lazy"
                            alt={`A profile picture of ${userSession.user.name}`}
                        />
                        <div>
                            <h2 className="text-sm font-semibold text-white">
                                {userSession.user.name}
                            </h2>

                            <p className="text-xs text-neutral-400">
                                @{userSession.user.name.toLowerCase().replace(/\s/g, "")}
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
                            className="h-10 disabled:cursor-not-allowed cursor-pointer rounded-xl bg-sky-500 px-5 text-sm font-medium text-white transition-colors duration-200 hover:bg-sky-400"
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