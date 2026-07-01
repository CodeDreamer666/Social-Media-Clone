"use client"
import StatusMessage from "~/app/components/shared/StatusMessage"
import useStatusMessage from "~/app/hooks/useStatusMessage"
import { api } from "~/trpc/react"
import Loader from "~/app/components/shared/Loader"
import ServerError from "~/app/components/shared/ServerError"
import { redirect, useParams, usePathname, useRouter } from "next/navigation"
import CommentIcon from "~/app/components/shared/CommentIcon"
import { authClient } from "~/server/better-auth/client"
import handleTRPCError from "~/app/libs/handleTRPCError"
import LoadingIcon from "~/app/components/shared/LoadingIcon"
import { useState } from "react"

export default function Page() {
    const params = useParams<{ id: string }>();
    const router = useRouter();
    const pathname = usePathname();
    const [buttonState, setButtonState] = useState<"IDLE" | "SENT" | "PENDING" | "LOADING">("IDLE");

    const {
        data: user,
        isLoading,
        error
    } = api.user.getSelectedUserInfo.useQuery({ userId: params.id });

    const {
        data: currentUser
    } = authClient.useSession();

    const {
        data: connectionState,
        isLoading: isLoadingTwo,
        error: errorTwo
    } = api.connection.connectionBetweenTwoUser.useQuery({
        userOneId: currentUser?.user.id ?? "",
        userTwoId: user && "redirecting" in user ? "" : user?.id ?? "",
    })

    const requestConnection = api.connection.requestConnecction.useMutation({
        onMutate: () => {
            setButtonState("LOADING")
        },

        onSuccess: () => {
            setButtonState("SENT");

            setTimeout(() => {
                setButtonState("PENDING");
            }, 2000);
        },

        onError: (error) => {
            setButtonState("IDLE")
            handleTRPCError({ error, setMessage, setIsSuccess, router, pathname })
        },
    });

    const {
        setIsSuccess,
        setMessage,
        isSuccess,
        message,
        closeMessage
    } = useStatusMessage();

    if (isLoading || isLoadingTwo) return <Loader />

    if (error || errorTwo || !user || !currentUser) return <ServerError />

    if ("redirecting" in user) return redirect("/profile")

    return (
        <div className="min-h-screen bg-black pb-10">
            <section className="px-4 max-w-2xl mx-auto">

                <StatusMessage
                    isSuccess={isSuccess}
                    message={message}
                    closeMessage={closeMessage}
                />

                {/* User profile information */}
                <div className="flex flex-col rounded-3xl border border-white/[0.06] bg-zinc-900/60 p-6 shadow-[0_8px_30px_rgba(0,0,0,0.35)] backdrop-blur-xl">
                    <div className="flex gap-2 items-center justify-between w-full">
                        <div className="flex gap-3 items-center">

                            <div className="flex h-14 w-14 shrink-0 text-2xl items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 font-semibold text-white shadow-md shadow-blue-500/20">
                                {user.name[0]?.toUpperCase()}
                            </div>

                            <div>
                                <h2 className="text-xl font-semibold tracking-tight text-white">
                                    {user.name}
                                </h2>
                                <p className="text-[13px] text-zinc-500">
                                    {user.username ?? `@${user.name.toLowerCase().replace(/\s/g, "")}`}
                                </p>
                            </div>
                        </div>
                    </div>

                    <p className="mt-5 max-w-lg text-[14px] leading-7 text-zinc-300">
                        {user.bio}
                    </p>

                    <button
                        type="button"
                        onClick={() => {
                            requestConnection.mutate({ responseUserId: user.id });
                        }}
                        disabled={
                            buttonState === "LOADING" ||
                            buttonState === "SENT" ||
                            buttonState === "PENDING" ||
                            connectionState?.requestUserId === currentUser.user.id
                        }
                        className={[
                            "mt-5 flex h-11 w-full disabled:cursor-not-allowed items-center justify-center rounded-full",
                            "bg-gradient-to-br from-blue-500 to-indigo-600 px-6",
                            "text-[14px] font-medium text-white shadow-md shadow-blue-500/20",
                            "transition-all duration-200 active:scale-[0.99]",
                            buttonState === "IDLE"
                                ? "cursor-pointer hover:brightness-110"
                                : "cursor-not-allowed",
                        ].join(" ")}
                    >
                        <div className="flex min-w-[150px] items-center justify-center gap-2 transition-all duration-200">
                            {buttonState === "LOADING" ? (
                                <>
                                    <LoadingIcon />
                                    <span>Sending request...</span>
                                </>
                            ) : buttonState === "SENT" ? (
                                <>
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        strokeWidth={2}
                                        stroke="currentColor"
                                        className="h-5 w-5"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            d="m4.5 12.75 6 6 9-13.5"
                                        />
                                    </svg>
                                    <span>Request sent</span>
                                </>
                            ) : buttonState === "PENDING" ||
                                connectionState?.requestUserId === currentUser.user.id ? (
                                <span>Pending</span>
                            ) : (
                                <span>Connect</span>
                            )}
                        </div>
                    </button>
                </div>

                <section className="mt-8">
                    <h2 className="mb-4 text-xl font-semibold tracking-tight text-white">
                        Posts
                    </h2>

                    {/* No Post Modal */}
                    {user.posts.length === 0 && (
                        <div className="flex flex-col items-center justify-center rounded-3xl border border-white/[0.06] bg-zinc-900/60 px-6 py-16 text-center backdrop-blur-xl">

                            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-white/5 border border-white/[0.06]">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    strokeWidth={1.5}
                                    stroke="currentColor"
                                    className="h-7 w-7 text-zinc-400"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125V5.25m-6.75 0v1.875A1.125 1.125 0 0 1 5.625 8.25h-1.5A3.375 3.375 0 0 0 .75 11.625v2.625m18 0a3 3 0 0 1-3 3h-3m6 0a3 3 0 0 1-3 3h-3m-9-6v6a3 3 0 0 0 3 3h3m-6-3a3 3 0 0 0 3 3h3"
                                    />
                                </svg>
                            </div>

                            <h2 className="mt-4 text-lg font-semibold text-white">
                                No posts yet
                            </h2>
                        </div>
                    )}

                    {/* Post content */}
                    <ul className="flex flex-col gap-3">
                        {user.posts.map((post) => {
                            return (
                                <section
                                    key={post.id}
                                    className="rounded-2xl border border-white/[0.06] bg-zinc-900/60 p-5 backdrop-blur-xl transition-colors duration-200 hover:border-white/[0.1]"
                                >
                                    <p className="text-[14px] leading-7 text-zinc-200">
                                        {post.content}
                                    </p>

                                    <div className="mt-4 flex items-center gap-6 border-t border-white/[0.06] pt-4">
                                        <CommentIcon
                                            postId={post.id}
                                        />
                                    </div>
                                </section>
                            )
                        })}
                    </ul>
                </section>
            </section>
        </div>
    )
}
