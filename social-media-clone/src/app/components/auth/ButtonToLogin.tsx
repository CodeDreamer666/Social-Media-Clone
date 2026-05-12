import { authClient } from "~/server/better-auth/client";
import Image from "next/image";
import type { JSX } from "react";

export default function ButtonToLogin({
    redirect,
    socialProvider
}: {
    redirect: string,
    socialProvider: "discord" | "google" | "facebook",

}) {
    let icon: JSX.Element;

    if (socialProvider === "facebook") {
        icon = (
            <Image
                src="/facebookIcon.svg"
                alt="Facebook logo"
                width={22}
                height={22}
            />
        )
    } else if (socialProvider === "google") {
        icon = (
            <Image
                src="/googleIcon.svg"
                alt="Google logo"
                width={22}
                height={22}
            />
        )
    } else {
        icon = (
            <Image
                src="/discordIcon.svg"
                alt="Discord logo"
                width={22}
                height={22}
            />
        )
    }

    return (
        <button
            type="button"
            onClick={async () => {
                await authClient.signIn.social({
                    provider: socialProvider,
                    callbackURL: redirect,
                });
            }}
            className="flex h-11 cursor-pointer flex-1 items-center justify-center rounded-xl border border-neutral-800 bg-neutral-950 transition-colors duration-200 hover:bg-neutral-800"
        >
            {icon}
        </button>
    )
}