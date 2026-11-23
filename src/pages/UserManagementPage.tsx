"use client";

import React, { useState, useEffect, useMemo } from "react";
import AppLayout from "@/components/layout/AppLayout";
import StatusPill from "@/components/ui/StatusPill";
import Button from "@/components/ui/Button";
import Modal from "@/components/ui/Modal";
import RecordAuditDrawer from "@/components/audit/RecordAuditDrawer";
import { User, Group, Department, ESignMeaning, UserStatus } from "@/domain/types";
import { mockApi } from "@/api";
import { useSession } from "@/services/session";
import { can } from "@/services/permission";
import { fmtDateTime } from "@/services/format";
import { useToast } from "@/components/ui/Toast";

export default function UserManagementPage() {
  const { currentUser, setRole } = useSession();
  const { showToast } = useToast();

  const [users, setUsers] = useState<User[]>([]);
  const [groups, setGroups] = useState<Group[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [loading, setLoading] = useState(false);

  // Filters
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<string>("ALL");
  const [selectedDepartment, setSelectedDepartment] = useState<string>("ALL");

  // Selection & Drawer state
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [drawerMode, setDrawerMode] = useState<"ADD" | "EDIT">("EDIT");
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);

  // Form Fields
  const [formUserId, setFormUserId] = useState("");
  const [formFullName, setFormFullName] = useState("");
  const [formDepartmentId, setFormDepartmentId] = useState("");
  const [formGroupIds, setFormGroupIds] = useState<string[]>([]);
  const [formESignMeanings, setFormESignMeanings] = useState<ESignMeaning[]>([]);
  const [formReason, setFormReason] = useState("");
  const [formSaving, setFormSaving] = useState(false);

  // Action Confirmation Dialogs
  const [actionConfirmOpen, setActionConfirmOpen] = useState(false);
  const [pendingAction, setPendingAction] = useState<
    "LOCK" | "UNLOCK" | "DEACTIVATE" | "REACTIVATE" | "RESET_PASSWORD" | null
  >(null);
  const [actionTargetUser, setActionTargetUser] = useState<User | null>(null);
  const [actionReason, setActionReason] = useState("");
  const [actionLoading, setActionLoading] = useState(false);

  // Temporary Password Modal
  const [tempPasswordModalOpen, setTempPasswordModalOpen] = useState(false);
  const [generatedTempPassword, setGeneratedTempPassword] = useState("");
  const [tempPasswordUser, setTempPasswordUser] = useState<User | null>(null);

  // Audit Ledger Drawer
  const [auditUserTarget, setAuditUserTarget] = useState<User | null>(null);

  const hasManagePermission = can(currentUser, "user.manage");

  // Load initial data
  const loadData = async () => {
    setLoading(true);
    try {
      const [usersRes, groupsRes, mastersRes] = await Promise.all([
        mockApi.getUsers(),
        mockApi.getGroups(),
        mockApi.getMasters(),
      ]);

      if (usersRes.ok && usersRes.data) {
        setUsers(usersRes.data);
      }
      if (groupsRes.ok && groupsRes.data) {
        setGroups(groupsRes.data);
      }
      if (mastersRes.ok && mastersRes.data) {
        setDepartments(mastersRes.data.departments || []);
      }
    } catch (err: any) {
      console.error("Error loading user management data:", err);
      showToast("error", "Error", "Failed to load users directory.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Filtered Users
  const filteredUsers = useMemo(() => {
    return users.filter((u) => {
      // Status filter
      if (selectedStatus !== "ALL" && u.status !== selectedStatus) {
        return false;
      }
      // Department filter
      if (selectedDepartment !== "ALL" && u.departmentId !== selectedDepartment) {
        return false;
      }
      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const deptName = departments.find((d) => d.id === u.departmentId)?.name.toLowerCase() || "";
        const groupNames = groups
          .filter((g) => u.groupIds.includes(g.id))
          .map((g) => g.name.toLowerCase())
          .join(" ");

        const matches =
          u.userId.toLowerCase().includes(q) ||
          u.fullName.toLowerCase().includes(q) ||
          deptName.includes(q) ||
          groupNames.includes(q);

        if (!matches) return false;
      }
      return true;
    });
  }, [users, selectedStatus, selectedDepartment, searchQuery, departments, groups]);

  // Counts for Metric Chips & Tabs
  const metrics = useMemo(() => {
    const total = users.length;
    const active = users.filter((u) => u.status === "ACTIVE").length;
    const locked = users.filter((u) => u.status === "LOCKED").length;
    const disabled = users.filter((u) => u.status === "DISABLED").length;
    const deactivated = users.filter((u) => u.status === "DEACTIVATED").length;
    const activeSigs = users.filter((u) => u.status === "ACTIVE" && u.eSignMeanings?.length > 0).length;
    return { total, active, locked, disabled, deactivated, activeSigs };
  }, [users]);

  // Open Drawer in ADD mode
  const handleOpenAdd = () => {
    setDrawerMode("ADD");
    setFormUserId("");
    setFormFullName("");
    setFormDepartmentId(departments[0]?.id || "dept-packing");
    setFormGroupIds(groups[0]?.id ? [groups[0].id] : ["group-initiator"]);
    setFormESignMeanings(["INITIATOR"]);
    setFormReason("");
    setSelectedUserId(null);
    setIsDrawerOpen(true);
  };

  // Open Drawer in EDIT mode
  const handleOpenEdit = (user: User) => {
    setDrawerMode("EDIT");
    setSelectedUserId(user.id);
    setFormUserId(user.userId);
    setFormFullName(user.fullName);
    setFormDepartmentId(user.departmentId);
    setFormGroupIds(user.groupIds.length > 0 ? [...user.groupIds] : []);
    setFormESignMeanings(user.eSignMeanings || []);
    setFormReason("");
    setIsDrawerOpen(true);
  };

  // Save Add/Edit
  const handleSaveUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) return;

    if (!formReason.trim() || formReason.trim().length < 5) {
      showToast("error", "Validation Error", "Mandatory Reason for Change (min 5 characters) is required.");
      return;
    }
    if (formGroupIds.length === 0) {
      showToast("error", "Validation Error", "Assign at least one group so permissions stay in sync.");
      return;
    }

    setFormSaving(true);
    try {
      if (drawerMode === "ADD") {
        const res = await mockApi.createUser(
          {
            userId: formUserId.trim(),
            fullName: formFullName.trim(),
            departmentId: formDepartmentId,
            groupIds: formGroupIds,
            eSignMeanings: formESignMeanings,
          },
          currentUser,
          formReason.trim()
        );

        if (res.ok && res.data) {
          showToast("success", "User Created", `Personnel ${res.data.user.userId} provisioned successfully.`);
          setIsDrawerOpen(false);
          await loadData();
        } else if (res.error) {
          showToast("error", "Creation Failed", res.error.message);
        }
      } else if (drawerMode === "EDIT" && selectedUserId) {
        const res = await mockApi.updateUser(
          selectedUserId,
          {
            fullName: formFullName.trim(),
            departmentId: formDepartmentId,
            groupIds: formGroupIds,
            eSignMeanings: formESignMeanings,
          },
          currentUser,
          formReason.trim()
        );

        if (res.ok && res.data) {
          showToast("success", "User Updated", `Profile for ${res.data.user.userId} updated in audit ledger.`);
          setIsDrawerOpen(false);
          await loadData();
        } else if (res.error) {
          showToast("error", "Update Failed", res.error.message);
        }
      }
    } catch (err: any) {
      showToast("error", "Error", err?.message || "Failed to save user.");
    } finally {
      setFormSaving(false);
    }
  };

  const handleToggleGroup = (groupId: string) => {
    setFormGroupIds((current) =>
      current.includes(groupId) ? current.filter((id) => id !== groupId) : [...current, groupId]
    );
  };

  // Toggle E-Sign Meaning Checkbox
  const handleToggleESign = (meaning: ESignMeaning) => {
    if (formESignMeanings.includes(meaning)) {
      setFormESignMeanings(formESignMeanings.filter((m) => m !== meaning));
    } else {
      setFormESignMeanings([...formESignMeanings, meaning]);
    }
  };

  // Trigger Confirmation Action
  const triggerUserAction = (
    action: "LOCK" | "UNLOCK" | "DEACTIVATE" | "REACTIVATE" | "RESET_PASSWORD",
    user: User
  ) => {
    setPendingAction(action);
    setActionTargetUser(user);
    setActionReason("");
    setActionConfirmOpen(true);
  };

  // Execute Confirmation Action
  const handleConfirmAction = async () => {
    if (!currentUser || !actionTargetUser || !pendingAction) return;

    if (!actionReason.trim() || actionReason.trim().length < 5) {
      showToast("error", "Validation Error", "Mandatory Reason for Change (min 5 characters) must be entered.");
      return;
    }

    setActionLoading(true);
    try {
      let res: any;
      if (pendingAction === "LOCK") {
        res = await mockApi.lockUser(actionTargetUser.id, currentUser, actionReason.trim());
      } else if (pendingAction === "UNLOCK") {
        res = await mockApi.unlockUser(actionTargetUser.id, currentUser, actionReason.trim());
      } else if (pendingAction === "DEACTIVATE") {
        res = await mockApi.deactivateUser(actionTargetUser.id, currentUser, actionReason.trim());
      } else if (pendingAction === "REACTIVATE") {
        res = await mockApi.reactivateUser(actionTargetUser.id, currentUser, actionReason.trim());
      } else if (pendingAction === "RESET_PASSWORD") {
        res = await mockApi.resetUserPassword(actionTargetUser.id, currentUser, actionReason.trim());
      }

      if (res?.ok) {
        if (pendingAction === "RESET_PASSWORD" && res.data?.temporaryPassword) {
          setGeneratedTempPassword(res.data.temporaryPassword);
          setTempPasswordUser(actionTargetUser);
          setTempPasswordModalOpen(true);
          showToast("success", "Password Reset", "Temporary credential generated successfully.");
        } else {
          showToast("success", "Action Executed", `User ${actionTargetUser.userId} state updated.`);
        }
        setActionConfirmOpen(false);
        await loadData();
      } else if (res?.error) {
        showToast("error", "Action Failed", res.error.message);
      }
    } catch (err: any) {
      showToast("error", "Error", err?.message || "Operation failed.");
    } finally {
      setActionLoading(false);
    }
  };

  // Export Users to CSV
  const handleExportCsv = () => {
    const headers = [
      "User ID",
      "Full Name",
      "Department",
      "Group",
      "Status",
      "E-Sign Meanings",
      "Last Login",
    ];
    const rows = users.map((u) => {
      const dept = departments.find((d) => d.id === u.departmentId)?.name || u.departmentId;
      const grp =
        groups
          .filter((g) => u.groupIds.includes(g.id))
          .map((g) => g.name)
          .join(" | ") || u.groupIds.join(", ");
      return [
        `"${u.userId}"`,
        `"${u.fullName}"`,
        `"${dept}"`,
        `"${grp}"`,
        `"${u.status}"`,
        `"${u.eSignMeanings.join(" | ")}"`,
        `"${u.lastLoginAt ? fmtDateTime(u.lastLoginAt) : "Never"}"`,
      ].join(",");
    });

    const csvContent = "\uFEFF" + [headers.join(","), ...rows].join("\r\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `User_Roster_${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    showToast("success", "Exported", `Exported ${users.length} user roster records.`);
  };

  // Helper for status pill
  const getStatusVariant = (status: UserStatus) => {
    switch (status) {
      case "ACTIVE":
        return "compliant";
      case "LOCKED":
        return "warning";
      case "DISABLED":
        return "neutral";
      case "DEACTIVATED":
        return "critical";
      default:
        return "neutral";
    }
  };

  return (
    <AppLayout screenCode="S18">
      <div className="flex flex-col w-full pb-16 text-left">
        {/* Top Compliance Alert Banner */}
        <div className="w-full bg-surface-container-low px-space-md py-2.5 rounded-lg mb-space-md flex flex-wrap items-center justify-between gap-space-sm shadow-xs">
          <div className="flex items-center gap-space-sm min-w-0">
            <span className="material-symbols-outlined text-secondary text-[20px]">policy</span>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-label-md text-primary font-bold text-xs">
                21 CFR §11.10(d) Authority Checks Active:
              </span>
              <span className="font-body-sm text-xs text-on-surface-variant">
                System access strictly limited to authorized biopharma operators with valid digital credentials.
              </span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded bg-surface-container-lowest text-secondary font-mono text-[11px] font-semibold shadow-xs">
              <span className="w-1.5 h-1.5 rounded-full bg-secondary animate-pulse" />
              Audit Log Bound
            </span>
          </div>
        </div>

        {/* Page Header */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-space-md mb-space-lg">
          <div className="flex flex-col">
            <div className="flex flex-wrap items-center gap-space-sm mb-1">
              <h1 className="font-headline-lg text-2xl font-bold text-on-surface tracking-tight">
                S18 User Management
              </h1>
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded bg-secondary-container text-on-secondary-container font-mono text-xs font-semibold">
                <span className="material-symbols-outlined text-[14px]">shield</span>
                21 CFR §11.10(d) Authority Controls
              </span>
              <span className="inline-flex items-center px-2 py-0.5 rounded bg-surface-container text-on-surface-variant font-mono text-xs">
                Active Personnel Directory
              </span>
            </div>
            <p className="font-body-md text-xs text-on-surface-variant max-w-3xl">
              Administer cleanroom personnel accounts, electronic signature privileges, and immutable identifier records under 21 CFR §11.10.
            </p>
          </div>

          {/* Quick Metrics Summary Chips */}
          <div className="flex items-center gap-2 bg-surface-container-lowest p-1.5 rounded-lg shadow-xs border border-outline-variant/40">
            <div className="px-3 py-1 rounded bg-surface-container-low flex flex-col items-center">
              <span className="font-caption text-[10px] text-on-surface-variant uppercase font-bold">Roster Total</span>
              <span className="font-label-lg text-sm text-primary font-bold">{metrics.total}</span>
            </div>
            <div className="px-3 py-1 rounded bg-surface-container-low flex flex-col items-center">
              <span className="font-caption text-[10px] text-on-surface-variant uppercase font-bold">Active Sigs</span>
              <span className="font-label-lg text-sm text-secondary font-bold">{metrics.activeSigs}</span>
            </div>
            <div className="px-3 py-1 rounded bg-surface-container-low flex flex-col items-center">
              <span className="font-caption text-[10px] text-on-surface-variant uppercase font-bold">Locks / Revoked</span>
              <span className="font-label-lg text-sm text-red-700 font-bold">{metrics.locked + metrics.deactivated}</span>
            </div>
          </div>
        </div>

        {/* Primary Toolbar Section */}
        <div className="bg-surface-container-lowest p-space-md rounded-xl shadow-xs border border-outline-variant/40 mb-space-md space-y-space-md">
          <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-space-md">
            {/* Search Input */}
            <div className="relative flex-1 max-w-xl">
              <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-on-surface-variant text-[20px]">
                search
              </span>
              <input
                className="w-full pl-10 pr-4 py-2 bg-surface-container-low text-on-surface font-body-md text-xs rounded-lg border border-outline-variant/60 focus:outline-none focus:ring-2 focus:ring-primary min-h-[44px]"
                placeholder="Search User ID, full name, department, or role..."
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={handleExportCsv}
                className="min-h-[44px] px-3.5 py-2 rounded-lg bg-surface-container-low hover:bg-surface-container text-primary font-headline-sm text-xs font-semibold inline-flex items-center gap-2 border border-outline-variant/50 transition-colors"
              >
                <span className="material-symbols-outlined text-[18px]">download</span>
                Export Roster (CSV)
              </button>
              <button
                onClick={handleOpenAdd}
                disabled={!hasManagePermission}
                className="min-h-[44px] px-4 py-2 rounded-lg bg-primary hover:bg-primary-container text-on-primary font-headline-sm text-xs font-semibold inline-flex items-center gap-2 shadow-xs transition-colors disabled:opacity-40"
              >
                <span className="material-symbols-outlined text-[20px]">person_add</span>
                + Add User
              </button>
            </div>
          </div>

          {/* Filters & Tabs Row */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-space-sm pt-2 border-t border-outline-variant/30">
            {/* Status Tabs */}
            <div className="flex items-center gap-1 overflow-x-auto pb-1 md:pb-0">
              {[
                { label: "All Statuses", val: "ALL", count: metrics.total },
                { label: "Active", val: "ACTIVE", count: metrics.active },
                { label: "Locked", val: "LOCKED", count: metrics.locked },
                { label: "Disabled", val: "DISABLED", count: metrics.disabled },
                { label: "Deactivated", val: "DEACTIVATED", count: metrics.deactivated },
              ].map((tab) => {
                const isActive = selectedStatus === tab.val;
                return (
                  <button
                    key={tab.val}
                    onClick={() => setSelectedStatus(tab.val)}
                    className={`min-h-[36px] px-3 py-1.5 rounded-lg font-mono text-xs font-semibold flex items-center gap-1.5 whitespace-nowrap transition-colors ${
                      isActive
                        ? "bg-primary text-on-primary shadow-xs"
                        : "text-on-surface-variant hover:bg-surface-container"
                    }`}
                  >
                    <span>{tab.label}</span>
                    <span
                      className={`px-1.5 py-0.2 rounded-full text-[10px] font-bold ${
                        isActive ? "bg-surface-container-lowest text-primary" : "bg-surface-container text-on-surface-variant"
                      }`}
                    >
                      {tab.count}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Department Filter Selector */}
            <div className="flex items-center gap-2">
              <label className="font-caption text-[11px] text-on-surface-variant uppercase tracking-wider font-semibold whitespace-nowrap">
                Filter Dept:
              </label>
              <div className="relative min-w-[200px]">
                <select
                  value={selectedDepartment}
                  onChange={(e) => setSelectedDepartment(e.target.value)}
                  className="w-full appearance-none min-h-[36px] px-3 py-1.5 bg-surface-container-low text-on-surface font-body-sm text-xs rounded-lg pr-8 border border-outline-variant/60 focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="ALL">All Departments ({departments.length})</option>
                  {departments.map((dept) => (
                    <option key={dept.id} value={dept.id}>
                      {dept.name}
                    </option>
                  ))}
                </select>
                <span className="material-symbols-outlined absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none text-on-surface-variant text-[18px]">
                  expand_more
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Area: Table + Side Drawer */}
        <div className="relative grid grid-cols-1 xl:grid-cols-12 gap-space-lg items-start">
          {/* Table Column */}
          <div className={`${isDrawerOpen ? "xl:col-span-8" : "xl:col-span-12"} flex flex-col gap-space-md transition-all`}>
            <div className="bg-surface-container-lowest p-space-sm rounded-xl shadow-xs border border-outline-variant/40 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse font-body-md text-xs">
                  <thead>
                    <tr className="bg-surface-container-low text-on-surface-variant font-mono text-[11px] uppercase tracking-wider border-b border-outline-variant/40">
                      <th className="py-3 px-3">User ID</th>
                      <th className="py-3 px-3">Personnel</th>
                      <th className="py-3 px-3">Department</th>
                      <th className="py-3 px-3">Group Level</th>
                      <th className="py-3 px-3">E-Sign Authorizations</th>
                      <th className="py-3 px-3">Status</th>
                      <th className="py-3 px-3">Last Activity</th>
                      <th className="py-3 px-3 text-right">Controls</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-outline-variant/20">
                    {loading ? (
                      <tr>
                        <td colSpan={8} className="py-12 text-center text-outline font-mono">
                          <span className="material-symbols-outlined text-[20px] animate-spin inline-block mr-2">
                            progress_activity
                          </span>
                          Loading cleanroom personnel directory...
                        </td>
                      </tr>
                    ) : filteredUsers.length === 0 ? (
                      <tr>
                        <td colSpan={8} className="py-12 text-center text-outline">
                          No personnel records match the selected filter criteria.
                        </td>
                      </tr>
                    ) : (
                      filteredUsers.map((user) => {
                        const dept = departments.find((d) => d.id === user.departmentId);
                        const userGroups = groups.filter((g) => user.groupIds.includes(g.id));
                        const isDeactivated = user.status === "DEACTIVATED";
                        const isLocked = user.status === "LOCKED";
                        const isSelected = selectedUserId === user.id && isDrawerOpen;

                        return (
                          <tr
                            key={user.id}
                            className={`transition-colors ${
                              isSelected
                                ? "bg-primary-container/20 border-l-4 border-primary"
                                : isDeactivated
                                ? "opacity-60 bg-surface-container-low/30 hover:bg-surface-container-low"
                                : isLocked
                                ? "bg-amber-50/40 hover:bg-amber-50/80"
                                : "hover:bg-surface-container-low"
                            }`}
                          >
                            {/* User ID */}
                            <td className="py-3 px-3 font-mono font-bold text-primary whitespace-nowrap">
                              <span className={isDeactivated ? "line-through text-outline" : ""}>
                                {user.userId}
                              </span>
                            </td>

                            {/* Personnel */}
                            <td className="py-3 px-3">
                              <div className="flex items-center gap-2 min-w-[160px]">
                                <div className="w-8 h-8 rounded-full bg-primary-container text-on-primary-container font-mono text-xs font-bold flex items-center justify-center shrink-0">
                                  {user.fullName
                                    .split(" ")
                                    .map((n) => n[0])
                                    .join("")
                                    .substring(0, 2)
                                    .toUpperCase()}
                                </div>
                                <div className="flex flex-col">
                                  <span className="font-semibold text-on-surface leading-tight">
                                    {user.fullName}
                                  </span>
                                  <span className="font-mono text-[10px] text-outline">
                                    {user.id}
                                  </span>
                                </div>
                              </div>
                            </td>

                            {/* Department */}
                            <td className="py-3 px-3 text-on-surface-variant whitespace-nowrap">
                              {dept?.name || user.departmentId}
                            </td>

                            {/* Group Level */}
                            <td className="py-3 px-3 whitespace-nowrap">
                              {userGroups.map((g) => (
                                <span
                                  key={g.id}
                                  className="px-2 py-0.5 rounded bg-surface-container-high text-on-surface font-mono text-[11px] font-semibold mr-1"
                                >
                                  {g.name}
                                </span>
                              ))}
                            </td>

                            {/* E-Sign Authorizations */}
                            <td className="py-3 px-3">
                              <div className="flex flex-wrap gap-1 max-w-[200px]">
                                {user.eSignMeanings && user.eSignMeanings.length > 0 ? (
                                  user.eSignMeanings.map((m) => (
                                    <span
                                      key={m}
                                      className="px-1.5 py-0.5 rounded bg-surface-container-low text-primary font-mono text-[10px] border border-outline-variant/30"
                                    >
                                      {m}
                                    </span>
                                  ))
                                ) : (
                                  <span className="text-outline text-[11px] font-mono">No sign auth</span>
                                )}
                              </div>
                            </td>

                            {/* Status */}
                            <td className="py-3 px-3 whitespace-nowrap">
                              <StatusPill
                                label={user.status}
                                variant={getStatusVariant(user.status) as any}
                                size="sm"
                              />
                            </td>

                            {/* Last Activity */}
                            <td className="py-3 px-3 font-mono text-[11px] text-on-surface-variant whitespace-nowrap">
                              <div className="flex flex-col">
                                <span>{user.lastLoginAt ? fmtDateTime(user.lastLoginAt) : "Never"}</span>
                                {user.failedAttempts > 0 && (
                                  <span className="text-[10px] text-red-700 font-bold">
                                    {user.failedAttempts} fail(s)
                                  </span>
                                )}
                              </div>
                            </td>

                            {/* Controls */}
                            <td className="py-3 px-3 text-right whitespace-nowrap">
                              <div className="inline-flex items-center gap-1">
                                {/* Edit Drawer */}
                                <button
                                  onClick={() => handleOpenEdit(user)}
                                  disabled={!hasManagePermission}
                                  className="min-h-[36px] min-w-[36px] inline-flex items-center justify-center rounded-lg hover:bg-surface-container text-on-surface-variant transition-colors disabled:opacity-40"
                                  title="Edit User Profile"
                                >
                                  <span className="material-symbols-outlined text-[18px]">edit</span>
                                </button>

                                {/* Lock / Unlock Button */}
                                {isLocked ? (
                                  <button
                                    onClick={() => triggerUserAction("UNLOCK", user)}
                                    disabled={!hasManagePermission}
                                    className="min-h-[36px] px-2 py-1 rounded bg-secondary text-on-secondary font-mono text-[11px] font-semibold flex items-center gap-1 shadow-xs disabled:opacity-40"
                                    title="Unlock Account"
                                  >
                                    <span className="material-symbols-outlined text-[14px]">lock_open</span>
                                    <span>Unlock</span>
                                  </button>
                                ) : (
                                  <button
                                    onClick={() => triggerUserAction("LOCK", user)}
                                    disabled={!hasManagePermission || isDeactivated}
                                    className="min-h-[36px] min-w-[36px] inline-flex items-center justify-center rounded-lg hover:bg-surface-container text-on-surface-variant transition-colors disabled:opacity-40"
                                    title="Lock Account"
                                  >
                                    <span className="material-symbols-outlined text-[18px]">lock</span>
                                  </button>
                                )}

                                {/* Reset Password (Admin only) */}
                                <button
                                  onClick={() => triggerUserAction("RESET_PASSWORD", user)}
                                  disabled={!hasManagePermission || isDeactivated}
                                  className="min-h-[36px] min-w-[36px] inline-flex items-center justify-center rounded-lg hover:bg-surface-container text-primary transition-colors disabled:opacity-40"
                                  title="Admin Reset Password (generates temporary credential)"
                                >
                                  <span className="material-symbols-outlined text-[18px]">key</span>
                                </button>

                                {/* Deactivate / Reactivate */}
                                {isDeactivated ? (
                                  <button
                                    onClick={() => triggerUserAction("REACTIVATE", user)}
                                    disabled={!hasManagePermission}
                                    className="min-h-[36px] min-w-[36px] inline-flex items-center justify-center rounded-lg hover:bg-emerald-50 text-emerald-700 transition-colors disabled:opacity-40"
                                    title="Reactivate Account"
                                  >
                                    <span className="material-symbols-outlined text-[18px]">restart_alt</span>
                                  </button>
                                ) : (
                                  <button
                                    onClick={() => triggerUserAction("DEACTIVATE", user)}
                                    disabled={!hasManagePermission}
                                    className="min-h-[36px] min-w-[36px] inline-flex items-center justify-center rounded-lg hover:bg-red-50 text-red-700 transition-colors disabled:opacity-40"
                                    title="Deactivate Account (Permanent non-reuse of ID)"
                                  >
                                    <span className="material-symbols-outlined text-[18px]">person_off</span>
                                  </button>
                                )}

                                {/* View Audit Ledger */}
                                <button
                                  onClick={() => setAuditUserTarget(user)}
                                  className="min-h-[36px] min-w-[36px] inline-flex items-center justify-center rounded-lg hover:bg-surface-container text-outline transition-colors"
                                  title="View User Audit Ledger"
                                >
                                  <span className="material-symbols-outlined text-[18px]">history_edu</span>
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>

              {/* Table Summary Bar */}
              <div className="p-space-sm bg-surface-container-low rounded-b-lg flex flex-wrap items-center justify-between gap-space-sm text-on-surface-variant font-mono text-[11px] mt-1 border-t border-outline-variant/30">
                <span>
                  Showing <strong>{filteredUsers.length}</strong> of <strong>{users.length}</strong> registered cleanroom personnel
                </span>
                <span className="text-secondary font-semibold">
                  21 CFR Part 11 Personnel Verification Enforced
                </span>
              </div>
            </div>
          </div>

          {/* SIDE DRAWER (Add / Edit Panel) */}
          {isDrawerOpen && (
            <div className="xl:col-span-4 bg-surface-container-lowest rounded-xl shadow-md border border-outline-variant/50 p-space-lg flex flex-col justify-between transition-all">
              <div className="space-y-space-md">
                {/* Drawer Header */}
                <div className="flex items-start justify-between pb-space-sm border-b border-outline-variant/30">
                  <div className="flex flex-col">
                    <div className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-primary text-[22px]">
                        {drawerMode === "ADD" ? "person_add" : "manage_accounts"}
                      </span>
                      <h2 className="font-headline-md text-base font-bold text-on-surface tracking-tight">
                        {drawerMode === "ADD" ? "Add Personnel Account" : "Edit User Account"}
                      </h2>
                    </div>
                    <span className="font-caption text-[11px] text-on-surface-variant mt-0.5">
                      {drawerMode === "ADD"
                        ? "Provision new biopharma operator under 21 CFR §11.10"
                        : `Modifying record: ${formUserId}`}
                    </span>
                  </div>
                  <button
                    onClick={() => setIsDrawerOpen(false)}
                    className="min-h-[36px] min-w-[36px] inline-flex items-center justify-center rounded-lg hover:bg-surface-container text-on-surface-variant"
                  >
                    <span className="material-symbols-outlined text-[20px]">close</span>
                  </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSaveUser} className="space-y-space-md">
                  {/* User ID */}
                  <div className="flex flex-col space-y-1">
                    <div className="flex items-center justify-between">
                      <label className="font-caption text-[11px] text-on-surface-variant uppercase tracking-wider font-semibold">
                        User ID (System Key) <span className="text-red-700">*</span>
                      </label>
                      <span className="inline-flex items-center gap-1 px-1.5 py-0.2 rounded bg-surface-container text-on-surface-variant font-mono text-[10px]">
                        <span className="material-symbols-outlined text-[12px]">lock</span>
                        Immutable §11.10
                      </span>
                    </div>
                    <div className="relative">
                      <input
                        className={`w-full font-mono text-xs py-2 px-3 rounded-lg min-h-[44px] border border-outline-variant/60 ${
                          drawerMode === "EDIT"
                            ? "bg-surface-container-low text-outline cursor-not-allowed select-all"
                            : "bg-surface-container-lowest text-primary font-bold focus:outline-none focus:ring-2 focus:ring-primary"
                        }`}
                        readOnly={drawerMode === "EDIT"}
                        required
                        type="text"
                        value={formUserId}
                        onChange={(e) => setFormUserId(e.target.value)}
                        placeholder="e.g. init3, tech1"
                      />
                      <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-outline text-[18px]">
                        verified_user
                      </span>
                    </div>
                    <span className="font-caption text-[10px] text-on-surface-variant">
                      {drawerMode === "ADD"
                        ? "Alphanumeric ID. Once created or deactivated, this ID can NEVER be reused under FDA protocols."
                        : "Locked after creation. Non-transferable under strict GMP audit requirements."}
                    </span>
                  </div>

                  {/* Full Legal Name */}
                  <div className="flex flex-col space-y-1">
                    <label className="font-caption text-[11px] text-on-surface-variant uppercase tracking-wider font-semibold">
                      Full Legal Name <span className="text-red-700">*</span>
                    </label>
                    <input
                      className="w-full bg-surface-container-lowest text-on-surface font-body-md text-xs py-2 px-3 rounded-lg border border-outline-variant/60 focus:outline-none focus:ring-2 focus:ring-primary min-h-[44px]"
                      type="text"
                      required
                      value={formFullName}
                      onChange={(e) => setFormFullName(e.target.value)}
                      placeholder="e.g. Sarah Jenkins"
                    />
                  </div>

                  {/* Assigned Department */}
                  <div className="flex flex-col space-y-1">
                    <label className="font-caption text-[11px] text-on-surface-variant uppercase tracking-wider font-semibold">
                      Assigned Department <span className="text-red-700">*</span>
                    </label>
                    <div className="relative">
                      <select
                        className="w-full appearance-none min-h-[44px] px-3 py-2 bg-surface-container-lowest text-on-surface font-body-md text-xs rounded-lg pr-9 border border-outline-variant/60 focus:outline-none focus:ring-2 focus:ring-primary"
                        value={formDepartmentId}
                        onChange={(e) => setFormDepartmentId(e.target.value)}
                      >
                        {departments.map((dept) => (
                          <option key={dept.id} value={dept.id}>
                            {dept.name} ({dept.code})
                          </option>
                        ))}
                      </select>
                      <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-on-surface-variant text-[18px]">
                        expand_more
                      </span>
                    </div>
                  </div>

                  {/* Group Assignment */}
                  <div className="flex flex-col space-y-1">
                    <label className="font-caption text-[11px] text-on-surface-variant uppercase tracking-wider font-semibold">
                      Group Level &amp; Permissions <span className="text-red-700">*</span>
                    </label>
                    <div className="space-y-1.5 bg-surface-container-low p-2.5 rounded-lg border border-outline-variant/30">
                      {groups.map((group) => (
                        <label key={group.id} className="flex items-start gap-2 cursor-pointer">
                          <input
                            type="checkbox"
                            className="mt-1"
                            checked={formGroupIds.includes(group.id)}
                            onChange={() => handleToggleGroup(group.id)}
                          />
                          <span className="font-body-md text-xs text-on-surface">
                            {group.name}{" "}
                            <span className="font-mono text-[10px] text-outline">
                              {group.role}
                              {!group.active ? " · inactive" : ""}
                            </span>
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* E-Signature Meanings */}
                  <div className="flex flex-col space-y-2 pt-1">
                    <div className="flex items-center justify-between">
                      <label className="font-caption text-[11px] text-on-surface-variant uppercase tracking-wider font-semibold">
                        Authorized §11.50 Manifestations
                      </label>
                      <span className="font-caption text-[10px] text-secondary font-mono">Select all applicable</span>
                    </div>
                    <div className="space-y-1.5 bg-surface-container-low p-2.5 rounded-lg border border-outline-variant/30">
                      {[
                        {
                          meaning: "INITIATOR" as ESignMeaning,
                          title: "Authorship & Custody Handover",
                          desc: "Signs for execution of batch movements, stage transitions and binder creation.",
                        },
                        {
                          meaning: "REVIEW" as ESignMeaning,
                          title: "Technical Review (HOD)",
                          desc: "Departmental sign-off and verification of hold clocks and stage records.",
                        },
                        {
                          meaning: "APPROVAL" as ESignMeaning,
                          title: "Quality Release & Disposition (QA)",
                          desc: "Final pharmaceutical release approval under 21 CFR Part 11.",
                        },
                      ].map((item) => {
                        const checked = formESignMeanings.includes(item.meaning);
                        return (
                          <label
                            key={item.meaning}
                            className="flex items-start gap-2.5 p-1.5 rounded hover:bg-surface-container cursor-pointer min-h-[38px]"
                          >
                            <input
                              type="checkbox"
                              checked={checked}
                              onChange={() => handleToggleESign(item.meaning)}
                              className="mt-1 w-4 h-4 rounded text-primary focus:ring-primary"
                            />
                            <div className="flex flex-col">
                              <span className="font-body-sm text-xs font-semibold text-on-surface">
                                {item.title}
                              </span>
                              <span className="font-caption text-[10px] text-on-surface-variant">
                                {item.desc}
                              </span>
                            </div>
                          </label>
                        );
                      })}
                    </div>
                  </div>

                  {/* Mandatory Audit Reason */}
                  <div className="flex flex-col space-y-1 pt-1">
                    <div className="flex items-center justify-between">
                      <label className="font-caption text-[11px] text-on-surface uppercase tracking-wider font-bold">
                        Reason for Change (Mandatory Audit Entry) <span className="text-red-700">*</span>
                      </label>
                      <span className="font-caption text-[10px] text-on-surface-variant font-mono">Min 5 chars</span>
                    </div>
                    <textarea
                      required
                      className="w-full bg-surface-container-lowest text-on-surface font-body-sm text-xs p-2.5 rounded-lg border border-outline-variant/60 focus:outline-none focus:ring-2 focus:ring-primary"
                      placeholder="State explicit operational justification for this user profile adjustment..."
                      rows={3}
                      value={formReason}
                      onChange={(e) => setFormReason(e.target.value)}
                    />
                  </div>

                  {/* Permanent Non-Reuse Callout Box */}
                  <div className="bg-surface-container p-3 rounded-lg flex items-start gap-2.5 text-on-surface-variant border border-outline-variant/40">
                    <span className="material-symbols-outlined text-secondary text-[20px] shrink-0 mt-0.5">
                      info
                    </span>
                    <p className="font-caption text-[10px] leading-relaxed">
                      <strong>Ledger Preservation Notice:</strong> A deactivated User ID can never be reused. Under FDA 21 CFR §11.10(d) and EU GMP Annex 11, identifiers are permanently retired to guarantee historical ledger integrity.
                    </p>
                  </div>

                  {/* Form Footer */}
                  <div className="pt-space-md flex items-center justify-between gap-2 border-t border-outline-variant/30">
                    <button
                      type="button"
                      onClick={() => setIsDrawerOpen(false)}
                      className="min-h-[44px] px-4 py-2 rounded-lg bg-surface-container-low hover:bg-surface-container text-on-surface-variant font-headline-sm text-xs font-semibold transition-colors"
                    >
                      Cancel
                    </button>
                    <Button
                      variant="primary"
                      size="sm"
                      icon="fingerprint"
                      loading={formSaving}
                      type="submit"
                    >
                      {drawerMode === "ADD" ? "Provision & Seal" : "Save Changes & Sign"}
                    </Button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>

        {/* Action Confirmation Modal (Lock / Unlock / Deactivate / Reset Password) */}
        <Modal
          isOpen={actionConfirmOpen}
          onClose={() => setActionConfirmOpen(false)}
          title={`Confirm Action: ${pendingAction?.replace("_", " ")}`}
          badge={actionTargetUser?.userId}
          maxWidth="sm"
          footer={
            <>
              <Button variant="secondary" size="sm" onClick={() => setActionConfirmOpen(false)}>
                Cancel
              </Button>
              <Button
                variant={pendingAction === "DEACTIVATE" || pendingAction === "LOCK" ? "destructive" : "primary"}
                size="sm"
                onClick={handleConfirmAction}
                loading={actionLoading}
              >
                Confirm &amp; Log
              </Button>
            </>
          }
        >
          <div className="flex flex-col gap-3 text-left">
            <p className="font-body-md text-xs text-on-surface leading-relaxed">
              You are about to perform <strong>{pendingAction}</strong> on personnel account{" "}
              <strong>{actionTargetUser?.fullName}</strong> ({actionTargetUser?.userId}).
            </p>

            {pendingAction === "DEACTIVATE" && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-900 text-xs flex items-start gap-2">
                <span className="material-symbols-outlined text-[18px] text-red-600 shrink-0">
                  warning
                </span>
                <span>
                  <strong>Warning:</strong> Deactivating this user will permanently retire the User ID{" "}
                  <code>{actionTargetUser?.userId}</code>. It can NEVER be assigned to another person.
                </span>
              </div>
            )}

            {pendingAction === "RESET_PASSWORD" && (
              <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg text-amber-900 text-xs flex items-start gap-2">
                <span className="material-symbols-outlined text-[18px] text-amber-700 shrink-0">
                  key
                </span>
                <span>
                  A compliant temporary password will be generated and shown ONCE. The operator will be flagged to rotate their credential immediately upon next login.
                </span>
              </div>
            )}

            <div className="flex flex-col gap-1 mt-2">
              <label className="font-caption text-[11px] uppercase font-bold text-on-surface">
                Reason for Change (Mandatory Audit Entry) <span className="text-red-700">*</span>
              </label>
              <textarea
                required
                rows={3}
                className="w-full bg-surface-container-low border border-outline-variant/60 rounded-lg p-2.5 text-xs font-body-sm text-on-surface focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="State regulatory justification (e.g. Employee reassignment SOP-HR-04)..."
                value={actionReason}
                onChange={(e) => setActionReason(e.target.value)}
              />
            </div>
          </div>
        </Modal>

        {/* Temporary Password Display Modal */}
        <Modal
          isOpen={tempPasswordModalOpen}
          onClose={() => setTempPasswordModalOpen(false)}
          title="Temporary Password Generated"
          badge="ONE-TIME VIEW"
          maxWidth="sm"
          footer={
            <Button variant="primary" size="sm" onClick={() => setTempPasswordModalOpen(false)}>
              Done (I Have Recorded It)
            </Button>
          }
        >
          <div className="flex flex-col gap-3 text-left">
            <p className="font-body-md text-xs text-on-surface">
              The credentials for <strong>{tempPasswordUser?.fullName}</strong> ({tempPasswordUser?.userId}) have been reset. Deliver this temporary password through authorized secure channels:
            </p>

            <div className="p-4 bg-surface-container-low border border-outline-variant/60 rounded-xl flex items-center justify-between font-mono">
              <span className="text-base font-bold text-primary tracking-wider">
                {generatedTempPassword}
              </span>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(generatedTempPassword);
                  showToast("info", "Copied", "Temporary password copied to clipboard.");
                }}
                className="px-2.5 py-1 rounded bg-surface-container hover:bg-surface-container-high text-xs font-semibold transition-colors flex items-center gap-1"
              >
                <span className="material-symbols-outlined text-[14px]">content_copy</span>
                <span>Copy</span>
              </button>
            </div>

            <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg text-amber-950 text-xs">
              <span className="font-bold">Next Login Requirement:</span> The operator will be blocked from performing movements or signing until they change this temporary credential to a compliant permanent password.
            </div>
          </div>
        </Modal>

        {/* Record Audit Drawer for User History */}
        {auditUserTarget && (
          <RecordAuditDrawer
            isOpen={!!auditUserTarget}
            onClose={() => setAuditUserTarget(null)}
            entityId={auditUserTarget.id}
            entityType="USER"
            entityTitle={`${auditUserTarget.fullName} (${auditUserTarget.userId})`}
          />
        )}
      </div>
    </AppLayout>
  );
}
