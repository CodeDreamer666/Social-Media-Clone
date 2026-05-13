"use client"
import { useState, useEffect } from "react"

export default function useStatusMessage() {
    const [isSuccess, setIsSuccess] = useState<boolean | "IDLE">("IDLE");
    const [message, setMessage] = useState<string>("");

    useEffect(() => {
        if (isSuccess === "IDLE") return;

        const timing = isSuccess ? 3000 : 5000;

        const timer = setTimeout(() => {
            setIsSuccess("IDLE");
            setMessage("");
        }, timing);

        return () => clearTimeout(timer);
    }, [message, isSuccess]);

    function closeMessage() {
        setIsSuccess("IDLE");
        setMessage("");
    }

    return { isSuccess, setIsSuccess, message, setMessage, closeMessage }
}