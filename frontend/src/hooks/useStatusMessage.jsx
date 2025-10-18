import { useState, useEffect } from "react";

export default function useStatusMessage() {
    const [isSuccess, setIsSuccess] = useState(null);
    const [isError, setIsError] = useState(null);
    const [message, setMessage] = useState(null);

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsSuccess(null)
            setIsError(null);
            setMessage("");
        }, 2000);
        return () => clearTimeout(timer);
    }, [isSuccess, isError, message]);

    return {
        isSuccess,
        setIsSuccess,
        isError,
        setIsError,
        message,
        setMessage,
    };
}