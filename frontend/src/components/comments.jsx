import Header from "./header";
import { useParams, Link } from "react-router-dom";
import useFetchData from "../hooks/fetchData.jsx";
import useStatusMessage from "../hooks/useStatusMessage.jsx";
import StatusMessage from "../prop/StatusMessage.jsx";
import Post from "../prop/Post.jsx";
import Comment from "../prop/Comment.jsx";
import useSendRequest from "../hooks/useSendRequest.jsx";

export default function Comments() {
    const { postId } = useParams();

    // --> /api/liked-commments
    const [alreadyLikedComments, setAlreadyLikedComments] = useFetchData(`
        http://localhost:8000/api/comments-likes/user-like-comments
        `)

    const {
        isSuccess,
        setIsSuccess,
        isError,
        setIsError,
        message,
        setMessage,
    } = useStatusMessage();

    // --> /api/comments/:postId
    const [commentPostData, setCommentPostData] = useFetchData(`
        http://localhost:8000/api/comments/post/${postId}
        `);

    // --> /api/comments/:postId
    const [commentsData, setCommentData] = useFetchData(`
        http://localhost:8000/api/comments/${postId}
        `);

    const { handleResponse } = useSendRequest({
        method: "POST",
        errorMessage: "Please sign in or login to like the comment",
        setIsSuccess: setIsSuccess,
        setIsError: setIsError,
        setMessage: setMessage
    })

    const likeComment = (commentId) => {
        handleResponse(`http://localhost:8000/api/comments-likes/like-comment/${commentId}`, (data) => {
            setAlreadyLikedComments(prev => {
                if (prev.includes(commentId)) {
                    return prev.filter(id => id !== commentId);
                } else {
                    return [...prev, commentId]
                }
            });
            setCommentData(prev => {
                return prev.map((comment) => {
                    if (Number(comment.id) === Number(commentId)) {
                        return {
                            ...comment,
                            likes: data.likes
                        }
                    } else {
                        return comment;
                    }
                })
            })
        })
    }

    console.log("COMMENTS DATA:", commentsData);

    return (
        <>
            <Header />

            <div className="mt-20"></div>

            <StatusMessage
                isSuccess={isError}
                message={message}
            />

            {commentPostData.map(({ id, username, title, details, likes, comments }) => {
                return <Post
                    key={id}
                    id={id}
                    username={username}
                    title={title}
                    details={details}
                    likes={likes}
                    comments={comments}
                />
            })}

            <section className="flex justify-between max-w-[1200px] mx-auto items-center mb-4">
                <p className="text-lg font-bold ml-4">COMMENTS</p>
                {commentPostData.length > 0 && (
                    <Link to={`/make-comment/${commentPostData[0].id}`} className="mr-8 bg-blue-500 cursor-pointer text-slate-200 px-4 py-2 text-lg font-bold rounded-lg shadow-md hover:shadow-lg hover:bg-blue-400 hover:text-black/80 hover:scale-105 transition-all duration-300">
                        Make Comment
                    </Link>
                )}
            </section>

            

            <section className="max-w-[1200px] mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                {commentsData.map(({ id, username, comment, likes, }) => {
                    return <Comment
                        key={id}
                        onClick={() => likeComment(id)}
                        isFilled={alreadyLikedComments.includes(id)}
                        id={id}
                        username={username}
                        comment={comment}
                        likes={likes}
                    />
                })}
            </section>

            <StatusMessage
                isSuccess={isSuccess}
                message={message}
            />
        </>
    )
}