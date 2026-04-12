import { type TextareaHTMLAttributes, forwardRef } from "react";

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, error, className = "", id, ...props }, ref) => {
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
        <textarea
          ref={ref}
          id={id}
          className={`
            w-full px-3 py-2 rounded bg-surface border border-border
            text-text font-body text-sm placeholder:text-text-faint
            focus:outline-none focus:border-leather/50 focus:ring-1 focus:ring-leather/30
            transition-colors resize-y min-h-[100px]
            ${error ? "border-red-500/60" : ""}
            ${className}
          `}
          {...props}
        />
        {error && <p className="text-xs text-red-400 font-body">{error}</p>}
      </div>
    );
  }
);

Textarea.displayName = "Textarea";
