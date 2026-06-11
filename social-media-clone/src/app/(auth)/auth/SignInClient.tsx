"use client";

import { useSearchParams } from "next/navigation";
import { authClient } from "~/server/better-auth/client";
import Image from "next/image";

export default function SignInClient() {
    const searchParams = useSearchParams();
    const redirect = searchParams.get("redirect") ?? "/";

    return (
        <section className="flex flex-col min-h-[80vh] items-center justify-center bg-black px-4">
            <section className="w-full max-w-md rounded-3xl border border-white/[0.06] bg-zinc-900/60 p-8 shadow-[0_8px_30px_rgba(0,0,0,0.35)] backdrop-blur-xl">

                <div className="mb-8 flex items-start gap-4">
                    <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 shadow-md shadow-blue-500/20">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="white" viewBox="0 0 24 24" strokeWidth={1.5} stroke="white" className="size-7">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M8.625 12a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H8.25m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H12m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 0 1-2.555-.337A5.972 5.972 0 0 1 5.41 20.97a5.969 5.969 0 0 1-.474-.065 4.48 4.48 0 0 0 .978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25Z" />
                        </svg>
                    </div>

                    <div className="flex flex-col gap-1.5 pt-1">
                        <h1 className="text-2xl font-semibold tracking-tight text-white">
                            Welcome
                        </h1>
                        <p className="text-[13px] leading-6 text-zinc-500">
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
                    className="flex h-12 w-full cursor-pointer items-center justify-center gap-3 rounded-full border border-white/[0.06] bg-white/5 text-[14px] font-medium text-white transition-colors duration-200 hover:bg-white/10 active:scale-[0.99]"
                >
                    <Image src="/googleIcon.svg" alt="" height={18} width={18} />
                    Continue with Google
                </button>

                <p className="mt-6 text-center text-[12px] leading-5 text-zinc-600">
                    By continuing, you agree to our Terms of Service and Privacy Policy.
                </p>
            </section>
        </section>
    );
}