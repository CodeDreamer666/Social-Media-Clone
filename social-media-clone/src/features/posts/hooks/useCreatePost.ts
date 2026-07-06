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
    uploadImageResponseSchema
} from "../utils/postUploadSchemas";

export default function useCreatePost() {
    const [postContent, setPostContent] = useState("");
    const [interest, setInterest] = useState<Interests | "">("");
    const [imageUrl, setImageUrl] = useState("");
    const [imageCid, setImageCid] = useState("");
    const [currentImagePinataId, setCurrentImagePinataId] = useState("");
    const [isImageLoading, setIsImageLoading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement | null>(null);
    const utils = api.useUtils();
    const router = useRouter();
    const pathname = usePathname();

    const statusMessage = useStatusMessage();
    const {
        setIsSuccess,
        setMessage
    } = statusMessage;

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
                pathname
            });
        },

        onSettled: async () => {
            await utils.invalidate();
        }
    });

    const uploadImage = api.image.uploadImage.useMutation({
        onError: (error) => {
            handleTRPCError({
                error,
                setMessage,
                setIsSuccess,
                router,
                pathname
            });
        },

        onSettled: async () => {
            await utils.invalidate();
        }
    });

    const hasPostText = postContent.trim().length > 0;
    const hasPostImage = Boolean(imageUrl && imageCid);

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
                imageUrl,
                imageCid
            });
            return;
        }

        createPost.mutate({
            content: postContent,
            interest
        });
    }

    async function uploadPostImage(file: File) {
        setIsImageLoading(true);

        try {
            const data = new FormData();
            const oldImageCid = imageCid;
            const oldImageId = currentImagePinataId;

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
            });

            if (oldImageCid && oldImageId) {
                await fetch("/api/files", {
                    method: "DELETE",
                    body: JSON.stringify({
                        imageCid: oldImageCid,
                        imageId: oldImageId
                    }),
                    headers: {
                        "Content-Type": "application/json",
                    },
                });
            }
        } finally {
            setIsImageLoading(false);
        }
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
        uploadPostImage
    };
}
