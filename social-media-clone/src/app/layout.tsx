import type { Metadata } from "next";
import { TRPCReactProvider } from "~/trpc/react";
import "~/styles/globals.css";
import { HydrateClient } from "~/trpc/server";

export const metadata: Metadata = {
  title: "Quietly",
  description:
    "A calm, interest-based space for thoughtful posts and genuine connection.",
};

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>
        <TRPCReactProvider>
          <HydrateClient>{children}</HydrateClient>
        </TRPCReactProvider>
      </body>
    </html>
  );
}
