type LikeParameter = {
    currentUserId: string,
    isLike: boolean,
    postId: string
}

export function updatePostLike<T extends {
    id: string,
    likeCount: number,
    likes: {
        id: string,
        userId: string,
        postId: string
    }[]
}>(
    post: T,
    { currentUserId, isLike, postId }: LikeParameter
): T {
    return {
        ...post,
        likeCount: isLike
            ? post.likeCount + 1
            : post.likeCount - 1,

        likes: isLike
            ? [
                ...post.likes,
                {
                    id: crypto.randomUUID(),
                    userId: currentUserId,
                    postId
                }
            ]
            : post.likes.filter(like =>
                !(like.userId === currentUserId &&
                    like.postId === post.id)
            )
    };
}