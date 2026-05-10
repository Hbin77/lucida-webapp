"use client";

import type { CohortDistance } from "@/lib/api";

type Props = {
  distances: CohortDistance[];
  title: string;
  hint: string;
};

const COHORT_COLOR: Record<CohortDistance["cohort"], string> = {
  HC:  "var(--sage)",
  SCD: "var(--indigo)",
  MCI: "var(--clay)",
  AD:  "var(--burgundy)",
};

/**
 * CohortDistance — bars showing standardised Euclidean distance to each
 * cohort centroid (HC / SCD / MCI / AD). Closest cohort is highlighted.
 *
 * Interpretation: smaller is closer. The cohort the user most resembles.
 */
export default function CohortDistanceBars({
  distances,
  title,
  hint,
}: Props) {
  if (!distances.length) return null;

  const maxD = Math.max(...distances.map((d) => d.distance));
  const minD = Math.min(...distances.map((d) => d.distance));
  // closest cohort gets full bar in inverse mapping; widen to inverse scale.
  const widthFor = (d: number) => {
    if (maxD === minD) return 50;
    // closest = 100%, farthest = 30%
    return 100 - ((d - minD) / (maxD - minD)) * 70;
  };

  const closest = distances.reduce((a, b) =>
    a.distance < b.distance ? a : b
  );

  return (
    <div className="rule-t pt-4">
      <div className="flex items-baseline justify-between">
        <div
          className="text-[11px] uppercase tracking-[0.14em]"
          style={{ color: "var(--ink-400)" }}
        >
          {title}
        </div>
        <div
          className="text-[11px]"
          style={{ color: COHORT_COLOR[closest.cohort] }}
        >
          ← {closest.cohort}
        </div>
      </div>

      <div className="mt-3 space-y-2">
        {distances.map((d) => {
          const isClosest = d.cohort === closest.cohort;
          const w = widthFor(d.distance);
          return (
            <div key={d.cohort}>
              <div className="flex items-baseline justify-between text-[12px]">
                <span
                  className="font-medium"
                  style={{
                    color: isClosest
                      ? COHORT_COLOR[d.cohort]
                      : "var(--ink-700)",
                  }}
                >
                  {d.cohort}
                </span>
                <span
                  className="tabular"
                  style={{ color: "var(--ink-400)" }}
                >
                  {d.distance.toFixed(2)}
                </span>
              </div>
              <div className="mt-1 lc-bar-track" style={{ height: "6px" }}>
                <div
                  className="lc-bar-fill"
                  style={{
                    width: `${w}%`,
                    background: COHORT_COLOR[d.cohort],
                    opacity: isClosest ? 0.95 : 0.45,
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>

      <p
        className="mt-3 text-[11px] leading-[1.5]"
        style={{ color: "var(--ink-400)" }}
      >
        {hint}
      </p>
    </div>
  );
}
