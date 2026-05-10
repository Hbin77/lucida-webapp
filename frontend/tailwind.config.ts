import type { Config } from "tailwindcss";

/**
 * Tailwind config — Lucida (editorial paper canvas, indigo primary,
 * sage/clay/burgundy pathway hues).
 *
 * Color tokens live in app/globals.css as CSS variables (oklch). Components
 * reference them via inline style {{ color: "var(--ink-900)" }} or via the
 * tailwind-arbitrary util `text-[var(--ink-900)]`. We do NOT enumerate the
 * palette here — keeping a single source of truth in CSS lets us swap modes
 * without rebuilding Tailwind.
 */
const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: [
          "Inter",
          "ui-sans-serif",
          "system-ui",
          "-apple-system",
          "Helvetica Neue",
          "Arial",
          "sans-serif",
        ],
        serif: [
          "Source Serif 4",
          "Source Serif Pro",
          "ui-serif",
          "Georgia",
          "serif",
        ],
        mono: [
          "ui-monospace",
          "SFMono-Regular",
          "Menlo",
          "monospace",
        ],
      },
      maxWidth: {
        deck: "1200px",
      },
    },
  },
  plugins: [],
};

export default config;
