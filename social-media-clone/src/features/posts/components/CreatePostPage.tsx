"use client";
import Loader from "~/components/shared/Loader";
import ServerError from "~/components/shared/ServerError";
import StatusMessage from "~/components/shared/StatusMessage";
import { api } from "~/trpc/react";
import useCreatePost from "../hooks/useCreatePost";
import CreatePostForm from "./CreatePostForm";

export default function CreatePostPage() {
  const postState = useCreatePost();
  const {
    data: currentUser,
    isLoading,
    error,
  } = api.user.getUserInfo.useQuery();

  if (isLoading) return <Loader />;

  if (error || !currentUser) return <ServerError />;

  return (
    <>
      <StatusMessage
        message={postState.statusMessage.message}
        isSuccess={postState.statusMessage.isSuccess}
        closeMessage={postState.statusMessage.closeMessage}
      />

      <CreatePostForm currentUser={currentUser} postState={postState} />
    </>
  );
}
