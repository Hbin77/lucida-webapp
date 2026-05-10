/**
 * Live keystroke capture — privacy-preserving timing only.
 *
 * What we read:   keydown / keyup events with `performance.now()` timestamps.
 * What we keep:   timing deltas (HT, FT) — never the key identity, never the
 *                 character composed.
 * What we send:   aggregate statistics only (mean, std, count).
 *
 * We expose a tiny store + an attach helper that wires up listeners on a
 * single textarea / contenteditable element.
 */

import {
  newHistogram,
  histogramAdd,
  newWelford,
  welfordUpdate,
  welfordStd,
  type Histogram,
  type Welford,
} from "./stats";

export type SessionState = {
  startedAt: number | null;
  totalKeystrokes: number;

  ht: Welford; // hold time stats (ms)
  ft: Welford; // flight time stats (ms)

  htHist: Histogram;
  ftHist: Histogram;

  // Recent samples for the live timeline / sparkline
  recentHt: number[]; // last N
  recentFt: number[];
  recentTs: number[]; // performance.now() at each keyup

  // For visual privacy mirror
  redactedLength: number; // number of "kept" characters (excluding modifiers)
};

export const SESSION_LIMIT_RECENT = 64;
export const HT_HIST_RANGE = { start: 40, end: 320, binSize: 14 };  // 20 bins
export const FT_HIST_RANGE = { start: 0, end: 2000, binSize: 100 }; // 20 bins

export function newSession(): SessionState {
  return {
    startedAt: null,
    totalKeystrokes: 0,
    ht: newWelford(),
    ft: newWelford(),
    htHist: newHistogram(
      HT_HIST_RANGE.start,
      HT_HIST_RANGE.end,
      HT_HIST_RANGE.binSize
    ),
    ftHist: newHistogram(
      FT_HIST_RANGE.start,
      FT_HIST_RANGE.end,
      FT_HIST_RANGE.binSize
    ),
    recentHt: [],
    recentFt: [],
    recentTs: [],
    redactedLength: 0,
  };
}

/** Discard non-printable / modifier keys for HT / FT computation. */
export function isCountableKey(e: KeyboardEvent): boolean {
  if (e.ctrlKey || e.metaKey || e.altKey) return false;
  if (e.key.length === 1) return true; // single character (incl. space)
  // Allow Backspace as a "keystroke" too — it has cognitive load
  if (e.key === "Backspace" || e.key === "Enter") return true;
  return false;
}

type Captured = {
  ht?: number;
  ft?: number;
  ts: number;
};

/** Stateful capture machine — keeps last keyup time and currently-held keys. */
export function createCapture() {
  let lastKeyupTs: number | null = null;
  const heldDownAt = new Map<string, number>();

  return {
    onKeyDown(e: KeyboardEvent): Captured | null {
      if (!isCountableKey(e)) return null;
      const now = performance.now();
      // record only if we don't already have it (avoid auto-repeat)
      if (!heldDownAt.has(e.code)) {
        heldDownAt.set(e.code, now);
      }
      const captured: Captured = { ts: now };
      if (lastKeyupTs !== null) {
        captured.ft = Math.max(0, now - lastKeyupTs);
      }
      return captured;
    },

    onKeyUp(e: KeyboardEvent): Captured | null {
      if (!isCountableKey(e)) return null;
      const now = performance.now();
      const downTs = heldDownAt.get(e.code);
      heldDownAt.delete(e.code);
      lastKeyupTs = now;
      if (downTs === undefined) return { ts: now };
      const ht = Math.max(0, now - downTs);
      return { ht, ts: now };
    },

    reset() {
      lastKeyupTs = null;
      heldDownAt.clear();
    },
  };
}

export function applyKeyDown(s: SessionState, c: Captured): SessionState {
  if (c.ft === undefined) return s;
  const next: SessionState = {
    ...s,
    startedAt: s.startedAt ?? c.ts,
    ft: welfordUpdate(s.ft, c.ft),
    ftHist: histogramAdd(s.ftHist, c.ft),
    recentFt: [...s.recentFt, c.ft].slice(-SESSION_LIMIT_RECENT),
  };
  return next;
}

export function applyKeyUp(s: SessionState, c: Captured): SessionState {
  if (c.ht === undefined) {
    return {
      ...s,
      totalKeystrokes: s.totalKeystrokes + 1,
      redactedLength: s.redactedLength + 1,
      recentTs: [...s.recentTs, c.ts].slice(-SESSION_LIMIT_RECENT),
    };
  }
  const next: SessionState = {
    ...s,
    startedAt: s.startedAt ?? c.ts,
    totalKeystrokes: s.totalKeystrokes + 1,
    redactedLength: s.redactedLength + 1,
    ht: welfordUpdate(s.ht, c.ht),
    htHist: histogramAdd(s.htHist, c.ht),
    recentHt: [...s.recentHt, c.ht].slice(-SESSION_LIMIT_RECENT),
    recentTs: [...s.recentTs, c.ts].slice(-SESSION_LIMIT_RECENT),
  };
  return next;
}

export function sessionFeatures(s: SessionState) {
  return {
    avg_ht: round1(s.ht.mean),
    std_ht: round1(welfordStd(s.ht)),
    avg_ft: round1(s.ft.mean),
    std_ft: round1(welfordStd(s.ft)),
    avg_keys_per_session: s.totalKeystrokes,
  };
}

function round1(x: number): number {
  return Math.round(x * 10) / 10;
}
