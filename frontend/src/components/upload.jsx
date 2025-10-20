import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "./header";
import useStatusMessage from "../hooks/useStatusMessage.jsx"
import StatusMessage from "../prop/StatusMessage.jsx";
import Form from "../prop/Form.jsx";
import useSendRequest from "../hooks/useSendRequest.jsx";

export default function UploadPost() {
    const [titleInput, setTitleInput] = useState("");
    const [descriptionInput, setDescriptionInput] = useState("");
    const navigate = useNavigate();

    console.log("Title: " + titleInput);
    console.log("Description: " + descriptionInput)

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
        errorMessage: "Please try to upload the post again",
        body: {
            title: titleInput,
            description: descriptionInput
        },
        setIsSuccess: setIsSuccess,
        setIsError: setIsError,
        setMessage: setMessage
    });

    const uploadPost = (event) => {
        handleResponse("http://localhost:8000/api/post", () => {
            setTimeout(() => {
                navigate("/");
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
                            name: "title",
                            label: "Title",
                            type: "text",
                            required: true,
                            input: titleInput,
                            onChange: (event) => setTitleInput(event.target.value),
                            isTextarea: false
                        },
                        {
                            name: "description",
                            label: "Description",
                            type: "text",
                            required: true,
                            input: descriptionInput,
                            onChange: (event) => setDescriptionInput(event.target.value),
                            isTextarea: true
                        }
                    ]}
                    onSubmit={(event) => uploadPost(event)}
                    formTitle="Share your thoughts with the community 🌟"
                />

                <StatusMessage
                    isSuccess={isSuccess}
                    message={message}
                />

            </section>
        </>
    )
}