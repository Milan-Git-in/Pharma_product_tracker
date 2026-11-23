"use client";

import React, { useState, useEffect, useRef, useMemo } from "react";
import AppLayout from "@/components/layout/AppLayout";
import Button from "@/components/ui/Button";
import Modal from "@/components/ui/Modal";
import { BarcodeFormat, BarcodeSegment, Symbology } from "@/domain/types";
import { mockApi } from "@/api";
import { useSession } from "@/services/session";
import { can } from "@/services/permission";
import { useToast } from "@/components/ui/Toast";
import { SEED_BARCODE_FORMATS } from "@/config/seed";
import {
  formatBarcodeString,
  previewNextBarcodes,
  calculateLuhnCheckDigit,
} from "@/domain/barcode";
import { downloadLabelsPdf, LabelPresetSize } from "@/services/labelPrint";
import JsBarcode from "jsbarcode";
import QRCode from "qrcode";

export default function BarcodeDesignerLabelPrintPage() {
  const { currentUser } = useSession();
  const { showToast } = useToast();

  const [formats, setFormats] = useState<BarcodeFormat[]>(SEED_BARCODE_FORMATS);
  const [activeEntity, setActiveEntity] = useState<"RACK" | "PALLET" | "BINDER">("PALLET");
  const [symbology, setSymbology] = useState<Symbology>("CODE128");
  const [separator, setSeparator] = useState<string>("-");
  const [checkDigit, setCheckDigit] = useState<boolean>(false);

  // Editable segments
  const [segments, setSegments] = useState<
    Array<{
      id: string;
      name: string;
      desc: string;
      type: any;
      value: string;
      pad: number;
      active: boolean;
    }>
  >([
    { id: "prefix", name: "Prefix", desc: "Entity identifier code", type: "LITERAL", value: "PL", pad: 0, active: true },
    { id: "location", name: "Location code", desc: "Cleanroom / zone ID", type: "LOCATION_CODE", value: "CR01", pad: 0, active: true },
    { id: "year", name: "Year", desc: "GMP batch calendar year", type: "YEAR4", value: "2026", pad: 0, active: true },
    { id: "running", name: "Running number", desc: "Zero-padded sequential counter", type: "SEQ", value: "", pad: 6, active: true },
    { id: "checkdigit", name: "Check digit", desc: "Mod-10 / Luhn error detection", type: "LITERAL", value: "", pad: 0, active: false },
  ]);

  const [currentSeq, setCurrentSeq] = useState<number>(125);
  const [batchQty, setBatchQty] = useState<number>(50);
  const [selectedSize, setSelectedSize] = useState<LabelPresetSize>("50x25");

  // Modals
  const [saveModalOpen, setSaveModalOpen] = useState(false);
  const [saveReason, setSaveReason] = useState("");
  const [saving, setSaving] = useState(false);

  const [batchModalOpen, setBatchModalOpen] = useState(false);
  const [batchReason, setBatchReason] = useState("");
  const [batchGenerating, setBatchGenerating] = useState(false);
  const [generatedCodes, setGeneratedCodes] = useState<string[]>([]);

  const [printModalOpen, setPrintModalOpen] = useState(false);
  const [printReason, setPrintReason] = useState("");
  const [printing, setPrinting] = useState(false);

  // GMP banner state
  const [bannerMessage, setBannerMessage] = useState<string | null>(null);

  // Barcode graphics refs
  const barcodeSvgRef = useRef<SVGSVGElement | null>(null);
  const qrCanvasRef = useRef<HTMLCanvasElement | null>(null);

  const canManage = can(currentUser, "barcode.manage");

  // Load formats from API
  const loadFormats = async () => {
    try {
      const res = await mockApi.getBarcodeFormats();
      if (res.ok && res.data) {
        setFormats(res.data);
      }
    } catch (err) {
      console.error("Failed to load barcode formats:", err);
    }
  };

  useEffect(() => {
    loadFormats();
  }, []);

  // When active entity changes, load its format configuration
  useEffect(() => {
    const activeFmt = formats.find((f) => f.entity === activeEntity);
    if (activeFmt) {
      setSymbology(activeFmt.symbology);
      setSeparator(activeFmt.separator);
      setCheckDigit(activeFmt.checkDigit);

      // Map to editable segments
      const defaultPrefix = activeEntity === "RACK" ? "RK" : activeEntity === "PALLET" ? "PL" : "BND";
      setSegments([
        {
          id: "prefix",
          name: "Prefix",
          desc: "Entity identifier code",
          type: "LITERAL",
          value: activeFmt.segments.find((s) => s.type === "LITERAL")?.value || defaultPrefix,
          pad: 0,
          active: true,
        },
        {
          id: "location",
          name: "Location code",
          desc: "Cleanroom / zone ID",
          type: "LOCATION_CODE",
          value: activeFmt.segments.find((s) => s.type === "LOCATION_CODE")?.value || "CR01",
          pad: 0,
          active: activeFmt.segments.some((s) => s.type === "LOCATION_CODE"),
        },
        {
          id: "year",
          name: "Year",
          desc: "GMP batch calendar year",
          type: activeFmt.segments.some((s) => s.type === "YEAR4") ? "YEAR4" : "YEAR2",
          value: "2026",
          pad: 0,
          active: activeFmt.segments.some((s) => s.type === "YEAR2" || s.type === "YEAR4"),
        },
        {
          id: "running",
          name: "Running number",
          desc: "Zero-padded sequential counter",
          type: "SEQ",
          value: "",
          pad: activeFmt.segments.find((s) => s.type === "SEQ")?.pad || 6,
          active: true,
        },
        {
          id: "checkdigit",
          name: "Check digit",
          desc: "Mod-10 / Luhn error detection",
          type: "LITERAL",
          value: "",
          pad: 0,
          active: activeFmt.checkDigit,
        },
      ]);
    }
  }, [activeEntity, formats]);

  // Build the compiled active format object
  const compiledFormat = useMemo<BarcodeFormat>(() => {
    const activeSegments: BarcodeSegment[] = [];

    for (const seg of segments) {
      if (!seg.active) continue;
      if (seg.id === "checkdigit") continue; // handled via format.checkDigit

      if (seg.id === "prefix") {
        activeSegments.push({ type: "LITERAL", value: seg.value });
      } else if (seg.id === "location") {
        activeSegments.push({ type: "LOCATION_CODE", value: seg.value });
      } else if (seg.id === "year") {
        activeSegments.push({ type: seg.type || "YEAR2" });
      } else if (seg.id === "running") {
        activeSegments.push({ type: "SEQ", pad: seg.pad || 4 });
      }
    }

    return {
      entity: activeEntity,
      symbology,
      segments: activeSegments,
      separator,
      seqStart: 1,
      checkDigit,
    };
  }, [segments, activeEntity, symbology, separator, checkDigit]);

  // Live preview string
  const previewString = useMemo(() => {
    return formatBarcodeString(compiledFormat, currentSeq, {
      locationCode: segments.find((s) => s.id === "location")?.value || "CR01",
      year: 2026,
    });
  }, [compiledFormat, currentSeq, segments]);

  // Next 3 Sample values
  const next3Samples = useMemo(() => {
    return previewNextBarcodes(compiledFormat, 3, currentSeq + 1, {
      locationCode: segments.find((s) => s.id === "location")?.value || "CR01",
      year: 2026,
    });
  }, [compiledFormat, currentSeq, segments]);

  // Draw live Code 128 barcode or QR code when previewString changes
  useEffect(() => {
    if (symbology === "CODE128" && barcodeSvgRef.current) {
      try {
        JsBarcode(barcodeSvgRef.current, previewString, {
          format: "CODE128",
          displayValue: false,
          margin: 0,
          width: 2,
          height: 64,
        });
      } catch (err) {
        console.error("Barcode render error:", err);
      }
    } else if (symbology === "QR" && qrCanvasRef.current) {
      QRCode.toCanvas(qrCanvasRef.current, previewString, {
        width: 140,
        margin: 1,
        errorCorrectionLevel: "M",
      }).catch((err) => console.error("QR render error:", err));
    }
  }, [previewString, symbology]);

  // Move segment up/down
  const moveSegment = (index: number, direction: "UP" | "DOWN") => {
    const targetIdx = direction === "UP" ? index - 1 : index + 1;
    if (targetIdx < 0 || targetIdx >= segments.length) return;
    const next = [...segments];
    const temp = next[index];
    next[index] = next[targetIdx];
    next[targetIdx] = temp;
    setSegments(next);
  };

  // Toggle active segment
  const toggleSegmentActive = (id: string) => {
    setSegments((prev) =>
      prev.map((s) => {
        if (s.id === id) {
          if (id === "checkdigit") {
            setCheckDigit(!s.active);
          }
          return { ...s, active: !s.active };
        }
        return s;
      })
    );
  };

  // Update segment value
  const updateSegmentValue = (id: string, value: string) => {
    setSegments((prev) =>
      prev.map((s) => (s.id === id ? { ...s, value: value.toUpperCase() } : s))
    );
  };

  // Update segment pad
  const updateSegmentPad = (id: string, pad: number) => {
    setSegments((prev) =>
      prev.map((s) => (s.id === id ? { ...s, pad } : s))
    );
  };

  // Reset defaults
  const handleResetDefaults = () => {
    const seed = SEED_BARCODE_FORMATS.find((f) => f.entity === activeEntity) || SEED_BARCODE_FORMATS[0];
    setSymbology(seed.symbology);
    setSeparator(seed.separator);
    setCheckDigit(seed.checkDigit);
    showToast("info", "Format Reset", `Restored default ${activeEntity} barcode schema.`);
  };

  // Save format with audit reason
  const handleSaveFormat = async () => {
    if (!currentUser) return;
    if (!saveReason || saveReason.trim().length < 5) {
      showToast("error", "Validation Error", "A mandatory regulatory Reason for Change (min 5 chars) is required.");
      return;
    }

    setSaving(true);
    try {
      const updatedFormats = formats.map((f) => (f.entity === activeEntity ? compiledFormat : f));
      if (!updatedFormats.some((f) => f.entity === activeEntity)) {
        updatedFormats.push(compiledFormat);
      }

      const res = await mockApi.updateBarcodeFormats(updatedFormats, currentUser, saveReason);
      if (res.ok) {
        setFormats(res.data?.formats || updatedFormats);
        setSaveModalOpen(false);
        setBannerMessage(`Format for ${activeEntity} successfully updated and versioned. Existing issued codes remain immutable.`);
        showToast("success", "Format Saved", `Updated ${activeEntity} barcode specification per 21 CFR §11.10.`);
      } else {
        showToast("error", "Save Failed", res.error?.message || "Failed to save barcode format.");
      }
    } catch (err: any) {
      showToast("error", "Error", err?.message || "An unexpected error occurred.");
    } finally {
      setSaving(false);
    }
  };

  // Generate batch
  const handleGenerateBatch = async () => {
    if (!currentUser) return;
    if (!batchReason || batchReason.trim().length < 5) {
      showToast("error", "Validation Error", "A regulatory Reason for Batch Generation is mandatory.");
      return;
    }

    setBatchGenerating(true);
    try {
      const loc = segments.find((s) => s.id === "location")?.value || "CR01";
      const res = await mockApi.generateBarcodes(activeEntity, batchQty, { locationCode: loc }, currentUser, batchReason);
      if (res.ok && res.data) {
        setGeneratedCodes(res.data.barcodes);
        showToast("success", "Batch Generated", `Successfully generated ${res.data.barcodes.length} unique sequential barcodes.`);
      } else {
        showToast("error", "Generation Failed", res.error?.message || "Could not generate batch.");
      }
    } catch (err: any) {
      showToast("error", "Error", err?.message || "Generation error.");
    } finally {
      setBatchGenerating(false);
    }
  };

  // Print Labels
  const handlePrintLabels = async () => {
    if (!currentUser) return;
    if (!printReason || printReason.trim().length < 5) {
      showToast("error", "Validation Error", "A regulatory Reason for Label Printing is mandatory.");
      return;
    }

    setPrinting(true);
    try {
      const codesToPrint = generatedCodes.length > 0 ? generatedCodes : [previewString];
      await mockApi.reprintBarcode(codesToPrint[0], activeEntity, selectedSize, currentUser, printReason);

      const items = codesToPrint.map((code) => ({
        code,
        entityType: activeEntity,
        symbology,
        title: `${activeEntity} Cleanroom Label`,
        location: segments.find((s) => s.id === "location")?.value || "CR01",
      }));

      await downloadLabelsPdf(items, { size: selectedSize });
      showToast("success", "PDF Exported", `Cleanroom thermal label PDF (${selectedSize}) ready.`);
      setPrintModalOpen(false);
    } catch (err: any) {
      showToast("error", "Print Failed", err?.message || "Could not generate label PDF.");
    } finally {
      setPrinting(false);
    }
  };

  return (
    <AppLayout screenCode="S21">
      <div className="flex flex-col w-full gap-space-lg pb-space-xl text-left">
        {/* Header Section */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-space-md pt-space-md">
          <div className="flex flex-col gap-space-xs">
            <div className="flex items-center gap-space-sm">
              <span className="px-2 py-0.5 rounded bg-secondary-container text-on-secondary-container font-label-sm text-label-sm uppercase tracking-wider font-semibold">
                SOP-LBL-021
              </span>
              <span className="font-label-sm text-label-sm text-on-surface-variant font-mono">
                21 CFR PART 11 • CLEANROOM LINE 04
              </span>
            </div>
            <h1 className="font-headline-lg text-2xl font-bold text-on-surface tracking-tight">
              S21 Barcode Designer &amp; Label Print
            </h1>
            <p className="font-body-md text-sm text-on-surface-variant max-w-2xl">
              Configure GMP-compliant barcode formats, generate sequential lot &amp; container batches, and print validated cleanroom labels.
            </p>
          </div>

          <div className="flex items-center gap-space-sm shrink-0 flex-wrap">
            <div className="flex items-center gap-space-xs px-3 py-2 rounded-lg bg-surface-container-lowest shadow-xs border border-outline-variant/30">
              <span className="material-symbols-outlined text-secondary text-[18px]">print</span>
              <div className="flex flex-col text-left">
                <span className="font-caption text-[11px] text-on-surface-variant leading-none">
                  Zebra ZT411-CR04
                </span>
                <span className="font-label-sm text-xs text-primary font-semibold">
                  Calibrated • Ready
                </span>
              </div>
            </div>

            <button
              onClick={handleResetDefaults}
              className="min-h-[44px] px-4 rounded-lg bg-surface-container-lowest text-primary font-label-md text-xs shadow-xs border border-outline-variant/30 hover:bg-surface-container transition-colors flex items-center gap-space-xs font-semibold"
            >
              <span className="material-symbols-outlined text-[18px]">restart_alt</span>
              <span>Reset Defaults</span>
            </button>
          </div>
        </div>

        {/* Inline GMP Action Feedback Banner */}
        {bannerMessage && (
          <div className="p-3.5 rounded-xl bg-secondary-container/60 border border-secondary/30 text-on-secondary-container flex items-center justify-between gap-space-sm animate-fade-in">
            <div className="flex items-center gap-space-sm">
              <span className="material-symbols-outlined text-secondary text-[22px]">verified</span>
              <span className="font-body-md text-xs font-medium">{bannerMessage}</span>
            </div>
            <button
              onClick={() => setBannerMessage(null)}
              className="p-1 rounded hover:bg-surface-container-lowest/40 transition-colors"
            >
              <span className="material-symbols-outlined text-[18px]">close</span>
            </button>
          </div>
        )}

        {/* Main Two-Column Workspace */}
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-space-lg items-start">
          {/* LEFT COLUMN: Configuration & Format Builder (7 cols) */}
          <div className="xl:col-span-7 flex flex-col gap-space-lg">
            {/* 1. Entity Selector & 2. Symbology */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-space-md">
              {/* Entity Selector Card */}
              <div className="bg-surface-container-lowest rounded-xl p-space-md shadow-xs border border-outline-variant/30 flex flex-col gap-space-sm">
                <div className="flex items-center justify-between">
                  <span className="font-headline-sm text-sm font-bold text-on-surface">1. Target Entity</span>
                  <span className="font-label-sm text-[10px] font-bold text-on-surface-variant px-1.5 py-0.5 rounded bg-surface-container">
                    REQUIRED
                  </span>
                </div>
                <div className="grid grid-cols-3 gap-space-sm">
                  {(["Rack", "Pallet", "Binder"] as const).map((ent) => {
                    const entKey = ent.toUpperCase() as "RACK" | "PALLET" | "BINDER";
                    const isSelected = activeEntity === entKey;
                    const icon = ent === "Rack" ? "shelves" : ent === "Pallet" ? "pallet" : "folder_shared";
                    return (
                      <button
                        key={ent}
                        onClick={() => setActiveEntity(entKey)}
                        className={`min-h-[44px] p-2.5 rounded-lg transition-all flex flex-col items-center justify-center gap-1 border ${
                          isSelected
                            ? "bg-primary text-on-primary border-primary shadow-xs font-bold"
                            : "bg-surface-container-low text-on-surface-variant border-transparent hover:bg-surface-container hover:text-on-surface"
                        }`}
                      >
                        <span className="material-symbols-outlined text-[20px]">{icon}</span>
                        <span className="font-body-sm text-xs font-medium">{ent}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Symbology Selector Card */}
              <div className="bg-surface-container-lowest rounded-xl p-space-md shadow-xs border border-outline-variant/30 flex flex-col gap-space-sm">
                <div className="flex items-center justify-between">
                  <span className="font-headline-sm text-sm font-bold text-on-surface">2. Symbology</span>
                  <span className="font-label-sm text-[10px] font-mono text-on-surface-variant px-1.5 py-0.5 rounded bg-surface-container">
                    ISO/IEC
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-space-sm">
                  <button
                    onClick={() => setSymbology("CODE128")}
                    className={`min-h-[44px] p-2.5 rounded-lg transition-all flex items-center justify-center gap-space-sm border ${
                      symbology === "CODE128"
                        ? "bg-primary text-on-primary border-primary shadow-xs"
                        : "bg-surface-container-low text-on-surface-variant border-transparent hover:bg-surface-container hover:text-on-surface"
                    }`}
                  >
                    <span className="material-symbols-outlined text-[20px]">barcode</span>
                    <div className="flex flex-col text-left">
                      <span className="font-body-sm text-xs font-bold leading-tight">Code 128</span>
                      <span className="font-label-sm text-[10px] opacity-80 leading-tight">Linear 1D</span>
                    </div>
                  </button>

                  <button
                    onClick={() => setSymbology("QR")}
                    className={`min-h-[44px] p-2.5 rounded-lg transition-all flex items-center justify-center gap-space-sm border ${
                      symbology === "QR"
                        ? "bg-primary text-on-primary border-primary shadow-xs"
                        : "bg-surface-container-low text-on-surface-variant border-transparent hover:bg-surface-container hover:text-on-surface"
                    }`}
                  >
                    <span className="material-symbols-outlined text-[20px]">qr_code_2</span>
                    <div className="flex flex-col text-left">
                      <span className="font-body-sm text-xs font-bold leading-tight">QR</span>
                      <span className="font-label-sm text-[10px] opacity-80 leading-tight">2D Matrix</span>
                    </div>
                  </button>
                </div>
              </div>
            </div>

            {/* 3. Format Builder */}
            <div className="bg-surface-container-lowest rounded-xl p-space-md shadow-xs border border-outline-variant/30 flex flex-col gap-space-md">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-space-sm">
                <div>
                  <h2 className="font-headline-sm text-sm font-bold text-on-surface">3. Format Builder</h2>
                  <p className="font-body-sm text-xs text-on-surface-variant">
                    Reorder segments, toggle active fields, and define delimiter rules.
                  </p>
                </div>

                {/* Separator Selector */}
                <div className="flex items-center gap-space-sm bg-surface-container-low px-3 py-1.5 rounded-lg border border-outline-variant/30">
                  <label className="font-label-sm text-xs text-on-surface-variant uppercase font-medium">
                    Separator
                  </label>
                  <select
                    value={separator}
                    onChange={(e) => setSeparator(e.target.value)}
                    className="min-h-[32px] bg-surface-container-lowest text-on-surface font-mono text-xs px-2.5 py-1 rounded shadow-xs focus:outline-none"
                  >
                    <option value="-">- (Hyphen)</option>
                    <option value="_">_ (Underscore)</option>
                    <option value="/">/ (Slash)</option>
                    <option value="None">None</option>
                  </select>
                </div>
              </div>

              {/* Segments List */}
              <div className="flex flex-col gap-2">
                {segments.map((seg, idx) => (
                  <div
                    key={seg.id}
                    className={`flex flex-wrap sm:flex-nowrap items-center justify-between gap-space-sm p-3 rounded-lg border transition-all ${
                      seg.active
                        ? "bg-surface-container-low border-outline-variant/30 text-on-surface"
                        : "bg-surface-container-lowest/60 border-dashed border-outline-variant/20 opacity-60 text-outline"
                    }`}
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <div className="flex flex-col">
                        <button
                          disabled={idx === 0}
                          onClick={() => moveSegment(idx, "UP")}
                          className="text-outline hover:text-on-surface disabled:opacity-20 text-[16px] leading-none"
                          title="Move up"
                        >
                          <span className="material-symbols-outlined text-[16px]">arrow_drop_up</span>
                        </button>
                        <button
                          disabled={idx === segments.length - 1}
                          onClick={() => moveSegment(idx, "DOWN")}
                          className="text-outline hover:text-on-surface disabled:opacity-20 text-[16px] leading-none"
                          title="Move down"
                        >
                          <span className="material-symbols-outlined text-[16px]">arrow_drop_down</span>
                        </button>
                      </div>

                      <div className="flex flex-col">
                        <span className="font-body-md text-xs font-bold">{seg.name}</span>
                        <span className="font-caption text-[11px] text-on-surface-variant">{seg.desc}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 ml-auto">
                      {seg.id === "prefix" && (
                        <input
                          value={seg.value}
                          onChange={(e) => updateSegmentValue(seg.id, e.target.value)}
                          maxLength={6}
                          className="min-h-[32px] w-20 px-2 rounded bg-surface-container-lowest text-on-surface font-mono text-xs text-center border border-outline-variant/40 uppercase"
                        />
                      )}

                      {seg.id === "location" && (
                        <input
                          value={seg.value}
                          onChange={(e) => updateSegmentValue(seg.id, e.target.value)}
                          maxLength={6}
                          className="min-h-[32px] w-24 px-2 rounded bg-surface-container-lowest text-on-surface font-mono text-xs text-center border border-outline-variant/40 uppercase"
                        />
                      )}

                      {seg.id === "year" && (
                        <select
                          value={seg.type}
                          onChange={(e) => {
                            const t = e.target.value;
                            setSegments((prev) =>
                              prev.map((s) => (s.id === "year" ? { ...s, type: t } : s))
                            );
                          }}
                          className="min-h-[32px] px-2 rounded bg-surface-container-lowest text-on-surface font-mono text-xs border border-outline-variant/40"
                        >
                          <option value="YEAR4">4-Digit (2026)</option>
                          <option value="YEAR2">2-Digit (26)</option>
                        </select>
                      )}

                      {seg.id === "running" && (
                        <select
                          value={seg.pad}
                          onChange={(e) => updateSegmentPad(seg.id, parseInt(e.target.value, 10))}
                          className="min-h-[32px] bg-surface-container-lowest text-on-surface font-mono text-xs px-2 rounded border border-outline-variant/40"
                        >
                          <option value={3}>3 digits → 001</option>
                          <option value={4}>4 digits → 0125</option>
                          <option value={5}>5 digits → 00125</option>
                          <option value={6}>6 digits → 000125</option>
                          <option value={8}>8 digits → 00000125</option>
                        </select>
                      )}

                      {seg.id === "checkdigit" && (
                        <span className="px-2 py-0.5 rounded bg-secondary-container text-on-secondary-container font-mono text-xs font-semibold">
                          Mod-10 / Luhn
                        </span>
                      )}

                      {/* Active toggle */}
                      <button
                        type="button"
                        onClick={() => toggleSegmentActive(seg.id)}
                        className={`w-9 h-5 rounded-full transition-colors relative p-0.5 ${
                          seg.active ? "bg-primary" : "bg-surface-container-highest"
                        }`}
                      >
                        <div
                          className={`w-4 h-4 rounded-full bg-surface-container-lowest shadow-xs transition-transform ${
                            seg.active ? "translate-x-4" : "translate-x-0"
                          }`}
                        />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Save Format Action */}
              {canManage && (
                <div className="pt-2 flex justify-end">
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => {
                      setSaveReason("GMP qualification and release of updated barcode structure per SOP-LBL-021");
                      setSaveModalOpen(true);
                    }}
                    icon="save"
                  >
                    Save Format Definition
                  </Button>
                </div>
              )}
            </div>
          </div>

          {/* RIGHT COLUMN: Live Preview, Batch & Print (5 cols) */}
          <div className="xl:col-span-5 flex flex-col gap-space-lg">
            {/* 1. Live Barcode Preview Card */}
            <div className="bg-surface-container-lowest rounded-xl p-space-md shadow-xs border border-outline-variant/30 flex flex-col gap-space-md">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-space-xs">
                  <span className="w-2 h-2 rounded-full bg-secondary animate-pulse"></span>
                  <h2 className="font-headline-sm text-sm font-bold text-on-surface">Live Barcode Preview</h2>
                </div>
                <span className="px-2 py-0.5 rounded bg-surface-container font-mono text-[11px] font-bold text-on-surface-variant">
                  {symbology} • {selectedSize.toUpperCase()}
                </span>
              </div>

              {/* White Label Card Preview */}
              <div className="bg-surface-container-low rounded-xl p-space-md flex items-center justify-center border border-outline-variant/20">
                <div className="bg-white rounded-lg shadow-sm border border-slate-300 p-4 flex flex-col items-center justify-center gap-2 w-full max-w-sm">
                  <div className="w-full flex items-center justify-between text-slate-500 font-mono text-[10px] uppercase font-bold tracking-wider">
                    <span>PTS-GMP</span>
                    <span>{activeEntity}</span>
                  </div>

                  {/* Dynamic Graphic Container */}
                  <div className="w-full flex items-center justify-center py-1 min-h-[72px]">
                    {symbology === "CODE128" ? (
                      <svg ref={barcodeSvgRef} className="w-full max-h-16" />
                    ) : (
                      <canvas ref={qrCanvasRef} className="w-28 h-28" />
                    )}
                  </div>

                  {/* Human-Readable Monospace Text */}
                  <div className="font-mono text-sm font-bold tracking-widest text-slate-900 select-all">
                    {previewString}
                  </div>
                </div>
              </div>
            </div>

            {/* 2. Next 3 Sample Values */}
            <div className="bg-surface-container-lowest rounded-xl p-space-md shadow-xs border border-outline-variant/30 flex flex-col gap-space-sm">
              <div className="flex items-center justify-between">
                <h3 className="font-headline-sm text-xs font-bold uppercase text-on-surface tracking-wider">
                  Next 3 Sample Values
                </h3>
                <span className="font-caption text-[11px] text-on-surface-variant">Sequential Forecast</span>
              </div>

              <div className="flex flex-col gap-1.5">
                {next3Samples.map((sample) => (
                  <div
                    key={sample.seq}
                    className="flex items-center justify-between px-3 py-2 rounded-lg bg-surface-container-low border border-outline-variant/20"
                  >
                    <span className="font-mono text-xs text-outline font-semibold">
                      #{String(sample.seq).padStart(6, "0")}
                    </span>
                    <span className="font-mono text-xs font-bold text-primary select-all">
                      {sample.code}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* 3. Generate Batch Card */}
            <div className="bg-surface-container-lowest rounded-xl p-space-md shadow-xs border border-outline-variant/30 flex flex-col gap-space-sm">
              <div className="flex items-center justify-between">
                <h3 className="font-headline-sm text-sm font-bold text-on-surface">Generate Batch</h3>
                <span className="font-label-sm text-[10px] font-mono font-bold text-secondary uppercase">
                  AUDIT LOGGED
                </span>
              </div>

              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-space-sm">
                <div className="flex items-center gap-2 bg-surface-container-low px-3 py-1.5 rounded-lg border border-outline-variant/30 flex-1">
                  <label className="font-body-sm text-xs text-on-surface-variant font-medium whitespace-nowrap">
                    Quantity:
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="500"
                    value={batchQty}
                    onChange={(e) => setBatchQty(parseInt(e.target.value, 10) || 1)}
                    className="w-full bg-surface-container-lowest text-on-surface font-mono text-xs px-2 py-1 rounded shadow-xs focus:outline-none"
                  />
                </div>

                <Button
                  variant="secondary"
                  size="md"
                  onClick={() => {
                    setBatchReason(`Batch sequential generation of ${batchQty} ${activeEntity} container barcodes`);
                    setBatchModalOpen(true);
                  }}
                  icon="dynamic_feed"
                >
                  Generate
                </Button>
              </div>
            </div>

            {/* 4. Print Labels Card */}
            <div className="bg-surface-container-lowest rounded-xl p-space-md shadow-xs border border-outline-variant/30 flex flex-col gap-space-md">
              <div className="flex items-center justify-between">
                <h3 className="font-headline-sm text-sm font-bold text-on-surface">Print Labels</h3>
                <span className="font-caption text-[11px] text-on-surface-variant font-mono">
                  Thermal Transfer • Cleanroom
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setSelectedSize("50x25")}
                  className={`p-3 rounded-lg border transition-all text-left flex flex-col ${
                    selectedSize === "50x25"
                      ? "bg-primary text-on-primary border-primary shadow-xs"
                      : "bg-surface-container-low text-on-surface-variant border-transparent hover:bg-surface-container"
                  }`}
                >
                  <span className="font-label-lg text-xs font-bold">50 × 25 mm</span>
                  <span className="font-caption text-[10px] opacity-80">Standard Vial / Rack</span>
                </button>

                <button
                  type="button"
                  onClick={() => setSelectedSize("100x50")}
                  className={`p-3 rounded-lg border transition-all text-left flex flex-col ${
                    selectedSize === "100x50"
                      ? "bg-primary text-on-primary border-primary shadow-xs"
                      : "bg-surface-container-low text-on-surface-variant border-transparent hover:bg-surface-container"
                  }`}
                >
                  <span className="font-label-lg text-xs font-bold">100 × 50 mm</span>
                  <span className="font-caption text-[10px] opacity-80">Pallet / Carton</span>
                </button>
              </div>

              <Button
                variant="primary"
                size="md"
                onClick={() => {
                  setPrintReason(`Thermal cleanroom label printing for ${activeEntity} ${previewString}`);
                  setPrintModalOpen(true);
                }}
                icon="print"
                className="w-full justify-center"
              >
                Print Validated Label (PDF)
              </Button>
            </div>
          </div>
        </div>

        {/* Modal: Save Format Definition */}
        <Modal
          isOpen={saveModalOpen}
          onClose={() => setSaveModalOpen(false)}
          title={`Save ${activeEntity} Barcode Specification`}
          maxWidth="sm"
        >
          <div className="flex flex-col gap-3 text-left">
            <p className="text-xs text-on-surface-variant">
              Changing the barcode format updates configuration for newly generated {activeEntity} units. Under GMP
              Rule R10, existing issued barcodes remain immutable.
            </p>

            <div>
              <label className="block font-label-md text-xs font-semibold text-on-surface mb-1">
                Reason for Change (21 CFR Part 11) <span className="text-red-600">*</span>
              </label>
              <textarea
                value={saveReason}
                onChange={(e) => setSaveReason(e.target.value)}
                rows={2}
                placeholder="Reason for updating barcode format structure..."
                className="w-full p-2.5 rounded-lg bg-surface-container-low border border-outline-variant/40 text-xs focus:outline-none focus:border-primary"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <Button variant="secondary" size="sm" onClick={() => setSaveModalOpen(false)}>
                Cancel
              </Button>
              <Button variant="primary" size="sm" onClick={handleSaveFormat} loading={saving}>
                Confirm &amp; Save
              </Button>
            </div>
          </div>
        </Modal>

        {/* Modal: Generate Batch */}
        <Modal
          isOpen={batchModalOpen}
          onClose={() => setBatchModalOpen(false)}
          title={`Generate ${batchQty} ${activeEntity} Barcodes`}
          maxWidth="md"
        >
          <div className="flex flex-col gap-4 text-left">
            <div>
              <label className="block font-label-md text-xs font-semibold text-on-surface mb-1">
                Reason for Batch Generation <span className="text-red-600">*</span>
              </label>
              <textarea
                value={batchReason}
                onChange={(e) => setBatchReason(e.target.value)}
                rows={2}
                placeholder="Business justification for mass barcode issuance..."
                className="w-full p-2.5 rounded-lg bg-surface-container-low border border-outline-variant/40 text-xs focus:outline-none focus:border-primary"
              />
            </div>

            {generatedCodes.length > 0 && (
              <div className="flex flex-col gap-2 p-3 rounded-lg bg-surface-container-low border border-outline-variant/40 max-h-56 overflow-y-auto">
                <div className="flex items-center justify-between">
                  <span className="font-caption text-xs uppercase font-bold text-on-surface-variant">
                    Generated Codes ({generatedCodes.length})
                  </span>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(generatedCodes.join("\n"));
                      showToast("info", "Copied", "Barcodes copied to clipboard.");
                    }}
                    className="font-mono text-xs text-primary font-bold hover:underline"
                  >
                    Copy All
                  </button>
                </div>
                <div className="grid grid-cols-2 gap-1 font-mono text-xs select-all">
                  {generatedCodes.map((c, i) => (
                    <div key={i} className="p-1 rounded bg-surface-container-lowest border border-outline-variant/20 px-2">
                      {c}
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="flex justify-between items-center pt-2">
              <Button
                variant="primary"
                size="sm"
                onClick={handleGenerateBatch}
                loading={batchGenerating}
                icon="dynamic_feed"
              >
                {generatedCodes.length > 0 ? "Re-generate" : "Generate Barcodes"}
              </Button>

              <Button variant="secondary" size="sm" onClick={() => setBatchModalOpen(false)}>
                Done
              </Button>
            </div>
          </div>
        </Modal>

        {/* Modal: Print Labels */}
        <Modal
          isOpen={printModalOpen}
          onClose={() => setPrintModalOpen(false)}
          title={`Print ${activeEntity} Cleanroom Label (${selectedSize})`}
          maxWidth="sm"
        >
          <div className="flex flex-col gap-3 text-left">
            <div className="p-2.5 rounded-lg bg-surface-container-low border border-outline-variant/30 flex items-center justify-between">
              <div>
                <span className="font-caption text-[11px] text-on-surface-variant uppercase">Target Code</span>
                <div className="font-mono font-bold text-primary text-sm">{previewString}</div>
              </div>
              <span className="font-mono text-xs px-2 py-0.5 rounded bg-primary-fixed text-on-primary-fixed font-bold">
                {symbology}
              </span>
            </div>

            <div>
              <label className="block font-label-md text-xs font-semibold text-on-surface mb-1">
                Reason for Print / Reprint <span className="text-red-600">*</span>
              </label>
              <textarea
                value={printReason}
                onChange={(e) => setPrintReason(e.target.value)}
                rows={2}
                placeholder="Reason for thermal label generation..."
                className="w-full p-2.5 rounded-lg bg-surface-container-low border border-outline-variant/40 text-xs focus:outline-none focus:border-primary"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <Button variant="secondary" size="sm" onClick={() => setPrintModalOpen(false)}>
                Cancel
              </Button>
              <Button
                variant="primary"
                size="sm"
                onClick={handlePrintLabels}
                loading={printing}
                icon="print"
              >
                Download PDF
              </Button>
            </div>
          </div>
        </Modal>
      </div>
    </AppLayout>
  );
}
