export default function Loader() {
  return (
    <div className="fixed inset-0 z-9999 flex items-center justify-center bg-black">
      <div className="flex flex-col items-center gap-5">
        {/* Spinner */}
        <div className="h-10 w-10 animate-spin rounded-full border-2 border-neutral-700 border-t-sky-500" />

        {/* Text */}
        <p className="text-sm font-medium tracking-wide text-neutral-400">
          Loading
        </p>
      </div>
    </div>
  );
}