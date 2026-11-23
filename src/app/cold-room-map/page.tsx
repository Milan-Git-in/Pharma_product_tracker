"use client";

import React from "react";
import Link from "next/link";
import AppLayout from "@/components/layout/AppLayout";

export default function ColdRoomMapPage() {
  return (
    <AppLayout screenCode="S10">
      <div className="flex flex-col w-full">
{/*  Top Breadcrumb & Metadata Strip  */}
<div className="flex flex-wrap items-center justify-between gap-space-sm mb-space-md">
<div className="flex flex-col min-w-0">
<div className="flex items-center gap-space-xs text-on-surface-variant font-caption text-caption uppercase tracking-wider">
<span className="hover:text-primary cursor-pointer transition-colors">Home</span>
<span className="material-symbols-outlined text-[12px]">chevron_right</span>
<span className="hover:text-primary cursor-pointer transition-colors">Trace &amp; Environmental</span>
<span className="material-symbols-outlined text-[12px]">chevron_right</span>
<span className="text-primary font-semibold">Cold Room Chamber Map</span>
</div>
<div className="flex items-baseline gap-space-sm mt-0.5">
<h1 className="font-headline-md text-headline-md text-on-surface font-bold tracking-tight">S10 Cold Room Chamber Map</h1>
<span className="font-label-sm text-label-sm text-secondary bg-surface-container-high px-space-xs py-0.5 rounded">21 CFR §11.10 Verified</span>
</div>
<p className="font-body-sm text-body-sm text-on-surface-variant">Real-time bay &amp; rack capacity, environmental probe telemetry, and physical pallet allocation under audited cleanroom conditions.</p>
</div>
{/*  Right Quick Utilities  */}
<div className="flex items-center gap-space-xs">
<button className="min-h-[44px] px-space-sm rounded bg-surface-container-lowest hover:bg-surface-container-low text-primary-container font-label-md text-label-md font-semibold transition-colors flex items-center gap-space-xs shadow-sm"  type="button">
<span className="material-symbols-outlined text-[18px] text-primary" id="refresh-icon">sync</span>
<span>Refresh Telemetry</span>
</button>
<button className="min-h-[44px] px-space-sm rounded bg-surface-container-lowest hover:bg-surface-container-low text-on-surface font-label-md text-label-md font-medium transition-colors flex items-center gap-space-xs shadow-sm" type="button">
<span className="material-symbols-outlined text-[18px] text-outline">print</span>
<span className="hidden sm:inline">Print Map</span>
</button>
<button className="min-h-[44px] px-space-sm rounded bg-primary-container hover:bg-primary text-on-primary font-label-md text-label-md font-semibold transition-colors flex items-center gap-space-xs shadow-sm" type="button">
<span className="material-symbols-outlined text-[18px]">picture_as_pdf</span>
<span>Export Layout</span>
</button>
</div>
</div>
{/*  Chamber Selector Tabs & Live Telemetry Strip  */}
<div className="bg-surface-container-lowest rounded-lg p-space-sm shadow-sm mb-space-md">
<div className="flex flex-col lg:flex-row lg:items-center justify-between gap-space-md">
{/*  Chamber Tabs  */}
<div className="flex items-center gap-space-xs bg-surface-container-low p-1 rounded">
<button className="min-h-[44px] px-space-md rounded bg-surface-container-lowest text-primary-container font-label-md text-label-md font-bold shadow-sm flex items-center gap-space-xs transition-all" id="tab-cr01" type="button">
<span className="w-2.5 h-2.5 rounded-full bg-secondary-container"></span>
<span>CR-01 (Primary Storage)</span>
<span className="font-caption text-caption text-secondary font-semibold bg-surface-container px-1.5 py-0.5 rounded ml-1">+2°C to +8°C</span>
<span className="font-label-sm text-label-sm bg-primary-container text-on-primary px-1.5 py-0.5 rounded font-mono ml-1">14/16 (88%)</span>
</button>
<button className="min-h-[44px] px-space-md rounded hover:bg-surface-container text-on-surface-variant font-label-md text-label-md font-medium transition-all flex items-center gap-space-xs" id="tab-cr02" type="button">
<span className="w-2.5 h-2.5 rounded-full bg-outline"></span>
<span>CR-02 (Secondary Storage)</span>
<span className="font-caption text-caption text-outline font-normal ml-1">+2°C to +8°C</span>
<span className="font-label-sm text-label-sm bg-surface-container-high text-on-surface-variant px-1.5 py-0.5 rounded font-mono ml-1">8/16 (50%)</span>
</button>
</div>
{/*  Live Environmental Telemetry Chip  */}
<div className="flex flex-wrap items-center gap-space-sm bg-surface-container-low px-space-md py-space-xs rounded">
<div className="flex items-center gap-space-xs text-primary-container font-label-md text-label-md font-semibold">
<span className="material-symbols-outlined text-secondary text-[18px]">thermostat</span>
<span>Temp: <strong className="text-on-surface font-mono font-bold">4.2°C</strong></span>
</div>
<div className="h-4 w-px bg-outline-variant hidden sm:block"></div>
<div className="flex items-center gap-space-xs text-primary-container font-label-md text-label-md font-semibold">
<span className="material-symbols-outlined text-secondary text-[18px]">humidity_percentage</span>
<span>RH: <strong className="text-on-surface font-mono font-bold">42%</strong></span>
</div>
<div className="h-4 w-px bg-outline-variant hidden sm:block"></div>
<div className="flex items-center gap-space-xs text-on-surface-variant font-caption text-caption">
<span className="material-symbols-outlined text-[16px] text-outline">sensors</span>
<span>Probe: <strong className="text-on-surface font-mono">NIST-891-B</strong> (Calib: 18/02)</span>
</div>
<div className="h-4 w-px bg-outline-variant hidden sm:block"></div>
<span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded bg-surface-bright text-secondary font-label-sm text-label-sm font-semibold">
<span className="w-2 h-2 rounded-full bg-secondary"></span>
          Chamber Nominal
        </span>
</div>
</div>
</div>
{/*  Search, Filter Toolbar & Barcode Query  */}
<div className="bg-surface-container-lowest rounded-lg p-space-md shadow-sm mb-space-md">
<div className="grid grid-cols-1 md:grid-cols-12 gap-space-md items-center">
{/*  Search Input with Monospace Shortcut  */}
<div className="md:col-span-6 relative">
<div className="absolute inset-y-0 left-0 pl-space-sm flex items-center pointer-events-none text-outline">
<span className="material-symbols-outlined text-[20px]">search</span>
</div>
<input className="w-full min-h-[44px] pl-10 pr-24 py-1.5 bg-surface-container-low text-on-surface placeholder:text-outline font-label-md text-label-md rounded focus:outline-none focus:bg-surface-container-lowest focus:shadow-[0_0_0_2px_#0F5F7A] transition-all" id="chamber-search" placeholder="Search barcode (Pallet PL-..., Rack RK-..., Lot LT-..., Batch B...)" type="text"/>
<div className="absolute inset-y-0 right-0 pr-space-xs flex items-center gap-1">
<span className="font-label-sm text-label-sm px-1.5 py-0.5 rounded bg-surface-container-high text-on-surface-variant font-mono">⌘K</span>
<button className="min-h-[36px] min-w-[36px] flex items-center justify-center text-outline hover:text-on-surface transition-colors" title="Scan Physical Barcode" type="button">
<span className="material-symbols-outlined text-[18px]">barcode_scanner</span>
</button>
</div>
</div>
{/*  Status Filter Dropdown  */}
<div className="md:col-span-3">
<div className="relative">
<select className="w-full min-h-[44px] appearance-none px-space-sm py-1.5 bg-surface-container-low text-on-surface font-body-md text-body-md rounded focus:outline-none focus:bg-surface-container-lowest focus:shadow-[0_0_0_2px_#0F5F7A] cursor-pointer pr-10" id="status-filter">
<option value="all">Status: All Pallets (14/16)</option>
<option value="ok">Within Hold Time (Green)</option>
<option value="warning">Approaching Limit (Amber)</option>
<option value="exceeded">Hold Time Exceeded (Red)</option>
<option value="empty">Empty Slots (2)</option>
</select>
<div className="absolute inset-y-0 right-0 pr-space-sm flex items-center pointer-events-none text-outline">
<span className="material-symbols-outlined text-[18px]">expand_more</span>
</div>
</div>
</div>
{/*  Product Filter Dropdown  */}
<div className="md:col-span-3">
<div className="relative">
<select className="w-full min-h-[44px] appearance-none px-space-sm py-1.5 bg-surface-container-low text-on-surface font-body-md text-body-md rounded focus:outline-none focus:bg-surface-container-lowest focus:shadow-[0_0_0_2px_#0F5F7A] cursor-pointer pr-10" id="product-filter">
<option value="all">Product: All Formulas</option>
<option value="insulin">Insulin Glargine 100 IU/mL</option>
<option value="filgrastim">Filgrastim 300 mcg</option>
<option value="somatropin">Somatropin 10 mg/1.5mL</option>
</select>
<div className="absolute inset-y-0 right-0 pr-space-sm flex items-center pointer-events-none text-outline">
<span className="material-symbols-outlined text-[18px]">filter_alt</span>
</div>
</div>
</div>
</div>
</div>
{/*  Legend Banner  */}
<div className="bg-surface-container-low rounded-lg px-space-md py-space-sm shadow-sm mb-space-lg">
<div className="flex flex-wrap items-center justify-between gap-space-sm">
<div className="flex items-center gap-space-xs text-on-surface-variant font-caption text-caption font-bold uppercase tracking-wider">
<span className="material-symbols-outlined text-[16px] text-secondary">info</span>
<span>GMP Hold-Time Status Legend:</span>
</div>
<div className="flex flex-wrap items-center gap-space-md">
<div className="flex items-center gap-1.5 font-caption text-caption text-on-surface">
<span className="w-2.5 h-2.5 rounded-full bg-secondary"></span>
<span>Hold Time OK (&lt;80% elapsed)</span>
</div>
<div className="flex items-center gap-1.5 font-caption text-caption text-on-surface">
<span className="w-2.5 h-2.5 rounded-full bg-secondary-container"></span>
<span>Warning (≥80% elapsed)</span>
</div>
<div className="flex items-center gap-1.5 font-caption text-caption text-on-surface">
<span className="w-2.5 h-2.5 rounded-full bg-error"></span>
<span>Exceeded (Deviation SOP-GMP-088)</span>
</div>
<div className="flex items-center gap-1.5 font-caption text-caption text-on-surface">
<span className="w-2.5 h-2.5 rounded-full bg-tertiary"></span>
<span>Recently Moved (&lt;15m)</span>
</div>
<div className="flex items-center gap-1.5 font-caption text-caption text-outline">
<span className="w-2.5 h-2.5 rounded-full bg-outline-variant"></span>
<span>Empty Bay Slot</span>
</div>
</div>
</div>
</div>
{/*  Main Layout Area: Grid of Racks + Right Summary Drawer  */}
<div className="grid grid-cols-1 xl:grid-cols-12 gap-space-lg items-start">
{/*  4 Chamber Racks Column (Span 9)  */}
<div className="xl:col-span-9 space-y-space-lg">
{/*  RACK 1: RK-CR01-001 (Bay A - Inbound Buffer)  */}
<section className="bg-surface-container-lowest rounded-lg shadow-sm overflow-hidden" data-rack="RK-CR01-001">
{/*  Rack Header  */}
<div className="bg-surface-container-low px-space-md py-space-sm flex flex-wrap items-center justify-between gap-space-sm">
<div className="flex items-center gap-space-sm min-w-0">
<span className="material-symbols-outlined text-primary text-[20px]">view_column</span>
<div>
<div className="flex items-center gap-space-xs">
<span className="font-label-lg text-label-lg text-primary-container font-mono font-bold">RK-CR01-001</span>
<span className="font-caption text-caption px-1.5 py-0.5 rounded bg-surface-container text-on-surface-variant font-medium">Bay A – Inbound Buffer</span>
</div>
<div className="font-caption text-caption text-outline">Sensor A-01: <strong className="text-on-surface font-mono">+4.1°C</strong> • Calibrated 24/02</div>
</div>
</div>
<div className="flex items-center gap-space-md">
{/*  Occupancy bar  */}
<div className="flex items-center gap-space-xs">
<span className="font-label-sm text-label-sm font-mono text-on-surface-variant">4/4 Slots (100%)</span>
<div className="w-24 h-2 rounded bg-surface-container-high overflow-hidden">
<div className="h-full bg-primary-container rounded" style={{"width":"100%"}}></div>
</div>
</div>
<button className="min-h-[44px] px-space-xs text-outline hover:text-on-surface flex items-center gap-1 font-label-sm text-label-sm transition-colors"  type="button">
<span className="material-symbols-outlined text-[18px]">expand_less</span>
<span className="hidden sm:inline">Collapse</span>
</button>
</div>
</div>
{/*  Pallet Slots (4-tier Shelf Grid)  */}
<div className="p-space-md grid grid-cols-1 md:grid-cols-2 gap-space-md" id="rack-1-content">
{/*  Shelf S-01  */}
<div className="bg-surface-container-low hover:bg-surface-container rounded-lg p-space-md transition-all shadow-sm relative group">
<div className="flex items-center justify-between gap-space-xs mb-space-xs">
<div className="flex items-center gap-space-xs min-w-0">
<span className="font-label-sm text-label-sm bg-surface-container-high text-on-surface-variant px-1 rounded font-mono">Shelf S-01</span>
<span className="font-label-md text-label-md text-primary-container font-mono font-bold select-all">PL-26-000124</span>
<button className="text-outline hover:text-primary min-h-[44px] min-w-[32px] flex items-center justify-center transition-colors" title="Copy Pallet ID" type="button">
<span className="material-symbols-outlined text-[16px]">content_copy</span>
</button>
</div>
{/*  Hold Time OK Badge  */}
<span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-surface-container-lowest text-secondary font-label-sm text-label-sm font-semibold">
<span className="w-2 h-2 rounded-full bg-secondary"></span>
<span>0h 24m / 1h (OK)</span>
</span>
</div>
<div className="space-y-1">
<div className="font-body-md text-body-md font-semibold text-on-surface truncate">Insulin Glargine 100 IU/mL</div>
<div className="flex items-center gap-space-sm font-caption text-caption text-on-surface-variant font-mono">
<span>Lot: <strong className="text-on-surface">LT-26A017</strong></span>
<span>Batch: <strong className="text-on-surface">B260117</strong></span>
<span>Qty: <strong className="text-on-surface">800 Vials</strong></span>
</div>
<div className="flex items-center justify-between text-outline font-caption text-caption pt-space-xs">
<span>Placed: 26/02 10:30 UTC</span>
<span className="text-on-surface-variant font-medium">Op: Anita Shah</span>
</div>
</div>
{/*  Quick Action Toolbar on Card  */}
<div className="mt-space-sm pt-space-xs flex items-center justify-end gap-space-xs">
<button className="min-h-[44px] px-space-sm text-primary hover:bg-surface-container-lowest rounded font-label-sm text-label-sm font-semibold transition-colors flex items-center gap-1" type="button">
<span className="material-symbols-outlined text-[16px]">folder_open</span>
<span>View Binder</span>
</button>
<button className="min-h-[44px] px-space-sm text-on-surface-variant hover:bg-surface-container-lowest rounded font-label-sm text-label-sm transition-colors flex items-center gap-1" type="button">
<span className="material-symbols-outlined text-[16px]">move_up</span>
<span>Relocate</span>
</button>
<button className="min-h-[44px] px-space-sm text-on-surface-variant hover:bg-surface-container-lowest rounded font-label-sm text-label-sm transition-colors flex items-center gap-1" type="button">
<span className="material-symbols-outlined text-[16px]">output</span>
<span>Withdraw</span>
</button>
</div>
</div>
{/*  Shelf S-02  */}
<div className="bg-surface-container-low hover:bg-surface-container rounded-lg p-space-md transition-all shadow-sm relative group">
<div className="flex items-center justify-between gap-space-xs mb-space-xs">
<div className="flex items-center gap-space-xs min-w-0">
<span className="font-label-sm text-label-sm bg-surface-container-high text-on-surface-variant px-1 rounded font-mono">Shelf S-02</span>
<span className="font-label-md text-label-md text-primary-container font-mono font-bold select-all">PL-26-000125</span>
<button className="text-outline hover:text-primary min-h-[44px] min-w-[32px] flex items-center justify-center transition-colors" title="Copy Pallet ID" type="button">
<span className="material-symbols-outlined text-[16px]">content_copy</span>
</button>
</div>
{/*  Hold Time OK Badge  */}
<span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-surface-container-lowest text-secondary font-label-sm text-label-sm font-semibold">
<span className="w-2 h-2 rounded-full bg-secondary"></span>
<span>0h 35m / 1h (OK)</span>
</span>
</div>
<div className="space-y-1">
<div className="font-body-md text-body-md font-semibold text-on-surface truncate">Insulin Glargine 100 IU/mL</div>
<div className="flex items-center gap-space-sm font-caption text-caption text-on-surface-variant font-mono">
<span>Lot: <strong className="text-on-surface">LT-26A017</strong></span>
<span>Batch: <strong className="text-on-surface">B260117</strong></span>
<span>Qty: <strong className="text-on-surface">800 Vials</strong></span>
</div>
<div className="flex items-center justify-between text-outline font-caption text-caption pt-space-xs">
<span>Placed: 26/02 10:19 UTC</span>
<span className="text-on-surface-variant font-medium">Op: Marco Silva</span>
</div>
</div>
<div className="mt-space-sm pt-space-xs flex items-center justify-end gap-space-xs">
<button className="min-h-[44px] px-space-sm text-primary hover:bg-surface-container-lowest rounded font-label-sm text-label-sm font-semibold transition-colors flex items-center gap-1" type="button">
<span className="material-symbols-outlined text-[16px]">folder_open</span>
<span>View Binder</span>
</button>
<button className="min-h-[44px] px-space-sm text-on-surface-variant hover:bg-surface-container-lowest rounded font-label-sm text-label-sm transition-colors flex items-center gap-1" type="button">
<span className="material-symbols-outlined text-[16px]">move_up</span>
<span>Relocate</span>
</button>
<button className="min-h-[44px] px-space-sm text-on-surface-variant hover:bg-surface-container-lowest rounded font-label-sm text-label-sm transition-colors flex items-center gap-1" type="button">
<span className="material-symbols-outlined text-[16px]">output</span>
<span>Withdraw</span>
</button>
</div>
</div>
{/*  Shelf S-03  */}
<div className="bg-surface-container-low hover:bg-surface-container rounded-lg p-space-md transition-all shadow-sm relative group">
<div className="flex items-center justify-between gap-space-xs mb-space-xs">
<div className="flex items-center gap-space-xs min-w-0">
<span className="font-label-sm text-label-sm bg-surface-container-high text-on-surface-variant px-1 rounded font-mono">Shelf S-03</span>
<span className="font-label-md text-label-md text-primary-container font-mono font-bold select-all">PL-26-000126</span>
<button className="text-outline hover:text-primary min-h-[44px] min-w-[32px] flex items-center justify-center transition-colors" title="Copy Pallet ID" type="button">
<span className="material-symbols-outlined text-[16px]">content_copy</span>
</button>
</div>
{/*  Recently Moved  */}
<span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-surface-container-lowest text-tertiary font-label-sm text-label-sm font-semibold">
<span className="w-2 h-2 rounded-full bg-tertiary"></span>
<span>Moved 8m ago</span>
</span>
</div>
<div className="space-y-1">
<div className="font-body-md text-body-md font-semibold text-on-surface truncate">Somatropin 10 mg/1.5mL</div>
<div className="flex items-center gap-space-sm font-caption text-caption text-on-surface-variant font-mono">
<span>Lot: <strong className="text-on-surface">LT-26C004</strong></span>
<span>Batch: <strong className="text-on-surface">B260124</strong></span>
<span>Qty: <strong className="text-on-surface">450 Cartridges</strong></span>
</div>
<div className="flex items-center justify-between text-outline font-caption text-caption pt-space-xs">
<span>Placed: 26/02 14:30 UTC</span>
<span className="text-on-surface-variant font-medium">Op: Anita Shah</span>
</div>
</div>
<div className="mt-space-sm pt-space-xs flex items-center justify-end gap-space-xs">
<button className="min-h-[44px] px-space-sm text-primary hover:bg-surface-container-lowest rounded font-label-sm text-label-sm font-semibold transition-colors flex items-center gap-1" type="button">
<span className="material-symbols-outlined text-[16px]">folder_open</span>
<span>View Binder</span>
</button>
<button className="min-h-[44px] px-space-sm text-on-surface-variant hover:bg-surface-container-lowest rounded font-label-sm text-label-sm transition-colors flex items-center gap-1" type="button">
<span className="material-symbols-outlined text-[16px]">move_up</span>
<span>Relocate</span>
</button>
<button className="min-h-[44px] px-space-sm text-on-surface-variant hover:bg-surface-container-lowest rounded font-label-sm text-label-sm transition-colors flex items-center gap-1" type="button">
<span className="material-symbols-outlined text-[16px]">output</span>
<span>Withdraw</span>
</button>
</div>
</div>
{/*  Shelf S-04  */}
<div className="bg-surface-container-low hover:bg-surface-container rounded-lg p-space-md transition-all shadow-sm relative group">
<div className="flex items-center justify-between gap-space-xs mb-space-xs">
<div className="flex items-center gap-space-xs min-w-0">
<span className="font-label-sm text-label-sm bg-surface-container-high text-on-surface-variant px-1 rounded font-mono">Shelf S-04</span>
<span className="font-label-md text-label-md text-primary-container font-mono font-bold select-all">PL-26-000127</span>
<button className="text-outline hover:text-primary min-h-[44px] min-w-[32px] flex items-center justify-center transition-colors" title="Copy Pallet ID" type="button">
<span className="material-symbols-outlined text-[16px]">content_copy</span>
</button>
</div>
<span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-surface-container-lowest text-secondary font-label-sm text-label-sm font-semibold">
<span className="w-2 h-2 rounded-full bg-secondary"></span>
<span>0h 15m / 1h (OK)</span>
</span>
</div>
<div className="space-y-1">
<div className="font-body-md text-body-md font-semibold text-on-surface truncate">Filgrastim 300 mcg</div>
<div className="flex items-center gap-space-sm font-caption text-caption text-on-surface-variant font-mono">
<span>Lot: <strong className="text-on-surface">LT-26B011</strong></span>
<span>Batch: <strong className="text-on-surface">B260119</strong></span>
<span>Qty: <strong className="text-on-surface">1,200 Syringes</strong></span>
</div>
<div className="flex items-center justify-between text-outline font-caption text-caption pt-space-xs">
<span>Placed: 26/02 14:23 UTC</span>
<span className="text-on-surface-variant font-medium">Op: David Vance</span>
</div>
</div>
<div className="mt-space-sm pt-space-xs flex items-center justify-end gap-space-xs">
<button className="min-h-[44px] px-space-sm text-primary hover:bg-surface-container-lowest rounded font-label-sm text-label-sm font-semibold transition-colors flex items-center gap-1" type="button">
<span className="material-symbols-outlined text-[16px]">folder_open</span>
<span>View Binder</span>
</button>
<button className="min-h-[44px] px-space-sm text-on-surface-variant hover:bg-surface-container-lowest rounded font-label-sm text-label-sm transition-colors flex items-center gap-1" type="button">
<span className="material-symbols-outlined text-[16px]">move_up</span>
<span>Relocate</span>
</button>
<button className="min-h-[44px] px-space-sm text-on-surface-variant hover:bg-surface-container-lowest rounded font-label-sm text-label-sm transition-colors flex items-center gap-1" type="button">
<span className="material-symbols-outlined text-[16px]">output</span>
<span>Withdraw</span>
</button>
</div>
</div>
</div>
</section>
{/*  RACK 2: RK-CR01-002 (Bay B - Formulation Hold)  */}
<section className="bg-surface-container-lowest rounded-lg shadow-sm overflow-hidden" data-rack="RK-CR01-002">
<div className="bg-surface-container-low px-space-md py-space-sm flex flex-wrap items-center justify-between gap-space-sm">
<div className="flex items-center gap-space-sm min-w-0">
<span className="material-symbols-outlined text-primary text-[20px]">view_column</span>
<div>
<div className="flex items-center gap-space-xs">
<span className="font-label-lg text-label-lg text-primary-container font-mono font-bold">RK-CR01-002</span>
<span className="font-caption text-caption px-1.5 py-0.5 rounded bg-surface-container text-on-surface-variant font-medium">Bay B – Formulation Hold</span>
</div>
<div className="font-caption text-caption text-outline">Sensor B-02: <strong className="text-on-surface font-mono">+4.3°C</strong> • Calibrated 24/02</div>
</div>
</div>
<div className="flex items-center gap-space-md">
<div className="flex items-center gap-space-xs">
<span className="font-label-sm text-label-sm font-mono text-on-surface-variant">4/4 Slots (100%)</span>
<div className="w-24 h-2 rounded bg-surface-container-high overflow-hidden">
<div className="h-full bg-primary-container rounded" style={{"width":"100%"}}></div>
</div>
</div>
<button className="min-h-[44px] px-space-xs text-outline hover:text-on-surface flex items-center gap-1 font-label-sm text-label-sm transition-colors"  type="button">
<span className="material-symbols-outlined text-[18px]">expand_less</span>
<span className="hidden sm:inline">Collapse</span>
</button>
</div>
</div>
<div className="p-space-md grid grid-cols-1 md:grid-cols-2 gap-space-md" id="rack-2-content">
{/*  Shelf S-01 (Approaching Limit - Amber Warning)  */}
<div className="bg-surface-container-low hover:bg-surface-container rounded-lg p-space-md transition-all shadow-sm relative group">
<div className="flex items-center justify-between gap-space-xs mb-space-xs">
<div className="flex items-center gap-space-xs min-w-0">
<span className="font-label-sm text-label-sm bg-surface-container-high text-on-surface-variant px-1 rounded font-mono">Shelf S-01</span>
<span className="font-label-md text-label-md text-primary-container font-mono font-bold select-all">PL-26-000128</span>
<button className="text-outline hover:text-primary min-h-[44px] min-w-[32px] flex items-center justify-center transition-colors" title="Copy Pallet ID" type="button">
<span className="material-symbols-outlined text-[16px]">content_copy</span>
</button>
</div>
{/*  Amber Warning Badge  */}
<span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-surface-container-lowest text-secondary-container font-label-sm text-label-sm font-bold">
<span className="w-2 h-2 rounded-full bg-secondary-container animate-pulse"></span>
<span>0h 51m / 1h (Warning)</span>
</span>
</div>
<div className="space-y-1">
<div className="font-body-md text-body-md font-semibold text-on-surface truncate">Insulin Glargine 100 IU/mL</div>
<div className="flex items-center gap-space-sm font-caption text-caption text-on-surface-variant font-mono">
<span>Lot: <strong className="text-on-surface">LT-26A015</strong></span>
<span>Batch: <strong className="text-on-surface">B260115</strong></span>
<span>Qty: <strong className="text-on-surface">800 Vials</strong></span>
</div>
<div className="flex items-center justify-between text-outline font-caption text-caption pt-space-xs">
<span>Placed: 26/02 09:47 UTC</span>
<span className="text-on-surface-variant font-medium">Op: Anita Shah</span>
</div>
</div>
<div className="mt-space-sm pt-space-xs flex items-center justify-end gap-space-xs">
<button className="min-h-[44px] px-space-sm text-primary hover:bg-surface-container-lowest rounded font-label-sm text-label-sm font-semibold transition-colors flex items-center gap-1" type="button">
<span className="material-symbols-outlined text-[16px]">folder_open</span>
<span>View Binder</span>
</button>
<button className="min-h-[44px] px-space-sm text-on-surface-variant hover:bg-surface-container-lowest rounded font-label-sm text-label-sm transition-colors flex items-center gap-1" type="button">
<span className="material-symbols-outlined text-[16px]">move_up</span>
<span>Relocate</span>
</button>
<button className="min-h-[44px] px-space-sm text-on-surface-variant hover:bg-surface-container-lowest rounded font-label-sm text-label-sm transition-colors flex items-center gap-1" type="button">
<span className="material-symbols-outlined text-[16px]">output</span>
<span>Withdraw</span>
</button>
</div>
</div>
{/*  Shelf S-02 (HOLD TIME EXCEEDED - Red Deviation)  */}
<div className="bg-error-container/20 rounded-lg p-space-md transition-all shadow-sm relative group">
<div className="flex items-center justify-between gap-space-xs mb-space-xs">
<div className="flex items-center gap-space-xs min-w-0">
<span className="font-label-sm text-label-sm bg-error-container text-on-error-container px-1 rounded font-mono font-bold">Shelf S-02</span>
<span className="font-label-md text-label-md text-error font-mono font-bold select-all">PL-26-000129</span>
<button className="text-outline hover:text-error min-h-[44px] min-w-[32px] flex items-center justify-center transition-colors" title="Copy Pallet ID" type="button">
<span className="material-symbols-outlined text-[16px]">content_copy</span>
</button>
</div>
{/*  Red Exceeded Badge  */}
<span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-error text-on-error font-label-sm text-label-sm font-bold shadow-sm">
<span className="w-2 h-2 rounded-full bg-surface-container-lowest animate-ping"></span>
<span>1h 12m / 1h (Exceeded)</span>
</span>
</div>
<div className="space-y-1">
<div className="font-body-md text-body-md font-bold text-on-surface truncate">Somatropin 10 mg/1.5mL</div>
<div className="flex items-center gap-space-sm font-caption text-caption text-on-surface-variant font-mono">
<span>Lot: <strong className="text-error font-bold">LT-26C001</strong></span>
<span>Batch: <strong className="text-on-surface">B260120</strong></span>
<span>Qty: <strong className="text-on-surface">600 Cartridges</strong></span>
</div>
<div className="flex items-center justify-between text-on-error-container font-caption text-caption pt-space-xs font-semibold">
<span>Placed: 26/02 09:26 UTC</span>
<span>DEV-2025-042 Logged</span>
</div>
</div>
<div className="mt-space-sm pt-space-xs flex items-center justify-between gap-space-xs">
<span className="font-label-sm text-label-sm text-error font-bold flex items-center gap-1">
<span className="material-symbols-outlined text-[16px]">warning</span>
                Hold Lock Active
              </span>
<div className="flex items-center gap-space-xs">
<button className="min-h-[44px] px-space-sm bg-surface-container-lowest text-error hover:bg-error-container rounded font-label-sm text-label-sm font-bold transition-colors flex items-center gap-1 shadow-sm" type="button">
<span className="material-symbols-outlined text-[16px]">assignment_late</span>
<span>Deviation QA</span>
</button>
<button className="min-h-[44px] px-space-sm bg-primary-container text-on-primary hover:bg-primary rounded font-label-sm text-label-sm font-semibold transition-colors flex items-center gap-1 shadow-sm" type="button">
<span className="material-symbols-outlined text-[16px]">verified</span>
<span>Authorize Move</span>
</button>
</div>
</div>
</div>
{/*  Shelf S-03  */}
<div className="bg-surface-container-low hover:bg-surface-container rounded-lg p-space-md transition-all shadow-sm relative group">
<div className="flex items-center justify-between gap-space-xs mb-space-xs">
<div className="flex items-center gap-space-xs min-w-0">
<span className="font-label-sm text-label-sm bg-surface-container-high text-on-surface-variant px-1 rounded font-mono">Shelf S-03</span>
<span className="font-label-md text-label-md text-primary-container font-mono font-bold select-all">PL-26-000130</span>
<button className="text-outline hover:text-primary min-h-[44px] min-w-[32px] flex items-center justify-center transition-colors" title="Copy Pallet ID" type="button">
<span className="material-symbols-outlined text-[16px]">content_copy</span>
</button>
</div>
<span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-surface-container-lowest text-secondary font-label-sm text-label-sm font-semibold">
<span className="w-2 h-2 rounded-full bg-secondary"></span>
<span>0h 42m / 1h (OK)</span>
</span>
</div>
<div className="space-y-1">
<div className="font-body-md text-body-md font-semibold text-on-surface truncate">Insulin Glargine 100 IU/mL</div>
<div className="flex items-center gap-space-sm font-caption text-caption text-on-surface-variant font-mono">
<span>Lot: <strong className="text-on-surface">LT-26A016</strong></span>
<span>Batch: <strong className="text-on-surface">B260116</strong></span>
<span>Qty: <strong className="text-on-surface">800 Vials</strong></span>
</div>
<div className="flex items-center justify-between text-outline font-caption text-caption pt-space-xs">
<span>Placed: 26/02 09:56 UTC</span>
<span className="text-on-surface-variant font-medium">Op: Marco Silva</span>
</div>
</div>
<div className="mt-space-sm pt-space-xs flex items-center justify-end gap-space-xs">
<button className="min-h-[44px] px-space-sm text-primary hover:bg-surface-container-lowest rounded font-label-sm text-label-sm font-semibold transition-colors flex items-center gap-1" type="button">
<span className="material-symbols-outlined text-[16px]">folder_open</span>
<span>View Binder</span>
</button>
<button className="min-h-[44px] px-space-sm text-on-surface-variant hover:bg-surface-container-lowest rounded font-label-sm text-label-sm transition-colors flex items-center gap-1" type="button">
<span className="material-symbols-outlined text-[16px]">move_up</span>
<span>Relocate</span>
</button>
<button className="min-h-[44px] px-space-sm text-on-surface-variant hover:bg-surface-container-lowest rounded font-label-sm text-label-sm transition-colors flex items-center gap-1" type="button">
<span className="material-symbols-outlined text-[16px]">output</span>
<span>Withdraw</span>
</button>
</div>
</div>
{/*  Shelf S-04  */}
<div className="bg-surface-container-low hover:bg-surface-container rounded-lg p-space-md transition-all shadow-sm relative group">
<div className="flex items-center justify-between gap-space-xs mb-space-xs">
<div className="flex items-center gap-space-xs min-w-0">
<span className="font-label-sm text-label-sm bg-surface-container-high text-on-surface-variant px-1 rounded font-mono">Shelf S-04</span>
<span className="font-label-md text-label-md text-primary-container font-mono font-bold select-all">PL-26-000131</span>
<button className="text-outline hover:text-primary min-h-[44px] min-w-[32px] flex items-center justify-center transition-colors" title="Copy Pallet ID" type="button">
<span className="material-symbols-outlined text-[16px]">content_copy</span>
</button>
</div>
<span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-surface-container-lowest text-secondary font-label-sm text-label-sm font-semibold">
<span className="w-2 h-2 rounded-full bg-secondary"></span>
<span>0h 19m / 1h (OK)</span>
</span>
</div>
<div className="space-y-1">
<div className="font-body-md text-body-md font-semibold text-on-surface truncate">Filgrastim 300 mcg</div>
<div className="flex items-center gap-space-sm font-caption text-caption text-on-surface-variant font-mono">
<span>Lot: <strong className="text-on-surface">LT-26B012</strong></span>
<span>Batch: <strong className="text-on-surface">B260121</strong></span>
<span>Qty: <strong className="text-on-surface">1,100 Syringes</strong></span>
</div>
<div className="flex items-center justify-between text-outline font-caption text-caption pt-space-xs">
<span>Placed: 26/02 14:19 UTC</span>
<span className="text-on-surface-variant font-medium">Op: David Vance</span>
</div>
</div>
<div className="mt-space-sm pt-space-xs flex items-center justify-end gap-space-xs">
<button className="min-h-[44px] px-space-sm text-primary hover:bg-surface-container-lowest rounded font-label-sm text-label-sm font-semibold transition-colors flex items-center gap-1" type="button">
<span className="material-symbols-outlined text-[16px]">folder_open</span>
<span>View Binder</span>
</button>
<button className="min-h-[44px] px-space-sm text-on-surface-variant hover:bg-surface-container-lowest rounded font-label-sm text-label-sm transition-colors flex items-center gap-1" type="button">
<span className="material-symbols-outlined text-[16px]">move_up</span>
<span>Relocate</span>
</button>
<button className="min-h-[44px] px-space-sm text-on-surface-variant hover:bg-surface-container-lowest rounded font-label-sm text-label-sm transition-colors flex items-center gap-1" type="button">
<span className="material-symbols-outlined text-[16px]">output</span>
<span>Withdraw</span>
</button>
</div>
</div>
</div>
</section>
{/*  RACK 3: RK-CR01-003 (Bay C - Semi-Finished) -> Has 1 Empty Slot  */}
<section className="bg-surface-container-lowest rounded-lg shadow-sm overflow-hidden" data-rack="RK-CR01-003">
<div className="bg-surface-container-low px-space-md py-space-sm flex flex-wrap items-center justify-between gap-space-sm">
<div className="flex items-center gap-space-sm min-w-0">
<span className="material-symbols-outlined text-primary text-[20px]">view_column</span>
<div>
<div className="flex items-center gap-space-xs">
<span className="font-label-lg text-label-lg text-primary-container font-mono font-bold">RK-CR01-003</span>
<span className="font-caption text-caption px-1.5 py-0.5 rounded bg-surface-container text-on-surface-variant font-medium">Bay C – Semi-Finished</span>
</div>
<div className="font-caption text-caption text-outline">Sensor C-03: <strong className="text-on-surface font-mono">+4.0°C</strong> • Calibrated 24/02</div>
</div>
</div>
<div className="flex items-center gap-space-md">
<div className="flex items-center gap-space-xs">
<span className="font-label-sm text-label-sm font-mono text-on-surface-variant">3/4 Slots (75%)</span>
<div className="w-24 h-2 rounded bg-surface-container-high overflow-hidden">
<div className="h-full bg-secondary rounded" style={{"width":"75%"}}></div>
</div>
</div>
<button className="min-h-[44px] px-space-xs text-outline hover:text-on-surface flex items-center gap-1 font-label-sm text-label-sm transition-colors"  type="button">
<span className="material-symbols-outlined text-[18px]">expand_less</span>
<span className="hidden sm:inline">Collapse</span>
</button>
</div>
</div>
<div className="p-space-md grid grid-cols-1 md:grid-cols-2 gap-space-md" id="rack-3-content">
{/*  Shelf S-01  */}
<div className="bg-surface-container-low hover:bg-surface-container rounded-lg p-space-md transition-all shadow-sm relative group">
<div className="flex items-center justify-between gap-space-xs mb-space-xs">
<div className="flex items-center gap-space-xs min-w-0">
<span className="font-label-sm text-label-sm bg-surface-container-high text-on-surface-variant px-1 rounded font-mono">Shelf S-01</span>
<span className="font-label-md text-label-md text-primary-container font-mono font-bold select-all">PL-26-000132</span>
<button className="text-outline hover:text-primary min-h-[44px] min-w-[32px] flex items-center justify-center transition-colors" title="Copy Pallet ID" type="button">
<span className="material-symbols-outlined text-[16px]">content_copy</span>
</button>
</div>
<span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-surface-container-lowest text-secondary font-label-sm text-label-sm font-semibold">
<span className="w-2 h-2 rounded-full bg-secondary"></span>
<span>0h 28m / 1h (OK)</span>
</span>
</div>
<div className="space-y-1">
<div className="font-body-md text-body-md font-semibold text-on-surface truncate">Insulin Glargine 100 IU/mL</div>
<div className="flex items-center gap-space-sm font-caption text-caption text-on-surface-variant font-mono">
<span>Lot: <strong className="text-on-surface">LT-26A018</strong></span>
<span>Batch: <strong className="text-on-surface">B260118</strong></span>
<span>Qty: <strong className="text-on-surface">800 Vials</strong></span>
</div>
<div className="flex items-center justify-between text-outline font-caption text-caption pt-space-xs">
<span>Placed: 26/02 11:10 UTC</span>
<span className="text-on-surface-variant font-medium">Op: Anita Shah</span>
</div>
</div>
<div className="mt-space-sm pt-space-xs flex items-center justify-end gap-space-xs">
<button className="min-h-[44px] px-space-sm text-primary hover:bg-surface-container-lowest rounded font-label-sm text-label-sm font-semibold transition-colors flex items-center gap-1" type="button">
<span className="material-symbols-outlined text-[16px]">folder_open</span>
<span>View Binder</span>
</button>
<button className="min-h-[44px] px-space-sm text-on-surface-variant hover:bg-surface-container-lowest rounded font-label-sm text-label-sm transition-colors flex items-center gap-1" type="button">
<span className="material-symbols-outlined text-[16px]">move_up</span>
<span>Relocate</span>
</button>
<button className="min-h-[44px] px-space-sm text-on-surface-variant hover:bg-surface-container-lowest rounded font-label-sm text-label-sm transition-colors flex items-center gap-1" type="button">
<span className="material-symbols-outlined text-[16px]">output</span>
<span>Withdraw</span>
</button>
</div>
</div>
{/*  Shelf S-02  */}
<div className="bg-surface-container-low hover:bg-surface-container rounded-lg p-space-md transition-all shadow-sm relative group">
<div className="flex items-center justify-between gap-space-xs mb-space-xs">
<div className="flex items-center gap-space-xs min-w-0">
<span className="font-label-sm text-label-sm bg-surface-container-high text-on-surface-variant px-1 rounded font-mono">Shelf S-02</span>
<span className="font-label-md text-label-md text-primary-container font-mono font-bold select-all">PL-26-000133</span>
<button className="text-outline hover:text-primary min-h-[44px] min-w-[32px] flex items-center justify-center transition-colors" title="Copy Pallet ID" type="button">
<span className="material-symbols-outlined text-[16px]">content_copy</span>
</button>
</div>
<span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-surface-container-lowest text-secondary font-label-sm text-label-sm font-semibold">
<span className="w-2 h-2 rounded-full bg-secondary"></span>
<span>0h 31m / 1h (OK)</span>
</span>
</div>
<div className="space-y-1">
<div className="font-body-md text-body-md font-semibold text-on-surface truncate">Insulin Glargine 100 IU/mL</div>
<div className="flex items-center gap-space-sm font-caption text-caption text-on-surface-variant font-mono">
<span>Lot: <strong className="text-on-surface">LT-26A018</strong></span>
<span>Batch: <strong className="text-on-surface">B260118</strong></span>
<span>Qty: <strong className="text-on-surface">800 Vials</strong></span>
</div>
<div className="flex items-center justify-between text-outline font-caption text-caption pt-space-xs">
<span>Placed: 26/02 11:07 UTC</span>
<span className="text-on-surface-variant font-medium">Op: Anita Shah</span>
</div>
</div>
<div className="mt-space-sm pt-space-xs flex items-center justify-end gap-space-xs">
<button className="min-h-[44px] px-space-sm text-primary hover:bg-surface-container-lowest rounded font-label-sm text-label-sm font-semibold transition-colors flex items-center gap-1" type="button">
<span className="material-symbols-outlined text-[16px]">folder_open</span>
<span>View Binder</span>
</button>
<button className="min-h-[44px] px-space-sm text-on-surface-variant hover:bg-surface-container-lowest rounded font-label-sm text-label-sm transition-colors flex items-center gap-1" type="button">
<span className="material-symbols-outlined text-[16px]">move_up</span>
<span>Relocate</span>
</button>
<button className="min-h-[44px] px-space-sm text-on-surface-variant hover:bg-surface-container-lowest rounded font-label-sm text-label-sm transition-colors flex items-center gap-1" type="button">
<span className="material-symbols-outlined text-[16px]">output</span>
<span>Withdraw</span>
</button>
</div>
</div>
{/*  Shelf S-03  */}
<div className="bg-surface-container-low hover:bg-surface-container rounded-lg p-space-md transition-all shadow-sm relative group">
<div className="flex items-center justify-between gap-space-xs mb-space-xs">
<div className="flex items-center gap-space-xs min-w-0">
<span className="font-label-sm text-label-sm bg-surface-container-high text-on-surface-variant px-1 rounded font-mono">Shelf S-03</span>
<span className="font-label-md text-label-md text-primary-container font-mono font-bold select-all">PL-26-000134</span>
<button className="text-outline hover:text-primary min-h-[44px] min-w-[32px] flex items-center justify-center transition-colors" title="Copy Pallet ID" type="button">
<span className="material-symbols-outlined text-[16px]">content_copy</span>
</button>
</div>
<span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-surface-container-lowest text-secondary font-label-sm text-label-sm font-semibold">
<span className="w-2 h-2 rounded-full bg-secondary"></span>
<span>0h 08m / 1h (OK)</span>
</span>
</div>
<div className="space-y-1">
<div className="font-body-md text-body-md font-semibold text-on-surface truncate">Filgrastim 300 mcg</div>
<div className="flex items-center gap-space-sm font-caption text-caption text-on-surface-variant font-mono">
<span>Lot: <strong className="text-on-surface">LT-26B015</strong></span>
<span>Batch: <strong className="text-on-surface">B260125</strong></span>
<span>Qty: <strong className="text-on-surface">950 Syringes</strong></span>
</div>
<div className="flex items-center justify-between text-outline font-caption text-caption pt-space-xs">
<span>Placed: 26/02 14:30 UTC</span>
<span className="text-on-surface-variant font-medium">Op: Marco Silva</span>
</div>
</div>
<div className="mt-space-sm pt-space-xs flex items-center justify-end gap-space-xs">
<button className="min-h-[44px] px-space-sm text-primary hover:bg-surface-container-lowest rounded font-label-sm text-label-sm font-semibold transition-colors flex items-center gap-1" type="button">
<span className="material-symbols-outlined text-[16px]">folder_open</span>
<span>View Binder</span>
</button>
<button className="min-h-[44px] px-space-sm text-on-surface-variant hover:bg-surface-container-lowest rounded font-label-sm text-label-sm transition-colors flex items-center gap-1" type="button">
<span className="material-symbols-outlined text-[16px]">move_up</span>
<span>Relocate</span>
</button>
<button className="min-h-[44px] px-space-sm text-on-surface-variant hover:bg-surface-container-lowest rounded font-label-sm text-label-sm transition-colors flex items-center gap-1" type="button">
<span className="material-symbols-outlined text-[16px]">output</span>
<span>Withdraw</span>
</button>
</div>
</div>
{/*  Shelf S-04: EMPTY SLOT 1  */}
<div className="bg-surface-container rounded-lg p-space-md flex flex-col justify-between items-center text-center transition-all shadow-inner">
<div className="w-full flex items-center justify-between">
<span className="font-label-sm text-label-sm bg-surface-container-high text-outline px-1 rounded font-mono">Shelf S-04</span>
<span className="font-caption text-caption text-outline font-semibold uppercase tracking-wider">Unassigned</span>
</div>
<div className="my-space-sm flex flex-col items-center">
<div className="w-10 h-10 rounded-full bg-surface-container-high flex items-center justify-center text-outline mb-1">
<span className="material-symbols-outlined text-[22px]">inventory_2</span>
</div>
<div className="font-body-md text-body-md font-semibold text-on-surface">Available Slot: Shelf S-04</div>
<p className="font-caption text-caption text-outline">Bay C Ready for Allocation (ISO 7)</p>
</div>
<button className="w-full min-h-[44px] px-space-md rounded bg-surface-container-lowest hover:bg-primary-container hover:text-on-primary text-primary-container font-label-md text-label-md font-semibold transition-all shadow-sm flex items-center justify-center gap-1"  type="button">
<span className="material-symbols-outlined text-[18px]">add_circle</span>
<span>+ Place Pallet</span>
</button>
</div>
</div>
</section>
{/*  RACK 4: RK-CR01-004 (Bay D - Pre-Inspection) -> Has 1 Empty Slot  */}
<section className="bg-surface-container-lowest rounded-lg shadow-sm overflow-hidden" data-rack="RK-CR01-004">
<div className="bg-surface-container-low px-space-md py-space-sm flex flex-wrap items-center justify-between gap-space-sm">
<div className="flex items-center gap-space-sm min-w-0">
<span className="material-symbols-outlined text-primary text-[20px]">view_column</span>
<div>
<div className="flex items-center gap-space-xs">
<span className="font-label-lg text-label-lg text-primary-container font-mono font-bold">RK-CR01-004</span>
<span className="font-caption text-caption px-1.5 py-0.5 rounded bg-surface-container text-on-surface-variant font-medium">Bay D – Pre-Inspection</span>
</div>
<div className="font-caption text-caption text-outline">Sensor D-04: <strong className="text-on-surface font-mono">+4.2°C</strong> • Calibrated 24/02</div>
</div>
</div>
<div className="flex items-center gap-space-md">
<div className="flex items-center gap-space-xs">
<span className="font-label-sm text-label-sm font-mono text-on-surface-variant">3/4 Slots (75%)</span>
<div className="w-24 h-2 rounded bg-surface-container-high overflow-hidden">
<div className="h-full bg-secondary rounded" style={{"width":"75%"}}></div>
</div>
</div>
<button className="min-h-[44px] px-space-xs text-outline hover:text-on-surface flex items-center gap-1 font-label-sm text-label-sm transition-colors"  type="button">
<span className="material-symbols-outlined text-[18px]">expand_less</span>
<span className="hidden sm:inline">Collapse</span>
</button>
</div>
</div>
<div className="p-space-md grid grid-cols-1 md:grid-cols-2 gap-space-md" id="rack-4-content">
{/*  Shelf S-01  */}
<div className="bg-surface-container-low hover:bg-surface-container rounded-lg p-space-md transition-all shadow-sm relative group">
<div className="flex items-center justify-between gap-space-xs mb-space-xs">
<div className="flex items-center gap-space-xs min-w-0">
<span className="font-label-sm text-label-sm bg-surface-container-high text-on-surface-variant px-1 rounded font-mono">Shelf S-01</span>
<span className="font-label-md text-label-md text-primary-container font-mono font-bold select-all">PL-26-000135</span>
<button className="text-outline hover:text-primary min-h-[44px] min-w-[32px] flex items-center justify-center transition-colors" title="Copy Pallet ID" type="button">
<span className="material-symbols-outlined text-[16px]">content_copy</span>
</button>
</div>
<span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-surface-container-lowest text-secondary font-label-sm text-label-sm font-semibold">
<span className="w-2 h-2 rounded-full bg-secondary"></span>
<span>0h 14m / 1h (OK)</span>
</span>
</div>
<div className="space-y-1">
<div className="font-body-md text-body-md font-semibold text-on-surface truncate">Insulin Glargine 100 IU/mL</div>
<div className="flex items-center gap-space-sm font-caption text-caption text-on-surface-variant font-mono">
<span>Lot: <strong className="text-on-surface">LT-26A019</strong></span>
<span>Batch: <strong className="text-on-surface">B260119</strong></span>
<span>Qty: <strong className="text-on-surface">800 Vials</strong></span>
</div>
<div className="flex items-center justify-between text-outline font-caption text-caption pt-space-xs">
<span>Placed: 26/02 14:24 UTC</span>
<span className="text-on-surface-variant font-medium">Op: Anita Shah</span>
</div>
</div>
<div className="mt-space-sm pt-space-xs flex items-center justify-end gap-space-xs">
<button className="min-h-[44px] px-space-sm text-primary hover:bg-surface-container-lowest rounded font-label-sm text-label-sm font-semibold transition-colors flex items-center gap-1" type="button">
<span className="material-symbols-outlined text-[16px]">folder_open</span>
<span>View Binder</span>
</button>
<button className="min-h-[44px] px-space-sm text-on-surface-variant hover:bg-surface-container-lowest rounded font-label-sm text-label-sm transition-colors flex items-center gap-1" type="button">
<span className="material-symbols-outlined text-[16px]">move_up</span>
<span>Relocate</span>
</button>
<button className="min-h-[44px] px-space-sm text-on-surface-variant hover:bg-surface-container-lowest rounded font-label-sm text-label-sm transition-colors flex items-center gap-1" type="button">
<span className="material-symbols-outlined text-[16px]">output</span>
<span>Withdraw</span>
</button>
</div>
</div>
{/*  Shelf S-02  */}
<div className="bg-surface-container-low hover:bg-surface-container rounded-lg p-space-md transition-all shadow-sm relative group">
<div className="flex items-center justify-between gap-space-xs mb-space-xs">
<div className="flex items-center gap-space-xs min-w-0">
<span className="font-label-sm text-label-sm bg-surface-container-high text-on-surface-variant px-1 rounded font-mono">Shelf S-02</span>
<span className="font-label-md text-label-md text-primary-container font-mono font-bold select-all">PL-26-000136</span>
<button className="text-outline hover:text-primary min-h-[44px] min-w-[32px] flex items-center justify-center transition-colors" title="Copy Pallet ID" type="button">
<span className="material-symbols-outlined text-[16px]">content_copy</span>
</button>
</div>
<span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-surface-container-lowest text-secondary font-label-sm text-label-sm font-semibold">
<span className="w-2 h-2 rounded-full bg-secondary"></span>
<span>0h 20m / 1h (OK)</span>
</span>
</div>
<div className="space-y-1">
<div className="font-body-md text-body-md font-semibold text-on-surface truncate">Somatropin 10 mg/1.5mL</div>
<div className="flex items-center gap-space-sm font-caption text-caption text-on-surface-variant font-mono">
<span>Lot: <strong className="text-on-surface">LT-26C005</strong></span>
<span>Batch: <strong className="text-on-surface">B260125</strong></span>
<span>Qty: <strong className="text-on-surface">500 Cartridges</strong></span>
</div>
<div className="flex items-center justify-between text-outline font-caption text-caption pt-space-xs">
<span>Placed: 26/02 14:18 UTC</span>
<span className="text-on-surface-variant font-medium">Op: David Vance</span>
</div>
</div>
<div className="mt-space-sm pt-space-xs flex items-center justify-end gap-space-xs">
<button className="min-h-[44px] px-space-sm text-primary hover:bg-surface-container-lowest rounded font-label-sm text-label-sm font-semibold transition-colors flex items-center gap-1" type="button">
<span className="material-symbols-outlined text-[16px]">folder_open</span>
<span>View Binder</span>
</button>
<button className="min-h-[44px] px-space-sm text-on-surface-variant hover:bg-surface-container-lowest rounded font-label-sm text-label-sm transition-colors flex items-center gap-1" type="button">
<span className="material-symbols-outlined text-[16px]">move_up</span>
<span>Relocate</span>
</button>
<button className="min-h-[44px] px-space-sm text-on-surface-variant hover:bg-surface-container-lowest rounded font-label-sm text-label-sm transition-colors flex items-center gap-1" type="button">
<span className="material-symbols-outlined text-[16px]">output</span>
<span>Withdraw</span>
</button>
</div>
</div>
{/*  Shelf S-03  */}
<div className="bg-surface-container-low hover:bg-surface-container rounded-lg p-space-md transition-all shadow-sm relative group">
<div className="flex items-center justify-between gap-space-xs mb-space-xs">
<div className="flex items-center gap-space-xs min-w-0">
<span className="font-label-sm text-label-sm bg-surface-container-high text-on-surface-variant px-1 rounded font-mono">Shelf S-03</span>
<span className="font-label-md text-label-md text-primary-container font-mono font-bold select-all">PL-26-000137</span>
<button className="text-outline hover:text-primary min-h-[44px] min-w-[32px] flex items-center justify-center transition-colors" title="Copy Pallet ID" type="button">
<span className="material-symbols-outlined text-[16px]">content_copy</span>
</button>
</div>
<span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-surface-container-lowest text-secondary font-label-sm text-label-sm font-semibold">
<span className="w-2 h-2 rounded-full bg-secondary"></span>
<span>0h 39m / 1h (OK)</span>
</span>
</div>
<div className="space-y-1">
<div className="font-body-md text-body-md font-semibold text-on-surface truncate">Insulin Glargine 100 IU/mL</div>
<div className="flex items-center gap-space-sm font-caption text-caption text-on-surface-variant font-mono">
<span>Lot: <strong className="text-on-surface">LT-26A019</strong></span>
<span>Batch: <strong className="text-on-surface">B260119</strong></span>
<span>Qty: <strong className="text-on-surface">800 Vials</strong></span>
</div>
<div className="flex items-center justify-between text-outline font-caption text-caption pt-space-xs">
<span>Placed: 26/02 13:59 UTC</span>
<span className="text-on-surface-variant font-medium">Op: Marco Silva</span>
</div>
</div>
<div className="mt-space-sm pt-space-xs flex items-center justify-end gap-space-xs">
<button className="min-h-[44px] px-space-sm text-primary hover:bg-surface-container-lowest rounded font-label-sm text-label-sm font-semibold transition-colors flex items-center gap-1" type="button">
<span className="material-symbols-outlined text-[16px]">folder_open</span>
<span>View Binder</span>
</button>
<button className="min-h-[44px] px-space-sm text-on-surface-variant hover:bg-surface-container-lowest rounded font-label-sm text-label-sm transition-colors flex items-center gap-1" type="button">
<span className="material-symbols-outlined text-[16px]">move_up</span>
<span>Relocate</span>
</button>
<button className="min-h-[44px] px-space-sm text-on-surface-variant hover:bg-surface-container-lowest rounded font-label-sm text-label-sm transition-colors flex items-center gap-1" type="button">
<span className="material-symbols-outlined text-[16px]">output</span>
<span>Withdraw</span>
</button>
</div>
</div>
{/*  Shelf S-04: EMPTY SLOT 2  */}
<div className="bg-surface-container rounded-lg p-space-md flex flex-col justify-between items-center text-center transition-all shadow-inner">
<div className="w-full flex items-center justify-between">
<span className="font-label-sm text-label-sm bg-surface-container-high text-outline px-1 rounded font-mono">Shelf S-04</span>
<span className="font-caption text-caption text-outline font-semibold uppercase tracking-wider">Unassigned</span>
</div>
<div className="my-space-sm flex flex-col items-center">
<div className="w-10 h-10 rounded-full bg-surface-container-high flex items-center justify-center text-outline mb-1">
<span className="material-symbols-outlined text-[22px]">inventory_2</span>
</div>
<div className="font-body-md text-body-md font-semibold text-on-surface">Available Slot: Shelf S-04</div>
<p className="font-caption text-caption text-outline">Bay D Ready for Allocation (ISO 7)</p>
</div>
<button className="w-full min-h-[44px] px-space-md rounded bg-surface-container-lowest hover:bg-primary-container hover:text-on-primary text-primary-container font-label-md text-label-md font-semibold transition-all shadow-sm flex items-center justify-center gap-1"  type="button">
<span className="material-symbols-outlined text-[18px]">add_circle</span>
<span>+ Place Pallet</span>
</button>
</div>
</div>
</section>
</div>
{/*  Right Side Analytics & Inspection Drawer (Span 3)  */}
<div className="xl:col-span-3 space-y-space-md">
{/*  Chamber Summary & Capacity Matrix  */}
<div className="bg-surface-container-lowest rounded-lg p-space-md shadow-sm">
<div className="flex items-center justify-between pb-space-sm mb-space-sm border-b border-surface-container-high">
<div className="flex items-center gap-space-xs">
<span className="material-symbols-outlined text-primary text-[20px]">analytics</span>
<span className="font-headline-sm text-headline-sm text-on-surface font-bold">Chamber Matrix</span>
</div>
<span className="font-caption text-caption px-1.5 py-0.5 rounded bg-surface-container font-mono text-outline font-semibold">CR-01</span>
</div>
{/*  Donut / Capacity Viz  */}
<div className="flex items-center justify-center py-space-sm relative">
<svg className="w-32 h-32 transform -rotate-90" viewBox="0 0 36 36">
{/*  Background circle  */}
<path className="text-surface-container-high stroke-current" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" strokeWidth="3.5"></path>
{/*  Occupied stroke (88%)  */}
<path className="text-primary-container stroke-current" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" strokeDasharray="88, 100" strokeLinecap="round" strokeWidth="3.5"></path>
</svg>
<div className="absolute inset-0 flex flex-col items-center justify-center">
<span className="font-headline-lg text-headline-lg font-bold text-primary-container font-mono leading-none">88%</span>
<span className="font-caption text-caption text-outline uppercase tracking-wider mt-1">Occupancy</span>
</div>
</div>
{/*  Metric rows  */}
<div className="space-y-space-xs mt-space-sm pt-space-xs border-t border-surface-container-high font-body-sm text-body-sm">
<div className="flex items-center justify-between py-1">
<span className="text-on-surface-variant">Total Chamber Capacity</span>
<span className="font-label-md text-label-md font-mono font-bold text-on-surface">16 Slots</span>
</div>
<div className="flex items-center justify-between py-1">
<span className="text-on-surface-variant">Occupied Pallets</span>
<span className="font-label-md text-label-md font-mono font-bold text-primary">14 Slots</span>
</div>
<div className="flex items-center justify-between py-1">
<span className="text-on-surface-variant">Available Bay Slots</span>
<span className="font-label-md text-label-md font-mono font-bold text-secondary">2 Slots</span>
</div>
<div className="flex items-center justify-between py-1">
<span className="text-on-surface-variant">Excursion Risk (Flagged)</span>
<span className="font-label-md text-label-md font-mono font-bold text-error">1 Lot (DEV-042)</span>
</div>
<div className="flex items-center justify-between py-1">
<span className="text-on-surface-variant">Avg Chamber Dwell Time</span>
<span className="font-label-md text-label-md font-mono font-semibold text-on-surface">38 mins</span>
</div>
</div>
</div>
{/*  Quick Cleanroom SOP Notice Card  */}
<div className="bg-surface-container-low rounded-lg p-space-md shadow-sm">
<div className="flex items-start gap-space-xs text-primary-container">
<span className="material-symbols-outlined text-[20px] text-secondary">verified_user</span>
<div>
<div className="font-headline-sm text-headline-sm font-bold text-primary-container leading-tight">SOP-CLD-012 Notice</div>
<div className="font-caption text-caption text-on-surface-variant font-mono mt-0.5">Rev 04 • Cleanroom Transit Hold</div>
</div>
</div>
<p className="font-body-sm text-body-sm text-on-surface mt-space-xs leading-relaxed">
          Maximum chamber transfer transit duration is strictly <strong>15 minutes</strong>. Rapid roll-up door closure must be maintained to prevent differential pressure and thermal leakage across ISO 7 boundary.
        </p>
<div className="mt-space-sm pt-space-xs border-t border-surface-container-high flex items-center justify-between">
<span className="font-caption text-caption text-outline">NIST Probe Sync</span>
<span className="font-label-sm text-label-sm text-secondary font-semibold font-mono">T- 00:01:42</span>
</div>
</div>
{/*  Cold Room Thermal Gradient Visual  */}
<div className="bg-surface-container-lowest rounded-lg p-space-md shadow-sm">
<div className="flex items-center justify-between mb-space-sm">
<span className="font-headline-sm text-headline-sm font-bold text-on-surface">Thermal Stratification</span>
<span className="font-label-sm text-label-sm text-outline font-mono">4-Pt Mesh</span>
</div>
<div className="space-y-space-xs font-caption text-caption">
<div className="flex items-center justify-between">
<span className="text-on-surface-variant">Top Tier (Shelf 04)</span>
<span className="font-mono font-semibold text-on-surface">+4.6°C</span>
</div>
<div className="w-full bg-surface-container-high h-1.5 rounded overflow-hidden">
<div className="bg-secondary-container h-full rounded" style={{"width":"58%"}}></div>
</div>
<div className="flex items-center justify-between pt-1">
<span className="text-on-surface-variant">Mid Tiers (Shelf 02-03)</span>
<span className="font-mono font-semibold text-on-surface">+4.2°C</span>
</div>
<div className="w-full bg-surface-container-high h-1.5 rounded overflow-hidden">
<div className="bg-primary-container h-full rounded" style={{"width":"52%"}}></div>
</div>
<div className="flex items-center justify-between pt-1">
<span className="text-on-surface-variant">Floor Tier (Shelf 01)</span>
<span className="font-mono font-semibold text-on-surface">+3.9°C</span>
</div>
<div className="w-full bg-surface-container-high h-1.5 rounded overflow-hidden">
<div className="bg-secondary h-full rounded" style={{"width":"48%"}}></div>
</div>
</div>
</div>
</div>
</div>
{/*  Interactive Place Pallet Modal (Hidden by Default)  */}
<div className="fixed inset-0 bg-inverse-surface/40 backdrop-blur-sm z-50 hidden flex items-center justify-center p-space-md" id="pallet-modal">
<div className="bg-surface-container-lowest rounded-lg shadow-xl max-w-lg w-full p-space-lg">
<div className="flex items-center justify-between pb-space-sm border-b border-surface-container-high mb-space-md">
<div className="flex items-center gap-space-xs">
<span className="material-symbols-outlined text-primary text-[22px]">add_box</span>
<span className="font-headline-sm text-headline-sm text-on-surface font-bold">Allocate Pallet to Bay</span>
</div>
<button className="min-h-[44px] min-w-[44px] text-outline hover:text-on-surface flex items-center justify-center transition-colors"  type="button">
<span className="material-symbols-outlined text-[20px]">close</span>
</button>
</div>
<div className="space-y-space-md">
<div className="bg-surface-container-low p-space-sm rounded">
<div className="font-caption text-caption text-outline uppercase font-bold">Target Location</div>
<div className="font-label-md text-label-md text-primary-container font-mono font-bold" id="modal-target-loc">RK-CR01-003 • Shelf S-04</div>
<div className="font-caption text-caption text-on-surface-variant">Chamber CR-01 (+2°C to +8°C Validated)</div>
</div>
<div>
<label className="block font-caption text-caption text-on-surface-variant uppercase font-semibold mb-1">Scan or Enter Pallet Barcode</label>
<div className="relative">
<input className="w-full min-h-[44px] px-space-sm py-2 bg-surface-container-low rounded text-on-surface font-mono font-semibold focus:outline-none focus:bg-surface-container-lowest focus:shadow-[0_0_0_2px_#0F5F7A]" id="modal-pallet-input" placeholder="e.g. PL-26-000140" type="text"/>
<span className="material-symbols-outlined absolute right-3 top-3 text-outline text-[20px]">qr_code_scanner</span>
</div>
</div>
<div className="grid grid-cols-2 gap-space-sm">
<div>
<label className="block font-caption text-caption text-on-surface-variant uppercase font-semibold mb-1">Product Formula</label>
<input className="w-full min-h-[44px] px-space-sm py-2 bg-surface-container rounded text-on-surface text-body-sm" readOnly type="text" defaultValue="Insulin Glargine 100 IU/mL"/>
</div>
<div>
<label className="block font-caption text-caption text-on-surface-variant uppercase font-semibold mb-1">Batch / Lot</label>
<input className="w-full min-h-[44px] px-space-sm py-2 bg-surface-container rounded text-on-surface font-mono text-body-sm" readOnly type="text" defaultValue="B260128 / LT-26A021"/>
</div>
</div>
<div className="bg-surface-container-low p-space-sm rounded flex items-center gap-space-xs text-secondary font-label-sm text-label-sm">
<span className="material-symbols-outlined text-[18px]">lock</span>
<span>Requires Operator E-Signature under 21 CFR Part 11</span>
</div>
</div>
<div className="mt-space-lg flex items-center justify-end gap-space-sm">
<button className="min-h-[44px] px-space-md rounded bg-surface-container hover:bg-surface-container-high text-on-surface font-label-md text-label-md font-medium transition-colors"  type="button">Cancel</button>
<button className="min-h-[44px] px-space-md rounded bg-primary-container hover:bg-primary text-on-primary font-label-md text-label-md font-bold transition-colors shadow-sm flex items-center gap-1"  type="button">
<span className="material-symbols-outlined text-[18px]">verified</span>
<span>Sign &amp; Place Pallet</span>
</button>
</div>
</div>
</div>
{/*  Inline Micro-interactions Script  */}

</div>
    </AppLayout>
  );
}
