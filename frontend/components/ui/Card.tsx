import type { ElementType, HTMLAttributes, ReactNode } from "react";

type Props = HTMLAttributes<HTMLElement> & {
  children: ReactNode;
  className?: string;
  as?: ElementType;
};

export default function Card({
  children,
  className = "",
  as: Tag = "div",
  ...rest
}: Props) {
  return (
    <Tag
      className={`rounded-[10px] ${className}`}
      style={{
        background: "var(--paper)",
        border: "1px solid var(--rule)",
        boxShadow: "var(--shadow-card)",
      }}
      {...rest}
    >
      {children}
    </Tag>
  );
}
