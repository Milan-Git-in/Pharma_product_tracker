"use client";

import React from "react";
import Link from "next/link";
import AppLayout from "@/components/layout/AppLayout";

export default function ChangePasswordPage() {
  return (
    <AppLayout screenCode="S02">
      <div className="flex flex-col w-full pb-margin-lg">
{/*  Top Breadcrumb & Metadata Track  */}
<div className="flex flex-col md:flex-row md:items-center justify-between gap-space-sm py-space-md mb-space-sm">
<div className="flex flex-col gap-1">
<div className="flex items-center gap-2 text-on-surface-variant">
<span className="font-caption text-caption uppercase tracking-wider">System Administration</span>
<span className="text-outline-variant font-label-sm text-caption">/</span>
<span className="font-caption text-caption uppercase tracking-wider">Security &amp; Credentials</span>
<span className="text-outline-variant font-label-sm text-caption">/</span>
<span className="font-caption text-caption uppercase tracking-wider text-secondary font-semibold">Change Password</span>
</div>
<div className="flex flex-wrap items-center gap-space-sm mt-1">
<h1 className="font-headline-lg text-headline-lg font-semibold text-primary tracking-tight">S02 Change Password</h1>
<span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-secondary-container/60 text-on-secondary-container font-label-sm text-label-sm font-mono font-medium">
<span className="w-1.5 h-1.5 rounded-full bg-secondary"></span>
          Policy: SOP-IT-019 (60-Day Expiry)
        </span>
</div>
<p className="font-body-md text-body-md text-on-surface-variant max-w-3xl">
        Update secure analytical credentials required for FDA 21 CFR Part 11 compliant electronic signatures and sterile line release validation.
      </p>
</div>
{/*  Active Audit Context Badge  */}
<div className="flex items-center gap-3 p-3 rounded-lg bg-surface-container-low self-start md:self-auto">
<div className="w-9 h-9 rounded bg-surface-container-lowest flex items-center justify-center text-secondary shadow-sm">
<span className="material-symbols-outlined text-[20px]">fingerprint</span>
</div>
<div className="flex flex-col">
<span className="font-caption text-[10px] text-on-surface-variant uppercase tracking-wider">Target Identity</span>
<span className="font-label-md text-label-md text-on-surface font-semibold font-mono">ASH049 • Anita Shah</span>
</div>
</div>
</div>
{/*  Main Content Grid: Workspace + Side Guidance Panel  */}
<div className="grid grid-cols-1 lg:grid-cols-12 gap-space-lg items-start">
{/*  Primary Form Column (8 Cols)  */}
<div className="lg:col-span-8 flex flex-col gap-space-md">
{/*  Regulatory Warning Callout  */}
<div className="p-space-md rounded-lg bg-surface-container-low flex items-start gap-space-md">
<div className="w-8 h-8 rounded bg-secondary-container text-on-secondary-container flex items-center justify-center shrink-0 mt-0.5">
<span className="material-symbols-outlined text-[20px]">schedule</span>
</div>
<div className="flex flex-col gap-0.5">
<div className="flex items-center gap-2">
<span className="font-headline-sm text-headline-sm text-on-surface font-semibold">Mandatory Expiration Cycle</span>
<span className="px-2 py-0.5 rounded bg-error-container text-on-error-container font-label-sm text-[11px] font-mono font-semibold">STATUS: EXPIRED</span>
</div>
<p className="font-body-sm text-body-sm text-on-surface-variant leading-relaxed">
            Biopharma packaging and batch clearance accounts require mandatory 60-day rotation. Your authentication token reached end-of-cycle today (<span className="font-label-sm text-on-surface font-mono">26/02/2025</span>). Last modified: <span className="font-label-sm text-on-surface font-mono">28/12/2024 09:14 UTC</span>.
          </p>
</div>
</div>
{/*  Credential Form Container  */}
<div className="rounded-lg bg-surface-container-lowest p-space-lg shadow-sm">
<form className="flex flex-col gap-space-md" id="password-form" >
{/*  Current Password  */}
<div className="flex flex-col gap-1.5">
<div className="flex items-center justify-between">
<label className="font-label-md text-label-md text-on-surface font-semibold flex items-center gap-1.5" htmlFor="curr-pwd">
                Current Password <span className="text-error">*</span>
</label>
<span className="font-caption text-caption text-on-surface-variant">Temporary or expiring credential</span>
</div>
<div className="relative flex items-center">
<input autoComplete="current-password" className="w-full h-11 pl-3.5 pr-11 bg-surface-container-low rounded-lg text-on-surface font-mono font-label-md text-label-md focus:bg-surface-container-lowest focus:outline-none focus:ring-2 focus:ring-primary transition-all" id="curr-pwd" placeholder="Enter current password" required type="password"/>
<button aria-label="Toggle Current Password Visibility" className="absolute right-0 top-0 bottom-0 px-3.5 flex items-center justify-center text-on-surface-variant hover:text-on-surface min-h-[44px] min-w-[44px]"  type="button">
<span className="material-symbols-outlined text-[20px]">visibility</span>
</button>
</div>
</div>
<div className="h-px bg-surface-container-high my-1"></div>
{/*  New Password  */}
<div className="flex flex-col gap-1.5">
<div className="flex items-center justify-between">
<label className="font-label-md text-label-md text-on-surface font-semibold flex items-center gap-1.5" htmlFor="new-pwd">
                New Compliance Password <span className="text-error">*</span>
</label>
<span className="font-caption text-caption text-on-surface-variant">FIPS-140 &amp; GMP Standard</span>
</div>
<div className="relative flex items-center">
<input autoComplete="new-password" className="w-full h-11 pl-3.5 pr-11 bg-surface-container-low rounded-lg text-on-surface font-mono font-label-md text-label-md focus:bg-surface-container-lowest focus:outline-none focus:ring-2 focus:ring-primary transition-all" id="new-pwd"  placeholder="Enter robust new passphrase" required type="password"/>
<button aria-label="Toggle New Password Visibility" className="absolute right-0 top-0 bottom-0 px-3.5 flex items-center justify-center text-on-surface-variant hover:text-on-surface min-h-[44px] min-w-[44px]"  type="button">
<span className="material-symbols-outlined text-[20px]">visibility</span>
</button>
</div>
{/*  Dynamic Strength Meter  */}
<div className="mt-2.5 p-3 rounded-lg bg-surface-container-low flex flex-col gap-2">
<div className="flex items-center justify-between">
<span className="font-caption text-[11px] uppercase tracking-wider text-on-surface-variant font-semibold">Entropy Analysis</span>
<span className="font-label-sm text-label-sm font-semibold text-secondary font-mono" id="strength-label">Strong (85%)</span>
</div>
<div className="grid grid-cols-4 gap-1.5 h-1.5 w-full">
<div className="h-full rounded-full bg-secondary transition-colors duration-300" id="meter-1"></div>
<div className="h-full rounded-full bg-secondary transition-colors duration-300" id="meter-2"></div>
<div className="h-full rounded-full bg-secondary transition-colors duration-300" id="meter-3"></div>
<div className="h-full rounded-full bg-surface-container-high transition-colors duration-300" id="meter-4"></div>
</div>
</div>
</div>
{/*  Dynamic Verification Checklist  */}
<div className="rounded-lg bg-surface-container-low/80 p-3.5 flex flex-col gap-2">
<span className="font-caption text-[10px] uppercase font-bold text-on-surface-variant tracking-wider">Validation Parameter Validation (SOP-IT-019 Annex 2)</span>
<div className="grid grid-cols-1 md:grid-cols-2 gap-2 pt-1">
{/*  Rule 1  */}
<div className="flex items-center gap-2 text-on-surface" id="rule-len">
<span className="material-symbols-outlined text-[18px] text-secondary">check_circle</span>
<span className="font-body-sm text-body-sm">Minimum 8 characters <span className="font-label-sm text-[11px] text-on-surface-variant font-mono">(12 recommended)</span></span>
</div>
{/*  Rule 2  */}
<div className="flex items-center gap-2 text-on-surface" id="rule-upper">
<span className="material-symbols-outlined text-[18px] text-secondary">check_circle</span>
<span className="font-body-sm text-body-sm">Uppercase alphabet <span className="font-label-sm text-[11px] text-on-surface-variant font-mono">(A-Z)</span></span>
</div>
{/*  Rule 3  */}
<div className="flex items-center gap-2 text-on-surface" id="rule-num">
<span className="material-symbols-outlined text-[18px] text-secondary">check_circle</span>
<span className="font-body-sm text-body-sm">Numeric numeral <span className="font-label-sm text-[11px] text-on-surface-variant font-mono">(0-9)</span></span>
</div>
{/*  Rule 4  */}
<div className="flex items-center gap-2 text-on-surface" id="rule-special">
<span className="material-symbols-outlined text-[18px] text-secondary">check_circle</span>
<span className="font-body-sm text-body-sm">Special symbol <span className="font-label-sm text-[11px] text-on-surface-variant font-mono">(!@#$%^&amp;*)</span></span>
</div>
{/*  Rule 5  */}
<div className="md:col-span-2 flex items-center gap-2 text-on-surface" id="rule-history">
<span className="material-symbols-outlined text-[18px] text-secondary">check_circle</span>
<span className="font-body-sm text-body-sm">Historical segregation: Not identical to prior 3 passwords</span>
</div>
</div>
</div>
{/*  Confirm New Password  */}
<div className="flex flex-col gap-1.5">
<div className="flex items-center justify-between">
<label className="font-label-md text-label-md text-on-surface font-semibold flex items-center gap-1.5" htmlFor="confirm-pwd">
                Confirm New Password <span className="text-error">*</span>
</label>
<span className="inline-flex items-center gap-1 font-label-sm text-label-sm text-secondary font-mono" id="match-status">
<span className="material-symbols-outlined text-[14px]">done_all</span> Passwords match
              </span>
</div>
<div className="relative flex items-center">
<input autoComplete="new-password" className="w-full h-11 pl-3.5 pr-11 bg-surface-container-low rounded-lg text-on-surface font-mono font-label-md text-label-md focus:bg-surface-container-lowest focus:outline-none focus:ring-2 focus:ring-primary transition-all" id="confirm-pwd"  placeholder="Re-enter new compliance password" required type="password"/>
<button aria-label="Toggle Confirm Password Visibility" className="absolute right-0 top-0 bottom-0 px-3.5 flex items-center justify-center text-on-surface-variant hover:text-on-surface min-h-[44px] min-w-[44px]"  type="button">
<span className="material-symbols-outlined text-[20px]">visibility</span>
</button>
</div>
</div>
{/*  Electronic Signatures Declaration Box  */}
<div className="p-3.5 rounded-lg bg-surface-container flex items-start gap-3 mt-1">
<span className="material-symbols-outlined text-secondary text-[22px] shrink-0 mt-0.5">verified_user</span>
<div className="flex flex-col text-on-surface-variant font-body-sm text-body-sm">
<span className="font-semibold text-on-surface">21 CFR §11.200 Legal Declaration</span>
              Submitting this change binds your user identity (<span className="font-mono text-on-surface">ASH049</span>) to all subsequent batch entries, reconciliation approvals, and deviation logs executed under these credentials.
            </div>
</div>
{/*  Operational Hit-Target Actions  */}
<div className="flex flex-col sm:flex-row items-center justify-between gap-space-sm pt-space-sm">
<button className="w-full sm:w-auto px-5 min-h-[44px] rounded-lg bg-surface-container hover:bg-surface-container-high text-on-surface font-label-lg text-label-lg font-semibold flex items-center justify-center gap-2 transition-colors"  type="button">
<span className="material-symbols-outlined text-[18px]">logout</span>
              Cancel / Return
            </button>
<button className="w-full sm:w-auto px-6 min-h-[44px] rounded-lg bg-primary-container hover:bg-primary text-on-primary font-label-lg text-label-lg font-semibold shadow-sm flex items-center justify-center gap-2 transition-colors" type="submit">
<span className="material-symbols-outlined text-[18px]">lock_reset</span>
              Update Password &amp; Continue to PTS
            </button>
</div>
</form>
</div>
</div>
{/*  Side Regulatory Reference & Diagnostic Panel (4 Cols)  */}
<div className="lg:col-span-4 flex flex-col gap-space-md">
{/*  Visual Status Widget  */}
<div className="rounded-lg bg-surface-container-lowest p-space-md shadow-sm flex flex-col gap-space-sm">
<div className="flex items-center justify-between">
<span className="font-caption text-[10px] uppercase font-bold text-on-surface-variant tracking-wider">Account Credentials Matrix</span>
<span className="px-2 py-0.5 rounded bg-surface-container text-on-surface font-label-sm text-[11px] font-mono">SECL-2-OPS</span>
</div>
<div className="flex items-center gap-3 py-1">
<div className="w-12 h-12 rounded-lg bg-secondary-container/40 text-secondary flex items-center justify-center shrink-0">
<span className="material-symbols-outlined text-[28px]">shield_person</span>
</div>
<div className="flex flex-col min-w-0">
<span className="font-headline-sm text-headline-sm text-on-surface truncate">Anita Shah</span>
<span className="font-body-sm text-body-sm text-on-surface-variant font-mono truncate">Role: Packaging Initiator</span>
</div>
</div>
<div className="p-3 rounded-lg bg-surface-container-low flex flex-col gap-2">
<div className="flex items-center justify-between text-body-sm font-body-sm">
<span className="text-on-surface-variant">Cleanroom Line:</span>
<span className="font-semibold text-on-surface font-mono">Line 04 (Vial Sterile)</span>
</div>
<div className="flex items-center justify-between text-body-sm font-body-sm">
<span className="text-on-surface-variant">Lockout Threshold:</span>
<span className="font-semibold text-error font-mono">5 Failed Attempts</span>
</div>
<div className="flex items-center justify-between text-body-sm font-body-sm">
<span className="text-on-surface-variant">2-Factor Escrow:</span>
<span className="font-semibold text-secondary font-mono">FIDO2 Physical Key</span>
</div>
</div>
</div>
{/*  Regulatory Mandate Card  */}
<div className="rounded-lg bg-surface-container-lowest p-space-md shadow-sm flex flex-col gap-space-sm">
<div className="flex items-center gap-2 text-primary">
<span className="material-symbols-outlined text-[20px]">gavel</span>
<h3 className="font-headline-sm text-headline-sm font-semibold">GMP Regulatory Security Standards</h3>
</div>
<p className="font-body-sm text-body-sm text-on-surface-variant leading-relaxed">
          Biopharmaceutical systems adhere strictly to predicate rules governing electronic identity accountability:
        </p>
<div className="space-y-3 pt-1">
<div className="flex items-start gap-2.5">
<div className="w-5 h-5 rounded bg-surface-container text-secondary flex items-center justify-center shrink-0 mt-0.5">
<span className="font-label-sm text-[10px] font-mono font-bold">11A</span>
</div>
<div className="flex flex-col">
<span className="font-label-md text-label-md font-semibold text-on-surface">21 CFR §11.200 Controls</span>
<span className="font-body-sm text-[12px] text-on-surface-variant">Requires unique passwords per individual. Re-use of expired passwords across differing active operators is permanently blocked.</span>
</div>
</div>
<div className="flex items-start gap-2.5">
<div className="w-5 h-5 rounded bg-surface-container text-secondary flex items-center justify-center shrink-0 mt-0.5">
<span className="font-label-sm text-[10px] font-mono font-bold">11B</span>
</div>
<div className="flex flex-col">
<span className="font-label-md text-label-md font-semibold text-on-surface">Dual-Factor for Lot Clearance</span>
<span className="font-body-sm text-[12px] text-on-surface-variant">Electronic sign-off requires initial full alphanumeric authentication followed by per-step PIN token verification.</span>
</div>
</div>
<div className="flex items-start gap-2.5">
<div className="w-5 h-5 rounded bg-surface-container text-secondary flex items-center justify-center shrink-0 mt-0.5">
<span className="font-label-sm text-[10px] font-mono font-bold">11C</span>
</div>
<div className="flex flex-col">
<span className="font-label-md text-label-md font-semibold text-on-surface">Audit Trail Logging</span>
<span className="font-body-sm text-[12px] text-on-surface-variant">All modifications, attempts, and successful updates are committed with cryptographic time-stamps to immutable audit store.</span>
</div>
</div>
</div>
</div>
{/*  Support / Validation Desk Information  */}
<div className="rounded-lg bg-surface-container-low p-space-md flex flex-col gap-2">
<div className="flex items-center gap-2 text-on-surface">
<span className="material-symbols-outlined text-[18px] text-secondary">contact_support</span>
<span className="font-headline-sm text-body-md font-semibold">IT Computer Systems Validation (CSV)</span>
</div>
<p className="font-body-sm text-body-sm text-on-surface-variant">
          If locked out or requiring token re-seed for cleanroom tablet integration, contact the biopharma operations desk:
        </p>
<div className="flex flex-col gap-1 pt-1 font-mono font-label-sm text-label-sm text-primary">
<div className="flex items-center justify-between">
<span className="text-on-surface-variant">Internal Ext:</span>
<span className="font-bold">x4410 (CSV Desk)</span>
</div>
<div className="flex items-center justify-between">
<span className="text-on-surface-variant">Emergency Line:</span>
<span className="font-bold">Bldg-C Cleanroom Desk 02</span>
</div>
</div>
</div>
</div>
</div>
{/*  Interactive Feedback Notification Modal / Toast placeholder  */}
<div className="hidden fixed bottom-6 right-6 max-w-md p-4 rounded-xl bg-surface-container-lowest shadow-xl z-50 flex items-start gap-3" id="success-banner">
<div className="w-8 h-8 rounded-full bg-secondary-container text-on-secondary-container flex items-center justify-center shrink-0">
<span className="material-symbols-outlined text-[20px]">check</span>
</div>
<div className="flex flex-col">
<span className="font-headline-sm text-headline-sm font-semibold text-on-surface">Credentials Updated</span>
<span className="font-body-sm text-body-sm text-on-surface-variant">Your PTS access credential was cryptographically re-keyed. Redirecting to production console...</span>
</div>
</div>
</div>

    </AppLayout>
  );
}
