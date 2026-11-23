import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSession } from "@/services/session";

interface TopBarProps {
  currentScreenCode?: string;
}

export const TopBar: React.FC<TopBarProps> = ({ currentScreenCode = "" }) => {
  const { currentUser, currentRole, setRole, logout, serverTimeStr } = useSession();
  const router = useRouter();

  const roleLabels: Record<string, string> = {
    INITIATOR: "Floor Operator (Initiator)",
    HOD: "Department Reviewer (HOD)",
    QA: "Quality Assurance (QA)",
    ADMIN: "System Administrator",
  };

  const initials = currentUser
    ? currentUser.fullName
        .split(" ")
        .map((n) => n[0])
        .join("")
        .substring(0, 2)
    : "OP";

  return (
    <header className="fixed top-0 left-0 right-0 h-16 bg-surface-container-lowest border-b border-outline-variant/40 z-40 px-margin flex items-center justify-between shadow-xs">
      {/* Brand & System Title */}
      <div className="flex items-center gap-4">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center text-on-primary shadow-xs group-hover:bg-primary-container transition-colors">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
              <path d="M50 12L82 30.5V67.5L50 86L18 67.5V30.5L50 12Z" stroke="#BEE9FF" strokeLinejoin="round" strokeWidth="8" />
              <circle cx="50" cy="49" fill="#38BDF8" r="16" />
              <line stroke="#FFFFFF" strokeLinecap="round" strokeWidth="5" x1="50" x2="50" y1="26" y2="38" />
              <line stroke="#FFFFFF" strokeLinecap="round" strokeWidth="5" x1="50" x2="50" y1="60" y2="72" />
            </svg>
          </div>
          <div className="flex flex-col text-left">
            <div className="flex items-center gap-2">
              <span className="font-headline-sm text-sm text-on-surface font-semibold tracking-tight">
                PTS Biopharma
              </span>
              <span className="font-mono text-[10px] px-1.5 py-0.2 rounded bg-surface-container border border-outline-variant/40 text-on-surface-variant">
                v0.2
              </span>
            </div>
            <span className="font-caption text-[11px] text-on-surface-variant">
              Packing Area · Primary & Secondary Line 2
            </span>
          </div>
        </Link>

        {currentScreenCode && (
          <div className="hidden lg:flex items-center ml-4 pl-4 border-l border-outline-variant/40">
            <span className="px-2.5 py-1 rounded-md bg-surface-container font-mono text-xs font-semibold text-primary border border-outline-variant/30">
              {currentScreenCode}
            </span>
          </div>
        )}
      </div>

      {/* Center / Global Status & Server Time */}
      <div className="hidden md:flex items-center gap-3 font-mono text-xs">
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-surface-container-low border border-outline-variant/30 text-on-surface-variant">
          <span className="material-symbols-outlined text-[16px] text-outline">schedule</span>
          <span>Server Time:</span>
          <span className="font-semibold text-on-surface">{serverTimeStr}</span>
        </div>

        <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-amber-50 border border-amber-200 text-amber-900">
          <span className="material-symbols-outlined text-[15px] text-amber-600">lock_clock</span>
          <span>Idle Lock: <strong className="font-mono">24:18</strong></span>
        </div>
      </div>

      {/* Right / Actions & User Profile */}
      <div className="flex items-center gap-3">
        {/* Alerts Bell */}
        <Link
          href="/reports"
          className="relative w-10 h-10 rounded-lg hover:bg-surface-container flex items-center justify-center text-on-surface-variant transition-colors"
          title="Hold Time Alerts (3 Pending)"
        >
          <span className="material-symbols-outlined text-[20px]">notifications</span>
          <span className="absolute top-2 right-2 w-4 h-4 rounded-full bg-error text-on-error font-mono text-[10px] font-bold flex items-center justify-center animate-pulse">
            3
          </span>
        </Link>

        {/* User Chip & Role Switcher */}
        <div className="flex items-center gap-2.5 pl-2 border-l border-outline-variant/30">
          <div className="w-9 h-9 rounded-full bg-secondary-container text-on-secondary-container font-semibold flex items-center justify-center text-xs font-mono border border-secondary/20 shadow-xs">
            {initials}
          </div>
          <div className="hidden sm:flex flex-col text-left">
            <span className="font-body-md text-xs font-semibold text-on-surface leading-tight">
              {currentUser?.fullName || "Operator"}
            </span>
            <div className="flex items-center gap-1.5 mt-0.5">
              <select
                value={currentRole}
                onChange={(e) => setRole(e.target.value as any)}
                className="bg-surface-container-low hover:bg-surface-container text-primary font-mono text-[11px] font-bold py-0.5 px-1.5 rounded border border-outline-variant/60 focus:outline-none focus:ring-1 focus:ring-primary cursor-pointer"
                title="Switch active user role"
              >
                <option value="ADMIN">ADMIN</option>
                <option value="INITIATOR">INITIATOR</option>
                <option value="HOD">HOD</option>
                <option value="QA">QA</option>
              </select>
            </div>
          </div>
          <button
            type="button"
            onClick={async () => {
              await logout();
              router.push("/login");
            }}
            className="w-8 h-8 rounded-lg hover:bg-surface-container flex items-center justify-center text-outline hover:text-error transition-colors ml-1"
            title="Sign out"
          >
            <span className="material-symbols-outlined text-[18px]">logout</span>
          </button>
        </div>
      </div>
    </header>
  );
};

export default TopBar;
