"use client"
import { authClient } from "~/server/better-auth/client"
import { useSearchParams } from "next/navigation"
import Image from "next/image";

export default function SignIn() {
    const searchParams = useSearchParams();
    const redirect = searchParams.get("redirect") || "/"

    return (
        <section className="flex min-h-[75vh] flex-col items-center justify-center">
            <section className="w-full max-w-md rounded-3xl border border-neutral-800 bg-neutral-900 p-8 shadow-2xl shadow-black/20">
                <div className="flex gap-4 items-center w-full mb-8">
                    <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-neutral-800 bg-neutral-950">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth={1.5}
                            stroke="currentColor"
                            className="h-8 w-8 text-white"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M8.625 12a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H8.25m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H12m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 0 1-2.555-.337A5.972 5.972 0 0 1 5.41 20.97a5.969 5.969 0 0 1-.474-.065 4.48 4.48 0 0 0 .978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25Z"
                            />
                        </svg>
                    </div>

                    <div>
                        <h1 className="text-3xl font-semibold tracking-tight text-white">
                            Welcome
                        </h1>
                        <p className="mt-3 text-sm leading-6 text-neutral-400">
                            Continue with Google to access your account.
                        </p>
                    </div>
                </div>

                <button
                    type="button"
                    onClick={async () => {
                        await authClient.signIn.social({
                            provider: "google",
                            callbackURL: redirect,
                        });
                    }}
                    className="flex h-12 w-full items-center justify-center gap-3 rounded-2xl border border-neutral-800 bg-neutral-950 text-sm font-medium cursor-pointer text-white transition-all duration-200 hover:border-neutral-700 hover:bg-neutral-800 active:scale-[0.99]"
                >
                    <Image
                        src="/googleIcon.svg"
                        alt="An icon of Google"
                        height={20}
                        width={20}
                    />
                    Continue with Google
                </button>
            </section>
        </section>
    )
}