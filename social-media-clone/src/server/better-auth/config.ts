import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { nextCookies } from "better-auth/next-js";
import { db } from "~/server/db";

export const auth = betterAuth({
    database: prismaAdapter(db, {
        provider: "postgresql", // or "sqlite" or "mysql"
    }),

    socialProviders: {
        google: {
            prompt: "select_account",
            clientId: process.env.GOOGLE_CLIENT_ID as string,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET as string
        },
    },

    plugins: [nextCookies()]
});

export type Session = typeof auth.$Infer.Session;
