"use server"
import { auth } from "~/server/better-auth"
import { signInSchema } from "~/app/schema/auth/auth"

export async function signInAction(formData: FormData) {
    const email = formData.get("email")
    const password = formData.get("password")

    const result = signInSchema.safeParse({ email, password })

    if (!result.success) throw new Error("Invalid Input");

    await auth.api.signInEmail({
        body: {
            ...result.data
        }
    })
}