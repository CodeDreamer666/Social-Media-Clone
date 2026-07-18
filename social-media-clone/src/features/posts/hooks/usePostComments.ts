"use client";
import { usePathname, useRouter } from "next/navigation";
import handleTRPCError from "~/lib/handleTRPCError";
import { api } from "~/trpc/react";

type UsePostCommentsProps = {
  setMessage: React.Dispatch<React.SetStateAction<string>>;
  setIsSuccess: React.Dispatch<React.SetStateAction<boolean | "IDLE">>;
  onSuccess: () => void;
};

export default function usePostComments({
  setMessage,
  setIsSuccess,
  onSuccess,
}: UsePostCommentsProps) {
  const utils = api.useUtils();
  const router = useRouter();
  const pathname = usePathname();

  const createComment = api.comment.createComment.useMutation({
    onSuccess: async (_data, variables) => {
      await utils.post.getSelectedPost.invalidate({
        postId: variables.postId,
      });
      onSuccess();
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
  });

  return createComment;
}
