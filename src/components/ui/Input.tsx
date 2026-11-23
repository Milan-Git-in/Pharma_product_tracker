import React from "react";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  leftIcon?: string;
  rightAction?: React.ReactNode;
  monospace?: boolean;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      error,
      helperText,
      leftIcon,
      rightAction,
      monospace = false,
      className = "",
      id,
      ...props
    },
    ref
  ) => {
    const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, "-") : undefined);

    return (
      <div className="flex flex-col gap-1 w-full text-left">
        {label && (
          <label
            htmlFor={inputId}
            className="font-caption text-xs font-medium text-on-surface-variant"
          >
            {label}
          </label>
        )}
        <div className="relative flex items-center min-h-[44px]">
          {leftIcon && (
            <span className="material-symbols-outlined absolute left-3 text-outline text-[18px] pointer-events-none">
              {leftIcon}
            </span>
          )}
          <input
            ref={ref}
            id={inputId}
            className={`w-full h-10 px-3 bg-surface-container-lowest border rounded-lg text-xs text-on-surface transition-all focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary disabled:bg-surface-container-high disabled:opacity-60 ${
              leftIcon ? "pl-9" : ""
            } ${rightAction ? "pr-12" : ""} ${
              monospace ? "font-mono" : "font-body-md"
            } ${error ? "border-error focus:ring-error" : "border-outline-variant/60"} ${className}`}
            {...props}
          />
          {rightAction && (
            <div className="absolute right-2.5 flex items-center">{rightAction}</div>
          )}
        </div>
        {error && <span className="font-caption text-[11px] text-error">{error}</span>}
        {!error && helperText && (
          <span className="font-caption text-[11px] text-on-surface-variant">
            {helperText}
          </span>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";
export default Input;

