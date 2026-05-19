import Link from "next/link"

export default function NoPostModal() {
    return (
        <section className="flex flex-col items-center justify-center rounded-3xl border border-neutral-800 bg-neutral-900 px-6 py-16 text-center">

            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-neutral-950 border border-neutral-800">
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="h-7 w-7 text-neutral-400"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125V5.25m-6.75 0v1.875A1.125 1.125 0 0 1 5.625 8.25h-1.5A3.375 3.375 0 0 0 .75 11.625v2.625m18 0a3 3 0 0 1-3 3h-3m6 0a3 3 0 0 1-3 3h-3m-9-6v6a3 3 0 0 0 3 3h3m-6-3a3 3 0 0 0 3 3h3"
                    />
                </svg>
            </div>

            <h2 className="mt-2 text-lg font-semibold text-white">
                No posts yet
            </h2>

            <p className="mt-2 text-sm text-neutral-400">
                Start sharing your thoughts with other people
            </p>

            <Link
                href="/create"
                className="mt-6 h-11 flex justify-center items-center rounded-xl cursor-pointer bg-sky-500 px-5 text-sm font-medium text-white transition-colors duration-200 hover:bg-sky-400"
            >
                Create Post
            </Link>
        </section>
    )
}