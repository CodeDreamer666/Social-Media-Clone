import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Header from "./header";
import Form from "../prop/Form";
import StatusMessage from "../prop/StatusMessage";
import useStatusMessage from "../hooks/useStatusMessage";
import useSendRequest from "../hooks/useSendRequest";

export default function MakeComment() {
    const [commentInput, setCommentInput] = useState("");
    const navigate = useNavigate();
    const { postId } = useParams();

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
        body: {
            comment: commentInput
        },
        errorMessage: "Please try to make a comment again",
        setIsSuccess: setIsSuccess,
        setIsError: setIsError,
        setMessage: setMessage
    })

    const makeComment = (event, postId) => {
        handleResponse(`http://localhost:8000/api/comments/${postId}`, () => {
            setTimeout(() => {
                navigate(`/comments/${postId}`);
                window.location.reload();
            }, 1000);
        }, true, event)
    }

    return (
        <>
            <Header />

            <section className="min-h-[90vh] mt-16 py-4 flex flex-col justify-center items-center">

                <StatusMessage
                    isSuccess={isError}
                    message={message}
                />

                <Form
                    fields={[
                        {
                            name: "comment",
                            label: "Comment",
                            type: "text",
                            required: true,
                            input: commentInput,
                            onChange: (event) => setCommentInput(event.target.value),
                            isTextarea: true
                        }
                    ]}
                    onSubmit={(event) => makeComment(event, postId)}
                    formTitle="Share your thoughts on this post 🌟"
                />

                <StatusMessage
                    isSuccess={isSuccess}
                    message={message}
                />

            </section>
        </>
    )
}