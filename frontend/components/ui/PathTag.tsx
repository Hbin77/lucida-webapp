import type { ReactNode } from "react";

export type PathwayCode = "A" | "B" | "C";

export const PATHWAY_COLOR: Record<
  PathwayCode,
  { fg: string; soft: string }
> = {
  A: { fg: "var(--sage)",     soft: "var(--sage-soft)" },
  B: { fg: "var(--clay)",     soft: "var(--clay-soft)" },
  C: { fg: "var(--burgundy)", soft: "var(--burgundy-soft)" },
};

type Props = {
  code: PathwayCode;
  children: ReactNode;
};

export default function PathTag({ code, children }: Props) {
  const c = PATHWAY_COLOR[code];
  return (
    <span
      className="inline-flex items-center gap-1.5 px-2 h-6 rounded-full text-[11px] font-medium tracking-wide"
      style={{ background: c.soft, color: c.fg }}
    >
      <span
        className="w-1.5 h-1.5 rounded-full"
        style={{ background: c.fg }}
      />
      {children}
    </span>
  );
}
