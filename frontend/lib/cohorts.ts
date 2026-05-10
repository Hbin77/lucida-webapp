/**
 * Reference cohort statistics — Park (2024), Korean HC vs MCI.
 * Used to overlay Gaussian baselines onto the live histograms.
 */

export type Gaussian = { mean: number; std: number; label: string };

export const COHORT_HC: { ht: Gaussian; ft: Gaussian } = {
  ht: { mean: 108.77, std: 25.25,  label: "Park 2024 · HC" },
  ft: { mean: 622.93, std: 135.14, label: "Park 2024 · HC" },
};

export const COHORT_MCI: { ht: Gaussian; ft: Gaussian } = {
  ht: { mean: 184.85, std: 25.24,  label: "Park 2024 · MCI" },
  ft: { mean: 1351.51, std: 242.75, label: "Park 2024 · MCI" },
};

/** Probability density of a Normal distribution at x. */
export function pdf(x: number, g: Gaussian): number {
  const z = (x - g.mean) / g.std;
  return Math.exp(-0.5 * z * z) / (g.std * Math.sqrt(2 * Math.PI));
}
