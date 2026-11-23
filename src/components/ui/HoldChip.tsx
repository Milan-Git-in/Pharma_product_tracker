import React from "react";
import { HoldLevel } from "@/domain/types";
import { fmtDuration } from "@/services/format";

export interface HoldChipProps {
  elapsedMs: number;
  limitMinutes?: number;
  level: HoldLevel;
  ruleName?: string;
  showProgress?: boolean;
}

export const HoldChip: React.FC<HoldChipProps> = ({
  elapsedMs,
  limitMinutes = 60,
  level,
  ruleName,
  showProgress = true,
}) => {
  const limitMs = limitMinutes * 60 * 1000;
  const remainingMs = Math.max(0, limitMs - elapsedMs);
  const percent = Math.min(100, Math.round((elapsedMs / limitMs) * 100));

  const styles = {
    OK: {
      container: "bg-[#ECFDF5] border-[#A7F3D0] text-[#065F46]",
      dot: "bg-[#10B981]",
      bar: "bg-[#10B981]",
      label: "OK",
    },
    WARNING: {
      container: "bg-[#FFFBEB] border-[#FDE68A] text-[#92400E]",
      dot: "bg-[#F59E0B]",
      bar: "bg-[#F59E0B]",
      label: "WARNING",
    },
    EXCEEDED: {
      container: "bg-[#FEF2F2] border-[#FECACA] text-[#991B1B]",
      dot: "bg-[#EF4444]",
      bar: "bg-[#EF4444]",
      label: "EXCEEDED",
    },
  }[level];

  return (
    <div
      className={`inline-flex flex-col gap-1 px-2.5 py-1.5 rounded-lg border font-mono text-xs ${styles.container}`}
    >
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-1.5">
          <span
            className={`w-2 h-2 rounded-full ${styles.dot} ${
              level === "EXCEEDED" ? "animate-ping" : ""
            }`}
          />
          <span className="font-bold text-[11px] tracking-wide">{styles.label}</span>
          {ruleName && <span className="opacity-70 text-[10px]">({ruleName})</span>}
        </div>
        <span className="font-semibold">{fmtDuration(elapsedMs)}</span>
      </div>

      {showProgress && (
        <div className="w-full bg-black/10 rounded-full h-1 overflow-hidden">
          <div
            className={`h-full ${styles.bar}`}
            style={{ width: `${percent}%` }}
          />
        </div>
      )}
    </div>
  );
};

export default HoldChip;

