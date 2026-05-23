import { TRPCReactProvider } from "~/trpc/react";
import Navbar from "~/app/components/shared/Navbar";
import "~/styles/globals.css"
import RouteLoader from "~/app/components/shared/RouterLoader";
import { HydrateClient } from "~/trpc/server";

export default async function RootLayout({
    children,
}: Readonly<{ children: React.ReactNode }>) {
    return (
        <html lang="en">
            <body>
                <TRPCReactProvider>
                    <HydrateClient>
                        <RouteLoader>
                            <Navbar />
                            {children}
                        </RouteLoader>
                    </HydrateClient>
                </TRPCReactProvider>
            </body>
        </html>
    );
}
