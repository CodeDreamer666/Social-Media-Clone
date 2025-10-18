import StatusMessage from "../prop/StatusMessage";
import useStatusMessage from "../hooks/useStatusMessage";
import useFetchData from "../hooks/fetchData";
import Post from "../prop/Post"
import useSendRequest from "../hooks/useSendRequest";

export default function Posts() {
    // --> /api/posts
    const [postsData, setPostsData] = useFetchData(`
        http://localhost:8000/api/get-post
        `)

    // --> /api/liked-posts
    const [likedPosts, setLikedPosts] = useFetchData(`
        http://localhost:8000/api/likes/user-like-posts
        `);

    const {
        isSuccess,
        setIsSuccess,
        isError,
        setIsError,
        message,
        setMessage,
    } = useStatusMessage();

    const { handleResponse } = useSendRequest({
        method: "POST",
        errorMessage: "Please try to like the post again",
        setIsSuccess: setIsSuccess,
        setIsError: setIsError,
        setMessage: setMessage
    })

    const likePost = (postId) => {
        handleResponse(`http://localhost:8000/api/likes/like-post/${postId}`, (data) => {
            setLikedPosts((prev) => {
                if (prev.includes(postId)) {
                    return prev.filter(id => id !== postId);
                } else {
                    return [...prev, postId];
                }
            });
            setPostsData(prev =>
                prev.map(post => post.id === postId ? { ...post, likes: data.likes } : post)
            );
        })
    }

    return (
        <section className="max-w-[1200px] mt-20 mx-auto grid md:grid-cols-2 md:gap-4 lg:grid-cols-3">

            <StatusMessage
                isSuccess={isError}
                message={message}
            />

            {postsData.map(({ id, title, user_id, details, likes, comments, username }) => {
                return (
                    <Post
                        key={id}
                        id={id}
                        user_id={user_id}
                        username={username}
                        title={title}
                        details={details}
                        likes={likes}
                        comment={comments}
                        isFilled={likedPosts.includes(id)}
                        onClick={() => likePost(id)}
                        isLink={true}
                        to={`/comments/${id}`} />
                )
            })}

            <StatusMessage
                isSuccess={isSuccess}
                message={message}
            />

        </section>
    )
}
