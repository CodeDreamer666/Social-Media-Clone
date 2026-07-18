type EmptyInterestFeedProps = {
  hasSelectedInterests: boolean;
};

export default function EmptyInterestFeed({
  hasSelectedInterests,
}: EmptyInterestFeedProps) {
  return (
    <section
      className={[
        "mx-auto w-[92%] max-w-112.5 rounded-3xl border",
        "border-white/[0.06] bg-zinc-900/60 px-6 py-12 text-center",
        "shadow-[0_8px_30px_rgba(0,0,0,0.35)] backdrop-blur-xl",
      ].join(" ")}
    >
      <h2 className="text-lg font-semibold text-white">
        {hasSelectedInterests ? "No matching posts yet" : "No posts yet"}
      </h2>
      <p className="mt-2 text-[13px] leading-6 text-zinc-500">
        {hasSelectedInterests
          ? "Posts in your three selected categories will appear here."
          : "Public posts and posts shared by your connections will appear here."}
      </p>
    </section>
  );
}
