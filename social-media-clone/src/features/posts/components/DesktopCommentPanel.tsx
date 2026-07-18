"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import StatusMessage from "~/components/shared/StatusMessage";
import useLockBodyScroll from "~/lib/useLockBodyScroll";
import useStatusMessage from "~/lib/useStatusMessage";
import useDialogFocus from "~/lib/useDialogFocus";
import { getDisplayUsername } from "~/lib/userDisplay";
import { api } from "~/trpc/react";
import usePostComments from "../hooks/usePostComments";
import Comment from "./Comment";
import CreateCommentModal from "./CreateCommentModal";

type DesktopCommentPanelProps = {
  postId: string;
  onClose: () => void;
};

const PANEL_ANIMATION_MS = 300;

export default function DesktopCommentPanel({
  postId,
  onClose,
}: DesktopCommentPanelProps) {
  const closeTimeoutRef = useRef<number | null>(null);
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const [isCreateCommentOpen, setIsCreateCommentOpen] = useState(false);
  const [commentContent, setCommentContent] = useState("");
  const panelRef = useDialogFocus<HTMLElement>();

  useLockBodyScroll(true);

  const { isSuccess, message, setIsSuccess, setMessage, closeMessage } =
    useStatusMessage();

  const {
    data: selectedPost,
    isLoading: isSelectedPostLoading,
    error: selectedPostError,
  } = api.post.getSelectedPost.useQuery({ postId });

  const {
    data: currentUser,
    isLoading: isCurrentUserLoading,
    error: currentUserError,
  } = api.user.getUserInfo.useQuery();

  const createComment = usePostComments({
    setMessage,
    setIsSuccess,
    onSuccess: () => {
      setIsCreateCommentOpen(false);
      setCommentContent("");
    },
  });

  const closePanel = useCallback(() => {
    if (isClosing) return;

    setIsCreateCommentOpen(false);
    setIsPanelOpen(false);
    setIsClosing(true);

    closeTimeoutRef.current = window.setTimeout(() => {
      onClose();
    }, PANEL_ANIMATION_MS);
  }, [isClosing, onClose]);

  useEffect(() => {
    const animationFrame = window.requestAnimationFrame(() => {
      setIsPanelOpen(true);
    });

    return () => {
      window.cancelAnimationFrame(animationFrame);

      if (closeTimeoutRef.current) {
        window.clearTimeout(closeTimeoutRef.current);
      }
    };
  }, []);

  useEffect(() => {
    function closeOnEscape(event: KeyboardEvent) {
      if (event.key === "Escape") {
        if (isCreateCommentOpen) {
          setIsCreateCommentOpen(false);
          return;
        }

        closePanel();
      }
    }

    window.addEventListener("keydown", closeOnEscape);

    return () => {
      window.removeEventListener("keydown", closeOnEscape);
    };
  }, [closePanel, isCreateCommentOpen]);

  const isLoading = isSelectedPostLoading || isCurrentUserLoading;
  const error = selectedPostError ?? currentUserError;
  const hasPostText = Boolean(selectedPost?.content.trim().length);

  return (
    <>
      <div
        className={[
          "fixed inset-0 z-[100] hidden bg-black/45 backdrop-blur-[2px]",
          "transition-opacity duration-300 ease-out lg:block",
          isPanelOpen && !isClosing ? "opacity-100" : "opacity-0",
        ].join(" ")}
        onClick={closePanel}
      >
        <aside
          ref={panelRef}
          tabIndex={-1}
          role="dialog"
          aria-modal="true"
          aria-labelledby="comments-panel-title"
          className={[
            "ml-auto flex h-full w-full max-w-xl flex-col border-l border-white/10",
            "bg-zinc-950/95 shadow-[0_8px_30px_rgba(0,0,0,0.45)]",
            "transition-transform duration-300 ease-out",
            isPanelOpen && !isClosing ? "translate-x-0" : "translate-x-full",
          ].join(" ")}
          onClick={(event) => {
            event.stopPropagation();
          }}
        >
          <StatusMessage
            isSuccess={isSuccess}
            message={message}
            closeMessage={closeMessage}
          />

          <div className="flex items-center justify-between border-b border-white/[0.06] px-6 py-5">
            <div>
              <h2
                id="comments-panel-title"
                className="text-xl font-semibold tracking-tight text-white"
              >
                Comments
              </h2>
              <p className="mt-1 text-[13px] text-zinc-500">
                Read and join the conversation.
              </p>
            </div>

            <button
              type="button"
              onClick={closePanel}
              className={[
                "flex h-9 w-9 cursor-pointer items-center justify-center rounded-full",
                "text-zinc-500 transition-colors duration-200 hover:bg-white/5",
                "hover:text-white",
              ].join(" ")}
              aria-label="Close comments"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
                className="size-4"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18 18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          <div className="flex-1 overflow-y-auto px-6 py-5">
            {isLoading && (
              <div className="flex min-h-80 flex-col items-center justify-center gap-4">
                <div className="h-9 w-9 animate-spin rounded-full border-2 border-white/[0.08] border-t-blue-500" />
                <p className="text-[13px] font-medium text-zinc-500">
                  Loading comments
                </p>
              </div>
            )}

            {error && (
              <section className="rounded-2xl border border-white/[0.06] bg-black/30 p-5 text-center">
                <p className="text-[14px] text-zinc-400">
                  Unable to load comments. Please try again.
                </p>
              </section>
            )}

            {!isLoading && !error && selectedPost && currentUser && (
              <>
                <section className="rounded-2xl border border-white/[0.06] bg-black/30 p-5">
                  <Link
                    href={`/profile/${selectedPost.user.id}`}
                    className="group"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={[
                          "flex h-10 w-10 shrink-0 items-center justify-center rounded-full",
                          "bg-gradient-to-br from-blue-500 to-indigo-600 text-[15px]",
                          "font-semibold text-white shadow-md shadow-blue-500/20",
                        ].join(" ")}
                      >
                        {selectedPost.user.name[0]?.toUpperCase()}
                      </div>

                      <div className="min-w-0">
                        <h3
                          className={[
                            "truncate text-[14px] font-semibold text-white",
                            "transition-colors duration-200 group-hover:text-blue-400",
                          ].join(" ")}
                        >
                          {selectedPost.user.name}
                        </h3>
                        <p className="truncate text-[12px] text-zinc-500">
                          {getDisplayUsername(selectedPost.user)}
                        </p>
                      </div>
                    </div>
                  </Link>

                  {hasPostText && (
                    <p className="mt-4 text-[14px] leading-7 text-zinc-200">
                      {selectedPost.content}
                    </p>
                  )}
                </section>

                <div className="mt-5 flex items-center justify-between gap-3">
                  <h3 className="text-[15px] font-semibold text-white">
                    All comments
                  </h3>
                  <button
                    type="button"
                    onClick={() => {
                      setIsCreateCommentOpen(true);
                    }}
                    className={[
                      "h-9 cursor-pointer rounded-full bg-gradient-to-br from-blue-500",
                      "to-indigo-600 px-4 text-[13px] font-medium text-white shadow-md",
                      "shadow-blue-500/20 transition-all duration-200 hover:brightness-110",
                      "active:scale-95",
                    ].join(" ")}
                  >
                    Add comment
                  </button>
                </div>

                {selectedPost.comments.length > 0 ? (
                  <ul className="mt-4 flex flex-col gap-3">
                    {selectedPost.comments.map((comment) => {
                      return <Comment key={comment.id} comment={comment} />;
                    })}
                  </ul>
                ) : (
                  <section className="mt-4 rounded-2xl border border-white/[0.06] bg-black/30 px-5 py-8 text-center">
                    <p className="text-[14px] text-zinc-500">
                      No comments yet.
                    </p>
                  </section>
                )}
              </>
            )}
          </div>
        </aside>

        {isCreateCommentOpen && currentUser && (
          <CreateCommentModal
            currentUser={currentUser}
            commentContent={commentContent}
            isPending={createComment.isPending}
            onClose={() => {
              setIsCreateCommentOpen(false);
            }}
            onChangeCommentContent={setCommentContent}
            onClick={(event: React.SyntheticEvent) => {
              event.stopPropagation();
            }}
            onSubmit={() => {
              createComment.mutate({
                postId,
                commentContent,
              });
            }}
          />
        )}
      </div>
    </>
  );
}
