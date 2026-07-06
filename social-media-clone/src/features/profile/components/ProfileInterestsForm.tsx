"use client";

import LoadingIcon from "~/components/shared/LoadingIcon";
import { interestOptions, type InterestValue } from "~/lib/interests";

type ProfileInterestsFormProps = {
    selectedInterests: InterestValue[];
    isPending: boolean;
    onToggleInterest: (interest: InterestValue) => void;
    onSave: () => void;
};

export default function ProfileInterestsForm({
    selectedInterests,
    isPending,
    onToggleInterest,
    onSave
}: ProfileInterestsFormProps) {
    const hasExactlyThreeInterests = selectedInterests.length === 3;

    return (
        <section
            className={[
                "rounded-3xl border border-white/[0.06] bg-zinc-900/60 p-6",
                "shadow-[0_8px_30px_rgba(0,0,0,0.35)] backdrop-blur-xl",
            ].join(" ")}
        >
            <div className="mb-4 flex items-center justify-between gap-3">
                <div>
                    <h2 className="text-[15px] font-semibold text-white">
                        Interests
                    </h2>
                    <p className="mt-1 text-[13px] text-zinc-500">
                        Choose exactly 3 categories to control your feed.
                    </p>
                </div>

                <span className="text-[13px] font-medium text-zinc-400">
                    {selectedInterests.length} / 3 selected
                </span>
            </div>

            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                {interestOptions.map((option) => {
                    const isSelected = selectedInterests.includes(option.value);
                    const isDisabled =
                        !isSelected &&
                        selectedInterests.length >= 3;

                    return (
                        <button
                            key={option.value}
                            type="button"
                            aria-pressed={isSelected}
                            disabled={isDisabled}
                            onClick={() => {
                                onToggleInterest(option.value);
                            }}
                            className={[
                                "min-h-11 cursor-pointer rounded-2xl border px-3 py-2",
                                "text-center text-[13px] font-medium transition-all duration-200",
                                "focus:outline-none focus:ring-2 focus:ring-blue-500/40",
                                "disabled:cursor-not-allowed disabled:opacity-50",
                                isSelected
                                    ? "border-blue-500/60 bg-blue-500/15 text-blue-100 shadow-md shadow-blue-500/10"
                                    : "border-white/[0.06] bg-black/40 text-zinc-300 hover:border-blue-500/40 hover:bg-black/50 hover:text-white",
                            ].join(" ")}
                        >
                            {option.label}
                        </button>
                    );
                })}
            </div>

            <div className="flex justify-end">
                <button
                    disabled={isPending || !hasExactlyThreeInterests}
                    onClick={onSave}
                    className={[
                        "mt-6 h-11 cursor-pointer rounded-full bg-gradient-to-br from-blue-500",
                        "to-indigo-600 px-5 text-[14px] font-medium text-white shadow-md",
                        "shadow-blue-500/20 transition-all duration-200 hover:brightness-110",
                        "active:scale-95 disabled:cursor-not-allowed disabled:bg-none",
                        "disabled:bg-zinc-800 disabled:text-zinc-500 disabled:shadow-none",
                    ].join(" ")}
                >
                    {isPending ? (
                        <div className="flex items-center justify-center gap-2">
                            <LoadingIcon />
                            <p>Saving interests...</p>
                        </div>
                    ) : "Save interests"}
                </button>
            </div>
        </section>
    );
}
