import Link from "next/link";
import { getDisplayUsername } from "~/lib/userDisplay";

type ProfileSummaryCardProps = {
  user: {
    id: string;
    name: string;
    username: string | null;
    bio: string;
    isPublic: boolean;
  };
  action?: React.ReactNode;
  showEditLink?: boolean;
};

export default function ProfileSummaryCard({
  user,
  action,
  showEditLink = false,
}: ProfileSummaryCardProps) {
  return (
    <section
      className={[
        "flex flex-col rounded-3xl border border-white/[0.06] bg-zinc-900/60 p-6",
        "shadow-[0_8px_30px_rgba(0,0,0,0.35)] backdrop-blur-xl",
      ].join(" ")}
    >
      <div className="flex w-full items-center justify-between gap-2">
        <div className="flex items-center gap-3">
          <div
            className={[
              "flex h-14 w-14 shrink-0 items-center justify-center rounded-full text-2xl",
              "bg-gradient-to-br from-blue-500 to-indigo-600 font-semibold text-white",
              "shadow-md shadow-blue-500/20",
            ].join(" ")}
          >
            {user.name[0]?.toUpperCase()}
          </div>

          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="text-xl font-semibold tracking-tight text-white">
                {user.name}
              </h2>
              <span className="rounded-full border border-white/10 bg-white/5 px-2 py-1 text-[11px] font-medium text-zinc-300">
                {user.isPublic ? "Public profile" : "Private profile"}
              </span>
            </div>
            <p className="text-[13px] text-zinc-500">
              {getDisplayUsername(user)}
            </p>
          </div>
        </div>
      </div>

      <p className="mt-5 max-w-lg text-[14px] leading-7 text-zinc-300">
        {user.bio}
      </p>

      {showEditLink && (
        <Link
          href="/profile/edit"
          className={[
            "mt-5 flex h-11 w-full cursor-pointer items-center justify-center rounded-full",
            "bg-gradient-to-br from-blue-500 to-indigo-600 px-6",
            "text-[14px] font-medium text-white shadow-md shadow-blue-500/20",
            "transition-all duration-200 hover:brightness-110 active:scale-[0.99]",
          ].join(" ")}
        >
          Edit profile
        </Link>
      )}

      {action}
    </section>
  );
}
