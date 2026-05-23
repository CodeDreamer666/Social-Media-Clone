import { TRPCReactProvider } from "~/trpc/react";
import Navbar from "../components/shared/Navbar";
import "~/styles/globals.css"
import RouteLoader from "../components/shared/RouterLoader";
import { auth } from "~/server/better-auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { HydrateClient } from "~/trpc/server";

export default async function RootLayout({
    children,
}: Readonly<{ children: React.ReactNode }>) {

    const session = await auth.api.getSession({
        headers: await headers()
    })

    if (!session) {
        redirect("/auth")
    }

    return (
        <>
            {children}
        </>
    );
}
