"use client";
import useTimeAgo from "~/lib/useTimeAgo";
import Link from "next/link";
import Image from "next/image";
import CommentIcon from "~/components/shared/CommentIcon";
import { getDisplayUsername } from "~/lib/userDisplay";
import { getInterestLabel } from "~/lib/interests";

type Post = {
  post: {
    user: {
      id: string;
      name: string;
      username: string | null;
      isPublic: boolean;
    };
  } & {
    id: string;
    content: string;
    interest: string | null;
    imageUrl: string | null;
    userId: string;
    createdAt: Date;
    updatedAt: Date;
  };
  onOpenDesktopComments?: (postId: string) => void;
};

export default function PostItem({ post, onOpenDesktopComments }: Post) {
  const postTimeAgo = useTimeAgo(new Date(post.createdAt));
  const hasPostText = post.content.trim().length > 0;

  return (
    <section
      className={[
        "mx-auto mt-4 w-[92%] max-w-112.5 rounded-3xl border border-white/[0.06]",
        "lg:mt-0 lg:w-full lg:max-w-none",
        "bg-zinc-900/60 p-5 shadow-[0_8px_30px_rgba(0,0,0,0.35)] backdrop-blur-xl",
        "transition-colors duration-200 hover:border-white/[0.1]",
      ].join(" ")}
    >
      <Link href={`/profile/${post.user.id}`} className="group">
        <div className="flex items-center gap-3">
          <div
            className={[
              "flex h-11 w-11 shrink-0 items-center justify-center rounded-full",
              "bg-gradient-to-br from-blue-500 to-indigo-600 text-[17px] font-semibold",
              "text-white shadow-md shadow-blue-500/20",
            ].join(" ")}
          >
            {post.user.name[0]?.toUpperCase()}
          </div>

          <div className="min-w-0">
            <h2
              className={[
                "truncate text-[15px] font-semibold text-white transition-colors duration-200",
                "group-hover:text-blue-400",
              ].join(" ")}
            >
              {post.user.name}
            </h2>

            <p className="truncate text-[13px] text-zinc-500">
              {getDisplayUsername(post.user)} · {postTimeAgo}
            </p>
          </div>
        </div>
      </Link>

      <div className="mt-4 flex flex-wrap items-center gap-2 text-[12px] font-medium">
        <span className="rounded-full border border-blue-500/20 bg-blue-500/10 px-3 py-1 text-blue-100">
          {getInterestLabel(post.interest)}
        </span>
        <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-zinc-300">
          {post.user.isPublic ? "Public post" : "Connections only"}
        </span>
      </div>

      {hasPostText && (
        <p className="mt-4 text-[15px] leading-7 text-zinc-200">
          {post.content}
        </p>
      )}

      {post.imageUrl && (
        <div className="mt-4 overflow-hidden rounded-2xl border border-white/[0.06] bg-black/30">
          <Image
            src={post.imageUrl}
            alt="Post image"
            width={1200}
            height={900}
            className="max-h-[520px] w-full object-contain"
            unoptimized
          />
        </div>
      )}

      <div className="mt-4 flex items-center justify-end gap-6 border-t border-white/[0.06] pt-4">
        <CommentIcon
          postId={post.id}
          onOpenDesktopComments={onOpenDesktopComments}
        />
      </div>
    </section>
  );
}
