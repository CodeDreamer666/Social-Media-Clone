type ConnectionSectionProps = {
  title: string;
  emptyText: string;
  children: React.ReactNode;
  hasItems: boolean;
};

export default function ConnectionSection({
  title,
  emptyText,
  children,
  hasItems,
}: ConnectionSectionProps) {
  return (
    <section
      className={[
        "flex h-full flex-col rounded-3xl border border-white/[0.06] bg-zinc-900/60 p-6",
        "shadow-[0_8px_30px_rgba(0,0,0,0.35)] backdrop-blur-xl",
      ].join(" ")}
    >
      <h2 className="mb-4 text-[15px] font-semibold text-white">{title}</h2>

      {hasItems ? (
        <ul className="flex flex-1 flex-col gap-3">{children}</ul>
      ) : (
        <div
          className={[
            "rounded-2xl border border-white/[0.06] bg-black/30",
            "px-5 py-8 text-center",
          ].join(" ")}
        >
          <p className="text-[14px] text-zinc-500">{emptyText}</p>
        </div>
      )}
    </section>
  );
}
