"use client";

import React, { useState, useEffect, useMemo } from "react";
import AppLayout from "@/components/layout/AppLayout";
import StatusPill from "@/components/ui/StatusPill";
import Button from "@/components/ui/Button";
import Modal from "@/components/ui/Modal";
import {
  WorkflowStage,
  HoldRule,
  SignRoute,
  SignRouteStep,
  Role,
  StageKind,
  ESignMeaning,
} from "@/domain/types";
import { mockApi } from "@/api";
import { useSession } from "@/services/session";
import { can } from "@/services/permission";
import { useToast } from "@/components/ui/Toast";
import {
  validateWorkflowStages,
  validateHoldRules,
  validateSignRoute,
  minutesToHhMm,
  hhMmToMinutes,
} from "@/domain/workflow";
import { TermsDictionary } from "@/config/terms";

export type WorkflowTab = "stages" | "hold-rules" | "sign-route" | "general";

interface WorkflowConfigPageProps {
  initialTab?: WorkflowTab;
}

export default function WorkflowConfigPage({ initialTab = "stages" }: WorkflowConfigPageProps) {
  const { currentUser, currentRole, terms, term } = useSession();
  const { showToast } = useToast();

  const [activeTab, setActiveTab] = useState<WorkflowTab>(initialTab);
  const [loading, setLoading] = useState(false);

  // Data states
  const [stages, setStages] = useState<WorkflowStage[]>([]);
  const [holdRules, setHoldRules] = useState<HoldRule[]>([]);
  const [signRoute, setSignRoute] = useState<SignRoute>({ steps: [] });
  const [storageDetail, setStorageDetail] = useState<string>("cold_room_rack_pallet");
  const [companyProfile, setCompanyProfile] = useState<{
    companyName: string;
    divisionName: string;
    facilityCode: string;
    address: string;
  }>({
    companyName: "",
    divisionName: "",
    facilityCode: "",
    address: "",
  });
  const [termsForm, setTermsForm] = useState<TermsDictionary>({ ...terms });

  // Versions
  const [workflowVersion, setWorkflowVersion] = useState<number>(1);

  // --- STAGES EDIT / ADD MODAL ---
  const [stageModalOpen, setStageModalOpen] = useState(false);
  const [stageModalMode, setStageModalMode] = useState<"ADD" | "EDIT">("ADD");
  const [editingStageId, setEditingStageId] = useState<string | null>(null);
  const [stageFormData, setStageFormData] = useState<{
    id: string;
    name: string;
    kind: StageKind;
    allowedRoles: Role[];
    remarksRequired: boolean;
    nextStageIds: string[];
  }>({
    id: "",
    name: "",
    kind: "PROCESS",
    allowedRoles: ["INITIATOR"],
    remarksRequired: true,
    nextStageIds: [],
  });

  // --- HOLD RULE EDIT / ADD MODAL ---
  const [holdModalOpen, setHoldModalOpen] = useState(false);
  const [holdModalMode, setHoldModalMode] = useState<"ADD" | "EDIT">("ADD");
  const [editingHoldId, setEditingHoldId] = useState<string | null>(null);
  const [holdFormData, setHoldFormData] = useState<{
    id: string;
    name: string;
    startTrigger: string;
    stopTrigger: string;
    limitHhMm: string;
    warnAtPercent: number;
    productFilter: string;
    active: boolean;
  }>({
    id: "",
    name: "",
    startTrigger: "",
    stopTrigger: "",
    limitHhMm: "01:00",
    warnAtPercent: 80,
    productFilter: "",
    active: true,
  });

  // --- SIGN ROUTE STEP EDIT / ADD MODAL ---
  const [signStepModalOpen, setSignStepModalOpen] = useState(false);
  const [signStepModalMode, setSignStepModalMode] = useState<"ADD" | "EDIT">("ADD");
  const [editingSignStepOrder, setEditingSignStepOrder] = useState<number | null>(null);
  const [signStepFormData, setSignStepFormData] = useState<SignRouteStep>({
    order: 1,
    meaning: "INITIATOR",
    role: "INITIATOR",
    required: true,
  });

  // --- REASON FOR CHANGE & ACTION CONFIRM MODAL ---
  const [reasonModalOpen, setReasonModalOpen] = useState(false);
  const [reasonActionType, setReasonActionType] = useState<
    "SAVE_STAGES" | "SAVE_HOLD_RULES" | "SAVE_SIGN_ROUTE" | "SAVE_GENERAL" | "IMPORT_CONFIG" | null
  >(null);
  const [reasonText, setReasonText] = useState("");
  const [reasonSubmitting, setReasonSubmitting] = useState(false);
  const [pendingImportPayload, setPendingImportPayload] = useState<any>(null);

  // Permissions: Allow if currentRole is ADMIN or user has admin group / workflow.configure
  const canConfigure = currentRole === "ADMIN" || (currentUser?.groupIds?.includes("group-admin") ?? false) || can(currentUser, "workflow.configure");

  // Load All Configuration
  const loadAllConfig = async () => {
    setLoading(true);
    try {
      const [stagesRes, holdRes, routeRes, storageRes, companyRes, termsRes] = await Promise.all([
        mockApi.getWorkflowStages(),
        mockApi.getHoldRules(),
        mockApi.getSignRoute(),
        mockApi.getStorageDetailLevel(),
        mockApi.getCompanyProfile(),
        mockApi.getTerms(),
      ]);

      if (stagesRes.ok && stagesRes.data) {
        setStages(stagesRes.data);
      }
      if (holdRes.ok && holdRes.data) {
        setHoldRules(holdRes.data);
      }
      if (routeRes.ok && routeRes.data) {
        setSignRoute(routeRes.data);
      }
      if (storageRes.ok && storageRes.data) {
        setStorageDetail(storageRes.data);
      }
      if (companyRes.ok && companyRes.data) {
        setCompanyProfile(companyRes.data);
      }
      if (termsRes.ok && termsRes.data) {
        setTermsForm(termsRes.data);
      }
    } catch (err: any) {
      console.error("Failed to load workflow configuration:", err);
      showToast("error", "Error", "Failed to retrieve workflow configuration.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAllConfig();
  }, []);

  // Keep termsForm initialized from loadAllConfig or initial terms without stomping user input while typing
  useEffect(() => {
    setTermsForm((prev) => ({ ...terms, ...prev }));
  }, []);

  // Available triggers for hold-time rules (Standard movements + STAGE_ENTER/EXIT for existing stages)
  const availableTriggers = useMemo(() => {
    const list = [
      { id: "RECEIVED", label: "Event: RECEIVED (Batch Intake)" },
      { id: "LOAD", label: "Event: LOAD (Cold Room Load)" },
      { id: "UNLOAD", label: "Event: UNLOAD (Cold Room Unload)" },
      { id: "TRANSFER", label: "Event: TRANSFER (Inter-chamber movement)" },
    ];
    for (const stage of stages) {
      list.push({ id: `STAGE_ENTER:${stage.id}`, label: `Stage Enter: ${stage.name} [${stage.id}]` });
      list.push({ id: `STAGE_EXIT:${stage.id}`, label: `Stage Exit: ${stage.name} [${stage.id}]` });
    }
    return list;
  }, [stages]);

  // Stage validation status
  const stageValidation = useMemo(() => validateWorkflowStages(stages), [stages]);
  const holdValidation = useMemo(() => validateHoldRules(holdRules, stages), [holdRules, stages]);
  const signValidation = useMemo(() => validateSignRoute(signRoute), [signRoute]);

  // ==========================================
  // STAGES HANDLERS
  // ==========================================
  const handleOpenAddStage = () => {
    setStageModalMode("ADD");
    setEditingStageId(null);
    setStageFormData({
      id: `stage-${Date.now().toString().slice(-4)}`,
      name: "",
      kind: "PROCESS",
      allowedRoles: ["INITIATOR"],
      remarksRequired: true,
      nextStageIds: [],
    });
    setStageModalOpen(true);
  };

  const handleOpenEditStage = (stage: WorkflowStage) => {
    setStageModalMode("EDIT");
    setEditingStageId(stage.id);
    setStageFormData({
      id: stage.id,
      name: stage.name,
      kind: stage.kind,
      allowedRoles: [...stage.allowedRoles],
      remarksRequired: stage.remarksRequired,
      nextStageIds: [...stage.nextStageIds],
    });
    setStageModalOpen(true);
  };

  const handleSaveStageModal = () => {
    if (!stageFormData.name.trim()) {
      showToast("error", "Validation Error", "Stage name cannot be empty.");
      return;
    }

    if (stageModalMode === "ADD") {
      const newStage: WorkflowStage = {
        ...stageFormData,
        order: stages.length + 1,
      };
      setStages([...stages, newStage]);
      showToast("info", "Stage Added", `Stage "${newStage.name}" added to draft flow.`);
    } else if (stageModalMode === "EDIT" && editingStageId) {
      setStages(
        stages.map((s) =>
          s.id === editingStageId
            ? {
                ...s,
                name: stageFormData.name.trim(),
                kind: stageFormData.kind,
                allowedRoles: stageFormData.allowedRoles,
                remarksRequired: stageFormData.remarksRequired,
                nextStageIds: stageFormData.nextStageIds,
              }
            : s
        )
      );
      showToast("info", "Stage Updated", `Stage "${stageFormData.name}" updated in draft flow.`);
    }
    setStageModalOpen(false);
  };

  const handleRemoveStage = (stageId: string) => {
    const stage = stages.find((s) => s.id === stageId);
    if (!stage) return;

    if (stages.length <= 1) {
      showToast("error", "Validation Error", "Workflow must contain at least one stage.");
      return;
    }

    // Remove stage and remove references from other stages
    const filtered = stages
      .filter((s) => s.id !== stageId)
      .map((s, idx) => ({
        ...s,
        order: idx + 1,
        nextStageIds: s.nextStageIds.filter((id) => id !== stageId),
      }));

    setStages(filtered);
    showToast("info", "Stage Removed", `Stage "${stage.name}" removed from draft.`);
  };

  const handleMoveStage = (index: number, direction: "UP" | "DOWN") => {
    const newStages = [...stages];
    const targetIndex = direction === "UP" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= newStages.length) return;

    const temp = newStages[index];
    newStages[index] = newStages[targetIndex];
    newStages[targetIndex] = temp;

    // renumber orders
    const reordered = newStages.map((s, idx) => ({ ...s, order: idx + 1 }));
    setStages(reordered);
  };

  // ==========================================
  // HOLD RULES HANDLERS
  // ==========================================
  const handleOpenAddHoldRule = () => {
    setHoldModalMode("ADD");
    setEditingHoldId(null);
    setHoldFormData({
      id: `rule-${Date.now().toString().slice(-4)}`,
      name: "",
      startTrigger: availableTriggers[0]?.id || "RECEIVED",
      stopTrigger: availableTriggers[1]?.id || "LOAD",
      limitHhMm: "01:00",
      warnAtPercent: 80,
      productFilter: "",
      active: true,
    });
    setHoldModalOpen(true);
  };

  const handleOpenEditHoldRule = (rule: HoldRule) => {
    setHoldModalMode("EDIT");
    setEditingHoldId(rule.id);
    setHoldFormData({
      id: rule.id,
      name: rule.name,
      startTrigger: rule.startTrigger,
      stopTrigger: rule.stopTrigger,
      limitHhMm: minutesToHhMm(rule.limitMinutes),
      warnAtPercent: rule.warnAtPercent,
      productFilter: rule.productFilter || "",
      active: rule.active,
    });
    setHoldModalOpen(true);
  };

  const handleSaveHoldRuleModal = () => {
    if (!holdFormData.name.trim()) {
      showToast("error", "Validation Error", "Rule name cannot be empty.");
      return;
    }
    const limitMinutes = hhMmToMinutes(holdFormData.limitHhMm);
    if (limitMinutes <= 0) {
      showToast("error", "Validation Error", "Hold time limit must be greater than 0 minutes (format HH:MM).");
      return;
    }

    if (holdModalMode === "ADD") {
      const newRule: HoldRule = {
        id: holdFormData.id,
        name: holdFormData.name.trim(),
        startTrigger: holdFormData.startTrigger,
        stopTrigger: holdFormData.stopTrigger,
        limitMinutes,
        warnAtPercent: Number(holdFormData.warnAtPercent) || 80,
        productFilter: holdFormData.productFilter.trim() || undefined,
        active: holdFormData.active,
      };
      setHoldRules([...holdRules, newRule]);
      showToast("info", "Rule Added", `Hold rule "${newRule.name}" added to draft.`);
    } else if (holdModalMode === "EDIT" && editingHoldId) {
      setHoldRules(
        holdRules.map((r) =>
          r.id === editingHoldId
            ? {
                ...r,
                name: holdFormData.name.trim(),
                startTrigger: holdFormData.startTrigger,
                stopTrigger: holdFormData.stopTrigger,
                limitMinutes,
                warnAtPercent: Number(holdFormData.warnAtPercent) || 80,
                productFilter: holdFormData.productFilter.trim() || undefined,
                active: holdFormData.active,
              }
            : r
        )
      );
      showToast("info", "Rule Updated", `Hold rule "${holdFormData.name}" updated in draft.`);
    }
    setHoldModalOpen(false);
  };

  const handleToggleHoldRuleActive = (ruleId: string) => {
    setHoldRules(
      holdRules.map((r) => (r.id === ruleId ? { ...r, active: !r.active } : r))
    );
  };

  const handleRemoveHoldRule = (ruleId: string) => {
    setHoldRules(holdRules.filter((r) => r.id !== ruleId));
    showToast("info", "Rule Removed", "Hold time rule deleted from draft.");
  };

  // ==========================================
  // SIGN ROUTE HANDLERS
  // ==========================================
  const handleOpenAddSignStep = () => {
    setSignStepModalMode("ADD");
    setEditingSignStepOrder(null);
    setSignStepFormData({
      order: (signRoute.steps.length || 0) + 1,
      meaning: "REVIEW",
      role: "HOD",
      required: true,
    });
    setSignStepModalOpen(true);
  };

  const handleOpenEditSignStep = (step: SignRouteStep) => {
    setSignStepModalMode("EDIT");
    setEditingSignStepOrder(step.order);
    setSignStepFormData({ ...step });
    setSignStepModalOpen(true);
  };

  const handleSaveSignStepModal = () => {
    const existing = [...signRoute.steps];
    if (signStepModalMode === "ADD") {
      existing.push(signStepFormData);
    } else if (signStepModalMode === "EDIT" && editingSignStepOrder !== null) {
      const idx = existing.findIndex((s) => s.order === editingSignStepOrder);
      if (idx >= 0) existing[idx] = signStepFormData;
    }
    // sort and reindex
    existing.sort((a, b) => a.order - b.order);
    const reindexed = existing.map((s, idx) => ({ ...s, order: idx + 1 }));
    setSignRoute({ steps: reindexed });
    setSignStepModalOpen(false);
    showToast("info", "Signature Step Saved", "Signature route updated in draft.");
  };

  const handleRemoveSignStep = (order: number) => {
    const updated = signRoute.steps
      .filter((s) => s.order !== order)
      .map((s, idx) => ({ ...s, order: idx + 1 }));
    setSignRoute({ steps: updated });
    showToast("info", "Step Removed", "Signature route step removed.");
  };

  // ==========================================
  // SAVE / SUBMIT WITH REASON MODAL
  // ==========================================
  const triggerSaveAction = (
    type: "SAVE_STAGES" | "SAVE_HOLD_RULES" | "SAVE_SIGN_ROUTE" | "SAVE_GENERAL"
  ) => {
    setReasonActionType(type);
    setReasonText("");
    setReasonModalOpen(true);
  };

  const handleExecuteSave = async () => {
    if (!currentUser || !reasonActionType) return;
    if (!reasonText.trim() || reasonText.trim().length < 5) {
      showToast("error", "Validation Error", "Mandatory Reason for Change (min 5 characters) must be entered.");
      return;
    }

    setReasonSubmitting(true);
    try {
      if (reasonActionType === "SAVE_STAGES") {
        const res = await mockApi.updateWorkflowStages(stages, currentUser, reasonText.trim());
        if (res.ok && res.data) {
          setStages(res.data.stages);
          setWorkflowVersion(res.data.version);
          showToast("success", "Workflow Published", `Stages updated and hash-sealed as v${res.data.version}.`);
          setReasonModalOpen(false);
        } else if (res.error) {
          showToast("error", "Publication Rejected", res.error.message);
        }
      } else if (reasonActionType === "SAVE_HOLD_RULES") {
        const res = await mockApi.updateHoldRules(holdRules, currentUser, reasonText.trim());
        if (res.ok && res.data) {
          setHoldRules(res.data.rules);
          showToast("success", "Hold Rules Published", `Hold-time rules updated (v${res.data.version}).`);
          setReasonModalOpen(false);
        } else if (res.error) {
          showToast("error", "Save Rejected", res.error.message);
        }
      } else if (reasonActionType === "SAVE_SIGN_ROUTE") {
        const res = await mockApi.updateSignRoute(signRoute, currentUser, reasonText.trim());
        if (res.ok && res.data) {
          setSignRoute(res.data.route);
          showToast("success", "Signature Routing Published", `Route updated (v${res.data.version}).`);
          setReasonModalOpen(false);
        } else if (res.error) {
          showToast("error", "Save Rejected", res.error.message);
        }
      } else if (reasonActionType === "SAVE_GENERAL") {
        const [termsRes, companyRes, storageRes] = await Promise.all([
          mockApi.updateTerms(termsForm, currentUser, reasonText.trim()),
          mockApi.updateCompanyProfile(companyProfile, currentUser, reasonText.trim()),
          mockApi.updateStorageDetailLevel(storageDetail, currentUser, reasonText.trim()),
        ]);

        if (termsRes.ok && companyRes.ok && storageRes.ok) {
          showToast("success", "General Config Saved", "Terminology, company profile, and storage details updated.");
          setReasonModalOpen(false);
        } else {
          showToast("error", "Error", "One or more general configuration settings failed to save.");
        }
      } else if (reasonActionType === "IMPORT_CONFIG" && pendingImportPayload) {
        const res = await mockApi.importFullConfig(pendingImportPayload, currentUser, reasonText.trim());
        if (res.ok) {
          showToast("success", "Config Restored", "Configuration imported and restored successfully.");
          setReasonModalOpen(false);
          setPendingImportPayload(null);
          await loadAllConfig();
        } else if (res.error) {
          showToast("error", "Import Failed", res.error.message);
        }
      }
    } catch (err: any) {
      showToast("error", "Operation Failed", err?.message || "An unexpected error occurred.");
    } finally {
      setReasonSubmitting(false);
    }
  };

  // ==========================================
  // EXPORT / IMPORT CONFIG
  // ==========================================
  const handleExportConfig = async () => {
    try {
      const res = await mockApi.exportFullConfig();
      if (res.ok && res.data) {
        const jsonStr = JSON.stringify(res.data, null, 2);
        const blob = new Blob([jsonStr], { type: "application/json" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `PTS_Config_Export_${new Date().toISOString().slice(0, 10)}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        showToast("success", "Configuration Exported", "Complete JSON configuration package downloaded.");
      } else {
        showToast("error", "Export Failed", res.error?.message || "Failed to export config.");
      }
    } catch (err: any) {
      showToast("error", "Export Error", err?.message || "Failed to download export.");
    }
  };

  const handleImportFileSelected = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const content = event.target?.result as string;
        const parsed = JSON.parse(content);
        if (!parsed || !parsed.configuration) {
          showToast("error", "Invalid File", "Uploaded file does not match PTS configuration format.");
          return;
        }
        setPendingImportPayload(parsed);
        setReasonActionType("IMPORT_CONFIG");
        setReasonText("");
        setReasonModalOpen(true);
      } catch (err) {
        showToast("error", "Parsing Error", "Invalid JSON file syntax.");
      }
    };
    reader.readAsText(file);
    e.target.value = "";
  };

  return (
    <AppLayout screenCode="S22">
      <div className="flex flex-col w-full pb-16 text-left">
        {/* Top Command & Compliance Header */}
        <section className="p-space-lg bg-surface-container-lowest shadow-xs rounded-xl mb-space-md border border-outline-variant/40 flex flex-col gap-space-md">
          <div className="flex flex-wrap items-center justify-between gap-space-sm">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-secondary-container/40 text-on-secondary-container font-mono text-[11px] font-semibold tracking-wider">
                <span className="w-1.5 h-1.5 rounded-full bg-secondary animate-pulse" />
                21 CFR PART 11 VALIDATED PROCESS
              </span>
              <span className="text-outline text-xs">•</span>
              <span className="inline-flex items-center px-2 py-0.5 rounded bg-surface-container-high text-on-surface-variant font-mono text-xs">
                SOP-WFL-002 REV 03
              </span>
              <span className="text-outline text-xs">•</span>
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded bg-primary/10 text-primary font-mono text-xs font-semibold">
                <span className="material-symbols-outlined text-[14px]">schema</span>
                CONFIG VERSION: v{workflowVersion}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 font-mono text-xs font-semibold inline-flex items-center gap-1">
                <span className="material-symbols-outlined text-[14px] text-emerald-700">verified</span>
                STATE: VALIDATED
              </span>
            </div>
          </div>

          <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-space-md">
            <div className="flex flex-col max-w-3xl">
              <h1 className="font-headline-lg text-2xl text-primary font-bold tracking-tight">
                S22 Workflow &amp; Rules Configuration
              </h1>
              <p className="font-body-md text-xs text-on-surface-variant mt-1 leading-relaxed">
                Configure validated stage sequences, allowed transitions, hold-time parameters, and multi-tier cryptographic sign-off rules under strict GMP change control.
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={handleExportConfig}
                className="min-h-[40px] px-3.5 py-2 rounded-lg bg-surface-container-low hover:bg-surface-container text-on-surface font-headline-sm text-xs font-semibold transition-colors flex items-center gap-2 border border-outline-variant/40"
                type="button"
              >
                <span className="material-symbols-outlined text-[18px] text-secondary">download</span>
                <span>Export JSON</span>
              </button>

              <label className="min-h-[40px] px-3.5 py-2 rounded-lg bg-surface-container-low hover:bg-surface-container text-on-surface font-headline-sm text-xs font-semibold transition-colors flex items-center gap-2 border border-outline-variant/40 cursor-pointer">
                <span className="material-symbols-outlined text-[18px] text-secondary">upload</span>
                <span>Import JSON</span>
                <input
                  type="file"
                  accept=".json,application/json"
                  className="hidden"
                  onChange={handleImportFileSelected}
                />
              </label>

              {activeTab === "stages" && (
                <button
                  onClick={() => triggerSaveAction("SAVE_STAGES")}
                  disabled={!canConfigure || !stageValidation.valid}
                  className="min-h-[40px] px-4 py-2 rounded-lg bg-primary hover:bg-primary-container text-on-primary font-headline-sm text-xs font-semibold transition-colors flex items-center gap-2 shadow-xs disabled:opacity-40"
                  type="button"
                >
                  <span className="material-symbols-outlined text-[18px]">verified_user</span>
                  <span>Publish Stages &amp; Seal</span>
                </button>
              )}

              {activeTab === "hold-rules" && (
                <button
                  onClick={() => triggerSaveAction("SAVE_HOLD_RULES")}
                  disabled={!canConfigure || !holdValidation.valid}
                  className="min-h-[40px] px-4 py-2 rounded-lg bg-primary hover:bg-primary-container text-on-primary font-headline-sm text-xs font-semibold transition-colors flex items-center gap-2 shadow-xs disabled:opacity-40"
                  type="button"
                >
                  <span className="material-symbols-outlined text-[18px]">save</span>
                  <span>Save Hold Rules</span>
                </button>
              )}

              {activeTab === "sign-route" && (
                <button
                  onClick={() => triggerSaveAction("SAVE_SIGN_ROUTE")}
                  disabled={!canConfigure || !signValidation.valid}
                  className="min-h-[40px] px-4 py-2 rounded-lg bg-primary hover:bg-primary-container text-on-primary font-headline-sm text-xs font-semibold transition-colors flex items-center gap-2 shadow-xs disabled:opacity-40"
                  type="button"
                >
                  <span className="material-symbols-outlined text-[18px]">draw</span>
                  <span>Save Sign Route</span>
                </button>
              )}

              {activeTab === "general" && (
                <button
                  onClick={() => triggerSaveAction("SAVE_GENERAL")}
                  disabled={!canConfigure}
                  className="min-h-[40px] px-4 py-2 rounded-lg bg-primary hover:bg-primary-container text-on-primary font-headline-sm text-xs font-semibold transition-colors flex items-center gap-2 shadow-xs disabled:opacity-40"
                  type="button"
                >
                  <span className="material-symbols-outlined text-[18px]">tune</span>
                  <span>Save General Config</span>
                </button>
              )}
            </div>
          </div>

          {/* Navigation Tabs Bar */}
          <nav className="flex items-center gap-6 border-t border-outline-variant/30 pt-3 overflow-x-auto select-none">
            <button
              onClick={() => setActiveTab("stages")}
              className={`min-h-[38px] flex items-center gap-2 px-1 font-body-md text-xs font-semibold relative transition-colors ${
                activeTab === "stages"
                  ? "text-primary border-b-2 border-primary pb-2 -mb-px"
                  : "text-on-surface-variant hover:text-on-surface"
              }`}
            >
              <span className="material-symbols-outlined text-[18px]">linear_scale</span>
              <span>Workflow Stages</span>
              <span className="px-2 py-0.5 rounded-full bg-primary/10 text-primary font-mono text-[10px] font-bold">
                {stages.length} Stages
              </span>
            </button>

            <button
              onClick={() => setActiveTab("hold-rules")}
              className={`min-h-[38px] flex items-center gap-2 px-1 font-body-md text-xs font-semibold relative transition-colors ${
                activeTab === "hold-rules"
                  ? "text-primary border-b-2 border-primary pb-2 -mb-px"
                  : "text-on-surface-variant hover:text-on-surface"
              }`}
            >
              <span className="material-symbols-outlined text-[18px]">timelapse</span>
              <span>Hold-time rules</span>
              <span className="px-2 py-0.5 rounded-full bg-secondary/10 text-secondary font-mono text-[10px] font-bold">
                {holdRules.filter((r) => r.active).length} Active
              </span>
            </button>

            <button
              onClick={() => setActiveTab("sign-route")}
              className={`min-h-[38px] flex items-center gap-2 px-1 font-body-md text-xs font-semibold relative transition-colors ${
                activeTab === "sign-route"
                  ? "text-primary border-b-2 border-primary pb-2 -mb-px"
                  : "text-on-surface-variant hover:text-on-surface"
              }`}
            >
              <span className="material-symbols-outlined text-[18px]">draw</span>
              <span>Signature routing</span>
              <span className="px-1.5 py-0.2 rounded bg-surface-container-high text-on-surface-variant font-mono text-[10px]">
                {signRoute.steps.length} Steps
              </span>
            </button>

            <button
              onClick={() => setActiveTab("general")}
              className={`min-h-[38px] flex items-center gap-2 px-1 font-body-md text-xs font-semibold relative transition-colors ${
                activeTab === "general"
                  ? "text-primary border-b-2 border-primary pb-2 -mb-px"
                  : "text-on-surface-variant hover:text-on-surface"
              }`}
            >
              <span className="material-symbols-outlined text-[18px]">tune</span>
              <span>General Settings</span>
              <span className="px-1.5 py-0.2 rounded bg-surface-container-high text-on-surface-variant font-mono text-[10px]">
                Terms &amp; Facility
              </span>
            </button>
          </nav>
        </section>

        {/* ======================================================== */}
        {/* TAB 1: WORKFLOW STAGES */}
        {/* ======================================================== */}
        {activeTab === "stages" && (
          <div className="flex flex-col gap-space-md">
            {/* Validation Banner if invalid */}
            {!stageValidation.valid && (
              <div className="p-3 bg-red-50 border border-red-300 rounded-xl text-red-900 text-xs flex items-start gap-2.5">
                <span className="material-symbols-outlined text-red-600 text-[20px] shrink-0">error</span>
                <div className="flex flex-col gap-1">
                  <span className="font-bold">Workflow Validation Blocked:</span>
                  <ul className="list-disc pl-4 space-y-0.5">
                    {stageValidation.errors.map((err, i) => (
                      <li key={i}>{err}</li>
                    ))}
                  </ul>
                </div>
              </div>
            )}

            {/* Stage Controls Strip */}
            <div className="bg-surface-container-lowest rounded-xl p-space-md shadow-xs border border-outline-variant/40 flex flex-wrap items-center justify-between gap-space-md">
              <div className="flex items-center gap-3">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                <span className="font-headline-sm text-sm font-bold text-on-surface">
                  Sequence Nodes &amp; Permitted Transitions
                </span>
                <span className="font-mono text-xs text-outline">
                  ({stages.length} Nodes • Rule: Exactly 1 START &amp; At least 1 END)
                </span>
              </div>
              <Button
                variant="primary"
                size="sm"
                icon="add_circle"
                onClick={handleOpenAddStage}
                disabled={!canConfigure}
              >
                + Add Stage
              </Button>
            </div>

            {/* Stages Sequence Cards (Horizontal Flow Layout) */}
            <div className="overflow-x-auto pb-4 pt-1">
              <div className="flex items-stretch gap-4 min-w-[1000px]">
                {stages.map((stage, idx) => {
                  const isStart = stage.kind === "START";
                  const isEnd = stage.kind === "END";
                  const isStorage = stage.kind === "STORAGE";

                  return (
                    <div
                      key={stage.id}
                      className={`w-72 bg-surface-container-lowest rounded-xl p-4 flex flex-col justify-between border shadow-xs transition-all relative ${
                        isStart
                          ? "border-emerald-400 bg-emerald-50/20"
                          : isEnd
                          ? "border-purple-400 bg-purple-50/20"
                          : isStorage
                          ? "border-sky-400 bg-sky-50/20"
                          : "border-outline-variant/60"
                      }`}
                    >
                      {/* Card Header */}
                      <div className="flex items-center justify-between pb-2 border-b border-outline-variant/30">
                        <div className="flex items-center gap-1.5">
                          <span className="font-mono text-xs font-bold text-primary">
                            #{stage.order}
                          </span>
                          <span
                            className={`px-1.5 py-0.2 rounded font-mono text-[10px] font-bold uppercase ${
                              isStart
                                ? "bg-emerald-100 text-emerald-800"
                                : isEnd
                                ? "bg-purple-100 text-purple-800"
                                : isStorage
                                ? "bg-sky-100 text-sky-800"
                                : "bg-surface-container text-on-surface-variant"
                            }`}
                          >
                            {stage.kind}
                          </span>
                        </div>
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => handleMoveStage(idx, "UP")}
                            disabled={idx === 0 || !canConfigure}
                            className="w-7 h-7 rounded hover:bg-surface-container flex items-center justify-center text-outline disabled:opacity-20"
                            title="Move left"
                          >
                            <span className="material-symbols-outlined text-[16px]">arrow_back</span>
                          </button>
                          <button
                            onClick={() => handleMoveStage(idx, "DOWN")}
                            disabled={idx === stages.length - 1 || !canConfigure}
                            className="w-7 h-7 rounded hover:bg-surface-container flex items-center justify-center text-outline disabled:opacity-20"
                            title="Move right"
                          >
                            <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                          </button>
                          <button
                            onClick={() => handleOpenEditStage(stage)}
                            disabled={!canConfigure}
                            className="w-7 h-7 rounded hover:bg-surface-container text-on-surface-variant flex items-center justify-center"
                            title="Edit Stage"
                          >
                            <span className="material-symbols-outlined text-[16px]">edit</span>
                          </button>
                          <button
                            onClick={() => handleRemoveStage(stage.id)}
                            disabled={!canConfigure || stages.length <= 1}
                            className="w-7 h-7 rounded hover:bg-red-50 text-red-600 flex items-center justify-center disabled:opacity-20"
                            title="Delete Stage"
                          >
                            <span className="material-symbols-outlined text-[16px]">delete</span>
                          </button>
                        </div>
                      </div>

                      {/* Stage Body */}
                      <div className="py-3 flex flex-col gap-2">
                        <h3 className="font-headline-sm text-sm font-bold text-on-surface leading-tight">
                          {stage.name}
                        </h3>
                        <span className="font-mono text-[11px] text-outline">ID: {stage.id}</span>

                        <div className="bg-surface-container-low p-2 rounded-lg flex flex-col gap-1 text-[11px] font-mono">
                          <div className="flex items-center justify-between">
                            <span className="text-on-surface-variant">Roles:</span>
                            <span className="font-bold text-on-surface">
                              {stage.allowedRoles.join(", ")}
                            </span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-on-surface-variant">Remarks Req:</span>
                            <span
                              className={`font-bold ${
                                stage.remarksRequired ? "text-amber-700" : "text-outline"
                              }`}
                            >
                              {stage.remarksRequired ? "YES (Mandatory)" : "NO"}
                            </span>
                          </div>
                        </div>

                        {/* Transitions */}
                        <div className="mt-1 flex flex-col gap-1">
                          <span className="font-caption text-[10px] text-on-surface-variant uppercase font-bold">
                            Permitted Transitions ({stage.nextStageIds.length}):
                          </span>
                          <div className="flex flex-wrap gap-1">
                            {stage.nextStageIds.length === 0 ? (
                              <span className="text-outline text-[11px] font-mono italic">
                                {isEnd ? "Terminal End Node" : "No outbound transitions"}
                              </span>
                            ) : (
                              stage.nextStageIds.map((nextId) => {
                                const nextStage = stages.find((s) => s.id === nextId);
                                return (
                                  <span
                                    key={nextId}
                                    className="px-2 py-0.5 rounded bg-primary/10 text-primary font-mono text-[10px] font-semibold flex items-center gap-1"
                                  >
                                    <span>→ {nextStage?.name || nextId}</span>
                                  </span>
                                );
                              })
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* TAB 2: HOLD-TIME RULES */}
        {/* ======================================================== */}
        {activeTab === "hold-rules" && (
          <div className="flex flex-col gap-space-md">
            {!holdValidation.valid && (
              <div className="p-3 bg-red-50 border border-red-300 rounded-xl text-red-900 text-xs flex items-start gap-2.5">
                <span className="material-symbols-outlined text-red-600 text-[20px] shrink-0">error</span>
                <div className="flex flex-col gap-1">
                  <span className="font-bold">Hold Rule Validation Errors:</span>
                  <ul className="list-disc pl-4 space-y-0.5">
                    {holdValidation.errors.map((err, i) => (
                      <li key={i}>{err}</li>
                    ))}
                  </ul>
                </div>
              </div>
            )}

            <div className="bg-surface-container-lowest rounded-xl p-space-md shadow-xs border border-outline-variant/40 flex flex-wrap items-center justify-between gap-space-md">
              <div className="flex flex-col">
                <div className="flex items-center gap-2">
                  <span className="font-headline-sm text-sm font-bold text-on-surface">
                    Biological Product Hold-Time Rules &amp; Strict Triggers
                  </span>
                  <span className="px-2 py-0.2 rounded bg-secondary-container text-on-secondary-container font-mono text-[10px] font-bold">
                    SPEC §6 Compliant
                  </span>
                </div>
                <p className="font-body-sm text-xs text-on-surface-variant mt-0.5">
                  Limit entered as HH:MM and stored in minutes. Clocks start on Start Trigger and stop on Stop Trigger.
                </p>
              </div>
              <Button
                variant="primary"
                size="sm"
                icon="add"
                onClick={handleOpenAddHoldRule}
                disabled={!canConfigure}
              >
                + Add Hold Rule
              </Button>
            </div>

            {/* Hold Rules Table */}
            <div className="bg-surface-container-lowest rounded-xl shadow-xs border border-outline-variant/40 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-surface-container-low text-on-surface-variant font-mono text-[11px] uppercase tracking-wider border-b border-outline-variant/40">
                      <th className="py-3 px-3">Rule Name &amp; ID</th>
                      <th className="py-3 px-3">Start Trigger Event</th>
                      <th className="py-3 px-3">Stop Trigger Event</th>
                      <th className="py-3 px-3">Limit (HH:MM / Mins)</th>
                      <th className="py-3 px-3">Warning %</th>
                      <th className="py-3 px-3">Product Filter</th>
                      <th className="py-3 px-3">Status</th>
                      <th className="py-3 px-3 text-right">Controls</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-outline-variant/20">
                    {holdRules.map((rule) => {
                      const limitHhMm = minutesToHhMm(rule.limitMinutes);
                      return (
                        <tr key={rule.id} className="hover:bg-surface-container-low transition-colors">
                          <td className="py-3 px-3">
                            <div className="flex flex-col">
                              <span className="font-bold text-on-surface">{rule.name}</span>
                              <span className="font-mono text-[10px] text-outline">{rule.id}</span>
                            </div>
                          </td>
                          <td className="py-3 px-3 font-mono text-primary font-semibold">
                            <span className="px-2 py-0.5 rounded bg-surface-container">
                              {rule.startTrigger}
                            </span>
                          </td>
                          <td className="py-3 px-3 font-mono text-secondary font-semibold">
                            <span className="px-2 py-0.5 rounded bg-surface-container">
                              {rule.stopTrigger}
                            </span>
                          </td>
                          <td className="py-3 px-3 font-mono font-bold text-on-surface">
                            <span className="px-2 py-1 rounded bg-amber-50 text-amber-900 border border-amber-200">
                              {limitHhMm} ({rule.limitMinutes} min)
                            </span>
                          </td>
                          <td className="py-3 px-3 font-mono font-semibold text-on-surface-variant">
                            {rule.warnAtPercent}%
                          </td>
                          <td className="py-3 px-3 font-mono text-outline">
                            {rule.productFilter ? (
                              <span className="px-1.5 py-0.5 rounded bg-surface-container text-on-surface">
                                {rule.productFilter}
                              </span>
                            ) : (
                              "All Products"
                            )}
                          </td>
                          <td className="py-3 px-3">
                            <button
                              onClick={() => handleToggleHoldRuleActive(rule.id)}
                              disabled={!canConfigure}
                              className={`px-2 py-0.5 rounded-full font-mono text-[10px] font-bold ${
                                rule.active
                                  ? "bg-emerald-100 text-emerald-800"
                                  : "bg-surface-container text-outline"
                              }`}
                            >
                              {rule.active ? "ACTIVE" : "INACTIVE"}
                            </button>
                          </td>
                          <td className="py-3 px-3 text-right">
                            <div className="inline-flex items-center gap-1">
                              <button
                                onClick={() => handleOpenEditHoldRule(rule)}
                                disabled={!canConfigure}
                                className="w-8 h-8 rounded hover:bg-surface-container text-on-surface-variant flex items-center justify-center"
                                title="Edit Rule Parameters"
                              >
                                <span className="material-symbols-outlined text-[16px]">edit</span>
                              </button>
                              <button
                                onClick={() => handleRemoveHoldRule(rule.id)}
                                disabled={!canConfigure}
                                className="w-8 h-8 rounded hover:bg-red-50 text-red-600 flex items-center justify-center"
                                title="Delete Rule"
                              >
                                <span className="material-symbols-outlined text-[16px]">delete</span>
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* TAB 3: SIGNATURE ROUTING */}
        {/* ======================================================== */}
        {activeTab === "sign-route" && (
          <div className="flex flex-col gap-space-md">
            {!signValidation.valid && (
              <div className="p-3 bg-red-50 border border-red-300 rounded-xl text-red-900 text-xs flex items-start gap-2.5">
                <span className="material-symbols-outlined text-red-600 text-[20px] shrink-0">error</span>
                <div className="flex flex-col gap-1">
                  <span className="font-bold">Signature Route Errors:</span>
                  <ul className="list-disc pl-4 space-y-0.5">
                    {signValidation.errors.map((err, i) => (
                      <li key={i}>{err}</li>
                    ))}
                  </ul>
                </div>
              </div>
            )}

            <div className="bg-surface-container-lowest rounded-xl p-space-md shadow-xs border border-outline-variant/40 flex flex-wrap items-center justify-between gap-space-md">
              <div className="flex flex-col">
                <div className="flex items-center gap-2">
                  <span className="font-headline-sm text-sm font-bold text-on-surface">
                    21 CFR Part 11 Electronic Signature Sequential Routing
                  </span>
                  <span className="px-2 py-0.2 rounded bg-primary/10 text-primary font-mono text-[10px] font-bold">
                    Chain-of-Custody Sign-Off
                  </span>
                </div>
                <p className="font-body-sm text-xs text-on-surface-variant mt-0.5">
                  Sign-off manifests unlock sequentially once the batch binder transitions into an END stage.
                </p>
              </div>
              <Button
                variant="primary"
                size="sm"
                icon="add"
                onClick={handleOpenAddSignStep}
                disabled={!canConfigure}
              >
                + Add Step
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {signRoute.steps.map((step) => (
                <div
                  key={step.order}
                  className="bg-surface-container-lowest rounded-xl border border-outline-variant/50 p-4 shadow-xs flex flex-col justify-between"
                >
                  <div className="flex items-center justify-between pb-2 border-b border-outline-variant/30">
                    <span className="px-2 py-0.5 rounded bg-primary font-mono text-[11px] font-bold text-on-primary">
                      TIER {step.order}
                    </span>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => handleOpenEditSignStep(step)}
                        disabled={!canConfigure}
                        className="w-7 h-7 rounded hover:bg-surface-container text-on-surface-variant flex items-center justify-center"
                      >
                        <span className="material-symbols-outlined text-[15px]">edit</span>
                      </button>
                      <button
                        onClick={() => handleRemoveSignStep(step.order)}
                        disabled={!canConfigure || signRoute.steps.length <= 1}
                        className="w-7 h-7 rounded hover:bg-red-50 text-red-600 flex items-center justify-center disabled:opacity-20"
                      >
                        <span className="material-symbols-outlined text-[15px]">delete</span>
                      </button>
                    </div>
                  </div>

                  <div className="py-4 flex flex-col gap-2">
                    <div className="flex items-center justify-between">
                      <span className="font-caption text-xs text-on-surface-variant">Meaning:</span>
                      <span className="font-mono text-xs font-bold text-primary">
                        {step.meaning}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="font-caption text-xs text-on-surface-variant">Required Role:</span>
                      <span className="font-mono text-xs font-bold text-secondary">
                        {step.role}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="font-caption text-xs text-on-surface-variant">Mandatory:</span>
                      <span className="font-mono text-xs font-bold text-on-surface">
                        {step.required ? "YES" : "OPTIONAL"}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* TAB 4: GENERAL SETTINGS */}
        {/* ======================================================== */}
        {activeTab === "general" && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-space-md">
            {/* Terminology Customization */}
            <div className="bg-surface-container-lowest rounded-xl p-space-md shadow-xs border border-outline-variant/40 flex flex-col gap-3">
              <div className="flex items-center justify-between pb-2 border-b border-outline-variant/30">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary text-[20px]">translate</span>
                  <h3 className="font-headline-sm text-sm font-bold text-on-surface">
                    Config-First Terminology Dictionary (§4)
                  </h3>
                </div>
                <span className="font-mono text-[10px] text-outline">Updates every page dynamically</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div>
                  <label className="font-caption text-[11px] font-bold text-on-surface uppercase">
                    Singular Binder Term
                  </label>
                  <input
                    type="text"
                    className="w-full mt-1 p-2 bg-surface-container-low border border-outline-variant/60 rounded-lg font-mono text-xs"
                    value={termsForm.binder}
                    onChange={(e) => setTermsForm({ ...termsForm, binder: e.target.value })}
                  />
                </div>
                <div>
                  <label className="font-caption text-[11px] font-bold text-on-surface uppercase">
                    Plural Binders Term
                  </label>
                  <input
                    type="text"
                    className="w-full mt-1 p-2 bg-surface-container-low border border-outline-variant/60 rounded-lg font-mono text-xs"
                    value={termsForm.binders}
                    onChange={(e) => setTermsForm({ ...termsForm, binders: e.target.value })}
                  />
                </div>
                <div>
                  <label className="font-caption text-[11px] font-bold text-on-surface uppercase">
                    Cold Room Term
                  </label>
                  <input
                    type="text"
                    className="w-full mt-1 p-2 bg-surface-container-low border border-outline-variant/60 rounded-lg font-mono text-xs"
                    value={termsForm.coldRoom}
                    onChange={(e) => setTermsForm({ ...termsForm, coldRoom: e.target.value })}
                  />
                </div>
                <div>
                  <label className="font-caption text-[11px] font-bold text-on-surface uppercase">
                    Rack Term
                  </label>
                  <input
                    type="text"
                    className="w-full mt-1 p-2 bg-surface-container-low border border-outline-variant/60 rounded-lg font-mono text-xs"
                    value={termsForm.rack}
                    onChange={(e) => setTermsForm({ ...termsForm, rack: e.target.value })}
                  />
                </div>
                <div>
                  <label className="font-caption text-[11px] font-bold text-on-surface uppercase">
                    Pallet Term
                  </label>
                  <input
                    type="text"
                    className="w-full mt-1 p-2 bg-surface-container-low border border-outline-variant/60 rounded-lg font-mono text-xs"
                    value={termsForm.pallet}
                    onChange={(e) => setTermsForm({ ...termsForm, pallet: e.target.value })}
                  />
                </div>
                <div>
                  <label className="font-caption text-[11px] font-bold text-on-surface uppercase">
                    Hold Time Term
                  </label>
                  <input
                    type="text"
                    className="w-full mt-1 p-2 bg-surface-container-low border border-outline-variant/60 rounded-lg font-mono text-xs"
                    value={termsForm.holdTime}
                    onChange={(e) => setTermsForm({ ...termsForm, holdTime: e.target.value })}
                  />
                </div>
              </div>

              <div className="pt-3 border-t border-outline-variant/30 flex justify-end">
                <Button
                  variant="primary"
                  size="sm"
                  icon="check"
                  onClick={() => triggerSaveAction("SAVE_GENERAL")}
                  disabled={!canConfigure}
                >
                  Save &amp; Apply Terms
                </Button>
              </div>
            </div>

            {/* Storage Detail & Company Profile */}
            <div className="flex flex-col gap-space-md">
              {/* Storage Detail Level */}
              <div className="bg-surface-container-lowest rounded-xl p-space-md shadow-xs border border-outline-variant/40 flex flex-col gap-3">
                <div className="flex items-center gap-2 pb-2 border-b border-outline-variant/30">
                  <span className="material-symbols-outlined text-secondary text-[20px]">warehouse</span>
                  <h3 className="font-headline-sm text-sm font-bold text-on-surface">
                    Storage Detail Resolution Level
                  </h3>
                </div>
                <div className="space-y-2 text-xs">
                  {[
                    { val: "cold_room_only", label: "Cold Room Only (Chamber level)" },
                    { val: "cold_room_rack", label: "Cold Room + Rack" },
                    { val: "cold_room_rack_pallet", label: "Cold Room + Rack + Pallet (Recommended Cleanroom Granularity)" },
                  ].map((opt) => (
                    <label key={opt.val} className="flex items-center gap-2 cursor-pointer font-body-sm">
                      <input
                        type="radio"
                        name="storageDetail"
                        value={opt.val}
                        checked={storageDetail === opt.val}
                        onChange={(e) => setStorageDetail(e.target.value)}
                        className="text-primary focus:ring-primary"
                      />
                      <span className="text-on-surface">{opt.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Company Profile */}
              <div className="bg-surface-container-lowest rounded-xl p-space-md shadow-xs border border-outline-variant/40 flex flex-col gap-3">
                <div className="flex items-center gap-2 pb-2 border-b border-outline-variant/30">
                  <span className="material-symbols-outlined text-primary text-[20px]">domain</span>
                  <h3 className="font-headline-sm text-sm font-bold text-on-surface">
                    Company &amp; Facility Profile
                  </h3>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div>
                    <label className="font-caption text-[11px] font-bold text-on-surface uppercase">
                      Company Legal Name
                    </label>
                    <input
                      type="text"
                      className="w-full mt-1 p-2 bg-surface-container-low border border-outline-variant/60 rounded-lg text-xs"
                      value={companyProfile.companyName}
                      onChange={(e) =>
                        setCompanyProfile({ ...companyProfile, companyName: e.target.value })
                      }
                    />
                  </div>
                  <div>
                    <label className="font-caption text-[11px] font-bold text-on-surface uppercase">
                      Division Name
                    </label>
                    <input
                      type="text"
                      className="w-full mt-1 p-2 bg-surface-container-low border border-outline-variant/60 rounded-lg text-xs"
                      value={companyProfile.divisionName}
                      onChange={(e) =>
                        setCompanyProfile({ ...companyProfile, divisionName: e.target.value })
                      }
                    />
                  </div>
                  <div>
                    <label className="font-caption text-[11px] font-bold text-on-surface uppercase">
                      Facility Code
                    </label>
                    <input
                      type="text"
                      className="w-full mt-1 p-2 bg-surface-container-low border border-outline-variant/60 rounded-lg text-xs font-mono"
                      value={companyProfile.facilityCode}
                      onChange={(e) =>
                        setCompanyProfile({ ...companyProfile, facilityCode: e.target.value })
                      }
                    />
                  </div>
                  <div>
                    <label className="font-caption text-[11px] font-bold text-on-surface uppercase">
                      Facility Physical Address
                    </label>
                    <input
                      type="text"
                      className="w-full mt-1 p-2 bg-surface-container-low border border-outline-variant/60 rounded-lg text-xs"
                      value={companyProfile.address}
                      onChange={(e) =>
                        setCompanyProfile({ ...companyProfile, address: e.target.value })
                      }
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* MODAL: ADD / EDIT STAGE */}
        {/* ======================================================== */}
        <Modal
          isOpen={stageModalOpen}
          onClose={() => setStageModalOpen(false)}
          title={stageModalMode === "ADD" ? "Add Workflow Stage" : "Edit Workflow Stage"}
          badge={stageFormData.id}
          maxWidth="md"
          footer={
            <>
              <Button variant="secondary" size="sm" onClick={() => setStageModalOpen(false)}>
                Cancel
              </Button>
              <Button variant="primary" size="sm" onClick={handleSaveStageModal}>
                Apply to Draft
              </Button>
            </>
          }
        >
          <div className="flex flex-col gap-3 text-xs text-left">
            <div>
              <label className="font-bold uppercase text-[11px]">Stage Name *</label>
              <input
                type="text"
                className="w-full mt-1 p-2 bg-surface-container-low border border-outline-variant/60 rounded-lg font-body-md text-xs"
                value={stageFormData.name}
                onChange={(e) => setStageFormData({ ...stageFormData, name: e.target.value })}
                placeholder="e.g. Quality Quarantine"
              />
            </div>

            <div>
              <label className="font-bold uppercase text-[11px]">Stage Kind *</label>
              <select
                className="w-full mt-1 p-2 bg-surface-container-low border border-outline-variant/60 rounded-lg text-xs"
                value={stageFormData.kind}
                onChange={(e) =>
                  setStageFormData({ ...stageFormData, kind: e.target.value as StageKind })
                }
              >
                <option value="START">START (Batch Intake - exactly one allowed)</option>
                <option value="STORAGE">STORAGE (Cold Room custody)</option>
                <option value="PROCESS">PROCESS (Inspection, Packing)</option>
                <option value="END">END (Final Release / Sign-Off)</option>
              </select>
            </div>

            <div>
              <label className="font-bold uppercase text-[11px]">Allowed Operating Roles</label>
              <div className="flex flex-wrap gap-2 mt-1">
                {(["INITIATOR", "HOD", "QA", "ADMIN"] as Role[]).map((r) => {
                  const isChecked = stageFormData.allowedRoles.includes(r);
                  return (
                    <label key={r} className="flex items-center gap-1.5 cursor-pointer font-mono">
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => {
                          if (isChecked) {
                            setStageFormData({
                              ...stageFormData,
                              allowedRoles: stageFormData.allowedRoles.filter((role) => role !== r),
                            });
                          } else {
                            setStageFormData({
                              ...stageFormData,
                              allowedRoles: [...stageFormData.allowedRoles, r],
                            });
                          }
                        }}
                      />
                      <span>{r}</span>
                    </label>
                  );
                })}
              </div>
            </div>

            <div className="flex items-center gap-2 pt-2">
              <input
                type="checkbox"
                id="remarksRequired"
                checked={stageFormData.remarksRequired}
                onChange={(e) =>
                  setStageFormData({ ...stageFormData, remarksRequired: e.target.checked })
                }
              />
              <label htmlFor="remarksRequired" className="font-bold cursor-pointer">
                Remarks Required on Transition
              </label>
            </div>

            {/* Allowed Next Stages Transitions */}
            <div className="pt-2">
              <label className="font-bold uppercase text-[11px]">
                Allowed Next Stages (Outbound Transitions)
              </label>
              <div className="grid grid-cols-2 gap-2 mt-1 max-h-40 overflow-y-auto p-2 bg-surface-container-low rounded-lg border border-outline-variant/40">
                {stages
                  .filter((s) => s.id !== stageFormData.id)
                  .map((s) => {
                    const isChecked = stageFormData.nextStageIds.includes(s.id);
                    return (
                      <label key={s.id} className="flex items-center gap-1.5 cursor-pointer font-mono">
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => {
                            if (isChecked) {
                              setStageFormData({
                                ...stageFormData,
                                nextStageIds: stageFormData.nextStageIds.filter((id) => id !== s.id),
                              });
                            } else {
                              setStageFormData({
                                ...stageFormData,
                                nextStageIds: [...stageFormData.nextStageIds, s.id],
                              });
                            }
                          }}
                        />
                        <span>{s.name}</span>
                      </label>
                    );
                  })}
              </div>
            </div>
          </div>
        </Modal>

        {/* ======================================================== */}
        {/* MODAL: ADD / EDIT HOLD RULE */}
        {/* ======================================================== */}
        <Modal
          isOpen={holdModalOpen}
          onClose={() => setHoldModalOpen(false)}
          title={holdModalMode === "ADD" ? "Add Hold-Time Rule" : "Edit Hold-Time Rule"}
          badge={holdFormData.id}
          maxWidth="md"
          footer={
            <>
              <Button variant="secondary" size="sm" onClick={() => setHoldModalOpen(false)}>
                Cancel
              </Button>
              <Button variant="primary" size="sm" onClick={handleSaveHoldRuleModal}>
                Apply to Draft
              </Button>
            </>
          }
        >
          <div className="flex flex-col gap-3 text-xs text-left">
            <div>
              <label className="font-bold uppercase text-[11px]">Rule Name *</label>
              <input
                type="text"
                className="w-full mt-1 p-2 bg-surface-container-low border border-outline-variant/60 rounded-lg text-xs"
                value={holdFormData.name}
                onChange={(e) => setHoldFormData({ ...holdFormData, name: e.target.value })}
                placeholder="e.g. Visual inspection maximum hold"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="font-bold uppercase text-[11px]">Start Trigger *</label>
                <select
                  className="w-full mt-1 p-2 bg-surface-container-low border border-outline-variant/60 rounded-lg text-xs font-mono"
                  value={holdFormData.startTrigger}
                  onChange={(e) => setHoldFormData({ ...holdFormData, startTrigger: e.target.value })}
                >
                  {availableTriggers.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="font-bold uppercase text-[11px]">Stop Trigger *</label>
                <select
                  className="w-full mt-1 p-2 bg-surface-container-low border border-outline-variant/60 rounded-lg text-xs font-mono"
                  value={holdFormData.stopTrigger}
                  onChange={(e) => setHoldFormData({ ...holdFormData, stopTrigger: e.target.value })}
                >
                  {availableTriggers.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="font-bold uppercase text-[11px]">Hold Limit (HH:MM) *</label>
                <input
                  type="text"
                  placeholder="01:00"
                  className="w-full mt-1 p-2 bg-surface-container-low border border-outline-variant/60 rounded-lg font-mono text-xs"
                  value={holdFormData.limitHhMm}
                  onChange={(e) => setHoldFormData({ ...holdFormData, limitHhMm: e.target.value })}
                />
                <span className="text-[10px] text-outline font-mono">
                  Stored as {hhMmToMinutes(holdFormData.limitHhMm)} minutes
                </span>
              </div>

              <div>
                <label className="font-bold uppercase text-[11px]">Warning Threshold % *</label>
                <input
                  type="number"
                  min="1"
                  max="99"
                  className="w-full mt-1 p-2 bg-surface-container-low border border-outline-variant/60 rounded-lg font-mono text-xs"
                  value={holdFormData.warnAtPercent}
                  onChange={(e) =>
                    setHoldFormData({ ...holdFormData, warnAtPercent: parseInt(e.target.value, 10) })
                  }
                />
              </div>
            </div>

            <div>
              <label className="font-bold uppercase text-[11px]">Product Filter (Optional)</label>
              <input
                type="text"
                placeholder="Leave empty for all products"
                className="w-full mt-1 p-2 bg-surface-container-low border border-outline-variant/60 rounded-lg text-xs font-mono"
                value={holdFormData.productFilter}
                onChange={(e) => setHoldFormData({ ...holdFormData, productFilter: e.target.value })}
              />
            </div>

            <div className="flex items-center gap-2 pt-1">
              <input
                type="checkbox"
                id="ruleActive"
                checked={holdFormData.active}
                onChange={(e) => setHoldFormData({ ...holdFormData, active: e.target.checked })}
              />
              <label htmlFor="ruleActive" className="font-bold cursor-pointer">
                Rule Active (Enforce real-time timers and telemetry alarms)
              </label>
            </div>
          </div>
        </Modal>

        {/* ======================================================== */}
        {/* MODAL: ADD / EDIT SIGNATURE ROUTE STEP */}
        {/* ======================================================== */}
        <Modal
          isOpen={signStepModalOpen}
          onClose={() => setSignStepModalOpen(false)}
          title={signStepModalMode === "ADD" ? "Add Signature Step" : "Edit Signature Step"}
          badge={`TIER ${signStepFormData.order}`}
          maxWidth="sm"
          footer={
            <>
              <Button variant="secondary" size="sm" onClick={() => setSignStepModalOpen(false)}>
                Cancel
              </Button>
              <Button variant="primary" size="sm" onClick={handleSaveSignStepModal}>
                Apply Step
              </Button>
            </>
          }
        >
          <div className="flex flex-col gap-3 text-xs text-left">
            <div>
              <label className="font-bold uppercase text-[11px]">Step Order *</label>
              <input
                type="number"
                min="1"
                className="w-full mt-1 p-2 bg-surface-container-low border border-outline-variant/60 rounded-lg font-mono text-xs"
                value={signStepFormData.order}
                onChange={(e) =>
                  setSignStepFormData({ ...signStepFormData, order: parseInt(e.target.value, 10) })
                }
              />
            </div>

            <div>
              <label className="font-bold uppercase text-[11px]">Signature Meaning *</label>
              <select
                className="w-full mt-1 p-2 bg-surface-container-low border border-outline-variant/60 rounded-lg text-xs font-mono"
                value={signStepFormData.meaning}
                onChange={(e) =>
                  setSignStepFormData({
                    ...signStepFormData,
                    meaning: e.target.value as ESignMeaning,
                  })
                }
              >
                <option value="INITIATOR">INITIATOR (Record Author / Packaging Floor)</option>
                <option value="REVIEW">REVIEW (Department Review / HOD)</option>
                <option value="APPROVAL">APPROVAL (Quality Assurance / Release)</option>
              </select>
            </div>

            <div>
              <label className="font-bold uppercase text-[11px]">Required Operating Role *</label>
              <select
                className="w-full mt-1 p-2 bg-surface-container-low border border-outline-variant/60 rounded-lg text-xs font-mono"
                value={signStepFormData.role}
                onChange={(e) =>
                  setSignStepFormData({ ...signStepFormData, role: e.target.value as Role })
                }
              >
                <option value="INITIATOR">INITIATOR</option>
                <option value="HOD">HOD</option>
                <option value="QA">QA</option>
                <option value="ADMIN">ADMIN</option>
              </select>
            </div>

            <div className="flex items-center gap-2 pt-1">
              <input
                type="checkbox"
                id="stepRequired"
                checked={signStepFormData.required}
                onChange={(e) =>
                  setSignStepFormData({ ...signStepFormData, required: e.target.checked })
                }
              />
              <label htmlFor="stepRequired" className="font-bold cursor-pointer">
                Mandatory Step for Final Dossier Release
              </label>
            </div>
          </div>
        </Modal>

        {/* ======================================================== */}
        {/* MODAL: MANDATORY REASON FOR CHANGE & HASH-SEALING */}
        {/* ======================================================== */}
        <Modal
          isOpen={reasonModalOpen}
          onClose={() => setReasonModalOpen(false)}
          title="Regulatory Change Control: Mandatory Reason"
          badge="21 CFR §11.10"
          maxWidth="sm"
          footer={
            <>
              <Button variant="secondary" size="sm" onClick={() => setReasonModalOpen(false)}>
                Cancel
              </Button>
              <Button
                variant="primary"
                size="sm"
                onClick={handleExecuteSave}
                loading={reasonSubmitting}
              >
                Commit &amp; Seal
              </Button>
            </>
          }
        >
          <div className="flex flex-col gap-3 text-xs text-left">
            <p className="text-on-surface leading-relaxed">
              Modifying validated workflow parameters, hold-time rules, or configuration settings generates a new configuration version and appends an immutable entry to the SHA-256 audit ledger.
            </p>

            <div className="flex flex-col gap-1 mt-1">
              <label className="font-caption text-[11px] uppercase font-bold text-on-surface">
                Reason for Change (Min 5 characters) <span className="text-red-700">*</span>
              </label>
              <textarea
                required
                rows={3}
                className="w-full bg-surface-container-low border border-outline-variant/60 rounded-lg p-2.5 text-xs text-on-surface focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="State regulatory justification (e.g. SOP-WFL-002 annual review and hold-time adjustment)..."
                value={reasonText}
                onChange={(e) => setReasonText(e.target.value)}
              />
            </div>
          </div>
        </Modal>
      </div>
    </AppLayout>
  );
}
