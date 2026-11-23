/**
 * Label Print Service (SPEC R10 & S21 Label Print)
 * - Cleanroom thermal transfer label generator using jsPDF
 * - Presets: 50 × 25 mm (Rack / Vial) and 100 × 50 mm (Pallet / Carton)
 * - Supports CODE128 (1D) and QR (2D) symbologies
 * - Vector-sharp barcodes embedded with human-readable text and GMP metadata
 */

import { jsPDF } from "jspdf";
import JsBarcode from "jsbarcode";
import QRCode from "qrcode";

export type LabelPresetSize = "50x25" | "100x50";

export interface LabelPrintItem {
  code: string;
  entityType: "RACK" | "PALLET" | "BINDER" | string;
  symbology?: "CODE128" | "QR";
  title?: string;
  location?: string;
  date?: string;
}

export interface LabelPrintOptions {
  size: LabelPresetSize;
  companyName?: string;
  division?: string;
}

export interface TrayLabelPdfItem {
  code: string;
  trayNumber: number;
  trayCount: number;
  productName: string;
  strength: string;
  lotNo: string;
  batchNo: string;
}

/**
 * Generate a high-resolution data URL for Code 128 barcode
 */
export function generateBarcodeDataUrl(code: string, height: number = 60): string {
  if (typeof document === "undefined") return "";
  const canvas = document.createElement("canvas");
  try {
    JsBarcode(canvas, code, {
      format: "CODE128",
      displayValue: false,
      margin: 2,
      width: 2,
      height,
    });
    return canvas.toDataURL("image/png");
  } catch (err) {
    console.error("Barcode generation error:", err);
    return "";
  }
}

/**
 * Generate a high-resolution data URL for QR Code
 */
export async function generateQrDataUrl(code: string, size: number = 240): Promise<string> {
  try {
    return await QRCode.toDataURL(code, {
      margin: 1,
      width: size,
      errorCorrectionLevel: "M",
    });
  } catch (err) {
    console.error("QR Code generation error:", err);
    return "";
  }
}

/**
 * Render a single or batch of validated GMP cleanroom labels to a jsPDF document
 */
export async function buildLabelsPdf(
  items: LabelPrintItem[],
  options: LabelPrintOptions = { size: "50x25" }
): Promise<jsPDF> {
  const isSmall = options.size === "50x25";
  const pageWidth = isSmall ? 50 : 100;
  const pageHeight = isSmall ? 25 : 50;

  const doc = new jsPDF({
    orientation: "landscape",
    unit: "mm",
    format: [pageWidth, pageHeight],
  });

  const company = options.companyName || "COMPANY PHARMACEUTICAL";
  const division = options.division || "BIOPHARMA DIVISION";

  for (let i = 0; i < items.length; i++) {
    if (i > 0) {
      doc.addPage([pageWidth, pageHeight], "landscape");
    }

    const item = items[i];
    const symbology = item.symbology || "CODE128";

    if (isSmall) {
      // --- 50 × 25 mm Layout ---
      // Top header
      doc.setFont("helvetica", "bold");
      doc.setFontSize(5);
      doc.setTextColor(40, 40, 40);
      doc.text("PTS-GMP • " + item.entityType.toUpperCase(), 3, 3.5);

      doc.setFont("helvetica", "normal");
      doc.setFontSize(4.5);
      doc.setTextColor(100, 100, 100);
      doc.text(company, 47, 3.5, { align: "right" });

      // Border rule
      doc.setDrawColor(200, 200, 200);
      doc.setLineWidth(0.15);
      doc.line(3, 4.2, 47, 4.2);

      if (symbology === "QR") {
        const qrUrl = await generateQrDataUrl(item.code, 180);
        if (qrUrl) {
          doc.addImage(qrUrl, "PNG", 3, 5, 14, 14);
        }
        doc.setFont("courier", "bold");
        doc.setFontSize(7.5);
        doc.setTextColor(0, 0, 0);
        doc.text(item.code, 19, 10);

        doc.setFont("helvetica", "normal");
        doc.setFontSize(5);
        doc.setTextColor(80, 80, 80);
        if (item.location) {
          doc.text(`Loc: ${item.location}`, 19, 14);
        }
        if (item.title) {
          doc.text(item.title.slice(0, 24), 19, 17.5);
        }
      } else {
        // CODE 128
        const barcodeUrl = generateBarcodeDataUrl(item.code, 50);
        if (barcodeUrl) {
          doc.addImage(barcodeUrl, "PNG", 3, 5, 44, 11);
        }

        // Monospace text
        doc.setFont("courier", "bold");
        doc.setFontSize(7);
        doc.setTextColor(0, 0, 0);
        doc.text(item.code, 25, 18.5, { align: "center" });

        if (item.location || item.title) {
          doc.setFont("helvetica", "normal");
          doc.setFontSize(4.5);
          doc.setTextColor(90, 90, 90);
          const meta = [item.location ? `Loc: ${item.location}` : "", item.title || ""]
            .filter(Boolean)
            .join(" • ");
          doc.text(meta, 25, 22, { align: "center" });
        }
      }
    } else {
      // --- 100 × 50 mm Layout ---
      doc.setFont("helvetica", "bold");
      doc.setFontSize(8);
      doc.setTextColor(20, 20, 20);
      doc.text("PTS-GMP CLEANROOM CONTAINER LABEL", 5, 6);

      doc.setFont("helvetica", "normal");
      doc.setFontSize(7);
      doc.setTextColor(90, 90, 90);
      doc.text(`${company} • ${division}`, 95, 6, { align: "right" });

      doc.setDrawColor(180, 180, 180);
      doc.setLineWidth(0.25);
      doc.line(5, 7.5, 95, 7.5);

      if (symbology === "QR") {
        const qrUrl = await generateQrDataUrl(item.code, 300);
        if (qrUrl) {
          doc.addImage(qrUrl, "PNG", 5, 10, 28, 28);
        }

        doc.setFont("helvetica", "bold");
        doc.setFontSize(9);
        doc.setTextColor(0, 50, 120);
        doc.text(`ENTITY: ${item.entityType.toUpperCase()}`, 36, 15);

        doc.setFont("courier", "bold");
        doc.setFontSize(12);
        doc.setTextColor(0, 0, 0);
        doc.text(item.code, 36, 22);

        doc.setFont("helvetica", "normal");
        doc.setFontSize(8);
        doc.setTextColor(70, 70, 70);
        if (item.location) {
          doc.text(`Location / Zone: ${item.location}`, 36, 28);
        }
        if (item.title) {
          doc.text(`Description: ${item.title}`, 36, 33);
        }
        doc.text(`Issued: ${new Date().toLocaleDateString()}`, 36, 38);
      } else {
        // CODE 128
        doc.setFont("helvetica", "bold");
        doc.setFontSize(8);
        doc.setTextColor(0, 50, 120);
        doc.text(`TARGET: ${item.entityType.toUpperCase()}`, 5, 12);

        const barcodeUrl = generateBarcodeDataUrl(item.code, 80);
        if (barcodeUrl) {
          doc.addImage(barcodeUrl, "PNG", 5, 14, 90, 21);
        }

        doc.setFont("courier", "bold");
        doc.setFontSize(12);
        doc.setTextColor(0, 0, 0);
        doc.text(item.code, 50, 39, { align: "center" });

        doc.setFont("helvetica", "normal");
        doc.setFontSize(7);
        doc.setTextColor(90, 90, 90);
        const meta = [
          item.location ? `Location: ${item.location}` : "",
          item.title || "",
          `GMP Ver: 21 CFR §11`,
        ]
          .filter(Boolean)
          .join("  |  ");
        doc.text(meta, 50, 45, { align: "center" });
      }
    }
  }

  return doc;
}

