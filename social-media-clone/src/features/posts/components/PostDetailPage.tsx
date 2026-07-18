"use client";

import { useParams } from "next/navigation";
import { useState } from "react";
import Loader from "~/components/shared/Loader";
import ServerError from "~/components/shared/ServerError";
import StatusMessage from "~/components/shared/StatusMessage";
import useStatusMessage from "~/lib/useStatusMessage";
import { api } from "~/trpc/react";
import usePostComments from "../hooks/usePostComments";
import Comment from "./Comment";
import CreateCommentModal from "./CreateCommentModal";
import PostItem from "./PostItem";

export default function PostDetailPage() {
  const [isOpen, setIsOpen] = useState(false);
  const [commentContent, setCommentContent] = useState("");
  const params = useParams<{ postId: string }>();
  const { isSuccess, message, setIsSuccess, setMessage, closeMessage } =
    useStatusMessage();

  const {
    data: selectedPost,
    isLoading: isSelectedPostLoading,
    error: selectedPostError,
  } = api.post.getSelectedPost.useQuery({ postId: params.postId });

  const {
    data: currentUser,
    isLoading: isCurrentUserLoading,
    error: currentUserError,
  } = api.user.getUserInfo.useQuery();

  const createComment = usePostComments({
    setMessage,
    setIsSuccess,
    onSuccess: () => {
      setIsOpen(false);
      setCommentContent("");
    },
  });

  const isLoading = isSelectedPostLoading || isCurrentUserLoading;
  const error = selectedPostError ?? currentUserError;

  if (isLoading) return <Loader />;

  if (error || !currentUser || !selectedPost) return <ServerError />;

  return (
    <>
      <StatusMessage
        message={message}
        isSuccess={isSuccess}
        closeMessage={closeMessage}
      />

      <main className="min-h-screen bg-black px-4 pt-4 pb-10 sm:px-6 lg:px-8">
        <div className="mx-auto w-full max-w-3xl">
          <PostItem post={selectedPost} />

          <section className="mt-6 w-full">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-[15px] font-semibold text-white">Comments</h2>
              <button
                onClick={() => setIsOpen(true)}
                className={[
                  "h-9 cursor-pointer rounded-full bg-gradient-to-br from-blue-500",
                  "to-indigo-600 px-4 text-[13px] font-medium text-white shadow-md",
                  "shadow-blue-500/20 transition-all duration-200 hover:brightness-110",
                  "active:scale-95",
                ].join(" ")}
              >
                Make a comment
              </button>
            </div>

            <ul className="flex flex-col gap-3">
              {selectedPost.comments.map((comment) => {
                return <Comment key={comment.id} comment={comment} />;
              })}
            </ul>
          </section>
        </div>

        {isOpen && (
          <CreateCommentModal
            currentUser={currentUser}
            commentContent={commentContent}
            isPending={createComment.isPending}
            onClose={() => setIsOpen(false)}
            onChangeCommentContent={setCommentContent}
            onClick={(event: React.SyntheticEvent) => {
              event.stopPropagation();
            }}
            onSubmit={() => {
              createComment.mutate({
                postId: params.postId,
                commentContent,
              });
            }}
          />
        )}
      </main>
    </>
  );
}
