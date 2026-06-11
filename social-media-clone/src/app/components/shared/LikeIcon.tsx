type Parameter = {
    isLike: boolean,
    postLikeCount: number,
    mutation: any,
    onClickMutation: any,
}

export default function LikeIcon({
    isLike,
    postLikeCount,
    mutation,
    onClickMutation
}: Parameter) {

    return (
        <button
            disabled={mutation.isPending}
            onClick={onClickMutation}
            className="group flex cursor-pointer items-center gap-2 text-[14px] font-medium text-zinc-400 transition-colors duration-200 disabled:cursor-not-allowed disabled:opacity-50"
        >
            <svg
                xmlns="http://www.w3.org/2000/svg"
                fill={isLike ? "#ff453a" : "none"}
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className={`size-6 transition-all duration-200 ease-out group-active:scale-90 group-hover:scale-110 ${isLike ? "text-[#ff453a]" : "group-hover:text-white"}`}
            >
                <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z"
                />
            </svg>
            <span className={isLike ? "text-[#ff453a]" : "group-hover:text-white"}>{postLikeCount}</span>
        </button>
    )
}

