"use client";

import React, { FormEvent, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import AppLayout from "@/components/layout/AppLayout";
import { mockApi } from "@/api";
import { MAX_TRAYS_PER_BATCH } from "@/domain/barcode";
import { Department, Equipment, Location, NewBinderData, WorkflowStage } from "@/domain/types";
import { can } from "@/services/permission";
import { useSession } from "@/services/session";

const emptyForm: NewBinderData = {
  productName: "",
  strength: "",
  productCode: "",
  lotNo: "",
  batchNo: "",
  batchSize: "",
  trayCount: 0,
  departmentId: "",
  locationId: "",
  equipmentId: "",
  remarks: "",
};

const inputClass =
  "mt-1 min-h-11 w-full rounded-lg border border-outline-variant bg-surface-container-lowest px-3 text-sm text-on-surface focus:border-primary focus:outline-none";
const labelClass = "text-xs font-semibold uppercase tracking-wide text-on-surface-variant";

export default function CreateEditBinderPage() {
  const { currentUser } = useSession();
  const [form, setForm] = useState<NewBinderData>(emptyForm);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [locations, setLocations] = useState<Location[]>([]);
  const [equipment, setEquipment] = useState<Equipment[]>([]);
  const [startStage, setStartStage] = useState<WorkflowStage | null>(null);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [createdBinder, setCreatedBinder] = useState<{ id: string; barcode?: string; createdAt: string; trayCount: number } | null>(null);

  const equipmentOptions = useMemo(
    () => equipment.filter((item) => item.active && item.locationId === form.locationId),
    [equipment, form.locationId]
  );
  const canCreate = !!currentUser && can(currentUser, "binder.create");

  useEffect(() => {
    let active = true;
    Promise.all([mockApi.getMasters(), mockApi.getEquipment(), mockApi.getWorkflowStages()])
      .then(([mastersResponse, equipmentResponse, stagesResponse]) => {
        if (!active) return;
        if (!mastersResponse.ok || !mastersResponse.data) {
          setError(mastersResponse.error?.message || "Could not load batch locations and departments.");
          return;
        }
        if (!equipmentResponse.ok || !equipmentResponse.data) {
          setError(equipmentResponse.error?.message || "Could not load equipment.");
          return;
        }
        if (!stagesResponse.ok || !stagesResponse.data) {
          setError(stagesResponse.error?.message || "Could not load the product workflow.");
          return;
        }

        const activeDepartments = mastersResponse.data.departments.filter((item) => item.active);
        const activeLocations = mastersResponse.data.locations.filter((item) => item.active);
        const activeEquipment = equipmentResponse.data.filter((item) => item.active);
        const initialLocation = activeLocations[0];
        const initialDepartment =
          activeDepartments.find((item) => item.id === initialLocation?.departmentId) || activeDepartments[0];
        const initialEquipment = activeEquipment.find((item) => item.locationId === initialLocation?.id);
        const initialStage =
          stagesResponse.data.filter((stage) => stage.kind === "START").sort((a, b) => a.order - b.order)[0] || null;

        setDepartments(activeDepartments);
        setLocations(activeLocations);
        setEquipment(activeEquipment);
        setStartStage(initialStage);
        setForm((current) => ({
          ...current,
          departmentId: current.departmentId || initialDepartment?.id || "",
          locationId: current.locationId || initialLocation?.id || "",
          equipmentId: current.equipmentId || initialEquipment?.id || "",
        }));
      })
      .catch((loadError: unknown) => {
        console.error("Could not load batch creation options:", loadError);
        if (active) setError("Could not load batch creation options. Please reload and try again.");
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  const updateField = <K extends keyof NewBinderData>(field: K, value: NewBinderData[K]) => {
    setForm((current) => ({ ...current, [field]: value }));
  };

  const handleLocationChange = (locationId: string) => {
    const location = locations.find((item) => item.id === locationId);
    setForm((current) => ({
      ...current,
      locationId,
      departmentId: location?.departmentId || current.departmentId,
      equipmentId: equipment.find((item) => item.active && item.locationId === locationId)?.id || "",
    }));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!currentUser || !canCreate || busy) return;
    setBusy(true);
    setError("");
    setCreatedBinder(null);
    try {
      const response = await mockApi.createBinder(form, currentUser);
      if (!response.ok || !response.data) {
        setError(response.error?.message || "The batch could not be created.");
        return;
      }
      setCreatedBinder({
        id: response.data.binder.id,
        barcode: response.data.binder.barcode,
        createdAt: response.data.binder.createdAt,
        trayCount: response.data.binder.trayCount || form.trayCount,
      });
      setForm(emptyForm);
    } catch (createError) {
      console.error("Batch creation failed:", createError);
      setError("The batch could not be created. Please try again.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <AppLayout screenCode="S07">
      <div className="mx-auto w-full max-w-5xl space-y-6 pb-10">
        <header>
          <p className="font-mono text-xs font-semibold text-primary">S07 · BATCH INTAKE</p>
          <h1 className="mt-1 text-2xl font-bold text-on-surface">Create product batch</h1>
          <p className="mt-2 max-w-3xl text-sm text-on-surface-variant">
            Batch creation time, initial phase, QR label, and creator are recorded automatically. Add an intake remark to begin the movement history.
          </p>
        </header>

        {!canCreate && (
          <div role="alert" className="rounded-lg bg-error-container/50 p-4 text-sm text-on-error-container">
            Your account does not have permission to create batches.
          </div>
        )}

        {error && (
          <div role="alert" className="rounded-lg bg-error-container/50 p-4 text-sm text-on-error-container">
            {error}
          </div>
        )}

        {createdBinder && (
          <div role="status" className="rounded-lg border border-secondary/30 bg-secondary-container/30 p-4">
            <p className="font-semibold text-on-surface">Batch created successfully</p>
            <p className="mt-1 text-sm text-on-surface-variant">
              Created {new Date(createdBinder.createdAt).toLocaleString()}
              {createdBinder.barcode ? ` · Batch label ${createdBinder.barcode}` : ""}
              {` · ${createdBinder.trayCount} trays registered`}
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              <Link
                href={`/binders/${encodeURIComponent(createdBinder.id)}`}
                className="inline-flex min-h-10 items-center rounded-lg bg-primary px-4 text-sm font-semibold text-on-primary"
              >
                Open tray labels
              </Link>
              <Link
                href={`/reports/batch-print?binder=${encodeURIComponent(createdBinder.id)}`}
                className="inline-flex min-h-10 items-center rounded-lg border border-outline-variant px-4 text-sm font-semibold"
              >
                Open batch report
              </Link>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5 rounded-xl border border-outline-variant/50 bg-surface-container-lowest p-5 shadow-sm">
          <section>
            <h2 className="text-base font-semibold text-on-surface">Product and batch identification</h2>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <label className={labelClass}>
                Product name
                <input className={inputClass} value={form.productName} onChange={(event) => updateField("productName", event.target.value)} required />
              </label>
              <label className={labelClass}>
                Strength
                <input className={inputClass} value={form.strength} onChange={(event) => updateField("strength", event.target.value)} required />
              </label>
              <label className={labelClass}>
                Product code
                <input className={inputClass} value={form.productCode} onChange={(event) => updateField("productCode", event.target.value)} required />
              </label>
              <label className={labelClass}>
                Batch size / units
                <input className={inputClass} value={form.batchSize} onChange={(event) => updateField("batchSize", event.target.value)} required />
              </label>
              <label className={labelClass}>
                Number of physical trays
                <input
                  type="number"
                  className={inputClass}
                  value={form.trayCount || ""}
                  onChange={(event) => updateField("trayCount", Number(event.target.value))}
                  min={1}
                  max={MAX_TRAYS_PER_BATCH}
                  step={1}
                  required
                />
                <span className="mt-1 block normal-case tracking-normal text-on-surface-variant">
                  Each tray is tracked and moved separately. Enter 1–{MAX_TRAYS_PER_BATCH}; this is not calculated from batch units.
                </span>
              </label>
              <label className={labelClass}>
                Lot number
                <input className={inputClass} value={form.lotNo} onChange={(event) => updateField("lotNo", event.target.value)} required />
              </label>
              <label className={labelClass}>
                Batch number
                <input className={inputClass} value={form.batchNo} onChange={(event) => updateField("batchNo", event.target.value)} required />
              </label>
            </div>
          </section>

          <section className="border-t border-outline-variant/40 pt-5">
            <h2 className="text-base font-semibold text-on-surface">Initial custody</h2>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <label className={labelClass}>
                Department
                <select className={inputClass} value={form.departmentId} onChange={(event) => updateField("departmentId", event.target.value)} required disabled={loading}>
                  <option value="">Select a department</option>
                  {departments.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}
                </select>
              </label>
              <label className={labelClass}>
                Current location
                <select className={inputClass} value={form.locationId} onChange={(event) => handleLocationChange(event.target.value)} required disabled={loading}>
                  <option value="">Select a location</option>
                  {locations.map((item) => <option key={item.id} value={item.id}>{item.code} · {item.name}</option>)}
                </select>
              </label>
              <label className={labelClass}>
                Equipment ID
                <select className={inputClass} value={form.equipmentId} onChange={(event) => updateField("equipmentId", event.target.value)} required disabled={loading || equipmentOptions.length === 0}>
                  <option value="">Select equipment</option>
                  {equipmentOptions.map((item) => <option key={item.id} value={item.id}>{item.code} · {item.name}</option>)}
                </select>
              </label>
              <div className="rounded-lg bg-surface-container-low p-3 text-sm">
                <span className="block text-xs font-semibold uppercase text-on-surface-variant">Initial workflow phase</span>
                <span className="mt-1 block font-medium text-on-surface">{startStage?.name || (loading ? "Loading..." : "No START phase configured")}</span>
              </div>
            </div>
          </section>

          <section className="border-t border-outline-variant/40 pt-5">
            <label className={labelClass}>
              Creation remarks
              <textarea
                className={`${inputClass} min-h-24 py-3`}
                value={form.remarks}
                onChange={(event) => updateField("remarks", event.target.value)}
                minLength={5}
                required
              />
            </label>
            <p className="mt-2 text-xs text-on-surface-variant">
              The current system time and signed-in user are saved with the initial batch event.
            </p>
          </section>

          <div className="flex flex-wrap justify-end gap-3 border-t border-outline-variant/40 pt-5">
            <Link href="/binders" className="inline-flex min-h-11 items-center rounded-lg border border-outline-variant px-4 text-sm font-semibold text-on-surface-variant">
              Cancel
            </Link>
            <button type="submit" disabled={!canCreate || loading || busy || !startStage} className="min-h-11 rounded-lg bg-primary px-5 text-sm font-semibold text-on-primary disabled:cursor-not-allowed disabled:opacity-50">
              {busy ? "Creating batch..." : "Create batch and QR label"}
            </button>
          </div>
        </form>

        <p className="text-xs text-on-surface-variant">
          Prototype only — this browser-storage demo is not a validated GMP or regulatory system.
        </p>
      </div>
    </AppLayout>
  );
}
