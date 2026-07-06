"use client";

import Link from "next/link";
import LoadingIcon from "~/components/shared/LoadingIcon";
import { interestOptions } from "~/lib/interests";
import { getDisplayUsername } from "~/lib/userDisplay";
import type { RouterOutputs } from "~/trpc/react";
import type useCreatePost from "../hooks/useCreatePost";
import ImageUploadField from "./ImageUploadField";

type CurrentUser = NonNullable<RouterOutputs["user"]["getUserInfo"]>;
type CreatePostState = ReturnType<typeof useCreatePost>;

type CreatePostFormProps = {
    currentUser: CurrentUser;
    postState: CreatePostState;
};

export default function CreatePostForm({
    currentUser,
    postState
}: CreatePostFormProps) {
    const {
        postContent,
        setPostContent,
        interest,
        setInterest,
        imageUrl,
        isImageLoading,
        fileInputRef,
        createPost,
        hasPostText,
        hasPostImage,
        submitPost,
        uploadPostImage
    } = postState;
    const displayUsername = currentUser.username
        ? `@${currentUser.username}`
        : getDisplayUsername(currentUser);

    return (
        <div className="mx-auto max-lg:mt-8 flex w-full max-w-5xl flex-col justify-center px-4 lg:px-8 lg:py-4">
            <form
                onSubmit={(event) => {
                    event.preventDefault();
                    submitPost();
                }}
                className={[
                    "rounded-3xl border border-white/[0.06] bg-zinc-900/60 p-6",
                    "shadow-[0_8px_30px_rgba(0,0,0,0.35)] backdrop-blur-xl",
                ].join(" ")}
            >
                <div className="mb-6 flex items-center gap-3">
                    <div
                        className={[
                            "flex h-12 w-12 shrink-0 items-center justify-center rounded-full",
                            "bg-gradient-to-br from-blue-500 to-indigo-600 text-xl font-semibold",
                            "text-white shadow-md shadow-blue-500/20",
                        ].join(" ")}
                    >
                        {currentUser.name[0]?.toUpperCase()}
                    </div>
                    <div>
                        <h2 className="text-[15px] font-semibold text-white">
                            {currentUser.name}
                        </h2>

                        <p className="text-[13px] text-zinc-500">
                            {displayUsername}
                        </p>
                    </div>
                </div>

                <div>
                    <div className="mb-3">
                        <p className="text-[13px] font-medium text-zinc-300">
                            Categories
                        </p>
                        <p className="mt-1 text-[12px] text-zinc-500">
                            Choose one topic that fits your post.
                        </p>
                    </div>
                    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                        {interestOptions.map((option) => {
                            const isSelected = interest === option.value;

                            return (
                                <button
                                    key={option.value}
                                    type="button"
                                    aria-pressed={isSelected}
                                    onClick={() => {
                                        setInterest(option.value);
                                    }}
                                    className={[
                                        "min-h-11 cursor-pointer rounded-2xl border px-3 py-2",
                                        "text-center text-[13px] font-medium transition-all duration-200",
                                        "focus:outline-none focus:ring-2 focus:ring-blue-500/40",
                                        isSelected
                                            ? "border-blue-500/60 bg-blue-500/15 text-blue-100 shadow-md shadow-blue-500/10"
                                            : "border-white/[0.06] bg-black/40 text-zinc-300 hover:border-blue-500/40 hover:bg-black/50 hover:text-white",
                                    ].join(" ")}
                                >
                                    {option.label}
                                </button>
                            );
                        })}
                    </div>
                </div>


                <div className="mt-6 grid gap-5 lg:grid-cols-2 lg:items-stretch lg:gap-6">
                    <ImageUploadField
                        imageUrl={imageUrl}
                        isImageLoading={isImageLoading}
                        fileInputRef={fileInputRef}
                        onUploadImage={uploadPostImage}
                    />

                    <div className="flex flex-col">
                        <label
                            htmlFor="postContent"
                            className="mb-2 block text-[13px] font-medium text-zinc-300"
                        >
                            Post content
                        </label>

                        <textarea
                            id="postContent"
                            value={postContent}
                            onChange={(event) => setPostContent(event.target.value)}
                            placeholder="What's happening?"
                            cols={80}
                            className={[
                                "w-full flex-1 resize-none rounded-2xl border border-white/[0.06]",
                                "bg-black/40 px-4 py-3 text-[15px] leading-7 text-white",
                                "outline-none transition-colors duration-200 placeholder:text-zinc-500",
                                "focus:border-blue-500/50",
                            ].join(" ")}
                        />
                    </div>
                </div>

                <div className="mt-6 flex flex-col gap-4 border-t border-white/[0.06] pt-4 sm:flex-row sm:items-center sm:justify-between">
                    <p className="text-[13px] text-zinc-500">
                        Keep it simple and meaningful.
                    </p>
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                        <Link
                            href="/"
                            className={[
                                "flex h-10 items-center justify-center rounded-full border border-white/[0.08]",
                                "bg-white/5 px-5 text-[14px] font-medium text-white transition-colors",
                                "duration-200 hover:bg-white/10 active:scale-95",
                            ].join(" ")}
                        >
                            Cancel
                        </Link>
                        <button
                            disabled={
                                createPost.isPending ||
                                (!hasPostText && !hasPostImage) ||
                                isImageLoading ||
                                interest === ""
                            }
                            type="submit"
                            className={[
                                "h-10 cursor-pointer rounded-full bg-gradient-to-br from-blue-500",
                                "to-indigo-600 px-5 text-[14px] font-medium text-white shadow-md",
                                "shadow-blue-500/20 transition-all duration-200 hover:brightness-110",
                                "active:scale-95 disabled:cursor-not-allowed disabled:bg-none",
                                "disabled:bg-zinc-800 disabled:text-zinc-500 disabled:shadow-none",
                            ].join(" ")}
                        >
                            {createPost.isPending ? (
                                <div className="flex items-center gap-2">
                                    <LoadingIcon />
                                    <p>Posting...</p>
                                </div>
                            ) : "Post"}
                        </button>
                    </div>
                </div>
            </form>
        </div>
    );
}
