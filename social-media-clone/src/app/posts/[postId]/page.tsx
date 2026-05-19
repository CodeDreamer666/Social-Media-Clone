import { api } from "~/trpc/server";
import PostView from "../../components/posts/PostView";

export default async function Post({
    params
}: {
    params: Promise<{
        postId: string
    }>
}) {
    const { postId } = await params;
    const selectedPost = await api.post.getSelectedPost({ postId });

    return <PostView post={selectedPost} />
}