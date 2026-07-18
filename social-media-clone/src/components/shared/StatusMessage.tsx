type StatusMessageProps = {
  isSuccess: "IDLE" | true | false;
  message: string;
  closeMessage: () => void;
};

export default function StatusMessage({
  isSuccess,
  message,
  closeMessage,
}: StatusMessageProps) {
  if (isSuccess === "IDLE") return null;

  return (
    <div className="pointer-events-none fixed inset-x-0 top-20 z-50">
      <div className="mx-auto flex max-w-3xl justify-end px-4 sm:px-6">
        <section
          role={isSuccess ? "status" : "alert"}
          aria-live={isSuccess ? "polite" : "assertive"}
          className={[
            "pointer-events-auto flex items-center gap-4 rounded-2xl border px-5 py-4",
            "bg-zinc-900/80 shadow-[0_8px_30px_rgba(0,0,0,0.35)] backdrop-blur-xl",
            "transition-all duration-300",
            isSuccess ? "border-emerald-500/20" : "border-[#ff453a]/20",
          ].join(" ")}
        >
          <div
            className={[
              "flex h-7 w-7 shrink-0 items-center justify-center rounded-full",
              isSuccess ? "bg-emerald-500/10" : "bg-[#ff453a]/10",
            ].join(" ")}
          >
            {isSuccess ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
                className="size-4 text-emerald-400"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="m4.5 12.75 6 6 9-13.5"
                />
              </svg>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
                className="size-4 text-[#ff453a]"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 9v3.75m0 3.75h.008v.008H12V16.5Zm9-4.5a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                />
              </svg>
            )}
          </div>

          <h2 className="text-[14px] font-medium text-white">{message}</h2>

          <button
            type="button"
            onClick={() => closeMessage()}
            aria-label="Dismiss message"
            className={[
              "flex size-7 shrink-0 cursor-pointer items-center justify-center rounded-full",
              "text-zinc-500 transition-colors duration-200 hover:bg-white/5",
              "hover:text-white",
            ].join(" ")}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
              className="size-3.5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18 18 6M6 6l12 12"
              />
            </svg>
          </button>
        </section>
      </div>
    </div>
  );
}
