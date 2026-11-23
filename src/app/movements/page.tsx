"use client";

import React from "react";
import Link from "next/link";
import AppLayout from "@/components/layout/AppLayout";

export default function MovementDialogsPage() {
  return (
    <AppLayout screenCode="S09">
      <div className="flex flex-col w-full">
{/*  Top Context Navigation & Metadata Header  */}
<div className="w-full pb-6 pt-2">
{/*  Breadcrumb & System State Indicator  */}
<div className="flex flex-wrap items-center justify-between gap-4 mb-3">
<nav className="flex items-center gap-2 font-caption text-caption text-on-surface-variant">
<a className="hover:text-primary transition-colors flex items-center gap-1" href="#">
<span className="material-symbols-outlined text-[15px]">home</span>
<span>Home</span>
</a>
<span className="material-symbols-outlined text-[13px] text-outline-variant">chevron_right</span>
<a className="hover:text-primary transition-colors" href="#">Binders</a>
<span className="material-symbols-outlined text-[13px] text-outline-variant">chevron_right</span>
<span className="font-label-sm text-label-sm font-semibold text-primary bg-primary-fixed/40 px-2 py-0.5 rounded">LT-26A017</span>
<span className="material-symbols-outlined text-[13px] text-outline-variant">chevron_right</span>
<span className="font-medium text-on-surface">Movement Actions</span>
</nav>
<div className="flex items-center gap-2">
<div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-surface-container-high text-on-surface-variant font-label-sm text-label-sm">
<span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
<span>21 CFR §11.10 State: Enforcement Active</span>
</div>
<div className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-secondary-container/50 text-on-secondary-container font-label-sm text-label-sm">
<span className="material-symbols-outlined text-[15px]">verified</span>
<span>Hash Chaining: Live</span>
</div>
</div>
</div>
{/*  Title & Clinical Compliance Description  */}
<div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
<div>
<div className="flex items-center gap-2.5 mb-1">
<span className="px-2 py-0.5 rounded bg-primary-container text-on-primary-container font-label-sm text-label-sm font-bold uppercase tracking-wider">S09 Specification</span>
<h1 className="font-headline-lg text-headline-lg font-bold text-on-surface tracking-tight">Movement Dialogs (Modal Variants)</h1>
</div>
<p className="font-body-md text-body-md text-on-surface-variant max-w-4xl">
          GMP chain-of-custody transfer confirmation dialogs with mandatory 21 CFR Part 11 audit remarks and automatic server timestamping.
        </p>
</div>
<div className="flex items-center gap-2">
<button className="min-h-[44px] px-3.5 py-2 rounded-lg bg-surface-container-lowest hover:bg-surface-container-high text-on-surface font-body-sm text-body-sm font-semibold transition-colors flex items-center gap-2 shadow-sm" type="button">
<span className="material-symbols-outlined text-[18px] text-secondary">tune</span>
<span>View Matrix (SOP-GMP-044)</span>
</button>
</div>
</div>
</div>
{/*  Regulatory Audit Guidance Strip  */}
<div className="w-full mb-6 p-4 rounded-xl bg-surface-container-lowest shadow-sm flex flex-col lg:flex-row lg:items-center justify-between gap-4">
<div className="flex items-start gap-3.5">
<div className="w-9 h-9 rounded-lg bg-primary-container text-on-primary-container flex items-center justify-center shrink-0">
<span className="material-symbols-outlined text-[20px]">policy</span>
</div>
<div className="flex flex-col">
<div className="flex items-center gap-2">
<span className="font-headline-sm text-headline-sm text-primary font-semibold">21 CFR §11.10 Integrity &amp; Automated Server Locking Directive</span>
<span className="px-1.5 py-0.2 rounded bg-primary-fixed text-on-primary-fixed font-label-sm text-[10px] uppercase font-bold">Standard</span>
</div>
<p className="font-body-sm text-body-sm text-on-surface-variant mt-0.5">
          All biological custody modifications require justification remarks prior to signature enablement. Timestamps are acquired strictly via secure Network Time Protocol (NTP) at execution time and cannot be overwritten by station client clocks.
        </p>
</div>
</div>
{/*  Active Compliance Metrics Strip  */}
<div className="flex items-center gap-6 shrink-0 pt-2 lg:pt-0">
<div className="flex flex-col text-right">
<span className="font-caption text-caption text-on-surface-variant uppercase font-medium">NTP Reference</span>
<span className="font-label-md text-label-md text-on-surface font-mono font-semibold">UTC+00:00 (Atomic)</span>
</div>
<div className="flex flex-col text-right">
<span className="font-caption text-caption text-on-surface-variant uppercase font-medium">Validation Level</span>
<span className="font-label-md text-label-md text-secondary font-semibold">Level 3 Non-Repudiation</span>
</div>
</div>
</div>
{/*  3-Column Modal Showcase Grid  */}
<div className="w-full grid grid-cols-1 lg:grid-cols-3 gap-6 pb-12">
{/*  =========================================================================  */}
{/*  MODAL VARIANT 1: Load into Cold Room  */}
{/*  =========================================================================  */}
<div className="flex flex-col rounded-xl bg-surface-container-lowest shadow-md overflow-hidden transition-all duration-200 hover:shadow-lg">
{/*  Modal Header  */}
<div className="p-4 bg-surface-container-low flex items-center justify-between">
<div className="flex items-center gap-2.5">
<div className="w-8 h-8 rounded-lg bg-secondary-container text-on-secondary-container flex items-center justify-center">
<span className="material-symbols-outlined text-[19px]">ac_unit</span>
</div>
<div>
<h2 className="font-headline-sm text-headline-sm font-semibold text-on-surface leading-tight">Load into Cold Room</h2>
<span className="font-caption text-caption text-on-surface-variant">Variant 01 • Inbound Buffer to Chamber</span>
</div>
</div>
<span className="px-2 py-0.5 rounded-full bg-surface-container-highest text-on-surface-variant font-label-sm text-[10px] uppercase font-bold tracking-wider font-mono">MODAL-S09.1</span>
</div>
{/*  Target Product Banner  */}
<div className="p-4 bg-primary/5">
<div className="flex items-center justify-between mb-1.5">
<span className="font-body-md text-body-md font-semibold text-primary">Insulin Glargine 100 IU/mL</span>
<span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-surface-container-lowest font-label-sm text-label-sm font-mono text-secondary font-semibold shadow-sm">
<span className="w-1.5 h-1.5 rounded-full bg-secondary"></span>
            LT-26A017
          </span>
</div>
<div className="flex items-center gap-3 font-caption text-caption text-on-surface-variant">
<span>Batch: <strong className="font-mono text-on-surface">B260117</strong></span>
<span>•</span>
<span>Target Env: <strong className="text-on-surface">+2°C to +8°C</strong></span>
</div>
</div>
{/*  Modal Body Form  */}
<div className="p-5 flex-1 flex flex-col gap-4">
{/*  Cold Room Selector  */}
<div>
<label className="block font-caption text-caption uppercase tracking-wider text-on-surface-variant font-semibold mb-1">
            Target Cold Room <span className="text-error">*</span>
</label>
<div className="relative">
<select className="w-full min-h-[44px] pl-3 pr-9 py-2 rounded-lg bg-surface-container-low text-on-surface font-body-sm text-body-sm font-medium focus:bg-surface-container-lowest focus:outline-none focus:ring-2 focus:ring-primary appearance-none cursor-pointer">
<option >CR-01 (Primary Cold Room, +2°C to +8°C)</option>
<option>CR-02 (Secondary Bio-Holding, +2°C to +8°C)</option>
<option>CR-03 (Backup Quarantine Unit, +2°C to +8°C)</option>
</select>
<span className="material-symbols-outlined absolute right-3 top-3 pointer-events-none text-on-surface-variant text-[20px]">expand_more</span>
</div>
</div>
{/*  Rack Scan & Select  */}
<div>
<label className="block font-caption text-caption uppercase tracking-wider text-on-surface-variant font-semibold mb-1">
            Rack ID / Shelf Allocation <span className="text-error">*</span>
</label>
<div className="relative">
<select className="w-full min-h-[44px] pl-3 pr-9 py-2 rounded-lg bg-surface-container-low text-on-surface font-label-md text-label-md font-mono focus:bg-surface-container-lowest focus:outline-none focus:ring-2 focus:ring-primary appearance-none cursor-pointer">
<option >RK-CR01-001 (Shelf S-02)</option>
<option>RK-CR01-001 (Shelf S-03)</option>
<option>RK-CR01-002 (Shelf S-01)</option>
</select>
<span className="material-symbols-outlined absolute right-3 top-3 pointer-events-none text-on-surface-variant text-[20px]">shelves</span>
</div>
</div>
{/*  Pallet Scan Field with Verified Status  */}
<div>
<label className="block font-caption text-caption uppercase tracking-wider text-on-surface-variant font-semibold mb-1">
            Pallet Scan Verification <span className="text-error">*</span>
</label>
<div className="relative flex items-center">
<span className="material-symbols-outlined absolute left-3 text-secondary text-[20px]">qr_code_scanner</span>
<input className="w-full min-h-[44px] pl-10 pr-28 py-2 rounded-lg bg-surface-container-low text-on-surface font-label-md text-label-md font-mono font-medium focus:outline-none select-all" readOnly type="text" defaultValue="PL-26-000124"/>
<div className="absolute right-2 px-2 py-1 rounded bg-secondary-container text-on-secondary-container font-label-sm text-[11px] font-bold flex items-center gap-1">
<span className="material-symbols-outlined text-[14px]">check_circle</span>
<span>Scan Active: Verified ✓</span>
</div>
</div>
</div>
{/*  Stage Transition Flow Visualizer  */}
<div className="p-3 rounded-lg bg-surface-container-low flex items-center justify-between">
<div className="flex flex-col">
<span className="font-caption text-[10px] uppercase text-on-surface-variant font-bold">Stage Transition</span>
<div className="flex items-center gap-1.5 mt-0.5">
<span className="font-body-sm text-body-sm font-medium text-on-surface">Filling Buffer</span>
<span className="material-symbols-outlined text-secondary text-[16px]">arrow_forward</span>
<span className="font-body-sm text-body-sm font-semibold text-primary">Cold Room Storage</span>
</div>
</div>
<span className="material-symbols-outlined text-secondary text-[20px]">swap_horiz</span>
</div>
{/*  Automatic Server Timestamping Strip  */}
<div className="px-3 py-2 rounded-lg bg-surface-container flex items-center justify-between">
<div className="flex items-center gap-2">
<span className="material-symbols-outlined text-on-surface-variant text-[17px]">lock_clock</span>
<span className="font-caption text-caption text-on-surface-variant">Recorded automatically:</span>
</div>
<span className="font-label-sm text-label-sm font-mono font-semibold text-on-surface">22/11/2026 15:42 (UTC+00:00)</span>
</div>
{/*  Mandatory Remarks Textarea (Active & Valid)  */}
<div className="flex flex-col flex-1">
<div className="flex items-center justify-between mb-1">
<label className="font-caption text-caption uppercase tracking-wider text-on-surface font-semibold">
              Movement Remarks &amp; Verification (Mandatory for §11.10) <span className="text-error">*</span>
</label>
<span className="font-label-sm text-[11px] text-secondary font-mono font-bold">48 / 20 min</span>
</div>
<textarea className="w-full p-2.5 rounded-lg bg-surface-container-low text-on-surface font-body-sm text-body-sm focus:bg-surface-container-lowest focus:outline-none focus:ring-2 focus:ring-primary transition-all resize-none" placeholder="Enter reason for movement, pallet condition, and ambient transfer elapsed..." rows={3}>Batch verified intact. Transfer cart IC-04 sanitized and placed on Shelf S-02.</textarea>
<span className="font-caption text-[11px] text-secondary mt-1 flex items-center gap-1">
<span className="material-symbols-outlined text-[13px]">check</span>
<span>Character requirement met. 21 CFR signature token generated.</span>
</span>
</div>
</div>
{/*  Modal Footer Action Buttons  */}
<div className="p-4 bg-surface-container-low flex items-center justify-between gap-3">
<button className="min-h-[44px] px-4 py-2 rounded-lg bg-surface-container-highest hover:bg-surface-dim text-on-surface-variant font-body-sm text-body-sm font-medium transition-colors" type="button">
          Cancel
        </button>
<button className="min-h-[44px] flex-1 px-4 py-2 rounded-lg bg-primary-container hover:bg-primary text-on-primary font-body-sm text-body-sm font-semibold transition-all shadow flex items-center justify-center gap-2" type="button">
<span className="material-symbols-outlined text-[18px]">fingerprint</span>
<span>Confirm &amp; Sign Movement</span>
</button>
</div>
</div>
{/*  =========================================================================  */}
{/*  MODAL VARIANT 2: Unload / Withdraw from Cold Room  */}
{/*  =========================================================================  */}
<div className="flex flex-col rounded-xl bg-surface-container-lowest shadow-md overflow-hidden transition-all duration-200 hover:shadow-lg">
{/*  Modal Header  */}
<div className="p-4 bg-surface-container-low flex items-center justify-between">
<div className="flex items-center gap-2.5">
<div className="w-8 h-8 rounded-lg bg-primary-fixed text-on-primary-fixed flex items-center justify-center">
<span className="material-symbols-outlined text-[19px]">drive_file_move</span>
</div>
<div>
<h2 className="font-headline-sm text-headline-sm font-semibold text-on-surface leading-tight">Unload / Withdraw Product</h2>
<span className="font-caption text-caption text-on-surface-variant">Variant 02 • Cleanroom Line Pull</span>
</div>
</div>
<span className="px-2 py-0.5 rounded-full bg-surface-container-highest text-on-surface-variant font-label-sm text-[10px] uppercase font-bold tracking-wider font-mono">MODAL-S09.2</span>
</div>
{/*  Target Product Banner  */}
<div className="p-4 bg-secondary/5">
<div className="flex items-center justify-between mb-1.5">
<span className="font-body-md text-body-md font-semibold text-secondary">Filgrastim 300 mcg/0.5 mL</span>
<span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-surface-container-lowest font-label-sm text-label-sm font-mono text-secondary font-semibold shadow-sm">
<span className="w-1.5 h-1.5 rounded-full bg-secondary"></span>
            LT-26A014
          </span>
</div>
<div className="flex items-center gap-3 font-caption text-caption text-on-surface-variant">
<span>Batch: <strong className="font-mono text-on-surface">B260114</strong></span>
<span>•</span>
<span>Current Bay: <strong className="font-mono text-on-surface">CR-01 / RK-CR01-004</strong></span>
</div>
</div>
{/*  Modal Body Form  */}
<div className="p-5 flex-1 flex flex-col gap-4">
{/*  Current Location Indicator Strip  */}
<div className="p-3 rounded-lg bg-surface-container-low flex items-center justify-between">
<div className="flex items-center gap-2.5">
<span className="material-symbols-outlined text-secondary text-[20px]">pin_drop</span>
<div className="flex flex-col">
<span className="font-caption text-[10px] uppercase text-on-surface-variant font-bold">Source Origin Bay</span>
<span className="font-label-md text-label-md font-mono font-semibold text-on-surface">CR-01 / RK-CR01-004 (Shelf S-01)</span>
</div>
</div>
<span className="px-2 py-0.5 rounded bg-surface-container font-label-sm text-[10px] text-on-surface-variant uppercase font-semibold">Active</span>
</div>
{/*  "Move to" Stage Selector  */}
<div>
<label className="block font-caption text-caption uppercase tracking-wider text-on-surface-variant font-semibold mb-1">
            Select Destination Stage <span className="text-error">*</span>
</label>
<div className="relative">
<select className="w-full min-h-[44px] pl-3 pr-9 py-2 rounded-lg bg-surface-container-low text-on-surface font-body-sm text-body-sm font-medium focus:bg-surface-container-lowest focus:outline-none focus:ring-2 focus:ring-primary appearance-none cursor-pointer">
<option >Visual Inspection Buffer (Station 04)</option>
<option>Secondary Packaging Cleanroom Line 02</option>
<option>Quarantine / Deviation Hold Enclosure</option>
</select>
<span className="material-symbols-outlined absolute right-3 top-3 pointer-events-none text-on-surface-variant text-[20px]">expand_more</span>
</div>
</div>
{/*  Destination Target Buffer  */}
<div>
<label className="block font-caption text-caption uppercase tracking-wider text-on-surface-variant font-semibold mb-1">
            Designated Line Target Buffer
          </label>
<div className="relative flex items-center">
<span className="material-symbols-outlined absolute left-3 text-on-surface-variant text-[20px]">precision_manufacturing</span>
<input className="w-full min-h-[44px] pl-10 pr-4 py-2 rounded-lg bg-surface-container-low text-on-surface font-body-sm text-body-sm font-medium focus:outline-none" readOnly type="text" defaultValue="Line 04 Inspection Conveyor Buffer"/>
</div>
</div>
{/*  Critical Hold-Time Countdown Warning Banner  */}
<div className="p-3.5 rounded-lg bg-surface-container flex items-start gap-3">
<span className="material-symbols-outlined text-secondary text-[22px] shrink-0 mt-0.5">timer</span>
<div className="flex flex-col">
<span className="font-body-sm text-body-sm font-semibold text-secondary">Hold-Time Countdown Trigger</span>
<p className="font-caption text-caption text-on-surface-variant mt-0.5">
              Starting <strong className="font-mono text-on-surface">1h 00m</strong> ambient hold-time countdown clock upon confirmation. Maximum allowed cleanroom dwell limit: 2h 30m.
            </p>
</div>
</div>
{/*  Automatic Server Timestamping Strip  */}
<div className="px-3 py-2 rounded-lg bg-surface-container flex items-center justify-between">
<div className="flex items-center gap-2">
<span className="material-symbols-outlined text-on-surface-variant text-[17px]">lock_clock</span>
<span className="font-caption text-caption text-on-surface-variant">Recorded automatically:</span>
</div>
<span className="font-label-sm text-label-sm font-mono font-semibold text-on-surface">22/11/2026 15:42 (UTC+00:00)</span>
</div>
{/*  Mandatory Remarks Textarea (Active & Valid)  */}
<div className="flex flex-col flex-1">
<div className="flex items-center justify-between mb-1">
<label className="font-caption text-caption uppercase tracking-wider text-on-surface font-semibold">
              Movement Remarks &amp; Temperature Check <span className="text-error">*</span>
</label>
<span className="font-label-sm text-[11px] text-secondary font-mono font-bold">78 / 20 min</span>
</div>
<textarea className="w-full p-2.5 rounded-lg bg-surface-container-low text-on-surface font-body-sm text-body-sm focus:bg-surface-container-lowest focus:outline-none focus:ring-2 focus:ring-primary transition-all resize-none" placeholder="Enter remarks for withdrawal..." rows={3}>Withdrawn for scheduled 100% visual inspection. Temp verified 4.1°C at withdrawal.</textarea>
<span className="font-caption text-[11px] text-secondary mt-1 flex items-center gap-1">
<span className="material-symbols-outlined text-[13px]">verified_user</span>
<span>Critical temperature probe calibration verified (NIST-6894).</span>
</span>
</div>
</div>
{/*  Modal Footer Action Buttons  */}
<div className="p-4 bg-surface-container-low flex items-center justify-between gap-3">
<button className="min-h-[44px] px-4 py-2 rounded-lg bg-surface-container-highest hover:bg-surface-dim text-on-surface-variant font-body-sm text-body-sm font-medium transition-colors" type="button">
          Cancel
        </button>
<button className="min-h-[44px] flex-1 px-4 py-2 rounded-lg bg-primary-container hover:bg-primary text-on-primary font-body-sm text-body-sm font-semibold transition-all shadow flex items-center justify-center gap-2" type="button">
<span className="material-symbols-outlined text-[18px]">verified</span>
<span>Confirm &amp; Sign Withdrawal</span>
</button>
</div>
</div>
{/*  =========================================================================  */}
{/*  MODAL VARIANT 3: Transfer Location (Internal Re-allocation)  */}
{/*  =========================================================================  */}
<div className="flex flex-col rounded-xl bg-surface-container-lowest shadow-md overflow-hidden transition-all duration-200 hover:shadow-lg">
{/*  Modal Header  */}
<div className="p-4 bg-surface-container-low flex items-center justify-between">
<div className="flex items-center gap-2.5">
<div className="w-8 h-8 rounded-lg bg-tertiary-fixed text-on-tertiary-fixed flex items-center justify-center">
<span className="material-symbols-outlined text-[19px]">swap_horizontal_circle</span>
</div>
<div>
<h2 className="font-headline-sm text-headline-sm font-semibold text-on-surface leading-tight">Transfer Product Location</h2>
<span className="font-caption text-caption text-on-surface-variant">Variant 03 • Internal Re-allocation</span>
</div>
</div>
<span className="px-2 py-0.5 rounded-full bg-surface-container-highest text-on-surface-variant font-label-sm text-[10px] uppercase font-bold tracking-wider font-mono">MODAL-S09.3</span>
</div>
{/*  Target Product Banner  */}
<div className="p-4 bg-tertiary/5">
<div className="flex items-center justify-between mb-1.5">
<span className="font-body-md text-body-md font-semibold text-tertiary">Adalimumab 40 mg/0.8 mL</span>
<span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-surface-container-lowest font-label-sm text-label-sm font-mono text-tertiary font-semibold shadow-sm">
<span className="w-1.5 h-1.5 rounded-full bg-tertiary"></span>
            LT-26A018
          </span>
</div>
<div className="flex items-center gap-3 font-caption text-caption text-on-surface-variant">
<span>Batch: <strong className="font-mono text-on-surface">B260118</strong></span>
<span>•</span>
<span>Carton Units: <strong className="font-mono text-on-surface">480 Vials</strong></span>
</div>
</div>
{/*  Modal Body Form  */}
<div className="p-5 flex-1 flex flex-col gap-4">
{/*  From -> To Transfer Mapping Architecture  */}
<div className="flex flex-col gap-2.5">
<span className="font-caption text-caption uppercase tracking-wider text-on-surface-variant font-semibold">Bay &amp; Rack Mapping</span>
<div className="p-3 rounded-lg bg-surface-container-low flex flex-col gap-2">
{/*  FROM  */}
<div className="flex items-start gap-2.5">
<span className="px-1.5 py-0.5 rounded bg-surface-container font-label-sm text-[10px] uppercase font-bold text-on-surface-variant shrink-0 mt-0.5">FROM</span>
<div className="flex flex-col min-w-0">
<span className="font-label-md text-label-md font-mono font-semibold text-on-surface truncate">Cold Room CR-01</span>
<span className="font-caption text-caption text-on-surface-variant font-mono">Shelf S-01, Pallet PL-26-000118</span>
</div>
</div>
{/*  Directional indicator  */}
<div className="flex items-center justify-center my-0.5">
<div className="w-6 h-6 rounded-full bg-surface-container-high text-primary flex items-center justify-center shadow-xs">
<span className="material-symbols-outlined text-[16px]">arrow_downward</span>
</div>
</div>
{/*  TO  */}
<div className="flex items-start gap-2.5">
<span className="px-1.5 py-0.5 rounded bg-secondary-container font-label-sm text-[10px] uppercase font-bold text-on-secondary-container shrink-0 mt-0.5">TO</span>
<div className="flex flex-col min-w-0">
<span className="font-label-md text-label-md font-mono font-semibold text-primary truncate">Cold Room CR-02</span>
<span className="font-caption text-caption text-on-surface-variant font-mono">Shelf S-03, Rack RK-CR02-008</span>
</div>
</div>
</div>
</div>
{/*  Reason Category Selector  */}
<div>
<label className="block font-caption text-caption uppercase tracking-wider text-on-surface-variant font-semibold mb-1">
            Reason for Transfer Category <span className="text-error">*</span>
</label>
<div className="relative">
<select className="w-full min-h-[44px] pl-3 pr-9 py-2 rounded-lg bg-surface-container-low text-on-surface font-body-sm text-body-sm font-medium focus:bg-surface-container-lowest focus:outline-none focus:ring-2 focus:ring-primary appearance-none cursor-pointer">
<option >Chamber Maintenance / Space Optimization</option>
<option>Temperature Profiling Redistribution</option>
<option>Line Reconciliation Preparation</option>
<option>Secondary Segregation (Non-conformity)</option>
</select>
<span className="material-symbols-outlined absolute right-3 top-3 pointer-events-none text-on-surface-variant text-[20px]">expand_more</span>
</div>
</div>
{/*  Automatic Server Timestamping Strip  */}
<div className="px-3 py-2 rounded-lg bg-surface-container flex items-center justify-between">
<div className="flex items-center gap-2">
<span className="material-symbols-outlined text-on-surface-variant text-[17px]">lock_clock</span>
<span className="font-caption text-caption text-on-surface-variant">Recorded automatically:</span>
</div>
<span className="font-label-sm text-label-sm font-mono font-semibold text-on-surface">22/11/2026 15:42 (UTC+00:00)</span>
</div>
{/*  Mandatory Remarks Textarea (DISABLED DEMO STATE)  */}
<div className="flex flex-col flex-1">
<div className="flex items-center justify-between mb-1">
<label className="font-caption text-caption uppercase tracking-wider text-on-surface font-semibold flex items-center gap-1">
              Movement Remarks (Mandatory) <span className="text-error">*</span>
</label>
<span className="font-label-sm text-[11px] text-error font-mono font-semibold">0 / 10 min</span>
</div>
{/*  Empty Textarea displaying unfulfilled validation state  */}
<div className="relative">
<textarea className="w-full p-2.5 rounded-lg bg-surface-container-low text-on-surface font-body-sm text-body-sm focus:bg-surface-container-lowest focus:outline-none focus:ring-2 focus:ring-error transition-all resize-none placeholder:text-on-surface-variant/60" id="transfer-remarks-input" placeholder="Mandatory justification required to enable confirmation..." rows={3}></textarea>
</div>
{/*  Non-compliant Helper Feedback Message  */}
<div className="mt-2 p-2 rounded bg-error-container/40 flex items-center gap-2">
<span className="material-symbols-outlined text-error text-[17px] shrink-0">error</span>
<span className="font-caption text-[11px] text-on-error-container font-medium">
              Confirm button is disabled until remarks are entered (minimum 10 characters).
            </span>
</div>
</div>
</div>
{/*  Modal Footer Action Buttons (Disabled State Showcase)  */}
<div className="p-4 bg-surface-container-low flex items-center justify-between gap-3">
<button className="min-h-[44px] px-4 py-2 rounded-lg bg-surface-container-highest hover:bg-surface-dim text-on-surface-variant font-body-sm text-body-sm font-medium transition-colors" type="button">
          Cancel
        </button>
{/*  Clearly Disabled Button with Lock Icon and Tooltip Affordance  */}
<button className="min-h-[44px] flex-1 px-4 py-2 rounded-lg bg-surface-container-high text-on-surface-variant/50 font-body-sm text-body-sm font-semibold cursor-not-allowed flex items-center justify-center gap-2 shadow-none select-none transition-colors" disabled id="transfer-confirm-btn" title="Remarks required to sign" type="button">
<span className="material-symbols-outlined text-[18px]">lock</span>
<span>Confirm Transfer</span>
</button>
</div>
</div>
</div>
{/*  Interactive Comparison & Operational Matrix Table  */}
<div className="w-full mb-8 rounded-xl bg-surface-container-lowest p-6 shadow-sm">
<div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4 pb-4">
<div>
<h3 className="font-headline-sm text-headline-sm font-bold text-on-surface">Modal Operational Matrix &amp; Trigger Conditions</h3>
<p className="font-body-sm text-body-sm text-on-surface-variant mt-0.5">Summary of physical state transitions, environmental limits, and authorization requisites.</p>
</div>
<div className="flex items-center gap-2">
<span className="px-2.5 py-1 rounded bg-surface-container font-label-sm text-label-sm font-mono text-on-surface-variant">Spec: CFR-21-SEC-09</span>
</div>
</div>
{/*  Data Table Showcase  */}
<div className="w-full overflow-x-auto">
<table className="w-full text-left font-body-sm text-body-sm">
<thead>
<tr className="bg-surface-container-low font-caption text-caption uppercase text-on-surface-variant font-semibold">
<th className="py-3 px-4">Action Variant</th>
<th className="py-3 px-4">Physical Destination</th>
<th className="py-3 px-4">Environmental Constraint</th>
<th className="py-3 px-4">Hold-Time Impact</th>
<th className="py-3 px-4">Barcode Scan Req.</th>
<th className="py-3 px-4">Min. Remarks</th>
<th className="py-3 px-4 text-right">Electronic Sig. Level</th>
</tr>
</thead>
<tbody className="divide-y divide-surface-container">
<tr className="hover:bg-surface-container-low transition-colors">
<td className="py-3 px-4 font-medium text-primary flex items-center gap-2">
<span className="material-symbols-outlined text-[16px] text-secondary">ac_unit</span>
              Load into Cold Room
            </td>
<td className="py-3 px-4 font-mono font-medium">CR-01 / CR-02 (Cold Room Bay)</td>
<td className="py-3 px-4">
<span className="inline-flex items-center px-2 py-0.5 rounded bg-secondary-container/50 text-on-secondary-container font-label-sm text-[11px] font-mono">
                +2.0°C to +8.0°C
              </span>
</td>
<td className="py-3 px-4 text-on-surface-variant">Stops ambient exposure clock</td>
<td className="py-3 px-4 font-mono">PL-26-XXXXXX (Mandatory)</td>
<td className="py-3 px-4 font-mono">20 characters</td>
<td className="py-3 px-4 text-right">
<span className="px-2 py-0.5 rounded bg-surface-container font-label-sm text-label-sm font-semibold text-secondary">Level 2 (Dual Token)</span>
</td>
</tr>
<tr className="hover:bg-surface-container-low transition-colors">
<td className="py-3 px-4 font-medium text-primary flex items-center gap-2">
<span className="material-symbols-outlined text-[16px] text-secondary">drive_file_move</span>
              Unload / Withdraw
            </td>
<td className="py-3 px-4 font-mono font-medium">Visual Inspection Buffer (Station 04)</td>
<td className="py-3 px-4">
<span className="inline-flex items-center px-2 py-0.5 rounded bg-primary-fixed/40 text-primary font-label-sm text-[11px] font-mono">
                Cleanroom ISO 7
              </span>
</td>
<td className="py-3 px-4">
<span className="font-semibold text-error flex items-center gap-1 font-mono text-[12px]">
<span className="w-1.5 h-1.5 rounded-full bg-error animate-ping"></span>
                Starts 1h 00m Countdown
              </span>
</td>
<td className="py-3 px-4 font-mono">Station Slot Barcode</td>
<td className="py-3 px-4 font-mono">20 characters</td>
<td className="py-3 px-4 text-right">
<span className="px-2 py-0.5 rounded bg-surface-container font-label-sm text-label-sm font-semibold text-secondary">Level 2 (Lead Sign)</span>
</td>
</tr>
<tr className="hover:bg-surface-container-low transition-colors">
<td className="py-3 px-4 font-medium text-primary flex items-center gap-2">
<span className="material-symbols-outlined text-[16px] text-secondary">swap_horizontal_circle</span>
              Transfer Location
            </td>
<td className="py-3 px-4 font-mono font-medium">Cold Room CR-02 (Shelf S-03)</td>
<td className="py-3 px-4">
<span className="inline-flex items-center px-2 py-0.5 rounded bg-secondary-container/50 text-on-secondary-container font-label-sm text-[11px] font-mono">
                +2.0°C to +8.0°C
              </span>
</td>
<td className="py-3 px-4 text-on-surface-variant">Neutral (&lt;10m transfer cart)</td>
<td className="py-3 px-4 font-mono">Target Rack QR</td>
<td className="py-3 px-4 font-mono">10 characters</td>
<td className="py-3 px-4 text-right">
<span className="px-2 py-0.5 rounded bg-surface-container font-label-sm text-label-sm font-semibold text-secondary">Level 1 (Single Sign)</span>
</td>
</tr>
</tbody>
</table>
</div>
</div>
{/*  Client-side Interactive Behavior for Variant 3 Demo Validation  */}

</div>
    </AppLayout>
  );
}
