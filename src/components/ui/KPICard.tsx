import React from "react";

interface KPICardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: string;
  status?: "default" | "warning" | "critical" | "success";
  badgeText?: string;
}

export const KPICard: React.FC<KPICardProps> = ({
  title,
  value,
  subtitle,
  icon,
  status = "default",
  badgeText,
}) => {
  const statusStyles = {
    default: {
      border: "border-outline-variant/40",
      iconBg: "bg-surface-container text-primary",
      valColor: "text-on-surface",
    },
    warning: {
      border: "border-amber-300 bg-amber-50/30",
      iconBg: "bg-amber-100 text-amber-800",
      valColor: "text-amber-800",
    },
    critical: {
      border: "border-red-300 bg-red-50/30",
      iconBg: "bg-red-100 text-red-800",
      valColor: "text-red-800",
    },
    success: {
      border: "border-emerald-300 bg-emerald-50/30",
      iconBg: "bg-emerald-100 text-emerald-800",
      valColor: "text-emerald-800",
    },
  }[status];

  return (
    <div
      className={`rounded-xl border p-4 bg-surface-container-lowest shadow-sm flex flex-col justify-between ${statusStyles.border}`}
    >
      <div className="flex items-center justify-between mb-2">
        <span className="font-caption text-xs font-medium text-on-surface-variant uppercase tracking-wider">
          {title}
        </span>
        <div
          className={`w-8 h-8 rounded-lg flex items-center justify-center ${statusStyles.iconBg}`}
        >
          <span className="material-symbols-outlined text-[18px]">{icon}</span>
        </div>
      </div>

      <div className="flex items-baseline justify-between mt-1">
        <span className={`font-headline-lg text-2xl font-bold font-mono ${statusStyles.valColor}`}>
          {value}
        </span>
        {badgeText && (
          <span className="font-mono text-[11px] font-semibold px-2 py-0.5 rounded bg-surface-container text-on-surface-variant">
            {badgeText}
          </span>
        )}
      </div>

      {subtitle && (
        <span className="font-caption text-[11px] text-on-surface-variant mt-2">
          {subtitle}
        </span>
      )}
    </div>
  );
};

export default KPICard;

