"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import handleTRPCError from "~/lib/handleTRPCError";
import { type InterestValue } from "~/lib/interests";
import useStatusMessage from "~/lib/useStatusMessage";
import { api } from "~/trpc/react";
import { getDisplayUsername } from "~/lib/userDisplay";

export default function useEditProfile() {
    const {
        data: currentUser,
        isLoading,
        error
    } = api.user.getUserInfo.useQuery();

    const [username, setUsername] = useState(
        currentUser?.username ?? `@${currentUser?.name.toLowerCase().replace(/\s/g, "")}`
    );
    const [bio, setBio] = useState(currentUser?.bio ?? "A new social media user");
    const [isPublic, setIsPublic] = useState(currentUser?.isPublic ?? true);
    const [selectedInterests, setSelectedInterests] = useState<InterestValue[]>([]);

    const utils = api.useUtils();
    const pathname = usePathname();
    const router = useRouter();
    const statusMessage = useStatusMessage();
    const {
        setIsSuccess,
        setMessage
    } = statusMessage;

    useEffect(() => {
        if (!currentUser) return;

        setUsername(getDisplayUsername(currentUser));
        setBio(currentUser.bio);
        setIsPublic(currentUser.isPublic);
        setSelectedInterests(currentUser.interest);
    }, [currentUser]);

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
                    isPublic: newData.isPublic
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
                pathname
            });
        },

        onSettled: async () => {
            await utils.invalidate();
        }
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
                pathname
            });
        },

        onSettled: async () => {
            await utils.invalidate();
        }
    });

    function toggleInterest(interest: InterestValue) {
        setSelectedInterests((currentInterests) => {
            if (currentInterests.includes(interest)) {
                return currentInterests.filter((selectedInterest) => selectedInterest !== interest);
            }

            if (currentInterests.length >= 3) {
                return currentInterests;
            }

            return [...currentInterests, interest];
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
        setMessage
    };
}
