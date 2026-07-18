import Link from "next/link";

type EmptyPostsCardProps = {
  showCreateLink?: boolean;
};

export default function EmptyPostsCard({
  showCreateLink = false,
}: EmptyPostsCardProps) {
  return (
    <section
      className={[
        "flex flex-col items-center justify-center rounded-3xl border",
        "border-white/[0.06] bg-zinc-900/60 px-6 py-16 text-center backdrop-blur-xl",
      ].join(" ")}
    >
      <div className="flex h-14 w-14 items-center justify-center rounded-full border border-white/[0.06] bg-white/5">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="h-7 w-7 text-zinc-400"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125V5.25m-6.75 0v1.875A1.125 1.125 0 0 1 5.625 8.25h-1.5A3.375 3.375 0 0 0 .75 11.625v2.625m18 0a3 3 0 0 1-3 3h-3m6 0a3 3 0 0 1-3 3h-3m-9-6v6a3 3 0 0 0 3 3h3m-6-3a3 3 0 0 0 3 3h3"
          />
        </svg>
      </div>

      <h2 className="mt-4 text-lg font-semibold text-white">No posts yet</h2>

      {showCreateLink && (
        <>
          <p className="mt-2 text-[13px] text-zinc-500">
            Start sharing your thoughts with other people
          </p>

          <Link
            href="/posts/create"
            className={[
              "mt-6 flex h-11 cursor-pointer items-center justify-center rounded-full",
              "bg-gradient-to-br from-blue-500 to-indigo-600 px-5 text-[14px] font-medium",
              "text-white shadow-md shadow-blue-500/20 transition-all duration-200",
              "hover:brightness-110 active:scale-95",
            ].join(" ")}
          >
            Create post
          </Link>
        </>
      )}
    </section>
  );
}
