"use client"
import { api } from "~/trpc/react"
import StatusMessage from "~/app/components/shared/StatusMessage";
import useStatusMessage from "~/app/hooks/useStatusMessage";
import LoadingIcon from "~/app/components/shared/LoadingIcon";
import { useState, useRef } from "react";
import Loader from "~/app/components/shared/Loader";
import ServerError from "~/app/components/shared/ServerError";
import { useRouter, usePathname } from "next/navigation";
import handleTRPCError from "~/app/libs/handleTRPCError";
import { Interests } from "../../../../../generated/prisma";
import { z } from "zod"

export default function CreatePost() {
    const [postContent, setPostContent] = useState("");
    const [interest, setInterest] = useState<Interests | "">("");
    const [imageUrl, setImageUrl] = useState("");
    const [imageCid, setImageCid] = useState("");
    const [currentImagePinataId, setCurrentImagePinataId] = useState("");
    const [isImageLoading, setIsImageLoading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement | null>(null)
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

    const uploadImage = api.image.uploadImage.useMutation({
        onError: (error) => {
            handleTRPCError({
                error, setMessage, setIsSuccess, router, pathname
            })
        },

        onSettled: async () => {
            await utils.invalidate();
        }
    })

    const username = `@${currentUser?.username}` || `@${currentUser?.name.toLowerCase().replace(/\s/g, "")}`
    const allowedImageTypes = ["image/jpeg", "image/png", "image/webp"];
    const maxImageSize = 5 * 1024 * 1024; // 5MB
    const uploadImageResponseSchema = z.object({
        imageUrl: z.string().nonempty().url(),
        imageCid: z.string().nonempty(),
        imageId: z.string().nonempty()
    })

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


                        if (interest === "") {
                            setIsSuccess(false);
                            setMessage("Please choose a post interest.");
                            return;
                        }

                        if (isImageLoading) {
                            setIsSuccess(false);
                            setMessage("Please wait for the image to finish uploading.");
                            return;
                        }

                        createPost.mutate({ content: postContent, interest, imageUrl, imageCid })
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
                                {username}
                            </p>
                        </div>
                    </div>

                    <div className="mt-6 grid gap-5">
                        <div>
                            <label
                                htmlFor="interest"
                                className="mb-2 block text-[13px] font-medium text-zinc-300"
                            >
                                Post interest
                            </label>
                            <select
                                id="interest"
                                value={interest}
                                onChange={(event) => {
                                    setInterest(event.target.value as Interests || "");
                                }}
                                className={[
                                    "w-full cursor-pointer rounded-2xl border border-white/6",
                                    "bg-black/40 px-4 py-3 text-[14px] text-white outline-none",
                                    "transition-colors duration-200 scheme-dark",
                                    "focus:border-blue-500/50",
                                ].join(" ")}
                            >
                                <option value="">Choose the topic that fits your post</option>
                                <option value="Coding">Coding</option>
                                <option value="Design">Design</option>
                                <option value="Psychology">Psychology</option>
                                <option value="Finance">Finance</option>
                                <option value="Books">Books</option>
                                <option value="Study">Study</option>
                                <option value="Productivity">Productivity</option>
                                <option value="Life_thoughts">Life thoughts</option>
                                <option value="Business">Business</option>
                                <option value="Art">Art</option>
                                <option value="Technology">Technology</option>
                                <option value="Self_improvement">Self improvement</option>
                            </select>
                        </div>

                        <div>
                            <div className="mb-2 flex items-center justify-between gap-3">
                                <label
                                    htmlFor="postAttachment"
                                    className="block text-[13px] font-medium text-zinc-300"
                                >
                                    Attachment
                                </label>
                                <span className="text-[12px] text-zinc-500">
                                    Optional
                                </span>
                            </div>
                            <div
                                className={[
                                    "rounded-2xl border border-dashed border-white/[0.1]",
                                    "bg-black/40 p-4 transition-colors duration-200",
                                    "hover:border-blue-500/40 hover:bg-black/50",
                                ].join(" ")}
                            >
                                <div className="flex min-h-52 items-center justify-center overflow-hidden rounded-xl border border-white/[0.06] bg-zinc-950/70">
                                    {imageUrl ? (
                                        <img
                                            src={imageUrl}
                                            alt="Uploaded post image preview"
                                            className="max-h-80 w-full object-contain"
                                        />
                                    ) : (
                                        <div className="px-6 py-12 text-center">
                                            <p className="text-[14px] font-medium text-zinc-300">
                                                No image selected
                                            </p>
                                            <p className="mt-2 text-[13px] text-zinc-500">
                                                Upload an image if your post needs one.
                                            </p>
                                        </div>
                                    )}
                                </div>
                                <div className="flex justify-center items-center">
                                    <input
                                        ref={fileInputRef}
                                        id="postAttachment"
                                        type="file"
                                        disabled={isImageLoading}
                                        accept={allowedImageTypes.join(",")}
                                        className="hidden"
                                        onChange={async (event) => {
                                            setIsImageLoading(true)

                                            const file = event.target.files?.[0]
                                            const data = new FormData();
                                            const oldImageCid = imageCid;
                                            const oldImageId = currentImagePinataId

                                            if (!file) {
                                                return;
                                            }

                                            if (!allowedImageTypes.includes(file.type)) {
                                                setIsSuccess(false);
                                                setMessage("Only JPG, PNG, and WebP images are allowed.");
                                                return;
                                            }

                                            if (file.size > maxImageSize) {
                                                setIsSuccess(false);
                                                setMessage("Image must be smaller than 5MB.");
                                                return;
                                            }

                                            data.set("file", file);

                                            const uploadRequest = await fetch("/api/files", {
                                                method: "POST",
                                                body: data,
                                            });

                                            const json = await uploadRequest.json();

                                            const result = uploadImageResponseSchema.safeParse(json);

                                            if (!result.success) {
                                                setIsSuccess(false);
                                                setMessage("Server error");
                                                return;
                                            }

                                            setImageUrl(result.data.imageUrl);
                                            setImageCid(result.data.imageCid);
                                            setCurrentImagePinataId(result.data.imageId);

                                            uploadImage.mutate({
                                                imageUrl: result.data.imageUrl,
                                                imageCid: result.data.imageCid,
                                                imageId: result.data.imageId
                                            })

                                            if (oldImageCid && oldImageId) {
                                                await fetch("/api/files", {
                                                    method: "DELETE",
                                                    body: JSON.stringify({ imageCid: oldImageCid, imageId: oldImageId }),
                                                    headers: {
                                                        "Content-Type": "application/json",
                                                    },
                                                });
                                            }

                                            setIsImageLoading(false);
                                        }}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => {
                                            fileInputRef.current?.click()
                                        }}
                                        disabled={isImageLoading}
                                        className={[
                                            "mt-4 h-10 cursor-pointer disabled:cursor-not-allowed rounded-full border border-white/[0.08]",
                                            "bg-white/5 px-5 text-[14px] font-medium text-white",
                                            "transition-colors duration-200 hover:bg-white/10 active:scale-95",
                                        ].join(" ")}
                                    >
                                        {imageUrl ?
                                            isImageLoading ? "Changing image..." : "Change image"
                                            : isImageLoading ? "Uploading image..." : "Upload image"
                                        }
                                    </button>
                                </div>
                            </div>
                        </div>

                        <div>
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
                                className={[
                                    "h-40 w-full resize-none rounded-2xl border border-white/[0.06]",
                                    "bg-black/40 px-4 py-3 text-[15px] leading-7 text-white",
                                    "outline-none transition-colors duration-200 placeholder:text-zinc-500",
                                    "focus:border-blue-500/50",
                                ].join(" ")}
                            />
                        </div>
                    </div>

                    <div className="mt-6 flex items-center justify-between border-t border-white/[0.06] pt-4">
                        <p className="text-[13px] text-zinc-500">
                            Keep it simple and meaningful.
                        </p>
                        <button
                            disabled={
                                createPost.isPending
                                || postContent === ""
                                || !isImageLoading
                                || interest === ""
                            }
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
