"use client"
import AuthenticationForm from "~/app/components/auth/AuthenticationForm"
import { useState } from "react"
import { AUTH_MODES } from "./config"
import { useRouter, useSearchParams } from "next/navigation"

export default function SignIn() {
    const [active, setActive] = useState<"sign-in" | "login">("login")
    const router = useRouter();
    const searchParams = useSearchParams();
    const redirect = searchParams.get("redirect") || "/"

    const config = AUTH_MODES[active]

    return (
        <section className="overflow-hidden flex flex-col items-center justify-center">
            <AuthenticationForm
                key={active}
                handleFormSubmission={() => {
                    config.action
                    router.replace(redirect)
                }}
                inputList={config.inputs}
                title={config.title}
                subHeading={config.subHeading}
                textOne={config.textOne}
                textTwo={config.textTwo}
                onClick={() => setActive(config.nextMode)}
                redirect={redirect}
            />
        </section>
    )
}