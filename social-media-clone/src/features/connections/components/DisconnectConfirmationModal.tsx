"use client";

import LoadingIcon from "~/components/shared/LoadingIcon";
import ModalPortal from "~/components/shared/ModalPortal";
import useLockBodyScroll from "~/lib/useLockBodyScroll";
import useDialogFocus from "~/lib/useDialogFocus";

type DisconnectConfirmationModalProps = {
  userName: string;
  isPending: boolean;
  onCancel: () => void;
  onConfirm: () => void;
};

export default function DisconnectConfirmationModal({
  userName,
  isPending,
  onCancel,
  onConfirm,
}: DisconnectConfirmationModalProps) {
  useLockBodyScroll(true);
  const dialogRef = useDialogFocus<HTMLElement>(
    isPending ? undefined : onCancel,
  );

  return (
    <ModalPortal>
      <div
        className={[
          "fixed inset-0 z-9999 flex items-center justify-center overflow-y-auto",
          "bg-black/70 px-4 py-4 backdrop-blur-sm sm:items-center",
        ].join(" ")}
      >
        <section
          ref={dialogRef}
          tabIndex={-1}
          role="dialog"
          aria-modal="true"
          aria-labelledby="disconnect-title"
          className={[
            "max-h-[calc(100vh-2rem)] w-full max-w-md overflow-y-auto rounded-3xl",
            "border border-white/[0.06] bg-zinc-900/90 p-6",
            "shadow-[0_8px_30px_rgba(0,0,0,0.45)] backdrop-blur-xl",
          ].join(" ")}
        >
          <h2
            id="disconnect-title"
            className="mt-5 text-center text-xl font-semibold tracking-tight text-white"
          >
            Disconnect from {userName}?
          </h2>
          <p className="mt-3 text-center text-[14px] leading-6 text-zinc-400">
            You will both immediately lose access to each other&apos;s private
            posts.
          </p>

          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <button
              type="button"
              onClick={onCancel}
              disabled={isPending}
              className={[
                "flex min-h-11 flex-1 cursor-pointer items-center justify-center rounded-full",
                "border border-white/[0.08] bg-white/5 px-5 text-[14px] font-medium",
                "text-white transition-colors duration-200 hover:bg-white/10",
                "disabled:cursor-not-allowed disabled:opacity-70",
              ].join(" ")}
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={onConfirm}
              disabled={isPending}
              className={[
                "flex min-h-11 flex-1 cursor-pointer items-center justify-center rounded-full",
                "border border-red-500/20 bg-red-500/10 px-5 text-[14px] font-medium",
                "text-red-200 transition-colors duration-200 hover:bg-red-500/15",
                "disabled:cursor-not-allowed disabled:opacity-70",
              ].join(" ")}
            >
              {isPending ? (
                <div className="flex items-center gap-2">
                  <LoadingIcon />
                  Disconnecting...
                </div>
              ) : (
                "Confirm Disconnect"
              )}
            </button>
          </div>
        </section>
      </div>
    </ModalPortal>
  );
}
