import type { Translations } from "./i18n";

export type SliderKind = "speed" | "variance";

export function levelLabel(
  t: Translations,
  kind: SliderKind,
  v: number
): string {
  if (kind === "speed") {
    if (v < 25) return t.sim.level.slow;
    if (v < 50) return t.sim.level.below;
    if (v < 75) return t.sim.level.above;
    return t.sim.level.fast;
  }
  if (v < 25) return t.sim.level.stable;
  if (v < 50) return t.sim.level.moderate;
  if (v < 75) return t.sim.level.inconsistent;
  return t.sim.level.erratic;
}
