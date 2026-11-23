import React, { useState } from "react";
import { useSession } from "@/services/session";
import { Role } from "@/domain/types";
import { TimeService } from "@/services/time";
import { Api } from "@/services/api";
import { useToast } from "@/components/ui/Toast";

export const DevMenu: React.FC = () => {
  const { currentRole, setRole, isDevMode, resetAllData, currentUser } = useSession();
  const [isOpen, setIsOpen] = useState(false);
  const [networkError, setNetworkError] = useState(Api.isNetworkFailure());
  const { showToast } = useToast();

  if (!isDevMode) return null;

  const roles: { role: Role; label: string; user: string }[] = [
    { role: "INITIATOR", label: "Initiator", user: "Anita Shah (init1)" },
    { role: "HOD", label: "Department HOD", user: "Dr. Marcus Vance (hod1)" },
    { role: "QA", label: "QA Auditor", user: "Elena Rostova (qa1)" },
    { role: "ADMIN", label: "Administrator", user: "David Chen (admin1)" },
  ];

  const handleRoleChange = async (role: Role) => {
    const switched = await setRole(role);
    if (!switched) {
      showToast("error", "Role Unavailable", `No active user is assigned to the ${role} group.`);
      return;
    }
    showToast("info", "Role Switched", `Signed in as the active ${role} user.`);
  };

  const handleReset = async () => {
    if (confirm("Reset all local data and restore initial seed configuration?")) {
      await resetAllData();
      showToast("success", "Database Reset", "Seed data reloaded successfully.");
    }
  };

  const handleTimeAdvance = (mins: number) => {
    TimeService.advanceTime(0, mins, 0);
    showToast("info", "Time Advanced", `Server time advanced by ${mins} minutes.`);
  };

  const handleNetworkToggle = () => {
    const nextState = !networkError;
    Api.setNetworkFailure(nextState);
    setNetworkError(nextState);
    showToast(
      nextState ? "error" : "success",
      nextState ? "Network Failure Simulated" : "Network Restored",
      nextState ? "All mutating endpoints will reject with NETWORK_ERROR" : "Normal latency restored"
    );
  };

  return (
    <>
      {/* Floating DEV Trigger Badge */}
      <div className="fixed bottom-4 left-4 z-50">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-amber-500 hover:bg-amber-600 text-white font-mono text-xs font-bold shadow-lg transition-transform active:scale-95"
          title="Open Dev Sandbox Controls (?dev=1)"
        >
          <span className="material-symbols-outlined text-[16px]">bug_report</span>
          <span>DEV MENU</span>
          <span className="px-1.5 py-0.2 rounded bg-black/20 text-[10px] uppercase">
            {currentRole}
          </span>
        </button>
      </div>

      {/* Dev Menu Drawer */}
      {isOpen && (
        <div className="fixed bottom-16 left-4 z-50 w-80 bg-surface-container-lowest border border-amber-300 rounded-xl shadow-2xl p-4 flex flex-col gap-3 font-body-md animate-in slide-in-from-bottom-2 duration-150">
          <div className="flex items-center justify-between pb-2 border-b border-outline-variant/30">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-amber-600 text-[20px]">
                build_circle
              </span>
              <span className="font-headline-sm text-xs font-bold text-on-surface">
                Dev & Compliance Controls
              </span>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-outline hover:text-on-surface p-1"
            >
              <span className="material-symbols-outlined text-[18px]">close</span>
            </button>
          </div>

          {/* Role Switcher */}
          <div className="flex flex-col gap-1.5 text-left">
            <span className="font-caption text-[11px] font-semibold text-on-surface-variant uppercase">
              Switch Active Role
            </span>
            <div className="grid grid-cols-2 gap-1.5">
              {roles.map((r) => {
                const active = currentRole === r.role;
                return (
                  <button
                    key={r.role}
                    onClick={() => handleRoleChange(r.role)}
                    className={`px-2.5 py-1.5 rounded-lg text-left text-xs font-mono transition-colors flex flex-col ${
                      active
                        ? "bg-primary text-on-primary font-bold shadow-xs"
                        : "bg-surface-container hover:bg-surface-container-high text-on-surface"
                    }`}
                  >
                    <span>{r.label}</span>
                    <span className={`text-[9px] truncate ${active ? "text-primary-fixed" : "text-outline"}`}>
                      {r.user.split(" ")[0]}
                    </span>
                  </button>
                );
              })}
            </div>
            {currentUser && (
              <span className="font-caption text-[10px] text-outline mt-0.5">
                Acting as: <strong>{currentUser.fullName}</strong> ({currentUser.userId})
              </span>
            )}
          </div>

          {/* Simulated Time Controls */}
          <div className="flex flex-col gap-1 text-left pt-2 border-t border-outline-variant/30">
            <span className="font-caption text-[11px] font-semibold text-on-surface-variant uppercase">
              Time Shift (R1 Time)
            </span>
            <div className="flex items-center gap-1.5 font-mono text-xs">
              <button
                onClick={() => handleTimeAdvance(15)}
                className="flex-1 py-1 rounded bg-surface-container hover:bg-surface-container-high text-center text-xs"
              >
                +15m
              </button>
              <button
                onClick={() => handleTimeAdvance(60)}
                className="flex-1 py-1 rounded bg-surface-container hover:bg-surface-container-high text-center text-xs"
              >
                +1h
              </button>
              <button
                onClick={() => handleTimeAdvance(24 * 60)}
                className="flex-1 py-1 rounded bg-surface-container hover:bg-surface-container-high text-center text-xs"
              >
                +24h
              </button>
              <button
                onClick={() => {
                  TimeService.resetOffset();
                  showToast("info", "Time Reset", "Offset set back to real device time.");
                }}
                className="px-2 py-1 rounded bg-surface-container hover:bg-surface-container-high text-outline"
                title="Reset to device time"
              >
                <span className="material-symbols-outlined text-[14px]">history</span>
              </button>
            </div>
          </div>

          {/* Network Failure Simulator */}
          <div className="flex items-center justify-between pt-2 border-t border-outline-variant/30">
            <div className="flex flex-col text-left">
              <span className="font-headline-sm text-xs font-semibold text-on-surface">
                Simulate Network Failure
              </span>
              <span className="font-caption text-[10px] text-on-surface-variant">
                Enforces R11 NETWORK_ERROR
              </span>
            </div>
            <button
              onClick={handleNetworkToggle}
              className={`w-10 h-6 rounded-full transition-colors flex items-center p-1 ${
                networkError ? "bg-red-500 justify-end" : "bg-outline-variant/60 justify-start"
              }`}
            >
              <span className="w-4 h-4 rounded-full bg-white shadow-sm" />
            </button>
          </div>

          {/* Self-Test & Reset Actions */}
          <div className="pt-2 border-t border-outline-variant/30 flex flex-col gap-1.5">
            <a
              href="/#/dev/selftest"
              className="w-full py-1.5 rounded-lg bg-surface-container-low hover:bg-surface-container border border-outline-variant/40 text-primary font-mono text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
            >
              <span className="material-symbols-outlined text-[16px]">verified</span>
              <span>Run Domain Self-Test (/#/dev/selftest)</span>
            </a>
            <button
              onClick={handleReset}
              className="w-full py-1.5 rounded-lg bg-red-50 hover:bg-red-100 border border-red-200 text-red-700 font-mono text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
            >
              <span className="material-symbols-outlined text-[16px]">restart_alt</span>
              <span>Reset All Data to §6 Seed</span>
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default DevMenu;

