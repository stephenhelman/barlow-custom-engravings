import { type ButtonHTMLAttributes, forwardRef } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost" | "danger";
  size?: "sm" | "md" | "lg";
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = "primary", size = "md", className = "", children, ...props }, ref) => {
    const base =
      "inline-flex items-center justify-center font-body font-medium rounded transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-leather focus-visible:ring-offset-2 focus-visible:ring-offset-bg";

    const variants = {
      primary:
        "bg-leather text-bg hover:bg-leather-light active:scale-[0.98]",
      secondary:
        "border border-border hover:border-border-hover text-text bg-transparent hover:bg-surface-raised active:scale-[0.98]",
      ghost:
        "text-text-muted hover:text-text bg-transparent hover:bg-surface-raised",
      danger:
        "bg-red-800/80 text-text hover:bg-red-700 active:scale-[0.98]",
    };

    const sizes = {
      sm: "text-sm px-3 py-1.5 gap-1.5",
      md: "text-sm px-4 py-2 gap-2",
      lg: "text-base px-6 py-3 gap-2",
    };

    return (
      <button
        ref={ref}
        className={`${base} ${variants[variant]} ${sizes[size]} ${className}`}
        {...props}
      >
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";
