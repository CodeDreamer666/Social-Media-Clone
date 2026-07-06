import { TRPCReactProvider } from "~/trpc/react";
import Navbar from "~/components/layout/Navbar";
import "~/styles/globals.css"
import RouteLoader from "~/components/layout/RouterLoader";
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
                            <main className="lg:pl-[17rem]">
                                {children}
                            </main>
                        </RouteLoader>
                    </HydrateClient>
                </TRPCReactProvider>
            </body>
        </html>
    );
}
