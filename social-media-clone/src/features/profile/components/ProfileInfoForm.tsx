"use client";

import LoadingIcon from "~/components/shared/LoadingIcon";
import { BIO_MAX_LENGTH, USERNAME_MAX_LENGTH } from "~/lib/contentLimits";

type ProfileInfoFormProps = {
  username: string;
  bio: string;
  isPublic: boolean;
  isPending: boolean;
  onChangeUsername: (username: string) => void;
  onChangeBio: (bio: string) => void;
  onChangeIsPublic: (isPublic: boolean) => void;
  onSave: () => void;
};

export default function ProfileInfoForm({
  username,
  bio,
  isPublic,
  isPending,
  onChangeUsername,
  onChangeBio,
  onChangeIsPublic,
  onSave,
}: ProfileInfoFormProps) {
  return (
    <section
      className={[
        "rounded-3xl border border-white/[0.06] bg-zinc-900/60 p-6",
        "shadow-[0_8px_30px_rgba(0,0,0,0.35)] backdrop-blur-xl",
      ].join(" ")}
    >
      <h2 className="mb-4 text-[15px] font-semibold text-white">Profile</h2>

      <div className="mb-6">
        <label
          htmlFor="username"
          className="mb-2 block text-[13px] font-medium text-zinc-300"
        >
          Username
        </label>
        <input
          value={username}
          onChange={(event) => onChangeUsername(event.target.value)}
          type="text"
          name="username"
          id="username"
          autoComplete="off"
          placeholder="Tell people about yourself..."
          maxLength={USERNAME_MAX_LENGTH + 1}
          className={[
            "mb-4 w-full resize-none rounded-2xl border border-white/[0.06] bg-black/40",
            "px-4 py-3 text-[14px] leading-7 text-white transition-colors outline-none",
            "duration-200 placeholder:text-zinc-500 focus:border-blue-500/50",
          ].join(" ")}
        />

        <label
          htmlFor="bio"
          className="mb-2 block text-[13px] font-medium text-zinc-300"
        >
          Bio
        </label>
        <textarea
          name="bio"
          id="bio"
          value={bio}
          onChange={(event) => onChangeBio(event.target.value)}
          placeholder="Tell people about yourself..."
          maxLength={BIO_MAX_LENGTH}
          className={[
            "h-40 w-full resize-none rounded-2xl border border-white/[0.06] bg-black/40",
            "px-4 py-3 text-[14px] leading-7 text-white transition-colors outline-none",
            "duration-200 placeholder:text-zinc-500 focus:border-blue-500/50",
          ].join(" ")}
        />

        <div className="mt-4">
          <div className="mb-3">
            <h3 className="text-[13px] font-medium text-zinc-300">
              Account visibility
            </h3>
            <p className="mt-1 text-[12px] leading-5 text-zinc-500">
              Private profiles share your posts only with accepted connections.
              Your comments remain visible with the posts where you wrote them.
            </p>
          </div>

          <div className="relative grid grid-cols-2 gap-2 rounded-2xl border border-white/[0.06] bg-black/40 p-1">
            <div
              className={[
                "absolute inset-y-1 left-1 w-[calc(50%-0.25rem)] rounded-xl",
                "bg-blue-500/15 shadow-md shadow-blue-500/10",
                "transition-transform duration-300 ease-out",
                isPublic ? "translate-x-0" : "translate-x-full",
              ].join(" ")}
            />

            <button
              type="button"
              aria-pressed={isPublic}
              onClick={() => {
                onChangeIsPublic(true);
              }}
              className={[
                "relative z-10 cursor-pointer rounded-xl px-3 py-3 text-[13px] font-medium",
                "transition-colors duration-200",
                isPublic
                  ? "text-blue-100"
                  : "text-zinc-400 hover:bg-white/[0.04] hover:text-white",
              ].join(" ")}
            >
              Public
            </button>

            <button
              type="button"
              aria-pressed={!isPublic}
              onClick={() => {
                onChangeIsPublic(false);
              }}
              className={[
                "relative z-10 cursor-pointer rounded-xl px-3 py-3 text-[13px] font-medium",
                "transition-colors duration-200",
                !isPublic
                  ? "text-blue-100"
                  : "text-zinc-400 hover:bg-white/[0.04] hover:text-white",
              ].join(" ")}
            >
              Private
            </button>
          </div>
        </div>
      </div>

      <div className="flex justify-end">
        <button
          disabled={
            isPending || username.trim().length === 0 || bio.trim().length === 0
          }
          onClick={onSave}
          className={[
            "h-11 cursor-pointer rounded-full bg-gradient-to-br from-blue-500",
            "to-indigo-600 px-5 text-[14px] font-medium text-white shadow-md",
            "shadow-blue-500/20 transition-all duration-200 hover:brightness-110",
            "active:scale-95 disabled:cursor-not-allowed disabled:bg-none",
            "disabled:bg-zinc-800 disabled:text-zinc-500 disabled:shadow-none",
          ].join(" ")}
        >
          {isPending ? (
            <div className="flex items-center justify-center gap-2">
              <LoadingIcon />
              <p>Saving changes...</p>
            </div>
          ) : (
            "Save changes"
          )}
        </button>
      </div>
    </section>
  );
}
