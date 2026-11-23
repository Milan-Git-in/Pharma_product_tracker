"use client";

import React from "react";
import Link from "next/link";
import AppLayout from "@/components/layout/AppLayout";

export default function NetworkFailureStatePage() {
  return (
    <AppLayout screenCode="S24">
      <div className="flex flex-col w-full relative">
{/*  Prominent GMP Regulatory Network Failure Banner  */}
<section className="w-full bg-error text-on-error px-space-lg py- space-md shadow-md relative overflow-hidden">
<div className="absolute -right-8 -bottom-10 opacity-10 text-on-error pointer-events-none select-none">
<span className="material-symbols-outlined text-[160px]">wifi_off</span>
</div>
<div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-space-md relative z-10">
<div className="flex items-start gap-space-md">
<div className="w-10 h-10 rounded-lg bg-surface-container-lowest/15 flex items-center justify-center shrink-0 mt-0.5">
<span className="material-symbols-outlined text-[24px] text-on-error animate-pulse">crisis_alert</span>
</div>
<div className="flex flex-col gap-0.5">
<div className="flex items-center gap-space-sm flex-wrap">
<span className="font-headline-sm text-headline-sm font-bold tracking-tight">NETWORK / COMMUNICATION FAILURE — CHANGES CANNOT BE SAVED</span>
<span className="px-2 py-0.5 rounded bg-surface-container-lowest/20 font-label-sm text-label-sm font-bold tracking-wider uppercase text-on-error">SAFEGUARD MODE ACTIVE</span>
</div>
<p className="font-body-md text-body-md text-on-error/90 max-w-4xl">
            Cleanroom Line 04 connection to Company LAN Server (10.14.82.10) lost at <span className="font-label-md text-label-md font-mono font-semibold">14:38:42 UTC</span>. System is locked in read-only safeguard state under <span className="font-label-md text-label-md font-mono underline underline-offset-2">21 CFR §11.10(b)</span>. Local non-volatile memory offline buffer active for 3 pending transactions.
          </p>
</div>
</div>
<div className="flex items-center gap-space-sm shrink-0 self-end md:self-center">
<div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-surface-container-lowest/20 font-label-sm text-label-sm font-mono text-on-error font-medium">
<span className="w-2 h-2 rounded-full bg-on-error animate-ping"></span>
          RECONNECT RETRY (3/10): 00:08s
        </div>
</div>
</div>
</section>
{/*  Main Content Space  */}
<div className="p-space-lg space-y-space-lg w-full">
{/*  Top Grid: System Node Integrity Cards & Simulation Trigger  */}
<div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-space-md">
{/*  Card 1: Server Time Sync  */}
<div className="bg-surface-container-lowest p-space-md rounded-xl shadow-sm flex flex-col justify-between">
<div className="flex items-center justify-between pb-space-sm">
<span className="font-caption text-caption uppercase tracking-wider text-outline font-semibold">Precision Time Protocol (PTP)</span>
<span className="px-2 py-0.5 rounded font-label-sm text-label-sm font-semibold bg-amber-100 text-amber-900 flex items-center gap-1">
<span className="material-symbols-outlined text-[13px]">warning</span>
            STALE
          </span>
</div>
<div className="space-y-1 my-1">
<div className="font-headline-sm text-headline-sm font-bold text-on-surface">UNSYNCHRONIZED</div>
<div className="font-label-md text-label-md font-mono text-error font-semibold flex items-center gap-1">
<span className="material-symbols-outlined text-[16px]">sync_problem</span>
            Offset +4.2 s (Drifting)
          </div>
</div>
<div className="pt-space-xs font-body-sm text-body-sm text-on-surface-variant flex items-center justify-between">
<span>Clock Drift Threshold: &lt;50ms</span>
<span className="font-label-sm text-label-sm font-mono text-outline">Stratum-2</span>
</div>
</div>
{/*  Card 2: Company LAN Server  */}
<div className="bg-surface-container-lowest p-space-md rounded-xl shadow-sm flex flex-col justify-between">
<div className="flex items-center justify-between pb-space-sm">
<span className="font-caption text-caption uppercase tracking-wider text-outline font-semibold">Line Server Socket</span>
<span className="px-2 py-0.5 rounded font-label-sm text-label-sm font-bold bg-error text-on-error flex items-center gap-1">
<span className="w-1.5 h-1.5 rounded-full bg-on-error"></span>
            DISCONNECTED
          </span>
</div>
<div className="space-y-1 my-1">
<div className="font-headline-sm text-headline-sm font-bold text-on-surface">10.14.82.10:443</div>
<div className="font-label-sm text-label-sm font-mono text-error font-medium truncate">
            ERR_GATEWAY_TIMEOUT (TCP ACK Dropped)
          </div>
</div>
<div className="pt-space-xs font-body-sm text-body-sm text-on-surface-variant flex items-center justify-between">
<span>Cleanroom AP Line 04</span>
<span className="font-label-sm text-label-sm font-mono text-error">Packet Loss 100%</span>
</div>
</div>
{/*  Card 3: Auto Backup Status  */}
<div className="bg-surface-container-lowest p-space-md rounded-xl shadow-sm flex flex-col justify-between">
<div className="flex items-center justify-between pb-space-sm">
<span className="font-caption text-caption uppercase tracking-wider text-outline font-semibold">Snapshot Pipeline</span>
<span className="px-2 py-0.5 rounded font-label-sm text-label-sm font-semibold bg-surface-container-high text-on-surface-variant">
            INTERRUPTED
          </span>
</div>
<div className="space-y-1 my-1">
<div className="font-headline-sm text-headline-sm font-bold text-on-surface">Last: 14:00:00 UTC</div>
<div className="font-label-sm text-label-sm font-mono text-outline font-medium">
            SHA256: 7f89c0...verified
          </div>
</div>
<div className="pt-space-xs font-body-sm text-body-sm text-on-surface-variant flex items-center justify-between">
<span>Cycle: Every 30 mins</span>
<span className="font-label-sm text-label-sm text-amber-700 font-semibold font-mono">14:30 Delta Overdue</span>
</div>
</div>
{/*  Card 4: Next Scheduled Backup  */}
<div className="bg-surface-container-lowest p-space-md rounded-xl shadow-sm flex flex-col justify-between">
<div className="flex items-center justify-between pb-space-sm">
<span className="font-caption text-caption uppercase tracking-wider text-outline font-semibold">Daemon Scheduler</span>
<span className="px-2 py-0.5 rounded font-label-sm text-label-sm font-semibold bg-error-container text-on-error-container">
            HALTED
          </span>
</div>
<div className="space-y-1 my-1">
<div className="font-headline-sm text-headline-sm font-bold text-on-surface">SUSPENDED</div>
<div className="font-label-sm text-label-sm font-mono text-on-surface-variant font-medium">
            Pending Line 04 Reconnect
          </div>
</div>
<div className="pt-space-xs font-body-sm text-body-sm text-on-surface-variant flex items-center justify-between">
<span>Fail-safe: Lock DB Write</span>
<span className="font-label-sm text-label-sm font-mono text-primary font-bold">21 CFR Ready</span>
</div>
</div>
</div>
{/*  Middle Split Section: Controls & Sandbox Testing Console  */}
<div className="grid grid-cols-1 xl:grid-cols-3 gap-space-lg items-start">
{/*  Left 2 Cols: Master Actions & Data Backup Inventory  */}
<div className="xl:col-span-2 space-y-space-md">
{/*  Action Control Header  */}
<div className="bg-surface-container-lowest p-space-md rounded-xl shadow-sm flex flex-wrap items-center justify-between gap-space-md">
<div className="flex items-center gap-space-sm">
<div className="w-9 h-9 rounded-lg bg-surface-container-high flex items-center justify-center text-outline">
<span className="material-symbols-outlined text-[20px]">lock_clock</span>
</div>
<div>
<div className="font-headline-sm text-headline-sm text-on-surface font-semibold flex items-center gap-space-xs">
<span>Backup Archive &amp; System Restores</span>
<span className="px-2 py-0.5 rounded-full bg-error-container text-on-error-container font-label-sm text-label-sm font-mono font-bold">READ-ONLY MODE</span>
</div>
<p className="font-body-sm text-body-sm text-on-surface-variant">Central cluster disconnected. Manual triggers and destructive restores are globally prohibited.</p>
</div>
</div>
{/*  Disabled Trigger Group  */}
<div className="flex items-center gap-space-sm">
{/*  Disabled Button: Backup Now  */}
<div className="relative group">
<button className="min-h-[44px] px-space-md py-2 rounded-lg bg-surface-container-high text-outline cursor-not-allowed font-label-md text-label-md font-semibold flex items-center gap-2 select-none opacity-60" disabled type="button">
<span className="material-symbols-outlined text-[18px]">cloud_upload</span>
                Backup Now
              </button>
<div className="hidden group-hover:block absolute bottom-full mb-2 left-1/2 -translate-x-1/2 px-2.5 py-1 bg-inverse-surface text-inverse-on-surface font-label-sm text-label-sm rounded shadow-lg whitespace-nowrap z-30">
                Disabled: Network Offline
              </div>
</div>
{/*  Disabled Button: Download System Dump  */}
<div className="relative group">
<button className="min-h-[44px] px-space-md py-2 rounded-lg bg-surface-container-high text-outline cursor-not-allowed font-label-md text-label-md font-semibold flex items-center gap-2 select-none opacity-60" disabled type="button">
<span className="material-symbols-outlined text-[18px]">file_download_off</span>
                Download Dump (.tar.gz)
              </button>
<div className="hidden group-hover:block absolute bottom-full mb-2 left-1/2 -translate-x-1/2 px-2.5 py-1 bg-inverse-surface text-inverse-on-surface font-label-sm text-label-sm rounded shadow-lg whitespace-nowrap z-30">
                Disabled: Network Offline
              </div>
</div>
</div>
</div>
{/*  Read-Only Stale Backup Table  */}
<div className="bg-surface-container-lowest rounded-xl shadow-sm overflow-hidden flex flex-col">
<div className="px-space-md py-3 bg-surface-container-low flex items-center justify-between">
<div className="flex items-center gap-space-sm">
<span className="font-label-md text-label-md font-semibold text-on-surface uppercase tracking-wider">Historical System Images (Local Cache)</span>
<span className="font-caption text-caption text-outline font-mono">5 ENTRIES RECORDED</span>
</div>
<div className="flex items-center gap-1 text-amber-800 font-label-sm text-label-sm bg-amber-50 px-2.5 py-1 rounded">
<span className="material-symbols-outlined text-[14px]">cached</span>
              Stale Read View • Remote Ledger Unreachable
            </div>
</div>
<div className="overflow-x-auto">
<table className="w-full text-left border-collapse">
<thead>
<tr className="bg-surface-container font-caption text-caption text-outline font-semibold uppercase tracking-wider">
<th className="py-2.5 px-space-md">Snapshot Stamp (UTC)</th>
<th className="py-2.5 px-space-md">Batch / SOP Scope</th>
<th className="py-2.5 px-space-md">Image Size</th>
<th className="py-2.5 px-space-md">21 CFR Status</th>
<th className="py-2.5 px-space-md text-right">Emergency Action</th>
</tr>
</thead>
<tbody className="divide-y divide-surface-container-high/60 font-body-sm text-body-sm opacity-75">
{/*  Row 1 (Recent)  */}
<tr className="hover:bg-surface-container-low transition-colors">
<td className="py-3 px-space-md font-label-sm text-label-sm font-mono text-on-surface font-medium">
                    26/02/2025 14:00:02
                  </td>
<td className="py-3 px-space-md">
<div className="font-body-md text-body-md font-semibold text-on-surface">PKG-LOT-2025-0881</div>
<span className="font-caption text-caption text-on-surface-variant font-mono">SOP-CLN-L04-V4</span>
</td>
<td className="py-3 px-space-md font-label-sm text-label-sm font-mono text-on-surface-variant">
                    1.42 GB
                  </td>
<td className="py-3 px-space-md">
<span className="px-2 py-0.5 rounded font-label-sm text-label-sm bg-surface-container-highest text-on-surface-variant font-mono flex items-center gap-1 w-fit">
<span className="w-1.5 h-1.5 rounded-full bg-outline"></span>
                      Stale Cache
                    </span>
</td>
<td className="py-3 px-space-md text-right">
<button className="min-h-[44px] px-3 py-1.5 rounded bg-surface-container-high text-outline cursor-not-allowed font-label-sm text-label-sm font-semibold opacity-60" disabled type="button">
                      Restore Disabled
                    </button>
</td>
</tr>
{/*  Row 2  */}
<tr className="hover:bg-surface-container-low transition-colors">
<td className="py-3 px-space-md font-label-sm text-label-sm font-mono text-on-surface font-medium">
                    26/02/2025 13:30:00
                  </td>
<td className="py-3 px-space-md">
<div className="font-body-md text-body-md font-semibold text-on-surface">PKG-LOT-2025-0881</div>
<span className="font-caption text-caption text-on-surface-variant font-mono">SOP-CLN-L04-V4</span>
</td>
<td className="py-3 px-space-md font-label-sm text-label-sm font-mono text-on-surface-variant">
                    1.41 GB
                  </td>
<td className="py-3 px-space-md">
<span className="px-2 py-0.5 rounded font-label-sm text-label-sm bg-surface-container-highest text-on-surface-variant font-mono flex items-center gap-1 w-fit">
<span className="w-1.5 h-1.5 rounded-full bg-outline"></span>
                      Stale Cache
                    </span>
</td>
<td className="py-3 px-space-md text-right">
<button className="min-h-[44px] px-3 py-1.5 rounded bg-surface-container-high text-outline cursor-not-allowed font-label-sm text-label-sm font-semibold opacity-60" disabled type="button">
                      Restore Disabled
                    </button>
</td>
</tr>
{/*  Row 3  */}
<tr className="hover:bg-surface-container-low transition-colors">
<td className="py-3 px-space-md font-label-sm text-label-sm font-mono text-on-surface font-medium">
                    26/02/2025 13:00:00
                  </td>
<td className="py-3 px-space-md">
<div className="font-body-md text-body-md font-semibold text-on-surface">SYS-CHECKPOINT-DAILY</div>
<span className="font-caption text-caption text-on-surface-variant font-mono">SOP-VAL-SYS-99</span>
</td>
<td className="py-3 px-space-md font-label-sm text-label-sm font-mono text-on-surface-variant">
                    4.88 GB
                  </td>
<td className="py-3 px-space-md">
<span className="px-2 py-0.5 rounded font-label-sm text-label-sm bg-surface-container-highest text-on-surface-variant font-mono flex items-center gap-1 w-fit">
<span className="w-1.5 h-1.5 rounded-full bg-outline"></span>
                      Stale Cache
                    </span>
</td>
<td className="py-3 px-space-md text-right">
<button className="min-h-[44px] px-3 py-1.5 rounded bg-surface-container-high text-outline cursor-not-allowed font-label-sm text-label-sm font-semibold opacity-60" disabled type="button">
                      Restore Disabled
                    </button>
</td>
</tr>
</tbody>
</table>
</div>
<div className="p-space-md bg-surface-container-lowest flex items-center justify-between text-outline font-caption text-caption">
<span>Security Note: System image rollbacks require dual-supervisor authorization under full LAN quorum.</span>
<span className="font-mono">INTEGRITY HASH: SHA-256 MATCH VERIFIED</span>
</div>
</div>
{/*  Offline Spooler Card  */}
<div className="bg-surface-container-lowest p-space-md rounded-xl shadow-sm flex flex-col md:flex-row items-center justify-between gap-space-md">
<div className="flex items-center gap-space-md">
<div className="w-10 h-10 rounded-lg bg-secondary-container text-on-secondary-container flex items-center justify-center shrink-0">
<span className="material-symbols-outlined text-[22px]">memory</span>
</div>
<div>
<div className="font-headline-sm text-headline-sm text-on-surface font-semibold">Local Hardware FIFO Buffer</div>
<div className="font-body-sm text-body-sm text-on-surface-variant">3 cleanroom events held in battery-backed SRAM. Will stream to server upon session restore.</div>
</div>
</div>
<div className="flex items-center gap-space-sm font-mono font-label-sm text-label-sm px-3 py-1.5 rounded bg-surface-container text-secondary font-bold">
<span className="w-2 h-2 rounded-full bg-secondary"></span>
            SRAM SPOOL: 18.4 KB / 128 MB
          </div>
</div>
</div>
{/*  Right 1 Col: Prototype Tools & Telemetry Visualizer  */}
<div className="space-y-space-md">
{/*  Prototype Tools Diagnostic Panel  */}
<div className="bg-surface-container-lowest p-space-md rounded-xl shadow-sm relative overflow-hidden">
<div className="flex items-center justify-between pb-space-sm">
<div className="flex items-center gap-space-xs text-primary font-headline-sm text-headline-sm font-bold">
<span className="material-symbols-outlined text-[20px]">science</span>
              Prototype Tools
            </div>
<span className="px-2 py-0.5 rounded font-label-sm text-label-sm font-bold bg-amber-100 text-amber-900 tracking-wider">DEV RUNTIME</span>
</div>
<p className="font-body-sm text-body-sm text-on-surface-variant mb-space-md">
            Simulate hardware drops, NIC interruptions, and latency degradation to validate PTS Cleanroom tamper-proof compliance protocols.
          </p>
{/*  The Network Simulation Toggle (Switched ON)  */}
<div className="p-space-sm rounded-lg bg-error-container/40 space-y-space-xs">
<div className="flex items-center justify-between">
<div className="flex flex-col">
<span className="font-label-md text-label-md font-bold text-on-surface">Simulate network failure</span>
<span className="font-caption text-caption text-error font-semibold">Currently Active (LAN severed)</span>
</div>
{/*  Active ON Toggle Switch  */}
<label className="relative inline-flex items-center cursor-pointer min-h-[44px] min-w-[44px] justify-center">
<input defaultChecked className="sr-only peer" id="simToggle"  type="checkbox"/>
<div className="w-12 h-6 bg-error peer-focus:outline-none rounded-full peer peer-defaultChecked:after:translate-x-full peer-defaultChecked:after:border-white after:content-[''] after:absolute after:top-[14px] after:left-[8px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all"></div>
</label>
</div>
<div className="p-2 rounded bg-surface-container-lowest text-on-surface font-body-sm text-body-sm flex items-start gap-2">
<span className="material-symbols-outlined text-error text-[16px] shrink-0 mt-0.5">info</span>
<span>Network failure simulation active. Toggle <strong>OFF</strong> to restore LAN connection and re-enable server synchronization.</span>
</div>
</div>
{/*  Secondary Dev Toggles  */}
<div className="pt-space-md space-y-2">
<div className="flex items-center justify-between py-1.5 opacity-50">
<span className="font-body-sm text-body-sm text-on-surface">Corrupt local buffer checksum</span>
<span className="font-label-sm text-label-sm font-mono text-outline">OFF</span>
</div>
<div className="flex items-center justify-between py-1.5 opacity-50">
<span className="font-body-sm text-body-sm text-on-surface">Simulate NTP Clock skew (&gt;10s)</span>
<span className="font-label-sm text-label-sm font-mono text-outline">OFF</span>
</div>
</div>
</div>
{/*  Telemetry Signal Chart (SVG)  */}
<div className="bg-surface-container-lowest p-space-md rounded-xl shadow-sm space-y-space-sm">
<div className="flex items-center justify-between">
<span className="font-caption text-caption font-semibold uppercase text-outline">Line 04 Heartbeat Spectrum</span>
<span className="font-label-sm text-label-sm font-mono text-error font-bold">0.00 Mbps</span>
</div>
{/*  SVG Visualizer showing drop to zero  */}
<div className="h-28 w-full bg-surface-container-low rounded-lg p-2 flex flex-col justify-end">
<svg className="w-full h-20 text-error overflow-visible" preserveAspectRatio="none" viewBox="0 0 300 80">
{/*  Grid lines  */}
<line stroke="currentColor" stroke-opacity="0.1" strokeWidth="1" x1="0" x2="300" y1="20" y2="20"></line>
<line stroke="currentColor" stroke-opacity="0.1" strokeWidth="1" x1="0" x2="300" y1="50" y2="50"></line>
{/*  Telemetry flatline graph  */}
<path d="M 0 30 Q 30 25 60 35 T 120 28 T 170 32 L 180 75 L 300 75" fill="none" stroke="currentColor" strokeLinecap="round" strokeWidth="2.5"></path>
{/*  Connection loss pin  */}
<circle className="animate-ping" cx="180" cy="75" fill="currentColor" r="4"></circle>
<circle cx="180" cy="75" fill="currentColor" r="3"></circle>
</svg>
<div className="flex justify-between items-center text-[10px] font-mono text-outline mt-1 pt-1">
<span>14:35:00 UTC</span>
<span className="text-error font-bold">14:38:42 [DISCONNECTED]</span>
<span>NOW</span>
</div>
</div>
<div className="font-caption text-caption text-on-surface-variant flex items-center gap-1.5">
<span className="material-symbols-outlined text-[14px] text-outline">info</span>
            Local network adapter status: UP (Link-state carrier detected, Gateway unroutable)
          </div>
</div>
</div>
</div>
</div>
{/*  Re-authentication Dialog Modal (High priority state recovery dialog)  */}
<div className="fixed inset-0 z-50 bg-inverse-surface/60 backdrop-blur-sm flex items-center justify-center p-space-md" id="authModal">
<div className="bg-surface-container-lowest rounded-xl shadow-2xl max-w-xl w-full overflow-hidden flex flex-col transform transition-all">
{/*  Modal Header  */}
<div className="px-space-lg py-space-md bg-surface-container-low flex items-center justify-between">
<div className="flex items-center gap-space-sm">
<div className="w-9 h-9 rounded-lg bg-primary-container text-on-primary-container flex items-center justify-center shrink-0">
<span className="material-symbols-outlined text-[20px]">verified_user</span>
</div>
<div>
<div className="font-headline-sm text-headline-sm text-on-surface font-bold">Connection Restored — Sign in again to continue</div>
<div className="font-caption text-caption text-on-surface-variant font-mono">21 CFR §11.200 ELECTRONIC SIGNATURE VERIFICATION</div>
</div>
</div>
<span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-900 font-label-sm text-label-sm font-mono font-bold">HEARTBEAT OK</span>
</div>
{/*  Modal Body  */}
<div className="p-space-lg space-y-space-md">
{/*  Context Regulatory Explanation  */}
<div className="p-space-sm rounded-lg bg-surface-container text-on-surface font-body-sm text-body-sm leading-relaxed">
          Heartbeat detected at <span className="font-label-sm text-label-sm font-mono font-semibold">14:39:15 UTC</span>. Secure session token was invalidated during network drop. In accordance with <strong className="text-primary">FDA 21 CFR §11.200 dual-factor session management</strong>, re-authenticate to synchronize offline logs and resume write access.
        </div>
{/*  Identity Confirmation Card  */}
<div className="p-space-sm rounded-lg bg-surface-container-low flex items-center justify-between">
<div className="flex items-center gap-space-sm">
<div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-on-primary font-headline-sm text-headline-sm font-semibold">
              AS
            </div>
<div className="flex flex-col">
<span className="font-headline-sm text-headline-sm font-semibold text-on-surface">Anita Shah</span>
<span className="font-label-sm text-label-sm font-mono text-on-surface-variant">USR-INIT-104 • Packaging Lead / Cleanroom Line 04</span>
</div>
</div>
<span className="material-symbols-outlined text-outline text-[20px]">lock</span>
</div>
{/*  Password Credential Form  */}
<div className="space-y-space-sm">
<label className="font-label-md text-label-md font-semibold text-on-surface block" htmlFor="operator-pw">
            Enter your password to verify identity and resume session
          </label>
<div className="relative">
<input className="w-full h-11 px-3.5 pr-10 rounded-lg bg-surface-container-lowest text-on-surface font-label-md text-label-md focus:outline-none focus:ring-2 focus:ring-primary shadow-sm" id="operator-pw" placeholder="Operator cryptographic password" type="password" defaultValue="••••••••••••"/>
<span className="material-symbols-outlined text-outline absolute right-3 top-2.5 text-[20px] pointer-events-none">key</span>
</div>
</div>
{/*  Offline Queue Confirmation Checkbox  */}
<div className="p-space-sm rounded-lg bg-primary-container/10 flex items-start gap-space-sm cursor-pointer select-none">
<input defaultChecked className="mt-1 w-4 h-4 rounded text-primary focus:ring-primary focus:ring-offset-0 cursor-pointer" id="queueCheck" type="checkbox"/>
<label className="font-body-sm text-body-sm text-on-surface cursor-pointer" htmlFor="queueCheck">
<strong className="font-semibold text-primary">Verify pending offline queue:</strong> 3 sensor telemetry events and 1 environmental timestamp pending commit to central audit ledger.
          </label>
</div>
</div>
{/*  Modal Footer  */}
<div className="px-space-lg py-space-md bg-surface-container-low flex flex-col-reverse sm:flex-row items-center justify-between gap-space-sm">
<button className="w-full sm:w-auto min-h-[44px] px-space-md py-2 rounded-lg bg-surface-container-high hover:bg-surface-container-highest text-on-surface font-label-md text-label-md font-semibold transition-colors flex items-center justify-center gap-1.5"  type="button">
<span className="material-symbols-outlined text-[18px]">visibility</span>
          Work Offline (View Only)
        </button>
<button className="w-full sm:w-auto min-h-[44px] px-space-lg py-2 rounded-lg bg-primary hover:bg-primary-container text-on-primary font-label-md text-label-md font-semibold shadow-md transition-colors flex items-center justify-center gap-2"  type="button">
<span className="material-symbols-outlined text-[18px]">sync_saved_locally</span>
          Sign In &amp; Re-sync
        </button>
</div>
</div>
</div>
</div>

    </AppLayout>
  );
}
