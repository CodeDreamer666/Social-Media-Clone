import { useState, useEffect } from "react";

export default function useFetchData(url) {
    const [data, setData] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            const res = await fetch(`${url}`, {
                credentials: "include",
            });
            const data = await res.json();
            setData(data);
        }
        fetchData();
    }, [url]);

    return [data, setData];
}