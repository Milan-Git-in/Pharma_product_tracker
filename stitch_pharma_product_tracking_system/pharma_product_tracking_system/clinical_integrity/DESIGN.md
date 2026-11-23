---
name: Clinical Integrity
colors:
  surface: '#f7f9fb'
  surface-dim: '#d8dadc'
  surface-bright: '#f7f9fb'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f2f4f6'
  surface-container: '#eceef0'
  surface-container-high: '#e6e8ea'
  surface-container-highest: '#e0e3e5'
  on-surface: '#191c1e'
  on-surface-variant: '#40484d'
  inverse-surface: '#2d3133'
  inverse-on-surface: '#eff1f3'
  outline: '#70787d'
  outline-variant: '#bfc8cd'
  surface-tint: '#1b6681'
  primary: '#00465c'
  on-primary: '#ffffff'
  primary-container: '#0f5f7a'
  on-primary-container: '#96d7f6'
  inverse-primary: '#8fcfee'
  secondary: '#2d657c'
  on-secondary: '#ffffff'
  secondary-container: '#afe4ff'
  on-secondary-container: '#2f677e'
  tertiary: '#324257'
  on-tertiary: '#ffffff'
  tertiary-container: '#49596f'
  on-tertiary-container: '#bfd0ea'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#bee9ff'
  primary-fixed-dim: '#8fcfee'
  on-primary-fixed: '#001f2a'
  on-primary-fixed-variant: '#004d65'
  secondary-fixed: '#bde9ff'
  secondary-fixed-dim: '#98cee8'
  on-secondary-fixed: '#001f2a'
  on-secondary-fixed-variant: '#0a4d63'
  tertiary-fixed: '#d3e4fe'
  tertiary-fixed-dim: '#b7c8e1'
  on-tertiary-fixed: '#0b1c30'
  on-tertiary-fixed-variant: '#38485d'
  background: '#f7f9fb'
  on-background: '#191c1e'
  surface-variant: '#e0e3e5'
typography:
  headline-xl:
    fontFamily: Inter
    fontSize: 32px
    fontWeight: '600'
    lineHeight: 40px
    letterSpacing: -0.02em
  headline-xl-mobile:
    fontFamily: Inter
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
    letterSpacing: -0.01em
  headline-lg:
    fontFamily: Inter
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
    letterSpacing: -0.015em
  headline-md:
    fontFamily: Inter
    fontSize: 20px
    fontWeight: '600'
    lineHeight: 28px
    letterSpacing: -0.01em
  headline-sm:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '600'
    lineHeight: 24px
    letterSpacing: -0.005em
  body-lg:
    fontFamily: Inter
    fontSize: 15px
    fontWeight: '400'
    lineHeight: 22px
  body-md:
    fontFamily: Inter
    fontSize: 13px
    fontWeight: '400'
    lineHeight: 20px
  body-sm:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '400'
    lineHeight: 18px
  label-lg:
    fontFamily: JetBrains Mono
    fontSize: 13px
    fontWeight: '500'
    lineHeight: 18px
    letterSpacing: 0.02em
  label-md:
    fontFamily: JetBrains Mono
    fontSize: 12px
    fontWeight: '500'
    lineHeight: 16px
    letterSpacing: 0.02em
  label-sm:
    fontFamily: JetBrains Mono
    fontSize: 11px
    fontWeight: '500'
    lineHeight: 14px
    letterSpacing: 0.03em
  caption:
    fontFamily: Inter
    fontSize: 11px
    fontWeight: '500'
    lineHeight: 16px
    letterSpacing: 0.01em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  gutter: 1rem
  gutter-sm: 0.5rem
  gutter-lg: 1.5rem
  margin: 1.5rem
  margin-sm: 1rem
  margin-lg: 2rem
  space-xs: 0.25rem
  space-sm: 0.5rem
  space-md: 1rem
  space-lg: 1.5rem
  space-xl: 2rem
---

## Brand & Style

