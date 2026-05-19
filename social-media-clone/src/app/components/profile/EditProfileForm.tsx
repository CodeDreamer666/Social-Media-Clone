import LoadingIcon from "~/app/components/shared/LoadingIcon";
import editUserInfoAction from "../lib/editUserInfo";
import type { SetStateAction } from "react";
import { useState } from "react";

type Parameter = {
    user: {
        username: string | null,
        name: string,
        bio: string
    }
    setMessage: React.Dispatch<SetStateAction<string>>,
    setIsSuccess: React.Dispatch<SetStateAction<boolean | "IDLE">>,
}

export default function EditProfileForm({
    user,
    setIsSuccess,
    setMessage
}: Parameter) {
    const [username, setUsername] = useState(
        user.username ?? `@${user.name.toLowerCase().replace(/\s/g, "")}`
    );
    const [bio, setBio] = useState(user.bio);

    const { editUserInfo } = editUserInfoAction({
        setIsSuccess,
        setMessage
    })

    return (
        <section className="rounded-3xl border border-neutral-800 bg-neutral-900 p-6">

            <h2 className="mb-4 text-lg font-semibold text-white">
                Profile
            </h2>

            <div className="mb-6">
                <label
                    htmlFor="username"
                    className="mb-2 block text-sm font-medium text-neutral-200"
                >
                    Username
                </label>
                <input
                    value={username}
                    onChange={(event) => setUsername(event.target.value)}
                    type="text"
                    name="username"
                    id="username"
                    autoComplete="off"
                    placeholder="Tell people about yourself..."
                    className="w-full mb-4  resize-none rounded-2xl border border-neutral-800 bg-neutral-950 px-4 py-3 text-sm leading-7 text-white outline-none transition-colors duration-200 placeholder:text-neutral-500 focus:border-sky-500"
                />

                <label
                    htmlFor="bio"
                    className="mb-2 block text-sm font-medium text-neutral-200"
                >
                    Bio
                </label>
                <textarea
                    name="bio"
                    id="bio"
                    value={bio}
                    onChange={(event) => setBio(event.target.value)}
                    placeholder="Tell people about yourself..."
                    className="h-40 w-full resize-none rounded-2xl border border-neutral-800 bg-neutral-950 px-4 py-3 text-sm leading-7 text-white outline-none transition-colors duration-200 placeholder:text-neutral-500 focus:border-sky-500"
                />
            </div>

            <button
                disabled={editUserInfo.isPending || username.length === 0 || bio.length === 0}
                onClick={() => {
                    editUserInfo.mutate({
                        username,
                        bio
                    });
                }}
                className="disabled:bg-neutral-800 disabled:text-neutral-500
                            disabled:cursor-not-allowed disabled:hover:bg-neutral-800  
                            h-11 cursor-pointer rounded-xl bg-sky-500 px-5 text-sm font-medium 
                            text-white transition-colors duration-200 hover:bg-sky-400"
            >
                {editUserInfo.isPending ? (
                    <div className="flex items-center gap-2">
                        <LoadingIcon />
                        <p>Saving changes...</p>
                    </div>
                ) : " Save Changes"}
            </button>
        </section>
    )
}