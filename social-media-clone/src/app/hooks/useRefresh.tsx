"use client"
import { useState, useEffect } from "react"

export default function useRefresh() {
    const [refresh, setRefresh] = useState(false);

    useEffect(() => {
        if (refresh) window.location.reload();
        setRefresh(false);
    }, [refresh])

    return { setRefresh }
}