This design system establishes an ultra-precise, calm, and uncompromisingly compliant user experience tailored for regulated Good Manufacturing Practice (GMP) biopharmaceutical operations. Rooted in analytical clarity and zero-error ergonomics, the aesthetic balances modern technical elegance (reminiscent of Linear and Stripe Dashboard) with the institutional authority required by audit-ready environments.

The visual direction blends **Modern Corporate** structure with **High-Information Density Precision**:
- Uncluttered, crisp surfaces that suppress visual noise, allowing operators and quality managers to rapidly parse critical lot lineages, quarantine statuses, and hold-time countdowns.
- Clear structural division governed by micro-borders and deliberate tonal steps rather than heavy drop shadows.
- Total commitment to an error-preventative cognitive environment: high legibility, explicit state delineation, and rigid spatial hierarchy.

## Colors

The palette is strictly configured for a single, focused `light` mode. It guarantees optimal legibility under controlled cleanroom lighting and bright laboratory environments.

### Core Roles
- **Primary (`#0F5F7A` / Deep Teal-Blue):** The anchor for critical primary actions, active navigation states, validated system links, and prominent compliance headers.
- **Secondary (`#0D4E64` / Midnight Deep Teal):** Used for hover states, selected interactive container outlines, and deep contextual grounding.
- **Tertiary (`#64748B` / Slate Neutral):** For auxiliary metadata, closed workflows, secondary tabs, inactive states, and structural dividers.
- **Neutral Canvas (`#FFFFFF` & `#F8FAFC`):** Primary data surfaces sit on pure white (`#FFFFFF`) to ensure crisp text contrast, surrounded by `#F8FAFC` for app shells and `#F1F5F9` for nested data grids, inspect panels, and table headers.

### GMP Status & Compliance Tokens
- **Compliant / Within Limit (`#10B981`):** Applied to released lots, passed bio-burden assays, verified cold-chain records, and active running equipment.
- **Caution / Warning 80%+ Limit (`#F59E0B`):** Applied to approaching hold-times, parameter drifts, or pending QA approvals.
- **Critical / Exceeded / Quarantine (`#EF4444`):** High-priority state indicating violated hold-times, failed environmental controls, or deviation flags requiring electronic signatures (21 CFR Part 11).
- **Inactive / Archived (`#64748B`):** Decommissioned suites, consumed lots, and closed deviation logs.

## Typography

The typographic hierarchy divides utility strictly between human-language comprehension (`Inter`) and alphanumeric record-keeping (`JetBrains Mono`).

- **Inter:** Drives general interface scanning, instructions, standard tables, modals, and operational summaries. Tabular figures (`tnum`) must be toggled on across all standard numeric data points in tables.
- **JetBrains Mono:** Mandated across all GMP-sensitive strings—including Master Batch Records (MBR), Lot IDs, Global Trade Item Numbers (GTIN), GS1 DataMatrix strings, sample identifiers, timestamps, and equipment IDs. Monospaced rendering eliminates optical confusion between `0` / `O` and `1` / `l` / `I`.
- **Micro-Scale Density:** Body copy is scaled to compact thresholds (`13px` default table and content size) to provide maximum situational awareness per viewport without sacrificing optical legibility.

## Layout & Spacing

The layout is structured around an uncompromising 8px baseline grid with 4px sub-intervals for tight micro-component arrangements.

### Grid & Ergonomics
- **Fluid Layout Structure:** Employs a continuous multi-pane workspace (collapsible left-hand master lineage navigation, central fluid tabular inventory/batch console, and fixed 380px contextual right-hand inspection drawer).
- **GMP Touch & Hit Targets:** Regardless of compact spatial layouts, every interactive row, trigger, input, and button enforces an explicit interactive bounding box of at least **44px × 44px** (achieved via CSS hit-area expansion where visible UI is sub-40px). This accommodates gloved operational workflows on cleanroom panel PCs and ruggedized tablets.
- **Breakpoints:**
  - `Mobile / Handheld (<768px):` Stacked single-column card flows with persistent bottom-anchored audit validation bars.
  - `Tablet / Cleanroom Panel (768px - 1199px):` Collapsible drawer layout; data tables maintain horizontal overflow with sticky primary key (Lot ID) columns.
  - `Desktop / Workstation (≥1200px):` High-density multi-column workspace, dual-split batch tracking matrices, and inline split inspection views.

