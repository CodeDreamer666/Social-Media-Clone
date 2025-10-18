export default function StatusMessage({ isSuccess, message }) {
    if (isSuccess === null || message === null || message === "") return null;

    return (
        <section className=
            {`fixed z-40 top-16 right-4 
        ${isSuccess ? "bg-green-100 border-2 border-green-400 text-green-800" : "bg-red-100 border-2 border-red-400 text-red-800"} 
        px-3 py-2 rounded-md shadow-md mt-4`}>
            <h2 className="text-lg font-bold">
                {message}
            </h2>
        </section>
    )
}