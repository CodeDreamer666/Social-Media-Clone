import changePostLikeStateAction from "~/app/libs/changePostLikeState"
import changePostLikeStateProfileAction from "~/app/libs/profile/changePostLikeStateProfile"
import changePostLikeStateSelectedProfileAction from "~/app/libs/profile/changePostLikeStateSelectedProfile"
import changePostLikeStateCommentAction from "~/app/libs/comment/changePostLikeStateComment"
import type { SetStateAction } from "react"

type Parameter = {
    isLike: boolean,
    postLikeCount: number,
    setMessage: React.Dispatch<SetStateAction<string>>,
    setIsSuccess: React.Dispatch<SetStateAction<boolean | "IDLE">>,
    currentUserId: string | null | undefined,
    postId: string,
    typeOfQuery?: "post" | "ownerProfile" | "othersProfile" | "comment",
    profileUserId?: string
}

export default function LikeIcon({
    isLike,
    postLikeCount,
    setIsSuccess,
    setMessage,
    currentUserId,
    postId,
    typeOfQuery,
    profileUserId
}: Parameter) {

    let disabled: any;
    let onClick: any;

    const { changePostLikeState } = changePostLikeStateAction({
        setIsSuccess,
        setMessage,
        currentUserId
    });

    const { changePostLikeStateProfile } = changePostLikeStateProfileAction({
        setIsSuccess,
        setMessage,
        currentUserId
    });

    const { changePostLikeStateSelectedProfile } = changePostLikeStateSelectedProfileAction({
        setIsSuccess,
        setMessage,
        currentUserId,
        profileUserId
    });

    const { changePostLikeStateComment } = changePostLikeStateCommentAction({
        setIsSuccess,
        setMessage,
        currentUserId,
        postId
    })

    if (typeOfQuery === "post") {
        disabled = changePostLikeState.isPending;
        onClick = () => changePostLikeState.mutate({ postId, isLike: !isLike })

    } else if (typeOfQuery === "ownerProfile") {
        disabled = changePostLikeStateProfile.isPending;
        onClick = () => changePostLikeStateProfile.mutate({ postId, isLike: !isLike })

    } else if (typeOfQuery === "othersProfile") {
        disabled = changePostLikeStateSelectedProfile.isPending;
        onClick = () => changePostLikeStateSelectedProfile.mutate({ postId, isLike: !isLike })

    } else if (typeOfQuery === "comment") {
        disabled = changePostLikeStateComment.isPending;
        onClick = () => changePostLikeStateComment.mutate({ postId, isLike: !isLike })
    }
    else {
        disabled = undefined
        onClick = undefined
    }

    return (
        <button
            disabled={disabled}
            onClick={onClick}
            className="flex disabled:text-neutral-500 disabled:cursor-not-allowed items-center gap-2 text-sm text-neutral-400 cursor-pointer transition-colors duration-200 hover:text-white"
        >
            <svg
                xmlns="http://www.w3.org/2000/svg"
                fill={isLike ? "red" : "none"}
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className={`size-6 ${isLike ? "text-red-500" : ""}`}
            >
                <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z"
                />
            </svg>
            <span>{postLikeCount}</span>
        </button>
    )
}