import "~/styles/globals.css";
import { auth } from "~/server/better-auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import Navbar from "~/components/layout/Navbar";

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/auth");
  }

  return (
    <>
      <Navbar />
      <main className="lg:pl-[17rem]">{children}</main>
    </>
  );
}
