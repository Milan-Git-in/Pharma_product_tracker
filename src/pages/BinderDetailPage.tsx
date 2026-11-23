"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import JsBarcode from "jsbarcode";
import QRCode from "qrcode";
import AppLayout from "@/components/layout/AppLayout";
import { mockApi } from "@/api";
import { Binder, BarcodeFormat, MovementEvent, ProductTray, WorkflowStage } from "@/domain/types";
import { MAX_TRAYS_PER_BATCH } from "@/domain/barcode";
import { downloadTrayLabelsA4Pdf } from "@/services/labelPrint";
import { useSession } from "@/services/session";
import { can } from "@/services/permission";

interface BinderTrace {
  binder: Binder;
  trays: ProductTray[];
  events: MovementEvent[];
  stages: WorkflowStage[];
  actors: Array<{ userId: string; fullName: string }>;
}

function getRouteBinderId(): string | null {
  if (typeof window === "undefined") return null;
  const hashPath = window.location.hash.replace(/^#/, "").split("?")[0];
  const match =
    window.location.pathname.match(/^\/binders\/([^/]+)\/?$/) ||
    hashPath.match(/^\/binders\/([^/]+)\/?$/);
  const id = match?.[1];
  if (id && id !== "detail" && id !== "new") return id;
  return new URLSearchParams(window.location.search).get("binder");
}

const BarcodePreview: React.FC<{ value: string; symbology: BarcodeFormat["symbology"] }> = ({
  value,
  symbology,
}) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const [qrDataUrl, setQrDataUrl] = useState("");

  useEffect(() => {
    if (symbology === "QR") {
      QRCode.toDataURL(value, { width: 144, margin: 1 }).then(setQrDataUrl).catch((error: unknown) => {
        console.error("Could not render tray QR preview:", error);
      });
    } else if (svgRef.current) {
      try {
        JsBarcode(svgRef.current, value, {
          format: "CODE128",
          displayValue: true,
          fontSize: 11,
          height: 44,
          margin: 4,
        });
      } catch (error) {
        console.error("Could not render tray barcode preview:", error);
      }
    }
  }, [symbology, value]);

  return symbology === "QR" ? (
    qrDataUrl ? <img src={qrDataUrl} alt={`QR code ${value}`} className="h-28 w-28" /> : <span>Preparing QR…</span>
  ) : (
    <svg ref={svgRef} role="img" aria-label={`Barcode ${value}`} className="max-w-full" />
  );
};

