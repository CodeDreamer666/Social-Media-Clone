"use client"
import useRefresh from "../hooks/useRefresh";
import Link from "next/link";

export default function ServerError() {
    const { setRefresh } = useRefresh();

    return (
        <section className="fixed inset-0 flex items-center justify-center bg-slate-50/50 backdrop-blur-sm px-4 z-50">
            <div className="w-full max-w-md overflow-hidden bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-red-100 p-8 text-center transition-all animate-in fade-in zoom-in duration-300">

                <svg className="size-12 mx-auto text-red-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z" />
                </svg>

                <h2 className="text-2xl font-bold text-slate-900 tracking-tight mb-2">
                    Something went wrong
                </h2>

                <p className="text-slate-500 leading-relaxed mb-8">
                    Oops! Something went wrong while loading. Please refresh the page or try again later.
                </p>

                <div className="flex flex-col gap-3">
                    <button
                        onClick={() => {
                            setRefresh(true)
                        }}
                        className="w-full inline-flex cursor-pointer items-center justify-center px-6 py-3.5 bg-slate-900 text-white font-semibold rounded-xl hover:bg-slate-800 active:scale-[0.98] transition-all shadow-sm"
                    >
                        Try again
                    </button>
                    <Link
                        href="/"
                        className="w-full inline-flex items-center justify-center px-6 py-3 text-slate-600 font-medium rounded-xl hover:bg-slate-100 transition-colors"
                    >
                        Back to Home
                    </Link>

                </div>
            </div>
        </section>
    );
}