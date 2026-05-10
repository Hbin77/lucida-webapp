/**
 * Welford's online algorithm for mean / variance / std-dev.
 * O(1) update, numerically stable.
 */

export type Welford = {
  count: number;
  mean: number;
  M2: number;
};

export function newWelford(): Welford {
  return { count: 0, mean: 0, M2: 0 };
}

export function welfordUpdate(w: Welford, x: number): Welford {
  const count = w.count + 1;
  const delta = x - w.mean;
  const mean = w.mean + delta / count;
  const delta2 = x - mean;
  const M2 = w.M2 + delta * delta2;
  return { count, mean, M2 };
}

export function welfordVariance(w: Welford): number {
  return w.count > 1 ? w.M2 / (w.count - 1) : 0;
}

export function welfordStd(w: Welford): number {
  return Math.sqrt(welfordVariance(w));
}

// ── Histogram binning ──────────────────────────────────────────────
export type Histogram = {
  binSize: number;
  binStart: number;
  bins: number[];
};

export function newHistogram(
  binStart: number,
  binEnd: number,
  binSize: number
): Histogram {
  const n = Math.max(1, Math.ceil((binEnd - binStart) / binSize));
  return { binSize, binStart, bins: new Array(n).fill(0) };
}

export function histogramAdd(h: Histogram, x: number): Histogram {
  const idx = Math.floor((x - h.binStart) / h.binSize);
  if (idx < 0 || idx >= h.bins.length) return h;
  const bins = h.bins.slice();
  bins[idx] += 1;
  return { ...h, bins };
}

export function histogramTotal(h: Histogram): number {
  return h.bins.reduce((a, b) => a + b, 0);
}
