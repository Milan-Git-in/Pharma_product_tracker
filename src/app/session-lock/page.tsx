"use client";

import React from "react";
import Link from "next/link";
import AppLayout from "@/components/layout/AppLayout";

export default function SessionLockPage() {
  return (
    <AppLayout screenCode="S03">
      <div className="flex flex-col w-full relative">
{/*  In-flight Dashboard Content (Simulated Live Biopharma Terminal in Background)  */}
<div aria-hidden="true" className="w-full space-y-space-md opacity-45 pointer-events-none select-none transition-all duration-300 filter blur-[1.5px]">
{/*  Top KPI & Operational Context Bar  */}
<div className="grid grid-cols-1 md:grid-cols-4 gap-gutter">
<div className="bg-surface-container-lowest p-space-md rounded-lg shadow-sm flex items-center justify-between">
<div>
<span className="font-caption text-caption text-on-surface-variant uppercase tracking-wider block">Target Line</span>
<span className="font-headline-sm text-headline-sm text-primary font-semibold">Packaging Line 02</span>
<span className="font-label-sm text-label-sm text-secondary block mt-0.5">Continuous Monitoring Active</span>
</div>
<div className="w-10 h-10 rounded-full bg-secondary-container flex items-center justify-center text-on-secondary-container">
<span className="material-symbols-outlined text-[22px]">precision_manufacturing</span>
</div>
</div>
<div className="bg-surface-container-lowest p-space-md rounded-lg shadow-sm flex items-center justify-between">
<div>
<span className="font-caption text-caption text-on-surface-variant uppercase tracking-wider block">Active Batch</span>
<span className="font-label-lg text-label-lg font-mono text-on-surface font-semibold">B260117</span>
<span className="font-body-sm text-body-sm text-on-surface-variant block truncate max-w-[150px]">Insulin Glargine 100 IU</span>
</div>
<div className="w-10 h-10 rounded-full bg-surface-container-high flex items-center justify-center text-primary">
<span className="material-symbols-outlined text-[22px]">medication</span>
</div>
</div>
<div className="bg-surface-container-lowest p-space-md rounded-lg shadow-sm flex items-center justify-between">
<div>
<span className="font-caption text-caption text-on-surface-variant uppercase tracking-wider block">Cumulative Hold Alert</span>
<span className="font-label-lg text-label-lg font-mono text-error font-semibold">0h 48m / 1h 00m</span>
<span className="font-caption text-caption text-error font-medium block">Stage Hold Limit: 80%</span>
</div>
<div className="w-10 h-10 rounded-full bg-error-container/60 flex items-center justify-center text-error">
<span className="material-symbols-outlined text-[22px]">timer</span>
</div>
</div>
<div className="bg-surface-container-lowest p-space-md rounded-lg shadow-sm flex items-center justify-between">
<div>
<span className="font-caption text-caption text-on-surface-variant uppercase tracking-wider block">Terminal Node</span>
<span className="font-label-lg text-label-lg font-mono text-on-surface">WS-PACK-04</span>
<span className="font-label-sm text-label-sm text-on-surface-variant">Cleanroom Class D</span>
</div>
<div className="w-10 h-10 rounded-full bg-surface-container-high flex items-center justify-center text-on-surface-variant">
<span className="material-symbols-outlined text-[22px]">desktop_windows</span>
</div>
</div>
</div>
{/*  Active Line 2 Batches Data Table  */}
<div className="bg-surface-container-lowest rounded-lg shadow-sm overflow-hidden">
<div className="p-space-md bg-surface-container-low flex items-center justify-between">
<div className="flex items-center gap-space-sm">
<span className="material-symbols-outlined text-primary text-[20px]">view_timeline</span>
<span className="font-headline-sm text-headline-sm text-on-surface font-semibold">Packing Line 2 • Active Lot Tracking Matrix</span>
<span className="font-label-sm text-label-sm px-2 py-0.5 rounded bg-surface-variant text-on-surface-variant font-mono">SOP-PKG-0822-v4</span>
</div>
<div className="flex items-center gap-2">
<span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-surface-container text-on-surface-variant font-label-sm text-label-sm font-mono">
<span className="w-1.5 h-1.5 rounded-full bg-secondary"></span>
            Sync: Nominal
          </span>
</div>
</div>
<div className="overflow-x-auto">
<table className="w-full text-left">
<thead>
<tr className="bg-surface-container-low/50 text-on-surface-variant font-caption text-caption uppercase tracking-wider">
<th className="py-3 px-4">Lot ID</th>
<th className="py-3 px-4">Batch Number</th>
<th className="py-3 px-4">Product Name / Strength</th>
<th className="py-3 px-4">Current Stage &amp; Station</th>
<th className="py-3 px-4">Hold Clock &amp; Status</th>
<th className="py-3 px-4">Pallet &amp; Cold Room</th>
</tr>
</thead>
<tbody className="divide-y divide-surface-container font-body-sm text-body-sm">
{/*  Row 1: Attention/Amber  */}
<tr className="bg-surface-container-lowest">
<td className="py-3.5 px-4 font-label-md text-label-md font-mono font-semibold text-primary">LT-26A017</td>
<td className="py-3.5 px-4 font-label-md text-label-md font-mono text-on-surface">B260117</td>
<td className="py-3.5 px-4 font-medium text-on-surface">
                Insulin Glargine 100 IU/mL
                <span className="block font-caption text-caption text-on-surface-variant">3 mL Cartridge • Pack Type A</span>
</td>
<td className="py-3.5 px-4">
<div className="flex items-center gap-1.5">
<span className="w-2 h-2 rounded-full bg-secondary animate-pulse"></span>
<span className="font-semibold text-on-surface">Visual Inspection</span>
</div>
<span className="font-caption text-caption text-on-surface-variant block">Automated Camera 02</span>
</td>
<td className="py-3.5 px-4">
<span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-surface-container-highest text-on-surface-variant font-label-sm text-label-sm font-mono font-semibold">
<span className="w-2 h-2 rounded-full bg-error"></span>
                  0h 48m (Max 1h)
                </span>
</td>
<td className="py-3.5 px-4 font-label-sm text-label-sm font-mono text-on-surface-variant">
                PL-26-000124 • CR-02
              </td>
</tr>
{/*  Row 2: Nominal  */}
<tr className="bg-surface-container-lowest">
<td className="py-3.5 px-4 font-label-md text-label-md font-mono font-semibold text-primary">LT-26A018</td>
<td className="py-3.5 px-4 font-label-md text-label-md font-mono text-on-surface">B260118</td>
<td className="py-3.5 px-4 font-medium text-on-surface">
                Adalimumab 40 mg/0.8 mL
                <span className="block font-caption text-caption text-on-surface-variant">Prefilled Syringe • Carton Tier 1</span>
</td>
<td className="py-3.5 px-4">
<div className="flex items-center gap-1.5">
<span className="w-2 h-2 rounded-full bg-secondary"></span>
<span>Cold Room Staging</span>
</div>
<span className="font-caption text-caption text-on-surface-variant block">Rack RK-CR01-001</span>
</td>
<td className="py-3.5 px-4">
<span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-secondary-container text-on-secondary-container font-label-sm text-label-sm font-mono font-semibold">
<span className="w-2 h-2 rounded-full bg-primary"></span>
                  0h 22m (OK)
                </span>
</td>
<td className="py-3.5 px-4 font-label-sm text-label-sm font-mono text-on-surface-variant">
                PL-26-000125 • CR-01
              </td>
</tr>
</tbody>
</table>
</div>
</div>
{/*  Secondary Line Health Graph Area  */}
<div className="grid grid-cols-1 lg:grid-cols-3 gap-gutter">
<div className="bg-surface-container-lowest p-space-md rounded-lg shadow-sm col-span-2">
<div className="flex items-center justify-between mb-3">
<span className="font-headline-sm text-headline-sm text-on-surface font-semibold">Cold Chain Temperature Integrity (CR-01 / CR-02)</span>
<span className="font-label-sm text-label-sm text-on-surface-variant font-mono">Range: +2.0°C to +8.0°C</span>
</div>
<div className="h-32 w-full bg-surface-container-low rounded flex items-center justify-center p-4">
<svg className="w-full h-full text-secondary" fill="none" preserveAspectRatio="none" viewBox="0 0 600 100">
<path d="M0 60 Q 50 55, 100 62 T 200 58 T 300 65 T 400 60 T 500 62 T 600 59" fill="none" stroke="currentColor" strokeWidth="2.5"></path>
<path d="M0 60 Q 50 55, 100 62 T 200 58 T 300 65 T 400 60 T 500 62 T 600 59 L 600 100 L 0 100 Z" fill="currentColor" fill-opacity="0.08"></path>
</svg>
</div>
</div>
<div className="bg-surface-container-lowest p-space-md rounded-lg shadow-sm flex flex-col justify-between">
<div>
<span className="font-headline-sm text-headline-sm text-on-surface font-semibold block mb-1">Station Equipment Check</span>
<span className="font-caption text-caption text-on-surface-variant">All thermal sensors calibrated through Q3-2025</span>
</div>
<div className="space-y-2 mt-4">
<div className="p-2 rounded bg-surface-container-low flex items-center justify-between">
<span className="font-body-sm text-body-sm text-on-surface">Vision Cam 02</span>
<span className="font-label-sm text-label-sm text-secondary font-mono">Online • 99.8%</span>
</div>
<div className="p-2 rounded bg-surface-container-low flex items-center justify-between">
<span className="font-body-sm text-body-sm text-on-surface">Cartoner Seal Unit</span>
<span className="font-label-sm text-label-sm text-secondary font-mono">Online • 212°C</span>
</div>
</div>
</div>
</div>
</div>
{/*  Focused GMP Session Lock Modal Overlay  */}
<div className="fixed inset-0 z-50 flex items-center justify-center p-gutter bg-inverse-surface/60 backdrop-blur-sm transition-opacity">
<div className="relative w-full max-w-lg bg-surface-container-lowest rounded-xl shadow-xl overflow-hidden flex flex-col my-auto">
{/*  Top Brand Accent Strip  */}
<div className="h-2 w-full bg-gradient-to-r from-primary via-primary-container to-secondary"></div>
{/*  Modal Body  */}
<div className="p-space-lg flex flex-col space-y-space-md">
{/*  Header & Lock Protocol State  */}
<div className="flex items-start gap-space-md">
<div className="relative flex-shrink-0">
<div className="w-14 h-14 rounded-xl bg-surface-container flex items-center justify-center text-primary shadow-sm">
<span className="material-symbols-outlined text-[32px]">lock</span>
</div>
<span className="absolute -top-1 -right-1 flex h-3.5 w-3.5">
<span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-error opacity-75"></span>
<span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-error"></span>
</span>
</div>
<div className="flex-1 min-w-0">
<div className="flex items-center gap-2">
<h2 className="font-headline-lg text-headline-lg font-semibold text-on-surface leading-tight">Session Locked</h2>
<span className="px-2 py-0.5 rounded bg-surface-container font-label-sm text-label-sm text-primary font-mono font-semibold">21 CFR §11.200</span>
</div>
<p className="font-body-sm text-body-sm text-on-surface-variant mt-1 leading-normal">
              Session suspended following 30 minutes of cleanroom terminal inactivity in accordance with GMP Standard Operating Procedure <span className="font-mono text-on-surface font-medium">SOP-SEC-014</span>.
            </p>
</div>
</div>
{/*  Authenticated User Lineage Card  */}
<div className="p-space-md rounded-lg bg-surface-container-low flex flex-col space-y-2">
<div className="flex items-center justify-between">
<div className="flex items-center gap-3">
<div className="w-10 h-10 rounded-full bg-primary-container text-on-primary font-headline-sm text-headline-sm font-semibold flex items-center justify-center shadow-sm">
                AS
              </div>
<div className="flex flex-col">
<span className="font-headline-sm text-headline-sm font-semibold text-on-surface leading-tight">Anita Shah</span>
<span className="font-caption text-caption text-on-surface-variant">Initiator • Biopharma Packing Division (Line 2)</span>
</div>
</div>
<span className="font-label-sm text-label-sm font-mono px-2 py-1 rounded bg-secondary-container text-on-secondary-container font-semibold">
              Sec-L2 Active
            </span>
</div>
<div className="pt-2 flex flex-wrap items-center gap-2 text-on-surface-variant font-caption text-caption">
<span className="inline-flex items-center gap-1 font-mono font-medium text-primary">
<span className="material-symbols-outlined text-[15px]">inventory_2</span>
              Batch: B260117
            </span>
<span>•</span>
<span className="truncate">Insulin Glargine 100 IU/mL</span>
<span>•</span>
<span className="font-mono">WS-PACK-04</span>
</div>
</div>
{/*  Auto-Logoff Countdown Urgent Banner  */}
<div className="p-3.5 rounded-lg bg-error-container/50 flex items-start gap-3">
<span className="material-symbols-outlined text-error text-[22px] flex-shrink-0 mt-0.5">timer_off</span>
<div className="flex-1">
<div className="flex items-center justify-between">
<span className="font-headline-sm text-body-md font-semibold text-on-error-container">Forced Terminal Logoff Imminent</span>
<span className="font-label-lg text-label-lg font-mono font-bold text-error bg-surface-container-lowest px-2 py-0.5 rounded shadow-sm" id="countdownTimer">04:32</span>
</div>
<p className="font-caption text-caption text-on-surface-variant mt-1">
              Unsaved local batch movements and draft scan verification inputs remain safeguarded, but the local workstation session will terminate to prevent unauthorized floor manipulation.
            </p>
</div>
</div>
{/*  Unlock Form  */}
<form className="space-y-space-md" id="sessionUnlockForm" >
<div className="space-y-1.5">
<div className="flex items-center justify-between">
<label className="font-caption text-caption font-semibold uppercase tracking-wider text-on-surface-variant flex items-center gap-1" htmlFor="unlockPassword">
<span className="material-symbols-outlined text-[16px] text-primary">key</span>
                Re-Authentication Password
              </label>
<a className="font-caption text-caption text-primary hover:underline font-medium min-h-[32px] inline-flex items-center" href="#">
                Forgot password?
              </a>
</div>
<div className="relative flex items-center">
<input autoComplete="current-password" className="w-full h-11 px-3.5 pr-12 rounded-lg bg-surface-container-lowest text-on-surface font-body-md text-body-md outline-none focus:ring-2 focus:ring-primary shadow-sm transition-all" id="unlockPassword" placeholder="Enter password to resume active session" required type="password"/>
<button aria-label="Toggle password visibility" className="absolute right-1 w-10 h-10 flex items-center justify-center text-on-surface-variant hover:text-on-surface min-h-[44px] min-w-[44px]"  type="button">
<span className="material-symbols-outlined text-[20px]" id="passwordEyeIcon">visibility</span>
</button>
</div>
<p className="hidden font-caption text-caption text-error font-medium mt-1" id="authErrorMsg">
              Authentication failed. Please verify credentials against the directory.
            </p>
</div>
{/*  Action Buttons with GMP 44px min Hit Area  */}
<div className="flex flex-col sm:flex-row items-center gap-space-sm pt-1">
<button className="w-full sm:flex-1 min-h-[44px] px-5 py-2.5 rounded-lg bg-primary-container text-on-primary font-headline-sm text-body-md font-semibold flex items-center justify-center gap-2 hover:bg-primary transition-colors shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-fixed" type="submit">
<span className="material-symbols-outlined text-[20px]">lock_open</span>
<span>Unlock Session</span>
</button>
<button className="w-full sm:w-auto min-h-[44px] px-4 py-2.5 rounded-lg bg-surface-container text-on-surface hover:bg-surface-container-high font-body-md text-body-md font-medium flex items-center justify-center gap-1.5 transition-colors focus:outline-none"  type="button">
<span className="material-symbols-outlined text-[18px] text-on-surface-variant">logout</span>
<span>Log Out Now</span>
</button>
</div>
</form>
{/*  Switch User Link  */}
<div className="flex items-center justify-center pt-1">
<button className="text-on-surface-variant hover:text-primary font-body-sm text-body-sm inline-flex items-center gap-1.5 min-h-[44px] px-3 rounded hover:bg-surface-container-low transition-colors"  type="button">
<span className="material-symbols-outlined text-[18px]">switch_account</span>
<span>Switch operator account on WS-PACK-04</span>
</button>
</div>
{/*  Regulatory Immutable Trail Footer Note  */}
<div className="pt-space-sm bg-surface-container-lowest flex items-center justify-between text-on-surface-variant font-caption text-caption">
<div className="flex items-center gap-1.5">
<span className="material-symbols-outlined text-[16px] text-secondary">fingerprint</span>
<span>Workstation ID: <strong className="font-mono text-on-surface">WS-PACK-04</strong></span>
</div>
<span className="font-mono text-on-surface-variant">Audit Ref #AL-892144</span>
</div>
</div>
</div>
</div>
</div>

    </AppLayout>
  );
}
