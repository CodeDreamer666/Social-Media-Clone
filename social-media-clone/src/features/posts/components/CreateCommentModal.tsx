"use client";

import LoadingIcon from "~/components/shared/LoadingIcon";
import ModalPortal from "~/components/shared/ModalPortal";
import { COMMENT_CONTENT_MAX_LENGTH } from "~/lib/contentLimits";
import useLockBodyScroll from "~/lib/useLockBodyScroll";
import useDialogFocus from "~/lib/useDialogFocus";
import { getDisplayUsername } from "~/lib/userDisplay";
import type { RouterOutputs } from "~/trpc/react";

type CurrentUser = NonNullable<RouterOutputs["user"]["getUserInfo"]>;

type CreateCommentModalProps = {
  currentUser: CurrentUser;
  commentContent: string;
  isPending: boolean;
  onClose: () => void;
  onChangeCommentContent: (content: string) => void;
  onSubmit: () => void;
  onClick: (event: React.SyntheticEvent) => void;
};

export default function CreateCommentModal({
  currentUser,
  commentContent,
  isPending,
  onClose,
  onChangeCommentContent,
  onSubmit,
  onClick,
}: CreateCommentModalProps) {
  useLockBodyScroll(true);
  const dialogRef = useDialogFocus<HTMLElement>(onClose);

  return (
    <ModalPortal>
      <div
        onClick={onClick}
        className={[
          "fixed inset-0 z-9999 flex items-center justify-center overflow-y-auto",
          "bg-black/70 px-4 py-4 backdrop-blur-sm sm:items-center",
        ].join(" ")}
      >
        <section
          ref={dialogRef}
          tabIndex={-1}
          role="dialog"
          aria-modal="true"
          aria-labelledby="create-comment-title"
          className={[
            "max-h-[calc(100vh-2rem)] w-full max-w-2xl overflow-y-auto rounded-3xl",
            "border border-white/[0.06] bg-zinc-900/80 p-6",
            "shadow-[0_8px_30px_rgba(0,0,0,0.45)] backdrop-blur-xl",
          ].join(" ")}
        >
          <div className="flex items-center justify-between">
            <div>
              <h2
                id="create-comment-title"
                className="text-xl font-semibold tracking-tight text-white"
              >
                Add comment
              </h2>
              <p className="mt-1 text-[13px] text-zinc-500">
                Share your thoughts on this post.
              </p>
            </div>

            <button
              type="button"
              onClick={onClose}
              aria-label="Close comment form"
              className={[
                "flex h-9 w-9 cursor-pointer items-center justify-center rounded-full",
                "text-zinc-500 transition-colors duration-200 hover:bg-white/5",
                "hover:text-white",
              ].join(" ")}
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

          <div className="mt-6 flex items-center gap-3">
            <div
              className={[
                "flex h-11 w-11 shrink-0 items-center justify-center rounded-full",
                "bg-gradient-to-br from-blue-500 to-indigo-600 text-[15px] font-semibold",
                "text-white shadow-md shadow-blue-500/20",
              ].join(" ")}
            >
              {currentUser.name[0]?.toUpperCase()}
            </div>
            <div>
              <h3 className="text-[14px] font-semibold text-white">
                {currentUser.name}
              </h3>
              <p className="text-[12px] text-zinc-500">
                {getDisplayUsername(currentUser)}
              </p>
            </div>
          </div>

          <label htmlFor="comment-content" className="sr-only">
            Comment
          </label>
          <textarea
            id="comment-content"
            value={commentContent}
            onChange={(event) => onChangeCommentContent(event.target.value)}
            placeholder="Write a comment..."
            maxLength={COMMENT_CONTENT_MAX_LENGTH}
            autoFocus
            className={[
              "mt-5 h-40 w-full resize-none bg-transparent text-[15px] leading-7 text-white",
              "outline-none placeholder:text-zinc-500 focus-visible:outline-none",
            ].join(" ")}
          />

          <div
            className={[
              "xs:flex-row mt-6 flex flex-col gap-3 border-t border-white/[0.06] pt-4",
              "xs:items-center xs:justify-between",
            ].join(" ")}
          >
            <p className="text-[13px] text-zinc-500">
              Keep it respectful and meaningful.
            </p>

            <button
              disabled={isPending || commentContent.trim() === ""}
              onClick={onSubmit}
              type="submit"
              className={[
                "h-10 cursor-pointer rounded-full bg-gradient-to-br from-blue-500",
                "to-indigo-600 px-5 text-[14px] font-medium text-white shadow-md",
                "shadow-blue-500/20 transition-all duration-200 hover:brightness-110",
                "active:scale-95 disabled:cursor-not-allowed disabled:bg-none",
                "disabled:bg-zinc-800 disabled:text-zinc-500 disabled:shadow-none",
              ].join(" ")}
            >
              {isPending ? (
                <div className="flex items-center gap-2">
                  <LoadingIcon />
                  Commenting...
                </div>
              ) : (
                "Comment"
              )}
            </button>
          </div>
        </section>
      </div>
    </ModalPortal>
  );
}
