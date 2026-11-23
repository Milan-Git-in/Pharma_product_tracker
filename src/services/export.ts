/**
 * Export Service for Audit Trail (SPEC R9 & Phase 2)
 * - CSV export with BOM, headers, and clean escaping
 * - PDF export via jsPDF + autoTable with:
 *   - Official Header (Company, Division, Title, Filters, Dataset Checksum)
 *   - "Printed by {fullName} on DD/MM/YYYY HH:MM — Page X of Y" on every page
 */

import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import { AuditEntry, User } from "@/domain/types";
import { fmtDateTime, fmtDateTimeFull } from "./format";
import { sha256, canonicalJson } from "./crypto";
import { TimeService } from "./time";

/**
 * Export filtered audit entries as CSV
 */
export function exportAuditToCsv(entries: AuditEntry[], filename?: string): void {
  const headers = [
    "Seq #",
    "Timestamp (UTC)",
    "Operator User ID",
    "Operator Name",
    "Action",
    "Entity Type",
    "Entity ID",
    "Field Modified",
    "Previous Value",
    "New Value",
    "Reason for Change (21 CFR Part 11)",
    "Target Product",
    "Lot Number",
    "Batch Number",
    "Cryptographic Hash (SHA-256)",
  ];

  const escapeCell = (val: any): string => {
    if (val === null || val === undefined) return '""';
    const str = String(val).replace(/"/g, '""');
    return `"${str}"`;
  };

  const rows = entries.map((e) => [
    e.seq,
    fmtDateTimeFull(e.at),
    escapeCell(e.userId),
    escapeCell(e.fullName),
    escapeCell(e.action),
    escapeCell(e.entityType),
    escapeCell(e.entityId),
    escapeCell(e.field || ""),
    escapeCell(e.oldValue !== undefined ? JSON.stringify(e.oldValue) : ""),
    escapeCell(e.newValue !== undefined ? JSON.stringify(e.newValue) : ""),
    escapeCell(e.reason || ""),
    escapeCell(e.product || ""),
    escapeCell(e.lotNo || ""),
    escapeCell(e.batchNo || ""),
    escapeCell(e.hash),
  ]);

  const csvContent =
    "\uFEFF" +
    [headers.join(","), ...rows.map((r) => r.join(","))].join("\r\n");

  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.setAttribute("href", url);
  link.setAttribute(
    "download",
    filename || `Audit_Trail_Report_${new Date().toISOString().slice(0, 10)}.csv`
  );
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Export filtered audit entries as Official PDF Dossier (SPEC R9)
 */
export async function exportAuditToPdf(
  entries: AuditEntry[],
  filters: Record<string, any>,
  printedBy: User | null,
  filename?: string
): Promise<void> {
  const doc = new jsPDF({
    orientation: "landscape",
    unit: "mm",
    format: "a4",
  });

  const nowStr = TimeService.now();
  const printTimestamp = fmtDateTime(nowStr);
  const operatorName = printedBy ? `${printedBy.fullName} (${printedBy.userId})` : "Authorized Auditor";

  // Calculate Dataset Checksum
  const datasetDigest = await sha256(canonicalJson(entries.map((e) => e.hash)));
  const shortChecksum = datasetDigest.substring(0, 16).toUpperCase();

  // Primary palette tokens
  const primaryColor = [15, 95, 122]; // #0F5F7A
  const slateDark = [25, 28, 30];     // #191C1E
  const slateMuted = [100, 116, 139]; // #64748B

  // Document Title & Company Header
  doc.setFont("helvetica", "bold");
  doc.setFontSize(14);
  doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
  doc.text("Company Pharmaceutical Limited — Biopharma Division", 14, 15);

  doc.setFontSize(11);
  doc.setTextColor(slateDark[0], slateDark[1], slateDark[2]);
  doc.text("Electronic Product Tracking System · 21 CFR Part 11 Audit Trail Dossier", 14, 21);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.setTextColor(slateMuted[0], slateMuted[1], slateMuted[2]);
  doc.text(`Official Regulatory Report · SOP-PTS-001 Rev 4 · Area: Packaging Line 2`, 14, 26);

  // Filter & Verification Metadata Box
  doc.setDrawColor(191, 200, 205);
  doc.setFillColor(242, 244, 246);
  doc.roundedRect(14, 29, 269, 14, 1.5, 1.5, "FD");

  doc.setFontSize(7.5);
  doc.setTextColor(slateDark[0], slateDark[1], slateDark[2]);

  const filterSummary = [
    `Date Range: ${filters.from || "All"} to ${filters.to || "All"}`,
    `Operator: ${filters.user || "All"}`,
    `Action: ${filters.action || "All"}`,
    `Product: ${filters.product || "All"}`,
    `Lot/Batch: ${filters.lot || filters.batch || "All"}`,
  ].join("  |  ");

  doc.setFont("helvetica", "bold");
  doc.text("Applied Filter Criteria:", 17, 34);
  doc.setFont("helvetica", "normal");
  doc.text(filterSummary, 48, 34);

  doc.setFont("helvetica", "bold");
  doc.text(`Dataset Records: ${entries.length} Entries`, 17, 39);
  doc.setFont("helvetica", "normal");
  doc.text(`Dataset Integrity Checksum: ${shortChecksum} (SHA-256 Validated)`, 80, 39);
  doc.text(`Generated at: ${printTimestamp} (UTC)`, 210, 39);

  // Table Data Preparation
  const tableHead = [
    [
      "Seq #",
      "Timestamp",
      "Operator",
      "Action",
      "Entity Target",
      "Field & Diffs (Old -> New)",
      "Reason for Change (Mandatory)",
      "SHA-256 Verification",
    ],
  ];

  const tableBody = entries.map((e) => {
    let diffStr = "—";
    if (e.field) {
      const oldVal = e.oldValue !== undefined && e.oldValue !== null ? String(e.oldValue) : "null";
      const newVal = e.newValue !== undefined && e.newValue !== null ? String(e.newValue) : "null";
      diffStr = `${e.field}: ${oldVal} → ${newVal}`;
    }

    return [
      `#${String(e.seq).padStart(5, "0")}`,
      fmtDateTimeFull(e.at),
      `${e.fullName}\n(${e.userId})`,
      e.action,
      `${e.entityType}\n${e.entityId}${e.lotNo ? `\n[${e.lotNo}]` : ""}`,
      diffStr,
      e.reason || "System logged",
      `${e.hash.substring(0, 10)}...${e.hash.substring(58)}`,
    ];
  });

  // Render Table
  autoTable(doc, {
    head: tableHead,
    body: tableBody,
    startY: 46,
    theme: "plain",
    styles: {
      fontSize: 7,
      cellPadding: 2,
      font: "helvetica",
      textColor: [25, 28, 30],
      lineColor: [224, 227, 229],
      lineWidth: 0.2,
      valign: "middle",
    },
    headStyles: {
      fillColor: [15, 95, 122],
      textColor: [255, 255, 255],
      fontStyle: "bold",
      fontSize: 7.5,
    },
    columnStyles: {
      0: { cellWidth: 15, fontStyle: "bold", halign: "center" },
      1: { cellWidth: 26 },
      2: { cellWidth: 32 },
      3: { cellWidth: 24, fontStyle: "bold" },
      4: { cellWidth: 32 },
      5: { cellWidth: 54 },
      6: { cellWidth: 62 },
      7: { cellWidth: 24, font: "courier", fontSize: 6.5 },
    },
    margin: { left: 14, right: 14, bottom: 15 },
  });

  // Draw Mandatory SPEC R9 Header & Footer on EVERY Page
  const totalPages = (doc as any).getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);

    // Top Right Running Header on subsequent pages
    if (i > 1) {
      doc.setFont("helvetica", "normal");
      doc.setFontSize(7);
      doc.setTextColor(slateMuted[0], slateMuted[1], slateMuted[2]);
      doc.text("Company Pharmaceutical Limited · 21 CFR Part 11 Audit Trail Dossier", 14, 10);
      doc.text(`Checksum: ${shortChecksum}`, 250, 10);
      doc.setDrawColor(220, 220, 220);
      doc.line(14, 12, 283, 12);
    }

    // Bottom Running Footer on EVERY page (SPEC R9)
    doc.setDrawColor(220, 220, 220);
    doc.line(14, 200, 283, 200);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(7.5);
    doc.setTextColor(slateMuted[0], slateMuted[1], slateMuted[2]);
    doc.text(
      `Printed by ${operatorName} on ${printTimestamp} — Page ${i} of ${totalPages}`,
      14,
      204
    );

    doc.setFont("helvetica", "bold");
    doc.setTextColor(186, 26, 26); // Error red for regulatory prototype notice
    doc.text(
      "CONFIDENTIAL GMP AUDIT DOSSIER — PROTOTYPE NOT VALIDATED — FOR DEMO PURPOSES ONLY",
      160,
      204
    );
  }

  // Trigger Save
  doc.save(
    filename || `Audit_Trail_Dossier_${new Date().toISOString().slice(0, 10)}.pdf`
  );
}
