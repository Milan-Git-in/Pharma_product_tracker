"use client";

import React from "react";
import Link from "next/link";
import AppLayout from "@/components/layout/AppLayout";

export default function BackupRestoreSystemStatusPage() {
  return (
    <AppLayout screenCode="S24">
      <div className="flex flex-col w-full">
{/*  Top Command & Action Bar  */}
<div className="px-space-lg py-space-md bg-surface-container-lowest shadow-sm flex flex-col xl:flex-row xl:items-center xl:justify-between gap-space-md">
<div className="flex flex-col gap-0.5">
<div className="flex items-center gap-space-sm">
<span className="px-2 py-0.5 rounded bg-primary-container text-on-primary font-label-sm text-label-sm font-semibold tracking-wider">S24</span>
<h1 className="font-headline-lg text-headline-lg text-primary font-bold tracking-tight">Backup, Restore &amp; System Status</h1>
<span className="px-2.5 py-0.5 rounded-full bg-secondary-container text-on-secondary-container font-label-sm text-label-sm font-medium flex items-center gap-1">
<span className="material-symbols-outlined text-[14px]">verified_user</span>
          21 CFR §11.10(c)
        </span>
</div>
<p className="font-body-md text-body-md text-on-surface-variant max-w-3xl">
        Administer continuous cryptographic backups, verify disaster recovery points, and inspect NTP server synchronization under 21 CFR §11.10(c).
      </p>
</div>
{/*  Top Action Controls  */}
<div className="flex items-center flex-wrap gap-space-sm">
<button className="min-h-[44px] px-space-md rounded-lg bg-surface-container-low hover:bg-surface-container text-on-surface font-body-sm text-body-sm font-semibold transition-colors flex items-center gap-space-xs shadow-sm" type="button">
<span className="material-symbols-outlined text-secondary text-[18px]">verified</span>
<span>System Health Check</span>
</button>
<button className="min-h-[44px] px-space-md rounded-lg bg-surface-container-low hover:bg-surface-container text-on-surface font-body-sm text-body-sm font-semibold transition-colors flex items-center gap-space-xs shadow-sm" type="button">
<span className="material-symbols-outlined text-primary text-[18px]">download_for_offline</span>
<span>Download System Dump (Encrypted)</span>
</button>
<button className="min-h-[44px] px-space-lg rounded-lg bg-primary-container hover:bg-primary text-on-primary font-body-sm text-body-sm font-semibold transition-all flex items-center gap-space-xs shadow-sm hover:shadow" id="btn-backup-now" type="button">
<span className="material-symbols-outlined text-[18px]">cloud_upload</span>
<span>Backup Now</span>
</button>
</div>
</div>
{/*  Four Operational Status Cards  */}
<div className="p-space-lg">
<div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-space-md">
{/*  Card 1: Server Time Sync  */}
<div className="bg-surface-container-lowest rounded-xl p-space-md shadow-sm relative overflow-hidden flex flex-col justify-between">
<div className="flex items-start justify-between gap-space-sm mb-space-sm">
<div className="flex items-center gap-space-xs">
<div className="w-8 h-8 rounded-lg bg-surface-container-low flex items-center justify-center text-primary">
<span className="material-symbols-outlined text-[18px]">nest_clock_farsight_analog</span>
</div>
<span className="font-caption text-caption text-on-surface-variant font-semibold uppercase tracking-wider">Server Time Sync</span>
</div>
<span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-surface-container text-on-surface font-label-sm text-label-sm font-semibold">
<span className="w-2 h-2 rounded-full bg-emerald-600 animate-ping"></span>
<span>OK (NTP Str-1 Active)</span>
</span>
</div>
<div className="my-space-xs">
<div className="font-headline-md text-headline-md font-bold text-on-surface font-label-md">Offset +0 s (±0.04 ms)</div>
<div className="font-caption text-caption text-on-surface-variant mt-1">Synchronized with secure NTP time server. Last sync 12s ago.</div>
</div>
<div className="pt-space-xs flex items-center justify-between text-outline text-caption font-caption">
<span className="flex items-center gap-1 font-label-sm text-label-sm">
<span className="material-symbols-outlined text-[14px]">lock</span> RFC 5905 Authenticated
          </span>
<span className="font-label-sm text-label-sm font-semibold text-secondary">Stratum 1</span>
</div>
</div>
{/*  Card 2: Company LAN Server  */}
<div className="bg-surface-container-lowest rounded-xl p-space-md shadow-sm relative overflow-hidden flex flex-col justify-between">
<div className="flex items-start justify-between gap-space-sm mb-space-sm">
<div className="flex items-center gap-space-xs">
<div className="w-8 h-8 rounded-lg bg-surface-container-low flex items-center justify-center text-primary">
<span className="material-symbols-outlined text-[18px]">dns</span>
</div>
<span className="font-caption text-caption text-on-surface-variant font-semibold uppercase tracking-wider">Company LAN Server</span>
</div>
<span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-surface-container text-on-surface font-label-sm text-label-sm font-semibold">
<span className="w-2 h-2 rounded-full bg-emerald-600"></span>
<span>Connected</span>
</span>
</div>
<div className="my-space-xs">
<div className="font-headline-md text-headline-md font-bold text-on-surface font-label-md">10.14.82.10:443 (TLS 1.3)</div>
<div className="font-caption text-caption text-on-surface-variant mt-1">Cleanroom Line 04 Gateway · Round-trip latency: 3ms</div>
</div>
<div className="pt-space-xs flex items-center justify-between text-outline text-caption font-caption">
<span className="flex items-center gap-1 font-label-sm text-label-sm">
<span className="material-symbols-outlined text-[14px]">network_ping</span> Jitter &lt; 0.2ms
          </span>
<span className="font-label-sm text-label-sm font-semibold text-secondary">AES-256-GCM</span>
</div>
</div>
{/*  Card 3: Last Auto Backup  */}
<div className="bg-surface-container-lowest rounded-xl p-space-md shadow-sm relative overflow-hidden flex flex-col justify-between">
<div className="flex items-start justify-between gap-space-sm mb-space-sm">
<div className="flex items-center gap-space-xs">
<div className="w-8 h-8 rounded-lg bg-surface-container-low flex items-center justify-center text-primary">
<span className="material-symbols-outlined text-[18px]">inventory_2</span>
</div>
<span className="font-caption text-caption text-on-surface-variant font-semibold uppercase tracking-wider">Last Auto Backup</span>
</div>
<span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-surface-container text-on-surface font-label-sm text-label-sm font-semibold">
<span className="material-symbols-outlined text-[14px] text-primary">task_alt</span>
<span>Completed</span>
</span>
</div>
<div className="my-space-xs">
<div className="font-headline-md text-headline-md font-bold text-on-surface font-label-md">26/02/2025 14:00 UTC</div>
<div className="font-caption text-caption text-on-surface-variant mt-1">Archive ID: <span className="font-mono text-on-surface">BKP-20250226-1400</span> · Size: 1.42 GB</div>
</div>
<div className="pt-space-xs flex items-center justify-between text-outline text-caption font-caption">
<span className="font-label-sm text-label-sm">Elapsed: 38 mins ago</span>
<span className="font-label-sm text-label-sm font-semibold text-secondary">Verified Valid</span>
</div>
</div>
{/*  Card 4: Next Scheduled Backup  */}
<div className="bg-surface-container-lowest rounded-xl p-space-md shadow-sm relative overflow-hidden flex flex-col justify-between">
<div className="flex items-start justify-between gap-space-sm mb-space-sm">
<div className="flex items-center gap-space-xs">
<div className="w-8 h-8 rounded-lg bg-surface-container-low flex items-center justify-center text-primary">
<span className="material-symbols-outlined text-[18px]">update</span>
</div>
<span className="font-caption text-caption text-on-surface-variant font-semibold uppercase tracking-wider">Next Scheduled Backup</span>
</div>
<span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-secondary-container text-on-secondary-container font-label-sm text-label-sm font-semibold">
<span className="material-symbols-outlined text-[14px]">hourglass_top</span>
<span>Countdown Active</span>
</span>
</div>
<div className="my-space-xs">
<div className="font-headline-md text-headline-md font-bold text-primary font-label-md">26/02/2025 15:00 UTC</div>
<div className="font-caption text-caption text-on-surface-variant mt-1">Frequency: Hourly delta · Full snapshot every 24h at 00:00 UTC</div>
</div>
<div className="pt-space-xs flex items-center justify-between text-outline text-caption font-caption">
<span className="font-label-sm text-label-sm font-bold text-on-secondary-container">T- 21m 42s remaining</span>
<span className="font-label-sm text-label-sm font-semibold text-secondary">Worker ID: #JOB-402</span>
</div>
</div>
</div>
</div>
{/*  Main Multi-Column Split Workspace  */}
<div className="px-space-lg pb-space-xl flex flex-col xl:flex-row gap-space-lg items-start">
{/*  Left/Center 72% Width: Backup Registry & Recovery Matrix  */}
<div className="w-full xl:w-[73%] flex flex-col gap-space-md">
{/*  Primary Card for Registry  */}
<div className="bg-surface-container-lowest rounded-xl shadow-sm overflow-hidden flex flex-col">
{/*  Table Header & Controls  */}
<div className="p-space-md bg-surface-container-low/40 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-space-sm">
<div className="flex items-center gap-space-sm">
<div className="w-2.5 h-2.5 rounded-full bg-primary"></div>
<div>
<h2 className="font-headline-sm text-headline-sm text-on-surface font-semibold">Cryptographic Backup History &amp; Disaster Recovery Points</h2>
<span className="font-caption text-caption text-on-surface-variant">Validated disaster recovery archives compliant with Annex 11 &amp; 21 CFR §11.10(c) integrity standards</span>
</div>
</div>
<div className="flex items-center gap-2">
<div className="relative min-w-[240px]">
<span className="material-symbols-outlined absolute left-2.5 top-1/2 -translate-y-1/2 text-outline text-[16px]">search</span>
<input className="w-full h-9 pl-8 pr-3 text-body-sm font-body-sm rounded-lg bg-surface-container-lowest text-on-surface focus:outline-none focus:bg-surface-container-low" id="backup-search" placeholder="Search backup ID, checksum..." type="text"/>
</div>
<div className="flex items-center bg-surface-container-low p-0.5 rounded-lg">
<button className="px-2.5 py-1 text-label-sm font-label-sm rounded font-semibold bg-surface-container-lowest text-primary shadow-xs" type="button">All (5)</button>
<button className="px-2.5 py-1 text-label-sm font-label-sm rounded text-on-surface-variant hover:text-on-surface font-medium" type="button">Auto</button>
<button className="px-2.5 py-1 text-label-sm font-label-sm rounded text-on-surface-variant hover:text-on-surface font-medium" type="button">Manual</button>
</div>
</div>
</div>
{/*  Data Table  */}
<div className="overflow-x-auto">
<table className="w-full text-left border-collapse">
<thead>
<tr className="bg-surface-container text-on-surface-variant font-caption text-caption uppercase tracking-wider select-none">
<th className="py-2.5 px-space-md font-semibold">Date-time (UTC)</th>
<th className="py-2.5 px-space-sm font-semibold">Type</th>
<th className="py-2.5 px-space-sm font-semibold">Size</th>
<th className="py-2.5 px-space-md font-semibold">Record Counts</th>
<th className="py-2.5 px-space-md font-semibold">SHA-256 Checksum</th>
<th className="py-2.5 px-space-md font-semibold text-right">Actions</th>
</tr>
</thead>
<tbody className="font-body-sm text-body-sm text-on-surface">
{/*  Row 1: Latest Auto  */}
<tr className="hover:bg-surface-container-low/70 transition-colors group">
<td className="py-3 px-space-md whitespace-nowrap">
<div className="flex items-center gap-space-xs">
<span className="w-1.5 h-1.5 rounded-full bg-emerald-600"></span>
<span className="font-label-sm text-label-sm font-bold text-on-surface">26/02/2025 14:00:15</span>
<span className="px-1.5 py-0.2 rounded bg-surface-container text-on-surface-variant font-label-sm text-[10px]">CURRENT</span>
</div>
<div className="font-label-sm text-[10px] text-outline pl-3 font-mono">BKP-20250226-1400</div>
</td>
<td className="py-3 px-space-sm whitespace-nowrap">
<span className="px-2 py-0.5 rounded bg-surface-container text-on-surface font-label-sm text-label-sm font-semibold">Auto</span>
</td>
<td className="py-3 px-space-sm whitespace-nowrap font-label-sm text-label-sm text-on-surface font-medium">
                  1.42 GB
                </td>
<td className="py-3 px-space-md whitespace-nowrap">
<div className="font-label-sm text-label-sm text-on-surface">14,820 Binders</div>
<div className="font-caption text-caption text-outline">142k Audit logs · 6 Racks</div>
</td>
<td className="py-3 px-space-md whitespace-nowrap">
<button className="group/hash inline-flex items-center gap-1.5 px-2 py-1 rounded bg-surface-container-low hover:bg-surface-container text-on-surface font-label-sm text-label-sm transition-colors" title="Click to copy hash" type="button">
<span className="material-symbols-outlined text-[13px] text-outline group-hover/hash:text-primary">tag</span>
<span className="font-mono text-[11px]">9f3a...c21b</span>
<span className="material-symbols-outlined text-[13px] text-outline">content_copy</span>
</button>
</td>
<td className="py-3 px-space-md whitespace-nowrap text-right">
<div className="inline-flex items-center gap-1.5 justify-end">
<button className="min-h-[44px] min-w-[44px] p-2 rounded-lg text-on-surface-variant hover:text-primary hover:bg-surface-container flex items-center justify-center transition-colors" title="Download Encrypted Snapshot" type="button">
<span className="material-symbols-outlined text-[18px]">download</span>
</button>
<button className="min-h-[44px] px-3 rounded-lg bg-surface-container-low hover:bg-error-container text-on-surface hover:text-on-error-container font-label-sm text-label-sm font-semibold transition-colors flex items-center gap-1 shadow-xs"  type="button">
<span className="material-symbols-outlined text-[16px] text-error">history</span>
<span>Restore</span>
</button>
</div>
</td>
</tr>
{/*  Row 2: Manual Triggered Snapshot  */}
<tr className="hover:bg-surface-container-low/70 transition-colors group">
<td className="py-3 px-space-md whitespace-nowrap">
<div className="flex items-center gap-space-xs">
<span className="w-1.5 h-1.5 rounded-full bg-secondary"></span>
<span className="font-label-sm text-label-sm font-bold text-on-surface">26/02/2025 13:14:02</span>
</div>
<div className="font-label-sm text-[10px] text-outline pl-3 font-mono">BKP-20250226-1314-MAN</div>
</td>
<td className="py-3 px-space-sm whitespace-nowrap">
<span className="px-2 py-0.5 rounded bg-surface-container text-on-surface font-label-sm text-label-sm font-semibold">Manual</span>
</td>
<td className="py-3 px-space-sm whitespace-nowrap font-label-sm text-label-sm text-on-surface font-medium">
                  1.41 GB
                </td>
<td className="py-3 px-space-md whitespace-nowrap">
<div className="font-label-sm text-label-sm text-on-surface">14,818 Binders</div>
<div className="font-caption text-caption text-outline">141.6k Audit logs · 6 Racks</div>
</td>
<td className="py-3 px-space-md whitespace-nowrap">
<button className="group/hash inline-flex items-center gap-1.5 px-2 py-1 rounded bg-surface-container-low hover:bg-surface-container text-on-surface font-label-sm text-label-sm transition-colors" title="Click to copy hash" type="button">
<span className="material-symbols-outlined text-[13px] text-outline group-hover/hash:text-primary">tag</span>
<span className="font-mono text-[11px]">e4b2...10da</span>
<span className="material-symbols-outlined text-[13px] text-outline">content_copy</span>
</button>
</td>
<td className="py-3 px-space-md whitespace-nowrap text-right">
<div className="inline-flex items-center gap-1.5 justify-end">
<button className="min-h-[44px] min-w-[44px] p-2 rounded-lg text-on-surface-variant hover:text-primary hover:bg-surface-container flex items-center justify-center transition-colors" title="Download Encrypted Snapshot" type="button">
<span className="material-symbols-outlined text-[18px]">download</span>
</button>
<button className="min-h-[44px] px-3 rounded-lg bg-surface-container-low hover:bg-error-container text-on-surface hover:text-on-error-container font-label-sm text-label-sm font-semibold transition-colors flex items-center gap-1 shadow-xs"  type="button">
<span className="material-symbols-outlined text-[16px] text-error">history</span>
<span>Restore</span>
</button>
</div>
</td>
</tr>
{/*  Row 3: Auto 12:00  */}
<tr className="hover:bg-surface-container-low/70 transition-colors group bg-surface-container-low/30">
<td className="py-3 px-space-md whitespace-nowrap">
<div className="flex items-center gap-space-xs">
<span className="w-1.5 h-1.5 rounded-full bg-emerald-600"></span>
<span className="font-label-sm text-label-sm font-bold text-on-surface">26/02/2025 12:00:00</span>
</div>
<div className="font-label-sm text-[10px] text-outline pl-3 font-mono">BKP-20250226-1200</div>
</td>
<td className="py-3 px-space-sm whitespace-nowrap">
<span className="px-2 py-0.5 rounded bg-surface-container text-on-surface font-label-sm text-label-sm font-semibold">Auto</span>
</td>
<td className="py-3 px-space-sm whitespace-nowrap font-label-sm text-label-sm text-on-surface font-medium">
                  1.40 GB
                </td>
<td className="py-3 px-space-md whitespace-nowrap">
<div className="font-label-sm text-label-sm text-on-surface">14,812 Binders</div>
<div className="font-caption text-caption text-outline">140.2k Audit logs · 6 Racks</div>
</td>
<td className="py-3 px-space-md whitespace-nowrap">
<button className="group/hash inline-flex items-center gap-1.5 px-2 py-1 rounded bg-surface-container-low hover:bg-surface-container text-on-surface font-label-sm text-label-sm transition-colors" title="Click to copy hash" type="button">
<span className="material-symbols-outlined text-[13px] text-outline group-hover/hash:text-primary">tag</span>
<span className="font-mono text-[11px]">71c4...33af</span>
<span className="material-symbols-outlined text-[13px] text-outline">content_copy</span>
</button>
</td>
<td className="py-3 px-space-md whitespace-nowrap text-right">
<div className="inline-flex items-center gap-1.5 justify-end">
<button className="min-h-[44px] min-w-[44px] p-2 rounded-lg text-on-surface-variant hover:text-primary hover:bg-surface-container flex items-center justify-center transition-colors" title="Download Encrypted Snapshot" type="button">
<span className="material-symbols-outlined text-[18px]">download</span>
</button>
<button className="min-h-[44px] px-3 rounded-lg bg-surface-container-low hover:bg-error-container text-on-surface hover:text-on-error-container font-label-sm text-label-sm font-semibold transition-colors flex items-center gap-1 shadow-xs"  type="button">
<span className="material-symbols-outlined text-[16px] text-error">history</span>
<span>Restore</span>
</button>
</div>
</td>
</tr>
{/*  Row 4: Auto 11:00  */}
<tr className="hover:bg-surface-container-low/70 transition-colors group">
<td className="py-3 px-space-md whitespace-nowrap">
<div className="flex items-center gap-space-xs">
<span className="w-1.5 h-1.5 rounded-full bg-emerald-600"></span>
<span className="font-label-sm text-label-sm font-bold text-on-surface">26/02/2025 11:00:09</span>
</div>
<div className="font-label-sm text-[10px] text-outline pl-3 font-mono">BKP-20250226-1100</div>
</td>
<td className="py-3 px-space-sm whitespace-nowrap">
<span className="px-2 py-0.5 rounded bg-surface-container text-on-surface font-label-sm text-label-sm font-semibold">Auto</span>
</td>
<td className="py-3 px-space-sm whitespace-nowrap font-label-sm text-label-sm text-on-surface font-medium">
                  1.39 GB
                </td>
<td className="py-3 px-space-md whitespace-nowrap">
<div className="font-label-sm text-label-sm text-on-surface">14,801 Binders</div>
<div className="font-caption text-caption text-outline">139.1k Audit logs · 6 Racks</div>
</td>
<td className="py-3 px-space-md whitespace-nowrap">
<button className="group/hash inline-flex items-center gap-1.5 px-2 py-1 rounded bg-surface-container-low hover:bg-surface-container text-on-surface font-label-sm text-label-sm transition-colors" title="Click to copy hash" type="button">
<span className="material-symbols-outlined text-[13px] text-outline group-hover/hash:text-primary">tag</span>
<span className="font-mono text-[11px]">3d81...79c0</span>
<span className="material-symbols-outlined text-[13px] text-outline">content_copy</span>
</button>
</td>
<td className="py-3 px-space-md whitespace-nowrap text-right">
<div className="inline-flex items-center gap-1.5 justify-end">
<button className="min-h-[44px] min-w-[44px] p-2 rounded-lg text-on-surface-variant hover:text-primary hover:bg-surface-container flex items-center justify-center transition-colors" title="Download Encrypted Snapshot" type="button">
<span className="material-symbols-outlined text-[18px]">download</span>
</button>
<button className="min-h-[44px] px-3 rounded-lg bg-surface-container-low hover:bg-error-container text-on-surface hover:text-on-error-container font-label-sm text-label-sm font-semibold transition-colors flex items-center gap-1 shadow-xs"  type="button">
<span className="material-symbols-outlined text-[16px] text-error">history</span>
<span>Restore</span>
</button>
</div>
</td>
</tr>
{/*  Row 5: Daily Full Snapshot  */}
<tr className="hover:bg-surface-container-low/70 transition-colors group">
<td className="py-3 px-space-md whitespace-nowrap">
<div className="flex items-center gap-space-xs">
<span className="w-1.5 h-1.5 rounded-full bg-primary"></span>
<span className="font-label-sm text-label-sm font-bold text-on-surface">26/02/2025 00:00:01</span>
<span className="px-1.5 py-0.2 rounded bg-primary-container text-on-primary font-label-sm text-[10px]">FULL ARCHIVE</span>
</div>
<div className="font-label-sm text-[10px] text-outline pl-3 font-mono">BKP-20250226-0000-FULL</div>
</td>
<td className="py-3 px-space-sm whitespace-nowrap">
<span className="px-2 py-0.5 rounded bg-surface-container text-on-surface font-label-sm text-label-sm font-semibold">Auto</span>
</td>
<td className="py-3 px-space-sm whitespace-nowrap font-label-sm text-label-sm text-on-surface font-medium">
                  3.88 GB
                </td>
<td className="py-3 px-space-md whitespace-nowrap">
<div className="font-label-sm text-label-sm text-on-surface">14,760 Binders</div>
<div className="font-caption text-caption text-outline">134.8k Audit logs · Complete System State</div>
</td>
<td className="py-3 px-space-md whitespace-nowrap">
<button className="group/hash inline-flex items-center gap-1.5 px-2 py-1 rounded bg-surface-container-low hover:bg-surface-container text-on-surface font-label-sm text-label-sm transition-colors" title="Click to copy hash" type="button">
<span className="material-symbols-outlined text-[13px] text-outline group-hover/hash:text-primary">tag</span>
<span className="font-mono text-[11px]">b221...e584</span>
<span className="material-symbols-outlined text-[13px] text-outline">content_copy</span>
</button>
</td>
<td className="py-3 px-space-md whitespace-nowrap text-right">
<div className="inline-flex items-center gap-1.5 justify-end">
<button className="min-h-[44px] min-w-[44px] p-2 rounded-lg text-on-surface-variant hover:text-primary hover:bg-surface-container flex items-center justify-center transition-colors" title="Download Encrypted Snapshot" type="button">
<span className="material-symbols-outlined text-[18px]">download</span>
</button>
<button className="min-h-[44px] px-3 rounded-lg bg-surface-container-low hover:bg-error-container text-on-surface hover:text-on-error-container font-label-sm text-label-sm font-semibold transition-colors flex items-center gap-1 shadow-xs"  type="button">
<span className="material-symbols-outlined text-[16px] text-error">history</span>
<span>Restore</span>
</button>
</div>
</td>
</tr>
</tbody>
</table>
</div>
{/*  Table Footer Metadata  */}
<div className="p-space-md bg-surface-container-low/30 flex flex-col sm:flex-row items-center justify-between text-outline text-caption font-caption gap-space-sm">
<div className="flex items-center gap-space-md">
<span>Showing 5 verified recovery checkpoints</span>
<span>Storage Allocation: <strong className="text-on-surface">9.50 GB / 250 GB</strong> (Retention: 90 days rolling)</span>
</div>
<div className="flex items-center gap-2">
<span className="w-2 h-2 rounded-full bg-emerald-600"></span>
<span>Cryptographic Chain: Merkle Root Hash Verified Consistent</span>
</div>
</div>
</div>
{/*  Compliance Statement Banner  */}
<div className="bg-surface-container-lowest rounded-xl p-space-md shadow-sm flex items-start gap-space-md">
<div className="w-10 h-10 rounded-lg bg-surface-container-low text-primary flex items-center justify-center shrink-0">
<span className="material-symbols-outlined text-[22px]">policy</span>
</div>
<div className="flex-1">
<div className="flex items-center gap-space-sm">
<h3 className="font-headline-sm text-headline-sm text-primary font-bold">21 CFR §11.10(c) Compliance Attestation</h3>
<span className="font-label-sm text-label-sm text-secondary font-mono">SOP-PTS-SYS-041</span>
</div>
<p className="font-body-sm text-body-sm text-on-surface-variant mt-1 leading-relaxed">
            The PTS Core system continuously captures delta operational changes with hardware-accelerated SHA-256 signatures. Electronic signatures applied to batch records (Binders S06) reference unalterable temporal sequence stamps. System restoration actions automatically trigger mandatory security incident escalations and freeze all cleanroom active lines until QA dual-authorization is completed.
          </p>
</div>
</div>
</div>
{/*  Right Column 27% Width: Inspection Drawer & Prototype Tools  */}
<div className="w-full xl:w-[27%] flex flex-col gap-space-md">
{/*  Live Integrity Telemetry Panel  */}
<div className="bg-surface-container-lowest rounded-xl p-space-md shadow-sm flex flex-col gap-space-md">
<div className="flex items-center justify-between">
<div className="flex items-center gap-space-xs">
<span className="material-symbols-outlined text-primary text-[20px]">monitor_heart</span>
<h3 className="font-headline-sm text-headline-sm text-on-surface font-semibold">Integrity Telemetry</h3>
</div>
<span className="px-2 py-0.5 rounded-full bg-surface-container text-on-surface font-label-sm text-label-sm font-semibold">LIVE</span>
</div>
<div className="space-y-space-sm">
{/*  Metric 1  */}
<div className="p-space-sm rounded-lg bg-surface-container-low/60 flex items-center justify-between">
<div className="flex flex-col">
<span className="font-caption text-caption text-on-surface-variant">Merkle Tree Root</span>
<span className="font-label-sm text-label-sm font-mono text-on-surface">0x4a9b...77fe</span>
</div>
<span className="material-symbols-outlined text-emerald-600 text-[18px]">lock_clock</span>
</div>
{/*  Metric 2  */}
<div className="p-space-sm rounded-lg bg-surface-container-low/60 flex items-center justify-between">
<div className="flex flex-col">
<span className="font-caption text-caption text-on-surface-variant">Cold Room Buffer Latency</span>
<span className="font-label-sm text-label-sm font-mono text-on-surface">1.2ms (Zero packet loss)</span>
</div>
<span className="material-symbols-outlined text-emerald-600 text-[18px]">ac_unit</span>
</div>
{/*  Metric 3  */}
<div className="p-space-sm rounded-lg bg-surface-container-low/60 flex items-center justify-between">
<div className="flex flex-col">
<span className="font-caption text-caption text-on-surface-variant">Active Cleanroom Binders</span>
<span className="font-label-sm text-label-sm font-mono text-on-surface">14,820 Synchronized</span>
</div>
<span className="material-symbols-outlined text-secondary text-[18px]">folder_special</span>
</div>
</div>
{/*  Inline Visual Graphic: Backup Timeline SVG  */}
<div className="pt-space-xs">
<div className="flex items-center justify-between text-caption font-caption text-on-surface-variant mb-1.5">
<span>Snapshot Generation Velocity</span>
<span className="font-mono text-primary font-semibold">Avg 4.2s / run</span>
</div>
<div className="w-full bg-surface-container-low rounded-lg p-2.5">
<svg className="w-full h-12 text-primary" fill="none" viewBox="0 0 280 48" xmlns="http://www.w3.org/2000/svg">
<path d="M0 38 L35 34 L70 36 L105 28 L140 30 L175 18 L210 22 L245 10 L280 14" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path>
<path d="M0 38 L35 34 L70 36 L105 28 L140 30 L175 18 L210 22 L245 10 L280 14 V48 H0 Z" fill="currentColor" fill-opacity="0.08"></path>
{/*  Points  */}
<circle className="fill-primary" cx="105" cy="28" r="3"></circle>
<circle className="fill-primary" cx="175" cy="18" r="3"></circle>
<circle className="fill-emerald-600" cx="245" cy="10" r="3.5"></circle>
</svg>
<div className="flex justify-between text-[9px] font-mono text-outline mt-1 px-1">
<span>08:00 UTC</span>
<span>10:00</span>
<span>12:00</span>
<span>14:00 (Latest)</span>
</div>
</div>
</div>
</div>
{/*  Prototype Scenario & Simulation Tools Panel  */}
<div className="bg-surface-container-lowest rounded-xl p-space-md shadow-sm relative overflow-hidden flex flex-col gap-space-sm">
<div className="flex items-center justify-between">
<div className="flex items-center gap-space-xs">
<span className="material-symbols-outlined text-secondary text-[20px]">science</span>
<h3 className="font-headline-sm text-headline-sm text-on-surface font-semibold">Prototype Tools</h3>
</div>
<span className="px-2 py-0.5 rounded bg-surface-container text-on-surface font-label-sm text-[10px] font-bold uppercase tracking-wider">Internal / Validation Only</span>
</div>
<p className="font-body-sm text-body-sm text-on-surface-variant leading-normal">
          Interactive scenario testing for cleanroom network isolation and disconnection handling.
        </p>
{/*  Toggle Switch Control  */}
<div className="mt-space-xs p-space-sm rounded-lg bg-surface-container-low flex flex-col gap-space-xs">
<div className="flex items-center justify-between">
<label className="flex flex-col cursor-pointer select-none" htmlFor="network-failure-toggle">
<span className="font-body-sm text-body-sm font-semibold text-on-surface">Simulate network failure</span>
<span className="font-caption text-caption text-outline">Sever Cleanroom Line 04 connection</span>
</label>
{/*  Accessible Switch  */}
<button aria-defaultChecked="false" className="min-h-[44px] min-w-[56px] flex items-center justify-end px-1 focus:outline-none" id="network-failure-toggle"  role="switch" type="button">
<div className="w-12 h-6 bg-surface-dim rounded-full transition-colors relative flex items-center p-0.5" id="toggle-track">
<div className="w-5 h-5 bg-surface-container-lowest rounded-full shadow-sm transition-transform transform translate-x-0" id="toggle-thumb"></div>
</div>
</button>
</div>
<div className="hidden mt-2 p-2 rounded bg-error-container text-on-error-container font-caption text-caption" id="toggle-warning-callout">
<div className="flex items-center gap-1 font-semibold mb-0.5">
<span className="material-symbols-outlined text-[14px]">warning</span>
<span>Cleanroom Gateway Offline</span>
</div>
            Active local cache buffering engaged. All writes queued locally until reconnect.
          </div>
</div>
<p className="font-caption text-caption text-outline mt-1">
          Toggling will simulate severed gateway connection to test local offline buffering and UI lock state.
        </p>
{/*  Rapid Actions for QA Testing  */}
<div className="pt-space-xs flex flex-col gap-1.5">
<span className="font-caption text-caption text-on-surface-variant uppercase font-semibold">QA Scenario Triggers</span>
<div className="grid grid-cols-2 gap-2">
<button className="min-h-[44px] px-2.5 py-1.5 rounded bg-surface-container-low hover:bg-surface-container text-on-surface font-label-sm text-label-sm transition-colors text-left flex items-center gap-1"  type="button">
<span className="material-symbols-outlined text-[14px] text-secondary">timer_off</span>
<span>Test NTP Drift</span>
</button>
<button className="min-h-[44px] px-2.5 py-1.5 rounded bg-surface-container-low hover:bg-surface-container text-on-surface font-label-sm text-label-sm transition-colors text-left flex items-center gap-1"  type="button">
<span className="material-symbols-outlined text-[14px] text-primary">verified</span>
<span>Check Merkle</span>
</button>
</div>
</div>
</div>
{/*  Quick Document Reference Card  */}
<div className="bg-surface-container-lowest rounded-xl p-space-md shadow-sm flex flex-col gap-2">
<span className="font-caption text-caption text-outline uppercase font-semibold">Disaster Recovery Protocol</span>
<div className="flex items-center gap-space-sm text-on-surface font-body-sm text-body-sm font-semibold">
<span className="material-symbols-outlined text-primary text-[18px]">description</span>
<span>DRP-2025-PTS-REV4.pdf</span>
</div>
<span className="font-caption text-caption text-on-surface-variant">Validated by QA Compliance Unit 24/01/2025. Dual authorization strictly enforced.</span>
</div>
</div>
</div>
{/*  Restore Confirmation Modal Dialog (Focused/Interactive Overlay)  */}
<div className="fixed inset-0 z-50 flex items-center justify-center p-space-md bg-inverse-surface/60 backdrop-blur-sm transition-opacity opacity-100" id="restore-modal">
<div className="w-full max-w-xl bg-surface-container-lowest rounded-2xl shadow-xl overflow-hidden flex flex-col transform transition-transform scale-100">
{/*  Modal Header  */}
<div className="p-space-lg bg-surface-container-low/80 flex items-start gap-space-md">
<div className="w-10 h-10 rounded-xl bg-error-container text-error flex items-center justify-center shrink-0">
<span className="material-symbols-outlined text-[24px]">gpp_maybe</span>
</div>
<div className="flex-1">
<div className="flex items-center gap-2">
<h3 className="font-headline-sm text-headline-sm text-on-surface font-bold">Confirm System Restore Point</h3>
<span className="px-2 py-0.5 rounded bg-error-container text-error font-label-sm text-[10px] font-bold uppercase tracking-wider">Critical Action</span>
</div>
<p className="font-body-sm text-body-sm text-error font-semibold mt-1">
            Restoring backup point <span className="font-mono underline" id="modal-target-id">BKP-20250226-1200</span> will roll back the operational state to <span id="modal-target-timestamp">26/02/2025 12:00:00 UTC</span>. Current pending unsaved batch locks will be terminated.
          </p>
</div>
<button className="min-h-[44px] min-w-[44px] rounded-lg text-outline hover:text-on-surface flex items-center justify-center transition-colors"  type="button">
<span className="material-symbols-outlined text-[20px]">close</span>
</button>
</div>
{/*  Modal Body Form  */}
<div className="p-space-lg flex flex-col gap-space-md">
{/*  Snapshot Summary Matrix  */}
<div className="grid grid-cols-2 gap-space-sm p-space-sm rounded-lg bg-surface-container-low">
<div className="flex flex-col">
<span className="font-caption text-caption text-outline uppercase">Snapshot ID</span>
<span className="font-label-sm text-label-sm font-mono text-on-surface font-bold" id="modal-snap-id">BKP-20250226-1200</span>
</div>
<div className="flex flex-col">
<span className="font-caption text-caption text-outline uppercase">Target Merkle Root</span>
<span className="font-label-sm text-label-sm font-mono text-on-surface font-bold" id="modal-merkle">0x71c4...33af</span>
</div>
<div className="flex flex-col col-span-2 pt-1">
<span className="font-caption text-caption text-outline uppercase">Impact Delta Scope</span>
<span className="font-label-sm text-label-sm text-on-surface font-medium" id="modal-scope">14,812 Binders · 140.2k Audit logs (2 hours delta will be reverted)</span>
</div>
</div>
{/*  21 CFR Part 11 Electronic Signature Verification  */}
<div className="flex flex-col gap-space-sm">
<div className="flex items-center justify-between">
<label className="font-body-sm text-body-sm font-semibold text-on-surface flex items-center gap-1.5" htmlFor="admin-auth-pwd">
<span className="material-symbols-outlined text-primary text-[16px]">lock</span>
<span>Enter Admin / QA Master Password to authorize restore</span>
</label>
<span className="font-label-sm text-label-sm text-secondary font-mono">INITIATOR Anita Shah</span>
</div>
<div className="relative">
<input className="w-full h-11 px-space-md text-body-sm font-body-sm rounded-lg bg-surface-container-lowest text-on-surface focus:outline-none focus:bg-surface-container-low font-mono" id="admin-auth-pwd" placeholder="Enter secure electronic signature credential" type="password"/>
<span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-outline text-[18px]">key</span>
</div>
</div>
{/*  Mandatory Audit Justification  */}
<div className="flex flex-col gap-1.5">
<div className="flex items-center justify-between">
<label className="font-body-sm text-body-sm font-semibold text-on-surface flex items-center gap-1" htmlFor="restore-reason">
<span>Reason for Restore (Mandatory Audit Trail Entry)</span>
<span className="text-error font-bold">*</span>
</label>
<span className="font-caption text-caption text-outline">Annex 11 §14 Required</span>
</div>
<textarea className="w-full p-2.5 text-body-sm font-body-sm rounded-lg bg-surface-container-lowest text-on-surface focus:outline-none focus:bg-surface-container-low resize-none" id="restore-reason" placeholder="Document specific reason (e.g. Deviation DEV-2025-081 test anomaly, cleanroom line restart rollback)..." rows={2}></textarea>
</div>
{/*  Warning Callout  */}
<div className="p-space-sm rounded-lg bg-surface-container text-on-surface flex items-start gap-space-sm">
<span className="material-symbols-outlined text-[18px] text-error shrink-0 mt-0.5">info</span>
<span className="font-caption text-caption leading-relaxed">
            By executing this authorization, an indelible critical log entry will be inscribed to the non-repudiation ledger under your authenticated session. Line 04 packaging machines will be placed in hold state.
          </span>
</div>
</div>
{/*  Modal Actions  */}
<div className="p-space-md bg-surface-container-low flex items-center justify-end gap-space-sm">
<button className="min-h-[44px] px-space-md rounded-lg bg-surface-container text-on-surface font-body-sm text-body-sm font-semibold hover:bg-surface-variant transition-colors"  type="button">
          Cancel
        </button>
<button className="min-h-[44px] px-space-lg rounded-lg bg-error hover:bg-on-error-container text-on-error font-body-sm text-body-sm font-bold flex items-center gap-space-xs transition-colors shadow-sm"  type="button">
<span className="material-symbols-outlined text-[18px]">restart_alt</span>
<span>Authorize Restore &amp; Rollback</span>
</button>
</div>
</div>
</div>
{/*  Simulated Toast Feedback Notification Area  */}
<div className="fixed bottom-6 right-6 z-50 hidden max-w-md bg-surface-container-lowest rounded-xl p-space-md shadow-xl flex items-center gap-space-sm transform transition-all" id="toast-banner">
<div className="w-8 h-8 rounded-lg bg-surface-container text-primary flex items-center justify-center shrink-0" id="toast-icon-wrap">
<span className="material-symbols-outlined text-[18px]" id="toast-icon">info</span>
</div>
<div className="flex-1">
<div className="font-body-sm text-body-sm font-bold text-on-surface" id="toast-title">System Notification</div>
<div className="font-caption text-caption text-on-surface-variant" id="toast-message">Action processed successfully.</div>
</div>
<button className="min-h-[36px] min-w-[36px] text-outline hover:text-on-surface flex items-center justify-center"  type="button">
<span className="material-symbols-outlined text-[16px]">close</span>
</button>
</div>

</div>
    </AppLayout>
  );
}
