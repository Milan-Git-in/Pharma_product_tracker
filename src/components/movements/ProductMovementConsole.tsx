"use client";

import React, { FormEvent, useEffect, useMemo, useRef, useState } from "react";
import QRCode from "qrcode";
import { BrowserQRCodeReader, IScannerControls } from "@zxing/browser";
import { ChecksumException, FormatException, NotFoundException } from "@zxing/library";
import { Binder, Equipment, Location, MovementEvent, ProductTray, Role, WorkflowStage } from "@/domain/types";
import { mockApi } from "@/api";
import { can } from "@/services/permission";
import { useSession } from "@/services/session";

interface ProductTrace {
  binder: Binder;
  trays: ProductTray[];
  events: MovementEvent[];
  stages: WorkflowStage[];
  actors: Array<{ userId: string; fullName: string }>;
}

function formatElapsed(milliseconds: number): string {
  const totalMinutes = Math.max(0, Math.floor(milliseconds / 60_000));
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  return hours > 0 ? `${hours}h ${minutes}m` : `${minutes}m`;
}

function formatTimestamp(value: string): string {
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? value : date.toLocaleString();
}

export default function ProductMovementConsole() {
  const { currentUser, currentRole } = useSession();
  const videoRef = useRef<HTMLVideoElement>(null);
  const scannerControlsRef = useRef<IScannerControls | null>(null);
  const [barcode, setBarcode] = useState("");
  const [trace, setTrace] = useState<ProductTrace | null>(null);
  const [selectedTrayId, setSelectedTrayId] = useState("");
  const [demoBinders, setDemoBinders] = useState<Binder[]>([]);
  const [locations, setLocations] = useState<Location[]>([]);
  const [equipment, setEquipment] = useState<Equipment[]>([]);
  const [qrDataUrl, setQrDataUrl] = useState("");
  const [nextStageId, setNextStageId] = useState("");
  const [locationId, setLocationId] = useState("");
  const [equipmentId, setEquipmentId] = useState("");
  const [remarks, setRemarks] = useState("");
  const [error, setError] = useState("");
  const [cameraError, setCameraError] = useState("");
  const [cameraStatus, setCameraStatus] = useState<"idle" | "starting" | "scanning">("idle");
  const [busy, setBusy] = useState(false);
  const [clock, setClock] = useState(Date.now());

  const stageMap = useMemo(
    () => new Map(trace?.stages.map((stage) => [stage.id, stage.name]) || []),
    [trace?.stages]
  );
  const actorMap = useMemo(
    () => new Map(trace?.actors.map((actor) => [actor.userId, actor.fullName]) || []),
    [trace?.actors]
  );
  const equipmentMap = useMemo(
    () => new Map(equipment.map((item) => [item.id, item.code])),
    [equipment]
  );
  const equipmentOptions = equipment.filter((item) => item.active && item.locationId === locationId);
  const selectedTray = trace?.trays.find((tray) => tray.id === selectedTrayId);
  const currentStage = selectedTray && trace
    ? trace.stages.find((stage) => stage.id === selectedTray.stageId)
    : undefined;
  const allowedNextStages = (selectedTray ? currentStage?.nextStageIds || [] : [])
    .map((id) => trace?.stages.find((stage) => stage.id === id))
    .filter((stage): stage is WorkflowStage => Boolean(stage))
    .filter((stage) => currentRole === "ADMIN" || stage.allowedRoles.includes("INITIATOR"));
  const canMove =
    !!currentUser &&
    (currentRole === "ADMIN" || currentRole === "INITIATOR") &&
    can(currentUser, "movement.perform");
  const canIssueBarcode =
    !!currentUser && currentRole === "ADMIN" && can(currentUser, "barcode.manage");

  const lastStageEntry = trace?.events
    .filter((event) => event.trayId === selectedTrayId && event.type === "STAGE_ENTER" && event.stageId === selectedTray?.stageId)
    .sort((a, b) => Date.parse(b.at) - Date.parse(a.at))[0];
  const currentStageStartedAt = lastStageEntry?.at || selectedTray?.updatedAt;
  const currentStageElapsed = currentStageStartedAt
    ? formatElapsed(clock - Date.parse(currentStageStartedAt))
    : "—";

  useEffect(() => {
    const timer = window.setInterval(() => setClock(Date.now()), 1000);
    return () => window.clearInterval(timer);
  }, []);

  useEffect(() => () => {
    scannerControlsRef.current?.stop();
    const stream = videoRef.current?.srcObject as MediaStream | null;
    stream?.getTracks().forEach((track) => track.stop());
  }, []);

  useEffect(() => {
    let active = true;
    Promise.all([mockApi.getBinders(), mockApi.getMasters(), mockApi.getEquipment()])
      .then(([bindersResponse, mastersResponse, equipmentResponse]) => {
        if (!active) return;
        if (bindersResponse.ok && bindersResponse.data) setDemoBinders(bindersResponse.data);
        else setError(bindersResponse.error?.message || "Could not load products for scanning.");
        if (!mastersResponse.ok || !mastersResponse.data) {
          setError(mastersResponse.error?.message || "Could not load movement locations.");
          return;
        }
        if (!equipmentResponse.ok || !equipmentResponse.data) {
          setError(equipmentResponse.error?.message || "Could not load movement equipment.");
          return;
        }
        setLocations(mastersResponse.data.locations.filter((item) => item.active));
        setEquipment(equipmentResponse.data.filter((item) => item.active));
      })
      .catch((loadError: unknown) => {
        console.error("Could not load movement options:", loadError);
        if (active) setError("Could not load movement options. Please reload and try again.");
      });
    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    if (!trace || !locationId) return;
    const selectedEquipment = equipment.find((item) =>
      item.active && item.id === equipmentId && item.locationId === locationId
    );
    if (!selectedEquipment) {
      setEquipmentId(equipment.find((item) => item.active && item.locationId === locationId)?.id || "");
    }
  }, [equipment, equipmentId, locationId, trace]);

  useEffect(() => {
    let active = true;
    const barcodeToRender = selectedTray?.barcode || trace?.binder.barcode;
    if (!barcodeToRender) {
      setQrDataUrl("");
      return;
    }

    QRCode.toDataURL(barcodeToRender, { width: 220, margin: 1 })
      .then((dataUrl) => {
        if (active) setQrDataUrl(dataUrl);
      })
      .catch((qrError: unknown) => {
        console.error("Failed to render product QR code:", qrError);
        if (active) setError("The product was found, but its QR label could not be rendered.");
      });

    return () => {
      active = false;
    };
  }, [selectedTray?.barcode, trace?.binder.barcode]);

  const loadTrace = async (binderId: string, trayId?: string) => {
    const response = await mockApi.getBinderTrace(binderId);
    if (!response.ok || !response.data) {
      setTrace(null);
      setSelectedTrayId("");
      setError(response.error?.message || "Could not load product movement history.");
      return;
    }
    const traceData = response.data;
    const targetTray = trayId ? traceData.trays.find((item) => item.id === trayId) : undefined;
    if (trayId && !targetTray) {
      setTrace(null);
      setSelectedTrayId("");
      setError("The scanned tray is not registered to this batch.");
      return;
    }
    setTrace(traceData);
    setSelectedTrayId(targetTray?.id || "");
    const activeStage = traceData.stages.find((stage) => stage.id === (targetTray?.stageId || traceData.binder.stageId));
    const firstAllowedNext = activeStage?.nextStageIds
      .map((id) => traceData.stages.find((stage) => stage.id === id))
      .find((stage) => stage && (currentRole === "ADMIN" || stage.allowedRoles.includes("INITIATOR")));
    setNextStageId(firstAllowedNext?.id || "");
    const initialLocationId =
      targetTray?.locationId ||
      traceData.binder.locationId ||
      traceData.binder.coldRoomId ||
      traceData.binder.areaId ||
      locations[0]?.id ||
      "";
    setLocationId(initialLocationId);
    setEquipmentId(
      equipment.find((item) => item.id === (targetTray?.equipmentId || traceData.binder.equipmentId) && item.locationId === initialLocationId)?.id ||
      equipment.find((item) => item.active && item.locationId === initialLocationId)?.id ||
      ""
    );
    setRemarks("");
    setError("");
  };

  const findProductByCode = async (scannedCode: string) => {
    if (!scannedCode) {
      setError("Scan or enter a product QR/barcode first.");
      return;
    }

    setBusy(true);
    setError("");
    try {
      const response = await mockApi.resolveBarcode(scannedCode);
      if (!response.ok || !response.data?.found) {
        setTrace(null);
        setSelectedTrayId("");
        setError(response.error?.message || `No product matches "${scannedCode}".`);
        return;
      }

      let binder: Binder | undefined;
      if (response.data.entityType === "TRAY") {
        const tray = response.data.entity as ProductTray;
        if (!tray?.id || !tray.binderId) {
          setTrace(null);
          setError("The scanned barcode is not linked to a valid tray record.");
          return;
        }
        await loadTrace(tray.binderId, tray.id);
        return;
      } else if (response.data.entityType === "BINDER") {
        binder = response.data.entity as Binder;
      } else if (response.data.entityType === "PALLET") {
        const binders = await mockApi.getBinders();
        if (binders.ok && binders.data) {
          binder = binders.data.find((item) => item.palletId === response.data?.entity?.id);
        }
      }

      if (!binder) {
        setTrace(null);
        setSelectedTrayId("");
        setError("This code is not linked to one product batch. Scan its product label instead.");
        return;
      }

      await loadTrace(binder.id);
    } catch (scanError) {
      console.error("Product scan failed:", scanError);
      setTrace(null);
      setSelectedTrayId("");
      setError("The scan could not be completed. Please try again.");
    } finally {
      setBusy(false);
    }
  };

  const handleScan = async (event: FormEvent) => {
    event.preventDefault();
    await findProductByCode(barcode.trim());
  };

  const stopCameraScan = () => {
    scannerControlsRef.current?.stop();
    scannerControlsRef.current = null;
    const stream = videoRef.current?.srcObject as MediaStream | null;
    stream?.getTracks().forEach((track) => track.stop());
    if (videoRef.current) videoRef.current.srcObject = null;
    setCameraStatus("idle");
  };

  const startCameraScan = async () => {
    if (!navigator.mediaDevices?.getUserMedia) {
      setCameraError("Camera scanning requires camera access on HTTPS or localhost. Use manual entry or a USB scanner instead.");
      return;
    }

    if (!videoRef.current) {
      setCameraError("The camera preview is unavailable. Reload the page and try again.");
      return;
    }

    setCameraError("");
    setError("");
    setCameraStatus("starting");
    let scanCompleted = false;

    try {
      const reader = new BrowserQRCodeReader();
      const controls = await reader.decodeFromVideoDevice(
        undefined,
        videoRef.current,
        (result, scanError, callbackControls) => {
          if (result && !scanCompleted) {
            scanCompleted = true;
            callbackControls.stop();
            scannerControlsRef.current = null;
            const scannedCode = result.getText().trim();
            setCameraStatus("idle");
            setBarcode(scannedCode);
            void findProductByCode(scannedCode);
            return;
          }

          const isExpectedDecodeMiss =
            scanError instanceof NotFoundException ||
            scanError instanceof ChecksumException ||
            scanError instanceof FormatException;
          if (scanError && !isExpectedDecodeMiss && !scanCompleted) {
            scanCompleted = true;
            console.error("Camera QR scanning stopped unexpectedly:", scanError);
            callbackControls.stop();
            scannerControlsRef.current = null;
            setCameraStatus("idle");
            setCameraError("Camera scanning stopped unexpectedly. Check the camera connection and browser permission, then try again.");
          }
        }
      );

      if (scanCompleted) {
        controls.stop();
      } else {
        scannerControlsRef.current = controls;
        setCameraStatus("scanning");
      }
    } catch (cameraStartError) {
      console.error("Could not start camera QR scanner:", cameraStartError);
      stopCameraScan();
      const detail = cameraStartError instanceof Error ? cameraStartError.message : "Camera access was denied or unavailable.";
      setCameraError(`Could not start the camera: ${detail}`);
    }
  };

  const handleMove = async (event: FormEvent) => {
    event.preventDefault();
    if (!trace || !currentUser || !canMove) return;
    if (!selectedTray) {
      setError("Scan an individual tray barcode before recording a movement.");
      return;
    }
    if (!nextStageId) {
      setError("Select a valid next product phase.");
      return;
    }
    if (!locationId || !equipmentId) {
      setError("Select the movement location and equipment.");
      return;
    }

    setBusy(true);
    setError("");
    try {
      const response = await mockApi.moveTray(
        selectedTray.id,
        nextStageId,
        currentUser,
        currentRole as Role,
        remarks,
        locationId,
        equipmentId
      );
      if (!response.ok || !response.data) {
        setError(response.error?.message || "The product movement was not saved.");
        return;
      }
      await loadTrace(trace.binder.id, selectedTray.id);
    } catch (moveError) {
      console.error("Product movement failed:", moveError);
      setError("The movement could not be saved. Please try again.");
    } finally {
      setBusy(false);
    }
  };

  const handleIssueBarcode = async () => {
    if (!trace || !currentUser || !canIssueBarcode) return;
    setBusy(true);
    setError("");
    try {
      const response = await mockApi.issueBinderBarcode(
        trace.binder.id,
        currentUser,
        "Issue product QR label for live movement tracking"
      );
      if (!response.ok || !response.data) {
        setError(response.error?.message || "Could not issue a QR label.");
        return;
      }
      setBarcode(response.data.binder.barcode || "");
      await loadTrace(response.data.binder.id, selectedTray?.id);
    } catch (issueError) {
      console.error("Product QR issuance failed:", issueError);
      setError("The QR label could not be issued. Please try again.");
    } finally {
      setBusy(false);
    }
  };

  const visibleEvents = [...(trace?.events || [])]
    .filter((event) => event.trayId === selectedTrayId)
    .reverse();

  return (
    <section className="mb-6 rounded-xl border border-outline-variant/50 bg-surface-container-lowest p-5 shadow-sm">
      <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="flex items-center gap-2 text-lg font-bold text-on-surface">
            <span className="material-symbols-outlined text-primary">qr_code_scanner</span>
            Scan &amp; Track Product
          </h2>
          <p className="mt-1 text-sm text-on-surface-variant">
            Scan a QR code with your camera or USB reader, or enter a product code to open its live batch trace.
          </p>
        </div>
        <span className="rounded-full bg-secondary-container/50 px-3 py-1 text-xs font-semibold text-on-secondary-container">
          Movement enabled for Admin and Initiator
        </span>
      </div>

      <form onSubmit={handleScan} className="flex flex-col gap-2 sm:flex-row">
        <input
          autoComplete="off"
          autoFocus
          value={barcode}
          onChange={(event) => setBarcode(event.target.value)}
          aria-label="Product QR or barcode"
          placeholder="Scan or enter a product barcode, e.g. BND-26-00001"
          className="min-h-12 flex-1 rounded-lg border border-outline-variant/60 bg-surface-container-low px-4 font-mono text-sm font-semibold text-on-surface focus:border-primary focus:outline-none"
        />
        <button
          type="submit"
          disabled={busy}
          className="min-h-12 rounded-lg bg-primary-container px-5 font-semibold text-on-primary-container disabled:opacity-50"
        >
          {busy ? "Working..." : "Find Product"}
        </button>
      </form>

      <div className="mt-3 flex flex-wrap items-center gap-3">
        <button
          type="button"
          onClick={cameraStatus === "scanning" ? stopCameraScan : startCameraScan}
          disabled={busy || cameraStatus === "starting"}
          className="min-h-10 rounded-lg border border-primary/40 px-4 text-sm font-semibold text-primary hover:bg-surface-container-low disabled:opacity-50"
        >
          {cameraStatus === "starting" ? "Starting camera..." : cameraStatus === "scanning" ? "Stop camera" : "Scan with camera"}
        </button>
        <span className="text-xs text-on-surface-variant">
          Allow camera access, then hold the product QR code in view.
        </span>
      </div>

      <div className={cameraStatus === "idle" ? "hidden" : "mt-3 max-w-lg rounded-lg border border-outline-variant/50 p-2"}>
        <video
          ref={videoRef}
          autoPlay
          muted
          playsInline
          aria-label="Live camera preview for QR scanning"
          className="aspect-video w-full rounded-md bg-black object-contain"
        />
        {cameraStatus === "scanning" && (
          <p className="mt-2 text-center text-xs text-on-surface-variant">Point the camera at the QR code on your phone.</p>
        )}
      </div>

      {cameraError && (
        <p role="alert" className="mt-3 rounded-lg bg-error-container/40 p-3 text-sm text-on-error-container">
          {cameraError}
        </p>
      )}

      {demoBinders.length > 0 && (
        <div className="mt-3 flex flex-wrap items-center gap-2">
          <span className="text-xs font-semibold text-on-surface-variant">Demo product labels:</span>
          {demoBinders.filter((binder) => binder.barcode).slice(0, 6).map((binder) => (
            <button
              key={binder.id}
              type="button"
              onClick={() => setBarcode(binder.barcode || "")}
              className="rounded border border-outline-variant/50 px-2 py-1 font-mono text-xs text-primary hover:bg-surface-container-low"
            >
              {binder.barcode}
            </button>
          ))}
          <span className="text-xs text-on-surface-variant">Select one, then click Find Product.</span>
        </div>
      )}

      {error && (
        <p role="alert" className="mt-3 rounded-lg bg-error-container/40 p-3 text-sm text-on-error-container">
          {error}
          {trace && !trace.binder.barcode && canIssueBarcode && (
            <button type="button" onClick={handleIssueBarcode} disabled={busy} className="ml-2 underline">
              Generate product QR label
            </button>
          )}
        </p>
      )}

      {trace && (
        <div className="mt-5 grid gap-5 xl:grid-cols-[minmax(0,1.4fr)_minmax(240px,0.6fr)]">
          <div className="min-w-0">
            <div className="rounded-lg bg-surface-container-low p-4">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-primary">Product batch found</p>
                  <h3 className="mt-1 text-lg font-bold text-on-surface">{trace.binder.productName}</h3>
                  <p className="mt-1 font-mono text-sm text-on-surface-variant">
                    Lot {trace.binder.lotNo} · Batch {trace.binder.batchNo}
                  </p>
                  {selectedTray && (
                    <p className="mt-1 font-mono text-xs font-semibold text-primary">
                      Tray {selectedTray.trayNumber} of {trace.trays.length} · {selectedTray.barcode}
                    </p>
                  )}
                </div>
                <span className="rounded-full bg-primary-container/20 px-3 py-1 text-sm font-semibold text-primary">
                  {selectedTray
                    ? currentStage?.name || selectedTray.stageId
                    : trace.binder.stageSummary || currentStage?.name || trace.binder.stageId}
                </span>
              </div>
              <div className="mt-4 grid gap-3 sm:grid-cols-3">
                <div className="rounded-md bg-surface-container-lowest p-3">
                  <span className="block text-xs text-on-surface-variant">Current phase duration</span>
                  <strong className="mt-1 block font-mono text-base text-on-surface">{currentStageElapsed}</strong>
                </div>
                <div className="rounded-md bg-surface-container-lowest p-3">
                  <span className="block text-xs text-on-surface-variant">Phase started</span>
                  <strong className="mt-1 block text-sm text-on-surface">
                    {currentStageStartedAt ? formatTimestamp(currentStageStartedAt) : "Not recorded"}
                  </strong>
                </div>
                <div className="rounded-md bg-surface-container-lowest p-3">
                  <span className="block text-xs text-on-surface-variant">Last updated</span>
                  <strong className="mt-1 block text-sm text-on-surface">{formatTimestamp(trace.binder.updatedAt)}</strong>
                </div>
                <div className="rounded-md bg-surface-container-lowest p-3 sm:col-span-3">
                  <span className="block text-xs text-on-surface-variant">Current location · equipment</span>
                  <strong className="mt-1 block text-sm text-on-surface">
                    {selectedTray ? (
                      <>
                        {locations.find((item) => item.id === selectedTray.locationId)?.name || "Not recorded"}
                        {" · "}
                        {equipmentMap.get(selectedTray.equipmentId || "") || "Not recorded"}
                      </>
                    ) : trace.trays.length > 0 ? (
                      "Scan a tray barcode to view its current custody."
                    ) : (
                      <>
                        {locations.find((item) => item.id === trace.binder.locationId)?.name || "Not recorded"}
                        {" · "}
                        {equipmentMap.get(trace.binder.equipmentId || "") || "Not recorded"}
                      </>
                    )}
                  </strong>
                </div>
              </div>
            </div>

            <div className="mt-4 rounded-lg border border-outline-variant/40 p-4">
              <div className="mb-3 flex items-center justify-between gap-2">
                <h4 className="font-semibold text-on-surface">Tray movement history</h4>
                <span className="text-xs text-on-surface-variant">{visibleEvents.length} recorded events</span>
              </div>
              {!selectedTray ? (
                <p className="text-sm text-on-surface-variant">
                  Scan a tray barcode to view its timeline and record a movement. Batch and legacy unit codes identify the batch only.
                </p>
              ) : visibleEvents.length === 0 ? (
                <p className="text-sm text-on-surface-variant">No movement events have been recorded for this batch.</p>
              ) : (
                <ol className="space-y-3">
                  {visibleEvents.map((event) => {
                    const stageName = event.stageId ? stageMap.get(event.stageId) || event.stageId : "Product";
                    const elapsed = event.durationMs !== undefined
                      ? formatElapsed(event.durationMs)
                      : event.type === "STAGE_EXIT"
                        ? "Duration not available"
                        : "";
                    return (
                      <li key={event.id} className="border-l-2 border-primary/30 pl-3">
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <strong className="text-sm text-on-surface">
                            {event.type === "STAGE_EXIT" && event.to
                              ? `${event.from || stageName} → ${event.to}`
                              : event.type === "STAGE_ENTER"
                                ? `Entered ${stageName}`
                                : event.type === "RECEIVED"
                                  ? `Received at ${stageName}`
                                  : `${event.type}: ${event.to || stageName}`}
                          </strong>
                          <time className="text-xs text-on-surface-variant">{formatTimestamp(event.at)}</time>
                        </div>
                        <div className="mt-1 flex flex-wrap gap-x-4 text-xs text-on-surface-variant">
                          <span>Moved by {actorMap.get(event.by) || event.by}</span>
                          {elapsed && <span>Time in previous phase: {elapsed}</span>}
                          {(event.locationName || event.equipmentId) && (
                            <span>
                              Location / equipment: {event.locationName || "Not recorded"}
                              {event.equipmentId ? ` · ${equipmentMap.get(event.equipmentId) || event.equipmentId}` : ""}
                            </span>
                          )}
                        </div>
                        {event.remarks && <p className="mt-1 text-xs text-on-surface-variant">{event.remarks}</p>}
                      </li>
                    );
                  })}
                </ol>
              )}
            </div>
          </div>

          <aside className="flex flex-col gap-4">
            <div className="rounded-lg border border-outline-variant/40 p-4 text-center">
              <h4 className="font-semibold text-on-surface">{selectedTray ? "Tray barcode" : "Batch identifier"}</h4>
              {(selectedTray?.barcode || trace.binder.barcode) ? (
                <>
                  {qrDataUrl ? (
                    <img
                      src={qrDataUrl}
                      alt={`QR code for ${selectedTray?.barcode || trace.binder.barcode}`}
                      className="mx-auto mt-2 h-48 w-48"
                    />
                  ) : (
                    <div className="mx-auto mt-2 flex h-48 w-48 items-center justify-center text-xs text-on-surface-variant">
                      Creating QR code...
                    </div>
                  )}
                  <p className="font-mono text-sm font-bold text-on-surface">{selectedTray?.barcode || trace.binder.barcode}</p>
                  {qrDataUrl && (
                    <a
                      href={qrDataUrl}
                      download={`${selectedTray?.barcode || trace.binder.barcode}.png`}
                      className="mt-2 inline-flex min-h-10 items-center rounded bg-surface-container px-3 text-sm font-semibold text-primary"
                    >
                      Download QR image
                    </a>
                  )}
                </>
              ) : (
                <p className="mt-2 text-sm text-on-surface-variant">No batch identifier has been issued.</p>
              )}
              {!selectedTray && trace.trays.length > 0 && (
                <p className="mt-2 text-xs text-on-surface-variant">
                  Scan an individual tray label to enable movement tracking.
                </p>
              )}
              {trace.binder.barcode === undefined && canIssueBarcode && (
                <button
                  type="button"
                  onClick={handleIssueBarcode}
                  disabled={busy}
                  className="mt-3 min-h-10 rounded bg-primary px-3 text-sm font-semibold text-on-primary disabled:opacity-50"
                >
                  Generate product QR label
                </button>
              )}
            </div>

            <div className="rounded-lg border border-outline-variant/40 p-4">
              <h4 className="font-semibold text-on-surface">Move to next phase</h4>
              {canMove ? (
                !selectedTray ? (
                  <p className="mt-2 text-sm text-on-surface-variant">
                    Scan an individual tray barcode before recording a movement. Batch codes are view-only.
                  </p>
                ) : allowedNextStages.length > 0 ? (
                  <form onSubmit={handleMove} className="mt-3 flex flex-col gap-3">
                    <label className="text-xs font-semibold text-on-surface-variant">
                      Destination phase
                      <select
                        value={nextStageId || allowedNextStages[0].id}
                        onChange={(event) => setNextStageId(event.target.value)}
                        className="mt-1 min-h-10 w-full rounded border border-outline-variant/60 bg-surface-container-low px-2 text-sm text-on-surface"
                      >
                        {allowedNextStages.map((stage) => (
                          <option key={stage.id} value={stage.id}>{stage.name}</option>
                        ))}
                      </select>
                    </label>
                    <label className="text-xs font-semibold text-on-surface-variant">
                      Movement location
                      <select
                        value={locationId}
                        onChange={(event) => {
                          const nextLocationId = event.target.value;
                          setLocationId(nextLocationId);
                          setEquipmentId(equipment.find((item) => item.active && item.locationId === nextLocationId)?.id || "");
                        }}
                        required
                        className="mt-1 min-h-10 w-full rounded border border-outline-variant/60 bg-surface-container-low px-2 text-sm text-on-surface"
                      >
                        <option value="">Select a location</option>
                        {locations.map((location) => (
                          <option key={location.id} value={location.id}>{location.code} · {location.name}</option>
                        ))}
                      </select>
                    </label>
                    <label className="text-xs font-semibold text-on-surface-variant">
                      Equipment ID
                      <select
                        value={equipmentId}
                        onChange={(event) => setEquipmentId(event.target.value)}
                        required
                        disabled={!equipmentOptions.length}
                        className="mt-1 min-h-10 w-full rounded border border-outline-variant/60 bg-surface-container-low px-2 text-sm text-on-surface disabled:opacity-50"
                      >
                        <option value="">Select equipment</option>
                        {equipmentOptions.map((item) => (
                          <option key={item.id} value={item.id}>{item.code} · {item.name}</option>
                        ))}
                      </select>
                    </label>
                    <label className="text-xs font-semibold text-on-surface-variant">
                      Movement remarks (required)
                      <textarea
                        value={remarks}
                        onChange={(event) => setRemarks(event.target.value)}
                        minLength={5}
                        required
                        rows={3}
                        placeholder="Describe the verified product handoff"
                        className="mt-1 w-full rounded border border-outline-variant/60 bg-surface-container-low p-2 text-sm text-on-surface"
                      />
                    </label>
                    <button
                      type="submit"
                      disabled={busy || remarks.trim().length < 5}
                      className="min-h-11 rounded-lg bg-primary px-4 font-semibold text-on-primary disabled:opacity-50"
                    >
                      {busy ? "Recording movement..." : "Confirm phase movement"}
                    </button>
                  </form>
                ) : (
                  <p className="mt-2 text-sm text-on-surface-variant">This is the final configured phase; no further movement is available.</p>
                )
              ) : (
                <p className="mt-2 text-sm text-on-surface-variant">
                  {currentRole} can view the trace but cannot move products. Switch to an authorized Admin or Initiator account to record a movement.
                </p>
              )}
            </div>
          </aside>
        </div>
      )}
    </section>
  );
}
