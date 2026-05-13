type StatusMessageProps = {
    isSuccess: "IDLE" | true | false,
    message: string,
    closeMessage: () => void
}

export default function StatusMessage({ isSuccess, message, closeMessage }: StatusMessageProps) {
    if (isSuccess === "IDLE") return null;

    return (
        <div className="fixed top-20 inset-x-0 z-50 pointer-events-none">
            <div className="mx-auto flex max-w-6xl justify-end px-4">
                <section
                    className={`pointer-events-auto flex items-center gap-4 rounded-2xl border px-5 py-4 backdrop-blur transition-all duration-300
                        ${isSuccess
                            ? "border-emerald-500/20 bg-neutral-900 text-white"
                            : "border-red-500/20 bg-neutral-900 text-white"
                        }`}
                >

                    <h2 className="text-sm font-medium">
                        {message}
                    </h2>

                    <button
                        onClick={() => closeMessage()}
                        className="flex size-7 cursor-pointer items-center justify-center rounded-full text-neutral-400 transition-colors duration-200 hover:bg-neutral-800 hover:text-white"
                    >
                        ✕
                    </button>

                </section>
            </div>
        </div>
    )
}