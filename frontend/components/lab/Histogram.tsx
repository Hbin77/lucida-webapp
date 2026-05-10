"use client";

import { useMemo } from "react";
import type { Histogram as Hist } from "@/lib/stats";
import { pdf, type Gaussian } from "@/lib/cohorts";

type Props = {
  hist: Hist;
  /** Optional cohort baselines drawn as Gaussian curves overlay. */
  overlays?: { gauss: Gaussian; color: string; dashed?: boolean }[];
  /** Vertical line at user's current mean. */
  marker?: number | null;
  unit?: string;
  /** Y-axis is "density" (normalised so bars + curves share scale). */
};

export default function Histogram({
  hist,
  overlays = [],
  marker = null,
  unit = "ms",
}: Props) {
  const W = 280;
  const H = 110;
  const PAD_X = 4;
  const PAD_Y = 8;

  const total = hist.bins.reduce((a, b) => a + b, 0);
  const binW = (W - PAD_X * 2) / hist.bins.length;

  // Find a shared max-density across bars and overlay PDFs so they coexist.
  const barMax =
    total > 0
      ? Math.max(
          ...hist.bins.map((c) => c / (total * hist.binSize))
        )
      : 0;
  const overlayMax = overlays.length
    ? Math.max(
        ...overlays.map((o) => 1 / (o.gauss.std * Math.sqrt(2 * Math.PI)))
      )
    : 0;
  const yMax = Math.max(barMax, overlayMax) * 1.05 || 1;

  const sample = useMemo(() => {
    // Sample 60 points across the histogram range for smooth curves
    const start = hist.binStart;
    const end = hist.binStart + hist.bins.length * hist.binSize;
    const xs: number[] = [];
    const N = 60;
    for (let i = 0; i <= N; i++) xs.push(start + ((end - start) * i) / N);
    return { xs, start, end };
  }, [hist]);

  function xToScreen(x: number) {
    return (
      PAD_X +
      ((x - sample.start) / (sample.end - sample.start)) * (W - PAD_X * 2)
    );
  }
  function densityToScreen(d: number) {
    return H - PAD_Y - (d / yMax) * (H - PAD_Y * 2);
  }

  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      role="img"
      aria-label="Distribution"
      className="w-full h-auto"
    >
      {/* axis baseline */}
      <line
        x1={PAD_X}
        x2={W - PAD_X}
        y1={H - PAD_Y}
        y2={H - PAD_Y}
        stroke="var(--rule)"
        strokeWidth="0.5"
      />

      {/* bars */}
      {hist.bins.map((c, i) => {
        const density = total > 0 ? c / (total * hist.binSize) : 0;
        const h = densityToScreen(density);
        return (
          <rect
            key={i}
            x={PAD_X + i * binW + 0.5}
            y={h}
            width={binW - 1}
            height={H - PAD_Y - h}
            fill="var(--ink-300)"
            opacity="0.55"
          />
        );
      })}

      {/* overlay curves */}
      {overlays.map((o, idx) => {
        const path = sample.xs
          .map((x, i) => {
            const y = densityToScreen(pdf(x, o.gauss));
            const sx = xToScreen(x);
            return `${i === 0 ? "M" : "L"} ${sx.toFixed(2)} ${y.toFixed(2)}`;
          })
          .join(" ");
        return (
          <path
            key={idx}
            d={path}
            fill="none"
            stroke={o.color}
            strokeWidth="1.6"
            strokeDasharray={o.dashed ? "3 3" : undefined}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        );
      })}

      {/* user marker */}
      {marker !== null && marker > sample.start && marker < sample.end ? (
        <g>
          <line
            x1={xToScreen(marker)}
            x2={xToScreen(marker)}
            y1={PAD_Y}
            y2={H - PAD_Y}
            stroke="var(--ink-900)"
            strokeWidth="1.4"
          />
          <circle
            cx={xToScreen(marker)}
            cy={PAD_Y + 4}
            r={3}
            fill="var(--ink-900)"
          />
        </g>
      ) : null}

      {/* axis labels */}
      <text
        x={PAD_X}
        y={H - 1}
        fontSize="8.5"
        fill="var(--ink-300)"
        fontFamily="Inter"
      >
        {sample.start} {unit}
      </text>
      <text
        x={W - PAD_X}
        y={H - 1}
        fontSize="8.5"
        fill="var(--ink-300)"
        fontFamily="Inter"
        textAnchor="end"
      >
        {sample.end} {unit}
      </text>
    </svg>
  );
}
