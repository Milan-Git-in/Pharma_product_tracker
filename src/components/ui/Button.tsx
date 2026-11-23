import React from "react";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "destructive" | "outline" | "ghost";
  size?: "sm" | "md" | "lg";
  icon?: string;
  loading?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      children,
      variant = "primary",
      size = "md",
      icon,
      loading = false,
      className = "",
      disabled,
      ...props
    },
    ref
  ) => {
    const baseClasses =
      "inline-flex items-center justify-center font-body-md font-semibold rounded-lg transition-all focus:outline-none focus:ring-2 focus:ring-offset-1 select-none disabled:opacity-50 disabled:cursor-not-allowed min-h-[44px]";

    const variantClasses = {
      primary:
        "bg-primary-container text-on-primary hover:bg-primary focus:ring-primary shadow-xs",
      secondary:
        "bg-surface-container-lowest border border-outline-variant/60 text-secondary hover:bg-surface-container focus:ring-secondary shadow-xs",
      destructive:
        "bg-[#FEF2F2] border border-[#FCA5A5] text-[#DC2626] hover:bg-red-100 focus:ring-error shadow-xs",
      outline:
        "bg-transparent border border-outline-variant text-on-surface hover:bg-surface-container focus:ring-primary",
      ghost:
        "bg-transparent text-on-surface-variant hover:bg-surface-container hover:text-on-surface focus:ring-primary",
    }[variant];

    const sizeClasses = {
      sm: "px-3 py-1.5 text-xs min-h-[36px]",
      md: "px-4 py-2 text-xs min-h-[44px]",
      lg: "px-5 py-2.5 text-sm min-h-[48px]",
    }[size];

    return (
      <button
        ref={ref}
        disabled={disabled || loading}
        className={`${baseClasses} ${variantClasses} ${sizeClasses} ${className}`}
        {...props}
      >
        {loading && (
          <span className="w-4 h-4 mr-2 border-2 border-current border-t-transparent rounded-full animate-spin" />
        )}
        {!loading && icon && (
          <span className="material-symbols-outlined text-[18px] mr-1.5">{icon}</span>
        )}
        <span>{children}</span>
      </button>
    );
  }
);

Button.displayName = "Button";
export default Button;

