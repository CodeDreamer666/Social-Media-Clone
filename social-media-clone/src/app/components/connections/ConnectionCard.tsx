type User = {
    id: string,
    name: string,
    username: string | null,
}

type ConnectionCardProps = {
    user: User,
    statusText?: string,
    primaryAction?: string,
    secondaryAction?: string,
    dangerAction?: string,
}

export default function ConnectionCard({
    user,
    primaryAction,
    secondaryAction,
    dangerAction
}: ConnectionCardProps) {
    return (
        <li
            className={[
                "rounded-2xl border border-white/[0.06] bg-black/30 p-4",
                "transition-colors duration-200 hover:border-white/[0.1]",
            ].join(" ")}
        >
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex gap-3">
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
                        <h3 className="text-[15px] font-semibold text-white">
                            {user.name}
                        </h3>
                        <p className="text-[13px] text-zinc-500">
                            {user.username ? user.username : `@${user.name.toLowerCase().replace(/\s/g, "")}`}
                        </p>
                    </div>
                </div>

                <div className="flex flex-col gap-2 sm:min-w-36">
                    {primaryAction && (
                        <button
                            type="button"
                            className={[
                                "flex h-10 cursor-pointer items-center justify-center rounded-full",
                                "bg-gradient-to-br from-blue-500 to-indigo-600 px-5",
                                "text-[14px] font-medium text-white shadow-md shadow-blue-500/20",
                                "transition-all duration-200 hover:brightness-110 active:scale-[0.99]",
                            ].join(" ")}
                        >
                            {primaryAction}
                        </button>
                    )}

                    {secondaryAction && (
                        <button
                            type="button"
                            className={[
                                "flex h-10 cursor-pointer items-center justify-center rounded-full",
                                "border border-white/[0.08] bg-white/5 px-5",
                                "text-[14px] font-medium text-white transition-colors duration-200",
                                "hover:bg-white/10 active:scale-[0.99]",
                            ].join(" ")}
                        >
                            {secondaryAction}
                        </button>
                    )}

                    {dangerAction && (
                        <button
                            type="button"
                            className={[
                                "flex h-10 cursor-pointer items-center justify-center rounded-full",
                                "border border-red-500/20 bg-red-500/10 px-5",
                                "text-[14px] font-medium text-red-200 transition-colors duration-200",
                                "hover:bg-red-500/15 active:scale-[0.99]",
                            ].join(" ")}
                        >
                            {dangerAction}
                        </button>
                    )}
                </div>
            </div>
        </li>
    )
}