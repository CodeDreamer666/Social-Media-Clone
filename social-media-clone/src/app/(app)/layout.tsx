import { TRPCReactProvider } from "~/trpc/react";
import Navbar from "../components/shared/Navbar";
import "~/styles/globals.css"
import RouteLoader from "../components/shared/RouterLoader";
import { auth } from "~/server/better-auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

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
        <html lang="en">
            <body>
                <RouteLoader>
                    <TRPCReactProvider>
                        <Navbar />
                        {children}
                    </TRPCReactProvider>
                </RouteLoader>
            </body>
        </html>
    );
}
