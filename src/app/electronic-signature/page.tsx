"use client";

import React from "react";
import Link from "next/link";
import AppLayout from "@/components/layout/AppLayout";

export default function ElectronicSignatureDialogPage() {
  return (
    <AppLayout screenCode="S04">
      <div className="flex flex-col w-full pb-space-xl">
{/*  Top Banner / Operational Context Header  */}
<section className="mb-space-lg">
<div className="flex flex-col lg:flex-row lg:items-center justify-between gap-space-md p-space-lg rounded-xl bg-surface-container-lowest shadow-sm">
<div className="flex flex-col gap-space-xs">
<div className="flex items-center gap-space-sm flex-wrap">
<span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-secondary-container text-on-secondary-container font-label-md text-label-sm font-semibold">
<span className="material-symbols-outlined text-[15px]">verified</span>
            21 CFR §11.50 Manifestation Standard
          </span>
<span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-surface-container-high text-on-surface-variant font-label-sm text-[11px] font-mono">
<span className="w-1.5 h-1.5 rounded-full bg-secondary"></span>
            SHA-256 Signature Bus Active
          </span>
<span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-surface-container text-tertiary font-label-sm text-[11px]">
            NTP Jitter &lt; 0.4ms
          </span>
</div>
<h1 className="font-headline-lg text-headline-lg text-primary tracking-tight mt-1">
          S04 Electronic Signature Dialog &amp; Manifestation Variants
        </h1>
<p className="font-body-md text-body-md text-on-surface-variant max-w-4xl">
          Cryptographically bound electronic signature ceremonies for batch release, custody handover, and administrative re-authentication. Strictly compliant with FDA 21 CFR Part 11 §11.50 (signature manifestations: printed name, date/time, meaning) and §11.200 (signature components &amp; dual-factor verification).
        </p>
</div>
{/*  Live Telemetry Capsule  */}
<div className="flex items-center gap-space-md p-space-sm rounded-lg bg-surface-container-low self-start lg:self-auto">
<div className="flex flex-col text-right">
<span className="font-caption text-caption text-on-surface-variant uppercase font-semibold">Audit Terminal Node</span>
<span className="font-label-sm text-label-sm text-primary font-mono">CR4-WORKSTATION-09</span>
<span className="font-caption text-[10px] text-secondary font-mono">HSM-KEY: 0x94B2...E107</span>
</div>
<div className="w-10 h-10 rounded-lg bg-primary-container text-on-primary-container flex items-center justify-center">
<span className="material-symbols-outlined text-[22px]">fingerprint</span>
</div>
</div>
</div>
</section>
{/*  Cleanroom Backdrop Multi-Variant Studio Grid  */}
<div className="grid grid-cols-1 xl:grid-cols-12 gap-space-lg items-start">
{/*  LEFT PANEL: Primary Dialog (Variant A) - 7 cols on XL  */}
<div className="xl:col-span-7 flex flex-col gap-space-lg">
{/*  Dialog Shell Card A  */}
<div className="rounded-xl bg-surface-container-lowest shadow-md overflow-hidden relative">
{/*  Visual Cleanroom Watermark / Top Trim  */}
<div className="h-1.5 w-full bg-gradient-to-r from-primary-container via-secondary to-primary"></div>
{/*  Dialog Header  */}
<div className="p-space-lg bg-surface-container-lowest flex items-start justify-between">
<div className="flex items-start gap-space-sm">
<div className="w-10 h-10 rounded-lg bg-primary-container/15 text-primary flex items-center justify-center shrink-0">
<span className="material-symbols-outlined text-[24px]">draw</span>
</div>
<div className="flex flex-col">
<div className="flex items-center gap-space-xs">
<span className="font-headline-sm text-headline-sm text-on-surface font-semibold">Electronic Signature</span>
<span className="px-2 py-0.5 rounded-full bg-surface-container text-secondary font-label-sm text-[10px] uppercase font-mono tracking-wide">Variant A: Batch Custody</span>
</div>
<span className="font-caption text-caption text-on-surface-variant">
                Standard Operational Signing Ceremony • Cleanroom Line 04 Intakes
              </span>
</div>
</div>
<div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-secondary-container/40 text-on-secondary-container font-label-sm text-[11px] font-mono">
<span className="material-symbols-outlined text-[14px]">lock</span>
<span>TLS 1.3 • SHA-256</span>
</div>
</div>
{/*  Dialog Content Body  */}
<div className="p-space-lg space-y-space-md">
{/*  1. Signer Information Grid (Read-only §11.50)  */}
<div className="p-space-md rounded-lg bg-surface-container-low">
<div className="flex items-center justify-between mb-space-xs">
<span className="font-caption text-caption text-on-surface-variant uppercase tracking-wider font-semibold">Signer Information (§11.50 / §11.200)</span>
<span className="inline-flex items-center gap-1 font-label-sm text-[10px] text-secondary font-mono">
<span className="material-symbols-outlined text-[13px]">verified_user</span> Authenticated Session
              </span>
</div>
<div className="grid grid-cols-1 sm:grid-cols-3 gap-space-sm">
<div className="p-space-sm rounded bg-surface-container-lowest">
<span className="block font-caption text-[10px] text-on-surface-variant uppercase">Full Legal Name</span>
<span className="font-body-md text-body-md font-semibold text-on-surface">Anita Shah</span>
</div>
<div className="p-space-sm rounded bg-surface-container-lowest flex items-center justify-between">
<div>
<span className="block font-caption text-[10px] text-on-surface-variant uppercase">User ID</span>
<span className="font-label-sm text-label-sm text-on-surface font-mono">USR-INIT-104</span>
</div>
<span className="material-symbols-outlined text-on-surface-variant text-[16px]">lock</span>
</div>
<div className="p-space-sm rounded bg-surface-container-lowest">
<span className="block font-caption text-[10px] text-on-surface-variant uppercase">Active Role</span>
<span className="font-body-sm text-body-sm text-on-surface truncate">Packaging Lead</span>
</div>
</div>
</div>
{/*  2. Meaning Badge Showcase (§11.50 Manifestation of Meaning)  */}
<div className="space-y-space-xs">
<div className="flex items-center justify-between">
<span className="font-caption text-caption text-on-surface-variant uppercase tracking-wider font-semibold">
                Signature Meaning (§11.50 Required)
              </span>
<span className="font-caption text-[11px] text-on-surface-variant font-mono">Binding Category: SEC-AUTH-01</span>
</div>
<div className="grid grid-cols-3 gap-space-sm">
{/*  Initiator (Active)  */}
<div className="p-space-sm rounded-lg bg-primary-container text-on-primary-container relative shadow-sm">
<div className="flex items-center justify-between">
<span className="font-label-sm text-label-sm font-bold uppercase tracking-wider">Initiator</span>
<span className="material-symbols-outlined text-[18px]">radio_button_checked</span>
</div>
<p className="font-caption text-[11px] text-on-primary-container/90 mt-1 leading-snug">
                  Authorship &amp; Custody Transfer Verification
                </p>
<div className="mt-2 inline-flex items-center gap-1 font-label-sm text-[9px] uppercase px-1.5 py-0.5 rounded bg-on-primary-container/20 font-mono">
                  Active Meaning
                </div>
</div>
{/*  Review (Inactive option)  */}
<div className="p-space-sm rounded-lg bg-surface-container opacity-60">
<div className="flex items-center justify-between text-on-surface">
<span className="font-label-sm text-label-sm font-medium uppercase tracking-wider">Review</span>
<span className="material-symbols-outlined text-[18px] text-outline">radio_button_unchecked</span>
</div>
<p className="font-caption text-[11px] text-on-surface-variant mt-1 leading-snug">
                  Technical Compliance &amp; Verification
                </p>
</div>
{/*  Approval (Inactive option)  */}
<div className="p-space-sm rounded-lg bg-surface-container opacity-60">
<div className="flex items-center justify-between text-on-surface">
<span className="font-label-sm text-label-sm font-medium uppercase tracking-wider">Approval</span>
<span className="material-symbols-outlined text-[18px] text-outline">radio_button_unchecked</span>
</div>
<p className="font-caption text-[11px] text-on-surface-variant mt-1 leading-snug">
                  Quality Disposition Release Authority
                </p>
</div>
</div>
</div>
{/*  3. Record Summary Block  */}
<div className="p-space-md rounded-lg bg-surface-container-low space-y-space-xs">
<span className="font-caption text-caption text-on-surface-variant uppercase tracking-wider font-semibold">Record Summary &amp; Associated Payload</span>
<div className="grid grid-cols-1 md:grid-cols-2 gap-space-sm text-on-surface pt-1">
<div className="flex items-start gap-2">
<span className="material-symbols-outlined text-secondary text-[18px] mt-0.5">inventory_2</span>
<div className="flex flex-col">
<span className="font-caption text-[10px] text-on-surface-variant uppercase font-medium">Record ID / Lot Batch</span>
<span className="font-label-md text-label-md text-primary font-mono font-semibold">BND-2025-081 (Lot LT-26A017)</span>
</div>
</div>
<div className="flex items-start gap-2">
<span className="material-symbols-outlined text-secondary text-[18px] mt-0.5">medication</span>
<div className="flex flex-col">
<span className="font-caption text-[10px] text-on-surface-variant uppercase font-medium">Target Bioproduct</span>
<span className="font-body-md text-body-md font-medium">Insulin Glargine 100 IU/mL</span>
</div>
</div>
<div className="flex items-start gap-2 md:col-span-2">
<span className="material-symbols-outlined text-secondary text-[18px] mt-0.5">alt_route</span>
<div className="flex flex-col">
<span className="font-caption text-[10px] text-on-surface-variant uppercase font-medium">Sign-off Operational Action</span>
<span className="font-body-md text-body-md text-on-surface">Cold Room Chamber Intake (CR-01 Rack RK-CR01-001 Shelf S-02)</span>
</div>
</div>
<div className="flex items-center justify-between md:col-span-2 pt-1 border-t border-outline-variant/30">
<div className="flex items-center gap-1.5">
<span className="material-symbols-outlined text-secondary text-[16px]">timer</span>
<span className="font-caption text-[11px] text-on-surface-variant">Elapsed Hold Time:</span>
<span className="font-label-sm text-label-sm text-on-surface font-mono font-semibold">0h 42m (Compliant)</span>
</div>
<span className="inline-flex items-center px-2 py-0.5 rounded bg-surface-container-high text-on-surface-variant font-label-sm text-[10px] font-mono">
                  SOP-CR-402 Rev 12
                </span>
</div>
</div>
</div>
{/*  4. Automatic Timestamp (NTP Synchronized Read-Only)  */}
<div className="flex items-center justify-between px-space-md py-2.5 rounded-lg bg-surface-container font-label-md text-label-sm text-on-surface">
<div className="flex items-center gap-space-xs">
<span className="material-symbols-outlined text-secondary text-[18px]">alarm_on</span>
<span className="font-caption text-caption text-on-surface-variant">Recorded automatically:</span>
<span className="font-mono text-primary font-bold">22/11/2026 15:42:18 UTC</span>
</div>
<span className="px-1.5 py-0.5 rounded bg-surface-container-highest text-on-surface-variant font-label-sm text-[10px] font-mono">
              NTP Synchronized
            </span>
</div>
{/*  5. Mandatory Legal Confirmation Checkbox  */}
<div className="p-space-md rounded-lg bg-surface-container-lowest">
<label className="flex items-start gap-space-sm cursor-pointer select-none">
<input className="mt-1 w-4 h-4 rounded text-primary focus:ring-primary focus:ring-offset-0 cursor-pointer" id="sigConsentCheck"  type="checkbox"/>
<div className="flex flex-col">
<span className="font-body-md text-body-md font-semibold text-on-surface">
                  I confirm this record is accurate and complete
                </span>
<span className="font-caption text-caption text-on-surface-variant leading-relaxed mt-0.5">
                  Under 21 CFR Part 11 §11.100, this cryptographic signature is the legally binding equivalent of my traditional handwritten initials or full signature, holding identical legal liability and regulatory traceability.
                </span>
</div>
</label>
</div>
{/*  6. Password & Dual-factor Authenticator Input  */}
<div className="space-y-space-xs">
<div className="flex items-center justify-between">
<label className="font-body-sm text-body-sm font-medium text-on-surface" htmlFor="sigPasswordInput">
                Account Password Verification
              </label>
<span className="font-caption text-[11px] text-on-surface-variant">Attempt 1 of 3 allowed</span>
</div>
<div className="relative">
<span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-[18px]">key</span>
<input className="w-full pl-10 pr-10 py-2 rounded-lg bg-surface-container-lowest text-on-surface text-body-md focus:outline-none focus:ring-2 focus:ring-primary h-11 placeholder:text-outline" id="sigPasswordInput"  placeholder="Enter password to authenticate" type="password"/>
<button className="absolute right-2.5 top-1/2 -translate-y-1/2 text-on-surface-variant hover:text-on-surface p-1"  type="button">
<span className="material-symbols-outlined text-[18px]">visibility</span>
</button>
</div>
<p className="font-caption text-[11px] text-on-surface-variant flex items-center gap-1 pt-0.5">
<span className="material-symbols-outlined text-[13px] text-secondary">info</span>
              Cleanroom SSO credential required. Session terminates on 3 consecutive failures.
            </p>
</div>
{/*  7. Action Footers (Min 44px cleanroom targets)  */}
<div className="flex items-center justify-end gap-space-sm pt-space-sm">
<button className="min-h-[44px] px-space-lg rounded-lg bg-surface-container text-on-surface font-body-md font-medium hover:bg-surface-container-high transition-colors" type="button">
              Cancel
            </button>
<button className="min-h-[44px] px-space-xl rounded-lg bg-primary text-on-primary font-body-md font-semibold opacity-40 cursor-not-allowed transition-all flex items-center gap-2 shadow-sm" disabled id="submitSignButton"  type="button">
<span className="material-symbols-outlined text-[18px]">verified</span>
<span>Sign</span>
</button>
</div>
</div>
</div>
{/*  Real-Time Signature Manifestation Banner (Simulated Workflow Feed)  */}
<div className="hidden p-space-md rounded-xl bg-secondary-container/30 text-on-secondary-container shadow-sm flex items-center justify-between" id="signingSimulationAlert">
<div className="flex items-center gap-space-sm">
<span className="material-symbols-outlined text-secondary text-[22px] animate-spin">refresh</span>
<div className="flex flex-col">
<span className="font-headline-sm text-body-md font-semibold text-on-surface">Signature Ceremony Complete</span>
<span className="font-caption text-caption text-on-surface-variant font-mono">Payload bound to Block 89,412 • Digest verified</span>
</div>
</div>
<button className="px-3 py-1 rounded bg-secondary text-on-secondary font-label-sm text-label-sm font-semibold" >
          Dismiss
        </button>
</div>
</div>
{/*  RIGHT PANEL: Variant B (Admin Re-auth) + Variant C (Stamp Manifestation) - 5 cols on XL  */}
<div className="xl:col-span-5 flex flex-col gap-space-lg">
{/*  VARIANT B: Administrative Re-authentication Modal (Explicitly NO meaning badge)  */}
<div className="rounded-xl bg-surface-container-lowest shadow-md overflow-hidden">
<div className="h-1.5 w-full bg-error"></div>
<div className="p-space-md bg-surface-container-lowest flex items-start justify-between">
<div className="flex items-start gap-space-sm">
<div className="w-9 h-9 rounded-lg bg-error-container text-on-error-container flex items-center justify-center shrink-0">
<span className="material-symbols-outlined text-[20px]">admin_panel_settings</span>
</div>
<div className="flex flex-col">
<div className="flex items-center gap-space-xs">
<span className="font-headline-sm text-headline-sm text-on-surface font-semibold">Re-authentication Required</span>
</div>
<span className="font-caption text-caption text-on-surface-variant">
                Administrative elevation or critical system parameter modification (no meaning badge required)
              </span>
</div>
</div>
<span className="inline-flex items-center px-2 py-0.5 rounded bg-error-container text-on-error-container font-label-sm text-[10px] font-bold font-mono">
            ELEVATED-S04
          </span>
</div>
<div className="p-space-md space-y-space-md">
{/*  Administrator Signer Info  */}
<div className="p-space-sm rounded-lg bg-surface-container-low grid grid-cols-2 gap-space-xs">
<div>
<span className="block font-caption text-[10px] text-on-surface-variant uppercase">Administrator</span>
<span className="font-body-md text-body-md font-semibold text-on-surface">Dr. Marcus Vance</span>
</div>
<div>
<span className="block font-caption text-[10px] text-on-surface-variant uppercase">User ID</span>
<span className="font-label-sm text-label-sm font-mono text-primary font-semibold">USR-HOD-201</span>
</div>
<div className="col-span-2 pt-1">
<span className="block font-caption text-[10px] text-on-surface-variant uppercase">Security Clearance</span>
<span className="font-caption text-[11px] text-on-surface font-medium">Level 4 Administrator • Biologics Release Commission</span>
</div>
</div>
{/*  Parameter Modification Payload  */}
<div className="p-space-sm rounded-lg bg-surface-container space-y-1">
<span className="font-caption text-[10px] text-on-surface-variant uppercase font-semibold">System Configuration Change</span>
<p className="font-body-sm text-body-sm font-medium text-error">
              Modify Temperature Alert Threshold from ±0.5°C to ±0.8°C for Chamber CR-02
            </p>
<div className="flex items-center justify-between text-on-surface-variant font-label-sm text-[10px] font-mono pt-1">
<span>Timestamp: 22/11/2026 15:42 UTC</span>
<span className="text-tertiary">Impact: Cold Room Chamber CR-02</span>
</div>
</div>
{/*  Justification Textarea  */}
<div className="space-y-1">
<label className="font-body-sm text-body-sm font-medium text-on-surface flex items-center justify-between">
<span>Regulatory Justification (Mandatory)</span>
<span className="font-caption text-[10px] text-on-surface-variant font-mono">CAPA-2025-042</span>
</label>
<textarea className="w-full p-2.5 rounded-lg bg-surface-container-low text-on-surface font-body-sm text-body-sm focus:outline-none focus:ring-2 focus:ring-primary resize-none" placeholder="Mandatory change reason per CAPA-2025-042..." rows={2}>Calibration protocol updated per Engineering Deviation ED-841 to accommodate upgraded PT-100 sensor response curves.</textarea>
</div>
{/*  Password verification  */}
<div className="relative">
<span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-[18px]">password</span>
<input className="w-full pl-10 pr-4 py-2 rounded-lg bg-surface-container text-on-surface font-body-sm h-11 focus:outline-none focus:ring-2 focus:ring-error" placeholder="Re-enter admin master password" type="password"/>
</div>
{/*  Admin Buttons  */}
<div className="flex items-center justify-end gap-space-sm">
<button className="min-h-[44px] px-space-md rounded-lg bg-surface-container text-on-surface font-body-sm hover:bg-surface-container-high transition-colors" type="button">
              Cancel
            </button>
<button className="min-h-[44px] px-space-lg rounded-lg bg-error text-on-error font-body-sm font-semibold hover:opacity-90 transition-opacity flex items-center gap-1.5 shadow-sm" type="button">
<span className="material-symbols-outlined text-[18px]">security</span>
<span>Confirm &amp; Re-authenticate</span>
</button>
</div>
</div>
</div>
{/*  VARIANT C: Resulting Signature Stamp Manifestation (§11.50 Output)  */}
<div className="rounded-xl bg-surface-container-lowest shadow-md overflow-hidden">
<div className="p-space-md bg-surface-container-lowest flex items-center justify-between">
<div className="flex items-center gap-space-xs">
<span className="material-symbols-outlined text-secondary text-[20px]">verified</span>
<span className="font-headline-sm text-headline-sm text-on-surface font-semibold">21 CFR §11.50 Signature Stamp</span>
</div>
<span className="px-2 py-0.5 rounded bg-surface-container text-on-surface-variant font-label-sm text-[10px] font-mono">
            Post-Signature Output
          </span>
</div>
<div className="p-space-md space-y-space-md">
<p className="font-caption text-caption text-on-surface-variant">
            Official immutable digital manifestation as permanently rendered in batch binders, inspection logs, and printed release certificates.
          </p>
{/*  Primary Stamp Demonstration (Requested exact format)  */}
<div className="p-space-md rounded-lg bg-surface-container-low shadow-sm relative overflow-hidden">
{/*  Seal Icon watermark  */}
<span className="material-symbols-outlined absolute -right-4 -bottom-4 text-surface-container text-[120px] pointer-events-none select-none">approval_delegation</span>
<div className="relative z-10 flex flex-col gap-space-xs">
{/*  Canonical Required Text Output  */}
<div className="flex items-center gap-2">
<span className="w-2.5 h-2.5 rounded-full bg-secondary"></span>
<span className="font-headline-sm text-body-lg font-bold text-primary tracking-tight">
                  Signed by Priya Nair • 22/11/2026 15:42 • Review
                </span>
</div>
{/*  Metadata Cryptographic Manifestation details  */}
<div className="grid grid-cols-1 gap-1 pt-1 font-mono text-[11px] text-on-surface-variant">
<div className="flex items-center justify-between">
<span className="font-semibold text-on-surface">Cryptographic Hash:</span>
<span className="text-primary font-bold">Hash: 71c48f21...33af</span>
</div>
<div className="flex items-center justify-between">
<span>Signer ID &amp; Token:</span>
<span>USR-REV-049 • Yubikey-OTP-v5</span>
</div>
<div className="flex items-center justify-between">
<span>Manifestation Target:</span>
<span>Record BND-2025-081 • SHA256-Payload</span>
</div>
</div>
{/*  Legal Equivalence Clause (§11.50 compliant clause)  */}
<div className="mt-2 pt-2 border-t border-outline-variant/30 flex items-start gap-1.5">
<span className="material-symbols-outlined text-secondary text-[16px] mt-0.5 shrink-0">gavel</span>
<p className="font-caption text-[10px] text-on-surface-variant leading-tight">
<strong className="text-on-surface">Legally equivalent to a handwritten signature under 21 CFR Part 11.</strong>
                  Tamper-evident digest sealed at timestamp. Any subsequent alteration invalidates this release manifest.
                </p>
</div>
</div>
</div>
{/*  Document Embedded View Sample  */}
<div className="p-space-sm rounded-lg bg-surface-container space-y-2">
<span className="font-caption text-[10px] text-on-surface-variant uppercase font-semibold">Embedded In Batch Audit Ledger</span>
<div className="space-y-1.5">
{/*  Ledger Entry 1  */}
<div className="flex items-center justify-between p-2 rounded bg-surface-container-lowest font-body-sm">
<div className="flex items-center gap-2">
<span className="material-symbols-outlined text-secondary text-[16px]">check_circle</span>
<span className="font-mono text-[11px] text-primary">Anita Shah • 15:42:18 • Initiator</span>
</div>
<span className="font-label-sm text-[10px] text-on-surface-variant font-mono">BND-INIT-SUCCESS</span>
</div>
{/*  Ledger Entry 2  */}
<div className="flex items-center justify-between p-2 rounded bg-surface-container-lowest font-body-sm">
<div className="flex items-center gap-2">
<span className="material-symbols-outlined text-secondary text-[16px]">check_circle</span>
<span className="font-mono text-[11px] text-primary">Priya Nair • 15:42:49 • Review</span>
</div>
<span className="font-label-sm text-[10px] text-on-surface-variant font-mono">REV-VERIFIED</span>
</div>
</div>
</div>
</div>
</div>
</div>
</div>
{/*  Operational Guideline Banner at bottom  */}
<section className="mt-space-lg p-space-md rounded-xl bg-surface-container-low shadow-sm flex flex-col md:flex-row items-center justify-between gap-space-md">
<div className="flex items-center gap-space-md">
<div className="w-10 h-10 rounded-lg bg-surface-container-highest text-tertiary flex items-center justify-center shrink-0">
<span className="material-symbols-outlined text-[22px]">policy</span>
</div>
<div className="flex flex-col">
<span className="font-headline-sm text-body-md font-semibold text-on-surface">FDA 21 CFR §11.50 Compliance Note</span>
<span className="font-body-sm text-body-sm text-on-surface-variant">
          Signatures manifested on screen, export PDFs, and cold-chain batch logs must carry the printed name of signer, the date and time, and the explicit associated meaning. Dual-factor authorization must execute on every non-continuous session action.
        </span>
</div>
</div>
<div className="flex items-center gap-2 shrink-0">
<span className="px-2.5 py-1 rounded bg-surface-container text-on-surface font-label-sm text-[11px] font-mono">
        Audit Ref: AUD-SOP-2025
      </span>
<span className="px-2.5 py-1 rounded bg-secondary-container text-on-secondary-container font-label-sm text-[11px] font-mono font-semibold">
        Valid
      </span>
</div>
</section>
</div>

    </AppLayout>
  );
}
