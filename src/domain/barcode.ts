/**
 * Barcode Domain Engine (SPEC R10 & §4 Config-first)
 * - Generates unique barcodes from BarcodeFormat
 * - Supports CODE128 (1D) and QR (2D) symbologies
 * - Handles Mod-10 / Luhn check digit computation
 * - Formats segments: LITERAL, LOCATION_CODE, YEAR2, YEAR4, SEQ, DEPT_CODE
 * - Enforces immutability: changing format never alters issued codes
 */

import { BarcodeFormat, BarcodeSegment } from "./types";

export const MAX_BATCH_UNIT_BARCODES = 50_000;
export const MAX_TRAYS_PER_BATCH = 1_000;

export interface BarcodeContext {
  locationCode?: string;
  deptCode?: string;
  year?: number;
}

export function parseBatchUnitCount(batchSize?: string): number | null {
  const match = batchSize?.trim().match(/^((?:\d{1,3}(?:,\d{3})+)|\d+)(?:\s|$)/);
  if (!match) return null;

  const count = Number(match[1].replace(/,/g, ""));
  return Number.isSafeInteger(count) && count > 0 ? count : null;
}

/**
 * Compute Mod-10 / Luhn check digit for a string.
 * Alphanumeric characters are converted to digits via (charCode % 10).
 */
export function calculateLuhnCheckDigit(input: string): string {
  const sanitized = input.replace(/[^A-Za-z0-9]/g, "");
  if (!sanitized) return "0";

  let sum = 0;
  let doubleFlag = true; // start doubling from the rightmost digit

  for (let i = sanitized.length - 1; i >= 0; i--) {
    const char = sanitized[i];
    let digit = /\d/.test(char) ? parseInt(char, 10) : char.charCodeAt(0) % 10;

    if (doubleFlag) {
      digit *= 2;
      if (digit > 9) {
        digit -= 9;
      }
    }
    sum += digit;
    doubleFlag = !doubleFlag;
  }

  const remainder = sum % 10;
  return remainder === 0 ? "0" : String(10 - remainder);
}

/**
 * Verify if a barcode's check digit matches the Luhn computation.
 */
export function verifyLuhnCheckDigit(barcodeWithCheckDigit: string, separator: string): boolean {
  if (!barcodeWithCheckDigit) return false;
  let base: string;
  let checkDigit: string;

  if (separator && barcodeWithCheckDigit.includes(separator)) {
    const parts = barcodeWithCheckDigit.split(separator);
    checkDigit = parts[parts.length - 1];
    base = parts.slice(0, -1).join(separator);
  } else {
    checkDigit = barcodeWithCheckDigit.slice(-1);
    base = barcodeWithCheckDigit.slice(0, -1);
  }

  const expected = calculateLuhnCheckDigit(base);
  return checkDigit === expected;
}

/**
 * Format a single barcode string from format definition and sequence number.
 */
export function formatBarcodeString(
  format: BarcodeFormat,
  seqNumber: number,
  context?: BarcodeContext
): string {
  const now = new Date();
  const year = context?.year || now.getFullYear();
  const year2 = String(year).slice(-2);
  const year4 = String(year);

  const sep = format.separator === "None" ? "" : format.separator ?? "-";

  const renderedSegments: string[] = [];

  for (const seg of format.segments) {
    let segValue = "";
    switch (seg.type) {
      case "LITERAL":
        segValue = seg.value || "";
        break;

      case "LOCATION_CODE": {
        // e.g. CR-01 -> CR01 or as provided
        const loc = context?.locationCode || seg.value || "CR01";
        segValue = loc.replace(/[^A-Za-z0-9]/g, "");
        break;
      }

      case "DEPT_CODE": {
        const dept = context?.deptCode || seg.value || "PKG";
        segValue = dept.replace(/[^A-Za-z0-9]/g, "").toUpperCase();
        break;
      }

      case "YEAR2":
        segValue = year2;
        break;

      case "YEAR4":
        segValue = year4;
        break;

      case "SEQ": {
        const padLen = seg.pad || 4;
        segValue = String(seqNumber).padStart(padLen, "0");
        break;
      }

      default:
        segValue = seg.value || "";
        break;
    }

    if (segValue) {
      renderedSegments.push(segValue);
    }
  }

  const baseCode = renderedSegments.join(sep);

  if (format.checkDigit) {
    const check = calculateLuhnCheckDigit(baseCode);
    return sep ? `${baseCode}${sep}${check}` : `${baseCode}${check}`;
  }

  return baseCode;
}

/**
 * Preview the next N sample values for a format starting at a given sequence number.
 */
export function previewNextBarcodes(
  format: BarcodeFormat,
  count: number = 3,
  startSeq: number = 1,
  context?: BarcodeContext
): Array<{ seq: number; code: string }> {
  const previews: Array<{ seq: number; code: string }> = [];
  for (let i = 0; i < count; i++) {
    const seq = startSeq + i;
    const code = formatBarcodeString(format, seq, context);
    previews.push({ seq, code });
  }
  return previews;
}

/**
 * Generate a batch of unique barcodes, ensuring no collisions against an existing code set.
 */
export function generateUniqueBarcodeBatch(
  format: BarcodeFormat,
  count: number,
  startSeq: number,
  existingCodes: Set<string>,
  context?: BarcodeContext
): { barcodes: string[]; finalSeq: number } {
  const result: string[] = [];
  let currentSeq = startSeq;

  while (result.length < count) {
    const candidate = formatBarcodeString(format, currentSeq, context);
    if (!existingCodes.has(candidate) && !result.includes(candidate)) {
      result.push(candidate);
      existingCodes.add(candidate);
    }
    currentSeq++;
  }

  return { barcodes: result, finalSeq: currentSeq };
}
