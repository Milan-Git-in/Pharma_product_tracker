"use client";

import React, { useState, useEffect, useMemo } from "react";
import AppLayout from "@/components/layout/AppLayout";
import StatusPill from "@/components/ui/StatusPill";
import Button from "@/components/ui/Button";
import Modal from "@/components/ui/Modal";
import RecordAuditDrawer from "@/components/audit/RecordAuditDrawer";
import { Department, Location, Rack, Pallet } from "@/domain/types";
import { mockApi } from "@/api";
import { useSession } from "@/services/session";
import { can } from "@/services/permission";
import { useToast } from "@/components/ui/Toast";
import { downloadLabelsPdf, LabelPresetSize } from "@/services/labelPrint";

type MasterTab = "department" | "location" | "rack" | "pallet";

export default function MastersCatalogPage() {
  const { currentUser } = useSession();
  const { showToast } = useToast();

  const [activeTab, setActiveTab] = useState<MasterTab>("rack");
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // Data
  const [departments, setDepartments] = useState<Department[]>([]);
  const [locations, setLocations] = useState<Location[]>([]);
  const [racks, setRacks] = useState<Rack[]>([]);
  const [pallets, setPallets] = useState<Pallet[]>([]);

  // Modals state
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedEntity, setSelectedEntity] = useState<any>(null);

  // Form inputs
  const [formData, setFormData] = useState({
    code: "",
    name: "",
    type: "COLD_ROOM" as "COLD_ROOM" | "AREA",
    departmentId: "",
    coldRoomId: "",
    rackId: "",
    barcode: "",
    reason: "",
  });

  // Action status modal (Activate/Deactivate)
  const [statusModalOpen, setStatusModalOpen] = useState(false);
  const [statusAction, setStatusAction] = useState<"ACTIVATE" | "DEACTIVATE">("DEACTIVATE");
  const [statusReason, setStatusReason] = useState("");
  const [statusSubmitting, setStatusSubmitting] = useState(false);

  // Print Label modal
  const [printModalOpen, setPrintModalOpen] = useState(false);
  const [printPreset, setPrintPreset] = useState<LabelPresetSize>("50x25");
  const [printReason, setPrintReason] = useState("");
  const [printSubmitting, setPrintSubmitting] = useState(false);

  // Generate Barcodes bulk modal
  const [generateModalOpen, setGenerateModalOpen] = useState(false);
  const [generateEntity, setGenerateEntity] = useState<"RACK" | "PALLET">("PALLET");
  const [generateQty, setGenerateQty] = useState(5);
  const [generateColdRoom, setGenerateColdRoom] = useState("");
  const [generateReason, setGenerateReason] = useState("");
  const [generateSubmitting, setGenerateSubmitting] = useState(false);
  const [generatedBatch, setGeneratedBatch] = useState<string[]>([]);

  // Audit Drawer
  const [auditDrawerEntityId, setAuditDrawerEntityId] = useState<string | null>(null);
  const [auditDrawerTitle, setAuditDrawerTitle] = useState("");

  const canManage = can(currentUser, "master.manage");

  const loadData = async () => {
    setLoading(true);
    try {
      const res = await mockApi.getMasters();
      if (res.ok && res.data) {
        setDepartments(res.data.departments || []);
        setLocations(res.data.locations || []);
        setRacks(res.data.racks || []);
        setPallets(res.data.pallets || []);
      }
    } catch (err) {
      console.error("Failed to load master data:", err);
      showToast("error", "Error", "Failed to retrieve master catalog.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Telemetry metrics
  const activeRacksCount = racks.filter((r) => r.active).length;
  const activePalletsCount = pallets.filter((p) => p.active).length;
  const activeLocationsCount = locations.filter((l) => l.active).length;
  const activeDeptsCount = departments.filter((d) => d.active).length;

  // Filtered lists
  const filteredDepartments = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return departments;
    return departments.filter(
      (d) => d.code.toLowerCase().includes(q) || d.name.toLowerCase().includes(q)
    );
  }, [departments, searchQuery]);

  const filteredLocations = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return locations;
    return locations.filter(
      (l) =>
        l.code.toLowerCase().includes(q) ||
        l.name.toLowerCase().includes(q) ||
        l.type.toLowerCase().includes(q)
    );
  }, [locations, searchQuery]);

  const filteredRacks = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return racks;
    return racks.filter(
      (r) =>
        r.code.toLowerCase().includes(q) ||
        r.barcode.toLowerCase().includes(q) ||
        r.coldRoomId.toLowerCase().includes(q)
    );
  }, [racks, searchQuery]);

  const filteredPallets = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return pallets;
    return pallets.filter(
      (p) =>
        p.code.toLowerCase().includes(q) ||
        p.barcode.toLowerCase().includes(q) ||
        (p.rackId && p.rackId.toLowerCase().includes(q))
    );
  }, [pallets, searchQuery]);

  // Open Add modal with defaults
  const handleOpenAdd = () => {
    setFormData({
      code: "",
      name: "",
      type: "COLD_ROOM",
      departmentId: departments[0]?.id || "",
      coldRoomId: locations.find((l) => l.type === "COLD_ROOM")?.id || "cr-01",
      rackId: racks[0]?.id || "",
      barcode: "",
      reason: "Initial master record provisioning per SOP-MDM-004",
    });
    setAddModalOpen(true);
  };

  // Submit Add
  const handleSaveAdd = async () => {
    if (!currentUser) return;
    if (!formData.code.trim()) {
      showToast("error", "Validation Error", "Code is required.");
      return;
    }
    if (!formData.reason || formData.reason.trim().length < 5) {
      showToast("error", "Validation Error", "A valid regulatory Reason for Change (min 5 chars) is mandatory.");
      return;
    }

    setLoading(true);
    try {
      const typePlural = (activeTab + "s") as "departments" | "locations" | "racks" | "pallets";
      const payload: any = { code: formData.code.trim().toUpperCase() };

      if (activeTab === "department") {
        payload.name = formData.name.trim();
      } else if (activeTab === "location") {
        payload.name = formData.name.trim();
        payload.type = formData.type;
        payload.departmentId = formData.departmentId || undefined;
      } else if (activeTab === "rack") {
        payload.coldRoomId = formData.coldRoomId;
        payload.barcode = formData.barcode.trim();
      } else if (activeTab === "pallet") {
        payload.rackId = formData.rackId || undefined;
        payload.barcode = formData.barcode.trim();
      }

      const res = await mockApi.createMasterEntity(typePlural, payload, currentUser, formData.reason);
      if (res.ok) {
        showToast("success", "Record Created", `Master entity ${formData.code.toUpperCase()} successfully provisioned.`);
        setAddModalOpen(false);
        await loadData();
      } else {
        showToast("error", "Creation Failed", res.error?.message || "Failed to create entity.");
      }
    } catch (err: any) {
      showToast("error", "Error", err?.message || "An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  // Open Edit
  const handleOpenEdit = (item: any) => {
    setSelectedEntity(item);
    setFormData({
      code: item.code || "",
      name: item.name || "",
      type: item.type || "COLD_ROOM",
      departmentId: item.departmentId || "",
      coldRoomId: item.coldRoomId || "",
      rackId: item.rackId || "",
      barcode: item.barcode || "",
      reason: "",
    });
    setEditModalOpen(true);
  };

  // Submit Edit
  const handleSaveEdit = async () => {
    if (!currentUser || !selectedEntity) return;
    if (!formData.reason || formData.reason.trim().length < 5) {
      showToast("error", "Validation Error", "A valid regulatory Reason for Change (min 5 chars) is mandatory.");
      return;
    }

    setLoading(true);
    try {
      const typePlural = (activeTab + "s") as "departments" | "locations" | "racks" | "pallets";
      const updates: any = {};

      if (activeTab === "department") {
        updates.name = formData.name.trim();
      } else if (activeTab === "location") {
        updates.name = formData.name.trim();
        updates.type = formData.type;
        updates.departmentId = formData.departmentId || undefined;
      } else if (activeTab === "rack") {
        updates.coldRoomId = formData.coldRoomId;
        if (formData.barcode) updates.barcode = formData.barcode.trim();
      } else if (activeTab === "pallet") {
        updates.rackId = formData.rackId || undefined;
        if (formData.barcode) updates.barcode = formData.barcode.trim();
      }

      const res = await mockApi.updateMasterEntity(typePlural, selectedEntity.id, updates, currentUser, formData.reason);
      if (res.ok) {
        showToast("success", "Record Updated", `Changes to ${selectedEntity.code} saved and logged to audit trail.`);
        setEditModalOpen(false);
        await loadData();
      } else {
        showToast("error", "Update Failed", res.error?.message || "Failed to update record.");
      }
    } catch (err: any) {
      showToast("error", "Error", err?.message || "An error occurred.");
    } finally {
      setLoading(false);
    }
  };

  // Open Activate/Deactivate
  const handleOpenStatusModal = (item: any, action: "ACTIVATE" | "DEACTIVATE") => {
    setSelectedEntity(item);
    setStatusAction(action);
    setStatusReason("");
    setStatusModalOpen(true);
  };

  // Confirm Status change
  const handleConfirmStatus = async () => {
    if (!currentUser || !selectedEntity) return;
    if (!statusReason || statusReason.trim().length < 5) {
      showToast("error", "Validation Error", "Reason for status change must be at least 5 characters.");
      return;
    }

    setStatusSubmitting(true);
    try {
      const typePlural = (activeTab + "s") as "departments" | "locations" | "racks" | "pallets";
      const isActivate = statusAction === "ACTIVATE";
      const res = isActivate
        ? await mockApi.activateMasterEntity(typePlural, selectedEntity.id, currentUser, statusReason)
        : await mockApi.deactivateMasterEntity(typePlural, selectedEntity.id, currentUser, statusReason);

      if (res.ok) {
        showToast(
          "success",
          isActivate ? "Entity Activated" : "Entity Deactivated",
          `${selectedEntity.code} status changed to ${isActivate ? "ACTIVE" : "INACTIVE"}.`
        );
        setStatusModalOpen(false);
        await loadData();
      } else {
        showToast("error", "Operation Failed", res.error?.message || "Failed to update status.");
      }
    } catch (err: any) {
      showToast("error", "Error", err?.message || "Failed to change status.");
    } finally {
      setStatusSubmitting(false);
    }
  };

  // Open Print Label
  const handleOpenPrint = (item: any) => {
    setSelectedEntity(item);
    setPrintPreset("50x25");
    setPrintReason("Routine cleanroom replacement label generation");
    setPrintModalOpen(true);
  };

  // Execute Print
  const handleExecutePrint = async () => {
    if (!currentUser || !selectedEntity) return;
    if (!printReason || printReason.trim().length < 5) {
      showToast("error", "Validation Error", "A regulatory Reason for Label Print is mandatory.");
      return;
    }

    setPrintSubmitting(true);
    try {
      const entityType = activeTab === "rack" ? "RACK" : "PALLET";
      await mockApi.reprintBarcode(selectedEntity.id, entityType, printPreset, currentUser, printReason);

      await downloadLabelsPdf(
        [
          {
            code: selectedEntity.barcode || selectedEntity.code,
            entityType,
            symbology: "CODE128",
            title: selectedEntity.name || selectedEntity.code,
            location: selectedEntity.coldRoomId || selectedEntity.rackId,
          },
        ],
        { size: printPreset }
      );

      showToast("success", "Label Generated", `Cleanroom PDF label for ${selectedEntity.code} downloaded successfully.`);
      setPrintModalOpen(false);
    } catch (err: any) {
      showToast("error", "Print Failed", err?.message || "Could not generate label PDF.");
    } finally {
      setPrintSubmitting(false);
    }
  };

  // Execute Bulk Barcode Generation
  const handleExecuteGenerateBulk = async () => {
    if (!currentUser) return;
    if (!generateReason || generateReason.trim().length < 5) {
      showToast("error", "Validation Error", "Reason for batch generation is mandatory.");
      return;
    }

    setGenerateSubmitting(true);
    try {
      const res = await mockApi.generateBarcodes(
        generateEntity,
        generateQty,
        { locationCode: generateColdRoom || undefined },
        currentUser,
        generateReason
      );

      if (res.ok && res.data) {
        setGeneratedBatch(res.data.barcodes);
        showToast("success", "Barcodes Generated", `Generated ${res.data.barcodes.length} unique sequential barcodes.`);
      } else {
        showToast("error", "Generation Failed", res.error?.message || "Could not generate barcodes.");
      }
    } catch (err: any) {
      showToast("error", "Error", err?.message || "Could not generate barcodes.");
    } finally {
      setGenerateSubmitting(false);
    }
  };

  // Add generated batch to Master records automatically
  const handleCommitBatchToMasters = async () => {
    if (!currentUser || generatedBatch.length === 0) return;
    setGenerateSubmitting(true);
    try {
      const typePlural = generateEntity === "RACK" ? "racks" : "pallets";
      let added = 0;

      for (let i = 0; i < generatedBatch.length; i++) {
        const bc = generatedBatch[i];
        const code = generateEntity === "RACK" ? bc : `PL-AUTO-${i + 1}`;
        const payload: any = { code, barcode: bc };
        if (generateEntity === "RACK") {
          payload.coldRoomId = generateColdRoom || "cr-01";
        }
        await mockApi.createMasterEntity(typePlural, payload, currentUser, generateReason);
        added++;
      }

      showToast("success", "Masters Populated", `Added ${added} new ${generateEntity.toLowerCase()} master records.`);
      setGenerateModalOpen(false);
      setGeneratedBatch([]);
      await loadData();
    } catch (err: any) {
      showToast("error", "Commit Failed", err?.message || "Error adding records.");
    } finally {
      setGenerateSubmitting(false);
    }
  };

  return (
    <AppLayout screenCode="S20">
      <div className="flex flex-col w-full gap-space-lg py-space-lg text-left">
        {/* Header & GMP Strip */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-space-md">
          <div className="flex flex-col gap-space-xs">
            <div className="flex items-center gap-space-sm">
              <span className="px-2 py-0.5 rounded bg-primary-fixed text-on-primary-fixed font-label-sm text-label-sm uppercase tracking-wider font-semibold">
                21 CFR Part 11
              </span>
              <span className="font-label-sm text-label-sm text-on-surface-variant font-mono">
                MASTER DATA GOVERNANCE • SOP-MDM-004
              </span>
            </div>
            <h1 className="font-headline-xl text-headline-xl text-on-surface tracking-tight font-bold">
              S20 Masters Catalog
            </h1>
            <p className="font-body-md text-body-md text-on-surface-variant max-w-2xl">
              Manage validated master entities (Departments, Locations, Racks, Pallets) under strict GMP change control and electronic audit trail.
            </p>
          </div>

          {/* Master Telemetry */}
          <div className="flex items-center gap-space-md bg-surface-container-lowest rounded-xl p-space-md shadow-xs border border-outline-variant/30">
            <div className="flex flex-col pr-space-md">
              <span className="font-caption text-caption text-on-surface-variant uppercase font-medium">
                Active Racks
              </span>
              <div className="flex items-baseline gap-space-xs">
                <span className="font-headline-lg text-2xl font-bold font-mono text-primary">
                  {activeRacksCount}
                </span>
                <span className="font-label-sm text-xs text-on-surface-variant">/ {racks.length}</span>
              </div>
            </div>

            <div className="h-8 w-px bg-surface-container-high"></div>

            <div className="flex flex-col pr-space-md">
              <span className="font-caption text-caption text-on-surface-variant uppercase font-medium">
                Active Pallets
              </span>
              <div className="flex items-baseline gap-space-xs">
                <span className="font-headline-lg text-2xl font-bold font-mono text-secondary">
                  {activePalletsCount}
                </span>
                <span className="font-label-sm text-xs text-on-surface-variant">/ {pallets.length}</span>
              </div>
            </div>

            <div className="h-8 w-px bg-surface-container-high"></div>

            <div className="flex flex-col">
              <span className="font-caption text-caption text-on-surface-variant uppercase font-medium">
                Chambers &amp; Depts
              </span>
              <span className="font-label-md text-sm font-semibold font-mono text-on-surface">
                {activeLocationsCount} Locs • {activeDeptsCount} Depts
              </span>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div
          aria-label="Master Data Entities"
          className="flex items-center gap-space-xs bg-surface-container-low p-1.5 rounded-xl w-full overflow-x-auto border border-outline-variant/30"
          role="tablist"
        >
          <button
            onClick={() => setActiveTab("department")}
            className={`min-h-[44px] px-space-md rounded-lg font-body-md text-sm flex items-center gap-space-xs transition-all whitespace-nowrap ${
              activeTab === "department"
                ? "bg-surface-container-lowest text-primary font-bold shadow-xs border border-outline-variant/40"
                : "text-on-surface-variant hover:bg-surface-container hover:text-on-surface"
            }`}
          >
            <span className="material-symbols-outlined text-[18px]">corporate_fare</span>
            <span>Departments</span>
            <span className="ml-1 px-1.5 py-0.5 rounded-full bg-surface-container-high font-mono text-xs">
              {departments.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab("location")}
            className={`min-h-[44px] px-space-md rounded-lg font-body-md text-sm flex items-center gap-space-xs transition-all whitespace-nowrap ${
              activeTab === "location"
                ? "bg-surface-container-lowest text-primary font-bold shadow-xs border border-outline-variant/40"
                : "text-on-surface-variant hover:bg-surface-container hover:text-on-surface"
            }`}
          >
            <span className="material-symbols-outlined text-[18px]">ac_unit</span>
            <span>Locations (Cold Rooms &amp; Areas)</span>
            <span className="ml-1 px-1.5 py-0.5 rounded-full bg-surface-container-high font-mono text-xs">
              {locations.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab("rack")}
            className={`min-h-[44px] px-space-md rounded-lg font-body-md text-sm flex items-center gap-space-xs transition-all whitespace-nowrap ${
              activeTab === "rack"
                ? "bg-surface-container-lowest text-primary font-bold shadow-xs border border-outline-variant/40"
                : "text-on-surface-variant hover:bg-surface-container hover:text-on-surface"
            }`}
          >
            <span className="material-symbols-outlined text-[18px]">shelves</span>
            <span>Racks</span>
            <span className="ml-1 px-1.5 py-0.5 rounded-full bg-primary-fixed text-on-primary-fixed font-mono text-xs font-bold">
              {racks.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab("pallet")}
            className={`min-h-[44px] px-space-md rounded-lg font-body-md text-sm flex items-center gap-space-xs transition-all whitespace-nowrap ${
              activeTab === "pallet"
                ? "bg-surface-container-lowest text-primary font-bold shadow-xs border border-outline-variant/40"
                : "text-on-surface-variant hover:bg-surface-container hover:text-on-surface"
            }`}
          >
            <span className="material-symbols-outlined text-[18px]">pallet</span>
            <span>Pallets</span>
            <span className="ml-1 px-1.5 py-0.5 rounded-full bg-surface-container-high font-mono text-xs">
              {pallets.length}
            </span>
          </button>
        </div>

        {/* Top Action Bar */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-space-md bg-surface-container-lowest p-space-md rounded-xl shadow-xs border border-outline-variant/40">
          <div className="relative flex-1 max-w-md">
            <span className="material-symbols-outlined text-[20px] text-on-surface-variant absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none">
              search
            </span>
            <input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={`Search ${activeTab}s by code, name, barcode, or parent...`}
              className="w-full min-h-[44px] pl-10 pr-4 rounded-lg bg-surface-container-low text-on-surface placeholder:text-on-surface-variant font-body-md text-sm focus:outline-none focus:bg-surface-container-lowest focus:ring-2 focus:ring-primary/20 border border-transparent focus:border-primary transition-all"
            />
          </div>

          <div className="flex items-center gap-space-sm flex-wrap">
            {(activeTab === "rack" || activeTab === "pallet") && canManage && (
              <Button
                variant="secondary"
                size="md"
                onClick={() => {
                  setGenerateEntity(activeTab === "rack" ? "RACK" : "PALLET");
                  setGeneratedBatch([]);
                  setGenerateModalOpen(true);
                }}
                icon="qr_code_2"
              >
                Generate Barcodes
              </Button>
            )}

            {canManage && (
              <Button
                variant="primary"
                size="md"
                onClick={handleOpenAdd}
                icon="add"
              >
                Add {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}
              </Button>
            )}
          </div>
        </div>

        {/* Data Table */}
        <div className="bg-surface-container-lowest rounded-xl shadow-xs border border-outline-variant/40 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-surface-container-low border-b border-outline-variant/30">
                  <th className="py-3 px-space-md font-label-sm text-xs uppercase tracking-wider text-on-surface-variant font-semibold">
                    Code
                  </th>
                  {activeTab !== "pallet" && (
                    <th className="py-3 px-space-md font-label-sm text-xs uppercase tracking-wider text-on-surface-variant font-semibold">
                      Name / Title
                    </th>
                  )}
                  {activeTab === "location" && (
                    <th className="py-3 px-space-md font-label-sm text-xs uppercase tracking-wider text-on-surface-variant font-semibold">
                      Type
                    </th>
                  )}
                  {(activeTab === "rack" || activeTab === "pallet") && (
                    <th className="py-3 px-space-md font-label-sm text-xs uppercase tracking-wider text-on-surface-variant font-semibold">
                      {activeTab === "rack" ? "Cold Room Parent" : "Assigned Rack"}
                    </th>
                  )}
                  {(activeTab === "rack" || activeTab === "pallet") && (
                    <th className="py-3 px-space-md font-label-sm text-xs uppercase tracking-wider text-on-surface-variant font-semibold">
                      Barcode
                    </th>
                  )}
                  <th className="py-3 px-space-md font-label-sm text-xs uppercase tracking-wider text-on-surface-variant font-semibold">
                    Status
                  </th>
                  <th className="py-3 px-space-md font-label-sm text-xs uppercase tracking-wider text-on-surface-variant text-right font-semibold">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-outline-variant/20 font-body-md text-sm">
                {/* 1. Departments View */}
                {activeTab === "department" &&
                  filteredDepartments.map((dept) => (
                    <tr key={dept.id} className="hover:bg-surface-container-low/40 transition-colors">
                      <td className="py-3 px-space-md font-mono font-bold text-primary select-all">
                        {dept.code}
                      </td>
                      <td className="py-3 px-space-md font-medium text-on-surface">
                        {dept.name}
                      </td>
                      <td className="py-3 px-space-md">
                        <StatusPill
                          label={dept.active ? "ACTIVE" : "INACTIVE"}
                          variant={dept.active ? "compliant" : "critical"}
                          size="sm"
                          dot={true}
                        />
                      </td>
                      <td className="py-3 px-space-md text-right">
                        <div className="inline-flex items-center gap-1">
                          <button
                            onClick={() => {
                              setAuditDrawerEntityId(dept.id);
                              setAuditDrawerTitle(`Department Audit — ${dept.code}`);
                            }}
                            className="p-1.5 rounded-lg text-outline hover:bg-surface-container hover:text-on-surface transition-colors"
                            title="Audit Trail"
                          >
                            <span className="material-symbols-outlined text-[18px]">history</span>
                          </button>
                          {canManage && (
                            <>
                              <button
                                onClick={() => handleOpenEdit(dept)}
                                className="px-2.5 py-1 rounded-lg text-primary hover:bg-surface-container font-semibold text-xs inline-flex items-center gap-1 transition-colors"
                              >
                                <span className="material-symbols-outlined text-[16px]">edit</span>
                                <span>Edit</span>
                              </button>
                              <button
                                onClick={() => handleOpenStatusModal(dept, dept.active ? "DEACTIVATE" : "ACTIVATE")}
                                className={`px-2.5 py-1 rounded-lg font-semibold text-xs inline-flex items-center gap-1 transition-colors ${
                                  dept.active
                                    ? "text-red-700 hover:bg-red-50"
                                    : "text-emerald-700 hover:bg-emerald-50"
                                }`}
                              >
                                <span className="material-symbols-outlined text-[16px]">
                                  {dept.active ? "block" : "check_circle"}
                                </span>
                                <span>{dept.active ? "Deactivate" : "Activate"}</span>
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}

                {/* 2. Locations View */}
                {activeTab === "location" &&
                  filteredLocations.map((loc) => (
                    <tr key={loc.id} className="hover:bg-surface-container-low/40 transition-colors">
                      <td className="py-3 px-space-md font-mono font-bold text-primary select-all">
                        {loc.code}
                      </td>
                      <td className="py-3 px-space-md font-medium text-on-surface">
                        {loc.name}
                      </td>
                      <td className="py-3 px-space-md">
                        <span className="font-mono text-xs px-2 py-0.5 rounded bg-surface-container font-semibold">
                          {loc.type}
                        </span>
                      </td>
                      <td className="py-3 px-space-md">
                        <StatusPill
                          label={loc.active ? "ACTIVE" : "INACTIVE"}
                          variant={loc.active ? "compliant" : "critical"}
                          size="sm"
                          dot={true}
                        />
                      </td>
                      <td className="py-3 px-space-md text-right">
                        <div className="inline-flex items-center gap-1">
                          <button
                            onClick={() => {
                              setAuditDrawerEntityId(loc.id);
                              setAuditDrawerTitle(`Location Audit — ${loc.code}`);
                            }}
                            className="p-1.5 rounded-lg text-outline hover:bg-surface-container hover:text-on-surface transition-colors"
                            title="Audit Trail"
                          >
                            <span className="material-symbols-outlined text-[18px]">history</span>
                          </button>
                          {canManage && (
                            <>
                              <button
                                onClick={() => handleOpenEdit(loc)}
                                className="px-2.5 py-1 rounded-lg text-primary hover:bg-surface-container font-semibold text-xs inline-flex items-center gap-1 transition-colors"
                              >
                                <span className="material-symbols-outlined text-[16px]">edit</span>
                                <span>Edit</span>
                              </button>
                              <button
                                onClick={() => handleOpenStatusModal(loc, loc.active ? "DEACTIVATE" : "ACTIVATE")}
                                className={`px-2.5 py-1 rounded-lg font-semibold text-xs inline-flex items-center gap-1 transition-colors ${
                                  loc.active
                                    ? "text-red-700 hover:bg-red-50"
                                    : "text-emerald-700 hover:bg-emerald-50"
                                }`}
                              >
                                <span className="material-symbols-outlined text-[16px]">
                                  {loc.active ? "block" : "check_circle"}
                                </span>
                                <span>{loc.active ? "Deactivate" : "Activate"}</span>
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}

                {/* 3. Racks View */}
                {activeTab === "rack" &&
                  filteredRacks.map((rack) => (
                    <tr key={rack.id} className="hover:bg-surface-container-low/40 transition-colors">
                      <td className="py-3 px-space-md font-mono font-bold text-primary select-all">
                        {rack.code}
                      </td>
                      <td className="py-3 px-space-md text-on-surface">
                        Rack Unit {rack.code}
                      </td>
                      <td className="py-3 px-space-md font-mono text-xs text-on-surface-variant">
                        {rack.coldRoomId}
                      </td>
                      <td className="py-3 px-space-md">
                        <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded bg-surface-container font-mono text-xs font-semibold select-all">
                          <span className="material-symbols-outlined text-[14px] text-outline">barcode</span>
                          <span>{rack.barcode}</span>
                        </div>
                      </td>
                      <td className="py-3 px-space-md">
                        <StatusPill
                          label={rack.active ? "ACTIVE" : "INACTIVE"}
                          variant={rack.active ? "compliant" : "critical"}
                          size="sm"
                          dot={true}
                        />
                      </td>
                      <td className="py-3 px-space-md text-right">
                        <div className="inline-flex items-center gap-1">
                          <button
                            onClick={() => handleOpenPrint(rack)}
                            className="px-2.5 py-1 rounded-lg text-secondary hover:bg-secondary-container/50 font-semibold text-xs inline-flex items-center gap-1 transition-colors"
                            title="Print Label"
                          >
                            <span className="material-symbols-outlined text-[16px]">print</span>
                            <span>Print</span>
                          </button>
                          <button
                            onClick={() => {
                              setAuditDrawerEntityId(rack.id);
                              setAuditDrawerTitle(`Rack Audit — ${rack.code}`);
                            }}
                            className="p-1.5 rounded-lg text-outline hover:bg-surface-container hover:text-on-surface transition-colors"
                            title="Audit Trail"
                          >
                            <span className="material-symbols-outlined text-[18px]">history</span>
                          </button>
                          {canManage && (
                            <>
                              <button
                                onClick={() => handleOpenEdit(rack)}
                                className="px-2.5 py-1 rounded-lg text-primary hover:bg-surface-container font-semibold text-xs inline-flex items-center gap-1 transition-colors"
                              >
                                <span className="material-symbols-outlined text-[16px]">edit</span>
                                <span>Edit</span>
                              </button>
                              <button
                                onClick={() => handleOpenStatusModal(rack, rack.active ? "DEACTIVATE" : "ACTIVATE")}
                                className={`px-2.5 py-1 rounded-lg font-semibold text-xs inline-flex items-center gap-1 transition-colors ${
                                  rack.active
                                    ? "text-red-700 hover:bg-red-50"
                                    : "text-emerald-700 hover:bg-emerald-50"
                                }`}
                              >
                                <span className="material-symbols-outlined text-[16px]">
                                  {rack.active ? "block" : "check_circle"}
                                </span>
                                <span>{rack.active ? "Deactivate" : "Activate"}</span>
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}

                {/* 4. Pallets View */}
                {activeTab === "pallet" &&
                  filteredPallets.map((pallet) => (
                    <tr key={pallet.id} className="hover:bg-surface-container-low/40 transition-colors">
                      <td className="py-3 px-space-md font-mono font-bold text-primary select-all">
                        {pallet.code}
                      </td>
                      <td className="py-3 px-space-md font-mono text-xs text-on-surface-variant">
                        {pallet.rackId ? pallet.rackId : <span className="italic text-outline">Unassigned</span>}
                      </td>
                      <td className="py-3 px-space-md">
                        <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded bg-surface-container font-mono text-xs font-semibold select-all">
                          <span className="material-symbols-outlined text-[14px] text-outline">barcode</span>
                          <span>{pallet.barcode}</span>
                        </div>
                      </td>
                      <td className="py-3 px-space-md">
                        <StatusPill
                          label={pallet.active ? "ACTIVE" : "INACTIVE"}
                          variant={pallet.active ? "compliant" : "critical"}
                          size="sm"
                          dot={true}
                        />
                      </td>
                      <td className="py-3 px-space-md text-right">
                        <div className="inline-flex items-center gap-1">
                          <button
                            onClick={() => handleOpenPrint(pallet)}
                            className="px-2.5 py-1 rounded-lg text-secondary hover:bg-secondary-container/50 font-semibold text-xs inline-flex items-center gap-1 transition-colors"
                            title="Print Label"
                          >
                            <span className="material-symbols-outlined text-[16px]">print</span>
                            <span>Print</span>
                          </button>
                          <button
                            onClick={() => {
                              setAuditDrawerEntityId(pallet.id);
                              setAuditDrawerTitle(`Pallet Audit — ${pallet.code}`);
                            }}
                            className="p-1.5 rounded-lg text-outline hover:bg-surface-container hover:text-on-surface transition-colors"
                            title="Audit Trail"
                          >
                            <span className="material-symbols-outlined text-[18px]">history</span>
                          </button>
                          {canManage && (
                            <>
                              <button
                                onClick={() => handleOpenEdit(pallet)}
                                className="px-2.5 py-1 rounded-lg text-primary hover:bg-surface-container font-semibold text-xs inline-flex items-center gap-1 transition-colors"
                              >
                                <span className="material-symbols-outlined text-[16px]">edit</span>
                                <span>Edit</span>
                              </button>
                              <button
                                onClick={() => handleOpenStatusModal(pallet, pallet.active ? "DEACTIVATE" : "ACTIVATE")}
                                className={`px-2.5 py-1 rounded-lg font-semibold text-xs inline-flex items-center gap-1 transition-colors ${
                                  pallet.active
                                    ? "text-red-700 hover:bg-red-50"
                                    : "text-emerald-700 hover:bg-emerald-50"
                                }`}
                              >
                                <span className="material-symbols-outlined text-[16px]">
                                  {pallet.active ? "block" : "check_circle"}
                                </span>
                                <span>{pallet.active ? "Deactivate" : "Activate"}</span>
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>

          {/* Footer note */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-space-sm px-space-md py-3 bg-surface-container-low border-t border-outline-variant/30 text-xs">
            <div className="flex items-center gap-space-xs text-on-surface-variant">
              <span className="material-symbols-outlined text-[16px] text-primary">verified_user</span>
              <span>
                GMP Note: Master records cannot be deleted. Use Deactivate/Reactivate under 21 CFR Part 11 change control.
              </span>
            </div>
            <span className="font-mono text-outline">
              Showing{" "}
              {activeTab === "department"
                ? filteredDepartments.length
                : activeTab === "location"
                ? filteredLocations.length
                : activeTab === "rack"
                ? filteredRacks.length
                : filteredPallets.length}{" "}
              records
            </span>
          </div>
        </div>

        {/* Modal: Add Entity */}
        <Modal
          isOpen={addModalOpen}
          onClose={() => setAddModalOpen(false)}
          title={`Add New ${activeTab.toUpperCase()}`}
          maxWidth="md"
        >
          <div className="flex flex-col gap-4 text-left">
            <div>
              <label className="block font-label-md text-xs font-semibold text-on-surface mb-1">
                Entity Code <span className="text-red-600">*</span>
              </label>
              <input
                value={formData.code}
                onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                placeholder={activeTab === "rack" ? "RK-CR01-004" : activeTab === "pallet" ? "PL-26-000113" : "CODE"}
                className="w-full min-h-[40px] px-3 rounded-lg bg-surface-container-low border border-outline-variant/40 font-mono text-sm focus:outline-none focus:border-primary"
              />
            </div>

            {(activeTab === "department" || activeTab === "location") && (
              <div>
                <label className="block font-label-md text-xs font-semibold text-on-surface mb-1">
                  Entity Name <span className="text-red-600">*</span>
                </label>
                <input
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Official cleanroom department or area title"
                  className="w-full min-h-[40px] px-3 rounded-lg bg-surface-container-low border border-outline-variant/40 text-sm focus:outline-none focus:border-primary"
                />
              </div>
            )}

            {activeTab === "location" && (
              <div>
                <label className="block font-label-md text-xs font-semibold text-on-surface mb-1">
                  Location Type <span className="text-red-600">*</span>
                </label>
                <select
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value as any })}
                  className="w-full min-h-[40px] px-3 rounded-lg bg-surface-container-low border border-outline-variant/40 text-sm focus:outline-none focus:border-primary"
                >
                  <option value="COLD_ROOM">Cold Room Chamber (+2°C to +8°C)</option>
                  <option value="AREA">Process Area (Cleanroom Line)</option>
                </select>
              </div>
            )}

            {activeTab === "rack" && (
              <div>
                <label className="block font-label-md text-xs font-semibold text-on-surface mb-1">
                  Cold Room Location <span className="text-red-600">*</span>
                </label>
                <select
                  value={formData.coldRoomId}
                  onChange={(e) => setFormData({ ...formData, coldRoomId: e.target.value })}
                  className="w-full min-h-[40px] px-3 rounded-lg bg-surface-container-low border border-outline-variant/40 text-sm focus:outline-none focus:border-primary"
                >
                  {locations
                    .filter((l) => l.type === "COLD_ROOM")
                    .map((l) => (
                      <option key={l.id} value={l.id}>
                        {l.code} — {l.name}
                      </option>
                    ))}
                </select>
              </div>
            )}

            {activeTab === "pallet" && (
              <div>
                <label className="block font-label-md text-xs font-semibold text-on-surface mb-1">
                  Initial Assigned Rack (Optional)
                </label>
                <select
                  value={formData.rackId}
                  onChange={(e) => setFormData({ ...formData, rackId: e.target.value })}
                  className="w-full min-h-[40px] px-3 rounded-lg bg-surface-container-low border border-outline-variant/40 text-sm focus:outline-none focus:border-primary"
                >
                  <option value="">-- Unassigned (Floor / Transit) --</option>
                  {racks.map((r) => (
                    <option key={r.id} value={r.id}>
                      {r.code} ({r.coldRoomId})
                    </option>
                  ))}
                </select>
              </div>
            )}

            {(activeTab === "rack" || activeTab === "pallet") && (
              <div>
                <label className="block font-label-md text-xs font-semibold text-on-surface mb-1">
                  Barcode (Leave blank to auto-generate from active format)
                </label>
                <input
                  value={formData.barcode}
                  onChange={(e) => setFormData({ ...formData, barcode: e.target.value.toUpperCase() })}
                  placeholder="Auto-generated if blank"
                  className="w-full min-h-[40px] px-3 rounded-lg bg-surface-container-low border border-outline-variant/40 font-mono text-sm focus:outline-none focus:border-primary"
                />
              </div>
            )}

            <div>
              <label className="block font-label-md text-xs font-semibold text-on-surface mb-1">
                Reason for Change (21 CFR Part 11) <span className="text-red-600">*</span>
              </label>
              <textarea
                value={formData.reason}
                onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                rows={2}
                placeholder="Document official business justification for creating this record..."
                className="w-full p-2.5 rounded-lg bg-surface-container-low border border-outline-variant/40 text-xs focus:outline-none focus:border-primary"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <Button variant="secondary" size="sm" onClick={() => setAddModalOpen(false)}>
                Cancel
              </Button>
              <Button variant="primary" size="sm" onClick={handleSaveAdd} loading={loading}>
                Create Record
              </Button>
            </div>
          </div>
        </Modal>

        {/* Modal: Edit Entity */}
        <Modal
          isOpen={editModalOpen}
          onClose={() => setEditModalOpen(false)}
          title={`Edit ${activeTab.toUpperCase()}: ${selectedEntity?.code}`}
          maxWidth="md"
        >
          <div className="flex flex-col gap-4 text-left">
            <div>
              <label className="block font-label-md text-xs font-semibold text-on-surface mb-1">
                Entity Code (Immutable identifier)
              </label>
              <input
                disabled
                value={formData.code}
                className="w-full min-h-[40px] px-3 rounded-lg bg-surface-container-high border border-outline-variant/40 font-mono text-sm opacity-75 cursor-not-allowed"
              />
            </div>

            {(activeTab === "department" || activeTab === "location") && (
              <div>
                <label className="block font-label-md text-xs font-semibold text-on-surface mb-1">
                  Name / Title <span className="text-red-600">*</span>
                </label>
                <input
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full min-h-[40px] px-3 rounded-lg bg-surface-container-low border border-outline-variant/40 text-sm focus:outline-none focus:border-primary"
                />
              </div>
            )}

            {activeTab === "rack" && (
              <div>
                <label className="block font-label-md text-xs font-semibold text-on-surface mb-1">
                  Cold Room Assignment
                </label>
                <select
                  value={formData.coldRoomId}
                  onChange={(e) => setFormData({ ...formData, coldRoomId: e.target.value })}
                  className="w-full min-h-[40px] px-3 rounded-lg bg-surface-container-low border border-outline-variant/40 text-sm focus:outline-none focus:border-primary"
                >
                  {locations
                    .filter((l) => l.type === "COLD_ROOM")
                    .map((l) => (
                      <option key={l.id} value={l.id}>
                        {l.code} — {l.name}
                      </option>
                    ))}
                </select>
              </div>
            )}

            {activeTab === "pallet" && (
              <div>
                <label className="block font-label-md text-xs font-semibold text-on-surface mb-1">
                  Assigned Rack
                </label>
                <select
                  value={formData.rackId}
                  onChange={(e) => setFormData({ ...formData, rackId: e.target.value })}
                  className="w-full min-h-[40px] px-3 rounded-lg bg-surface-container-low border border-outline-variant/40 text-sm focus:outline-none focus:border-primary"
                >
                  <option value="">-- Unassigned --</option>
                  {racks.map((r) => (
                    <option key={r.id} value={r.id}>
                      {r.code} ({r.coldRoomId})
                    </option>
                  ))}
                </select>
              </div>
            )}

            {(activeTab === "rack" || activeTab === "pallet") && (
              <div>
                <label className="block font-label-md text-xs font-semibold text-on-surface mb-1">
                  Barcode (R10: Changing requires mandatory GMP re-qualification)
                </label>
                <input
                  value={formData.barcode}
                  onChange={(e) => setFormData({ ...formData, barcode: e.target.value.toUpperCase() })}
                  className="w-full min-h-[40px] px-3 rounded-lg bg-surface-container-low border border-outline-variant/40 font-mono text-sm focus:outline-none focus:border-primary"
                />
              </div>
            )}

            <div>
              <label className="block font-label-md text-xs font-semibold text-on-surface mb-1">
                Reason for Change (21 CFR Part 11) <span className="text-red-600">*</span>
              </label>
              <textarea
                value={formData.reason}
                onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                rows={2}
                placeholder="Specify justification for this master update..."
                className="w-full p-2.5 rounded-lg bg-surface-container-low border border-outline-variant/40 text-xs focus:outline-none focus:border-primary"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <Button variant="secondary" size="sm" onClick={() => setEditModalOpen(false)}>
                Cancel
              </Button>
              <Button variant="primary" size="sm" onClick={handleSaveEdit} loading={loading}>
                Save Changes
              </Button>
            </div>
          </div>
        </Modal>

        {/* Modal: Status Change */}
        <Modal
          isOpen={statusModalOpen}
          onClose={() => setStatusModalOpen(false)}
          title={`${statusAction === "ACTIVATE" ? "Activate" : "Deactivate"} Record: ${selectedEntity?.code}`}
          maxWidth="sm"
        >
          <div className="flex flex-col gap-3 text-left">
            <p className="text-xs text-on-surface-variant">
              Are you sure you want to {statusAction === "ACTIVATE" ? "activate" : "deactivate"}{" "}
              <strong className="text-on-surface">{selectedEntity?.code}</strong>? Deactivated master records cannot be
              assigned to new movements or containers.
            </p>

            <div>
              <label className="block font-label-md text-xs font-semibold text-on-surface mb-1">
                Reason for Status Change <span className="text-red-600">*</span>
              </label>
              <textarea
                value={statusReason}
                onChange={(e) => setStatusReason(e.target.value)}
                rows={2}
                placeholder="Mandatory regulatory reason..."
                className="w-full p-2.5 rounded-lg bg-surface-container-low border border-outline-variant/40 text-xs focus:outline-none focus:border-primary"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <Button variant="secondary" size="sm" onClick={() => setStatusModalOpen(false)}>
                Cancel
              </Button>
              <Button
                variant={statusAction === "ACTIVATE" ? "primary" : "destructive"}
                size="sm"
                onClick={handleConfirmStatus}
                loading={statusSubmitting}
              >
                Confirm {statusAction === "ACTIVATE" ? "Activation" : "Deactivation"}
              </Button>
            </div>
          </div>
        </Modal>

        {/* Modal: Print Label */}
        <Modal
          isOpen={printModalOpen}
          onClose={() => setPrintModalOpen(false)}
          title={`Print Cleanroom Label — ${selectedEntity?.code}`}
          maxWidth="sm"
        >
          <div className="flex flex-col gap-4 text-left">
            <div className="p-3 rounded-lg bg-surface-container-low border border-outline-variant/30 flex items-center justify-between">
              <div>
                <span className="font-caption text-xs text-on-surface-variant uppercase">Barcode</span>
                <div className="font-mono font-bold text-primary text-sm">
                  {selectedEntity?.barcode || selectedEntity?.code}
                </div>
              </div>
              <span className="font-mono text-xs px-2 py-0.5 rounded bg-primary-fixed text-on-primary-fixed font-bold">
                CODE 128
              </span>
            </div>

            <div>
              <label className="block font-label-md text-xs font-semibold text-on-surface mb-1">
                Label Format Preset
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setPrintPreset("50x25")}
                  className={`p-2.5 rounded-lg text-left border transition-all ${
                    printPreset === "50x25"
                      ? "bg-primary text-on-primary border-primary shadow-xs"
                      : "bg-surface-container-low text-on-surface border-outline-variant/40"
                  }`}
                >
                  <div className="font-bold text-xs">50 × 25 mm</div>
                  <div className="text-[10px] opacity-80">Rack / Vial standard</div>
                </button>

                <button
                  type="button"
                  onClick={() => setPrintPreset("100x50")}
                  className={`p-2.5 rounded-lg text-left border transition-all ${
                    printPreset === "100x50"
                      ? "bg-primary text-on-primary border-primary shadow-xs"
                      : "bg-surface-container-low text-on-surface border-outline-variant/40"
                  }`}
                >
                  <div className="font-bold text-xs">100 × 50 mm</div>
                  <div className="text-[10px] opacity-80">Pallet / Carton large</div>
                </button>
              </div>
            </div>

            <div>
              <label className="block font-label-md text-xs font-semibold text-on-surface mb-1">
                Reason for Label Print (21 CFR Part 11) <span className="text-red-600">*</span>
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
                onClick={handleExecutePrint}
                loading={printSubmitting}
                icon="print"
              >
                Print Label (PDF)
              </Button>
            </div>
          </div>
        </Modal>

        {/* Modal: Generate Barcodes Bulk */}
        <Modal
          isOpen={generateModalOpen}
          onClose={() => setGenerateModalOpen(false)}
          title={`Generate ${generateEntity} Barcodes`}
          maxWidth="md"
        >
          <div className="flex flex-col gap-4 text-left">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-label-md text-xs font-semibold text-on-surface mb-1">
                  Target Entity
                </label>
                <select
                  value={generateEntity}
                  onChange={(e) => {
                    setGenerateEntity(e.target.value as any);
                    setGeneratedBatch([]);
                  }}
                  className="w-full min-h-[40px] px-3 rounded-lg bg-surface-container-low border border-outline-variant/40 text-sm focus:outline-none"
                >
                  <option value="PALLET">Pallet (PL-YY-NNNNNN)</option>
                  <option value="RACK">Rack (RK-LOC-NNN)</option>
                </select>
              </div>

              <div>
                <label className="block font-label-md text-xs font-semibold text-on-surface mb-1">
                  Quantity (1 to 50)
                </label>
                <input
                  type="number"
                  min="1"
                  max="50"
                  value={generateQty}
                  onChange={(e) => setGenerateQty(parseInt(e.target.value, 10) || 1)}
                  className="w-full min-h-[40px] px-3 rounded-lg bg-surface-container-low border border-outline-variant/40 text-sm focus:outline-none"
                />
              </div>
            </div>

            {generateEntity === "RACK" && (
              <div>
                <label className="block font-label-md text-xs font-semibold text-on-surface mb-1">
                  Chamber / Zone Prefix
                </label>
                <select
                  value={generateColdRoom}
                  onChange={(e) => setGenerateColdRoom(e.target.value)}
                  className="w-full min-h-[40px] px-3 rounded-lg bg-surface-container-low border border-outline-variant/40 text-sm focus:outline-none"
                >
                  {locations
                    .filter((l) => l.type === "COLD_ROOM")
                    .map((l) => (
                      <option key={l.id} value={l.code}>
                        {l.code} ({l.name})
                      </option>
                    ))}
                </select>
              </div>
            )}

            <div>
              <label className="block font-label-md text-xs font-semibold text-on-surface mb-1">
                Reason for Batch Generation <span className="text-red-600">*</span>
              </label>
              <textarea
                value={generateReason}
                onChange={(e) => setGenerateReason(e.target.value)}
                rows={2}
                placeholder="Reason for sequential barcode generation..."
                className="w-full p-2.5 rounded-lg bg-surface-container-low border border-outline-variant/40 text-xs focus:outline-none"
              />
            </div>

            {generatedBatch.length > 0 && (
              <div className="flex flex-col gap-2 p-3 rounded-lg bg-surface-container-low border border-outline-variant/40 max-h-48 overflow-y-auto">
                <span className="font-caption text-xs text-on-surface-variant uppercase font-semibold">
                  Generated Unique Sequential Barcodes ({generatedBatch.length})
                </span>
                <div className="grid grid-cols-2 gap-1 font-mono text-xs select-all">
                  {generatedBatch.map((bc, idx) => (
                    <div key={idx} className="p-1 rounded bg-surface-container-lowest border border-outline-variant/20 px-2">
                      {bc}
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="flex justify-between items-center pt-2">
              <Button
                variant="secondary"
                size="sm"
                onClick={handleExecuteGenerateBulk}
                loading={generateSubmitting}
                icon="refresh"
              >
                {generatedBatch.length > 0 ? "Re-generate" : "Generate Barcodes"}
              </Button>

              <div className="flex gap-2">
                <Button variant="secondary" size="sm" onClick={() => setGenerateModalOpen(false)}>
                  Close
                </Button>
                {generatedBatch.length > 0 && (
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={handleCommitBatchToMasters}
                    loading={generateSubmitting}
                    icon="add_circle"
                  >
                    Add {generatedBatch.length} to Masters
                  </Button>
                )}
              </div>
            </div>
          </div>
        </Modal>

        {/* Audit Drawer */}
        <RecordAuditDrawer
          isOpen={!!auditDrawerEntityId}
          onClose={() => setAuditDrawerEntityId(null)}
          entityId={auditDrawerEntityId || ""}
          entityTitle={auditDrawerTitle}
          entityType={activeTab.toUpperCase()}
        />
      </div>
    </AppLayout>
  );
}
