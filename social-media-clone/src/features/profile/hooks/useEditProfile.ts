"use client";

import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import handleTRPCError from "~/lib/handleTRPCError";
import { type InterestValue } from "~/lib/interests";
import useStatusMessage from "~/lib/useStatusMessage";
import { api } from "~/trpc/react";
import { getDisplayUsername } from "~/lib/userDisplay";

export default function useEditProfile() {
  const {
    data: currentUser,
    isLoading,
    error,
  } = api.user.getUserInfo.useQuery();

  const [usernameDraft, setUsername] = useState<string | null>(null);
  const [bioDraft, setBio] = useState<string | null>(null);
  const [isPublicDraft, setIsPublic] = useState<boolean | null>(null);
  const [interestDraft, setSelectedInterests] = useState<
    InterestValue[] | null
  >(null);

  const utils = api.useUtils();
  const pathname = usePathname();
  const router = useRouter();
  const statusMessage = useStatusMessage();
  const { setIsSuccess, setMessage } = statusMessage;

  const username =
    usernameDraft ?? (currentUser ? getDisplayUsername(currentUser) : "");
  const bio = bioDraft ?? currentUser?.bio ?? "";
  const isPublic = isPublicDraft ?? currentUser?.isPublic ?? true;
  const selectedInterests = interestDraft ?? currentUser?.interest ?? [];

  const editUserInfo = api.user.editUserInfo.useMutation({
    onMutate: async (newData) => {
      await utils.user.getUserInfo.cancel();

      const previousUser = utils.user.getUserInfo.getData();

      utils.user.getUserInfo.setData(undefined, (old) => {
        if (!old) return old;

        return {
          ...old,
          username: newData.username,
          bio: newData.bio,
          isPublic: newData.isPublic,
        };
      });

      return { previousUser };
    },

    onSuccess: (newData) => {
      setIsSuccess(newData.success);
      setMessage(newData.message);
    },

    onError: (error, newData, context) => {
      if (context?.previousUser) {
        utils.user.getUserInfo.setData(undefined, context.previousUser);
      }

      handleTRPCError({
        error,
        setMessage,
        setIsSuccess,
        router,
        pathname,
      });
    },

    onSettled: async () => {
      await utils.invalidate();
    },
  });

  const updateInterests = api.user.updateInterests.useMutation({
    onMutate: async (newData) => {
      await utils.user.getUserInfo.cancel();

      const previousUser = utils.user.getUserInfo.getData();

      utils.user.getUserInfo.setData(undefined, (old) => {
        if (!old) return old;

        return {
          ...old,
          interest: newData.interests,
          interestsUpdatedAt: new Date(),
        };
      });

      return { previousUser };
    },

    onSuccess: (newData) => {
      setIsSuccess(newData.success);
      setMessage(newData.message);
    },

    onError: (error, newData, context) => {
      if (context?.previousUser) {
        utils.user.getUserInfo.setData(undefined, context.previousUser);
      }

      handleTRPCError({
        error,
        setMessage,
        setIsSuccess,
        router,
        pathname,
      });
    },

    onSettled: async () => {
      await utils.invalidate();
    },
  });

  function toggleInterest(interest: InterestValue) {
    setSelectedInterests((currentInterests) => {
      const resolvedInterests = currentInterests ?? currentUser?.interest ?? [];

      if (resolvedInterests.includes(interest)) {
        return resolvedInterests.filter(
          (selectedInterest) => selectedInterest !== interest,
        );
      }

      if (resolvedInterests.length >= 3) {
        return resolvedInterests;
      }

      return [...resolvedInterests, interest];
    });
  }

  return {
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
  };
}
