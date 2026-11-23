import React from "react";

export interface SelectOption {
  value: string;
  label: string;
}

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  options: SelectOption[];
  placeholder?: string;
}

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, error, options, placeholder, className = "", id, ...props }, ref) => {
    const selectId = id || (label ? label.toLowerCase().replace(/\s+/g, "-") : undefined);

    return (
      <div className="flex flex-col gap-1 w-full text-left">
        {label && (
          <label
            htmlFor={selectId}
            className="font-caption text-xs font-medium text-on-surface-variant"
          >
            {label}
          </label>
        )}
        <div className="relative flex items-center min-h-[44px]">
          <select
            ref={ref}
            id={selectId}
            className={`w-full h-10 px-3 pr-8 bg-surface-container-lowest border rounded-lg text-xs font-body-md text-on-surface transition-all focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary appearance-none cursor-pointer disabled:bg-surface-container-high disabled:opacity-60 ${
              error ? "border-error focus:ring-error" : "border-outline-variant/60"
            } ${className}`}
            {...props}
          >
            {placeholder && (
              <option value="" disabled>
                {placeholder}
              </option>
            )}
            {options.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
          <span className="material-symbols-outlined absolute right-2.5 text-outline text-[18px] pointer-events-none">
            expand_more
          </span>
        </div>
        {error && <span className="font-caption text-[11px] text-error">{error}</span>}
      </div>
    );
  }
);

Select.displayName = "Select";
export default Select;

