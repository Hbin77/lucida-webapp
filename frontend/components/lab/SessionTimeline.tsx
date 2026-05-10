"use client";

type Props = {
  /** Recent flight times in ms — one entry per keystroke (after the first). */
  recentFt: number[];
  /** Recent hold times in ms — one entry per keystroke. */
  recentHt: number[];
};

/**
 * SessionTimeline — a sparkline-style timeline of recent keystrokes.
 * Each keystroke is a vertical lollipop whose:
 *   - x position = its order (oldest left, newest right)
 *   - height    = flight time (longer = bigger gap)
 *   - dot color = hold time (cool = short, warm = long)
 *
 * The result reads like a heartbeat trace, which makes irregular rhythm
 * visually obvious without forcing the user to read numbers.
 */
export default function SessionTimeline({ recentFt, recentHt }: Props) {
  const W = 540;
  const H = 80;
  const PAD = 6;
  const N = Math.max(recentFt.length, recentHt.length);

  if (N === 0) {
    return (
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-auto">
        <text
          x={W / 2}
          y={H / 2 + 4}
          textAnchor="middle"
          fontSize="11"
          fill="var(--ink-300)"
        >
          waiting for input…
        </text>
      </svg>
    );
  }

  const ftMax = Math.max(120, ...recentFt);
  const innerH = H - PAD * 2;
  const stepX = (W - PAD * 2) / Math.max(1, N - 1);

  function htColor(ht: number): string {
    // 80ms → sage (calm); 200ms+ → burgundy (slow)
    const t = Math.min(1, Math.max(0, (ht - 80) / 140));
    // interpolate between sage and burgundy via mix() not available; use stops
    if (t < 0.33) return "var(--sage)";
    if (t < 0.66) return "var(--clay)";
    return "var(--burgundy)";
  }

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-auto" role="img">
      {/* baseline */}
      <line
        x1={PAD}
        x2={W - PAD}
        y1={H - PAD}
        y2={H - PAD}
        stroke="var(--rule)"
        strokeWidth="0.5"
      />

      {Array.from({ length: N }).map((_, i) => {
        const ft = recentFt[i] ?? 0;
        const ht = recentHt[i] ?? 0;
        const x = PAD + i * stepX;
        const h = (ft / ftMax) * innerH;
        const yTop = H - PAD - h;
        return (
          <g key={i}>
            <line
              x1={x}
              x2={x}
              y1={H - PAD}
              y2={yTop}
              stroke="var(--ink-300)"
              strokeWidth="1"
              opacity="0.7"
            />
            <circle
              cx={x}
              cy={yTop}
              r={2.6}
              fill={htColor(ht)}
            />
          </g>
        );
      })}

      <text x={PAD} y={11} fontSize="9.5" fill="var(--ink-300)">
        rhythm — height = flight time, color = hold time
      </text>
    </svg>
  );
}
