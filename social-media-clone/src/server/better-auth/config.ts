import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { nextCookies } from "better-auth/next-js";
import { db } from "~/server/db";

export const auth = betterAuth({
    database: prismaAdapter(db, {
        provider: "postgresql", // or "sqlite" or "mysql"
    }),

    trustedOrigins: [
        "http://localhost:3000",
        "https://quietly-code-dreamers-projects-be33410e.vercel.app",
    ],

    socialProviders: {
        google: {
            prompt: "select_account",
            clientId: process.env.GOOGLE_CLIENT_ID!,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!
        },
    },

    plugins: [nextCookies()]
});

export type Session = typeof auth.$Infer.Session;
