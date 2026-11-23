import React from "react";

export interface AlertBannerProps {
  type?: "info" | "warning" | "critical" | "success";
  title?: string;
  message: string;
  icon?: string;
  actionText?: string;
  onAction?: () => void;
  className?: string;
}

export const AlertBanner: React.FC<AlertBannerProps> = ({
  type = "info",
  title,
  message,
  icon,
  actionText,
  onAction,
  className = "",
}) => {
  const config = {
    info: {
      bg: "bg-surface-container-high/60",
      border: "border-outline-variant/40",
      text: "text-on-surface",
      icon: icon || "info",
      iconColor: "text-primary",
    },
    warning: {
      bg: "bg-amber-50",
      border: "border-amber-200",
      text: "text-amber-950",
      icon: icon || "warning",
      iconColor: "text-amber-600",
    },
    critical: {
      bg: "bg-red-50",
      border: "border-red-200",
      text: "text-red-950",
      icon: icon || "emergency_home",
      iconColor: "text-red-600",
    },
    success: {
      bg: "bg-emerald-50",
      border: "border-emerald-200",
      text: "text-emerald-950",
      icon: icon || "check_circle",
      iconColor: "text-emerald-600",
    },
  }[type];

  return (
    <div
      className={`p-3.5 rounded-xl border flex items-start justify-between gap-3 text-left ${config.bg} ${config.border} ${className}`}
    >
      <div className="flex items-start gap-2.5">
        <span className={`material-symbols-outlined text-[20px] ${config.iconColor} mt-0.5`}>
          {config.icon}
        </span>
        <div className="flex flex-col">
          {title && (
            <span className="font-headline-sm text-xs font-semibold text-on-surface">
              {title}
            </span>
          )}
          <span className={`font-body-sm text-xs ${config.text}`}>{message}</span>
        </div>
      </div>

      {actionText && onAction && (
        <button
          onClick={onAction}
          className="font-headline-sm text-xs font-semibold text-primary hover:underline flex-shrink-0"
        >
          {actionText}
        </button>
      )}
    </div>
  );
};

export default AlertBanner;

