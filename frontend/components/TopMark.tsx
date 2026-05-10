import LucidaMark from "./ui/LucidaMark";

export default function TopMark() {
  return (
    <div
      className="fixed top-4 left-4 z-40 flex items-center gap-2 px-3 h-9 rounded-full"
      style={{
        background: "oklch(99% 0.004 90 / 0.82)",
        border: "1px solid var(--rule-strong)",
        backdropFilter: "blur(8px)",
        WebkitBackdropFilter: "blur(8px)",
      }}
    >
      <LucidaMark />
      <span
        className="font-serif text-[14px]"
        style={{ color: "var(--ink-900)" }}
      >
        Lucida
      </span>
    </div>
  );
}