export default function BinderDetailPage() {
  const { currentUser } = useSession();
  const [binders, setBinders] = useState<Binder[]>([]);
  const [selectedId, setSelectedId] = useState("");
  const [trace, setTrace] = useState<BinderTrace | null>(null);
  const [symbology, setSymbology] = useState<BarcodeFormat["symbology"]>("CODE128");
  const [trayCountInput, setTrayCountInput] = useState("");
  const [reason, setReason] = useState("");
  const [loading, setLoading] = useState(true);
  const [issuing, setIssuing] = useState(false);
  const [printing, setPrinting] = useState(false);
  const [refreshVersion, setRefreshVersion] = useState(0);
  const [feedback, setFeedback] = useState<{ type: "error" | "success"; message: string } | null>(null);
  const canIssueTrays = can(currentUser, "binder.create") || can(currentUser, "barcode.manage");

  useEffect(() => {
    let active = true;
    Promise.all([mockApi.getBinders(), mockApi.getBarcodeFormats()])
      .then(([binderResponse, formatResponse]) => {
        if (!active) return;
        if (!binderResponse.ok || !binderResponse.data) {
          throw new Error(binderResponse.error?.message || "Unable to load binders.");
        }
        setBinders(binderResponse.data);
        const requestedId = getRouteBinderId();
        const initialId = binderResponse.data.some((item) => item.id === requestedId)
          ? requestedId!
          : binderResponse.data[0]?.id || "";
        setSelectedId(initialId);
        if (formatResponse.ok && formatResponse.data) {
          setSymbology(formatResponse.data.find((item) => item.entity === "BINDER")?.symbology || "CODE128");
        } else {
          setFeedback({
            type: "error",
            message: formatResponse.error?.message || "Could not load barcode format configuration.",
          });
        }
      })
      .catch((error: unknown) => {
        if (active) setFeedback({ type: "error", message: error instanceof Error ? error.message : String(error) });
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    if (!selectedId) {
      setTrace(null);
      return;
    }

    let active = true;
    setTrace(null);
    mockApi.getBinderTrace(selectedId)
      .then((response) => {
        if (!active) return;
        if (!response.ok || !response.data) {
          throw new Error(response.error?.message || "Unable to load batch and tray history.");
        }
        setTrace(response.data);
        setTrayCountInput(String(response.data.binder.trayCount || ""));
        setFeedback(null);
      })
      .catch((error: unknown) => {
        if (active) setFeedback({ type: "error", message: error instanceof Error ? error.message : String(error) });
      });
    return () => {
      active = false;
    };
  }, [selectedId, refreshVersion]);

  const actorNames = useMemo(
    () => new Map(trace?.actors.map((actor) => [actor.userId, actor.fullName]) || []),
    [trace?.actors]
  );
  const currentStage = trace?.stages.find((stage) => stage.id === trace.binder.stageId);

  const issueTrayLabels = async () => {
    if (!trace || !currentUser) return;
    setIssuing(true);
    setFeedback(null);
    try {
      const response = await mockApi.issueTrayBarcodes(
        trace.binder.id,
        Number(trayCountInput),
        currentUser,
        reason
      );
      if (!response.ok || !response.data) {
        setFeedback({ type: "error", message: response.error?.message || "Could not issue tray labels." });
        return;
      }
      setReason("");
      setBinders((current) =>
        current.map((item) => item.id === trace.binder.id ? response.data!.binder : item)
      );
      setFeedback({
        type: "success",
        message: `${response.data.trays.length} tray labels are registered. Tray-level history starts from label issuance.`,
      });
      setRefreshVersion((version) => version + 1);
    } catch (error) {
      setFeedback({ type: "error", message: error instanceof Error ? error.message : String(error) });
    } finally {
      setIssuing(false);
    }
  };

  const downloadPdf = async () => {
    if (!trace?.trays.length) return;
    setPrinting(true);
    setFeedback(null);
    try {
      const count = trace.trays.length;
      await downloadTrayLabelsA4Pdf(
        trace.trays.map((tray) => ({
          code: tray.barcode,
          trayNumber: tray.trayNumber,
          trayCount: count,
          productName: trace.binder.productName,
          strength: trace.binder.strength,
          lotNo: trace.binder.lotNo,
          batchNo: trace.binder.batchNo,
        })),
        `${trace.binder.batchNo}-tray-labels.pdf`
      );
      setFeedback({ type: "success", message: `A4 PDF created with ${count} scannable tray labels.` });
    } catch (error) {
      setFeedback({ type: "error", message: error instanceof Error ? error.message : String(error) });
    } finally {
      setPrinting(false);
    }
  };

  return (
    <AppLayout screenCode="S08">
      <main className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-4 py-6">
        <header className="flex flex-col gap-4 rounded-xl bg-surface-container-lowest p-6 shadow-sm md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-sm text-on-surface-variant">Binder Details / Tray labels</p>
            <h1 className="mt-1 text-2xl font-semibold text-on-surface">Batch and tray tracking</h1>
          </div>
          <label className="flex min-w-64 flex-col gap-1 text-sm font-medium text-on-surface">
            Select binder / batch
            <select
              value={selectedId}
              onChange={(event) => setSelectedId(event.target.value)}
              disabled={loading || binders.length === 0}
              className="min-h-11 rounded-lg border border-outline-variant bg-surface px-3 text-on-surface"
            >
              {binders.length === 0 && <option value="">No batches available</option>}
              {binders.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.productName} · {item.lotNo} · {item.batchNo}
                </option>
              ))}
            </select>
          </label>
        </header>

        {feedback && (
          <div
            role={feedback.type === "error" ? "alert" : "status"}
            className={`rounded-lg border p-3 text-sm ${
              feedback.type === "error"
                ? "border-error/30 bg-error-container text-on-error-container"
                : "border-emerald-300 bg-emerald-50 text-emerald-900"
            }`}
          >
            {feedback.message}
          </div>
        )}

        {loading ? (
          <section className="rounded-xl bg-surface-container-lowest p-6 text-on-surface-variant">
            Loading batches…
          </section>
        ) : !trace ? (
          <section className="rounded-xl bg-surface-container-lowest p-6 text-on-surface-variant">
            No binder is available. Create a batch first to register its trays.
          </section>
        ) : (
          <>
            <section className="grid gap-4 rounded-xl bg-surface-container-lowest p-6 shadow-sm sm:grid-cols-2 lg:grid-cols-4">
              <div>
                <p className="text-xs uppercase tracking-wide text-on-surface-variant">Product</p>
                <p className="mt-1 font-semibold text-on-surface">{trace.binder.productName}</p>
                <p className="text-sm text-on-surface-variant">{trace.binder.strength}</p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-wide text-on-surface-variant">Lot / Batch</p>
                <p className="mt-1 font-semibold text-on-surface">{trace.binder.lotNo}</p>
                <p className="text-sm text-on-surface-variant">{trace.binder.batchNo}</p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-wide text-on-surface-variant">Tray count</p>
                <p className="mt-1 font-semibold text-on-surface">{trace.trays.length || trace.binder.trayCount || "Not recorded"}</p>
                <p className="text-sm text-on-surface-variant">Each tray moves as an individual record</p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-wide text-on-surface-variant">Batch phase summary</p>
                <p className="mt-1 font-semibold text-on-surface">
                  {trace.binder.stageSummary || currentStage?.name || trace.binder.stageId}
                </p>
                <p className="text-sm text-on-surface-variant">
                  Created {new Date(trace.binder.createdAt).toLocaleString()}
                </p>
              </div>
            </section>

            <section className="rounded-xl bg-surface-container-lowest p-6 shadow-sm">
              <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                <div>
                  <h2 className="text-lg font-semibold text-on-surface">Tray barcode labels</h2>
                  <p className="mt-1 max-w-2xl text-sm text-on-surface-variant">
                    The A4 PDF has one label per tray with both a camera-readable QR code and a Code 128 barcode.
                    The tray count is recorded once; no unit-level movement or quantity calculation is performed.
                  </p>
                </div>
                {trace.trays.length > 0 && (
                  <button
                    type="button"
                    onClick={downloadPdf}
                    disabled={printing}
                    className="min-h-11 rounded-lg bg-primary px-4 py-2 font-semibold text-on-primary disabled:opacity-50"
                  >
                    {printing ? "Creating PDF…" : `Download ${trace.trays.length} tray labels (A4 PDF)`}
                  </button>
                )}
              </div>

              {trace.trays.length > 0 ? (
                <>
                  {trace.binder.unitBarcodes?.length ? (
                    <p className="mt-3 text-xs text-on-surface-variant">
                      This older batch has {trace.binder.unitBarcodes.length} legacy unit codes; they remain lookup-only and are not treated as tray IDs.
                    </p>
                  ) : null}
                  <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                    {trace.trays.map((tray) => {
                      const stage = trace.stages.find((item) => item.id === tray.stageId);
                      const trayEvents = trace.events.filter((event) => event.trayId === tray.id);
                      return (
                        <article key={tray.id} className="rounded-lg border border-outline-variant p-4">
                          <div className="flex items-start justify-between gap-2">
                            <div>
                              <h3 className="font-semibold text-on-surface">Tray {tray.trayNumber} of {trace.trays.length}</h3>
                              <p className="mt-1 font-mono text-xs text-on-surface-variant">{tray.barcode}</p>
                            </div>
                            <span className="rounded-full bg-primary-container/20 px-2 py-1 text-xs font-medium text-primary">
                              {stage?.name || tray.stageId}
                            </span>
                          </div>
                          <div className="mt-3 flex min-h-20 items-center justify-center overflow-hidden rounded bg-white p-2">
                            <BarcodePreview value={tray.barcode} symbology={symbology} />
                          </div>
                          <p className="mt-2 text-xs text-on-surface-variant">
                            Location {tray.locationId || "not recorded"} · Equipment {tray.equipmentId || "not recorded"}
                          </p>
                          <details className="mt-3 border-t border-outline-variant pt-2">
                            <summary className="cursor-pointer text-sm font-medium text-primary">
                              {trayEvents.length} tray movement events
                            </summary>
                            {trayEvents.length ? (
                              <ol className="mt-2 space-y-2">
                                {trayEvents.map((event) => (
                                  <li key={event.id} className="border-l-2 border-primary/30 pl-2 text-xs">
                                    <div className="flex flex-wrap justify-between gap-1">
                                      <strong>{event.type} · {trace.stages.find((item) => item.id === event.stageId)?.name || event.stageId}</strong>
                                      <time>{new Date(event.at).toLocaleString()}</time>
                                    </div>
                                    <p className="mt-1 text-on-surface-variant">
                                      {actorNames.get(event.by) || event.by}
                                      {event.remarks ? ` · ${event.remarks}` : ""}
                                    </p>
                                  </li>
                                ))}
                              </ol>
                            ) : (
                              <p className="mt-2 text-xs text-on-surface-variant">No tray-level movement has been recorded.</p>
                            )}
                          </details>
                        </article>
                      );
                    })}
                  </div>
                </>
              ) : canIssueTrays ? (
                <div className="mt-5 max-w-2xl rounded-lg bg-surface-container-low p-4">
                  <p className="text-sm text-on-surface-variant">
                    This legacy batch has no tray records. Enter its tray count to assign individual barcodes.
                    Individual tray history will begin now; earlier batch history will remain available separately.
                  </p>
                  <div className="mt-3 grid gap-3 sm:grid-cols-2">
                    <label className="flex flex-col gap-1 text-sm font-medium text-on-surface">
                      Number of trays
                      <input
                        type="number"
                        value={trayCountInput}
                        onChange={(event) => setTrayCountInput(event.target.value)}
                        min={1}
                        max={MAX_TRAYS_PER_BATCH}
                        step={1}
                        disabled={trace.binder.trayCount !== undefined}
                        className="min-h-10 rounded-lg border border-outline-variant bg-surface px-3"
                      />
                    </label>
                    <label className="flex flex-col gap-1 text-sm font-medium text-on-surface">
                      Reason for starting tray tracking
                      <input
                        value={reason}
                        onChange={(event) => setReason(event.target.value)}
                        minLength={5}
                        className="min-h-10 rounded-lg border border-outline-variant bg-surface px-3"
                        placeholder="At least 5 characters"
                      />
                    </label>
                  </div>
                  <button
                    type="button"
                    onClick={issueTrayLabels}
                    disabled={issuing || !Number.isSafeInteger(Number(trayCountInput)) || Number(trayCountInput) < 1 || Number(trayCountInput) > MAX_TRAYS_PER_BATCH || reason.trim().length < 5}
                    className="mt-3 min-h-10 rounded-lg bg-primary px-4 font-semibold text-on-primary disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {issuing ? "Registering trays…" : "Register trays and issue barcodes"}
                  </button>
                </div>
              ) : (
                <p className="mt-5 rounded-lg bg-surface-container-low p-4 text-sm text-on-surface-variant">
                  No trays have been registered, and your permissions do not allow issuing tray labels.
                </p>
              )}
            </section>

            <section className="rounded-xl bg-surface-container-lowest p-6 shadow-sm">
              <div className="flex items-center justify-between gap-3">
                <h2 className="text-lg font-semibold text-on-surface">Batch-level history</h2>
                <Link
                  href={`/reports/batch-print?binder=${encodeURIComponent(trace.binder.id)}`}
                  className="text-sm font-semibold text-primary underline"
                >
                  Open complete batch report
                </Link>
              </div>
              {trace.events.filter((event) => !event.trayId).length === 0 ? (
                <p className="mt-3 text-sm text-on-surface-variant">No batch-level events recorded.</p>
              ) : (
                <ol className="mt-4 divide-y divide-outline-variant">
                  {trace.events.filter((event) => !event.trayId).map((event) => (
                    <li key={event.id} className="grid gap-1 py-3 text-sm sm:grid-cols-[12rem_1fr_1fr]">
                      <time className="text-on-surface-variant">{new Date(event.at).toLocaleString()}</time>
                      <span className="font-medium text-on-surface">{event.type}</span>
                      <span className="text-on-surface-variant">
                        By {actorNames.get(event.by) || event.by}
                        {event.remarks ? ` · ${event.remarks}` : ""}
                      </span>
                    </li>
                  ))}
                </ol>
              )}
            </section>
          </>
        )}
      </main>
    </AppLayout>
  );
}
