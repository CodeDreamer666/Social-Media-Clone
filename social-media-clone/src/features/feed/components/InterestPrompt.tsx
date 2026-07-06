import Link from "next/link";

export default function InterestPrompt() {
    return (
        <section
            className={[
                "mx-auto flex justify-between items-center mb-4 w-[92%] max-w-full rounded-3xl border",
                "border-white/[0.06] bg-zinc-900/60 p-5",
                "shadow-[0_8px_30px_rgba(0,0,0,0.35)] backdrop-blur-xl",
            ].join(" ")}
        >
            <h2 className="text-[15px] font-semibold text-white">
                Choose 3 interests to make your feed more relevant.
            </h2>
            <Link
                href="/profile/edit"
                className={[
                    "inline-flex h-10 items-center justify-center rounded-full",
                    "bg-gradient-to-br from-blue-500 to-indigo-600 px-5",
                    "text-[14px] font-medium text-white shadow-md shadow-blue-500/20",
                    "transition-all duration-200 hover:brightness-110 active:scale-95",
                ].join(" ")}
            >
                Edit interests
            </Link>
        </section>
    );
}
