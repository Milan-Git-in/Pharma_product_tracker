"use client";

import React, { useEffect, useState } from "react";
import { HashRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { useSession } from "@/services/session";

// Dynamic / Client Page Imports
import LoginPage from "@/app/login/page";
import ChangePasswordPage from "@/app/change-password/page";
import SessionLockPage from "@/app/session-lock/page";
import ElectronicSignaturePage from "@/app/electronic-signature/page";
import InitiatorDashboardPage from "@/pages/InitiatorDashboardPage";
import HodQaDashboardPage from "@/app/dashboard/hod-qa/page";
import BinderListPage from "@/app/binders/page";
import BinderFormPage from "@/app/binders/new/page";
import BinderDetailPage from "@/app/binders/detail/page";
import MovementDialogsPage from "@/app/movements/page";
import ColdRoomMapPage from "@/app/cold-room-map/page";
import ScanLookupPage from "@/app/scan-lookup/page";
import ReportsHubPage from "@/app/reports/page";
import BatchReportPrintPage from "@/app/reports/batch-print/page";
import AuditTrailPage from "@/app/audit-trail/page";
import UserManagementPage from "@/app/admin/users/page";
import GroupsAccessPage from "@/app/admin/groups/page";
import MastersPage from "@/app/admin/masters/page";
import BarcodeDesignerPage from "@/app/admin/barcode-designer/page";
import WorkflowStagesPage from "@/app/admin/workflow/stages/page";
import WorkflowHoldRulesPage from "@/app/admin/workflow/hold-time-rules/page";
import WorkflowRoutingPage from "@/app/admin/workflow/signature-routing/page";
import SystemStatusPage from "@/app/admin/system-status/page";
import NetworkFailurePage from "@/app/network-failure/page";
import DevSelfTestPage from "@/pages/DevSelfTestPage";

const PUBLIC_PATHS = ["/login"];

const AuthGate: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { currentUser, ready } = useSession();
  const location = useLocation();

  if (!ready) {
    return (
      <div className="min-h-screen bg-surface flex items-center justify-center font-mono text-xs text-outline">
        Restoring signed-in operator...
      </div>
    );
  }

  if (!currentUser && !PUBLIC_PATHS.includes(location.pathname)) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

export const HashRouterApp: React.FC = () => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="min-h-screen bg-surface flex items-center justify-center font-mono text-xs text-outline">
        Initializing PTS Architecture...
      </div>
    );
  }

  return (
    <HashRouter>
      <AuthGate>
      <Routes>
        {/* Operations */}
        <Route path="/" element={<InitiatorDashboardPage />} />
        <Route path="/dashboard/initiator" element={<InitiatorDashboardPage />} />
        <Route path="/binders" element={<BinderListPage />} />
        <Route path="/binders/new" element={<BinderFormPage />} />
        <Route path="/binders/detail" element={<BinderDetailPage />} />
        <Route path="/binders/:id" element={<BinderDetailPage />} />
        <Route path="/cold-room-map" element={<ColdRoomMapPage />} />
        <Route path="/scan-lookup" element={<ScanLookupPage />} />
        <Route path="/movements" element={<MovementDialogsPage />} />

        {/* Review & Quality */}
        <Route path="/dashboard/hod-qa" element={<HodQaDashboardPage />} />
        <Route path="/reports" element={<ReportsHubPage />} />
        <Route path="/reports/batch-print" element={<BatchReportPrintPage />} />
        <Route path="/audit-trail" element={<AuditTrailPage />} />

        {/* Administration */}
        <Route path="/admin/users" element={<UserManagementPage />} />
        <Route path="/admin/groups" element={<GroupsAccessPage />} />
        <Route path="/admin/masters" element={<MastersPage />} />
        <Route path="/admin/barcode-designer" element={<BarcodeDesignerPage />} />
        <Route path="/admin/workflow/stages" element={<WorkflowStagesPage />} />
        <Route path="/admin/workflow/hold-time-rules" element={<WorkflowHoldRulesPage />} />
        <Route path="/admin/workflow/signature-routing" element={<WorkflowRoutingPage />} />
        <Route path="/admin/system-status" element={<SystemStatusPage />} />

        {/* Security & States */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/change-password" element={<ChangePasswordPage />} />
        <Route path="/session-lock" element={<SessionLockPage />} />
        <Route path="/electronic-signature" element={<ElectronicSignaturePage />} />
        <Route path="/network-failure" element={<NetworkFailurePage />} />

        {/* Diagnostics & Dev */}
        <Route path="/dev/selftest" element={<DevSelfTestPage />} />

        {/* Catch-all redirect */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      </AuthGate>
    </HashRouter>
  );
};

export default HashRouterApp;
