import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession } from "@/services/session";
import { Role } from "@/domain/types";
import { can } from "@/services/permission";

interface NavItem {
  title: string;
  href: string;
  icon: string;
  code: string;
  allowedRoles: Role[];
  permission?: string;
}

interface NavSection {
  heading: string;
  items: NavItem[];
}

export const Sidebar: React.FC = () => {
  const pathname = usePathname();
  const { currentRole, currentUser, term } = useSession();

  const allSections: NavSection[] = [
    {
      heading: "Operations",
      items: [
        { title: "Dashboard", href: "/", icon: "dashboard", code: "S05", allowedRoles: ["INITIATOR", "ADMIN"] },
        { title: `${term("binder")} List`, href: "/binders", icon: "folder_open", code: "S06", allowedRoles: ["INITIATOR", "HOD", "QA", "ADMIN"] },
        { title: `Create ${term("binder")}`, href: "/binders/new", icon: "note_add", code: "S07", allowedRoles: ["INITIATOR", "ADMIN"], permission: "binder.create" },
        { title: `${term("binder")} Detail`, href: "/binders/detail", icon: "feed", code: "S08", allowedRoles: ["INITIATOR", "HOD", "QA", "ADMIN"] },
        { title: `${term("coldRoom")} Map`, href: "/cold-room-map", icon: "ac_unit", code: "S10", allowedRoles: ["INITIATOR", "HOD", "QA", "ADMIN"] },
        { title: "Scan & Lookup", href: "/scan-lookup", icon: "barcode_scanner", code: "S11", allowedRoles: ["INITIATOR"] },
        { title: "Movement Dialogs", href: "/movements", icon: "sync_alt", code: "S09", allowedRoles: ["INITIATOR"] },
      ],
    },
    {
      heading: "Review & Quality",
      items: [
        { title: "HOD / QA Dashboard", href: "/dashboard/hod-qa", icon: "fact_check", code: "S05", allowedRoles: ["HOD", "QA", "ADMIN"] },
        { title: "Reports Hub", href: "/reports", icon: "bar_chart", code: "S12", allowedRoles: ["INITIATOR", "HOD", "QA", "ADMIN"] },
        { title: "Batch Print Layout", href: "/reports/batch-print", icon: "print", code: "S15", allowedRoles: ["INITIATOR", "HOD", "QA", "ADMIN"] },
        { title: "Audit Trail Viewer", href: "/audit-trail", icon: "history_toggle_off", code: "S17", allowedRoles: ["QA", "ADMIN"] },
      ],
    },
    {
      heading: "Administration",
      items: [
        { title: "User Management", href: "/admin/users", icon: "manage_accounts", code: "S18", allowedRoles: ["ADMIN"] },
        { title: "Groups & Rights", href: "/admin/groups", icon: "shield_person", code: "S19", allowedRoles: ["ADMIN"] },
        { title: "Masters Catalog", href: "/admin/masters", icon: "dataset", code: "S20", allowedRoles: ["ADMIN"] },
        { title: "Barcode Designer", href: "/admin/barcode-designer", icon: "qr_code_2", code: "S21", allowedRoles: ["ADMIN"] },
        { title: "Workflow Stages", href: "/admin/workflow/stages", icon: "account_tree", code: "S22", allowedRoles: ["ADMIN"] },
        { title: "Hold Time Rules", href: "/admin/workflow/hold-time-rules", icon: "timer", code: "S22", allowedRoles: ["ADMIN"] },
        { title: "Signature Routing", href: "/admin/workflow/signature-routing", icon: "route", code: "S22", allowedRoles: ["ADMIN"] },
        { title: "Backup & Status", href: "/admin/system-status", icon: "settings_backup_restore", code: "S24", allowedRoles: ["ADMIN"] },
      ],
    },
    {
      heading: "Security & States",
      items: [
        { title: "Login Screen", href: "/login", icon: "login", code: "S01", allowedRoles: ["INITIATOR", "HOD", "QA", "ADMIN"] },
        { title: "Change Password", href: "/change-password", icon: "password", code: "S02", allowedRoles: ["INITIATOR", "HOD", "QA", "ADMIN"] },
        { title: "Session Lock Overlay", href: "/session-lock", icon: "screen_lock_landscape", code: "S03", allowedRoles: ["INITIATOR", "HOD", "QA", "ADMIN"] },
        { title: "Electronic Signature", href: "/electronic-signature", icon: "draw", code: "S04", allowedRoles: ["INITIATOR", "HOD", "QA", "ADMIN"] },
        { title: "Network Failure State", href: "/network-failure", icon: "wifi_off", code: "S24", allowedRoles: ["INITIATOR", "HOD", "QA", "ADMIN"] },
      ],
    },
  ];

  // Filter sections and items based on role
  const visibleSections = allSections
    .map((section) => ({
      ...section,
      items: section.items.filter((item) =>
        item.allowedRoles.includes(currentRole) &&
        (!item.permission || (!!currentUser && can(currentUser, item.permission)))
      ),
    }))
    .filter((section) => section.items.length > 0);

  const isActive = (href: string) => {
    if (href === "/" && pathname === "/") return true;
    if (href !== "/" && pathname?.startsWith(href)) return true;
    return false;
  };

  return (
    <aside className="fixed left-0 top-16 bottom-0 w-64 bg-surface-container-lowest border-r border-outline-variant/40 z-30 flex flex-col justify-between overflow-hidden shadow-xs">
      {/* Navigation Scrollable Area */}
      <div className="flex-1 overflow-y-auto no-scrollbar py-3 px-3">
        {visibleSections.map((section, idx) => (
          <div key={idx} className="mb-4">
            <div className="px-2.5 py-1 text-[11px] font-mono font-semibold text-outline tracking-wider uppercase">
              {section.heading}
            </div>
            <div className="space-y-0.5 mt-1">
              {section.items.map((item, itemIdx) => {
                const active = isActive(item.href);
                return (
                  <Link
                    key={itemIdx}
                    href={item.href}
                    className={`flex items-center justify-between px-2.5 py-2 rounded-lg text-xs transition-colors min-h-[40px] ${
                      active
                        ? "bg-primary-container text-on-primary font-semibold shadow-xs"
                        : "text-on-surface-variant hover:bg-surface-container hover:text-on-surface"
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <span
                        className={`material-symbols-outlined text-[18px] flex-shrink-0 ${
                          active ? "text-on-primary" : "text-outline"
                        }`}
                      >
                        {item.icon}
                      </span>
                      <span className="truncate">{item.title}</span>
                    </div>
                    <span
                      className={`font-mono text-[10px] px-1.5 py-0.2 rounded ${
                        active
                          ? "bg-on-primary-container/20 text-on-primary"
                          : "bg-surface-container text-outline"
                      }`}
                    >
                      {item.code}
                    </span>
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Sticky Bottom Context Ribbon (SPEC §1 & Layout) */}
      <div className="flex-shrink-0 border-t border-outline-variant/40 bg-surface-container-lowest">
        <div className="p-2.5 mx-3 my-2 rounded-lg bg-surface-container-low border border-outline-variant/40 flex items-center justify-between">
          <div className="flex flex-col text-left">
            <span className="font-caption text-[10px] text-on-surface-variant uppercase font-medium">
              GMP Compliance
            </span>
            <span className="font-mono text-[11px] text-secondary font-semibold">
              21 CFR Part 11 Active
            </span>
          </div>
          <span className="material-symbols-outlined text-secondary text-[18px]">verified_user</span>
        </div>

        {/* Permanent SPEC §1 PROTOTYPE ribbon */}
        <div className="bg-tertiary-container px-3 py-2 text-center flex items-center justify-center gap-1.5 border-t border-outline-variant/50">
          <span className="material-symbols-outlined text-tertiary-fixed text-[15px]">warning</span>
          <span className="font-mono text-[10px] font-bold tracking-wider text-tertiary-fixed uppercase">
            PROTOTYPE – NOT VALIDATED – do not enter real GMP data
          </span>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
