import React from "react";

export type PillVariant =
  | "compliant"
  | "warning"
  | "critical"
  | "inactive"
  | "primary"
  | "secondary"
  | "prototype"
  | "neutral";

interface StatusPillProps {
  label: string;
  variant?: PillVariant;
  dot?: boolean;
  pulse?: boolean;
  icon?: string;
  className?: string;
  size?: "sm" | "md";
}

export const StatusPill: React.FC<StatusPillProps> = ({
  label,
  variant = "compliant",
  dot = true,
  pulse = false,
  icon,
  className = "",
  size = "md",
}) => {
  const variantStyles: Record<PillVariant, { container: string; dot: string; text: string }> = {
    compliant: {
      container: "bg-[#ECFDF5] border border-[#A7F3D0] text-[#065F46]",
      dot: "bg-[#10B981]",
      text: "text-[#065F46]",
    },
    warning: {
      container: "bg-[#FFFBEB] border border-[#FDE68A] text-[#92400E]",
      dot: "bg-[#F59E0B]",
      text: "text-[#92400E]",
    },
    critical: {
      container: "bg-[#FEF2F2] border border-[#FECACA] text-[#991B1B]",
      dot: "bg-[#EF4444]",
      text: "text-[#991B1B]",
    },
    inactive: {
      container: "bg-[#F1F5F9] border border-[#E2E8F0] text-[#475569]",
      dot: "bg-[#64748B]",
      text: "text-[#475569]",
    },
    primary: {
      container: "bg-primary-fixed border border-primary/20 text-on-primary-fixed",
      dot: "bg-primary",
      text: "text-on-primary-fixed",
    },
    secondary: {
      container: "bg-secondary-container/60 border border-secondary/20 text-on-secondary-container",
      dot: "bg-secondary",
      text: "text-on-secondary-container",
    },
    prototype: {
      container: "bg-error-container/40 border border-error/20 text-on-error-container font-bold",
      dot: "bg-error",
      text: "text-on-error-container",
    },
    neutral: {
      container: "bg-surface-container border border-outline-variant/40 text-on-surface-variant",
      dot: "bg-outline",
      text: "text-on-surface-variant",
    },
  };

  const current = variantStyles[variant] || variantStyles.neutral;
  const sizeClasses =
    size === "sm"
      ? "px-2 py-0.5 text-[11px] leading-[14px]"
      : "px-2.5 py-1 text-[12px] leading-[16px]";

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full font-mono font-medium transition-colors ${current.container} ${sizeClasses} ${className}`}
    >
      {dot && (
        <span
          className={`w-1.5 h-1.5 rounded-full ${current.dot} ${
            pulse ? "animate-pulse" : ""
          }`}
        />
      )}
      {icon && <span className="material-symbols-outlined text-[14px]">{icon}</span>}
      <span>{label}</span>
    </span>
  );
};

export default StatusPill;

