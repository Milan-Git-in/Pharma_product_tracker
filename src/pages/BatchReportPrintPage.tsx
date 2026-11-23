"use client";

import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { mockApi } from "@/api";
import { Binder, Department, Equipment, HoldRule, Location, MovementEvent, ProductTray, WorkflowStage } from "@/domain/types";

interface BatchTrace {
  binder: Binder;
  trays: ProductTray[];
  events: MovementEvent[];
  stages: WorkflowStage[];
  actors: Array<{ userId: string; fullName: string }>;
}

interface StageRun {
  key: string;
  stageName: string;
  startedAt: string;
  endedAt?: string;
  durationMs?: number;
  locationName: string;
  equipmentCode: string;
  rule?: HoldRule;
  status: "COMPLIANT" | "WARNING" | "EXCEEDED" | "IN PROGRESS" | "NO SOP LIMIT" | "NOT CALCULATED";
}

interface TrayReport {
  tray: ProductTray;
  events: MovementEvent[];
  stageRuns: StageRun[];
  status: string;
}

function getComplianceStatus(stageRuns: StageRun[]): string {
  if (!stageRuns.length) return "NO TIMING DATA";
  if (stageRuns.some((run) => run.status === "EXCEEDED")) return "EXCEEDED";
  if (stageRuns.some((run) => run.status === "WARNING")) return "WARNING";
  if (stageRuns.some((run) => run.status === "NOT CALCULATED")) return "INCOMPLETE TIMING DATA";
  if (stageRuns.some((run) => run.status === "NO SOP LIMIT")) return "NO SOP LIMIT CONFIGURED";
  return "WITHIN LIMIT / IN PROGRESS";
}

function buildStageRuns(
  tray: ProductTray,
  events: MovementEvent[],
  now: number,
  holdRules: HoldRule[],
  stageMap: Map<string, string>,
  locationMap: Map<string, string>,
  equipmentMap: Map<string, string>
): StageRun[] {
  return events
    .map((entry, index) => ({ entry, index }))
    .filter(({ entry }) => entry.type === "STAGE_ENTER" && entry.stageId)
    .map(({ entry, index }) => {
      const stageId = entry.stageId || "";
      const entryTime = Date.parse(entry.at);
      const exit = events.slice(index + 1).find((event) =>
        event.type === "STAGE_EXIT" &&
        event.stageId === stageId
      );
      const activeRun = !exit && tray.stageId === stageId;
      const durationMs = exit?.durationMs ??
        (activeRun && Number.isFinite(entryTime) ? Math.max(0, now - entryTime) : undefined);
      const rule = holdRules.find((candidate) => candidate.startTrigger === `STAGE_ENTER:${stageId}`);
      const limitMs = rule ? rule.limitMinutes * 60_000 : undefined;
      let status: StageRun["status"] = rule ? "NOT CALCULATED" : "NO SOP LIMIT";
      if (rule && durationMs !== undefined && limitMs !== undefined) {
        if (durationMs > limitMs) status = "EXCEEDED";
        else if (activeRun) status = "IN PROGRESS";
        else if (durationMs >= limitMs * rule.warnAtPercent / 100) status = "WARNING";
        else status = "COMPLIANT";
      }

      return {
        key: `${tray.id}-${entry.id}-${index}`,
        stageName: stageMap.get(stageId) || stageId,
        startedAt: entry.at,
        endedAt: exit?.at,
        durationMs,
        locationName: entry.locationName || locationMap.get(entry.locationId || "") || "Not recorded",
        equipmentCode: equipmentMap.get(entry.equipmentId || "") || entry.equipmentId || "Not recorded",
        rule,
        status,
      };
    });
}

function formatTimestamp(value?: string): string {
  if (!value) return "In progress";
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? value : date.toLocaleString();
}

function formatElapsed(milliseconds?: number): string {
  if (milliseconds === undefined || !Number.isFinite(milliseconds)) return "—";
  const minutes = Math.max(0, Math.floor(milliseconds / 60_000));
  const hours = Math.floor(minutes / 60);
  const remainder = minutes % 60;
  return `${hours}h ${String(remainder).padStart(2, "0")}m`;
}

