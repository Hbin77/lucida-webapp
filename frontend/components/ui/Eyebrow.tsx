import type { ReactNode } from "react";

type Props = {
  children: ReactNode;
  tone?: "indigo" | "ink";
};

export default function Eyebrow({ children, tone = "indigo" }: Props) {
  const color = tone === "indigo" ? "var(--indigo)" : "var(--ink-500)";
  return (
    <div
      className="text-[11px] font-medium uppercase tracking-[0.16em]"
      style={{ color }}
    >
      {children}
    </div>
  );
}
