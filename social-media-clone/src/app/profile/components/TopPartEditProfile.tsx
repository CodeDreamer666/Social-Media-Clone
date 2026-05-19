import Link from "next/link"

export default function TopPartEditProfile() {
    return (
        <section className="mb-6 flex items-center justify-between gap-4">
            <div>
                <h1 className="text-3xl font-semibold text-white">
                    Edit Profile
                </h1>
                <p className="mt-2 text-sm text-neutral-400">
                    Manage your profile and account settings.
                </p>
            </div>
            <Link
                className="h-11 flex items-center justify-center rounded-xl bg-sky-500 cursor-pointer px-6 text-sm font-medium text-white transition-colors duration-300 hover:bg-sky-400"
                href="/profile"
            >
                Back to Profile
            </Link>
        </section>
    )
}