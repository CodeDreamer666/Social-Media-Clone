import Link from "next/link";

export default function NotFound() {
  return (
    <main className="flex min-h-[80vh] items-center justify-center bg-black px-4">
      <section className="w-full max-w-md rounded-3xl border border-white/[0.06] bg-zinc-900/60 p-8 text-center shadow-[0_8px_30px_rgba(0,0,0,0.35)]">
        <h1 className="text-2xl font-semibold tracking-tight text-white">
          Page not found
        </h1>
        <p className="mt-3 text-[14px] leading-7 text-zinc-400">
          This page may have moved or may no longer be available.
        </p>
        <Link
          href="/"
          className="mt-7 inline-flex min-h-11 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 px-6 text-[14px] font-medium text-white"
        >
          Back to Quietly
        </Link>
      </section>
    </main>
  );
}
