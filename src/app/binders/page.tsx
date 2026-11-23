"use client";

import React from "react";
import Link from "next/link";
import AppLayout from "@/components/layout/AppLayout";

export default function BinderListPage() {
  return (
    <AppLayout screenCode="S06">
      <div className="flex flex-col w-full pb-12">
{/*  Dynamic Script for Navigation Highlight and Cleanroom Micro-interactions  */}

{/*  Top Breadcrumbs & Header Section  */}
<div className="flex flex-col gap-space-sm mb-space-md">
<div className="flex items-center gap-2 font-caption text-caption text-on-surface-variant">
<span className="hover:text-primary cursor-pointer transition-colors">Home</span>
<span className="material-symbols-outlined text-[13px] opacity-60">chevron_right</span>
<span className="hover:text-primary cursor-pointer transition-colors">Binders</span>
<span className="material-symbols-outlined text-[13px] opacity-60">chevron_right</span>
<span className="text-primary font-semibold">Batch Binder Register</span>
</div>
<div className="flex flex-col xl:flex-row xl:items-center justify-between gap-space-md">
<div className="flex flex-col">
<div className="flex items-center gap-space-sm flex-wrap">
<h1 className="font-headline-lg text-headline-lg text-on-surface font-semibold tracking-tight">S06 Binder List</h1>
<span className="inline-flex items-center px-2 py-0.5 rounded-full bg-secondary-fixed text-on-secondary-fixed font-label-sm text-label-sm font-semibold tracking-wide">
            Active Production Batches
          </span>
<span className="inline-flex items-center px-2 py-0.5 rounded bg-surface-container-high text-on-surface-variant font-label-sm text-label-sm font-mono">
            24 Total Binders
          </span>
</div>
<p className="font-body-md text-body-md text-on-surface-variant mt-1">
          Centralized GMP batch movement records, cold-chain compliance status, and electronic chain-of-custody tracking.
        </p>
</div>
{/*  Action Buttons  */}
<div className="flex items-center gap-space-sm flex-wrap">
<button className="min-h-[44px] px-3.5 py-2 rounded-lg bg-surface-container-lowest text-secondary font-headline-sm text-body-md font-semibold shadow-sm hover:bg-surface-container-low transition-colors flex items-center gap-2"  title="Toggle Empty State Simulator">
<span className="material-symbols-outlined text-[18px]">find_in_page</span>
<span>Simulate 0 Results</span>
</button>
<button className="min-h-[44px] px-3.5 py-2 rounded-lg bg-surface-container-lowest text-primary font-headline-sm text-body-md font-semibold shadow-sm hover:bg-surface-container-low transition-colors flex items-center gap-2">
<span className="material-symbols-outlined text-[18px]">qr_code_scanner</span>
<span>Scan Binder QR</span>
</button>
<button className="min-h-[44px] px-3.5 py-2 rounded-lg bg-surface-container-lowest text-on-surface font-headline-sm text-body-md font-semibold shadow-sm hover:bg-surface-container-low transition-colors flex items-center gap-2">
<span className="material-symbols-outlined text-[18px]">download</span>
<span>Export CSV / PDF</span>
</button>
<button className="min-h-[44px] px-4 py-2 rounded-lg bg-primary-container text-on-primary font-headline-sm text-body-md font-semibold shadow-sm hover:bg-primary transition-colors flex items-center gap-2">
<span className="material-symbols-outlined text-[20px]">add</span>
<span>+ New Binder</span>
</button>
</div>
</div>
</div>
{/*  Operational Metrics & Hold-Time Alert Strip  */}
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-space-sm mb-space-md">
<div className="p-space-sm rounded-lg bg-surface-container-lowest shadow-sm flex items-center gap-3">
<div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
<span className="material-symbols-outlined text-[22px]">inventory_2</span>
</div>
<div className="flex flex-col min-w-0">
<span className="font-caption text-caption text-on-surface-variant uppercase tracking-wider">In Cold Room</span>
<span className="font-headline-sm text-headline-sm font-semibold text-on-surface">14 Batches</span>
</div>
</div>
<div className="p-space-sm rounded-lg bg-surface-container-lowest shadow-sm flex items-center gap-3">
<div className="w-10 h-10 rounded-lg bg-secondary-fixed/50 flex items-center justify-center text-secondary">
<span className="material-symbols-outlined text-[22px]">visibility</span>
</div>
<div className="flex flex-col min-w-0">
<span className="font-caption text-caption text-on-surface-variant uppercase tracking-wider">Visual Inspection</span>
<span className="font-headline-sm text-headline-sm font-semibold text-on-surface">6 Batches</span>
</div>
</div>
<div className="p-space-sm rounded-lg bg-surface-container-lowest shadow-sm flex items-center gap-3">
<div className="w-10 h-10 rounded-lg bg-error-container/40 flex items-center justify-center text-error">
<span className="material-symbols-outlined text-[22px]">timer_off</span>
</div>
<div className="flex flex-col min-w-0">
<span className="font-caption text-caption text-on-surface-variant uppercase tracking-wider">Critical Hold-Time (&gt;80%)</span>
<span className="font-headline-sm text-headline-sm font-semibold text-error font-mono">1 Lot Exceeded</span>
</div>
</div>
<div className="p-space-sm rounded-lg bg-surface-container-lowest shadow-sm flex items-center gap-3">
<div className="w-10 h-10 rounded-lg bg-surface-container-high flex items-center justify-center text-on-surface-variant">
<span className="material-symbols-outlined text-[22px]">fact_check</span>
</div>
<div className="flex flex-col min-w-0">
<span className="font-caption text-caption text-on-surface-variant uppercase tracking-wider">Avg Transfer Time</span>
<span className="font-headline-sm text-headline-sm font-semibold text-on-surface font-mono">28m 14s</span>
</div>
</div>
</div>
{/*  Search & Enterprise Filtering Toolbar  */}
<div className="bg-surface-container-lowest rounded-lg p-space-sm shadow-sm flex flex-col gap-space-sm mb-space-sm">
<div className="flex flex-col lg:flex-row items-stretch lg:items-center gap-space-sm">
{/*  Search Field  */}
<div className="relative flex-1 min-w-[280px]">
<span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[18px] text-on-surface-variant">search</span>
<input className="w-full min-h-[44px] pl-9 pr-12 rounded-lg bg-surface-container-low text-on-surface font-body-md text-body-md placeholder:text-on-surface-variant/70 focus:outline-none focus:bg-surface-container-lowest focus:shadow-[0_0_0_2px_#0F5F7A] transition-all" placeholder="Search product, strength, lot, batch…" type="text"/>
<div className="absolute right-3 top-1/2 -translate-y-1/2 px-1.5 py-0.5 rounded bg-surface-container text-on-surface-variant font-label-sm text-[10px] font-mono shadow-xs">
          ⌘K
        </div>
</div>
{/*  Quick Filter Selectors  */}
<div className="flex items-center gap-space-xs flex-wrap">
{/*  Cold Room Selector  */}
<div className="relative min-w-[130px]">
<select className="w-full min-h-[44px] appearance-none pl-3 pr-8 py-2 rounded-lg bg-surface-container-low font-body-sm text-body-sm text-on-surface font-medium focus:outline-none focus:bg-surface-container-lowest cursor-pointer">
<option>Cold Room: All</option>
<option>CR-01 (Clean A)</option>
<option>CR-02 (Clean B)</option>
</select>
<span className="material-symbols-outlined absolute right-2.5 top-1/2 -translate-y-1/2 text-[16px] text-on-surface-variant pointer-events-none">expand_more</span>
</div>
{/*  Department / Line Selector  */}
<div className="relative min-w-[160px]">
<select className="w-full min-h-[44px] appearance-none pl-3 pr-8 py-2 rounded-lg bg-surface-container-low font-body-sm text-body-sm text-on-surface font-medium focus:outline-none focus:bg-surface-container-lowest cursor-pointer">
<option>Line: All Packaging</option>
<option>Packaging Line 2</option>
<option>Packaging Line 4</option>
</select>
<span className="material-symbols-outlined absolute right-2.5 top-1/2 -translate-y-1/2 text-[16px] text-on-surface-variant pointer-events-none">expand_more</span>
</div>
{/*  Date Range Filter  */}
<div className="flex items-center gap-2 min-h-[44px] px-3 rounded-lg bg-surface-container-low text-on-surface font-body-sm text-body-sm cursor-pointer hover:bg-surface-container">
<span className="material-symbols-outlined text-[16px] text-secondary">calendar_today</span>
<span>Last 7 Days (20/02/2025 - 26/02/2025)</span>
<span className="material-symbols-outlined text-[16px] text-on-surface-variant">arrow_drop_down</span>
</div>
</div>
</div>
{/*  Status Filter Chips and Active Pills  */}
<div className="flex items-center justify-between gap-space-sm pt-2 flex-wrap">
<div className="flex items-center gap-1.5 flex-wrap">
<span className="font-caption text-caption text-on-surface-variant uppercase font-semibold mr-1">Status:</span>
<button className="filter-chip min-h-[44px] px-3 py-1.5 rounded-lg bg-primary text-on-primary font-body-sm text-body-sm font-semibold transition-all">
          All (24)
        </button>
<button className="filter-chip min-h-[44px] px-3 py-1.5 rounded-lg bg-surface-container-low text-on-surface-variant hover:text-on-surface font-body-sm text-body-sm font-medium transition-all">
          In Progress
        </button>
<button className="filter-chip min-h-[44px] px-3 py-1.5 rounded-lg bg-surface-container-low text-on-surface-variant hover:text-on-surface font-body-sm text-body-sm font-medium transition-all">
          In Cold Room (14)
        </button>
<button className="filter-chip min-h-[44px] px-3 py-1.5 rounded-lg bg-surface-container-low text-on-surface-variant hover:text-on-surface font-body-sm text-body-sm font-medium transition-all">
          Visual Inspection (6)
        </button>
<button className="filter-chip min-h-[44px] px-3 py-1.5 rounded-lg bg-surface-container-low text-on-surface-variant hover:text-on-surface font-body-sm text-body-sm font-medium transition-all">
          Quarantine (1)
        </button>
<button className="filter-chip min-h-[44px] px-3 py-1.5 rounded-lg bg-surface-container-low text-on-surface-variant hover:text-on-surface font-body-sm text-body-sm font-medium transition-all">
          Completed (3)
        </button>
</div>
<div className="flex items-center gap-2">
<span className="font-caption text-caption text-on-surface-variant">Showing active filters:</span>
<div className="flex items-center gap-1 px-2 py-1 rounded bg-surface-container text-on-surface font-label-sm text-label-sm">
<span>Date: 7D</span>
<button className="hover:text-error transition-colors flex items-center"><span className="material-symbols-outlined text-[14px]">close</span></button>
</div>
<button className="min-h-[44px] px-2 text-primary font-body-sm text-body-sm font-semibold hover:underline">
          Reset all
        </button>
</div>
</div>
</div>
{/*  Empty State Simulated Preview Container (collapsible toggleable)  */}
<div className="hidden mb-space-sm" id="empty-state-preview">
<div className="bg-surface-container-lowest rounded-lg p-space-xl shadow-sm flex flex-col items-center justify-center text-center">
<div className="w-16 h-16 rounded-full bg-surface-container-low flex items-center justify-center text-on-surface-variant mb-space-md">
<span className="material-symbols-outlined text-[36px] text-secondary">find_in_page</span>
</div>
<h3 className="font-headline-md text-headline-md text-on-surface font-semibold mb-1">
        No binders match the  filter criteria
      </h3>
<p className="font-body-md text-body-md text-on-surface-variant max-w-lg mb-space-lg">
        Try adjusting your search query, status filters, or date range to locate GMP batch records.
      </p>
<div className="flex items-center gap-space-sm">
<button className="min-h-[44px] px-4 py-2 rounded-lg bg-surface-container text-on-surface font-headline-sm text-body-md font-semibold hover:bg-surface-container-high transition-colors" >
          Clear all filters
        </button>
<button className="min-h-[44px] px-4 py-2 rounded-lg bg-primary-container text-on-primary font-headline-sm text-body-md font-semibold hover:bg-primary transition-colors flex items-center gap-2">
<span className="material-symbols-outlined text-[18px]">add</span>
<span>+ Create new binder</span>
</button>
</div>
</div>
</div>
{/*  Sortable High-Density Table Area  */}
<div className="bg-surface-container-lowest rounded-lg shadow-sm overflow-hidden flex flex-col transition-opacity" id="batch-table-container">
<div className="overflow-x-auto">
<table className="w-full text-left border-collapse">
<thead>
<tr className="bg-surface-container-low text-on-surface-variant font-label-md text-label-md select-none">
<th className="py-3 px-space-md min-w-[160px] font-semibold">
<div className="flex items-center gap-1 cursor-pointer hover:text-on-surface">
<span>Product</span>
<span className="material-symbols-outlined text-[14px]">unfold_more</span>
</div>
</th>
<th className="py-3 px-space-md min-w-[120px] font-semibold">
<div className="flex items-center gap-1 cursor-pointer hover:text-on-surface">
<span>Strength</span>
<span className="material-symbols-outlined text-[14px]">unfold_more</span>
</div>
</th>
<th className="py-3 px-space-md min-w-[120px] font-semibold">
<div className="flex items-center gap-1 cursor-pointer hover:text-on-surface">
<span>Lot No.</span>
<span className="material-symbols-outlined text-[14px] text-primary">arrow_downward</span>
</div>
</th>
<th className="py-3 px-space-md min-w-[110px] font-semibold">
<div className="flex items-center gap-1 cursor-pointer hover:text-on-surface">
<span>Batch No.</span>
<span className="material-symbols-outlined text-[14px]">unfold_more</span>
</div>
</th>
<th className="py-3 px-space-md min-w-[170px] font-semibold">
<div className="flex items-center gap-1 cursor-pointer hover:text-on-surface">
<span>Filling Transfer</span>
<span className="material-symbols-outlined text-[14px]">unfold_more</span>
</div>
</th>
<th className="py-3 px-space-md min-w-[150px] font-semibold">
<div className="flex items-center gap-1 cursor-pointer hover:text-on-surface">
<span>Status</span>
<span className="material-symbols-outlined text-[14px]">unfold_more</span>
</div>
</th>
<th className="py-3 px-space-md min-w-[170px] font-semibold">
<div className="flex items-center gap-1 cursor-pointer hover:text-on-surface">
<span>Location Context</span>
<span className="material-symbols-outlined text-[14px]">unfold_more</span>
</div>
</th>
<th className="py-3 px-space-md min-w-[160px] font-semibold">
<div className="flex items-center gap-1 cursor-pointer hover:text-on-surface">
<span>Hold-Time</span>
<span className="material-symbols-outlined text-[14px]">unfold_more</span>
</div>
</th>
<th className="py-3 px-space-md min-w-[210px] font-semibold">
<div className="flex items-center gap-1 cursor-pointer hover:text-on-surface">
<span>Last Movement</span>
<span className="material-symbols-outlined text-[14px]">unfold_more</span>
</div>
</th>
<th className="py-3 px-space-md text-right font-semibold min-w-[90px]">Actions</th>
</tr>
</thead>
<tbody className="font-body-md text-body-md text-on-surface divide-y divide-surface-container-high/40">
{/*  ROW 1  */}
<tr className="hover:bg-surface-container-low/60 transition-colors group">
<td className="py-3 px-space-md font-semibold text-on-surface whitespace-nowrap">
<div className="flex items-center gap-2">
<span className="w-2 h-2 rounded-full bg-secondary"></span>
<span>Insulin Glargine</span>
</div>
</td>
<td className="py-3 px-space-md text-on-surface-variant whitespace-nowrap">100 IU/mL</td>
<td className="py-3 px-space-md font-label-md text-label-md font-mono font-semibold text-primary whitespace-nowrap">
              LT-26A017
            </td>
<td className="py-3 px-space-md font-label-md text-label-md font-mono text-on-surface-variant whitespace-nowrap">
              B260117
            </td>
<td className="py-3 px-space-md font-label-sm text-label-sm font-mono text-on-surface-variant whitespace-nowrap">
              26/02/2025 09:15
            </td>
<td className="py-3 px-space-md whitespace-nowrap">
<span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-secondary-fixed text-on-secondary-fixed font-label-sm text-label-sm font-semibold">
<span className="w-1.5 h-1.5 rounded-full bg-secondary"></span>
                In Visual Insp
              </span>
</td>
<td className="py-3 px-space-md font-label-sm text-label-sm font-mono text-on-surface whitespace-nowrap">
              Pallet PL-26-000124
            </td>
<td className="py-3 px-space-md whitespace-nowrap">
<div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded bg-surface-container-high text-on-surface-variant font-label-sm text-label-sm font-mono">
<span className="material-symbols-outlined text-[14px] text-tertiary">warning</span>
<span>0h 54m <span className="opacity-70">(Lim: 1h)</span></span>
</div>
</td>
<td className="py-3 px-space-md whitespace-nowrap">
<div className="flex flex-col">
<span className="font-label-sm text-[11px] font-mono text-on-surface">26/02/2025 14:28</span>
<span className="font-caption text-caption text-on-surface-variant">Anita Shah (Packaging Lead)</span>
</div>
</td>
<td className="py-3 px-space-md text-right whitespace-nowrap">
<div className="flex items-center justify-end gap-1">
<button aria-label="View Batch Details" className="min-h-[44px] min-w-[44px] flex items-center justify-center rounded-lg text-on-surface-variant hover:text-primary hover:bg-surface-container transition-colors">
<span className="material-symbols-outlined text-[18px]">visibility</span>
</button>
<button aria-label="Edit Batch Details" className="min-h-[44px] min-w-[44px] flex items-center justify-center rounded-lg text-on-surface-variant hover:text-primary hover:bg-surface-container transition-colors">
<span className="material-symbols-outlined text-[18px]">edit</span>
</button>
</div>
</td>
</tr>
{/*  ROW 2: Excursion / Critical Hold  */}
<tr className="hover:bg-error-container/10 transition-colors bg-error-container/5 group">
<td className="py-3 px-space-md font-semibold text-on-surface whitespace-nowrap">
<div className="flex items-center gap-2">
<span className="w-2 h-2 rounded-full bg-error animate-pulse"></span>
<span>Filgrastim</span>
</div>
</td>
<td className="py-3 px-space-md text-on-surface-variant whitespace-nowrap">300 mcg/0.5 mL</td>
<td className="py-3 px-space-md font-label-md text-label-md font-mono font-semibold text-error whitespace-nowrap">
              LT-26A014
            </td>
<td className="py-3 px-space-md font-label-md text-label-md font-mono text-on-surface-variant whitespace-nowrap">
              B260114
            </td>
<td className="py-3 px-space-md font-label-sm text-label-sm font-mono text-on-surface-variant whitespace-nowrap">
              26/02/2025 08:30
            </td>
<td className="py-3 px-space-md whitespace-nowrap">
<span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-error-container text-on-error-container font-label-sm text-label-sm font-bold">
<span className="w-1.5 h-1.5 rounded-full bg-error"></span>
                Excursion Review
              </span>
</td>
<td className="py-3 px-space-md font-label-sm text-label-sm font-mono text-on-surface whitespace-nowrap">
              CR-01 / RK-CR01-002
            </td>
<td className="py-3 px-space-md whitespace-nowrap">
<div className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-error text-on-error font-label-sm text-label-sm font-mono font-bold">
<span className="material-symbols-outlined text-[14px]">alarm_on</span>
<span>1h 04m (EXCEEDED)</span>
</div>
</td>
<td className="py-3 px-space-md whitespace-nowrap">
<div className="flex flex-col">
<span className="font-label-sm text-[11px] font-mono text-on-surface">26/02/2025 14:15</span>
<span className="font-caption text-caption text-on-surface-variant">Anita Shah (Packaging Lead)</span>
</div>
</td>
<td className="py-3 px-space-md text-right whitespace-nowrap">
<div className="flex items-center justify-end gap-1">
<button aria-label="View Batch Details" className="min-h-[44px] min-w-[44px] flex items-center justify-center rounded-lg text-on-surface-variant hover:text-error hover:bg-error-container/30 transition-colors">
<span className="material-symbols-outlined text-[18px]">visibility</span>
</button>
<button aria-label="Edit Batch Details" className="min-h-[44px] min-w-[44px] flex items-center justify-center rounded-lg text-on-surface-variant hover:text-error hover:bg-error-container/30 transition-colors">
<span className="material-symbols-outlined text-[18px]">edit</span>
</button>
</div>
</td>
</tr>
{/*  ROW 3  */}
<tr className="hover:bg-surface-container-low/60 transition-colors group">
<td className="py-3 px-space-md font-semibold text-on-surface whitespace-nowrap">
<div className="flex items-center gap-2">
<span className="w-2 h-2 rounded-full bg-primary"></span>
<span>Adalimumab</span>
</div>
</td>
<td className="py-3 px-space-md text-on-surface-variant whitespace-nowrap">40 mg/0.8 mL</td>
<td className="py-3 px-space-md font-label-md text-label-md font-mono font-semibold text-primary whitespace-nowrap">
              LT-26A018
            </td>
<td className="py-3 px-space-md font-label-md text-label-md font-mono text-on-surface-variant whitespace-nowrap">
              B260118
            </td>
<td className="py-3 px-space-md font-label-sm text-label-sm font-mono text-on-surface-variant whitespace-nowrap">
              26/02/2025 10:45
            </td>
<td className="py-3 px-space-md whitespace-nowrap">
<span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-primary-fixed text-on-primary-fixed font-label-sm text-label-sm font-semibold">
<span className="w-1.5 h-1.5 rounded-full bg-primary"></span>
                In Cold Room
              </span>
</td>
<td className="py-3 px-space-md font-label-sm text-label-sm font-mono text-on-surface whitespace-nowrap">
              CR-02 / RK-CR02-004
            </td>
<td className="py-3 px-space-md whitespace-nowrap">
<div className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-surface-container-high text-on-surface-variant font-label-sm text-label-sm font-mono">
<span className="material-symbols-outlined text-[14px] text-tertiary">schedule</span>
<span>0h 51m (85%)</span>
</div>
</td>
<td className="py-3 px-space-md whitespace-nowrap">
<div className="flex flex-col">
<span className="font-label-sm text-[11px] font-mono text-on-surface">26/02/2025 13:50</span>
<span className="font-caption text-caption text-on-surface-variant">Anita Shah (Packaging Lead)</span>
</div>
</td>
<td className="py-3 px-space-md text-right whitespace-nowrap">
<div className="flex items-center justify-end gap-1">
<button aria-label="View Batch Details" className="min-h-[44px] min-w-[44px] flex items-center justify-center rounded-lg text-on-surface-variant hover:text-primary hover:bg-surface-container transition-colors">
<span className="material-symbols-outlined text-[18px]">visibility</span>
</button>
<button aria-label="Edit Batch Details" className="min-h-[44px] min-w-[44px] flex items-center justify-center rounded-lg text-on-surface-variant hover:text-primary hover:bg-surface-container transition-colors">
<span className="material-symbols-outlined text-[18px]">edit</span>
</button>
</div>
</td>
</tr>
{/*  ROW 4  */}
<tr className="hover:bg-surface-container-low/60 transition-colors group">
<td className="py-3 px-space-md font-semibold text-on-surface whitespace-nowrap">
<div className="flex items-center gap-2">
<span className="w-2 h-2 rounded-full bg-tertiary"></span>
<span>Insulin Glargine</span>
</div>
</td>
<td className="py-3 px-space-md text-on-surface-variant whitespace-nowrap">100 IU/mL</td>
<td className="py-3 px-space-md font-label-md text-label-md font-mono font-semibold text-primary whitespace-nowrap">
              LT-26A019
            </td>
<td className="py-3 px-space-md font-label-md text-label-md font-mono text-on-surface-variant whitespace-nowrap">
              B260119
            </td>
<td className="py-3 px-space-md font-label-sm text-label-sm font-mono text-on-surface-variant whitespace-nowrap">
              26/02/2025 11:20
            </td>
<td className="py-3 px-space-md whitespace-nowrap">
<span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-surface-container-highest text-on-surface font-label-sm text-label-sm font-semibold">
<span className="w-1.5 h-1.5 rounded-full bg-tertiary"></span>
                Filling Buffer
              </span>
</td>
<td className="py-3 px-space-md font-label-sm text-label-sm font-mono text-on-surface whitespace-nowrap">
              Pallet PL-26-000129
            </td>
<td className="py-3 px-space-md whitespace-nowrap">
<div className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-surface-container-high text-on-surface-variant font-label-sm text-label-sm font-mono">
<span className="material-symbols-outlined text-[14px] text-tertiary">schedule</span>
<span>0h 48m (80%)</span>
</div>
</td>
<td className="py-3 px-space-md whitespace-nowrap">
<div className="flex flex-col">
<span className="font-label-sm text-[11px] font-mono text-on-surface">26/02/2025 13:12</span>
<span className="font-caption text-caption text-on-surface-variant">Anita Shah (Packaging Lead)</span>
</div>
</td>
<td className="py-3 px-space-md text-right whitespace-nowrap">
<div className="flex items-center justify-end gap-1">
<button aria-label="View Batch Details" className="min-h-[44px] min-w-[44px] flex items-center justify-center rounded-lg text-on-surface-variant hover:text-primary hover:bg-surface-container transition-colors">
<span className="material-symbols-outlined text-[18px]">visibility</span>
</button>
<button aria-label="Edit Batch Details" className="min-h-[44px] min-w-[44px] flex items-center justify-center rounded-lg text-on-surface-variant hover:text-primary hover:bg-surface-container transition-colors">
<span className="material-symbols-outlined text-[18px]">edit</span>
</button>
</div>
</td>
</tr>
{/*  ROW 5  */}
<tr className="hover:bg-surface-container-low/60 transition-colors group">
<td className="py-3 px-space-md font-semibold text-on-surface whitespace-nowrap">
<div className="flex items-center gap-2">
<span className="w-2 h-2 rounded-full bg-primary"></span>
<span>Filgrastim</span>
</div>
</td>
<td className="py-3 px-space-md text-on-surface-variant whitespace-nowrap">300 mcg/0.5 mL</td>
<td className="py-3 px-space-md font-label-md text-label-md font-mono font-semibold text-primary whitespace-nowrap">
              LT-26A020
            </td>
<td className="py-3 px-space-md font-label-md text-label-md font-mono text-on-surface-variant whitespace-nowrap">
              B260120
            </td>
<td className="py-3 px-space-md font-label-sm text-label-sm font-mono text-on-surface-variant whitespace-nowrap">
              26/02/2025 13:00
            </td>
<td className="py-3 px-space-md whitespace-nowrap">
<span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-primary-fixed text-on-primary-fixed font-label-sm text-label-sm font-semibold">
<span className="w-1.5 h-1.5 rounded-full bg-primary"></span>
                In Cold Room
              </span>
</td>
<td className="py-3 px-space-md font-label-sm text-label-sm font-mono text-on-surface whitespace-nowrap">
              CR-01 / RK-CR01-001
            </td>
<td className="py-3 px-space-md whitespace-nowrap">
<div className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-surface-container text-on-surface-variant font-label-sm text-label-sm font-mono">
<span className="material-symbols-outlined text-[14px] text-secondary">check_circle</span>
<span>0h 22m OK</span>
</div>
</td>
<td className="py-3 px-space-md whitespace-nowrap">
<div className="flex flex-col">
<span className="font-label-sm text-[11px] font-mono text-on-surface">26/02/2025 13:30</span>
<span className="font-caption text-caption text-on-surface-variant">Anita Shah (Packaging Lead)</span>
</div>
</td>
<td className="py-3 px-space-md text-right whitespace-nowrap">
<div className="flex items-center justify-end gap-1">
<button aria-label="View Batch Details" className="min-h-[44px] min-w-[44px] flex items-center justify-center rounded-lg text-on-surface-variant hover:text-primary hover:bg-surface-container transition-colors">
<span className="material-symbols-outlined text-[18px]">visibility</span>
</button>
<button aria-label="Edit Batch Details" className="min-h-[44px] min-w-[44px] flex items-center justify-center rounded-lg text-on-surface-variant hover:text-primary hover:bg-surface-container transition-colors">
<span className="material-symbols-outlined text-[18px]">edit</span>
</button>
</div>
</td>
</tr>
{/*  ROW 6  */}
<tr className="hover:bg-surface-container-low/60 transition-colors group">
<td className="py-3 px-space-md font-semibold text-on-surface whitespace-nowrap">
<div className="flex items-center gap-2">
<span className="w-2 h-2 rounded-full bg-secondary"></span>
<span>Adalimumab</span>
</div>
</td>
<td className="py-3 px-space-md text-on-surface-variant whitespace-nowrap">40 mg/0.8 mL</td>
<td className="py-3 px-space-md font-label-md text-label-md font-mono font-semibold text-primary whitespace-nowrap">
              LT-26A021
            </td>
<td className="py-3 px-space-md font-label-md text-label-md font-mono text-on-surface-variant whitespace-nowrap">
              B260121
            </td>
<td className="py-3 px-space-md font-label-sm text-label-sm font-mono text-on-surface-variant whitespace-nowrap">
              26/02/2025 13:45
            </td>
<td className="py-3 px-space-md whitespace-nowrap">
<span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-secondary-container text-on-secondary-container font-label-sm text-label-sm font-semibold">
<span className="w-1.5 h-1.5 rounded-full bg-secondary"></span>
                Stage 1 Packing
              </span>
</td>
<td className="py-3 px-space-md font-label-sm text-label-sm font-mono text-on-surface whitespace-nowrap">
              Line 04 Buffer
            </td>
<td className="py-3 px-space-md whitespace-nowrap">
<div className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-surface-container text-on-surface-variant font-label-sm text-label-sm font-mono">
<span className="material-symbols-outlined text-[14px] text-secondary">check_circle</span>
<span>0h 14m OK</span>
</div>
</td>
<td className="py-3 px-space-md whitespace-nowrap">
<div className="flex flex-col">
<span className="font-label-sm text-[11px] font-mono text-on-surface">26/02/2025 14:02</span>
<span className="font-caption text-caption text-on-surface-variant">Anita Shah (Packaging Lead)</span>
</div>
</td>
<td className="py-3 px-space-md text-right whitespace-nowrap">
<div className="flex items-center justify-end gap-1">
<button aria-label="View Batch Details" className="min-h-[44px] min-w-[44px] flex items-center justify-center rounded-lg text-on-surface-variant hover:text-primary hover:bg-surface-container transition-colors">
<span className="material-symbols-outlined text-[18px]">visibility</span>
</button>
<button aria-label="Edit Batch Details" className="min-h-[44px] min-w-[44px] flex items-center justify-center rounded-lg text-on-surface-variant hover:text-primary hover:bg-surface-container transition-colors">
<span className="material-symbols-outlined text-[18px]">edit</span>
</button>
</div>
</td>
</tr>
</tbody>
</table>
</div>
{/*  Table Pagination & Footer Controls  */}
<div className="flex flex-col sm:flex-row items-center justify-between gap-space-sm p-space-sm bg-surface-container-lowest">
<div className="flex items-center gap-space-md">
<span className="font-body-sm text-body-sm text-on-surface-variant">
          Showing <span className="font-semibold text-on-surface font-mono">1 - 6</span> of <span className="font-semibold text-on-surface font-mono">24</span> entries
        </span>
<div className="flex items-center gap-1">
<label className="font-caption text-caption text-on-surface-variant">Rows per page:</label>
<select className="min-h-[44px] px-2 py-1 rounded bg-surface-container-low text-on-surface font-label-sm text-label-sm focus:outline-none">
<option>10</option>
<option>25</option>
<option>50</option>
</select>
</div>
</div>
{/*  Page Selectors  */}
<div className="flex items-center gap-1">
<button className="min-h-[44px] px-3 py-1.5 rounded-lg bg-surface-container-low text-on-surface-variant hover:text-on-surface hover:bg-surface-container transition-colors font-body-sm text-body-sm font-semibold disabled:opacity-40" disabled>
          Previous
        </button>
<button className="min-h-[44px] min-w-[44px] flex items-center justify-center rounded-lg bg-primary-container text-on-primary font-label-md text-label-md font-semibold shadow-xs">
          1
        </button>
<button className="min-h-[44px] min-w-[44px] flex items-center justify-center rounded-lg bg-surface-container-low text-on-surface-variant hover:text-on-surface hover:bg-surface-container font-label-md text-label-md font-semibold transition-colors">
          2
        </button>
<button className="min-h-[44px] min-w-[44px] flex items-center justify-center rounded-lg bg-surface-container-low text-on-surface-variant hover:text-on-surface hover:bg-surface-container font-label-md text-label-md font-semibold transition-colors">
          3
        </button>
<button className="min-h-[44px] min-w-[44px] flex items-center justify-center rounded-lg bg-surface-container-low text-on-surface-variant hover:text-on-surface hover:bg-surface-container font-label-md text-label-md font-semibold transition-colors">
          4
        </button>
<button className="min-h-[44px] px-3 py-1.5 rounded-lg bg-surface-container-low text-on-surface-variant hover:text-on-surface hover:bg-surface-container transition-colors font-body-sm text-body-sm font-semibold">
          Next
        </button>
</div>
</div>
</div>
{/*  Compliance & Audit Notice Card  */}
<div className="mt-space-md p-space-sm rounded-lg bg-surface-container-low flex flex-col md:flex-row items-start md:items-center justify-between gap-space-sm">
<div className="flex items-center gap-space-sm">
<span className="material-symbols-outlined text-[20px] text-secondary">verified_user</span>
<div className="flex flex-col">
<span className="font-label-sm text-label-sm font-semibold text-on-surface">GMP Electronic Records (21 CFR Part 11)</span>
<span className="font-caption text-caption text-on-surface-variant">All batch record updates, cold-room timestamps, and operator actions are cryptographically logged with immutable audit trails.</span>
</div>
</div>
<div className="flex items-center gap-space-sm pl-space-xs font-label-sm text-label-sm text-on-surface-variant font-mono">
<span>System Signature: eSig-SHA256-OK</span>
<span>•</span>
<span>Line 04 Active</span>
</div>
</div>
</div>
    </AppLayout>
  );
}
