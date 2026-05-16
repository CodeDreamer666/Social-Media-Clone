import { TRPCReactProvider } from "~/trpc/react";
import Navbar from "./components/shared/Navbar";
import "~/styles/globals.css"
import RouteLoader from "./components/shared/RouterLoader";

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
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
