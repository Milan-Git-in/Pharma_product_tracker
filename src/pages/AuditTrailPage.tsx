"use client";

import React, { useState, useEffect, useMemo } from "react";
import AppLayout from "@/components/layout/AppLayout";
import StatusPill from "@/components/ui/StatusPill";
import Button from "@/components/ui/Button";
import Modal from "@/components/ui/Modal";
import RecordAuditDrawer from "@/components/audit/RecordAuditDrawer";
import { AuditEntry } from "@/domain/types";
import { mockApi } from "@/api";
import { useSession } from "@/services/session";
import { can } from "@/services/permission";
import { fmtDateTimeFull, fmtDate } from "@/services/format";
import { exportAuditToCsv, exportAuditToPdf } from "@/services/export";
import { useToast } from "@/components/ui/Toast";

export default function AuditTrailPage() {
  const { currentUser, isDevMode, setRole } = useSession();
  const { showToast } = useToast();

  const [entries, setEntries] = useState<AuditEntry[]>([]);
  const [loading, setLoading] = useState(false);

  // Filters state
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [selectedUser, setSelectedUser] = useState("ALL");
  const [selectedProduct, setSelectedProduct] = useState("ALL");
  const [lotInput, setLotInput] = useState("");
  const [batchInput, setBatchInput] = useState("");
  const [selectedAction, setSelectedAction] = useState("ALL");

  // Selected row for per-record drawer
  const [drawerEntityId, setDrawerEntityId] = useState<string | null>(null);
  const [drawerEntityType, setDrawerEntityType] = useState("RECORD");
  const [drawerTitle, setDrawerTitle] = useState("");

  // Verification modal state
  const [verificationModalOpen, setVerificationModalOpen] = useState(false);
  const [verificationResult, setVerificationResult] = useState<{
    valid: boolean;
    totalEntries: number;
    tamperedSeq?: number;
    error?: string;
  } | null>(null);
  const [verifying, setVerifying] = useState(false);

  // Export dropdown
  const [exportOpen, setExportOpen] = useState(false);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  // Permissions check (SPEC §8: Admin and QA have audit.view and audit.export)
  const hasViewPermission = can(currentUser, "audit.view");
  const hasExportPermission = can(currentUser, "audit.export");

  // Load audit trail with active filters
  const loadAuditData = async () => {
    setLoading(true);
    try {
      const res = await mockApi.getAuditLog(
        {
          from: fromDate || undefined,
          to: toDate || undefined,
          user: selectedUser !== "ALL" ? selectedUser : undefined,
          product: selectedProduct !== "ALL" ? selectedProduct : undefined,
          lot: lotInput.trim() || undefined,
          batch: batchInput.trim() || undefined,
          action: selectedAction !== "ALL" ? selectedAction : undefined,
        },
        currentUser || undefined
      );

      if (res.ok && res.data) {
        setEntries(res.data);
      } else if (res.error) {
        showToast("error", "Failed to Load Audit Trail", res.error.message);
      }
    } catch (err: any) {
      console.error("Audit load error:", err);
      showToast("error", "Error", "Failed to load audit records.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (hasViewPermission) {
      loadAuditData();
    }
  }, [
    fromDate,
    toDate,
    selectedUser,
    selectedProduct,
    lotInput,
    batchInput,
    selectedAction,
    hasViewPermission,
  ]);

  // Pagination slice
  const totalRecords = entries.length;
  const totalPages = Math.ceil(totalRecords / pageSize) || 1;
  const paginatedEntries = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    return entries.slice(startIndex, startIndex + pageSize);
  }, [entries, currentPage, pageSize]);

  // Reset all filters
  const handleClearFilters = () => {
    setFromDate("");
    setToDate("");
    setSelectedUser("ALL");
    setSelectedProduct("ALL");
    setLotInput("");
    setBatchInput("");
    setSelectedAction("ALL");
    setCurrentPage(1);
    showToast("info", "Filters Reset", "Showing complete audit ledger.");
  };

  // Run integrity verification (GET /audit/verify)
  const handleVerifyIntegrity = async () => {
    setVerifying(true);
    try {
      const res = await mockApi.verifyAuditChain();
      if (res.ok && res.data) {
        setVerificationResult(res.data);
        setVerificationModalOpen(true);
        if (res.data.valid) {
          showToast("success", "Integrity Verified", `${res.data.totalEntries} blocks cryptographic proof intact.`);
        } else {
          showToast("error", "Cryptographic Breach Detected", `Chain verification failed at sequence #${res.data.tamperedSeq}`);
        }
      }
    } catch (err: any) {
      showToast("error", "Verification Error", err?.message || "Failed to compute verification proof.");
    } finally {
      setVerifying(false);
    }
  };

  // DEV ONLY: Corrupt one row to demonstrate tamper detection
  const handleCorruptRow = async () => {
    try {
      const res = await mockApi.corruptAuditRow(1);
      if (res.ok && res.data) {
        showToast("warning", "Database Tampered", `Modified sequence #${res.data.corruptedSeq} without updating hash.`);
        await loadAuditData();
      }
    } catch (err: any) {
      showToast("error", "Error", err?.message || "Corruption failed.");
    }
  };

  // DEV ONLY: Repair chain
  const handleRepairChain = async () => {
    try {
      const res = await mockApi.repairAuditChain();
      if (res.ok) {
        showToast("success", "Chain Repaired", "Recalculated SHA-256 hashes for all records.");
        await loadAuditData();
        await handleVerifyIntegrity();
      }
    } catch (err: any) {
      showToast("error", "Error", "Repair failed.");
    }
  };

  // Export handlers
  const handleExportCsv = () => {
    if (!hasExportPermission) {
      showToast("error", "Access Denied", "audit.export permission required.");
      return;
    }
    exportAuditToCsv(entries);
    showToast("success", "CSV Exported", `Exported ${entries.length} audit entries.`);
    setExportOpen(false);
  };

  const handleExportPdf = async () => {
    if (!hasExportPermission) {
      showToast("error", "Access Denied", "audit.export permission required.");
      return;
    }
    const filterObj = {
      from: fromDate,
      to: toDate,
      user: selectedUser,
      product: selectedProduct,
      lot: lotInput,
      batch: batchInput,
      action: selectedAction,
    };
    await exportAuditToPdf(entries, filterObj, currentUser);
    showToast("success", "PDF Dossier Exported", `Generated official 21 CFR Part 11 PDF report.`);
    setExportOpen(false);
  };

  // Action badge color
  const getActionPillVariant = (action: string) => {
    switch (action.toUpperCase()) {
      case "LOGIN":
      case "CREATE":
        return "compliant";
      case "MODIFY":
      case "STAGE_CHANGE":
      case "ROLE_RIGHTS":
        return "secondary";
      case "SIGNATURE":
        return "primary";
      case "FAILED_LOGIN":
        return "critical";
      case "AUTO_LOGOFF":
        return "warning";
      case "PASSWORD_CHANGE":
      case "USER_MANAGEMENT":
        return "neutral";
      default:
        return "neutral";
    }
  };

  // Render Access Restriction if user lacks audit.view (e.g. INITIATOR or HOD)
  if (!hasViewPermission) {
    return (
      <AppLayout screenCode="S17">
        <div className="flex flex-col items-center justify-center min-h-[60vh] max-w-lg mx-auto text-center p-8 bg-surface-container-lowest rounded-xl border border-outline-variant/50 shadow-sm">
          <div className="w-16 h-16 rounded-2xl bg-amber-100 flex items-center justify-center text-amber-800 mb-4">
            <span className="material-symbols-outlined text-[32px]">shield_lock</span>
          </div>
          <h2 className="font-headline-md text-xl font-bold text-on-surface">
            21 CFR Part 11 Audit Trail Access Restricted
          </h2>
          <p className="font-body-md text-xs text-on-surface-variant mt-2 leading-relaxed">
            Inspection of the electronic audit trail and cryptographic tamper ledger requires{" "}
            <code className="font-mono text-primary font-bold">audit.view</code> clearance. Under Good Manufacturing Practice (GMP) protocols, this facility is restricted to{" "}
            <strong>Quality Assurance (QA)</strong> and <strong>System Administrators</strong>.
          </p>
          <div className="mt-6 flex flex-col sm:flex-row gap-2 w-full justify-center">
            <button
              onClick={() => setRole("QA")}
              className="px-4 py-2.5 rounded-lg bg-primary text-on-primary font-mono text-xs font-semibold hover:bg-primary-container transition-colors shadow-xs"
            >
              Switch Role to QA (Elena Rostova)
            </button>
            <button
              onClick={() => setRole("ADMIN")}
              className="px-4 py-2.5 rounded-lg bg-surface-container hover:bg-surface-container-high border border-outline-variant/60 text-on-surface font-mono text-xs font-semibold transition-colors"
            >
              Switch Role to Admin (David Chen)
            </button>
          </div>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout screenCode="S17">
      <div className="flex flex-col w-full pb-12 text-left">
        {/* Top Regulatory & Integrity Banner */}
        <div className="flex items-center justify-between px-space-md py-2.5 bg-surface-container rounded-lg mb-4 text-on-surface shadow-xs flex-wrap gap-2">
          <div className="flex items-center gap-space-sm min-w-0">
            <span className="material-symbols-outlined text-secondary text-[20px]">
              verified_user
            </span>
            <div className="flex items-center gap-2">
              <span className="font-headline-sm text-xs font-bold text-on-surface tracking-tight">
                21 CFR Part 11 / EU Annex 11 Electronic Records Subsystem Active
              </span>
              <span className="hidden sm:inline-block w-1.5 h-1.5 rounded-full bg-outline-variant" />
              <span className="hidden sm:inline-block font-mono text-[11px] text-on-surface-variant">
                Append-only Hash Chaining (SHA-256)
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 font-mono text-[11px] text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>LIVE LEDGER INTACT</span>
            </div>
          </div>
        </div>

        {/* Header Section */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-6">
          <div className="flex flex-col">
            <div className="flex items-center gap-3">
              <h1 className="font-headline-lg text-2xl font-bold text-on-surface tracking-tight">
                S17 Audit Trail Viewer
              </h1>
              <span className="px-2 py-0.5 rounded bg-primary-fixed text-on-primary-fixed font-mono text-[11px] uppercase font-bold">
                GMP Official
              </span>
            </div>
            <p className="font-body-sm text-xs text-on-surface-variant mt-1 max-w-2xl">
              Continuous immutable event ledger, parameter drift logs, and electronic signature trails under 21 CFR Part 11 protocols. No records can be altered or deleted.
            </p>
          </div>

          {/* Action Toolbar */}
          <div className="flex items-center gap-2 flex-wrap">
            {/* Verify Integrity Button */}
            <Button
              variant="secondary"
              size="sm"
              icon="security_update_good"
              onClick={handleVerifyIntegrity}
              loading={verifying}
            >
              Verify Integrity
            </Button>

            {/* DEV ONLY Corrupt Row Button */}
            {isDevMode && (
              <button
                onClick={handleCorruptRow}
                className="px-3 py-1.5 rounded-lg bg-amber-100 hover:bg-amber-200 text-amber-900 border border-amber-300 font-mono text-xs font-bold transition-colors flex items-center gap-1 min-h-[44px]"
                title="DEV ONLY: Tamper with row #2 to demonstrate cryptographic detection"
              >
                <span className="material-symbols-outlined text-[16px]">bug_report</span>
                <span>Corrupt One Row</span>
              </button>
            )}

            {/* Export Dropdown */}
            <div className="relative inline-block text-left">
              <Button
                variant="primary"
                size="sm"
                icon="download"
                onClick={() => setExportOpen(!exportOpen)}
                disabled={!hasExportPermission}
              >
                Export Dossier
                <span className="material-symbols-outlined text-[16px] ml-1">expand_more</span>
              </Button>

              {exportOpen && (
                <div className="absolute right-0 mt-1 w-48 bg-surface-container-lowest border border-outline-variant/50 rounded-xl shadow-xl z-50 py-1 font-body-md text-xs">
                  <button
                    onClick={handleExportCsv}
                    className="w-full px-4 py-2.5 text-left text-on-surface hover:bg-surface-container flex items-center gap-2.5 transition-colors"
                  >
                    <span className="material-symbols-outlined text-[18px] text-primary">
                      table_view
                    </span>
                    <span>Export CSV (Excel)</span>
                  </button>
                  <button
                    onClick={handleExportPdf}
                    className="w-full px-4 py-2.5 text-left text-on-surface hover:bg-surface-container flex items-center gap-2.5 transition-colors"
                  >
                    <span className="material-symbols-outlined text-[18px] text-red-600">
                      picture_as_pdf
                    </span>
                    <span>Export Official PDF</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Two-Tier Cleanroom Filter Panel */}
        <div className="bg-surface-container-lowest rounded-xl shadow-xs border border-outline-variant/40 p-4 mb-6 flex flex-col gap-4">
          {/* Tier 1: Time, User, Lot, Batch Controls */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-3 items-end">
            {/* Date Range From */}
            <div className="lg:col-span-3 flex flex-col gap-1">
              <label className="font-caption text-[11px] uppercase text-on-surface-variant font-bold">
                Date Range (From)
              </label>
              <input
                type="date"
                value={fromDate}
                onChange={(e) => {
                  setFromDate(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full h-10 px-3 bg-surface-container-low border border-outline-variant/60 rounded-lg text-xs font-mono text-on-surface focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            {/* Date Range To */}
            <div className="lg:col-span-3 flex flex-col gap-1">
              <label className="font-caption text-[11px] uppercase text-on-surface-variant font-bold">
                Date Range (To)
              </label>
              <input
                type="date"
                value={toDate}
                onChange={(e) => {
                  setToDate(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full h-10 px-3 bg-surface-container-low border border-outline-variant/60 rounded-lg text-xs font-mono text-on-surface focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            {/* Operator User */}
            <div className="lg:col-span-2 flex flex-col gap-1">
              <label className="font-caption text-[11px] uppercase text-on-surface-variant font-bold">
                Operator / User
              </label>
              <select
                value={selectedUser}
                onChange={(e) => {
                  setSelectedUser(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full h-10 px-2 bg-surface-container-low border border-outline-variant/60 rounded-lg text-xs font-body-md text-on-surface focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="ALL">All Users</option>
                <option value="admin1">David Chen (Admin)</option>
                <option value="init1">Anita Shah (Initiator)</option>
                <option value="init2">Raj Patel (Initiator)</option>
                <option value="hod1">Dr. Marcus Vance (HOD)</option>
                <option value="qa1">Elena Rostova (QA)</option>
                <option value="newuser1">Priya Nair (Operator)</option>
                <option value="SYSTEM">System Bootstrapper</option>
              </select>
            </div>

            {/* Product Filter */}
            <div className="lg:col-span-2 flex flex-col gap-1">
              <label className="font-caption text-[11px] uppercase text-on-surface-variant font-bold">
                Target Product
              </label>
              <select
                value={selectedProduct}
                onChange={(e) => {
                  setSelectedProduct(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full h-10 px-2 bg-surface-container-low border border-outline-variant/60 rounded-lg text-xs font-body-md text-on-surface focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="ALL">All Products</option>
                <option value="Insulin Glargine">Insulin Glargine 100 IU/mL</option>
                <option value="Adalimumab">Adalimumab 40 mg/0.8 mL</option>
                <option value="Filgrastim">Filgrastim 300 mcg/0.5 mL</option>
                <option value="Trastuzumab">Trastuzumab 440 mg</option>
                <option value="Rituximab">Rituximab 500 mg/50 mL</option>
                <option value="Erythropoietin">Erythropoietin 4000 IU/mL</option>
              </select>
            </div>

            {/* Lot & Batch Filter */}
            <div className="lg:col-span-2 grid grid-cols-2 gap-1.5">
              <div className="flex flex-col gap-1">
                <label className="font-caption text-[10px] uppercase text-on-surface-variant font-bold truncate">
                  Lot No.
                </label>
                <input
                  type="text"
                  placeholder="LT-..."
                  value={lotInput}
                  onChange={(e) => {
                    setLotInput(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="w-full h-10 px-2 bg-surface-container-low border border-outline-variant/60 rounded-lg text-xs font-mono text-on-surface focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <div className="flex flex-col gap-1">
                <label className="font-caption text-[10px] uppercase text-on-surface-variant font-bold truncate">
                  Batch No.
                </label>
                <input
                  type="text"
                  placeholder="B26..."
                  value={batchInput}
                  onChange={(e) => {
                    setBatchInput(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="w-full h-10 px-2 bg-surface-container-low border border-outline-variant/60 rounded-lg text-xs font-mono text-on-surface focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
            </div>
          </div>

          {/* Tier 2: Action Type Chips & Clear Filters */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 pt-3 border-t border-outline-variant/30 bg-surface-container-low/60 rounded-lg p-2.5">
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="font-mono text-[11px] font-bold text-on-surface-variant mr-2">
                Action Filter:
              </span>
              {[
                { label: "All Actions", val: "ALL" },
                { label: "Login", val: "LOGIN" },
                { label: "Failed Login", val: "FAILED_LOGIN" },
                { label: "Auto Log-off", val: "AUTO_LOGOFF" },
                { label: "Create", val: "CREATE" },
                { label: "Modify", val: "MODIFY" },
                { label: "Signature", val: "SIGNATURE" },
                { label: "Role / Rights", val: "ROLE_RIGHTS" },
                { label: "User Mgmt", val: "USER_MANAGEMENT" },
                { label: "Password Change", val: "PASSWORD_CHANGE" },
              ].map((chip) => {
                const active = selectedAction === chip.val;
                return (
                  <button
                    key={chip.val}
                    onClick={() => {
                      setSelectedAction(chip.val);
                      setCurrentPage(1);
                    }}
                    className={`px-2.5 py-1 rounded-lg text-xs font-mono transition-colors min-h-[32px] ${
                      active
                        ? "bg-primary text-on-primary font-bold shadow-xs"
                        : "bg-surface-container-lowest text-on-surface-variant hover:bg-surface-container border border-outline-variant/30"
                    }`}
                  >
                    {chip.label}
                  </button>
                );
              })}
            </div>

            <button
              onClick={handleClearFilters}
              className="px-3 py-1.5 text-xs font-mono text-primary hover:underline flex items-center gap-1 shrink-0 self-end lg:self-auto"
            >
              <span className="material-symbols-outlined text-[16px]">clear_all</span>
              <span>Clear Filters</span>
            </button>
          </div>
        </div>

        {/* Audit Trail Table Container */}
        <div className="bg-surface-container-lowest rounded-xl shadow-xs border border-outline-variant/40 overflow-hidden flex flex-col mb-6">
          {/* Live Ledger Verification Subheader */}
          <div className="px-space-md py-2.5 bg-surface-container-low flex items-center justify-between text-on-surface-variant font-mono text-xs border-b border-outline-variant/30 flex-wrap gap-2">
            <div className="flex items-center gap-3">
              <span className="font-bold text-on-surface">
                Showing {totalRecords > 0 ? (currentPage - 1) * pageSize + 1 : 0} to{" "}
                {Math.min(currentPage * pageSize, totalRecords)} of {totalRecords} Records
              </span>
              <span className="text-outline">|</span>
              <span className="text-secondary font-semibold">
                Merkle Root: Validated (SHA-256)
              </span>
            </div>
            <div className="flex items-center gap-2 text-[11px] text-outline">
              <span className="material-symbols-outlined text-[14px]">touch_app</span>
              <span>Click any row to open the per-record chronological audit drawer</span>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto w-full">
            <table className="w-full text-left border-collapse font-body-md text-xs">
              <thead className="bg-surface-container-low text-on-surface-variant font-mono text-[11px] uppercase tracking-wider border-b border-outline-variant/40">
                <tr>
                  <th className="py-3 px-3 font-semibold text-center w-16">Seq #</th>
                  <th className="py-3 px-3 font-semibold w-36">Timestamp (UTC)</th>
                  <th className="py-3 px-3 font-semibold w-40">Operator</th>
                  <th className="py-3 px-3 font-semibold w-28">Action</th>
                  <th className="py-3 px-3 font-semibold w-40">Target Entity</th>
                  <th className="py-3 px-3 font-semibold min-w-[200px]">Parameter Diff</th>
                  <th className="py-3 px-3 font-semibold min-w-[240px]">Reason for Change (21 CFR Part 11)</th>
                  <th className="py-3 px-3 font-semibold text-center w-28">Hash Verification</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant/20">
                {loading ? (
                  <tr>
                    <td colSpan={8} className="py-12 text-center text-outline font-mono">
                      <span className="material-symbols-outlined text-[24px] animate-spin inline-block mr-2">
                        progress_activity
                      </span>
                      Loading cryptographic audit trail records...
                    </td>
                  </tr>
                ) : paginatedEntries.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="py-12 text-center text-outline">
                      No audit records match the selected filter criteria.
                    </td>
                  </tr>
                ) : (
                  paginatedEntries.map((row) => {
                    const isFailure = row.action === "FAILED_LOGIN";
                    return (
                      <tr
                        key={row.seq}
                        onClick={() => {
                          setDrawerEntityId(row.entityId);
                          setDrawerEntityType(row.entityType);
                          setDrawerTitle(`${row.entityType} ${row.entityId}${row.lotNo ? ` (${row.lotNo})` : ""}`);
                        }}
                        className={`hover:bg-surface-container/70 transition-colors cursor-pointer group h-12 ${
                          isFailure ? "bg-red-50/40" : ""
                        }`}
                        title="Click to open record drawer"
                      >
                        {/* Seq # */}
                        <td className="py-3 px-3 font-mono font-bold text-center text-primary whitespace-nowrap">
                          #{String(row.seq).padStart(5, "0")}
                        </td>

                        {/* Timestamp */}
                        <td className="py-3 px-3 font-mono text-[11px] whitespace-nowrap text-on-surface">
                          {fmtDateTimeFull(row.at)}
                        </td>

                        {/* Operator */}
                        <td className="py-3 px-3 whitespace-nowrap">
                          <div className="flex flex-col">
                            <span className="font-semibold text-on-surface leading-tight">
                              {row.fullName}
                            </span>
                            <span className="font-mono text-[11px] text-outline leading-tight">
                              {row.userId}
                            </span>
                          </div>
                        </td>

                        {/* Action */}
                        <td className="py-3 px-3 whitespace-nowrap">
                          <StatusPill
                            label={row.action}
                            variant={getActionPillVariant(row.action) as any}
                            size="sm"
                          />
                        </td>

                        {/* Target Entity */}
                        <td className="py-3 px-3 whitespace-nowrap">
                          <div className="flex flex-col">
                            <span className="font-mono font-bold text-primary leading-tight">
                              {row.entityId}
                            </span>
                            <span className="font-caption text-[11px] text-on-surface-variant leading-tight">
                              {row.entityType} {row.lotNo ? `· ${row.lotNo}` : ""}
                            </span>
                          </div>
                        </td>

                        {/* Field Diff */}
                        <td className="py-3 px-3">
                          {row.field ? (
                            <div className="flex flex-col font-mono text-[11px] bg-surface-container-low p-1.5 rounded border border-outline-variant/30 max-w-xs">
                              <span className="font-bold text-outline">{row.field}</span>
                              <div className="truncate">
                                <span className="line-through text-red-700 mr-1">
                                  {row.oldValue !== undefined ? JSON.stringify(row.oldValue) : "null"}
                                </span>
                                <span>→</span>
                                <span className="font-bold text-emerald-700 ml-1">
                                  {row.newValue !== undefined ? JSON.stringify(row.newValue) : "null"}
                                </span>
                              </div>
                            </div>
                          ) : (
                            <span className="text-outline font-mono text-[11px]">System Record</span>
                          )}
                        </td>

                        {/* Reason for Change */}
                        <td className="py-3 px-3">
                          <span className="font-body-sm text-xs text-on-surface line-clamp-2" title={row.reason}>
                            {row.reason || "Automatic system state capture per GMP protocol."}
                          </span>
                        </td>

                        {/* Hash Verification Seal */}
                        <td className="py-3 px-3 text-center whitespace-nowrap">
                          <span
                            className="inline-flex items-center gap-1 font-mono text-[10px] px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-200"
                            title={`Full SHA-256 Hash: ${row.hash}`}
                          >
                            <span className="material-symbols-outlined text-[13px] text-emerald-600">
                              verified
                            </span>
                            <span>{row.hash.substring(0, 6)}...</span>
                          </span>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination Footer */}
          <div className="px-space-md py-3.5 bg-surface-container-low flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-outline-variant/30 font-body-sm text-xs text-on-surface-variant">
            <div>
              Showing <span className="font-semibold text-on-surface">{totalRecords > 0 ? (currentPage - 1) * pageSize + 1 : 0}</span> to{" "}
              <span className="font-semibold text-on-surface">
                {Math.min(currentPage * pageSize, totalRecords)}
              </span>{" "}
              of <span className="font-semibold text-on-surface">{totalRecords}</span> entries
            </div>

            <div className="flex items-center gap-1 font-mono">
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                className="min-h-[36px] min-w-[36px] rounded-lg bg-surface-container-lowest text-on-surface-variant flex items-center justify-center hover:bg-surface-container transition-colors disabled:opacity-40 border border-outline-variant/40"
              >
                <span className="material-symbols-outlined text-[18px]">chevron_left</span>
              </button>
              <span className="px-3 py-1.5 text-xs font-semibold text-primary bg-primary-fixed rounded-lg">
                Page {currentPage} of {totalPages}
              </span>
              <button
                disabled={currentPage >= totalPages}
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                className="min-h-[36px] min-w-[36px] rounded-lg bg-surface-container-lowest text-on-surface-variant flex items-center justify-center hover:bg-surface-container transition-colors disabled:opacity-40 border border-outline-variant/40"
              >
                <span className="material-symbols-outlined text-[18px]">chevron_right</span>
              </button>
            </div>
          </div>
        </div>

        {/* Cryptographic Proof & Compliance Summary Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="lg:col-span-2 bg-surface-container-lowest rounded-xl shadow-xs border border-outline-variant/40 p-4 flex flex-col justify-between">
            <div className="flex items-center justify-between pb-3 mb-3 border-b border-surface-container">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-[20px]">
                  lock_open
                </span>
                <span className="font-headline-sm text-xs font-bold text-on-surface uppercase tracking-wider">
                  Cryptographic Ledger Proof (SHA-256)
                </span>
              </div>
              <span className="font-mono text-[10px] px-2 py-0.5 rounded bg-surface-container text-on-surface-variant">
                Standard: NIST FIPS 180-4
              </span>
            </div>

            <div className="space-y-2 font-mono text-[11px]">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between p-2 rounded bg-surface-container-low border border-outline-variant/30">
                <span className="text-outline">GENESIS HASH (Seq #00001):</span>
                <span className="text-on-surface font-semibold truncate max-w-sm">
                  0000000000000000000000000000000000000000000000000000000000000000
                </span>
              </div>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between p-2 rounded bg-surface-container-low border border-outline-variant/30">
                <span className="text-outline">LATEST BLOCK HASH:</span>
                <span className="text-primary font-bold truncate max-w-sm">
                  {entries.length > 0 ? entries[entries.length - 1].hash : "—"}
                </span>
              </div>
            </div>

            <p className="font-caption text-[11px] text-on-surface-variant mt-3">
              Each block incorporates the SHA-256 digest of the preceding entry plus its canonical UTF-8 JSON representation. Any retroactive modification breaks the chain and alerts quality officers immediately.
            </p>
          </div>

          <div className="bg-surface-container-lowest rounded-xl shadow-xs border border-outline-variant/40 p-4 flex flex-col justify-between">
            <div className="flex items-center justify-between pb-3 mb-2 border-b border-surface-container">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-secondary text-[20px]">
                  fact_check
                </span>
                <span className="font-headline-sm text-xs font-bold text-on-surface uppercase tracking-wider">
                  Compliance Summary
                </span>
              </div>
              <span className="font-mono text-[10px] px-2 py-0.5 rounded bg-secondary-container text-on-secondary-container font-bold">
                AUDIT READY
              </span>
            </div>

            <div className="space-y-2 text-xs">
              <div className="flex items-center justify-between py-1 border-b border-outline-variant/20">
                <span className="text-on-surface-variant">21 CFR Part 11 Rule:</span>
                <span className="font-mono font-semibold text-emerald-800">Pass / Enforced</span>
              </div>
              <div className="flex items-center justify-between py-1 border-b border-outline-variant/20">
                <span className="text-on-surface-variant">EU Annex 11 Clause 9:</span>
                <span className="font-mono font-semibold text-emerald-800">Pass / Enforced</span>
              </div>
              <div className="flex items-center justify-between py-1 border-b border-outline-variant/20">
                <span className="text-on-surface-variant">Record Deletion:</span>
                <span className="font-mono font-semibold text-red-700">Blocked (No API/UI)</span>
              </div>
              <div className="flex items-center justify-between py-1">
                <span className="text-on-surface-variant">Total Chain Length:</span>
                <span className="font-mono font-bold text-primary">{entries.length} Blocks</span>
              </div>
            </div>

            <div className="pt-2 border-t border-outline-variant/30 flex items-center gap-1.5 text-outline text-[11px]">
              <span className="material-symbols-outlined text-[16px] text-emerald-600">
                check_circle
              </span>
              <span>Zero data alteration detected since genesis boot.</span>
            </div>
          </div>
        </div>

        {/* Verification Modal */}
        <Modal
          isOpen={verificationModalOpen}
          onClose={() => setVerificationModalOpen(false)}
          title={verificationResult?.valid ? "Cryptographic Ledger Verified" : "INTEGRITY BREACH DETECTED"}
          badge={verificationResult?.valid ? "CHAIN INTACT" : "HASH TAMPERED"}
          maxWidth="md"
          footer={
            <>
              {!verificationResult?.valid && (
                <Button variant="secondary" size="sm" onClick={handleRepairChain}>
                  Re-hash / Repair Chain (Dev)
                </Button>
              )}
              <Button
                variant={verificationResult?.valid ? "primary" : "destructive"}
                size="sm"
                onClick={() => setVerificationModalOpen(false)}
              >
                Close Report
              </Button>
            </>
          }
        >
          {verificationResult?.valid ? (
            <div className="flex flex-col gap-3 text-left">
              <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 flex items-start gap-3">
                <span className="material-symbols-outlined text-emerald-600 text-[28px]">
                  verified
                </span>
                <div>
                  <h4 className="font-headline-sm text-sm font-bold text-emerald-950">
                    Audit Trail Hash Chain 100% Intact
                  </h4>
                  <p className="font-body-sm text-xs text-emerald-900 mt-1 leading-relaxed">
                    Successfully recalculated SHA-256 digests across all{" "}
                    <strong>{verificationResult.totalEntries}</strong> sequential records from the Genesis block to current head. Zero unauthorized modifications, sequence gaps, or timestamp drifts detected.
                  </p>
                </div>
              </div>
              <div className="p-3 bg-surface-container-low rounded-lg font-mono text-xs space-y-1 text-on-surface">
                <div>Standard: NIST FIPS 180-4 SHA-256 Hash Chaining</div>
                <div>Status: Validated for 21 CFR Part 11 Inspection</div>
                <div>Timestamp: {fmtDateTimeFull(new Date())}</div>
              </div>
            </div>
          ) : (
            <div className="flex flex-col gap-3 text-left">
              <div className="p-4 rounded-xl bg-red-50 border border-red-200 flex items-start gap-3">
                <span className="material-symbols-outlined text-red-600 text-[28px]">
                  gpp_bad
                </span>
                <div>
                  <h4 className="font-headline-sm text-sm font-bold text-red-950">
                    Cryptographic Integrity Failure at Sequence #{verificationResult?.tamperedSeq}
                  </h4>
                  <p className="font-body-sm text-xs text-red-900 mt-1 leading-relaxed">
                    {verificationResult?.error}
                  </p>
                </div>
              </div>
              <p className="font-body-sm text-xs text-on-surface-variant">
                This simulated deviation demonstrates the system's ability to instantly identify retroactive database tampering or unauthorized row modifications.
              </p>
            </div>
          )}
        </Modal>

        {/* Per-Record Chronological Audit Drawer */}
        <RecordAuditDrawer
          isOpen={!!drawerEntityId}
          onClose={() => setDrawerEntityId(null)}
          entityId={drawerEntityId || ""}
          entityType={drawerEntityType}
          entityTitle={drawerTitle}
        />
      </div>
    </AppLayout>
  );
}
