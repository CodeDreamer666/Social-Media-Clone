"use client"
import { api } from "~/trpc/react";
import { useRouter, usePathname } from "next/navigation"
import { TRPCClientError } from "@trpc/client";
import type { SetStateAction } from "react";

type Parameter = {
    setMessage: React.Dispatch<SetStateAction<string>>,
    setIsSuccess: React.Dispatch<SetStateAction<boolean | "IDLE">>,
    currentUserId: string | null | undefined,
    onSuccess: () => void
}

export default function createCommentAction({
    setMessage,
    setIsSuccess,
    currentUserId,
    onSuccess
}: Parameter) {
    const utils = api.useUtils();
    const router = useRouter();
    const pathname = usePathname();

    const createComment = api.comment.createComment.useMutation({
        onSuccess: onSuccess,

        onMutate: async (newData) => {
            await utils.comment.getPostComment.cancel();

            const previousInfo = utils.comment.getPostComment.getData({ postId: newData.postId });

            utils.comment.getPostComment.setData({ postId: newData.postId }, (old) => {
                if (!old) return old;

                if (!currentUserId) return old;

                return [
                    ...old,
                    {
                        id: crypto.randomUUID(),
                        userId: currentUserId,
                        postId: newData.postId,
                        content: newData.commentContent,
                        createdAt: new Date(),
                        updatedAt: new Date()
                    }
                ]
            });

            return { previousInfo };
        },

        onError: (error, newData, context) => {
            if (context?.previousInfo) {
                utils.comment.getPostComment.setData({ postId: newData.postId }, context.previousInfo);
            }

            setIsSuccess(false);

            if (!(error instanceof TRPCClientError)) {
                setMessage("Something went wrong. Please try again.");
                return;
            }

            const code = error.data?.code;

            const zodError = error.data?.zodError;

            if (zodError) {
                setMessage(error.data.zodError[0].message ?? "Invalid input");
                return;
            }

            switch (code) {
                case "BAD_REQUEST":
                    setMessage("Invalid request.");
                    return;

                case "UNAUTHORIZED":
                    router.replace(`/auth?redirect=${encodeURIComponent(pathname)}`);
                    return;

                case "FORBIDDEN":
                    setMessage("You do not have permission to do this.");
                    return;

                case "NOT_FOUND":
                    setMessage("The requested resource was not found.");
                    return;

                case "CONFLICT":
                    setMessage("This action conflicts with existing data.");
                    return;

                case "TOO_MANY_REQUESTS":
                    setMessage("Too many requests. Please try again later.");
                    return;

                case "INTERNAL_SERVER_ERROR":
                    setMessage("Server error. Please try again later.");
                    return;

                default:
                    setMessage(error.message || "Something went wrong.");
                    return;
            }
        },

        onSettled: async () => {
            await utils.comment.getPostComment.invalidate()
        }
    });

    return { createComment }
}