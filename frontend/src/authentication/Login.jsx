import Header from "../components/header";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Form from "../prop/Form";
import useStatusMessage from "../hooks/useStatusMessage";
import StatusMessage from "../prop/StatusMessage";
import useSendRequest from "../hooks/useSendRequest";

export default function Login() {
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
            email: emailInput,
            password: passwordInput
        },
        errorMessage: "Login failed. Please try again",
        setIsSuccess: setIsSuccess,
        setIsError: setIsError,
        setMessage: setMessage
    });

    const login = (event) => {
        handleResponse("http://localhost:8000/api/auth/login", () => {
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
                    onSubmit={(event) => login(event)}
                    formTitle="Log in to your account ✨"
                />

                <StatusMessage
                    isSuccess={isSuccess}
                    message={message}
                />

            </section>
        </>
    )

}