function formatLimit(minutes?: number): string {
  return minutes === undefined ? "Not configured" : formatElapsed(minutes * 60_000);
}

export default function BatchReportPrintPage() {
  const [binders, setBinders] = useState<Binder[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [locations, setLocations] = useState<Location[]>([]);
  const [equipment, setEquipment] = useState<Equipment[]>([]);
  const [holdRules, setHoldRules] = useState<HoldRule[]>([]);
  const [selectedBinderId, setSelectedBinderId] = useState("");
  const [trace, setTrace] = useState<BatchTrace | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [clock, setClock] = useState(Date.now());

  useEffect(() => {
    const timer = window.setInterval(() => setClock(Date.now()), 30_000);
    return () => window.clearInterval(timer);
  }, []);

  useEffect(() => {
    let active = true;
    Promise.all([
      mockApi.getBinders(),
      mockApi.getMasters(),
      mockApi.getEquipment(),
      mockApi.getHoldRules(),
    ])
      .then(([bindersResponse, mastersResponse, equipmentResponse, holdRulesResponse]) => {
        if (!active) return;
        if (!bindersResponse.ok || !bindersResponse.data) {
          setError(bindersResponse.error?.message || "Could not load product batches.");
          return;
        }
        if (!mastersResponse.ok || !mastersResponse.data) {
          setError(mastersResponse.error?.message || "Could not load departments and locations.");
          return;
        }
        if (!equipmentResponse.ok || !equipmentResponse.data) {
          setError(equipmentResponse.error?.message || "Could not load equipment.");
          return;
        }
        if (!holdRulesResponse.ok || !holdRulesResponse.data) {
          setError(holdRulesResponse.error?.message || "Could not load SOP hold-time rules.");
          return;
        }
        setBinders(bindersResponse.data);
        setDepartments(mastersResponse.data.departments);
        setLocations(mastersResponse.data.locations);
        setEquipment(equipmentResponse.data);
        setHoldRules(holdRulesResponse.data.filter((rule) => rule.active));

        const requestedBinderId = new URLSearchParams(window.location.search).get("binder");
        setSelectedBinderId(
          bindersResponse.data.some((binder) => binder.id === requestedBinderId)
            ? requestedBinderId || ""
            : bindersResponse.data[0]?.id || ""
        );
      })
      .catch((loadError: unknown) => {
        console.error("Could not load batch report data:", loadError);
        if (active) setError("Could not load the batch report. Please reload and try again.");
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    if (!selectedBinderId) {
      setTrace(null);
      return;
    }

    let active = true;
    setTrace(null);
    mockApi.getBinderTrace(selectedBinderId)
      .then((response) => {
        if (!active) return;
        if (!response.ok || !response.data) {
          setError(response.error?.message || "Could not load the selected batch history.");
          return;
        }
        setError("");
        setTrace(response.data);
      })
      .catch((traceError: unknown) => {
        console.error("Could not load batch trace:", traceError);
        if (active) setError("Could not load the selected batch history.");
      });

    return () => {
      active = false;
    };
  }, [selectedBinderId]);

  const stageMap = useMemo(
    () => new Map(trace?.stages.map((stage) => [stage.id, stage.name]) || []),
    [trace?.stages]
  );
  const actorMap = useMemo(
    () => new Map(trace?.actors.map((actor) => [actor.userId, actor.fullName]) || []),
    [trace?.actors]
  );
  const locationMap = useMemo(
    () => new Map(locations.map((location) => [location.id, location.name])),
    [locations]
  );
  const equipmentMap = useMemo(
    () => new Map(equipment.map((item) => [item.id, item.code])),
    [equipment]
  );

  const trayReports = useMemo<TrayReport[]>(() => {
    if (!trace) return [];
    return (trace.trays || []).map((tray) => {
      const events = trace.events.filter((event) => event.trayId === tray.id);
      const stageRuns = buildStageRuns(
        tray,
        events,
        clock,
        holdRules,
        stageMap,
        locationMap,
        equipmentMap
      );
      return { tray, events, stageRuns, status: getComplianceStatus(stageRuns) };
    });
  }, [clock, equipmentMap, holdRules, locationMap, stageMap, trace]);

  const overallStatus = trayReports.length === 0
    ? "NO TRAY TRACKING"
    : trayReports.some((report) => report.status === "EXCEEDED")
      ? "EXCEEDED"
      : trayReports.some((report) => report.status === "WARNING")
        ? "WARNING"
        : trayReports.some((report) =>
            report.status === "INCOMPLETE TIMING DATA" || report.status === "NO TIMING DATA"
          )
          ? "INCOMPLETE TIMING DATA"
          : trayReports.some((report) => report.status === "NO SOP LIMIT CONFIGURED")
            ? "NO SOP LIMIT CONFIGURED"
            : "WITHIN LIMIT / IN PROGRESS";
  const currentStage = trace?.stages.find((stage) => stage.id === trace.binder.stageId);
  const department = trace ? departments.find((item) => item.id === trace.binder.departmentId) : undefined;
  const currentLocation = trace
    ? locationMap.get(trace.binder.locationId || trace.binder.coldRoomId || trace.binder.areaId || "")
    : undefined;
  const currentEquipment = trace ? equipmentMap.get(trace.binder.equipmentId || "") : undefined;

  return (
    <div className="min-h-screen bg-surface-container-high text-on-surface">
      <style jsx global>{`
        @media print {
          body { background: white !important; }
          .no-print { display: none !important; }
          .print-sheet { max-width: none !important; border: 0 !important; box-shadow: none !important; padding: 0 !important; }
          .print-break { break-inside: avoid; }
        }
      `}</style>

      <header className="no-print sticky top-0 z-20 flex flex-wrap items-center justify-between gap-3 border-b border-outline-variant bg-surface-container-lowest px-4 py-3 shadow-sm">
        <div>
          <p className="font-mono text-xs font-semibold text-primary">S15 · BATCH REPORT</p>
          <h1 className="text-lg font-bold">Batch movement and SOP report</h1>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Link href="/reports" className="inline-flex min-h-10 items-center rounded-lg border border-outline-variant px-3 text-sm font-semibold">Reports</Link>
          <Link href="/binders/new" className="inline-flex min-h-10 items-center rounded-lg border border-outline-variant px-3 text-sm font-semibold">Create batch</Link>
          <button type="button" onClick={() => window.print()} disabled={!trace} className="min-h-10 rounded-lg bg-primary px-4 text-sm font-semibold text-on-primary disabled:opacity-50">
            Print / Save as PDF
          </button>
        </div>
      </header>

      <main className="mx-auto max-w-6xl space-y-5 p-4 sm:p-6">
        <div className="no-print rounded-xl border border-outline-variant/50 bg-surface-container-lowest p-4">
          <label className="block text-xs font-semibold uppercase tracking-wide text-on-surface-variant" htmlFor="batch-select">
            Select product / batch
          </label>
          <select
            id="batch-select"
            className="mt-2 min-h-11 w-full rounded-lg border border-outline-variant bg-surface-container-lowest px-3 text-sm text-on-surface sm:max-w-2xl"
            value={selectedBinderId}
            onChange={(event) => setSelectedBinderId(event.target.value)}
            disabled={loading || binders.length === 0}
          >
            <option value="">{loading ? "Loading batches..." : binders.length ? "Select a batch" : "No batches available"}</option>
            {binders.map((binder) => (
              <option key={binder.id} value={binder.id}>
                {binder.productName} · Lot {binder.lotNo} · Batch {binder.batchNo}
              </option>
            ))}
          </select>
        </div>

        {error && <div role="alert" className="rounded-lg bg-error-container/50 p-4 text-sm text-on-error-container">{error}</div>}
        {loading && <p className="text-sm text-on-surface-variant">Loading batch records…</p>}
        {!loading && binders.length === 0 && !error && (
          <div className="rounded-xl border border-outline-variant bg-surface-container-lowest p-6 text-sm text-on-surface-variant">
            No product batches exist yet. Create a batch to start its movement and hold-time record.
          </div>
        )}
        {selectedBinderId && !trace && !error && !loading && (
          <p className="text-sm text-on-surface-variant">Loading selected batch trace…</p>
        )}

        {trace && (
          <article className="print-sheet mx-auto max-w-5xl space-y-5 rounded-xl border border-outline-variant bg-white p-5 shadow-sm sm:p-8">
            <div className="flex flex-wrap items-start justify-between gap-4 border-b border-outline-variant pb-4">
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-primary">Prototype batch tracking dossier</p>
                <h2 className="mt-1 text-xl font-bold">Batch movement &amp; hold-time report</h2>
                <p className="mt-1 text-xs text-on-surface-variant">
                  Prototype only — not validated for GMP, regulatory, or production use.
                </p>
              </div>
              <div className="text-right text-xs text-on-surface-variant">
                <div>Generated: {new Date(clock).toLocaleString()}</div>
                <div>Batch record: {trace.binder.id}</div>
                <div>Compliance summary: <strong>{overallStatus}</strong></div>
              </div>
            </div>

            <section className="print-break">
              <h3 className="mb-3 text-sm font-bold uppercase tracking-wide">Batch identity and custody</h3>
              <dl className="grid gap-3 sm:grid-cols-3">
                {[
                  ["Product", trace.binder.productName],
                  ["Strength", trace.binder.strength],
                  ["Product code", trace.binder.productCode || "Not recorded"],
                  ["Lot number", trace.binder.lotNo],
                  ["Batch number", trace.binder.batchNo],
                  ["Batch size", trace.binder.batchSize || "Not recorded"],
                  ["QR / barcode", trace.binder.barcode || "Not issued"],
                  ["Tray count", String(trace.trays?.length || trace.binder.trayCount || 0)],
                  ["Department", department?.name || "Not recorded"],
                  ["Created by", actorMap.get(trace.binder.createdBy) || trace.binder.createdBy],
                  ["Created at", formatTimestamp(trace.binder.createdAt)],
                  ["Current tray phases", trace.binder.stageSummary || currentStage?.name || trace.binder.stageId],
                  ["Current location / equipment", trace.trays?.length
                    ? "Varies by tray; see individual tray records below"
                    : `${currentLocation || "Not recorded"} · ${currentEquipment || "Not recorded"}`],
                ].map(([label, value]) => (
                  <div key={label} className="rounded-lg bg-surface-container-low p-3">
                    <dt className="text-[11px] font-semibold uppercase text-on-surface-variant">{label}</dt>
                    <dd className="mt-1 break-words text-sm font-medium">{value}</dd>
                  </div>
                ))}
              </dl>
            </section>

            <section className="print-break">
              <div className="mb-3">
                <h3 className="text-sm font-bold uppercase tracking-wide">Individual tray movement and compliance records</h3>
                <p className="mt-1 text-xs text-on-surface-variant">
                  Each tray is evaluated independently. Batch compliance reflects the highest-risk tray; active stage durations are calculated through report generation.
                </p>
              </div>
              {trayReports.length === 0 ? (
                <p className="rounded-lg bg-surface-container-low p-4 text-sm text-on-surface-variant">
                  This batch has no registered trays. Tray-level timing and compliance cannot be calculated.
                </p>
              ) : (
                <div className="space-y-5">
                  {trayReports.map(({ tray, events, stageRuns, status }) => (
                    <section key={tray.id} className="print-break rounded-lg border border-outline-variant p-3">
                      <div className="flex flex-wrap items-start justify-between gap-2">
                        <div>
                          <h4 className="font-bold">Tray {tray.trayNumber}</h4>
                          <p className="font-mono text-xs text-on-surface-variant">{tray.barcode}</p>
                        </div>
                        <strong className="rounded bg-surface-container-low px-2 py-1 text-xs">{status}</strong>
                      </div>
                      <dl className="mt-3 grid gap-2 text-xs sm:grid-cols-3">
                        <div><dt className="text-on-surface-variant">Current phase</dt><dd className="font-semibold">{stageMap.get(tray.stageId) || tray.stageId}</dd></div>
                        <div><dt className="text-on-surface-variant">Current location</dt><dd className="font-semibold">{locationMap.get(tray.locationId || "") || "Not recorded"}</dd></div>
                        <div><dt className="text-on-surface-variant">Current equipment</dt><dd className="font-semibold">{equipmentMap.get(tray.equipmentId || "") || "Not recorded"}</dd></div>
                      </dl>

                      <h5 className="mb-2 mt-4 text-xs font-bold uppercase tracking-wide">Stage timing and SOP limits</h5>
                      {stageRuns.length === 0 ? (
                        <p className="rounded bg-surface-container-low p-3 text-xs text-on-surface-variant">No stage timing events have been recorded for this tray.</p>
                      ) : (
                        <div className="overflow-x-auto rounded border border-outline-variant">
                          <table className="w-full min-w-[760px] border-collapse text-left text-xs">
                            <thead className="bg-surface-container-low">
                              <tr>
                                <th className="p-2">Phase</th>
                                <th className="p-2">Location / equipment</th>
                                <th className="p-2">Entered</th>
                                <th className="p-2">Exited</th>
                                <th className="p-2">Elapsed</th>
                                <th className="p-2">SOP limit</th>
                                <th className="p-2">Status</th>
                              </tr>
                            </thead>
                            <tbody>
                              {stageRuns.map((run) => (
                                <tr key={run.key} className="border-t border-outline-variant align-top">
                                  <td className="p-2 font-semibold">{run.stageName}</td>
                                  <td className="p-2">{run.locationName} · {run.equipmentCode}</td>
                                  <td className="p-2">{formatTimestamp(run.startedAt)}</td>
                                  <td className="p-2">{formatTimestamp(run.endedAt)}</td>
                                  <td className="p-2 font-mono">{formatElapsed(run.durationMs)}</td>
                                  <td className="p-2">{formatLimit(run.rule?.limitMinutes)}</td>
                                  <td className="p-2 font-semibold">{run.status}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      )}

                      <h5 className="mb-2 mt-4 text-xs font-bold uppercase tracking-wide">Movement and remarks ledger</h5>
                      {events.length === 0 ? (
                        <p className="rounded bg-surface-container-low p-3 text-xs text-on-surface-variant">No movement events have been recorded for this tray.</p>
                      ) : (
                        <div className="overflow-x-auto rounded border border-outline-variant">
                          <table className="w-full min-w-[850px] border-collapse text-left text-xs">
                            <thead className="bg-surface-container-low">
                              <tr>
                                <th className="p-2">Timestamp</th>
                                <th className="p-2">Event / phase</th>
                                <th className="p-2">Location / equipment</th>
                                <th className="p-2">Actor</th>
                                <th className="p-2">Elapsed</th>
                                <th className="p-2">Remarks</th>
                              </tr>
                            </thead>
                            <tbody>
                              {events.map((event) => (
                                <tr key={event.id} className="border-t border-outline-variant align-top">
                                  <td className="whitespace-nowrap p-2">{formatTimestamp(event.at)}</td>
                                  <td className="p-2">
                                    {event.type}
                                    {event.stageId ? ` · ${stageMap.get(event.stageId) || event.stageId}` : ""}
                                    {event.from || event.to ? ` · ${event.from || "—"} → ${event.to || "—"}` : ""}
                                  </td>
                                  <td className="p-2">
                                    {event.locationName || locationMap.get(event.locationId || "") || "Not recorded"}
                                    {" · "}
                                    {equipmentMap.get(event.equipmentId || "") || event.equipmentId || "Not recorded"}
                                  </td>
                                  <td className="p-2">{actorMap.get(event.by) || event.by}</td>
                                  <td className="p-2 font-mono">{formatElapsed(event.durationMs)}</td>
                                  <td className="min-w-40 whitespace-pre-wrap p-2">{event.remarks || "—"}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      )}
                    </section>
                  ))}
                </div>
              )}
            </section>
          </article>
        )}
      </main>
    </div>
  );
}