/**
 * Convenience helper to build and immediately download the label PDF
 */
export async function downloadLabelsPdf(
  items: LabelPrintItem[],
  options: LabelPrintOptions = { size: "50x25" },
  filename?: string
): Promise<void> {
  const doc = await buildLabelsPdf(items, options);
  const name = filename || `labels_${items[0]?.code || "batch"}_${options.size}.pdf`;
  doc.save(name);
}

export async function downloadTrayLabelsA4Pdf(
  items: TrayLabelPdfItem[],
  filename?: string
): Promise<void> {
  if (!items.length) {
    throw new Error("There are no tray labels to print.");
  }

  const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
  const margin = 7;
  const gutter = 2;
  const columns = 3;
  const rows = 8;
  const labelsPerPage = columns * rows;
  const labelWidth = (210 - margin * 2 - gutter * (columns - 1)) / columns;
  const labelHeight = (297 - margin * 2 - gutter * (rows - 1)) / rows;

  for (let index = 0; index < items.length; index++) {
    if (index > 0 && index % labelsPerPage === 0) {
      doc.addPage("a4", "portrait");
    }

    const item = items[index];
    const column = index % columns;
    const row = Math.floor((index % labelsPerPage) / columns);
    const x = margin + column * (labelWidth + gutter);
    const y = margin + row * (labelHeight + gutter);
    const qrUrl = await generateQrDataUrl(item.code, 180);
    const barcodeUrl = generateBarcodeDataUrl(item.code, 48);
    if (!qrUrl || !barcodeUrl) {
      throw new Error(`Could not render a scannable label for tray ${item.trayNumber}.`);
    }

    doc.setDrawColor(150, 150, 150);
    doc.setLineWidth(0.2);
    doc.roundedRect(x, y, labelWidth, labelHeight, 1, 1, "S");

    doc.setFont("helvetica", "bold");
    doc.setFontSize(6);
    doc.setTextColor(25, 25, 25);
    doc.text(doc.splitTextToSize(item.productName, labelWidth - 4).slice(0, 1), x + 2, y + 3.5);

    doc.setFontSize(5.5);
    doc.text(`TRAY ${item.trayNumber} / ${item.trayCount}  ·  ${item.strength}`, x + 2, y + 7);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(4.5);
    doc.text(doc.splitTextToSize(`LOT ${item.lotNo}  ·  BATCH ${item.batchNo}`, labelWidth - 4).slice(0, 1), x + 2, y + 10);

    doc.addImage(qrUrl, "PNG", x + 2, y + 12, 16, 16);
    doc.addImage(barcodeUrl, "PNG", x + 20, y + 13, labelWidth - 22, 10);
    doc.setFont("courier", "bold");
    doc.setFontSize(5.5);
    doc.text(item.code, x + 20, y + 27);
  }

  doc.save(filename || `${items[0].batchNo}-tray-labels.pdf`);
}
