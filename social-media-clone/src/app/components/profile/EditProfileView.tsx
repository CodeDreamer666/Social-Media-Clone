"use client"
import StatusMessage from "~/app/components/shared/StatusMessage"
import useStatusMessage from "~/app/hooks/useStatusMessage"
import PostItem from "./PostItem"
import TopPartEditProfile from "./TopPartEditProfile"
import EditProfileForm from "./EditProfileForm"
import NoPostModal from "./NoPostModal"

type Parameter = {
    user: ({
        posts: ({
            comments: {
                id: string;
                userId: string;
                content: string;
                createdAt: Date;
                updatedAt: Date;
                postId: string;
            }[];
            likes: {
                id: string;
                userId: string;
                postId: string;
            }[];
        } & {
            id: string;
            userId: string;
            content: string;
            likeCount: number;
            commentCount: number;
            createdAt: Date;
            updatedAt: Date;
        })[];
    } & {
        name: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        username: string | null;
        bio: string;
        followersCount: number;
        followingCount: number;
        postsCount: number;
        email: string;
        emailVerified: boolean;
        image: string | null;
        isPublic: boolean;
    })
}

export default function EditProfileView({ user }: Parameter) {
    const {
        isSuccess,
        message,
        setIsSuccess,
        setMessage,
        closeMessage
    } = useStatusMessage();

    return (
        <section className="mx-auto w-full max-w-3xl px-4">

            <StatusMessage
                message={message}
                isSuccess={isSuccess}
                closeMessage={closeMessage}
            />

            <TopPartEditProfile />

            <section className="flex flex-col gap-6">
                <EditProfileForm
                    user={user}
                    setIsSuccess={setIsSuccess}
                    setMessage={setMessage}
                />

                {/* Manage Posts */}
                <section className="rounded-3xl border border-neutral-800 bg-neutral-900 p-6">
                    <h2 className="mb-6 text-lg font-semibold text-white">
                        Manage Posts
                    </h2>

                    {user.posts.length === 0 && (
                        <NoPostModal />
                    )}

                    <ul className="flex flex-col gap-4">
                        {user.posts.map((post) => {
                            return (
                                <PostItem
                                    key={post.id}
                                    setIsSuccess={setIsSuccess}
                                    setMessage={setMessage}
                                    post={post}
                                />
                            )
                        })}
                    </ul>
                </section>
            </section>
        </section>
    )
}