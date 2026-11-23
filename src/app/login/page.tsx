"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { mockApi } from "@/api";
import { useSession } from "@/services/session";

const DEMO_PASSWORD = "Demo@1234";

export default function LoginPage() {
  const router = useRouter();
  const { login } = useSession();
  const [activeTab, setActiveTab] = useState<"active" | "locked">("active");
  const [demoOpen, setDemoOpen] = useState(true);
  const [showUnlockModal, setShowUnlockModal] = useState(false);
  const [userId, setUserId] = useState("init1");
  const [password, setPassword] = useState(DEMO_PASSWORD);
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const fillDemo = (nextUserId: string) => {
    setActiveTab("active");
    setUserId(nextUserId);
    setPassword(DEMO_PASSWORD);
    setError("");
  };

  const handleSignIn = async (event: React.FormEvent) => {
    event.preventDefault();
    setSubmitting(true);
    setError("");
    const res = await mockApi.login(userId.trim(), password);
    setSubmitting(false);
    if (!res.ok || !res.data) {
      const message = res.error?.message || "Sign-in failed.";
      setError(message);
      if (res.error?.code === "ACCOUNT_LOCKED") setActiveTab("locked");
      return;
    }
    const signedIn = await login(res.data.user);
    if (!signedIn) {
      setError("This account has no active access group. Contact an administrator.");
      return;
    }
    router.push(res.data.user.mustChangePassword ? "/change-password" : "/");
  };

  return (
    <div className="bg-surface font-body-md text-on-surface antialiased min-h-screen flex items-center justify-center p-gutter">
      <main className="w-full max-w-lg bg-surface-container-lowest rounded-xl border border-outline-variant/40 shadow-[0_4px_16px_rgba(0,0,0,0.06)] p-space-xl"><div className="flex flex-col w-full font-body-md text-on-surface">
{/*  TOP CONTEXT BAR: Regulatory Status & Server Clock  */}
<div className="flex flex-col sm:flex-row sm:items-center justify-between gap-space-sm pb-space-md mb-space-lg bg-surface-container-low p-space-md rounded-lg">
<div className="flex items-center gap-space-sm">
<span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-secondary-container/60 text-on-secondary-container font-label-sm text-label-sm">
<span className="w-1.5 h-1.5 rounded-full bg-primary"></span>
        21 CFR Part 11 / EU Annex 11 Validated
      </span>
<span className="inline-flex items-center px-2 py-0.5 rounded bg-error-container/40 text-on-error-container font-label-sm text-label-sm font-semibold">
        PROTOTYPE – NOT VALIDATED
      </span>
</div>
<div className="flex items-center gap-1.5 text-on-surface-variant font-label-sm text-label-sm">
<span className="material-symbols-outlined text-[16px] text-outline">schedule</span>
<span>Server Time: <span className="font-semibold text-on-surface" id="server-timestamp">26/02/2025 14:30:00 (UTC+00:00)</span></span>
</div>
</div>
{/*  AUTHENTICATION CARD HEADER  */}
<div className="flex items-start gap-space-md mb-space-lg">
<div className="w-14 h-14 rounded-xl bg-primary flex items-center justify-center text-on-primary shadow-sm flex-shrink-0">
<svg className="w-9 h-9" fill="none" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
<path d="M50 12L82 30.5V67.5L50 86L18 67.5V30.5L50 12Z" stroke="#BEE9FF" strokeLinejoin="round" strokeWidth="8"></path>
<circle cx="50" cy="49" fill="#38BDF8" r="16"></circle>
<line stroke="#FFFFFF" strokeLinecap="round" strokeWidth="5" x1="50" x2="50" y1="26" y2="38"></line>
<line stroke="#FFFFFF" strokeLinecap="round" strokeWidth="5" x1="50" x2="50" y1="60" y2="72"></line>
<line stroke="#FFFFFF" strokeLinecap="round" strokeWidth="5" x1="29" x2="40" y1="38" y2="44"></line>
<line stroke="#FFFFFF" strokeLinecap="round" strokeWidth="5" x1="60" x2="71" y1="54" y2="60"></line>
<line stroke="#FFFFFF" strokeLinecap="round" strokeWidth="5" x1="29" x2="40" y1="60" y2="54"></line>
<line stroke="#FFFFFF" strokeLinecap="round" strokeWidth="5" x1="60" x2="71" y1="44" y2="38"></line>
</svg>
</div>
<div className="flex-1 min-w-0">
<div className="flex items-center gap-space-xs flex-wrap">
<h1 className="font-headline-md text-headline-md text-on-surface tracking-tight">Product Tracking System (PTS)</h1>
</div>
<p className="font-body-sm text-body-sm text-on-surface-variant mt-0.5">
        Company Pharmaceutical Limited — Biopharma Division
      </p>
<div className="flex items-center gap-1.5 mt-1 text-on-surface-variant font-label-sm text-label-sm">
<span className="material-symbols-outlined text-[14px] text-outline">location_on</span>
<span>Area: Primary &amp; Secondary Packaging Line 2</span>
<span className="text-outline-variant">•</span>
<span className="text-primary font-medium">SOP-PTS-001 Rev 4</span>
</div>
</div>
</div>
{/*  VIEW MODE SWITCHER (Active Sign In vs Locked Preview)  */}
<div className="flex items-center p-1 bg-surface-container rounded-lg mb-space-lg text-body-sm font-body-sm">
<button type="button" onClick={() => setActiveTab("active")} className={`flex-1 min-h-[44px] flex items-center justify-center gap-2 rounded font-medium transition-all ${activeTab === "active" ? "bg-surface-container-lowest text-primary shadow-sm" : "text-on-surface-variant hover:text-on-surface"}`} id="tab-active-btn" >
<span className="material-symbols-outlined text-[18px]">lock_open</span>
      Standard Sign In
    </button>
<button type="button" onClick={() => setActiveTab("locked")} className={`flex-1 min-h-[44px] flex items-center justify-center gap-2 rounded font-medium transition-all ${activeTab === "locked" ? "bg-surface-container-lowest text-error shadow-sm" : "text-on-surface-variant hover:text-on-surface"}`} id="tab-locked-btn" >
<span className="material-symbols-outlined text-[18px] text-error">lock_clock</span>
      Locked Account Simulation
    </button>
</div>
{/*  1. STANDARD ACTIVE SIGN IN FORM  */}
<div className={activeTab === "active" ? "flex flex-col" : "hidden"} id="active-auth-view">
{/*  SECURITY AUDIT BANNER  */}
<div className="p-space-md rounded-lg bg-surface-container-high/60 mb-space-lg flex items-start gap-space-md">
<span className="material-symbols-outlined text-[20px] text-on-secondary-container mt-0.5">warning</span>
<div className="flex-1 min-w-0">
<div className="flex items-center justify-between gap-space-sm flex-wrap">
<span className="font-headline-sm text-headline-sm text-on-surface">Authentication Policy Warning</span>
<span className="px-2 py-0.5 rounded font-label-sm text-label-sm bg-secondary-fixed text-on-secondary-fixed font-semibold">
            5 failed attempts lock the account
          </span>
</div>
<p className="font-body-sm text-body-sm text-on-surface-variant mt-1">
          Account will automatically lock after 5 consecutive failed attempts per <span className="font-label-sm text-label-sm text-primary font-semibold">SOP-SEC-042</span>. Unlocking requires QA Administrator authorization.
        </p>
</div>
</div>
{/*  CREDENTIAL INPUTS  */}
<form className="flex flex-col gap-space-md" onSubmit={handleSignIn}>
{/*  User ID Input  */}
<div className="flex flex-col gap-1.5">
<div className="flex items-center justify-between">
<label className="font-label-md text-label-md text-on-surface font-semibold flex items-center gap-1.5" htmlFor="user-id-input">
<span className="material-symbols-outlined text-[16px] text-primary">badge</span>
            Operator / User ID
          </label>
<span className="font-label-sm text-label-sm text-outline">JetBrains Monospace Format</span>
</div>
<div className="relative flex items-center">
<span className="material-symbols-outlined absolute left-3.5 text-[20px] text-outline pointer-events-none">account_circle</span>
<input autoComplete="username" className="w-full min-h-[44px] pl-11 pr-4 py-2 bg-surface-container-lowest text-on-surface font-label-md text-label-md rounded-lg outline-none focus:bg-surface-container-lowest/80 transition-colors shadow-sm" id="user-id-input" name="userId" placeholder="e.g. init1" required type="text" value={userId} onChange={(e) => setUserId(e.target.value)}/>
</div>
</div>
{/*  Password Input  */}
<div className="flex flex-col gap-1.5">
<div className="flex items-center justify-between">
<label className="font-label-md text-label-md text-on-surface font-semibold flex items-center gap-1.5" htmlFor="password-input">
<span className="material-symbols-outlined text-[16px] text-primary">key</span>
            Electronic Signature Password
          </label>
<span className="font-caption text-caption text-error font-medium">Case-sensitive • 21 CFR §11.200</span>
</div>
<div className="relative flex items-center">
<span className="material-symbols-outlined absolute left-3.5 text-[20px] text-outline pointer-events-none">password</span>
<input autoComplete="current-password" className="w-full min-h-[44px] pl-11 pr-12 py-2 bg-surface-container-lowest text-on-surface font-label-md text-label-md rounded-lg outline-none focus:bg-surface-container-lowest/80 transition-colors shadow-sm" id="password-input" name="password" placeholder="Enter password..." required type={showPassword ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)}/>
<button aria-label="Toggle password view" className="absolute right-1 w-10 h-10 flex items-center justify-center text-outline hover:text-on-surface transition-colors" type="button" onClick={() => setShowPassword((open) => !open)}>
<span className="material-symbols-outlined text-[20px]" id="eye-icon">{showPassword ? "visibility_off" : "visibility"}</span>
</button>
</div>
</div>
{/*  Digital Signature Acknowledgment Note  */}
<div className="flex items-start gap-2.5 p-space-sm bg-surface-container-low rounded-lg mt-space-xs">
<span className="material-symbols-outlined text-[18px] text-primary mt-0.5">verified_user</span>
<p className="font-body-sm text-body-sm text-on-surface-variant">
          Submitting this electronic signature is the legally binding equivalent of a handwritten signature in compliance with 21 CFR Part 11.
        </p>
</div>
{error && (
<div className="p-space-sm rounded-lg bg-error-container/30 text-error font-body-sm text-body-sm" role="alert">
{error}
</div>
)}
{/*  ACTIONS  */}
<div className="flex flex-col gap-space-sm mt-space-sm">
<button disabled={submitting} className="w-full min-h-[44px] px-6 py-2.5 bg-primary text-on-primary hover:bg-primary-container font-headline-sm text-headline-sm rounded-lg flex items-center justify-center gap-2 shadow-md transition-all active:scale-[0.99] disabled:opacity-60" id="btn-sign-in" type="submit">
<span className="material-symbols-outlined text-[20px]">login</span>
          {submitting ? "Signing in..." : "Sign In to PTS"}
        </button>
<button className="w-full min-h-[44px] px-6 py-2 bg-surface-container-lowest hover:bg-surface-container text-primary font-body-md text-body-md rounded-lg flex items-center justify-center gap-2 transition-colors shadow-sm"  type="button">
<span className="material-symbols-outlined text-[20px] text-secondary">contactless</span>
          Login with Smart Card / PIV Token
        </button>
</div>
</form>
</div>
{/*  2. LOCKED ACCOUNT SIMULATION STATE  */}
<div className={activeTab === "locked" ? "flex flex-col" : "hidden"} id="locked-auth-view">
<div className="p-space-lg rounded-xl bg-error-container/20 flex flex-col gap-space-md mb-space-lg">
<div className="flex items-start gap-space-md">
<div className="w-12 h-12 rounded-lg bg-error-container text-error flex items-center justify-center flex-shrink-0">
<span className="material-symbols-outlined text-[28px]" style={{"fontVariationSettings":"'FILL' 1"}}>gpp_bad</span>
</div>
<div className="flex-1 min-w-0">
<div className="flex items-center justify-between gap-space-sm flex-wrap">
<h2 className="font-headline-sm text-headline-sm text-error font-bold">Account Locked (USR-QA-3319)</h2>
<span className="px-2.5 py-1 rounded bg-error text-on-error font-label-sm text-label-sm font-bold uppercase tracking-wider">
              Audit Hold Active
            </span>
</div>
<p className="font-label-md text-label-md text-on-error-container mt-1 font-semibold">
            5 of 5 attempts exceeded • Locked on 26/02/2025 at 14:12:08 UTC
          </p>
</div>
</div>
<div className="p-space-md bg-surface-container-lowest rounded-lg flex flex-col gap-2">
<p className="font-body-md text-body-md text-on-surface">
          This credential set was automatically sealed pursuant to protocol <strong className="font-semibold text-primary">SOP-SEC-042 (Unauthorized Access Mitigation)</strong>. 
          Electronic sign-in capabilities have been suspended to protect cleanroom batch records integrity.
        </p>
<div className="flex items-center gap-space-md pt-2 flex-wrap font-label-sm text-label-sm text-on-surface-variant">
<span className="flex items-center gap-1">
<span className="material-symbols-outlined text-[16px] text-outline">support_agent</span>
            QA Systems Admin: <strong className="text-on-surface">Ext. 4410</strong>
</span>
<span className="flex items-center gap-1">
<span className="material-symbols-outlined text-[16px] text-outline">domain</span>
            Floor QA Desk: <strong className="text-on-surface">Bldg 4 • Suite 210</strong>
</span>
</div>
</div>
{/*  Disabled Input Snapshot  */}
<div className="flex flex-col gap-2 opacity-60 pointer-events-none">
<input className="w-full min-h-[44px] px-3.5 bg-surface-container-high text-on-surface-variant font-label-md text-label-md rounded-lg" disabled type="text" defaultValue="USR-QA-3319 (Elena Rostova - Suspended)"/>
</div>
{/*  Action buttons for locked state  */}
<div className="flex flex-col sm:flex-row gap-space-sm pt-1">
<button className="flex-1 min-h-[44px] px-4 py-2 bg-primary text-on-primary hover:bg-primary-container font-body-md text-body-md rounded-lg flex items-center justify-center gap-2 shadow-sm transition-all"  type="button">
<span className="material-symbols-outlined text-[18px]">lock_reset</span>
          Request Unlock / Contact Admin
        </button>
<button className="min-h-[44px] px-4 py-2 bg-surface-container text-on-surface hover:bg-surface-container-high font-body-md text-body-md rounded-lg flex items-center justify-center transition-colors" type="button" onClick={() => setActiveTab("active")}>
          Return to Login
        </button>
</div>
</div>
</div>
{/*  3. COLLAPSIBLE PROTOTYPE DEMO ACCOUNTS MATRIX  */}
<div className="mt-space-lg rounded-xl bg-surface-container-low p-space-md flex flex-col">
<div className="flex items-center justify-between cursor-pointer select-none" onClick={() => setDemoOpen((open) => !open)}>
<div className="flex items-center gap-2">
<span className="material-symbols-outlined text-[20px] text-primary">science</span>
<div>
<span className="font-headline-sm text-headline-sm text-on-surface font-semibold block">Prototype Demo Accounts</span>
<span className="font-body-sm text-body-sm text-on-surface-variant">Click any profile to autofill GMP credentials</span>
</div>
</div>
<button className="w-8 h-8 rounded flex items-center justify-center text-outline hover:text-on-surface transition-transform duration-200" id="demo-toggle-icon" type="button">
<span className="material-symbols-outlined text-[20px]">{demoOpen ? "expand_less" : "expand_more"}</span>
</button>
</div>
{/*  Account Selection Grid  */}
<div className={`grid grid-cols-1 sm:grid-cols-2 gap-space-sm mt-space-md pt-space-md border-t border-outline-variant/30 ${demoOpen ? "" : "hidden"}`} id="demo-accounts-drawer">
{/*  Role 1: Initiator  */}
<button className="flex flex-col text-left p-space-sm bg-surface-container-lowest hover:bg-surface-container rounded-lg shadow-sm transition-all text-on-surface group" type="button" onClick={() => fillDemo("init1")}>
<div className="flex items-center justify-between w-full mb-1">
<span className="font-label-sm text-label-sm px-2 py-0.5 rounded bg-primary-fixed text-on-primary-fixed font-semibold">
            Floor Initiator
          </span>
<span className="material-symbols-outlined text-[16px] text-outline group-hover:text-primary transition-colors">touch_app</span>
</div>
<span className="font-headline-sm text-headline-sm text-on-surface font-semibold">Anita Shah</span>
<span className="font-label-sm text-label-sm text-primary font-medium">init1 · Demo@1234</span>
<span className="font-caption text-caption text-on-surface-variant mt-1">Primary Packaging Operator • Line 2 Records</span>
</button>
{/*  Role 2: Department HOD  */}
<button className="flex flex-col text-left p-space-sm bg-surface-container-lowest hover:bg-surface-container rounded-lg shadow-sm transition-all text-on-surface group" type="button" onClick={() => fillDemo("hod1")}>
<div className="flex items-center justify-between w-full mb-1">
<span className="font-label-sm text-label-sm px-2 py-0.5 rounded bg-secondary-fixed text-on-secondary-fixed font-semibold">
            Department HOD
          </span>
<span className="material-symbols-outlined text-[16px] text-outline group-hover:text-secondary transition-colors">touch_app</span>
</div>
<span className="font-headline-sm text-headline-sm text-on-surface font-semibold">Dr. Marcus Vance</span>
<span className="font-label-sm text-label-sm text-secondary font-medium">hod1 · Demo@1234</span>
<span className="font-caption text-caption text-on-surface-variant mt-1">Biopharma Reviewer • Secondary Sign-off</span>
</button>
{/*  Role 3: QA Approver  */}
<button className="flex flex-col text-left p-space-sm bg-surface-container-lowest hover:bg-surface-container rounded-lg shadow-sm transition-all text-on-surface group" type="button" onClick={() => fillDemo("qa1")}>
<div className="flex items-center justify-between w-full mb-1">
<span className="font-label-sm text-label-sm px-2 py-0.5 rounded bg-tertiary-fixed text-on-tertiary-fixed font-semibold">
            QA Approver
          </span>
<span className="material-symbols-outlined text-[16px] text-outline group-hover:text-tertiary transition-colors">touch_app</span>
</div>
<span className="font-headline-sm text-headline-sm text-on-surface font-semibold">Elena Rostova</span>
<span className="font-label-sm text-label-sm text-tertiary font-medium">qa1 · Demo@1234</span>
<span className="font-caption text-caption text-on-surface-variant mt-1">Release Sign-off • Batch Deviation Review</span>
</button>
{/*  Role 4: System Admin  */}
<button className="flex flex-col text-left p-space-sm bg-surface-container-lowest hover:bg-surface-container rounded-lg shadow-sm transition-all text-on-surface group"  type="button">
<div className="flex items-center justify-between w-full mb-1">
<span className="font-label-sm text-label-sm px-2 py-0.5 rounded bg-surface-container-highest text-on-surface font-semibold">
            Master Admin
          </span>
<span className="material-symbols-outlined text-[16px] text-outline group-hover:text-on-surface transition-colors">touch_app</span>
</div>
<span className="font-headline-sm text-headline-sm text-on-surface font-semibold">David Chen</span>
<span className="font-label-sm text-label-sm text-outline font-medium">USR-ADM-001</span>
<span className="font-caption text-caption text-on-surface-variant mt-1">Config • Security • Electronic Audit Manager</span>
</button>
</div>
</div>
{/*  4. REGULATORY AUDIT & SECURITY NOTICE (FOOTER)  */}
<div className="mt-space-lg pt-space-md border-t border-outline-variant/30 flex flex-col gap-2">
<div className="flex items-start gap-2">
<span className="material-symbols-outlined text-[18px] text-outline flex-shrink-0 mt-0.5">policy</span>
<p className="font-caption text-caption text-on-surface-variant leading-relaxed">
<strong>Mandatory Regulatory Notice:</strong> Authorized pharmaceutical personnel only. All access, failed sign-in attempts, and subsequent interactions are immutably cataloged in the 21 CFR Part 11 compliant audit trail. Tampering with or misrepresenting electronic records carries civil and criminal liabilities under applicable drug laws.
      </p>
</div>
<div className="flex items-center justify-between text-outline font-label-sm text-label-sm pt-2">
<span>Build: PTS-v4.8.2-PROD-VAL</span>
<span>Terminal: WS-PK-02B</span>
</div>
</div>
{/*  UNLOCK DIALOG MODAL (Simulated)  */}
<div className="fixed inset-0 bg-inverse-surface/40 backdrop-blur-sm z-50 hidden flex items-center justify-center p-gutter" id="unlock-modal">
<div className="bg-surface-container-lowest rounded-xl max-w-md w-full p-space-lg shadow-2xl flex flex-col gap-space-md">
<div className="flex items-start justify-between">
<div className="flex items-center gap-2 text-primary">
<span className="material-symbols-outlined text-[24px]">verified_user</span>
<h3 className="font-headline-sm text-headline-sm text-on-surface font-semibold">Initiate Account Unlock</h3>
</div>
<button className="w-8 h-8 rounded flex items-center justify-center text-outline hover:text-on-surface"  type="button">
<span className="material-symbols-outlined text-[20px]">close</span>
</button>
</div>
<p className="font-body-sm text-body-sm text-on-surface-variant">
        To restore access for <span className="font-label-sm text-label-sm font-bold text-on-surface">USR-QA-3319</span>, submit a dual-control QA authorization ticket to the shift supervisor.
      </p>
<div className="p-space-sm bg-surface-container-low rounded-lg text-body-sm font-body-sm flex flex-col gap-1">
<span className="font-label-sm text-label-sm text-outline">QA Incident Ticket ID</span>
<span className="font-label-md text-label-md font-semibold text-primary">INC-20250226-8819-SEC</span>
</div>
<div className="flex items-center justify-end gap-space-sm mt-space-sm">
<button className="min-h-[44px] px-4 py-2 bg-surface-container rounded-lg text-body-md font-body-md text-on-surface hover:bg-surface-container-high transition-colors"  type="button">
          Cancel
        </button>
<button className="min-h-[44px] px-4 py-2 bg-primary rounded-lg text-body-md font-body-md text-on-primary hover:bg-primary-container shadow-sm transition-colors"  type="button">
          Transmit to QA Lead
        </button>
</div>
</div>
</div>
</div>
</main>
    </div>
  );
}
