"use client";

import React from "react";
import Link from "next/link";
import AppLayout from "@/components/layout/AppLayout";

export default function ReportsHubPage() {
  return (
    <AppLayout screenCode="S12">
      <div className="flex flex-col w-full">
{/*  Page Header  */}
<div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-space-md mb-margin pb-space-md border-b border-outline-variant">
<div className="flex flex-col gap-space-xs">
<div className="flex flex-wrap items-center gap-space-sm">
<h1 className="font-headline-lg text-headline-lg text-on-surface font-bold tracking-tight">S12 Reports Hub</h1>
<div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded bg-surface-container-high border border-outline-variant">
<span className="w-1.5 h-1.5 rounded-full bg-secondary"></span>
<span className="font-label-sm text-label-sm text-primary-container font-semibold uppercase tracking-wider">21 CFR §11.10(b) Validated Query Engine</span>
</div>
</div>
<p className="font-body-md text-body-md text-on-surface-variant max-w-3xl">
        Generate, inspect, and export auditable cold chain compliance registries, hold-time logs, and batch release documentation with full cryptographic traceability.
      </p>
</div>
{/*  Top Right Actions  */}
<div className="flex items-center gap-space-sm self-start lg:self-auto shrink-0">
<button className="min-h-[44px] px-space-md rounded bg-surface-container-lowest border border-outline-variant hover:bg-surface-container-low text-primary-container font-headline-sm text-headline-sm font-semibold transition-colors flex items-center gap-space-xs shadow-sm" type="button">
<span className="material-symbols-outlined text-[18px]">history</span>
<span>Query History (12)</span>
</button>
<button className="min-h-[44px] px-space-md rounded bg-primary-container hover:bg-primary text-on-primary font-headline-sm text-headline-sm font-semibold transition-colors flex items-center gap-space-xs shadow-sm" type="button">
<span className="material-symbols-outlined text-[18px]">calendar_clock</span>
<span>Schedule Automated Export</span>
</button>
</div>
</div>
{/*  Main Content Grid  */}
<div className="grid grid-cols-1 xl:grid-cols-12 gap-gutter-lg items-start">
{/*  Left Filter Panel  */}
<aside className="xl:col-span-4 2xl:col-span-3 bg-surface-container-lowest rounded-lg border border-outline-variant p-space-md shadow-sm">
<div className="flex items-center justify-between pb-space-sm border-b border-outline-variant mb-space-md">
<div className="flex items-center gap-space-xs">
<span className="material-symbols-outlined text-primary-container text-[20px]">tune</span>
<span className="font-headline-sm text-headline-sm text-on-surface font-semibold">Report Query Filters</span>
</div>
<button className="font-label-sm text-label-sm text-secondary hover:text-primary-container font-semibold flex items-center gap-0.5 min-h-[44px] px-1" type="button">
<span className="material-symbols-outlined text-[14px]">restart_alt</span>
          Reset
        </button>
</div>
<form className="space-y-space-md" >
{/*  Period Presets  */}
<div className="space-y-space-xs">
<label className="font-caption text-caption text-on-surface-variant font-bold uppercase tracking-wider block">Period Presets</label>
<div className="grid grid-cols-3 gap-1">
<button className="min-h-[36px] px-2 py-1 rounded bg-surface-container-low hover:bg-surface-container text-on-surface-variant font-caption text-caption font-semibold transition-colors text-center" type="button">Today</button>
<button className="min-h-[36px] px-2 py-1 rounded bg-surface-container-low hover:bg-surface-container text-on-surface-variant font-caption text-caption font-semibold transition-colors text-center" type="button">Yesterday</button>
<button className="min-h-[36px] px-2 py-1 rounded bg-primary-container text-on-primary font-caption text-caption font-semibold text-center shadow-xs" type="button">Last 7 Days</button>
<button className="min-h-[36px] px-2 py-1 rounded bg-surface-container-low hover:bg-surface-container text-on-surface-variant font-caption text-caption font-semibold transition-colors text-center" type="button">Last 30 Days</button>
<button className="col-span-2 min-h-[36px] px-2 py-1 rounded bg-surface-container-low hover:bg-surface-container text-on-surface-variant font-caption text-caption font-semibold transition-colors text-center" type="button">Custom Quarter</button>
</div>
</div>
{/*  Date Range Inputs  */}
<div className="space-y-space-xs">
<div className="flex items-center justify-between">
<label className="font-caption text-caption text-on-surface-variant font-bold uppercase tracking-wider">Date Boundary</label>
<span className="font-label-sm text-label-sm text-outline">DD/MM/YYYY</span>
</div>
<div className="grid grid-cols-2 gap-space-sm">
<div className="relative">
<input className="w-full min-h-[36px] px-space-sm pr-7 rounded bg-surface-container-lowest border border-outline-variant font-label-md text-label-md text-on-surface focus:outline-none focus:ring-1 focus:ring-primary-container" type="text" defaultValue="20/02/2025"/>
<span className="material-symbols-outlined text-outline text-[16px] absolute right-2 top-2.5 pointer-events-none">calendar_today</span>
</div>
<div className="relative">
<input className="w-full min-h-[36px] px-space-sm pr-7 rounded bg-surface-container-lowest border border-outline-variant font-label-md text-label-md text-on-surface focus:outline-none focus:ring-1 focus:ring-primary-container" type="text" defaultValue="26/02/2025"/>
<span className="material-symbols-outlined text-outline text-[16px] absolute right-2 top-2.5 pointer-events-none">event</span>
</div>
</div>
</div>
{/*  Department Select  */}
<div className="space-y-space-xs">
<label className="font-caption text-caption text-on-surface-variant font-bold uppercase tracking-wider block">Department &amp; Zone</label>
<div className="relative">
<select className="w-full min-h-[38px] px-space-sm pr-8 rounded bg-surface-container-lowest border border-outline-variant font-body-sm text-body-sm text-on-surface appearance-none focus:outline-none focus:ring-1 focus:ring-primary-container cursor-pointer">
<option >Biopharma Packaging Line 04 (Cleanroom Grade ISO 7)</option>
<option>Packaging Line 02 (Secondary Cartoning)</option>
<option>Aseptic Core 03 (Grade A Laminar Flow)</option>
<option>All Cleanroom Departments</option>
</select>
<span className="material-symbols-outlined text-outline text-[18px] absolute right-2.5 top-2.5 pointer-events-none">expand_more</span>
</div>
</div>
{/*  Person / Operator Select  */}
<div className="space-y-space-xs">
<label className="font-caption text-caption text-on-surface-variant font-bold uppercase tracking-wider block">Operator / Signatory</label>
<div className="relative">
<select className="w-full min-h-[38px] px-space-sm pr-8 rounded bg-surface-container-lowest border border-outline-variant font-body-sm text-body-sm text-on-surface appearance-none focus:outline-none focus:ring-1 focus:ring-primary-container cursor-pointer">
<option >Anita Shah (Initiator — USR-INIT-104)</option>
<option>Dr. Marcus Vance (HOD — USR-HOD-041)</option>
<option>Elena Rostova (QA Lead — USR-QA-209)</option>
<option>Carlos Mendez (Operator — USR-FILL-03)</option>
<option>All Qualified Personnel</option>
</select>
<span className="material-symbols-outlined text-outline text-[18px] absolute right-2.5 top-2.5 pointer-events-none">expand_more</span>
</div>
</div>
{/*  Chamber & Rack Select  */}
<div className="space-y-space-xs">
<label className="font-caption text-caption text-on-surface-variant font-bold uppercase tracking-wider block">Chamber &amp; Storage Topology</label>
<div className="relative">
<select className="w-full min-h-[38px] px-space-sm pr-8 rounded bg-surface-container-lowest border border-outline-variant font-body-sm text-body-sm text-on-surface appearance-none focus:outline-none focus:ring-1 focus:ring-primary-container cursor-pointer">
<option >All Racks (CR-01 &amp; CR-02 Active)</option>
<option>CR-01: Cold Chamber A (+2°C to +8°C)</option>
<option>CR-01 Bay A–D (Bulk Storage)</option>
<option>CR-02: Intermediate Holding</option>
</select>
<span className="material-symbols-outlined text-outline text-[18px] absolute right-2.5 top-2.5 pointer-events-none">expand_more</span>
</div>
</div>
{/*  Additional Toggles / Checkboxes  */}
<div className="pt-space-xs space-y-space-sm">
<label className="flex items-center gap-space-sm cursor-pointer p-space-xs rounded hover:bg-surface-container-low transition-colors">
<input defaultChecked className="w-4 h-4 rounded text-primary-container border-outline-variant focus:ring-primary-container cursor-pointer" type="checkbox"/>
<div className="flex flex-col">
<span className="font-body-sm text-body-sm text-on-surface font-medium leading-tight">Include Excursions Only</span>
<span className="font-caption text-caption text-on-surface-variant">Filter out standard runs with zero deviations</span>
</div>
</label>
<label className="flex items-center gap-space-sm cursor-pointer p-space-xs rounded hover:bg-surface-container-low transition-colors">
<input defaultChecked className="w-4 h-4 rounded text-primary-container border-outline-variant focus:ring-primary-container cursor-pointer" type="checkbox"/>
<div className="flex flex-col">
<span className="font-body-sm text-body-sm text-on-surface font-medium leading-tight">Include e-Signatures Log</span>
<span className="font-caption text-caption text-on-surface-variant">Append 21 CFR Part 11 cryptographic manifests</span>
</div>
</label>
</div>
{/*  Apply Button  */}
<div className="pt-space-xs">
<button className="w-full min-h-[44px] px-space-md rounded bg-primary-container hover:bg-primary text-on-primary font-headline-sm text-headline-sm font-semibold transition-colors flex items-center justify-between shadow-sm" type="submit">
<span>Apply Filter Criteria</span>
<span className="px-2 py-0.5 rounded-full bg-secondary-container text-on-secondary-container font-label-sm text-label-sm font-bold">24 Records</span>
</button>
</div>
</form>
</aside>
{/*  Right Main Area  */}
<div className="xl:col-span-8 2xl:col-span-9 flex flex-col gap-space-lg">
{/*  Top Section: Four Report Cards  */}
<div>
<div className="flex items-center justify-between mb-space-sm">
<span className="font-caption text-caption text-on-surface-variant font-bold uppercase tracking-wider">Select Report Archetype</span>
<span className="font-label-sm text-label-sm text-outline">4 Validated Templates</span>
</div>
<div className="grid grid-cols-1 md:grid-cols-2 2xl:grid-cols-4 gap-space-md">
{/*  Card 1: Products in Cold Room  */}
<div className="bg-surface-container-lowest rounded-lg border border-outline-variant hover:border-secondary p-space-md flex flex-col justify-between transition-all cursor-pointer shadow-sm group">
<div>
<div className="flex items-center justify-between mb-space-sm">
<div className="w-9 h-9 rounded bg-surface-container-low flex items-center justify-center text-primary-container group-hover:bg-primary-container group-hover:text-on-primary transition-colors">
<span className="material-symbols-outlined text-[20px]">ac_unit</span>
</div>
<span className="font-label-sm text-label-sm text-outline">RPT-CR-01</span>
</div>
<h3 className="font-headline-sm text-headline-sm text-on-surface font-semibold mb-space-xs">Products in Cold Room</h3>
<p className="font-body-sm text-body-sm text-on-surface-variant line-clamp-2">Real-time snapshot of active lots, rack occupancies, and current thermal telemetry.</p>
</div>
<div className="mt-space-md pt-space-sm border-t border-outline-variant">
<div className="font-label-sm text-label-sm text-primary-container font-semibold">18 Lots Active • 2 Chambers • 88% Cap</div>
<div className="font-caption text-caption text-outline mt-0.5">Generated: Today, 14:15 UTC</div>
</div>
</div>
{/*  Card 2: Product Movement & Hold-Time  */}
<div className="bg-surface-container-lowest rounded-lg border border-outline-variant hover:border-secondary p-space-md flex flex-col justify-between transition-all cursor-pointer shadow-sm group">
<div>
<div className="flex items-center justify-between mb-space-sm">
<div className="w-9 h-9 rounded bg-surface-container-low flex items-center justify-center text-primary-container group-hover:bg-primary-container group-hover:text-on-primary transition-colors">
<span className="material-symbols-outlined text-[20px]">hourglass_top</span>
</div>
<span className="font-label-sm text-label-sm text-outline">RPT-TM-04</span>
</div>
<h3 className="font-headline-sm text-headline-sm text-on-surface font-semibold mb-space-xs">Product Movement &amp; Hold-Time</h3>
<p className="font-body-sm text-body-sm text-on-surface-variant line-clamp-2">Comprehensive transfer log across all 4 stages with elapsed countdown clocks and deviation flags.</p>
</div>
<div className="mt-space-md pt-space-sm border-t border-outline-variant">
<div className="font-label-sm text-label-sm text-secondary font-semibold">31 Transfers Logged • 1 Excursion</div>
<div className="font-caption text-caption text-outline mt-0.5">Generated: Today, 12:30 UTC</div>
</div>
</div>
{/*  Card 3: Batch Report (ACTIVE / )  */}
<div className="bg-surface-container-lowest rounded-lg border-2 border-primary-container p-space-md flex flex-col justify-between shadow-md relative ring-1 ring-primary-container/20">
<div className="absolute -top-2.5 right-3 px-2 py-0.5 rounded bg-primary-container text-on-primary font-label-sm text-[10px] font-bold uppercase tracking-wider shadow-xs flex items-center gap-1">
<span className="material-symbols-outlined text-[12px]">visibility</span>
              Active Preview
            </div>
<div>
<div className="flex items-center justify-between mb-space-sm">
<div className="w-9 h-9 rounded bg-primary-container text-on-primary flex items-center justify-center">
<span className="material-symbols-outlined text-[20px]">assignment</span>
</div>
<span className="font-label-sm text-label-sm text-primary-container font-bold">RPT-BA-09</span>
</div>
<h3 className="font-headline-sm text-headline-sm text-on-surface font-semibold mb-space-xs">Batch Report</h3>
<p className="font-body-sm text-body-sm text-on-surface-variant line-clamp-2">Full regulatory dossier for individual lots: intake, movement history, hold-times, and 3-tier electronic signatures.</p>
</div>
<div className="mt-space-md pt-space-sm border-t border-outline-variant">
<div className="font-label-sm text-label-sm text-primary-container font-bold">Lot LT-26A017 • Batch B260117</div>
<div className="font-caption text-caption text-outline mt-0.5">Generated: Today, 14:38 UTC</div>
</div>
</div>
{/*  Card 4: Active User List  */}
<div className="bg-surface-container-lowest rounded-lg border border-outline-variant hover:border-secondary p-space-md flex flex-col justify-between transition-all cursor-pointer shadow-sm group">
<div>
<div className="flex items-center justify-between mb-space-sm">
<div className="w-9 h-9 rounded bg-surface-container-low flex items-center justify-center text-primary-container group-hover:bg-primary-container group-hover:text-on-primary transition-colors">
<span className="material-symbols-outlined text-[20px]">badge</span>
</div>
<span className="font-label-sm text-label-sm text-outline">RPT-AU-11</span>
</div>
<h3 className="font-headline-sm text-headline-sm text-on-surface font-semibold mb-space-xs">Active User List</h3>
<p className="font-body-sm text-body-sm text-on-surface-variant line-clamp-2">Cleanroom personnel credentials, role permissions (Initiator/HOD/QA/Admin), and terminal session status.</p>
</div>
<div className="mt-space-md pt-space-sm border-t border-outline-variant">
<div className="font-label-sm text-label-sm text-primary-container font-semibold">14 Verified Operators • 4 Roles</div>
<div className="font-caption text-caption text-outline mt-0.5">Generated: Yesterday, 18:00 UTC</div>
</div>
</div>
</div>
</div>
{/*  Bottom Section:  Report Preview Panel  */}
<div className="bg-surface-container-lowest rounded-lg border border-outline-variant shadow-sm overflow-hidden flex flex-col">
{/*  Header Bar  */}
<div className="p-space-md border-b border-outline-variant flex flex-col lg:flex-row lg:items-center lg:justify-between gap-space-sm bg-surface-container-low">
<div className="flex flex-wrap items-center gap-space-sm">
<span className="material-symbols-outlined text-primary-container text-[22px]">description</span>
<div>
<div className="flex items-center gap-2">
<h2 className="font-headline-sm text-headline-sm text-on-surface font-bold">Batch Report Preview — Lot LT-26A017</h2>
<span className="px-2 py-0.5 rounded bg-error-container text-on-error-container font-label-sm text-label-sm font-semibold border border-error/20">Review Pending</span>
</div>
<div className="font-caption text-caption text-on-surface-variant">Insulin Glargine Injection 100 IU/mL • Monograph Compliant USP &amp; EP</div>
</div>
</div>
{/*  Action Button Cluster  */}
<div className="flex flex-wrap items-center gap-space-xs">
<button className="min-h-[44px] px-3 rounded bg-surface-container-lowest border border-outline-variant hover:bg-surface-container text-on-surface font-body-sm text-body-sm font-medium transition-colors flex items-center gap-1.5 shadow-xs" type="button">
<span className="material-symbols-outlined text-[18px]">open_in_full</span>
<span>View Full Screen</span>
</button>
<button className="min-h-[44px] px-3 rounded bg-surface-container-lowest border border-outline-variant hover:bg-surface-container text-on-surface font-body-sm text-body-sm font-medium transition-colors flex items-center gap-1.5 shadow-xs" type="button">
<span className="material-symbols-outlined text-[18px]">print</span>
<span>Print Layout (S15)</span>
</button>
<button className="min-h-[44px] px-3 rounded bg-surface-container-lowest border border-outline-variant hover:bg-surface-container text-on-surface font-body-sm text-body-sm font-medium transition-colors flex items-center gap-1.5 shadow-xs" type="button">
<span className="material-symbols-outlined text-[18px]">table_view</span>
<span>Export CSV</span>
</button>
<button className="min-h-[44px] px-space-md rounded bg-primary-container hover:bg-primary text-on-primary font-headline-sm text-headline-sm font-semibold transition-colors flex items-center gap-1.5 shadow-sm" type="button">
<span className="material-symbols-outlined text-[18px]">download</span>
<span>Download PDF</span>
</button>
</div>
</div>
{/*  Quick Summary Strip  */}
<div className="px-space-md py-space-sm bg-surface-bright border-b border-outline-variant grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-space-sm">
<div>
<span className="font-caption text-caption text-outline uppercase tracking-wider block">Product Name</span>
<span className="font-body-sm text-body-sm text-on-surface font-semibold truncate block">Insulin Glargine</span>
</div>
<div>
<span className="font-caption text-caption text-outline uppercase tracking-wider block">Target Potency</span>
<span className="font-label-sm text-label-sm text-on-surface font-medium block">3.64 mg/mL (100 IU)</span>
</div>
<div>
<span className="font-caption text-caption text-outline uppercase tracking-wider block">Lot Reference</span>
<span className="font-label-sm text-label-sm text-primary-container font-bold block">LT-26A017</span>
</div>
<div>
<span className="font-caption text-caption text-outline uppercase tracking-wider block">Master Batch</span>
<span className="font-label-sm text-label-sm text-on-surface font-medium block">B260117</span>
</div>
<div>
<span className="font-caption text-caption text-outline uppercase tracking-wider block">Intake Timestamp</span>
<span className="font-label-sm text-label-sm text-on-surface font-medium block">26/02/2025 09:15</span>
</div>
<div>
<span className="font-caption text-caption text-outline uppercase tracking-wider block">Hold Status</span>
<span className="font-label-sm text-label-sm text-error font-bold flex items-center gap-1">
<span className="material-symbols-outlined text-[14px]">warning</span>
              1 Excursion (+12m)
            </span>
</div>
</div>
{/*  Preview Table  */}
<div className="overflow-x-auto">
<table className="w-full text-left border-collapse">
<thead>
<tr className="bg-surface-container-low border-b border-outline-variant font-caption text-caption text-on-surface-variant uppercase tracking-wider">
<th className="py-2.5 px-space-md">Stage / Step</th>
<th className="py-2.5 px-space-md">Location / Equipment</th>
<th className="py-2.5 px-space-md">Start Time</th>
<th className="py-2.5 px-space-md">End / Elapsed</th>
<th className="py-2.5 px-space-md">Limit</th>
<th className="py-2.5 px-space-md">Compliance Status</th>
<th className="py-2.5 px-space-md">Verified Operator</th>
<th className="py-2.5 px-space-md">Cryptographic Integrity</th>
</tr>
</thead>
<tbody className="divide-y divide-outline-variant/60 font-body-sm text-body-sm">
{/*  Row 1  */}
<tr className="hover:bg-surface-bright transition-colors">
<td className="py-3 px-space-md">
<div className="font-semibold text-on-surface">Stage 1: Filling Intake</div>
<div className="font-caption text-caption text-outline">Depyrogenated Vials</div>
</td>
<td className="py-3 px-space-md">
<span className="font-label-sm text-label-sm text-on-surface">Line 04 Air Lock AL-04</span>
</td>
<td className="py-3 px-space-md font-label-sm text-label-sm text-on-surface">26/02/2025 09:15</td>
<td className="py-3 px-space-md font-label-sm text-label-sm text-on-surface font-medium">0h 42m</td>
<td className="py-3 px-space-md font-label-sm text-label-sm text-outline">1h 00m</td>
<td className="py-3 px-space-md">
<span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded bg-secondary-container/40 text-on-secondary-container font-label-sm text-label-sm font-semibold border border-secondary-container">
<span className="w-1.5 h-1.5 rounded-full bg-secondary"></span>
                    Within Limit
                  </span>
</td>
<td className="py-3 px-space-md">
<div className="text-on-surface font-medium">Carlos Mendez</div>
<div className="font-label-sm text-[10px] text-outline">USR-FILL-03</div>
</td>
<td className="py-3 px-space-md">
<span className="inline-flex items-center gap-1 font-label-sm text-label-sm text-primary-container font-medium">
<span className="material-symbols-outlined text-[14px]">verified</span>
                    SHA-256 Validated
                  </span>
</td>
</tr>
{/*  Row 2 (Excursion)  */}
<tr className="bg-error-container/10 hover:bg-error-container/20 transition-colors">
<td className="py-3 px-space-md">
<div className="font-semibold text-error flex items-center gap-1">
<span className="material-symbols-outlined text-[16px]">error</span>
                    Stage 2: Cold Room Storage
                  </div>
<div className="font-caption text-caption text-outline">CR-01 Pallet Holding</div>
</td>
<td className="py-3 px-space-md">
<span className="font-label-sm text-label-sm text-on-surface font-semibold">CR-01 / RK-CR01-001 (S-02)</span>
</td>
<td className="py-3 px-space-md font-label-sm text-label-sm text-on-surface">26/02/2025 09:57</td>
<td className="py-3 px-space-md font-label-sm text-label-sm text-error font-bold">1h 12m</td>
<td className="py-3 px-space-md font-label-sm text-label-sm text-outline">1h 00m</td>
<td className="py-3 px-space-md">
<span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded bg-error-container text-on-error-container font-label-sm text-label-sm font-bold border border-error/30">
<span className="w-1.5 h-1.5 rounded-full bg-error animate-pulse"></span>
                    EXCEEDED (+12m)
                  </span>
</td>
<td className="py-3 px-space-md">
<div className="text-on-surface font-medium">Anita Shah</div>
<div className="font-label-sm text-[10px] text-outline">USR-INIT-104</div>
</td>
<td className="py-3 px-space-md">
<span className="inline-flex items-center gap-1 font-label-sm text-label-sm text-error font-semibold">
<span className="material-symbols-outlined text-[14px]">report_problem</span>
                    SOP-088 Deviation Logged
                  </span>
</td>
</tr>
{/*  Row 3  */}
<tr className="hover:bg-surface-bright transition-colors">
<td className="py-3 px-space-md">
<div className="font-semibold text-on-surface">Stage 3: Inspection Buffer</div>
<div className="font-caption text-caption text-outline">Automated Camera Line</div>
</td>
<td className="py-3 px-space-md">
<span className="font-label-sm text-label-sm text-on-surface">Cleanroom Staging IC-04</span>
</td>
<td className="py-3 px-space-md font-label-sm text-label-sm text-on-surface">26/02/2025 14:15</td>
<td className="py-3 px-space-md font-label-sm text-label-sm text-secondary font-bold">0h 51m (Active)</td>
<td className="py-3 px-space-md font-label-sm text-label-sm text-outline">1h 00m</td>
<td className="py-3 px-space-md">
<span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded bg-surface-container-high text-on-surface font-label-sm text-label-sm font-semibold border border-outline-variant">
<span className="w-1.5 h-1.5 rounded-full bg-secondary"></span>
                    Warning (85% Limit)
                  </span>
</td>
<td className="py-3 px-space-md">
<div className="text-on-surface font-medium">Anita Shah</div>
<div className="font-label-sm text-[10px] text-outline">USR-INIT-104</div>
</td>
<td className="py-3 px-space-md">
<span className="inline-flex items-center gap-1 font-label-sm text-label-sm text-secondary font-medium">
<span className="material-symbols-outlined text-[14px]">sync</span>
                    In-Progress Monitor
                  </span>
</td>
</tr>
{/*  Row 4  */}
<tr className="hover:bg-surface-bright transition-colors opacity-75">
<td className="py-3 px-space-md">
<div className="font-semibold text-on-surface-variant">Stage 4: Secondary Packaging</div>
<div className="font-caption text-caption text-outline">Carton and Leaflet Pack</div>
</td>
<td className="py-3 px-space-md">
<span className="font-label-sm text-label-sm text-on-surface-variant">Blister Line Station 02</span>
</td>
<td className="py-3 px-space-md font-label-sm text-label-sm text-outline">Queued</td>
<td className="py-3 px-space-md font-label-sm text-label-sm text-outline">0h 00m</td>
<td className="py-3 px-space-md font-label-sm text-label-sm text-outline">1h 00m</td>
<td className="py-3 px-space-md">
<span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-surface-container text-on-surface-variant font-label-sm text-label-sm font-medium">
                    Queued
                  </span>
</td>
<td className="py-3 px-space-md">
<span className="font-body-sm text-body-sm text-outline italic">Unassigned</span>
</td>
<td className="py-3 px-space-md">
<span className="font-label-sm text-label-sm text-outline">Pending Line Clearance</span>
</td>
</tr>
</tbody>
</table>
</div>
{/*  Electronic Signatures Status Bar  */}
<div className="p-space-md bg-surface-container-low border-t border-outline-variant flex flex-col md:flex-row items-stretch md:items-center justify-between gap-space-md">
<div className="flex items-center gap-space-xs text-on-surface font-headline-sm text-headline-sm font-semibold shrink-0">
<span className="material-symbols-outlined text-primary-container text-[20px]">draw</span>
<span>21 CFR Part 11 Manifest:</span>
</div>
<div className="grid grid-cols-1 sm:grid-cols-3 gap-space-sm flex-1">
{/*  Tier 1: Initiator  */}
<div className="p-space-xs px-space-sm rounded bg-surface-container-lowest border border-outline-variant flex items-center justify-between">
<div>
<span className="font-caption text-caption text-outline uppercase tracking-wider block">Initiator</span>
<span className="font-body-sm text-body-sm text-on-surface font-semibold block">Anita Shah</span>
<span className="font-label-sm text-[10px] text-on-surface-variant">26/02 14:15 UTC</span>
</div>
<span className="px-2 py-0.5 rounded bg-secondary-container/50 text-on-secondary-container font-label-sm text-label-sm font-bold flex items-center gap-1">
<span className="material-symbols-outlined text-[14px]">check_circle</span>
                Verified
              </span>
</div>
{/*  Tier 2: HOD Review  */}
<div className="p-space-xs px-space-sm rounded bg-surface-container-lowest border border-outline-variant flex items-center justify-between">
<div>
<span className="font-caption text-caption text-outline uppercase tracking-wider block">HOD Review</span>
<span className="font-body-sm text-body-sm text-on-surface font-semibold block">Dr. Marcus Vance</span>
<span className="font-label-sm text-[10px] text-outline">SOP Deviation Review</span>
</div>
<span className="px-2 py-0.5 rounded bg-surface-container-high text-on-surface-variant font-label-sm text-label-sm font-bold flex items-center gap-1">
<span className="material-symbols-outlined text-[14px]">pending</span>
                Pending
              </span>
</div>
{/*  Tier 3: QA Release  */}
<div className="p-space-xs px-space-sm rounded bg-surface-container-lowest border border-outline-variant flex items-center justify-between opacity-80">
<div>
<span className="font-caption text-caption text-outline uppercase tracking-wider block">QA Release</span>
<span className="font-body-sm text-body-sm text-on-surface font-semibold block">Elena Rostova</span>
<span className="font-label-sm text-[10px] text-outline">Awaiting HOD Step</span>
</div>
<span className="px-2 py-0.5 rounded bg-surface-container-high text-outline font-label-sm text-label-sm font-bold flex items-center gap-1">
<span className="material-symbols-outlined text-[14px]">lock</span>
                Locked
              </span>
</div>
</div>
</div>
</div>
</div>
</div>
</div>
    </AppLayout>
  );
}
