export default function CreatePost() {
    return (
        <div className="mx-auto w-full max-w-2xl px-4">
            <form className="rounded-3xl border border-neutral-800 bg-neutral-900 p-6">
                
                <div className="mb-6 flex items-center gap-3">
                    <div className="flex h-11 w-11 items-center justify-center rounded-full bg-sky-500 text-sm font-semibold text-white">
                        EC
                    </div>
                    <div>
                        <h2 className="text-sm font-semibold text-white">
                            Ethan Carter
                        </h2>

                        <p className="text-xs text-neutral-400">
                            @ethanc
                        </p>
                    </div>
                </div>

                <textarea
                    placeholder="What’s happening?"
                    className="h-80 w-full resize-none bg-transparent text-[15px] leading-7 text-white outline-none placeholder:text-neutral-500"
                />

                <div className="mt-6 flex items-center justify-between border-t border-neutral-800 pt-4">
                    <p className="text-sm text-neutral-500">
                        Keep it simple and meaningful.
                    </p>
                    <button
                        type="submit"
                        className="h-10 cursor-pointer rounded-xl bg-sky-500 px-5 text-sm font-medium text-white transition-colors duration-200 hover:bg-sky-400"
                    >
                        Post
                    </button>
                </div>

            </form>
        </div>
    )
}