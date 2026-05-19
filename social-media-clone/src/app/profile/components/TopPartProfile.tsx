type Profile = {
    user: {
        name: string;
        username: string | null;
        postsCount: number;
        bio: string;
        id: string;
    }
}

export default function TopPartProfile({ user }: Profile) {
    return (
        <>
            <div className="flex gap-2 items-center justify-between w-full">
                <div className="flex gap-2 items-center">

                    <div className="flex h-12 w-12 text-2xl items-center justify-center rounded-full bg-sky-500 font-semibold text-white">
                        {user.name[0]?.toUpperCase()}
                    </div>


                    <div>
                        <h2 className="text-2xl font-semibold text-white">
                            {user.name}
                        </h2>
                        <p className="text-sm text-neutral-400">
                            {user.username ?? `@${user.name.toLowerCase().replace(/\s/g, "")}`}
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-6">
                    <div className="text-center">
                        <h3 className="text-xl font-semibold text-white">
                            {user.postsCount}
                        </h3>

                        <p className="text-sm text-neutral-400">
                            Posts
                        </p>
                    </div>
                </div>
            </div>

            <p className="mt-5 max-w-lg text-sm text-neutral-300">
                {user.bio}
            </p>
        </>
    )
}