## Elevation & Depth

To maintain a sterile, clinical ambiance, this design system avoids heavy drop shadows, blurred overlays, or decorative skeuomorphism. Depth is established through **tonal stratification** and **crisp 1px boundary lines**.

### Surface Stacking
- **Base Canvas:** `#F8FAFC` (App background, frame borders).
- **Level 1 (Data Cards & Worksheets):** `#FFFFFF` bordered with `1px solid #E2E8F0`.
- **Level 2 (Active Table Rows, Grouped Clusters):** Surface overlay `#F1F5F9` with a highlighted left border of `3px solid #0F5F7A`.
- **Level 3 (Flyouts, Inspection Drawers, Overlays):** `#FFFFFF` backed by an ultra-subtle ambient shadow: `0px 4px 12px -2px rgba(15, 23, 42, 0.06), 0px 1px 3px 0px rgba(15, 23, 42, 0.04)` combined with a sharp `#E2E8F0` edge perimeter.

## Shapes

The geometric framework leverages a standardized **8px radius (`0.5rem`)** across primary cards, inputs, and container panels, providing a structured, modern, yet humanized balance. 

- **Containers & Modals:** Standardized at `rounded-md` (8px / `0.5rem`).
- **Interactive Badges & Status Tags:** Pill style (`rounded-full` / 9999px) or `rounded-sm` (4px / `0.25rem`) depending on context: pill forms for high-level regulatory state indicators, compact 4px rounded rectangles for monospace data tags.
- **Buttons & Form Fields:** Default to 8px outer radius, creating visual cohesion with container framing.

## Components

### Buttons & Interactive Controls
- **Primary:** Solid `#0F5F7A` background, white text (`Inter 13px Semi-Bold`), `0.5rem` radius. Interactive state: hover shifts to `#0D4E64`. Active cleanroom touch target padded to `min-height: 44px`.
- **Secondary / Outlined:** `#FFFFFF` background, 1px border in `#CBD5E1`, text `#0F5F7A`. Hover initiates light tint `#F1F5F9`.
- **Destructive / Reject:** Subdued red background `#FEF2F2`, border `1px solid #FCA5A5`, text `#DC2626`. Rejection triggers require mandatory secondary authentication confirmation.

### Data Tables & Lots Lists
- High-density rows with vertical row heights of 40px (with expanded 44px click boundaries).
- Alternate row background is suppressed; rows separate via `1px solid #F1F5F9`. Hover state activates `#F8FAFC`.
- All Lot IDs, Formula Codes, and Barcodes are formatted using `JetBrains Mono` with selectable text utilities.

### Compliance Badges & Status Chips
- Height of 22px, inline-flex alignment.
- **Compliant / Released:** Background `#ECFDF5`, border `1px solid #A7F3D0`, text `#065F46`. Leading 6px filled status dot.
- **Hold-Time Warning:** Background `#FFFBEB`, border `1px solid #FDE68A`, text `#92400E`. Includes dynamic countdown monospaced timer (`T- 01:24:10`).
- **Quarantined / Deviation:** Background `#FEF2F2`, border `1px solid #FECACA`, text `#991B1B`. Pulsing alert indicator.

### Input Fields & Verification Controls
- Standard input height of 36px (within a 44px operational touch plane).
- Border: `1px solid #CBD5E1`. Background: `#FFFFFF`. Focus ring: `2px solid #0F5F7A` with 0px offset.
- Mandatory electronic signature fields display an explicit lock icon and user ID confirmation pill.

### Cards & Process Containers
- Background `#FFFFFF`, border `1px solid #E2E8F0`. Padding strictly adhering to `space-md` (16px).
- Card headers feature subtle border-b (`#F1F5F9`), housing the stage status, SOP reference code (`JetBrains Mono`), and last-calibrated metadata.