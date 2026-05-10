"use client";

import type { FeatureContribution } from "@/lib/api";

type Props = {
  baselineScore: number; // typically 100 (HC baseline)
  finalScore: number;
  contributions: FeatureContribution[];
  /** Localized human label per feature key. */
  labelOf: (k: string) => string;
};

const W = 540;
const ROW_H = 26;
const PAD_X = 110;
const PAD_R = 60;
const BAR_W_MAX = W - PAD_X - PAD_R;

/** Feature-contribution waterfall.
 *  Baseline (HC) score on the left, final score on the right;
 *  each row is one feature's signed contribution. */
export default function Waterfall({
  baselineScore,
  finalScore,
  contributions,
  labelOf,
}: Props) {
  // Sort by absolute magnitude — biggest movers first.
  const rows = [...contributions].sort(
    (a, b) => Math.abs(b.delta_score) - Math.abs(a.delta_score)
  );

  // Find max abs delta to scale bar widths
  const maxAbs = Math.max(1, ...rows.map((r) => Math.abs(r.delta_score)));

  const totalH = rows.length * ROW_H + 36 + 24;

  return (
    <svg viewBox={`0 0 ${W} ${totalH}`} className="w-full h-auto" role="img">
      {/* Baseline header */}
      <text x={PAD_X} y={14} fontSize="10" fill="var(--ink-400)">
        baseline (HC)
      </text>
      <text
        x={PAD_X + BAR_W_MAX / 2}
        y={14}
        fontSize="10"
        fill="var(--ink-400)"
        textAnchor="middle"
      >
        each feature's contribution
      </text>
      <text
        x={W - PAD_R}
        y={14}
        fontSize="10"
        fill="var(--ink-400)"
        textAnchor="end"
      >
        score
      </text>

      <line
        x1={PAD_X}
        x2={W - PAD_R}
        y1={20}
        y2={20}
        stroke="var(--rule)"
        strokeWidth="0.5"
      />

      {/* Baseline tick on the left */}
      <text
        x={PAD_X - 8}
        y={36}
        fontSize="13"
        fill="var(--ink-900)"
        textAnchor="end"
        fontWeight="500"
        className="tabular"
      >
        {baselineScore}
      </text>

      {/* Rows */}
      {rows.map((r, i) => {
        const y = 36 + i * ROW_H;
        const w = (Math.abs(r.delta_score) / maxAbs) * (BAR_W_MAX * 0.72);
        const cx = PAD_X + BAR_W_MAX / 2;
        const isNeg = r.delta_score < 0;
        const x = isNeg ? cx - w : cx;
        const color = isNeg ? "var(--burgundy)" : "var(--sage)";
        return (
          <g key={r.feature}>
            {/* feature label (left col) */}
            <text
              x={PAD_X - 8}
              y={y + 5}
              fontSize="11.5"
              fill="var(--ink-700)"
              textAnchor="end"
            >
              {labelOf(r.feature)}
            </text>

            {/* center axis tick */}
            <line
              x1={cx}
              x2={cx}
              y1={y - 8}
              y2={y + 12}
              stroke="var(--rule)"
              strokeWidth="0.5"
              strokeDasharray="2 2"
            />

            {/* bar */}
            <rect
              x={x}
              y={y - 6}
              width={Math.max(2, w)}
              height={10}
              fill={color}
              opacity="0.85"
              rx="2"
            />

            {/* delta text (right of bar) */}
            <text
              x={isNeg ? x - 6 : x + w + 6}
              y={y + 4}
              fontSize="10.5"
              fill={color}
              textAnchor={isNeg ? "end" : "start"}
              className="tabular"
              fontWeight="500"
            >
              {r.delta_score > 0 ? "+" : ""}
              {r.delta_score.toFixed(0)}
            </text>
          </g>
        );
      })}

      {/* Final score */}
      <text
        x={W - PAD_R + 6}
        y={36 + Math.max(1, rows.length - 1) * ROW_H + 5}
        fontSize="13"
        fill="var(--ink-900)"
        textAnchor="start"
        fontWeight="600"
        className="tabular"
      >
        = {finalScore}
      </text>
    </svg>
  );
}
