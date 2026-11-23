/**
 * Format Helpers (R1 Time & Display)
 * - Dates: DD/MM/YYYY
 * - Times: HH:MM 24 h
 * - Date-time: DD/MM/YYYY HH:MM
 * - Durations: "Xd Yh Zm" or "0h 48m"
 */

import { format, parseISO, isValid } from "date-fns";

export function toDate(val: string | number | Date): Date | null {
  if (val instanceof Date) return isValid(val) ? val : null;
  if (typeof val === "number") {
    const d = new Date(val);
    return isValid(d) ? d : null;
  }
  if (typeof val === "string") {
    try {
      const d = parseISO(val);
      if (isValid(d)) return d;
      const d2 = new Date(val);
      if (isValid(d2)) return d2;
    } catch {
      return null;
    }
  }
  return null;
}

/**
 * Format date-time as DD/MM/YYYY HH:MM (24-hour)
 */
export function fmtDateTime(val: string | number | Date | null | undefined): string {
  if (!val) return "—";
  const d = toDate(val);
  if (!d) return "—";
  return format(d, "dd/MM/yyyy HH:mm");
}

/**
 * Format date-time with seconds: DD/MM/YYYY HH:MM:SS
 */
export function fmtDateTimeFull(val: string | number | Date | null | undefined): string {
  if (!val) return "—";
  const d = toDate(val);
  if (!d) return "—";
  return format(d, "dd/MM/yyyy HH:mm:ss");
}

/**
 * Format date only: DD/MM/YYYY
 */
export function fmtDate(val: string | number | Date | null | undefined): string {
  if (!val) return "—";
  const d = toDate(val);
  if (!d) return "—";
  return format(d, "dd/MM/yyyy");
}

/**
 * Format time only: HH:MM (24-hour)
 */
export function fmtTime(val: string | number | Date | null | undefined): string {
  if (!val) return "—";
  const d = toDate(val);
  if (!d) return "—";
  return format(d, "HH:mm");
}

/**
 * Format duration as "Xd Yh Zm" or "Yh Zm" or "Zm"
 * Accepts milliseconds or minutes
 */
export function fmtDuration(value: number, isMinutes = false): string {
  if (typeof value !== "number" || isNaN(value) || value < 0) {
    return "0m";
  }

  const totalMinutes = isMinutes ? Math.floor(value) : Math.floor(value / (60 * 1000));

  const days = Math.floor(totalMinutes / (24 * 60));
  const hours = Math.floor((totalMinutes % (24 * 60)) / 60);
  const minutes = totalMinutes % 60;

  const parts: string[] = [];
  if (days > 0) parts.push(`${days}d`);
  if (hours > 0 || days > 0) parts.push(`${hours}h`);
  parts.push(`${minutes}m`);

  return parts.join(" ");
}

/**
 * Format countdown as MM:SS or HH:MM:SS
 */
export function fmtCountdown(ms: number): string {
  if (ms <= 0) return "00:00";
  const totalSeconds = Math.floor(ms / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  const mStr = String(minutes).padStart(2, "0");
  const sStr = String(seconds).padStart(2, "0");

  if (hours > 0) {
    const hStr = String(hours).padStart(2, "0");
    return `${hStr}:${mStr}:${sStr}`;
  }
  return `${mStr}:${sStr}`;
}

