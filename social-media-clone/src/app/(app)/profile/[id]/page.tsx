import { api } from "~/trpc/server"
import SelectedProfileView from "../../components/profile/SelectedProfileView";
import { redirect } from "next/navigation";

export default async function Profile({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params
    const result = await api.user.getSelectedUserInfo({ userId: id });

    if ("redirecting" in result) {
        return redirect("/profile");
    }

    return <SelectedProfileView user={result} />
}