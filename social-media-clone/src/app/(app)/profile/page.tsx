"use client"
import { api } from "~/trpc/react";
import { useRouter, usePathname } from "next/navigation";
import Loader from "../../components/shared/Loader";
import Link from "next/link";
import NoPostModal from "../../components/profile/NoPostModal";
import TopPartProfile from "../../components/profile/TopPartProfile";
import ProfilePost from "~/app/components/profile/ProfilePost"
import useStatusMessage from "../../hooks/useStatusMessage";
import StatusMessage from "../../components/shared/StatusMessage";

export default function Profile() {
    const pathname = usePathname();
    const router = useRouter();
    const { data: user, isLoading, error } = api.user.getUserInfo.useQuery();
    const {
        setIsSuccess,
        setMessage,
        isSuccess,
        message,
        closeMessage
    } = useStatusMessage()

    if (isLoading) return <Loader />

    if (error || !user) {
        router.replace(`/auth?redirect=${encodeURIComponent(pathname)}`);
        return;
    }

    return (
        <section className="px-4">

            <StatusMessage
                closeMessage={closeMessage}
                isSuccess={isSuccess}
                message={message}
            />

            <section className="flex flex-col" >
                <TopPartProfile user={user} />

                <Link
                    href="/profile/edit"
                    className="h-11 mt-4 flex items-center justify-center w-full rounded-xl bg-sky-500 cursor-pointer px-6 text-sm font-medium text-white transition-colors duration-300 hover:bg-sky-400"
                >
                    Edit Profile
                </Link>
            </section>

            <section className="mt-8">
                <h2 className="mb-4 text-2xl font-semibold text-white">
                    Posts
                </h2>

                {user.posts.length === 0 && (
                    <NoPostModal />
                )}

                <ul className="flex flex-col gap-4">
                    {user.posts.map((post) => {
                        return <ProfilePost
                            key={post.id}
                            setIsSuccess={setIsSuccess}
                            setMessage={setMessage}
                            post={post}
                        />
                    })}
                </ul>
            </section >

        </section>
    )
}