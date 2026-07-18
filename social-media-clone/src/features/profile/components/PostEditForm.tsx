"use client";
import useTimeAgo from "~/lib/useTimeAgo";
import { api } from "~/trpc/react";
import { useState, type SetStateAction } from "react";
import { useRouter, usePathname } from "next/navigation";
import LoadingIcon from "~/components/shared/LoadingIcon";
import handleTRPCError from "~/lib/handleTRPCError";
import PostImage from "~/features/posts/components/PostImage";
import DeletePostConfirmationModal from "./DeletePostConfirmationModal";
import { getInterestLabel } from "~/lib/interests";

type Post = {
  post: {
    id: string;
    userId: string;
    content: string;
    imageUrl: string | null;
    interest: string | null;
    createdAt: Date;
    updatedAt: Date;
  };
  setIsSuccess: React.Dispatch<SetStateAction<boolean | "IDLE">>;
  setMessage: React.Dispatch<SetStateAction<string>>;
};

export default function PostEditForm({ post, setIsSuccess, setMessage }: Post) {
  const postTimeAgo = useTimeAgo(new Date(post.createdAt));
  const utils = api.useUtils();
  const router = useRouter();
  const pathname = usePathname();
  const [isConfirmingDelete, setIsConfirmingDelete] = useState(false);
  const hasPostText = post.content.trim().length > 0;

  // Edit user post mutation
  const editUserPosts = api.user.editUserPosts.useMutation({
    onSuccess: (newData) => {
      setIsSuccess(newData.success);
      setMessage(newData.message);
      setIsConfirmingDelete(false);
    },

    onMutate: async (newData) => {
      await utils.user.getUserInfo.cancel();

      const previousUserInfo = utils.user.getUserInfo.getData();

      utils.user.getUserInfo.setData(undefined, (old) => {
        if (!old) return old;

        return {
          ...old,
          posts: old.posts.filter((post) => post.id !== newData.postId),
        };
      });

      return { previousUserInfo };
    },

    onError: (error, newData, context) => {
      if (context?.previousUserInfo) {
        utils.user.getUserInfo.setData(undefined, context.previousUserInfo);
      }

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

  return (
    <>
      <section className="rounded-2xl border border-white/[0.06] bg-black/30 p-5">
        <span className="mb-3 inline-flex rounded-full border border-blue-500/20 bg-blue-500/10 px-3 py-1 text-[12px] font-medium text-blue-100">
          {getInterestLabel(post.interest)}
        </span>

        {hasPostText && (
          <p className="text-[14px] leading-7 text-zinc-200">{post.content}</p>
        )}

        {post.imageUrl && <PostImage imageUrl={post.imageUrl} />}

        <div className="mt-4 flex items-center justify-between border-t border-white/[0.06] pt-4">
          <span className="text-[12px] text-zinc-500">
            Posted {postTimeAgo} ago
          </span>

          <button
            disabled={editUserPosts.isPending}
            onClick={() => setIsConfirmingDelete(true)}
            className={[
              "text-[13px] disabled:bg-zinc-800 disabled:text-zinc-500",
              "font-medium disabled:cursor-not-allowed disabled:hover:bg-zinc-800",
              "cursor-pointer rounded-full bg-[#ff453a]/10 px-4 py-2 text-[#ff453a]",
              "transition-all duration-200 hover:bg-[#ff453a]/20",
            ].join(" ")}
          >
            {editUserPosts.isPending ? (
              <div className="flex items-center gap-2">
                <LoadingIcon />
                <p>Removing...</p>
              </div>
            ) : (
              "Remove"
            )}
          </button>
        </div>
      </section>

      {isConfirmingDelete && (
        <DeletePostConfirmationModal
          isPending={editUserPosts.isPending}
          onCancel={() => setIsConfirmingDelete(false)}
          onConfirm={() => {
            editUserPosts.mutate({ postId: post.id });
          }}
        />
      )}
    </>
  );
}
