"use client"
import { signInAction } from "~/app/lib/auth/signIn"
import { signUpAction } from "~/app/lib/auth/signUp"

export const AUTH_MODES = {
    login: {
        title: "Welcome back!",
        subHeading: "Enter to shop",
        textOne: "Don't have an account?",
        textTwo: "Register here",
        action: signInAction,
        nextMode: "sign-in" as const,
        inputs: [
            { displayText: "Email", text: "email", type: "email", placeholder: "Enter your email" },
            { displayText: "Password", text: "password", type: "password", placeholder: "Enter your password" }
        ]
    },
    "sign-in": {
        title: "Let’s get you started!",
        subHeading: "Sign up to track orders, save favorites, and more",
        textOne: "Already have an account?",
        textTwo: "Login here",
        action: signUpAction,
        nextMode: "login" as const,
        inputs: [
            { displayText: "Username", text: "username", type: "text", placeholder: "Enter your username" },
            { displayText: "Email", text: "email", type: "email", placeholder: "Enter your email" },
            { displayText: "Password", text: "password", type: "password", placeholder: "Enter your password" }
        ]
    }
}