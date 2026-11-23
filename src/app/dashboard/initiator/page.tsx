"use client";

import React from "react";
import Link from "next/link";
import AppLayout from "@/components/layout/AppLayout";

export default function InitiatorDashboardPage() {
  return (
    <AppLayout screenCode="S05">
      <div className="flex flex-col w-full pb-12">
{/*  Top Section / Breadcrumb & Header  */}
<div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 py-4 mb-2">
<div className="flex flex-col gap-1">
<nav className="flex items-center gap-1.5 font-label-sm text-label-sm text-on-surface-variant font-mono">
<span className="hover:text-primary cursor-pointer transition-colors">HOME</span>
<span className="text-outline-variant">/</span>
<span className="hover:text-primary cursor-pointer transition-colors">PACKING LINE 04</span>
<span className="text-outline-variant">/</span>
<span className="text-primary font-semibold">INITIATOR WORKSTATION</span>
</nav>
<div className="flex items-baseline gap-3 mt-1">
<h1 className="font-headline-lg text-headline-lg text-on-surface font-semibold tracking-tight">S05 Initiator Dashboard</h1>
<span className="px-2 py-0.5 rounded bg-primary-fixed text-on-primary-fixed font-label-sm text-label-sm uppercase tracking-wider font-semibold">Live Mode</span>
</div>
<p className="font-body-sm text-body-sm text-on-surface-variant max-w-2xl">
        Real-time lot tracking, cleanroom movement execution, and stage hold-time compliance monitoring under 21 CFR Part 11 protocols.
      </p>
</div>
{/*  Quick Action Buttons (Min 44px Touch Targets)  */}
<div className="flex flex-wrap items-center gap-2.5">
<button className="min-h-[44px] px-3.5 py-2 rounded-lg bg-surface-container-lowest hover:bg-surface-container border border-outline-variant/60 text-primary font-headline-sm text-body-md font-semibold transition-all flex items-center gap-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-primary" type="button">
<span className="material-symbols-outlined text-[18px]">add</span>
<span>New Binder</span>
</button>
<button className="min-h-[44px] px-3.5 py-2 rounded-lg bg-surface-container-lowest hover:bg-surface-container border border-outline-variant/60 text-secondary font-headline-sm text-body-md font-semibold transition-all flex items-center gap-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-secondary" type="button">
<span className="material-symbols-outlined text-[18px]">ac_unit</span>
<span>Load into Cold Room</span>
</button>
<button className="min-h-[44px] px-4 py-2 rounded-lg bg-primary-container hover:bg-primary text-on-primary font-headline-sm text-body-md font-semibold transition-all flex items-center gap-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-container focus:ring-offset-2" type="button">
<span className="material-symbols-outlined text-[18px]">output</span>
<span>Unload Cold Room</span>
</button>
</div>
</div>
{/*  Prominent Quick Barcode Scanning Module  */}
<section className="bg-surface-container-lowest border border-outline-variant/50 rounded-xl p-4 mb-5 shadow-sm">
<div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-3 border-b border-surface-container-high">
<div className="flex items-center gap-2">
<div className="w-8 h-8 rounded-lg bg-secondary-container/40 flex items-center justify-center text-primary">
<span className="material-symbols-outlined text-[20px]">barcode_scanner</span>
</div>
<div>
<span className="font-headline-sm text-body-md font-semibold text-on-surface">Universal Cleanroom Scanner</span>
<span className="block font-caption text-caption text-on-surface-variant">Immediate lot, pallet, or sterile bin lookup with auto-binder linkage</span>
</div>
</div>
<div className="flex items-center gap-2">
<span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 font-label-sm text-label-sm">
<span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
<span>Ready (HoneyWell Xenon XP 1950g - Station #04)</span>
</span>
</div>
</div>
<div className="pt-3 flex flex-col lg:flex-row items-stretch gap-3">
<div className="relative flex-1">
<div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-on-surface-variant">
<span className="material-symbols-outlined text-[20px]">qr_code_2</span>
</div>
<input className="w-full min-h-[44px] pl-10 pr-32 bg-surface-container-low/70 border border-outline-variant/60 rounded-lg text-on-surface font-label-md text-label-lg focus:bg-surface-container-lowest focus:border-primary-container focus:ring-1 focus:ring-primary-container outline-none transition-all placeholder:text-on-surface-variant/70 font-mono" id="barcodeInput" placeholder="Scan 2D DataMatrix or enter barcode (e.g. PL-26-000124, LT-26A017)..." type="text"/>
<div className="absolute inset-y-0 right-2 flex items-center">
<kbd className="hidden sm:inline-flex items-center px-1.5 py-0.5 rounded border border-outline-variant/50 bg-surface-container font-label-sm text-[10px] text-on-surface-variant font-mono">ENTER</kbd>
</div>
</div>
<div className="flex items-center gap-2">
<button className="min-h-[44px] px-5 py-2 rounded-lg bg-primary-container hover:bg-primary text-on-primary font-headline-sm text-body-md font-semibold transition-all flex items-center justify-center gap-2 shrink-0 shadow-sm" id="btnSubmitScan" type="button">
<span className="material-symbols-outlined text-[18px]">sensors</span>
<span>Submit Scan</span>
</button>
</div>
</div>
{/*  Quick filter chips  */}
<div className="flex flex-wrap items-center gap-2 pt-3">
<span className="font-caption text-caption text-on-surface-variant uppercase tracking-wider font-semibold mr-1">Scan Context:</span>
<button className="filter-chip active min-h-[32px] px-3 py-1 rounded-md text-on-primary bg-primary font-label-sm text-label-sm font-semibold transition-colors" type="button">All Scans</button>
<button className="filter-chip min-h-[32px] px-3 py-1 rounded-md text-on-surface-variant bg-surface-container-low hover:bg-surface-container hover:text-on-surface font-label-sm text-label-sm transition-colors border border-outline-variant/40" type="button">Pallet (PL)</button>
<button className="filter-chip min-h-[32px] px-3 py-1 rounded-md text-on-surface-variant bg-surface-container-low hover:bg-surface-container hover:text-on-surface font-label-sm text-label-sm transition-colors border border-outline-variant/40" type="button">Rack (RK)</button>
<button className="filter-chip min-h-[32px] px-3 py-1 rounded-md text-on-surface-variant bg-surface-container-low hover:bg-surface-container hover:text-on-surface font-label-sm text-label-sm transition-colors border border-outline-variant/40" type="button">Vial Tray (VT)</button>
<button className="filter-chip min-h-[32px] px-3 py-1 rounded-md text-on-surface-variant bg-surface-container-low hover:bg-surface-container hover:text-on-surface font-label-sm text-label-sm transition-colors border border-outline-variant/40" type="button">Lot Master (LT)</button>
</div>
</section>
{/*  4 KPI Metric Cards  */}
<section className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-5">
{/*  KPI 1  */}
<div className="bg-surface-container-lowest border border-outline-variant/50 rounded-xl p-4 flex flex-col justify-between shadow-sm relative overflow-hidden group hover:border-primary/40 transition-colors">
<div className="flex items-start justify-between">
<div>
<span className="font-caption text-caption uppercase tracking-wider text-on-surface-variant font-bold">Products in Cold Rooms</span>
<div className="flex items-baseline gap-2 mt-1">
<span className="font-headline-xl text-headline-xl font-bold text-on-surface">18</span>
<span className="font-label-sm text-label-sm font-semibold text-secondary font-mono">BINS</span>
</div>
</div>
<div className="w-10 h-10 rounded-lg bg-secondary-fixed/50 flex items-center justify-center text-primary">
<span className="material-symbols-outlined text-[22px]">ac_unit</span>
</div>
</div>
<div className="mt-3 pt-3 border-t border-surface-container-high/60 flex items-center justify-between text-on-surface-variant font-body-sm text-body-sm">
<span className="flex items-center gap-1">
<span className="w-1.5 h-1.5 rounded-full bg-secondary"></span>
          CR-01 &amp; CR-02 (84% cap)
        </span>
<span className="font-mono text-label-sm font-medium">4 Racks</span>
</div>
</div>
{/*  KPI 2  */}
<div className="bg-surface-container-lowest border border-amber-300/80 rounded-xl p-4 flex flex-col justify-between shadow-sm relative overflow-hidden group hover:border-amber-400 transition-colors">
<div className="flex items-start justify-between">
<div>
<span className="font-caption text-caption uppercase tracking-wider text-amber-900 font-bold">Hold-Time Warnings</span>
<div className="flex items-baseline gap-2 mt-1">
<span className="font-headline-xl text-headline-xl font-bold text-amber-700">3</span>
<span className="px-2 py-0.5 rounded bg-amber-100 text-amber-800 font-label-sm text-[10px] font-bold uppercase tracking-wider">Amber Alert</span>
</div>
</div>
<div className="w-10 h-10 rounded-lg bg-amber-50 flex items-center justify-center text-amber-600 border border-amber-200">
<span className="material-symbols-outlined text-[22px]">hourglass_top</span>
</div>
</div>
<div className="mt-3 pt-3 border-t border-amber-100 flex items-center justify-between text-amber-800 font-body-sm text-body-sm">
<span className="flex items-center gap-1 font-medium">
<span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
          ≥80% stage window utilized
        </span>
<span className="font-mono text-label-sm text-amber-700 font-semibold">&lt;15m left</span>
</div>
</div>
{/*  KPI 3  */}
<div className="bg-surface-container-lowest border border-error/50 rounded-xl p-4 flex flex-col justify-between shadow-sm relative overflow-hidden group hover:border-error transition-colors ring-1 ring-error/20">
<div className="flex items-start justify-between">
<div>
<span className="font-caption text-caption uppercase tracking-wider text-error font-bold">Hold-Time EXCEEDED</span>
<div className="flex items-baseline gap-2 mt-1">
<span className="font-headline-xl text-headline-xl font-bold text-error">1</span>
<span className="px-2 py-0.5 rounded bg-error-container text-on-error-container font-label-sm text-[10px] font-bold uppercase tracking-wider flex items-center gap-1">
<span className="w-1.5 h-1.5 rounded-full bg-error animate-ping"></span>
              Critical
            </span>
</div>
</div>
<div className="w-10 h-10 rounded-lg bg-error-container/50 flex items-center justify-center text-error border border-error/30 animate-pulse">
<span className="material-symbols-outlined text-[22px]">error</span>
</div>
</div>
<div className="mt-3 pt-3 border-t border-error/15 flex items-center justify-between text-on-error-container font-body-sm text-body-sm">
<span className="truncate font-medium">SOP-GMP-088 triggered</span>
<span className="font-label-sm text-label-sm font-semibold text-error shrink-0">QA Notified</span>
</div>
</div>
{/*  KPI 4  */}
<div className="bg-surface-container-lowest border border-outline-variant/50 rounded-xl p-4 flex flex-col justify-between shadow-sm relative overflow-hidden group hover:border-primary/40 transition-colors">
<div className="flex items-start justify-between">
<div>
<span className="font-caption text-caption uppercase tracking-wider text-on-surface-variant font-bold">Movements Today</span>
<div className="flex items-baseline gap-2 mt-1">
<span className="font-headline-xl text-headline-xl font-bold text-on-surface">7</span>
<span className="font-label-sm text-label-sm text-emerald-700 font-semibold font-mono flex items-center gap-0.5">
<span className="material-symbols-outlined text-[14px]">arrow_upward</span>100% Validated
            </span>
</div>
</div>
<div className="w-10 h-10 rounded-lg bg-surface-container flex items-center justify-center text-tertiary">
<span className="material-symbols-outlined text-[22px]">swap_horiz</span>
</div>
</div>
<div className="mt-3 pt-3 border-t border-surface-container-high/60 flex items-center justify-between text-on-surface-variant font-body-sm text-body-sm">
<span className="truncate">Last recorded 12 mins ago</span>
<span className="font-mono text-label-sm text-primary font-semibold">A. Shah</span>
</div>
</div>
</section>
{/*  Main Split Layout (Wide 8-cols + Narrow 4-cols)  */}
<div className="grid grid-cols-1 xl:grid-cols-12 gap-5 items-start">
{/*  LEFT COLUMN: Hold-Time Watchlist (8 cols)  */}
<section className="xl:col-span-8 flex flex-col gap-4">
<div className="bg-surface-container-lowest border border-outline-variant/50 rounded-xl shadow-sm overflow-hidden flex flex-col">
{/*  Card Header with Controls  */}
<div className="p-4 border-b border-outline-variant/40 flex flex-col md:flex-row md:items-center justify-between gap-3 bg-surface-container-low/30">
<div className="flex items-center gap-2.5">
<div className="w-2.5 h-2.5 rounded-full bg-error"></div>
<div>
<div className="flex items-center gap-2">
<h2 className="font-headline-sm text-headline-sm text-on-surface font-semibold">Hold-time Watchlist</h2>
<span className="px-2 py-0.5 rounded bg-surface-container-high border border-outline-variant/60 font-label-sm text-[11px] text-on-surface-variant font-mono">
                  Sorted by least time remaining
                </span>
</div>
<p className="font-caption text-caption text-on-surface-variant mt-0.5">Automated countdown clocks under validated Master Batch Records</p>
</div>
</div>
<div className="flex items-center gap-2">
<div className="relative">
<span className="material-symbols-outlined text-[18px] text-on-surface-variant absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none">search</span>
<input className="min-h-[36px] pl-8 pr-3 bg-surface-container-lowest border border-outline-variant/60 rounded-md text-on-surface font-body-sm text-body-sm focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary w-44 lg:w-56" placeholder="Filter watchlist..." type="text"/>
</div>
<button className="min-h-[36px] min-w-[36px] rounded-md border border-outline-variant/60 hover:bg-surface-container flex items-center justify-center text-on-surface-variant transition-colors" title="Export Watchlist CSV">
<span className="material-symbols-outlined text-[18px]">download</span>
</button>
<button className="min-h-[36px] min-w-[36px] rounded-md border border-outline-variant/60 hover:bg-surface-container flex items-center justify-center text-on-surface-variant transition-colors" title="Refresh Timers">
<span className="material-symbols-outlined text-[18px]">refresh</span>
</button>
</div>
</div>
{/*  Table Container  */}
<div className="overflow-x-auto w-full">
<table className="w-full text-left border-collapse">
<thead>
<tr className="border-b border-outline-variant/40 bg-surface-container-low font-caption text-caption uppercase tracking-wider text-on-surface-variant font-semibold select-none">
<th className="py-2.5 px-3 min-w-[190px]">Product</th>
<th className="py-2.5 px-2.5 min-w-[100px]">Lot / Batch</th>
<th className="py-2.5 px-3 min-w-[160px]">Current Location</th>
<th className="py-2.5 px-2.5 min-w-[130px]">Stage / Rule</th>
<th className="py-2.5 px-2.5 min-w-[80px]">Elapsed</th>
<th className="py-2.5 px-3 min-w-[170px]">Hold-Time Compliance</th>
<th className="py-2.5 px-3 text-right min-w-[110px]">Action</th>
</tr>
</thead>
<tbody className="divide-y divide-outline-variant/30 font-body-sm text-body-sm">
{/*  Row 1: EXCEEDED (Critical Deviation)  */}
<tr className="bg-red-50/50 hover:bg-red-50 transition-colors border-l-4 border-l-error">
<td className="py-3 px-3">
<div className="flex items-center gap-2">
<span className="material-symbols-outlined text-error text-[18px] shrink-0">emergency_home</span>
<div>
<span className="font-semibold text-on-surface block leading-tight">Filgrastim 300 mcg/0.5 mL</span>
<span className="font-caption text-caption text-on-surface-variant font-mono">PFS Format • 10x Pack</span>
</div>
</div>
</td>
<td className="py-3 px-2.5">
<div className="flex flex-col font-mono text-label-sm">
<span className="font-semibold text-primary">LT-26A014</span>
<span className="text-on-surface-variant">B260114</span>
</div>
</td>
<td className="py-3 px-3">
<div className="flex items-center gap-1.5 font-mono text-label-sm text-on-surface">
<span className="material-symbols-outlined text-[16px] text-on-surface-variant">meeting_room</span>
<span>Line 04 Inspection Buffer</span>
</div>
</td>
<td className="py-3 px-2.5">
<span className="inline-flex items-center px-2 py-0.5 rounded bg-surface-container font-caption text-caption text-on-surface-variant font-medium">
                    Visual inspection
                  </span>
</td>
<td className="py-3 px-2.5 font-mono font-bold text-error">
                  1h 04m
                  <span className="block font-caption text-[10px] text-on-surface-variant font-normal">Limit: 1h 00m</span>
</td>
<td className="py-3 px-3">
<div className="flex flex-col gap-1 w-full max-w-[160px]">
<div className="flex items-center justify-between text-caption font-bold text-error font-mono">
<span>+4m OVERDUE</span>
<span>106%</span>
</div>
<div className="w-full h-2 rounded-full bg-error-container overflow-hidden">
<div className="h-full bg-error rounded-full w-full"></div>
</div>
<span className="font-caption text-[10px] text-error font-semibold uppercase tracking-wider flex items-center gap-0.5">
<span className="material-symbols-outlined text-[12px]">warning</span> Dev SOP-088 Open
                    </span>
</div>
</td>
<td className="py-3 px-3 text-right">
<button className="min-h-[44px] px-3 py-1.5 rounded-md bg-error text-on-error hover:bg-error/90 font-headline-sm text-body-sm font-semibold transition-all inline-flex items-center gap-1 shadow-sm" type="button">
<span>Log QA Dev</span>
<span className="material-symbols-outlined text-[16px]">chevron_right</span>
</button>
</td>
</tr>
{/*  Row 2: WARNING 90%  */}
<tr className="hover:bg-amber-50/40 transition-colors border-l-4 border-l-amber-500">
<td className="py-3 px-3">
<div className="flex items-center gap-2">
<span className="material-symbols-outlined text-amber-600 text-[18px] shrink-0">vaccines</span>
<div>
<span className="font-semibold text-on-surface block leading-tight">Insulin Glargine 100 IU/mL</span>
<span className="font-caption text-caption text-on-surface-variant font-mono">Cartridge 3 mL • SoloStar</span>
</div>
</div>
</td>
<td className="py-3 px-2.5">
<div className="flex flex-col font-mono text-label-sm">
<span className="font-semibold text-primary">LT-26A017</span>
<span className="text-on-surface-variant">B260117</span>
</div>
</td>
<td className="py-3 px-3">
<div className="flex items-center gap-1.5 font-mono text-label-sm text-on-surface">
<span className="material-symbols-outlined text-[16px] text-secondary">warehouse</span>
<span>CR-01 / RK-CR01-001</span>
</div>
</td>
<td className="py-3 px-2.5">
<span className="inline-flex items-center px-2 py-0.5 rounded bg-surface-container font-caption text-caption text-on-surface-variant font-medium">
                    Cold room storage
                  </span>
</td>
<td className="py-3 px-2.5 font-mono font-bold text-amber-700">
                  0h 54m
                  <span className="block font-caption text-[10px] text-on-surface-variant font-normal">Limit: 1h 00m</span>
</td>
<td className="py-3 px-3">
<div className="flex flex-col gap-1 w-full max-w-[160px]">
<div className="flex items-center justify-between text-caption font-bold text-amber-700 font-mono">
<span>6m remaining</span>
<span>90%</span>
</div>
<div className="w-full h-2 rounded-full bg-amber-100 overflow-hidden">
<div className="h-full bg-amber-500 rounded-full" style={{"width":"90%"}}></div>
</div>
<span className="font-caption text-[10px] text-amber-800 font-medium">Hold-time alert active</span>
</div>
</td>
<td className="py-3 px-3 text-right">
<button className="min-h-[44px] px-3 py-1.5 rounded-md border border-outline-variant/60 hover:bg-surface-container text-primary font-headline-sm text-body-sm font-semibold transition-all inline-flex items-center gap-1" type="button">
<span>Unload CR</span>
<span className="material-symbols-outlined text-[16px]">output</span>
</button>
</td>
</tr>
{/*  Row 3: WARNING 85%  */}
<tr className="hover:bg-amber-50/40 transition-colors border-l-4 border-l-amber-500">
<td className="py-3 px-3">
<div className="flex items-center gap-2">
<span className="material-symbols-outlined text-amber-600 text-[18px] shrink-0">biotech</span>
<div>
<span className="font-semibold text-on-surface block leading-tight">Adalimumab 40 mg/0.8 mL</span>
<span className="font-caption text-caption text-on-surface-variant font-mono">Autoinjector Pen</span>
</div>
</div>
</td>
<td className="py-3 px-2.5">
<div className="flex flex-col font-mono text-label-sm">
<span className="font-semibold text-primary">LT-26A018</span>
<span className="text-on-surface-variant">B260118</span>
</div>
</td>
<td className="py-3 px-3">
<div className="flex items-center gap-1.5 font-mono text-label-sm text-on-surface">
<span className="material-symbols-outlined text-[16px] text-on-surface-variant">pallet</span>
<span>Pallet PL-26-000124</span>
</div>
</td>
<td className="py-3 px-2.5">
<span className="inline-flex items-center px-2 py-0.5 rounded bg-surface-container font-caption text-caption text-on-surface-variant font-medium">
                    Packing buffer
                  </span>
</td>
<td className="py-3 px-2.5 font-mono font-bold text-amber-700">
                  0h 51m
                  <span className="block font-caption text-[10px] text-on-surface-variant font-normal">Limit: 1h 00m</span>
</td>
<td className="py-3 px-3">
<div className="flex flex-col gap-1 w-full max-w-[160px]">
<div className="flex items-center justify-between text-caption font-bold text-amber-700 font-mono">
<span>9m remaining</span>
<span>85%</span>
</div>
<div className="w-full h-2 rounded-full bg-amber-100 overflow-hidden">
<div className="h-full bg-amber-500 rounded-full" style={{"width":"85%"}}></div>
</div>
<span className="font-caption text-[10px] text-amber-800 font-medium">Stage transition pending</span>
</div>
</td>
<td className="py-3 px-3 text-right">
<button className="min-h-[44px] px-3 py-1.5 rounded-md border border-outline-variant/60 hover:bg-surface-container text-primary font-headline-sm text-body-sm font-semibold transition-all inline-flex items-center gap-1" type="button">
<span>Move</span>
<span className="material-symbols-outlined text-[16px]">arrow_forward</span>
</button>
</td>
</tr>
{/*  Row 4: WARNING 80%  */}
<tr className="hover:bg-amber-50/40 transition-colors border-l-4 border-l-amber-500">
<td className="py-3 px-3">
<div className="flex items-center gap-2">
<span className="material-symbols-outlined text-amber-600 text-[18px] shrink-0">vaccines</span>
<div>
<span className="font-semibold text-on-surface block leading-tight">Insulin Glargine 100 IU/mL</span>
<span className="font-caption text-caption text-on-surface-variant font-mono">Cartridge 3 mL • SoloStar</span>
</div>
</div>
</td>
<td className="py-3 px-2.5">
<div className="flex flex-col font-mono text-label-sm">
<span className="font-semibold text-primary">LT-26A019</span>
<span className="text-on-surface-variant">B260119</span>
</div>
</td>
<td className="py-3 px-3">
<div className="flex items-center gap-1.5 font-mono text-label-sm text-on-surface">
<span className="material-symbols-outlined text-[16px] text-secondary">warehouse</span>
<span>CR-02 / Shelf B-01</span>
</div>
</td>
<td className="py-3 px-2.5">
<span className="inline-flex items-center px-2 py-0.5 rounded bg-surface-container font-caption text-caption text-on-surface-variant font-medium">
                    Filling complete
                  </span>
</td>
<td className="py-3 px-2.5 font-mono font-bold text-amber-700">
                  0h 48m
                  <span className="block font-caption text-[10px] text-on-surface-variant font-normal">Limit: 1h 00m</span>
</td>
<td className="py-3 px-3">
<div className="flex flex-col gap-1 w-full max-w-[160px]">
<div className="flex items-center justify-between text-caption font-bold text-amber-700 font-mono">
<span>12m remaining</span>
<span>80%</span>
</div>
<div className="w-full h-2 rounded-full bg-amber-100 overflow-hidden">
<div className="h-full bg-amber-500 rounded-full" style={{"width":"80%"}}></div>
</div>
<span className="font-caption text-[10px] text-amber-800 font-medium">Warning threshold</span>
</div>
</td>
<td className="py-3 px-3 text-right">
<button className="min-h-[44px] px-3 py-1.5 rounded-md border border-outline-variant/60 hover:bg-surface-container text-primary font-headline-sm text-body-sm font-semibold transition-all inline-flex items-center gap-1" type="button">
<span>Move</span>
<span className="material-symbols-outlined text-[16px]">arrow_forward</span>
</button>
</td>
</tr>
{/*  Row 5: OK 36%  */}
<tr className="hover:bg-surface-container-low transition-colors border-l-4 border-l-emerald-500">
<td className="py-3 px-3">
<div className="flex items-center gap-2">
<span className="material-symbols-outlined text-secondary text-[18px] shrink-0">emergency_home</span>
<div>
<span className="font-semibold text-on-surface block leading-tight">Filgrastim 300 mcg/0.5 mL</span>
<span className="font-caption text-caption text-on-surface-variant font-mono">PFS Format • 5x Pack</span>
</div>
</div>
</td>
<td className="py-3 px-2.5">
<div className="flex flex-col font-mono text-label-sm">
<span className="font-semibold text-primary">LT-26A020</span>
<span className="text-on-surface-variant">B260120</span>
</div>
</td>
<td className="py-3 px-3">
<div className="flex items-center gap-1.5 font-mono text-label-sm text-on-surface">
<span className="material-symbols-outlined text-[16px] text-secondary">warehouse</span>
<span>CR-01 / RK-CR01-004</span>
</div>
</td>
<td className="py-3 px-2.5">
<span className="inline-flex items-center px-2 py-0.5 rounded bg-surface-container font-caption text-caption text-on-surface-variant font-medium">
                    Cold room storage
                  </span>
</td>
<td className="py-3 px-2.5 font-mono text-emerald-800 font-semibold">
                  0h 22m
                  <span className="block font-caption text-[10px] text-on-surface-variant font-normal">Limit: 1h 00m</span>
</td>
<td className="py-3 px-3">
<div className="flex flex-col gap-1 w-full max-w-[160px]">
<div className="flex items-center justify-between text-caption font-semibold text-emerald-700 font-mono">
<span>38m remaining</span>
<span>36%</span>
</div>
<div className="w-full h-2 rounded-full bg-emerald-100 overflow-hidden">
<div className="h-full bg-emerald-600 rounded-full" style={{"width":"36%"}}></div>
</div>
<span className="font-caption text-[10px] text-emerald-800 font-medium">Normal operating window</span>
</div>
</td>
<td className="py-3 px-3 text-right">
<button className="min-h-[44px] px-3 py-1.5 rounded-md hover:bg-surface-container text-on-surface-variant hover:text-on-surface font-headline-sm text-body-sm font-semibold transition-all inline-flex items-center gap-1" type="button">
<span>View Binder</span>
<span className="material-symbols-outlined text-[16px]">folder_open</span>
</button>
</td>
</tr>
{/*  Row 6: OK 23%  */}
<tr className="hover:bg-surface-container-low transition-colors border-l-4 border-l-emerald-500">
<td className="py-3 px-3">
<div className="flex items-center gap-2">
<span className="material-symbols-outlined text-secondary text-[18px] shrink-0">biotech</span>
<div>
<span className="font-semibold text-on-surface block leading-tight">Adalimumab 40 mg/0.8 mL</span>
<span className="font-caption text-caption text-on-surface-variant font-mono">Autoinjector Pen</span>
</div>
</div>
</td>
<td className="py-3 px-2.5">
<div className="flex flex-col font-mono text-label-sm">
<span className="font-semibold text-primary">LT-26A021</span>
<span className="text-on-surface-variant">B260121</span>
</div>
</td>
<td className="py-3 px-3">
<div className="flex items-center gap-1.5 font-mono text-label-sm text-on-surface">
<span className="material-symbols-outlined text-[16px] text-on-surface-variant">meeting_room</span>
<span>Packing Buffer Station 04</span>
</div>
</td>
<td className="py-3 px-2.5">
<span className="inline-flex items-center px-2 py-0.5 rounded bg-surface-container font-caption text-caption text-on-surface-variant font-medium">
                    Packing buffer
                  </span>
</td>
<td className="py-3 px-2.5 font-mono text-emerald-800 font-semibold">
                  0h 14m
                  <span className="block font-caption text-[10px] text-on-surface-variant font-normal">Limit: 1h 00m</span>
</td>
<td className="py-3 px-3">
<div className="flex flex-col gap-1 w-full max-w-[160px]">
<div className="flex items-center justify-between text-caption font-semibold text-emerald-700 font-mono">
<span>46m remaining</span>
<span>23%</span>
</div>
<div className="w-full h-2 rounded-full bg-emerald-100 overflow-hidden">
<div className="h-full bg-emerald-600 rounded-full" style={{"width":"23%"}}></div>
</div>
<span className="font-caption text-[10px] text-emerald-800 font-medium">Normal operating window</span>
</div>
</td>
<td className="py-3 px-3 text-right">
<button className="min-h-[44px] px-3 py-1.5 rounded-md hover:bg-surface-container text-on-surface-variant hover:text-on-surface font-headline-sm text-body-sm font-semibold transition-all inline-flex items-center gap-1" type="button">
<span>View Binder</span>
<span className="material-symbols-outlined text-[16px]">folder_open</span>
</button>
</td>
</tr>
</tbody>
</table>
</div>
{/*  Table Footer / Summary Bar  */}
<div className="p-3 bg-surface-container-low/50 border-t border-outline-variant/40 flex flex-col sm:flex-row items-center justify-between gap-2 text-on-surface-variant font-caption text-caption">
<div className="flex items-center gap-3">
<span>Showing <strong className="text-on-surface">6 active lots</strong> in hold-critical stages</span>
<span className="hidden sm:inline">•</span>
<span className="text-error font-medium flex items-center gap-1">
<span className="w-1.5 h-1.5 rounded-full bg-error"></span>
              1 lot requires supervisor override
            </span>
</div>
<div className="flex items-center gap-2">
<span className="font-mono">Sync cycle: 15s</span>
<button className="min-h-[32px] px-2 py-1 rounded bg-surface-container-lowest border border-outline-variant/50 text-primary font-medium hover:bg-surface-container transition-colors">
              Manage Rules
            </button>
</div>
</div>
</div>
{/*  Quick Batch Stage Progress Overview  */}
<div className="bg-surface-container-lowest border border-outline-variant/50 rounded-xl p-4 shadow-sm">
<div className="flex items-center justify-between mb-3">
<div className="flex items-center gap-2">
<span className="material-symbols-outlined text-primary text-[20px]">linear_scale</span>
<span className="font-headline-sm text-body-md font-semibold text-on-surface">Line 04 Active Packaging Sequence</span>
</div>
<span className="font-label-sm text-label-sm text-on-surface-variant font-mono">Lot: LT-26A017 • Target: 12,000 Packs</span>
</div>
<div className="grid grid-cols-2 md:grid-cols-4 gap-3 pt-1">
<div className="p-2.5 rounded-lg bg-surface-container-low border border-outline-variant/40">
<div className="flex items-center justify-between text-caption font-semibold uppercase text-emerald-800 mb-1">
<span>1. Cold Unload</span>
<span className="material-symbols-outlined text-[16px] text-emerald-600">check_circle</span>
</div>
<div className="font-label-sm font-mono text-on-surface">Completed 14:28</div>
<div className="font-caption text-[10px] text-on-surface-variant mt-0.5">By A. Shah (Verified)</div>
</div>
<div className="p-2.5 rounded-lg bg-primary-fixed/30 border border-primary-container/30">
<div className="flex items-center justify-between text-caption font-semibold uppercase text-primary mb-1">
<span>2. Visual Insp.</span>
<span className="w-2 h-2 rounded-full bg-primary animate-ping"></span>
</div>
<div className="font-label-sm font-mono text-on-surface font-bold">In-Progress (82%)</div>
<div className="font-caption text-[10px] text-on-surface-variant mt-0.5">Station 04-A Camera</div>
</div>
<div className="p-2.5 rounded-lg bg-surface-container-low/50 border border-outline-variant/30 opacity-70">
<div className="flex items-center justify-between text-caption font-semibold uppercase text-on-surface-variant mb-1">
<span>3. Cartoning</span>
<span className="material-symbols-outlined text-[16px]">schedule</span>
</div>
<div className="font-label-sm font-mono text-on-surface-variant">Queued</div>
<div className="font-caption text-[10px] text-on-surface-variant mt-0.5">Line feeder cleared</div>
</div>
<div className="p-2.5 rounded-lg bg-surface-container-low/50 border border-outline-variant/30 opacity-70">
<div className="flex items-center justify-between text-caption font-semibold uppercase text-on-surface-variant mb-1">
<span>4. Final Case Pack</span>
<span className="material-symbols-outlined text-[16px]">schedule</span>
</div>
<div className="font-label-sm font-mono text-on-surface-variant">Pending Step 3</div>
<div className="font-caption text-[10px] text-on-surface-variant mt-0.5">Pallet PL-26-000125</div>
</div>
</div>
</div>
</section>
{/*  RIGHT COLUMN: Recent Movements & Cleanroom Telemetry (4 cols)  */}
<section className="xl:col-span-4 flex flex-col gap-4">
{/*  Environmental & Cold Room Telemetry Widget  */}
<div className="bg-surface-container-lowest border border-outline-variant/50 rounded-xl p-4 shadow-sm">
<div className="flex items-center justify-between pb-3 border-b border-surface-container-high">
<div className="flex items-center gap-2">
<span className="material-symbols-outlined text-secondary text-[20px]">thermostat</span>
<div>
<span className="font-headline-sm text-body-md font-semibold text-on-surface">Cleanroom Telemetry</span>
<span className="block font-caption text-caption text-on-surface-variant">Validated SCADA Stream</span>
</div>
</div>
<span className="inline-flex items-center px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 font-label-sm text-[11px] font-semibold border border-emerald-200">
            CALIBRATED
          </span>
</div>
<div className="grid grid-cols-3 gap-2 pt-3">
<div className="p-2 rounded-lg bg-surface-container-low border border-outline-variant/30 text-center">
<span className="font-caption text-[10px] text-on-surface-variant uppercase font-bold block">CR-01 Temp</span>
<span className="font-headline-sm text-headline-sm font-bold text-on-surface font-mono">4.2°C</span>
<span className="inline-flex items-center gap-0.5 text-emerald-700 font-label-sm text-[10px] font-semibold">
<span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>OK (2-8°)
            </span>
</div>
<div className="p-2 rounded-lg bg-surface-container-low border border-outline-variant/30 text-center">
<span className="font-caption text-[10px] text-on-surface-variant uppercase font-bold block">CR-02 Temp</span>
<span className="font-headline-sm text-headline-sm font-bold text-on-surface font-mono">3.8°C</span>
<span className="inline-flex items-center gap-0.5 text-emerald-700 font-label-sm text-[10px] font-semibold">
<span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>OK (2-8°)
            </span>
</div>
<div className="p-2 rounded-lg bg-surface-container-low border border-outline-variant/30 text-center">
<span className="font-caption text-[10px] text-on-surface-variant uppercase font-bold block">Humidity</span>
<span className="font-headline-sm text-headline-sm font-bold text-on-surface font-mono">42%</span>
<span className="inline-flex items-center gap-0.5 text-emerald-700 font-label-sm text-[10px] font-semibold">
<span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>OK (&lt;50%)
            </span>
</div>
</div>
<div className="mt-3 pt-2 border-t border-surface-container-high/60 flex items-center justify-between text-on-surface-variant font-caption text-[11px]">
<span className="flex items-center gap-1 font-mono">Air Press: 45.2 Pa (Line 04)</span>
<span className="text-secondary font-medium">Log #ENV-2602-04</span>
</div>
</div>
{/*  Recent Movements Activity Feed  */}
<div className="bg-surface-container-lowest border border-outline-variant/50 rounded-xl shadow-sm overflow-hidden flex flex-col">
<div className="p-4 border-b border-outline-variant/40 flex items-center justify-between bg-surface-container-low/30">
<div className="flex items-center gap-2">
<span className="material-symbols-outlined text-primary text-[20px]">history</span>
<div>
<h2 className="font-headline-sm text-body-md font-semibold text-on-surface">Recent Movements (Today)</h2>
<span className="font-caption text-caption text-on-surface-variant">Validated chain-of-custody audit feed</span>
</div>
</div>
<span className="font-label-sm text-label-sm font-mono text-primary font-bold">7 Recorded</span>
</div>
{/*  Activity Timeline  */}
<div className="p-4 flex flex-col gap-3.5 max-h-[580px] overflow-y-auto">
{/*  Movement 1  */}
<div className="flex items-start gap-3 relative pb-3.5 border-b border-surface-container-high/60 last:border-0 last:pb-0">
<div className="w-8 h-8 rounded-full bg-secondary-container/50 border border-secondary/30 flex items-center justify-center text-primary shrink-0 mt-0.5">
<span className="material-symbols-outlined text-[16px]">output</span>
</div>
<div className="flex flex-col flex-1 min-w-0">
<div className="flex items-center justify-between gap-1">
<span className="font-label-sm text-[11px] font-mono text-primary font-bold">26/02/2025 14:28</span>
<span className="px-1.5 py-0.2 rounded bg-surface-container text-on-surface-variant font-mono text-[10px]">CR Unload</span>
</div>
<p className="font-body-sm text-body-sm text-on-surface mt-0.5 leading-snug">
                Unloaded from <strong className="font-mono text-secondary">CR-01 (RK-CR01-001)</strong> to Line 04 Inspection.
              </p>
<div className="flex items-center justify-between gap-2 mt-1 font-caption text-caption text-on-surface-variant">
<span>Anita Shah (Initiator)</span>
<span className="font-mono text-primary font-medium">Batch B260117</span>
</div>
</div>
</div>
{/*  Movement 2  */}
<div className="flex items-start gap-3 relative pb-3.5 border-b border-surface-container-high/60 last:border-0 last:pb-0">
<div className="w-8 h-8 rounded-full bg-surface-container flex items-center justify-center text-secondary shrink-0 mt-0.5">
<span className="material-symbols-outlined text-[16px]">move_to_inbox</span>
</div>
<div className="flex flex-col flex-1 min-w-0">
<div className="flex items-center justify-between gap-1">
<span className="font-label-sm text-[11px] font-mono text-on-surface-variant font-medium">26/02/2025 13:50</span>
<span className="px-1.5 py-0.2 rounded bg-surface-container text-on-surface-variant font-mono text-[10px]">CR Transfer</span>
</div>
<p className="font-body-sm text-body-sm text-on-surface mt-0.5 leading-snug">
                Transferred from Filling Buffer to Cold Room <strong className="font-mono text-secondary">CR-02</strong>.
              </p>
<div className="flex items-center justify-between gap-2 mt-1 font-caption text-caption text-on-surface-variant">
<span>Anita Shah (Initiator)</span>
<span className="font-mono text-primary font-medium">Batch B260118</span>
</div>
</div>
</div>
{/*  Movement 3  */}
<div className="flex items-start gap-3 relative pb-3.5 border-b border-surface-container-high/60 last:border-0 last:pb-0">
<div className="w-8 h-8 rounded-full bg-surface-container flex items-center justify-center text-on-surface-variant shrink-0 mt-0.5">
<span className="material-symbols-outlined text-[16px]">barcode_scanner</span>
</div>
<div className="flex flex-col flex-1 min-w-0">
<div className="flex items-center justify-between gap-1">
<span className="font-label-sm text-[11px] font-mono text-on-surface-variant font-medium">26/02/2025 13:12</span>
<span className="px-1.5 py-0.2 rounded bg-surface-container text-on-surface-variant font-mono text-[10px]">Scan</span>
</div>
<p className="font-body-sm text-body-sm text-on-surface mt-0.5 leading-snug">
                Pallet <strong className="font-mono text-primary">PL-26-000124</strong> barcode scanned at Air Lock AL-03.
              </p>
<div className="flex items-center justify-between gap-2 mt-1 font-caption text-caption text-on-surface-variant">
<span>Anita Shah (Initiator)</span>
<span className="font-mono text-primary font-medium">Batch B260119</span>
</div>
</div>
</div>
{/*  Movement 4  */}
<div className="flex items-start gap-3 relative pb-3.5 border-b border-surface-container-high/60 last:border-0 last:pb-0">
<div className="w-8 h-8 rounded-full bg-emerald-100 border border-emerald-200 flex items-center justify-center text-emerald-800 shrink-0 mt-0.5">
<span className="material-symbols-outlined text-[16px]">verified</span>
</div>
<div className="flex flex-col flex-1 min-w-0">
<div className="flex items-center justify-between gap-1">
<span className="font-label-sm text-[11px] font-mono text-on-surface-variant font-medium">26/02/2025 11:45</span>
<span className="px-1.5 py-0.2 rounded bg-emerald-50 text-emerald-800 font-mono text-[10px]">Sign-off</span>
</div>
<p className="font-body-sm text-body-sm text-on-surface mt-0.5 leading-snug">
                Stage sign-off: Visual inspection verified on Line 04.
              </p>
<div className="flex items-center justify-between gap-2 mt-1 font-caption text-caption text-on-surface-variant">
<span>Anita Shah (Initiator)</span>
<span className="font-mono text-primary font-medium">Batch B260114</span>
</div>
</div>
</div>
{/*  Movement 5  */}
<div className="flex items-start gap-3 relative pb-3.5 border-b border-surface-container-high/60 last:border-0 last:pb-0">
<div className="w-8 h-8 rounded-full bg-surface-container flex items-center justify-center text-secondary shrink-0 mt-0.5">
<span className="material-symbols-outlined text-[16px]">archive</span>
</div>
<div className="flex flex-col flex-1 min-w-0">
<div className="flex items-center justify-between gap-1">
<span className="font-label-sm text-[11px] font-mono text-on-surface-variant font-medium">26/02/2025 10:30</span>
<span className="px-1.5 py-0.2 rounded bg-surface-container text-on-surface-variant font-mono text-[10px]">CR Load</span>
</div>
<p className="font-body-sm text-body-sm text-on-surface mt-0.5 leading-snug">
                Loaded into Cold Room <strong className="font-mono text-secondary">CR-01 (Shelf S-02)</strong>.
              </p>
<div className="flex items-center justify-between gap-2 mt-1 font-caption text-caption text-on-surface-variant">
<span>Anita Shah (Initiator)</span>
<span className="font-mono text-primary font-medium">Batch B260114</span>
</div>
</div>
</div>
{/*  Movement 6  */}
<div className="flex items-start gap-3 relative pb-3.5 border-b border-surface-container-high/60 last:border-0 last:pb-0">
<div className="w-8 h-8 rounded-full bg-surface-container flex items-center justify-center text-on-surface-variant shrink-0 mt-0.5">
<span className="material-symbols-outlined text-[16px]">call_received</span>
</div>
<div className="flex flex-col flex-1 min-w-0">
<div className="flex items-center justify-between gap-1">
<span className="font-label-sm text-[11px] font-mono text-on-surface-variant font-medium">26/02/2025 09:15</span>
<span className="px-1.5 py-0.2 rounded bg-surface-container text-on-surface-variant font-mono text-[10px]">Transfer In</span>
</div>
<p className="font-body-sm text-body-sm text-on-surface mt-0.5 leading-snug">
                Received from Cleanroom Filling Line A (Aseptic Core).
              </p>
<div className="flex items-center justify-between gap-2 mt-1 font-caption text-caption text-on-surface-variant">
<span>Anita Shah (Initiator)</span>
<span className="font-mono text-primary font-medium">Batch B260117</span>
</div>
</div>
</div>
{/*  Movement 7  */}
<div className="flex items-start gap-3 relative last:border-0 last:pb-0">
<div className="w-8 h-8 rounded-full bg-surface-container flex items-center justify-center text-tertiary shrink-0 mt-0.5">
<span className="material-symbols-outlined text-[16px]">tune</span>
</div>
<div className="flex flex-col flex-1 min-w-0">
<div className="flex items-center justify-between gap-1">
<span className="font-label-sm text-[11px] font-mono text-on-surface-variant font-medium">26/02/2025 08:30</span>
<span className="px-1.5 py-0.2 rounded bg-surface-container text-on-surface-variant font-mono text-[10px]">Calibration</span>
</div>
<p className="font-body-sm text-body-sm text-on-surface mt-0.5 leading-snug">
                Daily shift startup scan, scale tare check, and optical verification complete.
              </p>
<div className="flex items-center justify-between gap-2 mt-1 font-caption text-caption text-on-surface-variant">
<span>Anita Shah (Initiator)</span>
<span className="font-mono text-emerald-700 font-medium">Shift Start Validated</span>
</div>
</div>
</div>
</div>
<div className="p-3 bg-surface-container-low/50 border-t border-outline-variant/40 flex items-center justify-between">
<a className="min-h-[44px] w-full flex items-center justify-center gap-1.5 text-primary hover:text-primary-container font-headline-sm text-body-sm font-semibold transition-colors" href="#">
<span>View Complete 21 CFR Part 11 Audit Trail</span>
<span className="material-symbols-outlined text-[16px]">arrow_forward</span>
</a>
</div>
</div>
</section>
</div>
</div>

    </AppLayout>
  );
}
