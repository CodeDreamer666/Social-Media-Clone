import { Suspense } from "react";
import { redirect } from "next/navigation";
import SignInClient from "~/features/auth/components/SignInClient";
import { getSession } from "~/server/better-auth/server";

export default async function Page() {
  const session = await getSession();

  if (session) {
    redirect("/");
  }

  return (
    <Suspense fallback={null}>
      <SignInClient />
    </Suspense>
  );
}
