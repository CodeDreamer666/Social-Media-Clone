export function getProtectedPostImageUrl(postId: string, hasImage: boolean) {
  return hasImage ? `/api/images/${encodeURIComponent(postId)}` : null;
}

export function protectPostImage<
  Post extends { id: string; imageUrl: string | null },
>(post: Post): Post {
  return {
    ...post,
    imageUrl: getProtectedPostImageUrl(post.id, Boolean(post.imageUrl)),
  };
}
