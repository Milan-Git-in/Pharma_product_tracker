"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import AppLayout from "@/components/layout/AppLayout";
import StatusPill from "@/components/ui/StatusPill";
import Button from "@/components/ui/Button";
import Modal from "@/components/ui/Modal";
import { Group, User, Role } from "@/domain/types";
import { mockApi } from "@/api";
import { useSession } from "@/services/session";
import { can } from "@/services/permission";
import { useToast } from "@/components/ui/Toast";

// Comprehensive modular capability matrix mapping (SPEC §8)
interface ModulePrivilege {
  id: string;
  name: string;
  code: string;
  description: string;
  capabilities: {
    key: string;
    label: string;
    perm: string;
    locked?: boolean;
    lockedReason?: string;
  }[];
}

const MODULE_DEFINITIONS: ModulePrivilege[] = [
  {
    id: "binders",
    name: "Binders",
    code: "MOD_EBR_01",
    description: "Electronic Batch Records & dossiers custody",
    capabilities: [
      { key: "view", label: "View", perm: "binder.view" },
      { key: "create", label: "Create", perm: "binder.create" },
      { key: "edit", label: "Edit", perm: "binder.edit" },
      { key: "export", label: "Export/Print", perm: "report.print" },
      { key: "sign", label: "Sign", perm: "sign.initiator" },
      { key: "configure", label: "Configure", perm: "workflow.configure" },
    ],
  },
  {
    id: "movements",
    name: "Movements",
    code: "MOD_TRANS_02",
    description: "Cold room transfer, load, unload staging",
    capabilities: [
      { key: "view", label: "View", perm: "binder.view" },
      { key: "create", label: "Create (Move)", perm: "movement.perform" },
      { key: "edit", label: "Scan/Lookup", perm: "scan.use" },
      { key: "export", label: "Export/Print", perm: "report.print" },
      { key: "sign", label: "Sign Custody", perm: "sign.initiator" },
      { key: "configure", label: "Configure", perm: "workflow.configure" },
    ],
  },
  {
    id: "reports",
    name: "Reports",
    code: "MOD_REP_S12",
    description: "Compliance dossiers, hold-time logs, S12/S15",
    capabilities: [
      { key: "view", label: "View", perm: "report.view" },
      { key: "create", label: "Generate", perm: "report.generate" },
      { key: "edit", label: "Active Users", perm: "report.active-users" },
      { key: "export", label: "Export PDF", perm: "report.export" },
      { key: "sign", label: "Sign Review", perm: "sign.review" },
      { key: "configure", label: "Print", perm: "report.print" },
    ],
  },
  {
    id: "audit",
    name: "Audit Trail",
    code: "MOD_AUDIT_S17",
    description: "S17 Immutable ledger & cryptographic verification",
    capabilities: [
      { key: "view", label: "View", perm: "audit.view" },
      {
        key: "create",
        label: "Create",
        perm: "audit.create",
        locked: true,
        lockedReason: "System automated only per 21 CFR §11.10(e)",
      },
      {
        key: "edit",
        label: "Edit",
        perm: "audit.edit",
        locked: true,
        lockedReason: "Immutable by CFR §11.10(e): Records cannot be modified or deleted",
      },
      { key: "export", label: "Export/Print", perm: "audit.export" },
      {
        key: "sign",
        label: "Sign",
        perm: "audit.sign",
        locked: true,
        lockedReason: "System hash-sealed automatically",
      },
      {
        key: "configure",
        label: "Configure",
        perm: "audit.configure",
        locked: true,
        lockedReason: "Non-configurable compliance baseline",
      },
    ],
  },
  {
    id: "users",
    name: "Users",
    code: "MOD_USR_S18",
    description: "S18 Directory & account lifecycle management",
    capabilities: [
      { key: "view", label: "View", perm: "user.manage" },
      { key: "create", label: "Create", perm: "user.manage" },
      { key: "edit", label: "Edit / Lock", perm: "user.manage" },
      { key: "export", label: "Export", perm: "user.manage" },
      { key: "sign", label: "Reset PWD", perm: "user.manage" },
      { key: "configure", label: "Configure", perm: "user.manage" },
    ],
  },
  {
    id: "groups",
    name: "Groups & Access",
    code: "MOD_GRP_S19",
    description: "RBAC authority tiers & permission matrices",
    capabilities: [
      { key: "view", label: "View", perm: "group.manage" },
      { key: "create", label: "Create", perm: "group.manage" },
      { key: "edit", label: "Edit Matrix", perm: "group.manage" },
      { key: "export", label: "Export", perm: "group.manage" },
      { key: "sign", label: "Sign-off", perm: "group.manage" },
      { key: "configure", label: "Configure", perm: "group.manage" },
    ],
  },
  {
    id: "masters",
    name: "Masters & Barcodes",
    code: "MOD_SPEC_06",
    description: "Product formulations, racks, pallets, barcode designer",
    capabilities: [
      { key: "view", label: "View", perm: "master.manage" },
      { key: "create", label: "Create", perm: "master.manage" },
      { key: "edit", label: "Edit Masters", perm: "master.manage" },
      { key: "export", label: "Export", perm: "master.manage" },
      { key: "sign", label: "Barcodes", perm: "barcode.manage" },
      { key: "configure", label: "Configure", perm: "master.manage" },
    ],
  },
  {
    id: "workflow",
    name: "Workflow & Hold Rules",
    code: "MOD_WFLOW_07",
    description: "Stage limits, hold-time clock thresholds, SLA rules",
    capabilities: [
      { key: "view", label: "View", perm: "workflow.configure" },
      { key: "create", label: "Create Rule", perm: "workflow.configure" },
      { key: "edit", label: "Edit Stages", perm: "workflow.configure" },
      { key: "export", label: "Export", perm: "workflow.configure" },
      { key: "sign", label: "Routing", perm: "workflow.configure" },
      { key: "configure", label: "Configure", perm: "workflow.configure" },
    ],
  },
  {
    id: "security",
    name: "Security & Policy",
    code: "MOD_SEC_08",
    description: "Authentication policies, backup routines, snapshots",
    capabilities: [
      { key: "view", label: "View", perm: "security.configure" },
      { key: "create", label: "Backup", perm: "backup.manage" },
      { key: "edit", label: "Edit Policy", perm: "security.configure" },
      { key: "export", label: "Export", perm: "backup.manage" },
      { key: "sign", label: "Admin Elevation", perm: "security.configure" },
      { key: "configure", label: "Configure", perm: "security.configure" },
    ],
  },
];

