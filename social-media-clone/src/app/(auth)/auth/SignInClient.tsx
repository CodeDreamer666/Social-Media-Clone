"use client";

import { useSearchParams } from "next/navigation";
import { authClient } from "~/server/better-auth/client";
import Image from "next/image";

export default function SignInClient() {
    const searchParams = useSearchParams();
    const redirect = searchParams.get("redirect") ?? "/";

    return (
        <section className="flex min-h-[75vh] flex-col items-center justify-center">
            <section className="w-[95%] max-w-md rounded-3xl border border-neutral-800 bg-neutral-900 p-8 shadow-2xl shadow-black/20">

                <div className="mb-8 flex items-start gap-4">
                    <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-neutral-800 bg-neutral-950">
                        {/* icon */}
                    </div>

                    <div className="flex flex-col gap-2">
                        <h1 className="text-3xl font-semibold text-white">
                            Welcome
                        </h1>
                        <p className="text-sm text-neutral-400">
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
                    className="flex h-12 w-full items-center justify-center gap-3 rounded-2xl border border-neutral-800 bg-neutral-950 text-sm font-medium text-white transition hover:bg-neutral-800"
                >
                    <Image src="/googleIcon.svg" alt="Google" height={20} width={20} />
                    Continue with Google
                </button>
            </section>
        </section>
    );
}