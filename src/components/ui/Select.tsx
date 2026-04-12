import { type SelectHTMLAttributes, forwardRef } from "react";

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, error, className = "", id, children, ...props }, ref) => {
    return (
      <div className="flex flex-col gap-1">
        {label && (
          <label
            htmlFor={id}
            className="text-sm font-medium text-text-muted font-body"
          >
            {label}
          </label>
        )}
        <select
          ref={ref}
          id={id}
          className={`
            w-full px-3 py-2 rounded bg-surface border border-border
            text-text font-body text-sm
            focus:outline-none focus:border-leather/50 focus:ring-1 focus:ring-leather/30
            transition-colors appearance-none cursor-pointer
            ${error ? "border-red-500/60" : ""}
            ${className}
          `}
          {...props}
        >
          {children}
        </select>
        {error && <p className="text-xs text-red-400 font-body">{error}</p>}
      </div>
    );
  }
);

Select.displayName = "Select";
