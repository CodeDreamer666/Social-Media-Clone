"use server"
import { auth } from "~/server/better-auth"
import { signUpSchema } from "~/app/schema/auth/auth"

export async function signUpAction(formData: FormData) {
    const email = formData.get("email")
    const password = formData.get("password")
    const name = formData.get("name")

    const result = signUpSchema.safeParse({ name, email, password })

    if (!result.success) throw new Error("Invalid Input");

    await auth.api.signInEmail({
        body: {
            ...result.data
        }
    })
}