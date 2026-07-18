"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import Loader from "~/components/shared/Loader";
import ServerError from "~/components/shared/ServerError";
import StatusMessage from "~/components/shared/StatusMessage";
import useEditProfile from "../hooks/useEditProfile";
import EmptyPostsCard from "./EmptyPostsCard";
import PostEditForm from "./PostEditForm";
import ProfileInfoForm from "./ProfileInfoForm";
import ProfileInterestsForm from "./ProfileInterestsForm";

export default function EditProfilePage() {
  const leftColumnRef = useRef<HTMLDivElement | null>(null);
  const [managePostsHeight, setManagePostsHeight] = useState<number | null>(
    null,
  );
  const profile = useEditProfile();
  const {
    currentUser,
    isLoading,
    error,
    username,
    setUsername,
    bio,
    setBio,
    isPublic,
    setIsPublic,
    selectedInterests,
    toggleInterest,
    statusMessage,
    editUserInfo,
    updateInterests,
    setIsSuccess,
    setMessage,
  } = profile;

  useEffect(() => {
    function updateManagePostsMaxHeight() {
      if (!leftColumnRef.current || window.innerWidth < 1024) {
        setManagePostsHeight(null);
        return;
      }

      setManagePostsHeight(leftColumnRef.current.offsetHeight);
    }

    updateManagePostsMaxHeight();

    window.addEventListener("resize", updateManagePostsMaxHeight);

    return () => {
      window.removeEventListener("resize", updateManagePostsMaxHeight);
    };
  }, [bio, currentUser, isPublic, selectedInterests, username]);

  if (isLoading) return <Loader />;

  if (error || !currentUser) return <ServerError />;

  return (
    <section className="min-h-screen bg-black pb-10 lg:px-8 lg:py-8">
      <div className="mx-auto w-full max-w-7xl px-4">
        <StatusMessage
          message={statusMessage.message}
          isSuccess={statusMessage.isSuccess}
          closeMessage={statusMessage.closeMessage}
        />

        <section className="mb-6 flex flex-col justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight text-white">
              Edit profile
            </h1>
            <p className="mt-2 text-[13px] text-zinc-500">
              Manage your profile and account settings.
            </p>
          </div>
          <Link
            className={[
              "flex h-11 items-center justify-center rounded-full border bg-white/5",
              "border-white/[0.06] px-6 text-[14px] font-medium text-white",
              "cursor-pointer transition-colors duration-200 hover:bg-white/10",
            ].join(" ")}
            href="/profile"
          >
            Back to profile
          </Link>
        </section>

        <section className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(320px,420px)_1fr] lg:items-start">
          <div ref={leftColumnRef} className="flex flex-col gap-6">
            <ProfileInfoForm
              username={username}
              bio={bio}
              isPublic={isPublic}
              isPending={editUserInfo.isPending}
              onChangeUsername={setUsername}
              onChangeBio={setBio}
              onChangeIsPublic={setIsPublic}
              onSave={() => {
                editUserInfo.mutate({
                  username,
                  bio,
                  isPublic,
                });
              }}
            />

            <ProfileInterestsForm
              selectedInterests={selectedInterests}
              isPending={updateInterests.isPending}
              nextUpdateAt={currentUser.nextInterestUpdateAt}
              canUpdateInterests={currentUser.canUpdateInterests}
              onToggleInterest={toggleInterest}
              onSave={() => {
                updateInterests.mutate({
                  interests: selectedInterests,
                });
              }}
            />
          </div>

          <section
            style={{
              height: managePostsHeight ?? undefined,
            }}
            className={[
              "flex min-h-0 flex-col rounded-3xl border border-white/[0.06] bg-zinc-900/60 p-6",
              "shadow-[0_8px_30px_rgba(0,0,0,0.35)] backdrop-blur-xl",
            ].join(" ")}
          >
            <h2 className="mb-6 text-[15px] font-semibold text-white">
              Manage posts
            </h2>

            {currentUser.posts.length === 0 ? (
              <EmptyPostsCard showCreateLink />
            ) : (
              <ul className="manage-posts-scrollbar flex min-h-0 flex-1 flex-col gap-3 overflow-y-auto pr-1">
                {currentUser.posts.map((post) => {
                  return (
                    <li key={post.id}>
                      <PostEditForm
                        setIsSuccess={setIsSuccess}
                        setMessage={setMessage}
                        post={post}
                      />
                    </li>
                  );
                })}
              </ul>
            )}
          </section>
        </section>
      </div>
    </section>
  );
}
