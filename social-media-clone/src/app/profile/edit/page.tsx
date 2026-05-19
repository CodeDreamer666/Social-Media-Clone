"use client"
import { api } from "~/trpc/react";
import { useRouter, usePathname } from "next/navigation";
import EditProfileView from "../components/EditProfileView";
import { TRPCClientError } from "@trpc/client";
import Loader from "~/app/components/shared/Loader";
import ServerError from "~/app/components/shared/ServerError";

export default function EditProfile() {
    const { data: user, isLoading, error } = api.user.getUserInfo.useQuery();
    const pathname = usePathname();
    const router = useRouter();

    if (isLoading) return <Loader />

    if (error) {
        if (error instanceof TRPCClientError) {
            router.replace(`/auth?redirect=${encodeURIComponent(pathname)}`);
            return;
        }

        return <ServerError />
    }

    if (!user) return <ServerError />

    return <EditProfileView user={user} />

}