type Props = { size?: number };

export default function LucidaMark({ size = 22 }: Props) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <circle
        cx="12"
        cy="12"
        r="9"
        fill="none"
        stroke="var(--ink-900)"
        strokeWidth="1.4"
      />
      <circle cx="12" cy="12" r="3.4" fill="var(--ink-900)" />
      <line
        x1="12"
        y1="0.5"
        x2="12"
        y2="3.5"
        stroke="var(--ink-900)"
        strokeWidth="1.4"
      />
    </svg>
  );
}
