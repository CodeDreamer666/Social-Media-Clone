"use client";
import { usePathname, useRouter } from "next/navigation";
import { useRef, useState } from "react";
import type { Interests } from "../../../../generated/prisma";
import handleTRPCError from "~/lib/handleTRPCError";
import useStatusMessage from "~/lib/useStatusMessage";
import { api } from "~/trpc/react";
import {
    allowedImageTypes,
    maxImageSize,
    uploadImageResponseSchema,
} from "../utils/postUploadSchemas";

export default function useCreatePost() {
    const [postContent, setPostContent] = useState("");
    const [interest, setInterest] = useState<Interests | "">("");
    const [imageUrl, setImageUrl] = useState("");
    const [uploadedImageId, setUploadedImageId] = useState("");
    const [isImageLoading, setIsImageLoading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement | null>(null);
    const utils = api.useUtils();
    const router = useRouter();
    const pathname = usePathname();

    const statusMessage = useStatusMessage();
    const { setIsSuccess, setMessage } = statusMessage;

    const createPost = api.post.createPost.useMutation({
        onSuccess: () => {
            router.replace("/");
        },

        onError: (error) => {
            handleTRPCError({
                error,
                setMessage,
                setIsSuccess,
                router,
                pathname,
            });
        },

        onSettled: async () => {
            await utils.invalidate();
        },
    });

    const hasPostText = postContent.trim().length > 0;
    const hasPostImage = Boolean(imageUrl && uploadedImageId);

    function submitPost() {
        if (!hasPostText && !hasPostImage) {
            setIsSuccess(false);
            setMessage("Add text or an image.");
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

        if (hasPostImage) {
            createPost.mutate({
                content: postContent,
                interest,
                uploadedImageId,
            });
            return;
        }

        createPost.mutate({
            content: postContent,
            interest,
        });
    }

    async function uploadPostImage(file: File) {
        setIsImageLoading(true);

        try {
            const data = new FormData();
            const oldUploadedImageId = uploadedImageId;

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

            const json: unknown = await uploadRequest.json();
            const result = uploadImageResponseSchema.safeParse(json);

            console.log("JSON", json);
            console.log("RESULT", result);

            if (!uploadRequest.ok || !result.success) {
                setIsSuccess(false);
                setMessage("Image upload failed. Please try again.");
                return;
            }

            setImageUrl(result.data.previewUrl);
            setUploadedImageId(result.data.uploadedImageId);

            if (oldUploadedImageId) {
                await fetch("/api/files", {
                    method: "DELETE",
                    body: JSON.stringify({
                        uploadedImageId: oldUploadedImageId,
                    }),
                    headers: {
                        "Content-Type": "application/json",
                    },
                });
            }
        } catch {
            setIsSuccess(false);
            setMessage("Image upload failed. Please try again.");
        } finally {
            setIsImageLoading(false);
        }
    }

    async function cancelPost() {
        if (uploadedImageId) {
            try {
                await fetch("/api/files", {
                    method: "DELETE",
                    body: JSON.stringify({ uploadedImageId }),
                    headers: {
                        "Content-Type": "application/json",
                    },
                });
            } catch {
                // Navigation should not be blocked by best-effort orphan cleanup.
            }
        }

        router.push("/");
    }

    return {
        postContent,
        setPostContent,
        interest,
        setInterest,
        imageUrl,
        isImageLoading,
        fileInputRef,
        statusMessage,
        createPost,
        hasPostText,
        hasPostImage,
        submitPost,
        uploadPostImage,
        cancelPost,
    };
}
