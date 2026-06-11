"use client"
import Link from "next/link";
import { useState, useEffect } from "react"

export default function ServerError() {
    const [refresh, setRefresh] = useState(false);

    useEffect(() => {
        if (refresh) window.location.reload();
        setRefresh(false);
    }, [refresh])

    return (
        <section className="fixed inset-0 z-9999 flex items-center justify-center bg-black px-4">
            <div className="w-full max-w-md rounded-3xl border border-white/[0.06] bg-zinc-900/60 p-8 text-center shadow-[0_8px_30px_rgba(0,0,0,0.35)] backdrop-blur-xl">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full border border-[#ff453a]/20 bg-[#ff453a]/10">

                    <svg
                        className="size-7 text-[#ff453a]"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z"
                        />
                    </svg>
                </div>

                <h2 className="mt-6 text-2xl font-semibold tracking-tight text-white">
                    Something went wrong
                </h2>

                <p className="mt-3 text-[14px] leading-7 text-zinc-400">
                    An unexpected error occurred while loading the page.
                    Please try again.
                </p>

                <div className="mt-8 flex flex-col gap-3">
                    <button
                        onClick={() => {
                            setRefresh(true);
                        }}
                        className="h-11 cursor-pointer rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 text-[14px] font-medium text-white shadow-md shadow-blue-500/20 transition-all duration-200 hover:brightness-110 active:scale-95"
                    >
                        Try again
                    </button>

                    <Link
                        href="/"
                        className="flex h-11 cursor-pointer items-center justify-center rounded-full border border-white/[0.06] bg-white/5 text-[14px] font-medium text-white transition-colors duration-200 hover:bg-white/10"
                    >
                        Back to home
                    </Link>
                </div>
            </div>
        </section>
    );
}