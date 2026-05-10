import type { ButtonHTMLAttributes, ReactNode, CSSProperties } from "react";

type Variant = "primary" | "ghost" | "link";

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  children: ReactNode;
  variant?: Variant;
  className?: string;
};

export default function Button({
  children,
  variant = "primary",
  className = "",
  ...rest
}: Props) {
  const base =
    "inline-flex items-center justify-center gap-2 px-5 h-11 rounded-[8px] text-[14px] font-medium transition-colors duration-150 disabled:opacity-50 disabled:cursor-not-allowed";

  const styles: CSSProperties =
    variant === "primary"
      ? { background: "var(--ink-900)", color: "var(--paper)" }
      : variant === "ghost"
      ? {
          background: "transparent",
          color: "var(--ink-900)",
          border: "1px solid var(--rule-strong)",
        }
      : { background: "transparent", color: "var(--ink-700)" };

  return (
    <button className={`${base} ${className}`} style={styles} {...rest}>
      {children}
    </button>
  );
}
