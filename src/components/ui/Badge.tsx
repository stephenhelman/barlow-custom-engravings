import { type HTMLAttributes } from "react";

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: "sold" | "for-sale" | "status";
  label: string;
}

export function Badge({ variant = "status", label, className = "", ...props }: BadgeProps) {
  const base = "inline-flex items-center px-2 py-0.5 rounded text-xs font-medium font-body tracking-wide uppercase";
  const variants: Record<string, string> = {
    sold: "bg-text-faint text-text-muted",
    "for-sale": "bg-leather/20 text-leather-light border border-leather/30",
    status: "bg-surface-raised text-text-muted border border-border",
  };
  return (
    <span className={`${base} ${variants[variant]} ${className}`} {...props}>
      {label}
    </span>
  );
}
