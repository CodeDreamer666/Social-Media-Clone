import Header from "../components/header.jsx"
import { useNavigate } from "react-router-dom"
import Form from "../prop/Form.jsx";
import useFetchData from "../hooks/fetchData.jsx";
import StatusMessage from "../prop/StatusMessage.jsx";
import useStatusMessage from "../hooks/useStatusMessage.jsx";
import useSendRequest from "../hooks/useSendRequest.jsx";

export default function EditProfile() {
    const navigate = useNavigate();
    const [bioInput, setBioInput] = useFetchData("http://localhost:8000/api/auth/bio")
    const [username, setUsername] = useFetchData("http://localhost:8000/api/auth/me",);

    const {
        isSuccess,
        setIsSuccess,
        isError,
        setIsError,
        message,
        setMessage,
    } = useStatusMessage();

    const { handleResponse } = useSendRequest({
        method: "PATCH",
        body: {
            bio: bioInput
        },
        errorMessage: "Failed to edit profile",
        setIsSuccess: setIsSuccess,
        setIsError: setIsError,
        setMessage: setMessage
    })

    const submitBio = (event) => {
        handleResponse("http://localhost:8000/api/auth/profile", () => {
            setTimeout(() => {
                navigate("/profile");
                window.location.reload();
            }, 1000);
        }, true, event);
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
                        name: "username",
                        label: "Username",
                        type: "text",
                        required: true,
                        input: username.username,
                        onChange: (event) => setUsername(event.target.value),
                        isTextarea: false,
                        isReadonly: true
                    },
                    {
                        name: "bio",
                        label: "Bio",
                        type: "text",
                        required: true,
                        input: bioInput.bio,
                        onChange: (event) => setBioInput(event.target.value),
                        isTextarea: true
                    }
                 ]}
                 onSubmit={(event) => submitBio(event)}
                 formTitle="Let Others Know More About You ✨"
                />

                <StatusMessage
                    isSuccess={isSuccess}
                    message={message}
                />

            </section>
        </>
    )
}