export default function GroupsAccessPage() {
  const { currentUser } = useSession();
  const { showToast } = useToast();

  const [groups, setGroups] = useState<Group[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [selectedGroupId, setSelectedGroupId] = useState<string>("group-admin");
  const [draftPermissions, setDraftPermissions] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  // Group Creation / Edit Modals
  const [groupModalOpen, setGroupModalOpen] = useState(false);
  const [groupModalMode, setGroupModalMode] = useState<"CREATE" | "EDIT">("CREATE");
  const [groupFormName, setGroupFormName] = useState("");
  const [groupFormRole, setGroupFormRole] = useState<Role>("INITIATOR");
  const [groupFormActive, setGroupFormActive] = useState(true);
  const [groupFormReason, setGroupFormReason] = useState("");

  // Save Policy Confirmation Dialog
  const [savePolicyModalOpen, setSavePolicyModalOpen] = useState(false);
  const [policyReason, setPolicyReason] = useState("");

  const hasGroupManage = can(currentUser, "group.manage");

  // Load Groups and Users
  const loadData = async () => {
    setLoading(true);
    try {
      const [groupsRes, usersRes] = await Promise.all([
        mockApi.getGroups(),
        mockApi.getUsers(),
      ]);

      if (groupsRes.ok && groupsRes.data) {
        setGroups(groupsRes.data);
        if (!selectedGroupId && groupsRes.data.length > 0) {
          setSelectedGroupId(groupsRes.data[0].id);
        }
      }
      if (usersRes.ok && usersRes.data) {
        setUsers(usersRes.data);
      }
    } catch (err) {
      console.error("Failed to load groups:", err);
      showToast("error", "Error", "Failed to load role groups.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Currently active selected group
  const activeGroup = useMemo(() => {
    return groups.find((g) => g.id === selectedGroupId) || groups[0] || null;
  }, [groups, selectedGroupId]);

  // Sync draft permissions when selected group changes
  useEffect(() => {
    if (activeGroup) {
      setDraftPermissions([...activeGroup.permissions]);
    }
  }, [activeGroup]);

  // Check if draft has unsaved changes
  const hasUnsavedChanges = useMemo(() => {
    if (!activeGroup) return false;
    if (activeGroup.permissions.length !== draftPermissions.length) return true;
    const activeSet = new Set(activeGroup.permissions);
    return draftPermissions.some((p) => !activeSet.has(p));
  }, [activeGroup, draftPermissions]);

  // Toggle a single permission
  const handleTogglePermission = (perm: string) => {
    if (!hasGroupManage) {
      showToast("error", "Access Denied", "group.manage permission required to adjust policies.");
      return;
    }
    if (draftPermissions.includes(perm)) {
      setDraftPermissions(draftPermissions.filter((p) => p !== perm));
    } else {
      setDraftPermissions([...draftPermissions, perm]);
    }
  };

  // Discard changes
  const handleDiscardChanges = () => {
    if (activeGroup) {
      setDraftPermissions([...activeGroup.permissions]);
      showToast("info", "Changes Discarded", "Reset matrix to current active policy.");
    }
  };

  // Open Save Policy Modal
  const handleOpenSavePolicy = () => {
    if (!hasUnsavedChanges) {
      showToast("info", "No Changes", "No modifications detected in permission matrix.");
      return;
    }
    setPolicyReason("");
    setSavePolicyModalOpen(true);
  };

  // Save Policy Changes
  const handleConfirmSavePolicy = async () => {
    if (!currentUser || !activeGroup) return;

    if (!policyReason.trim() || policyReason.trim().length < 5) {
      showToast("error", "Validation Error", "Mandatory Reason for Change (min 5 characters) must be documented.");
      return;
    }

    setSaving(true);
    try {
      const res = await mockApi.updateGroupPermissions(
        activeGroup.id,
        draftPermissions,
        currentUser,
        policyReason.trim()
      );

      if (res.ok && res.data) {
        showToast(
          "success",
          "Policy Deployed",
          `Permissions for "${activeGroup.name}" updated and sealed in 21 CFR Part 11 audit ledger.`
        );
        setSavePolicyModalOpen(false);
        await loadData();
      } else if (res.error) {
        showToast("error", "Save Failed", res.error.message);
      }
    } catch (err: any) {
      showToast("error", "Error", err?.message || "Failed to save group permissions.");
    } finally {
      setSaving(false);
    }
  };

  // Open Group Create Modal
  const handleOpenCreateGroup = () => {
    setGroupModalMode("CREATE");
    setGroupFormName("");
    setGroupFormRole("INITIATOR");
    setGroupFormActive(true);
    setGroupFormReason("");
    setGroupModalOpen(true);
  };

  // Open Group Edit Modal
  const handleOpenEditGroup = (g: Group) => {
    setGroupModalMode("EDIT");
    setGroupFormName(g.name);
    setGroupFormRole(g.role);
    setGroupFormActive(g.active);
    setGroupFormReason("");
    setGroupModalOpen(true);
  };

  // Save Group (Create / Edit)
  const handleSaveGroup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) return;

    if (!groupFormReason.trim() || groupFormReason.trim().length < 5) {
      showToast("error", "Validation Error", "Mandatory Reason for Change is required.");
      return;
    }

    setSaving(true);
    try {
      if (groupModalMode === "CREATE") {
        const res = await mockApi.createGroup(
          {
            name: groupFormName.trim(),
            role: groupFormRole,
            permissions: ["binder.view", "report.view"],
            active: groupFormActive,
          },
          currentUser,
          groupFormReason.trim()
        );
        if (res.ok && res.data) {
          showToast("success", "Group Created", `Role Group "${res.data.group.name}" created.`);
          setGroupModalOpen(false);
          await loadData();
          setSelectedGroupId(res.data.group.id);
        } else if (res.error) {
          showToast("error", "Creation Failed", res.error.message);
        }
      } else if (groupModalMode === "EDIT" && activeGroup) {
        const res = await mockApi.updateGroup(
          activeGroup.id,
          {
            name: groupFormName.trim(),
            role: groupFormRole,
            active: groupFormActive,
          },
          currentUser,
          groupFormReason.trim()
        );
        if (res.ok && res.data) {
          showToast("success", "Group Updated", `Group "${res.data.group.name}" updated.`);
          setGroupModalOpen(false);
          await loadData();
        } else if (res.error) {
          showToast("error", "Update Failed", res.error.message);
        }
      }
    } catch (err: any) {
      showToast("error", "Error", err?.message || "Operation failed.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <AppLayout screenCode="S19">
      <div className="flex flex-col w-full pb-12 text-left">
        {/* Top Level Metadata & Breadcrumb Header */}
        <div className="flex flex-col gap-space-sm mb-space-md">
          <div className="flex items-center gap-space-xs text-on-surface-variant font-mono text-[11px]">
            <span>GMP-SEC</span>
            <span>/</span>
            <span>RBAC-AUTHORITY</span>
            <span>/</span>
            <span className="text-primary font-semibold">21_CFR_11.10(g)</span>
          </div>
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-space-md">
            <div className="flex flex-col">
              <h1 className="font-headline-xl text-2xl font-bold text-primary tracking-tight">
                S19 Groups &amp; Access Rights
              </h1>
              <p className="font-body-md text-xs text-on-surface-variant max-w-3xl">
                Configure role-based access control (RBAC), electronic signature authorization tiers, and system privileges under 21 CFR §11.10(g).
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-secondary-container text-on-secondary-container font-mono text-xs font-semibold">
                <span className="material-symbols-outlined text-[16px]">verified_user</span>
                21 CFR §11.10(g) Authority Matrix
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-surface-container-high text-on-surface-variant font-mono text-xs font-semibold">
                <span className="w-2 h-2 rounded-full bg-secondary" />
                System Security Level: High
              </span>
            </div>
          </div>
        </div>

        {/* Audit Mandate Banner */}
        <div className="relative overflow-hidden rounded-xl bg-surface-container-low border border-outline-variant/40 shadow-xs p-space-md mb-space-lg flex flex-col md:flex-row md:items-center justify-between gap-space-md">
          <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-primary" />
          <div className="flex items-start gap-space-md pl-space-xs">
            <div className="w-10 h-10 rounded-lg bg-primary-container text-on-primary-container flex items-center justify-center shrink-0 shadow-xs">
              <span className="material-symbols-outlined text-[24px]">gavel</span>
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <span className="font-headline-sm text-sm font-bold text-on-surface">
                  Every change is audit-logged with a mandatory regulatory reason
                </span>
                <span className="px-2 py-0.5 rounded bg-surface-container font-mono text-[10px] text-primary font-bold">
                  IMMUTABLE_LOG
                </span>
              </div>
              <p className="font-body-sm text-xs text-on-surface-variant mt-0.5 max-w-4xl">
                Any modification to group privileges or access permissions is permanently written to the SHA-256 hash-chained audit trail with an explicit regulatory justification.
              </p>
            </div>
          </div>
          <Link
            href="/audit-trail"
            className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-surface-container-lowest text-primary font-headline-sm text-xs font-semibold shadow-xs hover:bg-surface-container border border-outline-variant/40 transition-all min-h-[44px] shrink-0 self-start md:self-auto"
          >
            <span className="material-symbols-outlined text-[18px]">history</span>
            <span>View Permission Audit History (S17)</span>
          </Link>
        </div>

        {/* Main Dual-Column Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-lg">
          {/* LEFT COLUMN: Groups List (4 Cols) */}
          <div className="lg:col-span-4 xl:col-span-3 flex flex-col gap-space-md">
            {/* Section Title & Creation CTA */}
            <div className="flex items-center justify-between px-1">
              <div className="flex items-center gap-2">
                <span className="font-headline-sm text-sm font-bold text-on-surface">
                  System Role Groups
                </span>
                <span className="px-2 py-0.5 rounded-full bg-surface-container-high text-on-surface font-mono text-[11px]">
                  {groups.length} Active
                </span>
              </div>
              <button
                onClick={handleOpenCreateGroup}
                disabled={!hasGroupManage}
                className="min-h-[36px] px-3 py-1.5 rounded-lg bg-primary text-on-primary font-headline-sm text-xs font-semibold flex items-center gap-1.5 shadow-xs hover:bg-primary-container transition-colors disabled:opacity-40"
              >
                <span className="material-symbols-outlined text-[18px]">add</span>
                <span>New Group</span>
              </button>
            </div>

            {/* Groups List */}
            <div className="flex flex-col gap-3">
              {groups.map((group) => {
                const isSelected = group.id === selectedGroupId;
                const memberCount = users.filter((u) => u.groupIds.includes(group.id)).length;

                return (
                  <div
                    key={group.id}
                    onClick={() => setSelectedGroupId(group.id)}
                    className={`relative p-space-md rounded-xl bg-surface-container-lowest shadow-xs cursor-pointer transition-all border ${
                      isSelected
                        ? "border-primary ring-2 ring-primary/20 bg-primary-container/10"
                        : "border-outline-variant/40 hover:bg-surface-container-low"
                    }`}
                  >
                    {isSelected && (
                      <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-primary rounded-l-xl" />
                    )}
                    <div className="flex items-start justify-between mb-1 pl-2">
                      <div className="flex items-center gap-2">
                        <span className="font-headline-sm text-sm font-bold text-on-surface">
                          {group.name}
                        </span>
                        {isSelected && (
                          <span className="px-1.5 py-0.5 rounded bg-primary text-on-primary font-mono text-[10px] uppercase font-bold">
                            Active
                          </span>
                        )}
                      </div>
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-surface-container text-on-surface-variant font-mono text-[11px]">
                        <span className="material-symbols-outlined text-[14px]">group</span>
                        {memberCount} users
                      </span>
                    </div>

                    <span className="block font-mono text-[11px] text-secondary font-semibold pl-2 mb-1">
                      Role Tier: {group.role}
                    </span>

                    <div className="mt-3 pt-2 pl-2 flex items-center justify-between text-on-surface-variant font-mono text-[11px] border-t border-outline-variant/20">
                      <span className="text-primary font-bold">
                        {group.permissions.length} capabilities
                      </span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleOpenEditGroup(group);
                        }}
                        disabled={!hasGroupManage}
                        className="text-outline hover:text-primary p-1 rounded"
                        title="Edit Group Info"
                      >
                        <span className="material-symbols-outlined text-[16px]">settings</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Active Group Policy Security Container */}
            <div className="p-space-md rounded-xl bg-surface-container-low border border-outline-variant/40 shadow-xs flex flex-col gap-3 mt-1">
              <div className="flex items-center justify-between">
                <span className="font-headline-sm text-xs font-bold text-on-surface uppercase tracking-wider">
                  Active Group Policy
                </span>
                <span className="material-symbols-outlined text-primary text-[18px]">shield</span>
              </div>
              <p className="font-caption text-[11px] text-on-surface-variant">
                Global boundary constraints applied to this role tier per SOP-SEC-01.
              </p>
              <div className="flex flex-col gap-2 mt-1">
                <div className="flex items-center justify-between p-2 rounded-lg bg-surface-container-lowest border border-outline-variant/30">
                  <div className="flex items-center gap-2 text-xs">
                    <span className="material-symbols-outlined text-[16px] text-secondary">sync</span>
                    <span className="text-on-surface">Password Expiry</span>
                  </div>
                  <span className="font-mono text-xs font-semibold text-primary">60 days</span>
                </div>
                <div className="flex items-center justify-between p-2 rounded-lg bg-surface-container-lowest border border-outline-variant/30">
                  <div className="flex items-center gap-2 text-xs">
                    <span className="material-symbols-outlined text-[16px] text-secondary">timer</span>
                    <span className="text-on-surface">Idle Lockout</span>
                  </div>
                  <span className="font-mono text-xs font-semibold text-primary">30 min</span>
                </div>
                <div className="flex items-center justify-between p-2 rounded-lg bg-surface-container-lowest border border-outline-variant/30">
                  <div className="flex items-center gap-2 text-xs">
                    <span className="material-symbols-outlined text-[16px] text-red-600">lock</span>
                    <span className="text-on-surface">Lock Threshold</span>
                  </div>
                  <span className="font-mono text-xs font-semibold text-red-700">5 fails</span>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: Permission Matrix (8-9 Cols) */}
          <div className="lg:col-span-8 xl:col-span-9 flex flex-col gap-space-md">
            {/* Matrix Header Card */}
            <div className="rounded-xl bg-surface-container-lowest border border-outline-variant/40 shadow-xs p-space-md flex flex-col md:flex-row md:items-center justify-between gap-space-md">
              <div className="flex flex-col">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary text-[22px]">tune</span>
                  <h2 className="font-headline-lg text-lg font-bold text-on-surface">
                    Permission Matrix — {activeGroup?.name || "Select Group"}
                  </h2>
                  {hasUnsavedChanges && (
                    <span className="px-2 py-0.5 rounded bg-amber-100 text-amber-900 border border-amber-300 font-mono text-[10px] font-bold">
                      UNSAVED EDITS
                    </span>
                  )}
                </div>
                <p className="font-body-sm text-xs text-on-surface-variant mt-1">
                  Configure granular capability toggles for the <strong>{activeGroup?.name}</strong> group. Enabled permissions are enforced across all authenticated endpoints and UI views.
                </p>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={handleDiscardChanges}
                  disabled={!hasUnsavedChanges}
                  className="min-h-[44px] px-4 py-2 rounded-lg bg-surface-container text-on-surface font-headline-sm text-xs font-semibold hover:bg-surface-container-high transition-colors disabled:opacity-40"
                >
                  Discard Changes
                </button>
                <Button
                  variant="primary"
                  size="sm"
                  icon="verified"
                  disabled={!hasUnsavedChanges || !hasGroupManage}
                  onClick={handleOpenSavePolicy}
                >
                  Save Policy Changes
                </Button>
              </div>
            </div>

            {/* Matrix Table Card Container */}
            <div className="rounded-xl bg-surface-container-lowest border border-outline-variant/40 shadow-xs overflow-hidden flex flex-col">
              {/* Table Legend Control Bar */}
              <div className="px-space-md py-space-sm bg-surface-container-low flex flex-wrap items-center justify-between gap-space-sm border-b border-outline-variant/30">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs text-on-surface font-semibold uppercase tracking-wider">
                    Module Privilege Matrix
                  </span>
                  <span className="px-2 py-0.5 rounded bg-surface-container text-on-surface-variant font-mono text-[11px]">
                    {MODULE_DEFINITIONS.length} Modules Tracked
                  </span>
                </div>
                <div className="flex items-center gap-4 text-on-surface-variant font-mono text-[11px]">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-primary" />
                    <span>Enabled</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-surface-container-highest border border-outline-variant/40" />
                    <span>Disabled</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-[14px] text-outline">lock</span>
                    <span>CFR Locked</span>
                  </div>
                </div>
              </div>

              {/* Table */}
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse font-body-sm text-xs">
                  <thead>
                    <tr className="bg-surface-container text-on-surface-variant font-mono text-[11px] uppercase tracking-wider border-b border-outline-variant/40">
                      <th className="py-3 px-space-md font-semibold">System Module / Resource</th>
                      <th className="py-3 px-space-md font-semibold hidden md:table-cell">Scope / Compliance Note</th>
                      <th className="py-3 px-2 text-center font-semibold">View</th>
                      <th className="py-3 px-2 text-center font-semibold">Create</th>
                      <th className="py-3 px-2 text-center font-semibold">Edit</th>
                      <th className="py-3 px-2 text-center font-semibold">Export/Print</th>
                      <th className="py-3 px-2 text-center font-semibold bg-surface-container-high/60">
                        <div className="flex items-center justify-center gap-1 text-primary">
                          <span className="material-symbols-outlined text-[15px]">draw</span>
                          <span>Sign</span>
                        </div>
                      </th>
                      <th className="py-3 px-2 text-center font-semibold">Configure</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-outline-variant/20">
                    {MODULE_DEFINITIONS.map((module) => {
                      return (
                        <tr key={module.id} className="hover:bg-surface-container-low/60 transition-colors">
                          {/* Module Header */}
                          <td className="py-3 px-space-md whitespace-nowrap">
                            <div className="flex items-center gap-2">
                              <span className="material-symbols-outlined text-[20px] text-primary">
                                {module.id === "binders"
                                  ? "folder_managed"
                                  : module.id === "movements"
                                  ? "transfer_within_a_station"
                                  : module.id === "reports"
                                  ? "analytics"
                                  : module.id === "audit"
                                  ? "history_edu"
                                  : module.id === "users"
                                  ? "manage_accounts"
                                  : module.id === "groups"
                                  ? "admin_panel_settings"
                                  : module.id === "masters"
                                  ? "database"
                                  : module.id === "workflow"
                                  ? "account_tree"
                                  : "security"}
                              </span>
                              <div className="flex flex-col">
                                <span className="font-semibold text-on-surface text-xs leading-tight">
                                  {module.name}
                                </span>
                                <span className="font-mono text-[10px] text-outline">
                                  {module.code}
                                </span>
                              </div>
                            </div>
                          </td>

                          {/* Description */}
                          <td className="py-3 px-space-md text-on-surface-variant text-[11px] hidden md:table-cell">
                            {module.description}
                          </td>

                          {/* 6 Capabilities: View, Create, Edit, Export, Sign, Configure */}
                          {module.capabilities.map((cap) => {
                            const isEnabled = draftPermissions.includes(cap.perm);

                            if (cap.locked) {
                              return (
                                <td key={cap.key} className="py-3 px-2 text-center">
                                  <div
                                    className="min-w-[40px] min-h-[36px] inline-flex flex-col items-center justify-center text-outline cursor-not-allowed"
                                    title={cap.lockedReason || "Permanently locked"}
                                  >
                                    <span className="material-symbols-outlined text-[16px]">lock</span>
                                    <span className="font-mono text-[8px] uppercase">Locked</span>
                                  </div>
                                </td>
                              );
                            }

                            return (
                              <td
                                key={cap.key}
                                className={`py-3 px-2 text-center ${
                                  cap.key === "sign" ? "bg-surface-container-low/40" : ""
                                }`}
                              >
                                <button
                                  type="button"
                                  onClick={() => handleTogglePermission(cap.perm)}
                                  className="min-w-[44px] min-h-[44px] inline-flex items-center justify-center p-1.5 focus:outline-none"
                                  title={`${cap.label}: ${cap.perm} (${isEnabled ? "Enabled" : "Disabled"})`}
                                >
                                  <span
                                    className={`w-9 h-5 rounded-full relative transition-colors flex items-center p-0.5 ${
                                      isEnabled ? "bg-primary" : "bg-surface-container-highest border border-outline-variant/60"
                                    }`}
                                  >
                                    <span
                                      className={`w-4 h-4 rounded-full bg-surface-container-lowest transition-transform shadow-xs ${
                                        isEnabled ? "translate-x-4" : "translate-x-0"
                                      }`}
                                    />
                                  </span>
                                </button>
                              </td>
                            );
                          })}
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* Table Footer */}
              <div className="p-space-sm bg-surface-container-low flex items-center justify-between font-mono text-[11px] text-on-surface-variant border-t border-outline-variant/30">
                <span>
                  Policy Target: <strong>{activeGroup?.name}</strong> ({activeGroup?.role})
                </span>
                <span className="text-emerald-700 font-semibold flex items-center gap-1">
                  <span className="material-symbols-outlined text-[14px]">lock</span>
                  Dynamic Storage Enforcement
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Save Policy Modal */}
        <Modal
          isOpen={savePolicyModalOpen}
          onClose={() => setSavePolicyModalOpen(false)}
          title="Sign & Deploy Permission Matrix"
          badge={activeGroup?.name}
          maxWidth="sm"
          footer={
            <>
              <Button variant="secondary" size="sm" onClick={() => setSavePolicyModalOpen(false)}>
                Cancel
              </Button>
              <Button
                variant="primary"
                size="sm"
                onClick={handleConfirmSavePolicy}
                loading={saving}
                icon="fingerprint"
              >
                Sign &amp; Deploy Policy
              </Button>
            </>
          }
        >
          <div className="flex flex-col gap-3 text-left">
            <p className="font-body-md text-xs text-on-surface">
              You are about to reconfigure the permissions for role tier <strong>{activeGroup?.name}</strong> ({draftPermissions.length} active capabilities).
            </p>

            <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg text-amber-950 text-xs flex items-start gap-2">
              <span className="material-symbols-outlined text-[18px] text-amber-700 shrink-0">
                security
              </span>
              <span>
                Under 21 CFR §11.10(g), this change is immediately written to the append-only cryptographic ledger and will alter authority checks across all operator sessions.
              </span>
            </div>

            <div className="flex flex-col gap-1 mt-2">
              <label className="font-caption text-[11px] uppercase font-bold text-on-surface">
                Regulatory Reason for Change <span className="text-red-700">*</span>
              </label>
              <textarea
                required
                rows={3}
                className="w-full bg-surface-container-low border border-outline-variant/60 rounded-lg p-2.5 text-xs font-body-sm text-on-surface focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="State formal operational justification (e.g. Updated SOP-PTS-002 section 4 authority matrix)..."
                value={policyReason}
                onChange={(e) => setPolicyReason(e.target.value)}
              />
            </div>
          </div>
        </Modal>

        {/* Create / Edit Group Modal */}
        <Modal
          isOpen={groupModalOpen}
          onClose={() => setGroupModalOpen(false)}
          title={groupModalMode === "CREATE" ? "Create System Role Group" : "Edit Role Group"}
          badge={groupModalMode}
          maxWidth="sm"
          footer={
            <>
              <Button variant="secondary" size="sm" onClick={() => setGroupModalOpen(false)}>
                Cancel
              </Button>
              <Button variant="primary" size="sm" onClick={handleSaveGroup} loading={saving}>
                {groupModalMode === "CREATE" ? "Create Group" : "Save Group"}
              </Button>
            </>
          }
        >
          <form onSubmit={handleSaveGroup} className="flex flex-col gap-3 text-left">
            <div className="flex flex-col gap-1">
              <label className="font-caption text-[11px] uppercase font-bold text-on-surface">
                Group Name <span className="text-red-700">*</span>
              </label>
              <input
                type="text"
                required
                className="w-full bg-surface-container-low border border-outline-variant/60 rounded-lg p-2.5 text-xs font-body-sm text-on-surface focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="e.g. Cleanroom Supervisors"
                value={groupFormName}
                onChange={(e) => setGroupFormName(e.target.value)}
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="font-caption text-[11px] uppercase font-bold text-on-surface">
                Role Tier (SPEC §5) <span className="text-red-700">*</span>
              </label>
              <select
                value={groupFormRole}
                onChange={(e) => setGroupFormRole(e.target.value as Role)}
                className="w-full bg-surface-container-low border border-outline-variant/60 rounded-lg p-2.5 text-xs font-body-sm text-on-surface focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="ADMIN">Admin (System Administrator)</option>
                <option value="INITIATOR">Initiator (Floor Operator / Lead)</option>
                <option value="HOD">HOD (Department Reviewer)</option>
                <option value="QA">QA (Quality Assurance Auditor)</option>
              </select>
            </div>

            <label className="flex items-center gap-2 text-xs text-on-surface cursor-pointer mt-1">
              <input
                type="checkbox"
                checked={groupFormActive}
                onChange={(e) => setGroupFormActive(e.target.checked)}
                className="w-4 h-4 rounded text-primary focus:ring-primary"
              />
              <span className="font-semibold">Active Group</span>
            </label>

            <div className="flex flex-col gap-1 mt-2">
              <label className="font-caption text-[11px] uppercase font-bold text-on-surface">
                Mandatory Reason for Change <span className="text-red-700">*</span>
              </label>
              <textarea
                required
                rows={3}
                className="w-full bg-surface-container-low border border-outline-variant/60 rounded-lg p-2.5 text-xs font-body-sm text-on-surface focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="Provide justification per 21 CFR Part 11..."
                value={groupFormReason}
                onChange={(e) => setGroupFormReason(e.target.value)}
              />
            </div>
          </form>
        </Modal>
      </div>
    </AppLayout>
  );
}
