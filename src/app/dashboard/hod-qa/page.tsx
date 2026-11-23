"use client";

import React from "react";
import Link from "next/link";
import AppLayout from "@/components/layout/AppLayout";

export default function HODQADashboardPage() {
  return (
    <AppLayout screenCode="S05">
      <div className="flex flex-col w-full pb-margin-lg">
{/*  Page Header & Action Bar  */}
<div className="flex flex-col lg:flex-row lg:items-end justify-between gap-space-md mb-space-lg">
<div className="flex flex-col gap-space-xs">
<div className="flex items-center gap-space-xs font-label-sm text-label-sm text-on-surface-variant font-mono uppercase tracking-wider">
<span>System Oversight</span>
<span className="material-symbols-outlined text-[14px]">chevron_right</span>
<span>Batch Release</span>
<span className="material-symbols-outlined text-[14px]">chevron_right</span>
<span className="text-primary font-semibold">HOD &amp; QA Dashboard</span>
</div>
<div className="flex flex-wrap items-baseline gap-space-sm">
<h1 className="font-headline-lg text-headline-lg text-on-surface font-semibold tracking-tight">S05 HOD / QA Dashboard Variant</h1>
<span className="px-2 py-0.5 rounded bg-surface-container-high font-label-sm text-label-sm text-secondary font-mono">ROLE: APPROVER (SEC-L3)</span>
</div>
<p className="font-body-md text-body-md text-on-surface-variant max-w-3xl">
        Regulatory supervision, hold-time deviation trends, and electronic signature sign-off queue compliant with 21 CFR Part 11 mandates.
      </p>
</div>
{/*  Quick Tool Actions  */}
<div className="flex flex-wrap items-center gap-space-sm">
<div className="relative">
<button className="min-h-[44px] px-3.5 py-2 rounded-lg bg-surface-container-lowest shadow-sm hover:bg-surface-container text-on-surface font-body-sm text-body-sm font-medium flex items-center gap-2 transition-colors cursor-pointer" id="sectionFilterBtn" >
<span className="material-symbols-outlined text-[18px] text-secondary">tune</span>
<span>Batch Approval Filter: <strong className="font-semibold text-primary">All Sections</strong></span>
<span className="material-symbols-outlined text-[18px] text-on-surface-variant">arrow_drop_down</span>
</button>
<div className="hidden absolute right-0 mt-1 w-64 rounded-lg bg-surface-container-lowest shadow-xl z-30 py-1 font-body-sm text-body-sm" id="filterMenu">
<div className="px-3 py-1.5 text-on-surface-variant font-label-sm text-label-sm uppercase">Cleanroom Enclosures</div>
<button className="w-full text-left px-3 py-2 text-primary font-semibold bg-surface-container-low flex items-center justify-between">
<span>All Sections (Global)</span>
<span className="material-symbols-outlined text-[16px]">check</span>
</button>
<button className="w-full text-left px-3 py-2 text-on-surface hover:bg-surface-container-low">Line 04 - High Speed Syringes</button>
<button className="w-full text-left px-3 py-2 text-on-surface hover:bg-surface-container-low">Line 02 - Cartridge Line</button>
<button className="w-full text-left px-3 py-2 text-on-surface hover:bg-surface-container-low">Cold Storage Vaults (CR-01 &amp; 02)</button>
</div>
</div>
<button className="min-h-[44px] px-4 py-2 rounded-lg bg-primary-container text-on-primary font-body-sm text-body-sm font-semibold flex items-center gap-2 shadow-sm hover:opacity-95 transition-all cursor-pointer">
<span className="material-symbols-outlined text-[18px]">picture_as_pdf</span>
<span>Export Audit Package (PDF)</span>
</button>
</div>
</div>
{/*  Row of 4 Real-time KPI Metric Cards  */}
<div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-space-md mb-space-lg">
{/*  Card 1: Cold Rooms  */}
<div className="p-space-md rounded-xl bg-surface-container-lowest shadow-sm flex flex-col justify-between min-h-[120px] relative overflow-hidden">
<div className="flex items-center justify-between">
<span className="font-caption text-caption text-on-surface-variant uppercase tracking-wider font-semibold">Products in Cold Rooms</span>
<div className="w-7 h-7 rounded-lg bg-surface-container-low text-secondary flex items-center justify-center">
<span className="material-symbols-outlined text-[18px]">ac_unit</span>
</div>
</div>
<div className="my-space-xs flex items-baseline gap-space-sm">
<span className="font-headline-xl text-headline-xl font-bold text-on-surface font-mono">18</span>
<span className="px-2 py-0.5 rounded-full bg-secondary-container text-on-secondary-container font-label-sm text-label-sm font-semibold">Active Lots</span>
</div>
<div className="font-caption text-caption text-on-surface-variant flex items-center gap-1">
<span className="material-symbols-outlined text-[14px] text-secondary">inventory_2</span>
<span>Across CR-01 &amp; CR-02 (84% capacity) • 4 Racks</span>
</div>
</div>
{/*  Card 2: Hold-Time Warnings  */}
<div className="p-space-md rounded-xl bg-surface-container-lowest shadow-sm flex flex-col justify-between min-h-[120px] relative overflow-hidden">
<div className="flex items-center justify-between">
<span className="font-caption text-caption text-on-surface-variant uppercase tracking-wider font-semibold">Hold-Time Warnings</span>
<div className="w-7 h-7 rounded-lg bg-surface-container-high text-tertiary flex items-center justify-center">
<span className="material-symbols-outlined text-[18px]">hourglass_top</span>
</div>
</div>
<div className="my-space-xs flex items-baseline gap-space-sm">
<span className="font-headline-xl text-headline-xl font-bold text-on-surface font-mono">3</span>
<span className="px-2 py-0.5 rounded-full bg-surface-container-highest text-tertiary font-label-sm text-label-sm font-semibold">Amber Alert</span>
</div>
<div className="font-caption text-caption text-on-surface-variant flex items-center gap-1">
<span className="material-symbols-outlined text-[14px] text-tertiary">warning</span>
<span>≥80% of 1h stage window utilized</span>
</div>
</div>
{/*  Card 3: Hold-Time Exceeded  */}
<div className="p-space-md rounded-xl bg-surface-container-lowest shadow-sm flex flex-col justify-between min-h-[120px] relative overflow-hidden bg-gradient-to-br from-surface-container-lowest via-surface-container-lowest to-error-container/30">
<div className="flex items-center justify-between">
<span className="font-caption text-caption text-error uppercase tracking-wider font-bold">Hold-Time EXCEEDED</span>
<div className="w-7 h-7 rounded-lg bg-error-container text-on-error-container flex items-center justify-center animate-pulse">
<span className="material-symbols-outlined text-[18px]">crisis_alert</span>
</div>
</div>
<div className="my-space-xs flex items-baseline gap-space-sm">
<span className="font-headline-xl text-headline-xl font-bold text-error font-mono">1</span>
<span className="px-2 py-0.5 rounded-full bg-error text-on-error font-label-sm text-label-sm font-bold tracking-wide">QA ACTION REQ</span>
</div>
<div className="font-caption text-caption text-error font-medium flex items-center gap-1">
<span className="material-symbols-outlined text-[14px]">report_problem</span>
<span>Critical deviation SOP-GMP-088 triggered</span>
</div>
</div>
{/*  Card 4: Movements Today  */}
<div className="p-space-md rounded-xl bg-surface-container-lowest shadow-sm flex flex-col justify-between min-h-[120px] relative overflow-hidden">
<div className="flex items-center justify-between">
<span className="font-caption text-caption text-on-surface-variant uppercase tracking-wider font-semibold">Movements Today</span>
<div className="w-7 h-7 rounded-lg bg-surface-container-low text-primary flex items-center justify-center">
<span className="material-symbols-outlined text-[18px]">swap_horiz</span>
</div>
</div>
<div className="my-space-xs flex items-baseline gap-space-sm">
<span className="font-headline-xl text-headline-xl font-bold text-on-surface font-mono">7</span>
<span className="px-2 py-0.5 rounded-full bg-surface-container text-on-surface-variant font-label-sm text-label-sm font-semibold">Chain Log</span>
</div>
<div className="font-caption text-caption text-on-surface-variant flex items-center gap-1">
<span className="material-symbols-outlined text-[14px] text-secondary">check_circle</span>
<span>Last recorded 12 mins ago by A. Shah</span>
</div>
</div>
</div>
{/*  Main Asymmetric Workspace: 8 cols (Left) + 4 cols (Right)  */}
<div className="grid grid-cols-1 xl:grid-cols-12 gap-space-lg items-start">
{/*  LEFT WIDE COLUMN: Hold-Time Watchlist (8 cols)  */}
<div className="xl:col-span-8 flex flex-col gap-space-md">
<div className="rounded-xl bg-surface-container-lowest shadow-sm overflow-hidden flex flex-col">
{/*  Table Control Header  */}
<div className="p-space-md bg-surface-container-lowest flex flex-col md:flex-row md:items-center justify-between gap-space-sm">
<div className="flex items-center gap-space-sm">
<div className="flex flex-col">
<div className="flex items-center gap-2">
<h2 className="font-headline-sm text-headline-sm text-on-surface font-semibold">Hold-time Watchlist</h2>
<span className="px-2 py-0.5 rounded bg-surface-container-high text-on-surface-variant font-label-sm text-label-sm font-mono font-medium">Sorted by least time remaining</span>
</div>
<span className="font-caption text-caption text-on-surface-variant">Real-time temperature and ambient stage hold monitors across active lots</span>
</div>
</div>
{/*  Micro search & filter  */}
<div className="flex items-center gap-space-xs">
<div className="relative flex items-center">
<span className="material-symbols-outlined absolute left-2.5 text-[18px] text-on-surface-variant">search</span>
<input className="min-h-[44px] pl-9 pr-3 py-1.5 rounded-lg bg-surface-container-low text-on-surface font-body-sm text-body-sm placeholder:text-on-surface-variant focus:outline-none focus:bg-surface-container transition-colors w-52 md:w-64" placeholder="Search lot, batch, product..." type="text"/>
</div>
<button className="min-h-[44px] min-w-[44px] flex items-center justify-center rounded-lg bg-surface-container-low text-on-surface-variant hover:text-on-surface hover:bg-surface-container transition-colors" title="Reload live data">
<span className="material-symbols-outlined text-[20px]">sync</span>
</button>
</div>
</div>
{/*  Density-Optimized GMP Data Table  */}
<div className="overflow-x-auto w-full">
<table className="w-full text-left border-collapse">
<thead>
<tr className="bg-surface-container-low text-on-surface-variant font-label-sm text-label-sm uppercase tracking-wider font-semibold">
<th className="py-2.5 px-3 min-w-[190px]">Product</th>
<th className="py-2.5 px-3 min-w-[110px]">Lot / Batch</th>
<th className="py-2.5 px-3 min-w-[130px]">Stage Location</th>
<th className="py-2.5 px-3 min-w-[80px]">Elapsed</th>
<th className="py-2.5 px-3 min-w-[80px]">Limit (1h)</th>
<th className="py-2.5 px-3 min-w-[160px]">Stage Progress</th>
<th className="py-2.5 px-3 text-right min-w-[120px]">Action</th>
</tr>
</thead>
<tbody className="font-body-sm text-body-sm divide-y divide-surface-container">
{/*  Row 1: CRITICAL EXCEEDED  */}
<tr className="bg-error-container/20 hover:bg-error-container/30 transition-colors">
<td className="py-3 px-3">
<div className="flex flex-col">
<span className="font-semibold text-on-surface">Filgrastim 300 mcg/0.5 mL</span>
<span className="font-caption text-caption text-on-surface-variant">PFS Biopharma Pack</span>
</div>
</td>
<td className="py-3 px-3 font-mono font-label-sm text-label-sm">
<div className="flex flex-col">
<span className="text-primary font-bold">LT-26A014</span>
<span className="text-on-surface-variant">B260114</span>
</div>
</td>
<td className="py-3 px-3">
<div className="flex items-center gap-1.5 text-on-surface">
<span className="material-symbols-outlined text-[16px] text-error">ac_unit</span>
<span>CR-01 Storage</span>
</div>
</td>
<td className="py-3 px-3 font-mono font-bold text-error">1h 04m</td>
<td className="py-3 px-3 font-mono text-on-surface-variant">1h 00m</td>
<td className="py-3 px-3">
<div className="flex flex-col gap-1">
<span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-error text-on-error font-label-sm text-[10px] font-bold w-fit tracking-wide animate-pulse">
<span className="material-symbols-outlined text-[12px]">warning</span>
                      +4m OVERDUE (Critical)
                    </span>
<div className="w-full bg-surface-container-high h-1.5 rounded-full overflow-hidden">
<div className="bg-error h-full rounded-full" style={{"width":"100%"}}></div>
</div>
</div>
</td>
<td className="py-3 px-3 text-right">
<button className="min-h-[44px] px-3 py-1.5 rounded bg-error text-on-error font-label-sm text-label-sm font-bold shadow-sm hover:opacity-90 inline-flex items-center gap-1.5 transition-all cursor-pointer">
<span className="material-symbols-outlined text-[16px]">gavel</span>
<span>Deviation</span>
</button>
</td>
</tr>
{/*  Row 2: WARNING (90%)  */}
<tr className="hover:bg-surface-container-low transition-colors">
<td className="py-3 px-3">
<div className="flex flex-col">
<span className="font-semibold text-on-surface">Insulin Glargine 100 IU/mL</span>
<span className="font-caption text-caption text-on-surface-variant">3 mL Cartridges</span>
</div>
</td>
<td className="py-3 px-3 font-mono font-label-sm text-label-sm">
<div className="flex flex-col">
<span className="text-primary font-bold">LT-26A017</span>
<span className="text-on-surface-variant">B260117</span>
</div>
</td>
<td className="py-3 px-3">
<div className="flex items-center gap-1.5 text-on-surface">
<span className="material-symbols-outlined text-[16px] text-tertiary">conveyor_belt</span>
<span>Line 04 Buffer</span>
</div>
</td>
<td className="py-3 px-3 font-mono font-bold text-tertiary">0h 54m</td>
<td className="py-3 px-3 font-mono text-on-surface-variant">1h 00m</td>
<td className="py-3 px-3">
<div className="flex flex-col gap-1">
<span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-surface-container-highest text-tertiary font-label-sm text-[10px] font-bold w-fit">
<span className="material-symbols-outlined text-[12px]">timer</span>
                      6m remaining (90%)
                    </span>
<div className="w-full bg-surface-container-high h-1.5 rounded-full overflow-hidden">
<div className="bg-tertiary h-full rounded-full" style={{"width":"90%"}}></div>
</div>
</div>
</td>
<td className="py-3 px-3 text-right">
<button className="min-h-[44px] min-w-[44px] px-3 py-1.5 rounded bg-surface-container hover:bg-surface-container-high text-primary font-body-sm text-body-sm font-semibold inline-flex items-center justify-center transition-colors">
                    Inspect
                  </button>
</td>
</tr>
{/*  Row 3: WARNING (85%)  */}
<tr className="hover:bg-surface-container-low transition-colors">
<td className="py-3 px-3">
<div className="flex flex-col">
<span className="font-semibold text-on-surface">Adalimumab 40 mg/0.8 mL</span>
<span className="font-caption text-caption text-on-surface-variant">Autoinjector Pack</span>
</div>
</td>
<td className="py-3 px-3 font-mono font-label-sm text-label-sm">
<div className="flex flex-col">
<span className="text-primary font-bold">LT-26A018</span>
<span className="text-on-surface-variant">B260118</span>
</div>
</td>
<td className="py-3 px-3">
<div className="flex items-center gap-1.5 text-on-surface">
<span className="material-symbols-outlined text-[16px] text-secondary">ac_unit</span>
<span>Cold Room CR-02</span>
</div>
</td>
<td className="py-3 px-3 font-mono font-bold text-tertiary">0h 51m</td>
<td className="py-3 px-3 font-mono text-on-surface-variant">1h 00m</td>
<td className="py-3 px-3">
<div className="flex flex-col gap-1">
<span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-surface-container-highest text-tertiary font-label-sm text-[10px] font-bold w-fit">
<span className="material-symbols-outlined text-[12px]">timer</span>
                      9m remaining (85%)
                    </span>
<div className="w-full bg-surface-container-high h-1.5 rounded-full overflow-hidden">
<div className="bg-tertiary h-full rounded-full" style={{"width":"85%"}}></div>
</div>
</div>
</td>
<td className="py-3 px-3 text-right">
<button className="min-h-[44px] min-w-[44px] px-3 py-1.5 rounded bg-surface-container hover:bg-surface-container-high text-primary font-body-sm text-body-sm font-semibold inline-flex items-center justify-center transition-colors">
                    Inspect
                  </button>
</td>
</tr>
{/*  Row 4: WARNING (80%)  */}
<tr className="hover:bg-surface-container-low transition-colors">
<td className="py-3 px-3">
<div className="flex flex-col">
<span className="font-semibold text-on-surface">Insulin Glargine 100 IU/mL</span>
<span className="font-caption text-caption text-on-surface-variant">3 mL Cartridges</span>
</div>
</td>
<td className="py-3 px-3 font-mono font-label-sm text-label-sm">
<div className="flex flex-col">
<span className="text-primary font-bold">LT-26A019</span>
<span className="text-on-surface-variant">B260119</span>
</div>
</td>
<td className="py-3 px-3">
<div className="flex items-center gap-1.5 text-on-surface">
<span className="material-symbols-outlined text-[16px] text-secondary">visibility</span>
<span>Visual buffer</span>
</div>
</td>
<td className="py-3 px-3 font-mono font-bold text-tertiary">0h 48m</td>
<td className="py-3 px-3 font-mono text-on-surface-variant">1h 00m</td>
<td className="py-3 px-3">
<div className="flex flex-col gap-1">
<span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-surface-container-highest text-tertiary font-label-sm text-[10px] font-bold w-fit">
<span className="material-symbols-outlined text-[12px]">timer</span>
                      12m remaining (80%)
                    </span>
<div className="w-full bg-surface-container-high h-1.5 rounded-full overflow-hidden">
<div className="bg-tertiary h-full rounded-full" style={{"width":"80%"}}></div>
</div>
</div>
</td>
<td className="py-3 px-3 text-right">
<button className="min-h-[44px] min-w-[44px] px-3 py-1.5 rounded bg-surface-container hover:bg-surface-container-high text-primary font-body-sm text-body-sm font-semibold inline-flex items-center justify-center transition-colors">
                    Inspect
                  </button>
</td>
</tr>
{/*  Row 5: OK (36%)  */}
<tr className="hover:bg-surface-container-low transition-colors">
<td className="py-3 px-3">
<div className="flex flex-col">
<span className="font-semibold text-on-surface">Filgrastim 300 mcg/0.5 mL</span>
<span className="font-caption text-caption text-on-surface-variant">PFS Biopharma Pack</span>
</div>
</td>
<td className="py-3 px-3 font-mono font-label-sm text-label-sm">
<div className="flex flex-col">
<span className="text-primary font-bold">LT-26A020</span>
<span className="text-on-surface-variant">B260120</span>
</div>
</td>
<td className="py-3 px-3">
<div className="flex items-center gap-1.5 text-on-surface">
<span className="material-symbols-outlined text-[16px] text-secondary">pallet</span>
<span>Pallet PL-26-000124</span>
</div>
</td>
<td className="py-3 px-3 font-mono text-on-surface font-medium">0h 22m</td>
<td className="py-3 px-3 font-mono text-on-surface-variant">1h 00m</td>
<td className="py-3 px-3">
<div className="flex flex-col gap-1">
<span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-secondary-container text-on-secondary-container font-label-sm text-[10px] font-bold w-fit">
<span className="material-symbols-outlined text-[12px]">check_circle</span>
                      38m remaining (36%)
                    </span>
<div className="w-full bg-surface-container-high h-1.5 rounded-full overflow-hidden">
<div className="bg-secondary h-full rounded-full" style={{"width":"36%"}}></div>
</div>
</div>
</td>
<td className="py-3 px-3 text-right">
<button className="min-h-[44px] min-w-[44px] px-3 py-1.5 rounded bg-surface-container hover:bg-surface-container-high text-on-surface-variant font-body-sm text-body-sm font-semibold inline-flex items-center justify-center transition-colors">
                    Inspect
                  </button>
</td>
</tr>
{/*  Row 6: OK (23%)  */}
<tr className="hover:bg-surface-container-low transition-colors">
<td className="py-3 px-3">
<div className="flex flex-col">
<span className="font-semibold text-on-surface">Adalimumab 40 mg/0.8 mL</span>
<span className="font-caption text-caption text-on-surface-variant">Autoinjector Pack</span>
</div>
</td>
<td className="py-3 px-3 font-mono font-label-sm text-label-sm">
<div className="flex flex-col">
<span className="text-primary font-bold">LT-26A021</span>
<span className="text-on-surface-variant">B260121</span>
</div>
</td>
<td className="py-3 px-3">
<div className="flex items-center gap-1.5 text-on-surface">
<span className="material-symbols-outlined text-[16px] text-secondary">transfer_within_a_station</span>
<span>Filling transfer</span>
</div>
</td>
<td className="py-3 px-3 font-mono text-on-surface font-medium">0h 14m</td>
<td className="py-3 px-3 font-mono text-on-surface-variant">1h 00m</td>
<td className="py-3 px-3">
<div className="flex flex-col gap-1">
<span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-secondary-container text-on-secondary-container font-label-sm text-[10px] font-bold w-fit">
<span className="material-symbols-outlined text-[12px]">check_circle</span>
                      46m remaining (23%)
                    </span>
<div className="w-full bg-surface-container-high h-1.5 rounded-full overflow-hidden">
<div className="bg-secondary h-full rounded-full" style={{"width":"23%"}}></div>
</div>
</div>
</td>
<td className="py-3 px-3 text-right">
<button className="min-h-[44px] min-w-[44px] px-3 py-1.5 rounded bg-surface-container hover:bg-surface-container-high text-on-surface-variant font-body-sm text-body-sm font-semibold inline-flex items-center justify-center transition-colors">
                    Inspect
                  </button>
</td>
</tr>
</tbody>
</table>
</div>
{/*  Footer Audit Note  */}
<div className="px-space-md py-2.5 bg-surface-container-low flex flex-wrap items-center justify-between gap-space-xs">
<div className="flex items-center gap-2 font-caption text-caption text-on-surface-variant">
<span className="material-symbols-outlined text-[15px] text-secondary">verified</span>
<span>All monitored intervals comply with SOP-PTS-041 (Hold Time Verification in Packing Cleanrooms).</span>
</div>
<span className="font-label-sm text-label-sm text-on-surface-variant font-mono">Total Lots Active: 6 displayed</span>
</div>
</div>
{/*  Quick Regulatory Reference Box  */}
<div className="p-space-md rounded-xl bg-surface-container shadow-sm flex items-center justify-between gap-space-md">
<div className="flex items-center gap-space-sm">
<div className="w-9 h-9 rounded-lg bg-primary text-on-primary flex items-center justify-center shrink-0">
<span className="material-symbols-outlined text-[20px]">policy</span>
</div>
<div className="flex flex-col">
<span className="font-headline-sm text-body-md font-semibold text-on-surface">QA Release Deviation Trigger Notice</span>
<span className="font-caption text-caption text-on-surface-variant">Any excursion above +0h 00m requires an immediate CAPA log, root-cause tagging, and Department HOD digital countersignature prior to batch progression.</span>
</div>
</div>
<button className="min-h-[44px] px-3 py-2 rounded-lg bg-surface-container-lowest text-primary font-body-sm text-body-sm font-semibold hover:bg-surface-container-low transition-colors shrink-0">
          View Protocol SOP-GMP-088
        </button>
</div>
</div>
{/*  RIGHT NARROW COLUMN: Queue & Deviation Bar Chart (4 cols)  */}
<div className="xl:col-span-4 flex flex-col gap-space-md">
{/*  Section 1: Awaiting My Review / Approval (Replacing Quick Actions)  */}
<div className="rounded-xl bg-surface-container-lowest shadow-sm overflow-hidden flex flex-col">
<div className="p-space-md bg-surface-container-lowest flex items-center justify-between">
<div className="flex items-center gap-2">
<span className="material-symbols-outlined text-secondary text-[22px]">pending_actions</span>
<h3 className="font-headline-sm text-headline-sm text-on-surface font-semibold">Awaiting My Review</h3>
</div>
<span className="px-2.5 py-0.5 rounded-full bg-error-container text-on-error-container font-label-sm text-label-sm font-bold">
            3 Pending Sign-offs
          </span>
</div>
<div className="p-space-md flex flex-col gap-space-sm pt-0">
{/*  Card 1: Urgent Deviation Review  */}
<div className="p-3 rounded-lg bg-error-container/20 flex flex-col gap-2 relative">
<div className="flex items-center justify-between">
<span className="font-label-sm text-label-sm font-bold text-error font-mono flex items-center gap-1">
<span className="w-2 h-2 rounded-full bg-error animate-ping"></span>
                BND-2025-084
              </span>
<span className="px-2 py-0.5 rounded bg-error text-on-error font-label-sm text-[10px] font-bold uppercase tracking-wider">
                Urgent Review
              </span>
</div>
<div className="flex flex-col">
<span className="font-body-md text-body-md font-semibold text-on-surface">Filgrastim 300 mcg/0.5 mL</span>
<div className="flex items-center gap-2 font-label-sm text-label-sm font-mono text-on-surface-variant">
<span>Lot: <strong>LT-26A014</strong></span>
<span>•</span>
<span>Batch: <strong>B260114</strong></span>
</div>
</div>
<div className="p-2 rounded bg-surface-container-lowest font-caption text-[11px] text-error flex items-start gap-1.5">
<span className="material-symbols-outlined text-[14px] shrink-0 mt-0.5">report_problem</span>
<span>Hold-time excursion deviation attached (+4m). QA countersignature required for quarantine waiver.</span>
</div>
<div className="flex items-center justify-between text-on-surface-variant font-caption text-caption pt-1">
<span>Initiated by: <strong>Anita Shah</strong></span>
<span>26/02 14:15</span>
</div>
<button className="min-h-[44px] w-full mt-1 px-4 py-2 rounded-lg bg-primary-container text-on-primary font-body-sm text-body-sm font-semibold flex items-center justify-center gap-2 shadow-sm hover:opacity-95 transition-all cursor-pointer">
<span className="material-symbols-outlined text-[18px]">draw</span>
<span>Review &amp; Sign</span>
</button>
</div>
{/*  Card 2: Stage 2 Inspection Release  */}
<div className="p-3 rounded-lg bg-surface-container-low flex flex-col gap-2">
<div className="flex items-center justify-between">
<span className="font-label-sm text-label-sm font-bold text-primary font-mono">BND-2025-081</span>
<span className="px-2 py-0.5 rounded bg-surface-container-highest text-on-surface-variant font-label-sm text-[10px] font-semibold uppercase">
                Stage 2 Inspection
              </span>
</div>
<div className="flex flex-col">
<span className="font-body-md text-body-md font-semibold text-on-surface">Insulin Glargine 100 IU/mL</span>
<div className="flex items-center gap-2 font-label-sm text-label-sm font-mono text-on-surface-variant">
<span>Lot: <strong>LT-26A017</strong></span>
<span>•</span>
<span>Batch: <strong>B260117</strong></span>
</div>
</div>
<div className="flex items-center justify-between text-on-surface-variant font-caption text-caption pt-1">
<span>Initiated by: <strong>Anita Shah</strong></span>
<span>26/02 12:40</span>
</div>
<button className="min-h-[44px] w-full mt-1 px-4 py-2 rounded-lg bg-surface-container-lowest text-primary font-body-sm text-body-sm font-semibold flex items-center justify-center gap-2 hover:bg-surface-container transition-colors cursor-pointer">
<span className="material-symbols-outlined text-[18px]">draw</span>
<span>Review &amp; Sign</span>
</button>
</div>
{/*  Card 3: Cold Chain Transfer  */}
<div className="p-3 rounded-lg bg-surface-container-low flex flex-col gap-2">
<div className="flex items-center justify-between">
<span className="font-label-sm text-label-sm font-bold text-primary font-mono">BND-2025-079</span>
<span className="px-2 py-0.5 rounded bg-surface-container-highest text-on-surface-variant font-label-sm text-[10px] font-semibold uppercase">
                Cold Chain Transfer
              </span>
</div>
<div className="flex flex-col">
<span className="font-body-md text-body-md font-semibold text-on-surface">Adalimumab 40 mg/0.8 mL</span>
<div className="flex items-center gap-2 font-label-sm text-label-sm font-mono text-on-surface-variant">
<span>Lot: <strong>LT-26A018</strong></span>
<span>•</span>
<span>Batch: <strong>B260118</strong></span>
</div>
</div>
<div className="flex items-center justify-between text-on-surface-variant font-caption text-caption pt-1">
<span>Initiated by: <strong>Anita Shah</strong></span>
<span>26/02 11:20</span>
</div>
<button className="min-h-[44px] w-full mt-1 px-4 py-2 rounded-lg bg-surface-container-lowest text-primary font-body-sm text-body-sm font-semibold flex items-center justify-center gap-2 hover:bg-surface-container transition-colors cursor-pointer">
<span className="material-symbols-outlined text-[18px]">draw</span>
<span>Review &amp; Sign</span>
</button>
</div>
</div>
</div>
{/*  Section 2: Bar Chart Card "Hold-Time Deviations Per Week"  */}
<div className="p-space-md rounded-xl bg-surface-container-lowest shadow-sm flex flex-col gap-space-sm">
<div className="flex items-center justify-between">
<div className="flex flex-col">
<h3 className="font-headline-sm text-headline-sm text-on-surface font-semibold">Hold-Time Deviations / Week</h3>
<span className="font-caption text-caption text-on-surface-variant">Past 6 rolling production cycles (W03–W08)</span>
</div>
<span className="material-symbols-outlined text-secondary text-[20px]">bar_chart</span>
</div>
{/*  SVG Micro Chart  */}
<div className="relative w-full h-40 pt-4 flex flex-col justify-end">
{/*  Dotted Target Benchmark Line  */}
<div className="absolute inset-x-0 top-1/2 flex items-center justify-between pointer-events-none z-10">
<div className="w-full border-b border-dashed border-tertiary-container/60"></div>
<span className="px-1.5 py-0.5 rounded bg-surface-container-high text-tertiary font-label-sm text-[9px] font-mono whitespace-nowrap ml-2">GMP Target ≤ 1/wk</span>
</div>
{/*  Weekly Columns Graphic  */}
<div className="grid grid-cols-6 items-end gap-2 h-28 relative z-0">
{/*  W03 (0)  */}
<div className="flex flex-col items-center gap-1.5 h-full justify-end">
<span className="font-label-sm text-[10px] text-on-surface-variant font-mono">0</span>
<div className="w-full bg-surface-container-low rounded-t min-h-[4px]"></div>
<span className="font-label-sm text-[10px] text-on-surface-variant font-mono">W03</span>
</div>
{/*  W04 (1)  */}
<div className="flex flex-col items-center gap-1.5 h-full justify-end">
<span className="font-label-sm text-[10px] text-on-surface font-mono font-semibold">1</span>
<div className="w-full bg-secondary rounded-t h-[25%]"></div>
<span className="font-label-sm text-[10px] text-on-surface-variant font-mono">W04</span>
</div>
{/*  W05 (2)  */}
<div className="flex flex-col items-center gap-1.5 h-full justify-end">
<span className="font-label-sm text-[10px] text-tertiary font-mono font-semibold">2</span>
<div className="w-full bg-tertiary-container rounded-t h-[50%]"></div>
<span className="font-label-sm text-[10px] text-on-surface-variant font-mono">W05</span>
</div>
{/*  W06 (0)  */}
<div className="flex flex-col items-center gap-1.5 h-full justify-end">
<span className="font-label-sm text-[10px] text-on-surface-variant font-mono">0</span>
<div className="w-full bg-surface-container-low rounded-t min-h-[4px]"></div>
<span className="font-label-sm text-[10px] text-on-surface-variant font-mono">W06</span>
</div>
{/*  W07 (1)  */}
<div className="flex flex-col items-center gap-1.5 h-full justify-end">
<span className="font-label-sm text-[10px] text-on-surface font-mono font-semibold">1</span>
<div className="w-full bg-secondary rounded-t h-[25%]"></div>
<span className="font-label-sm text-[10px] text-on-surface-variant font-mono">W07</span>
</div>
{/*  W08 (Current - Active Deviation)  */}
<div className="flex flex-col items-center gap-1.5 h-full justify-end">
<span className="font-label-sm text-[10px] text-error font-mono font-bold">1</span>
<div className="w-full bg-error rounded-t h-[25%] shadow-sm animate-pulse"></div>
<span className="font-label-sm text-[10px] text-error font-mono font-bold">W08*</span>
</div>
</div>
</div>
<div className="p-2 rounded-lg bg-surface-container flex items-center justify-between mt-1">
<div className="flex items-center gap-1.5">
<span className="w-2 h-2 rounded-full bg-secondary"></span>
<span className="font-label-sm text-label-sm text-on-surface font-mono font-medium">Avg 0.8 / week</span>
</div>
<span className="px-2 py-0.5 rounded bg-surface-container-highest text-secondary font-label-sm text-[10px] font-bold font-mono">100% CAPA CLOSED</span>
</div>
</div>
</div>
</div>
</div>

    </AppLayout>
  );
}
