export default function Loader() {
  return (
    <div
      role="status"
      aria-live="polite"
      className="fixed inset-0 z-9999 flex items-center justify-center bg-black"
    >
      <div className="flex flex-col items-center gap-5">
        <div className="h-10 w-10 animate-spin rounded-full border-2 border-white/[0.08] border-t-blue-500" />
        <p className="text-[13px] font-medium tracking-wide text-zinc-500">
          Loading…
        </p>
      </div>
    </div>
  );
}
