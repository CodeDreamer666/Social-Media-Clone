import Link from "next/link";
import { getDisplayUsername } from "~/lib/userDisplay";

type ConnectionUserRowProps = {
  href: string;
  user: {
    id: string;
    name: string;
    username: string | null;
  };
  actions: React.ReactNode;
};

export default function ConnectionUserRow({
  href,
  user,
  actions,
}: ConnectionUserRowProps) {
  return (
    <li
      className={[
        "flex min-h-[9.5rem] rounded-2xl border border-white/[0.06] bg-black/30 p-4",
        "transition-colors duration-200 hover:border-white/[0.1]",
      ].join(" ")}
    >
      <div className="flex w-full flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <Link href={href} className="group flex gap-3">
          <div
            className={[
              "flex h-12 w-12 shrink-0 items-center justify-center rounded-full",
              "bg-gradient-to-br from-blue-500 to-indigo-600 text-lg",
              "font-semibold text-white shadow-md shadow-blue-500/20",
            ].join(" ")}
          >
            {user.name[0]?.toUpperCase()}
          </div>

          <div>
            <h3
              className={[
                "text-[15px] font-semibold text-white transition-colors duration-200",
                "group-hover:text-blue-400",
              ].join(" ")}
            >
              {user.name}
            </h3>
            <p className="text-[13px] text-zinc-500">
              {getDisplayUsername(user)}
            </p>
          </div>
        </Link>

        <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
          {actions}
        </div>
      </div>
    </li>
  );
}
