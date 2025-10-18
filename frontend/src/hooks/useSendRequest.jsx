export default function useSendRequest({ method, body = null, errorMessage, setIsSuccess, setIsError, setMessage }) {
    async function handleResponse(url, action, isPreventDefault = false, event = null) {
        try {
            if (isPreventDefault && event) {
                event.preventDefault();
            } 

            const options = {
                method: method,
                credentials: "include"
            }

            if (body) {
                options.headers = { "Content-Type": "application/json" };
                options.body = JSON.stringify(body);
            }

            const res = await fetch(url, options)

            const data = await res.json();

            if (res.ok) {
                setIsSuccess(true);
                setIsError(false);
                setMessage(data.message);
                action(data)
            } else {
                setIsSuccess(false);
                setIsError(true);
                setMessage(data.error);
            }
        } catch (err) {
            setIsSuccess(false);
            setIsError(true);
            setMessage(errorMessage);
            console.error(err);
        }
    }

    return { handleResponse };
}