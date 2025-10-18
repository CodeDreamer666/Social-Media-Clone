import Header from "../components/header";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Form from "../prop/Form"
import useStatusMessage from "../hooks/useStatusMessage"
import StatusMesssage from "../prop/StatusMessage"
import useSendRequest from "../hooks/useSendRequest";

export default function SignIn() {
    const [usernameInput, setUsernameInput] = useState("");
    const [emailInput, setEmailInput] = useState("");
    const [passwordInput, setPasswordInput] = useState("");
    const navigate = useNavigate();

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
            username: usernameInput,
            email: emailInput,
            password: passwordInput
        },
        errorMessage: "Please try to sign in again",
        setIsSuccess: setIsSuccess,
        setIsError: setIsError,
        setMessage: setMessage
    })

    const signIn = (event) => {
        handleResponse("http://localhost:8000/api/auth/sign-in", () => {
            setTimeout(() => {
                navigate("/");
                window.location.reload();
            }, 1000);
        }, true, event);
    }

    return (
        <>
            <Header />

            <section className="min-h-[90vh] mt-16 py-4 flex flex-col justify-center items-center">

                <StatusMesssage
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
                            input: usernameInput,
                            onChange: (event) => setUsernameInput(event.target.value),
                            isTextarea: false
                        },
                        {
                            name: "email",
                            label: "Email",
                            type: "email",
                            required: true,
                            input: emailInput,
                            onChange: (event) => setEmailInput(event.target.value),
                            isTextarea: false
                        },
                        {
                            name: "password",
                            label: "Password",
                            type: "password",
                            required: true,
                            input: passwordInput,
                            onChange: (event) => setPasswordInput(event.target.value),
                            isTextarea: false
                        }
                    ]}
                    onSubmit={(event) => signIn(event)}
                    formTitle="Sign in to connect, share and inspire ✨"
                />

                <StatusMesssage
                    isSuccess={isSuccess}
                    message={message}
                />

            </section>
        </>
    )

}