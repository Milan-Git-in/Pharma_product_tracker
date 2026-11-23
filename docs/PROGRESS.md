# Product Tracking System — Prototype Progress Log

## Phase 0 — Foundation
**Status: COMPLETED** · 22/11/2026

### What Was Built:
1. **Verbatim Specification**: Saved full Master Spec to `/docs/SPEC.md`.
2. **Architecture & Folder Structure**:
   - `/src/config`: Terminology dictionary (`terms.ts`), initial seed data (`seed.ts`).
   - `/src/domain`: Data models and types (`types.ts`), pure business logic self-test suite (`selftest.ts`).
   - `/src/api`: Unified mock API layer (`index.ts`) with simulated async latency (150–400ms) and `NETWORK_ERROR` switch.
   - `/src/services`:
     - `storage.ts`: Single storage wrapper, AES-GCM Web Crypto envelope simulation for encrypted-at-rest, in-memory cache with write-through, fallback to memory if localStorage is blocked, entity repositories.
     - `time.ts`: `TimeService` managing simulated company-server time = device time + adjustable offset (`now()`, `nowDate()`, `setOffsetMs()`).
     - `format.ts`: `fmtDateTime`, `fmtDate`, `fmtTime`, `fmtDuration` ("Xd Yh Zm"), `fmtCountdown`.
     - `crypto.ts`: Pure SHA-256 (`window.crypto.subtle`), canonical JSON stringifier, salted password hashing (`hashPassword`, `verifyPassword`), AES-GCM storage envelope encryption/decryption.
     - `audit.ts`: `AuditService` with append-only, tamper-evident hash chaining (`hash = SHA-256(prevHash + canonical JSON)`), genesis block initialization, and `verifyChain()` integrity checker.
     - `permission.ts`: `can(user, permission, resource)` checking role/group sets, enforcing Admin restriction on binder creation/movement/signing, and HOD department scoping.
     - `session.tsx`: Role-aware session management context, server clock synchronizer, seed data bootstrapper.
   - `/src/components`:
     - Theme tokens (`theme/design.ts`) matching `clinical_integrity/DESIGN.md`.
     - Layout: `TopBar.tsx`, `Sidebar.tsx`, `AppLayout.tsx` featuring permanent "PROTOTYPE – NOT VALIDATED – do not enter real GMP data" ribbon.
     - Shared UI primitives: `Button`, `Input`, `Select`, `Modal`, `Drawer`, `DataTable`, `StatusPill`, `HoldChip`, `Toast`, `AlertBanner`, `ConfirmDialog`, `ReasonDialog`, `KPICard`, `ScannerCard`.
     - Dev menu (`DevMenu.tsx`): Active role switcher (Admin, Initiator, HOD, QA), time advance buttons, network failure toggle, "Reset all data to §6 Seed", link to `/#/dev/selftest`.
     - Router: `HashRouterApp.tsx` routing all 24 screens client-side without server code.
   - `/src/pages`: All 24 Stitch screens (S01–S24) and `DevSelfTestPage`.
3. **Seed Data Loaded (§6)**:
   - 7 Users: `admin1`, `init1`, `init2`, `hod1`, `qa1`, `multi1`, `newuser1` (passwords "Demo@1234").
   - 4 Groups: System Administrators, Packaging Initiators, Department Reviewers (HOD), QA Auditors.
   - 4 Departments, 4 Locations (Cold rooms CR-01, CR-02, Areas VI & Packing), 6 Racks, 12 Pallets.
   - 5 Workflow Stages: `filling-complete` → `cold-room` → `visual-inspection` → `packing` → `packed`.
   - 4 Hold Rules (60 min limits, 80% warning threshold).
   - SignRoute: INITIATOR → REVIEW (HOD) → APPROVAL (QA).
   - 6 Binders in different stages (including EXCEEDED, WARNING, and fully signed).
   - Initial genesis audit entry appended to chain.
4. **Self-Test Suite (`/#/dev/selftest`)**:
   - Automated browser verification of TimeService, SHA-256, canonical JSON, salted passwords, audit hash chain, permissions, storage envelopes, terms dictionary, and date formatting.

---

## Phase 2 — Audit Trail Viewer (S17)
**Status: COMPLETED** · 22/11/2026

### What Was Built:
1. **API Endpoints**:
   - `GET /audit` (filters: date range, user, action, entity, product, lot, batch).
   - `GET /audit/record/:entityId` for per-record chronological audit timeline.
   - `GET /audit/verify` recomputing SHA-256 chain and reporting integrity proof or tampered seq.
2. **Viewer & Cleanroom Filters**:
   - Two-tier filter panel: date range, operator select, target product, lot no, batch no, 10 action chips.
   - Reusable `RecordAuditDrawer` component displaying chronological history, field old→new diffs, mandatory reason, and SHA-256 stamp.
   - Verification modal with real-time recalculation of all hash blocks.
   - Dev mode (`?dev=1`) "Corrupt One Row" trigger to demonstrate tamper-evident detection.
3. **Exports & Regulatory Formats**:
   - RFC-compliant CSV export with BOM.
   - Official 21 CFR Part 11 landscape PDF dossier via jsPDF + autoTable with dataset checksum and running footer `"Printed by {fullName} ({userId}) on {DD/MM/YYYY HH:MM} — Page X of Y"` on every page.
4. **Permissions Enforcement**:
   - Restricted to `audit.view` and `audit.export` (Admin and QA only). Initiator and HOD blocked with access restriction screen.

---

## Phase 3 — Users, Groups & Permissions (S18, S19)
**Status: COMPLETED** · 22/11/2026

### What Was Built:
1. **API Endpoints**:
   - `GET /users`: Retrieves all personnel records.
   - `POST /users`: Provisions new operator with mandatory regulatory reason and non-reuse validation.
   - `PATCH /users/:id`: Updates legal name, department, group, e-sign manifestations with old→new audit diffs. User ID is immutable.
   - `POST /users/:id/lock` & `unlock`: Updates account status and resets failed attempt counters with audit trail logging.
   - `POST /users/:id/deactivate` & `reactivate`: Updates lifecycle state. Deactivated IDs are permanently retired and cannot be reused.
   - `POST /users/:id/reset-password`: Admin-only reset generating a compliant temporary password shown once, enforcing mandatory password rotation on next login.
   - `GET /groups`: Retrieves all authority groups.
   - `POST /groups` & `PATCH /groups/:id`: Provisions and modifies role groups with mandatory reasons.
   - `PUT /groups/:id/permissions`: Updates group permissions array, writing `ROLE_RIGHTS` audit entries with diffs.
2. **UI Screens**:
   - **S18 User Management (`UserManagementPage.tsx`)**:
     - Real-time directory table with search, status tabs (Active, Locked, Disabled, Deactivated), and department filters.
     - Add/Edit side drawer with immutable User ID badge, department selection, role group assignment, and e-signature manifestation checkboxes.
     - Action dialogs with mandatory reason input for Lock/Unlock, Deactivate/Reactivate, and Reset Password.
     - One-time temporary password reveal modal with clipboard copy button.
     - Per-user audit history drawer integration.
     - Export Roster (CSV).
   - **S19 Groups & Access Rights (`GroupsAccessPage.tsx`)**:
     - Dual-column cleanroom layout with System Role Groups on the left and dynamic Permission Matrix on the right.
     - Add / Edit Group modal for custom role tiers with regulatory justification.
     - Modular privilege matrix covering 9 functional domains with interactive toggle switches.
     - CFR locked permissions (Audit trail cannot be altered/deleted).
     - Save Policy modal requiring dual-custody reason for change.
3. **Dynamic Permission Engine**:
   - `can()` and `getUserPermissions()` read directly from stored/cached group configurations. Changing a group's permission matrix immediately updates effective operator access.
4. **Self-Test Diagnostics & Validation**:
   - Automated tests in `selftest.ts` passing (15/15):
     - TimeService timestamp generation & offset adjustment.
     - Crypto SHA-256, canonical JSON, salted password hashing and verification.
     - Append-only hash chain integrity verification (isolated test chain).
     - Permission engine constraints (Admin restricted from movement/binder creation, Initiator allowed).
     - Storage encryption envelope write-through cache.
     - Config-first terminology dictionary resolution.
     - URS date/duration formatters (time-zone neutral).
     - Phase 3: Deactivated user IDs strictly prevented from reuse (21 CFR §11.10(d)).
     - Phase 3: Lock and unlock user status state transitions.
     - Phase 3: Dynamically updated group permissions immediately altering `can()` checks.
   - Build verified: `npx tsc --noEmit` & `npm run build` exit code 0 (54 static pages generated).

---

## Phase 4 — Masters & Barcodes (S20, S21)
**Status: COMPLETED** · 22/11/2026

### What Was Built:
1. **API Endpoints**:
   - `GET|POST|PATCH /masters/{departments|locations|racks|pallets}`:
     - `getMasterEntities`: retrieves records for specified entity type.
     - `createMasterEntity`: provisions validated records with code uniqueness checks and mandatory regulatory Reason for Change. Auto-generates valid barcodes from active formats for Racks and Pallets when blank.
     - `updateMasterEntity`: modifies record details with old→new diffs and mandatory regulatory reason. Enforces barcode and code uniqueness.
   - `POST /masters/:type/:id/activate|deactivate`:
     - Activates or deactivates records under GMP change control. No DELETE operation exists.
   - `GET|PUT /config/barcode-formats`:
     - `getBarcodeFormats` & `updateBarcodeFormats`: stores schema specifications. Per Rule R10, changing a format never modifies already issued barcodes.
   - `POST /barcodes/generate`:
     - Generates single or bulk batches of unique sequential barcodes, checking collisions against all system entities and advancing sequence counters.
   - `GET /barcodes/resolve?code=`:
     - Multi-entity barcode lookup across pallets, racks, locations, and binders.
   - `POST /barcodes/:id/reprint`:
     - Audits reprint events with label preset size (`50x25` or `100x50`) and regulatory justification.
2. **Domain & Services**:
   - `/src/domain/barcode.ts`:
     - Mod-10 / Luhn check digit computation (`calculateLuhnCheckDigit`) and verification (`verifyLuhnCheckDigit`).
     - Segment formatting (`formatBarcodeString`) for LITERAL, LOCATION_CODE, YEAR2, YEAR4, SEQ, DEPT_CODE.
     - Sequential batch generation (`generateUniqueBarcodeBatch`) with guaranteed collision avoidance.
     - Forward sample forecasting (`previewNextBarcodes`).
   - `/src/services/labelPrint.ts`:
     - Cleanroom label generation via `jsPDF`, `jsbarcode`, and `qrcode`.
     - Presets for 50 × 25 mm (Rack / Vial standard) and 100 × 50 mm (Pallet / Carton large).
     - Vector Code 128 (1D linear) and QR (2D matrix) symbologies with human-readable code and GMP metadata.
3. **UI Screens**:
   - **S20 Masters (`MastersPage.tsx`)**:
     - 4 Master tabs: Departments, Locations (Cold Rooms & Areas), Racks, Pallets.
     - Telemetry strip: Active counts for Racks, Pallets, Locations, and Departments.
     - Instant filter search across codes, names, parents, and barcodes.
     - Add / Edit modals with validation and mandatory reason for change.
     - Activate / Deactivate status modals.
     - Bulk barcode generation modal with option to auto-commit generated batches to masters.
     - Per-row print label button triggering cleanroom PDF downloads.
     - Per-record 21 CFR Part 11 audit drawer integration.
     - No delete functionality anywhere.
   - **S21 Barcode Designer & Label Print (`BarcodeDesignerPage.tsx`)**:
     - Target Entity selector: Rack (RK), Pallet (PL), Binder (BN/BND).
     - Symbology selector: Code 128 (1D Linear) and QR (2D Matrix).
     - Interactive Format Builder: reorderable segments, delimiter selector (`-`, `_`, `/`, `None`), active toggles, length padding, and Mod-10 / Luhn check digit switch.
     - Real-time live barcode preview rendered dynamically with `jsbarcode` and `qrcode`.
     - Live Next 3 Sample Values forecast.
     - Save Format modal with mandatory regulatory reason and immutability notice.
     - Batch generator card (1–500 codes) with clipboard copy.
     - Cleanroom thermal label print card with 50 × 25 mm and 100 × 50 mm presets.
4. **Self-Test Diagnostics**:
   - Automated tests added to `selftest.ts` (19/19 passing):
     - R10 Immutability: changing RACK format affects only newly created racks; existing issued racks retain their barcodes.
     - Batch uniqueness: 20 pallet barcodes generate with 0 duplicates.
     - Luhn check digit computation and formatted barcode verification.
     - `resolveBarcode()` correctly finds seeded pallet `PL-26-000101`.
   - Build verified: `npx tsc --noEmit` & `npm run build` exit code 0.

---

## Phase 5 — Workflow, Hold-Time Rules & Configuration (S22)
**Status: COMPLETED** · 23/11/2026

### What Was Built:
1. **API Endpoints**:
   - `GET|PUT /config/workflow`: `getWorkflowStages` and `updateWorkflowStages`. Strictly validates topology (exactly 1 START, ≥1 END, reachable path from START, valid next transition IDs). Bumps workflow config version and logs audit ledger entries with mandatory regulatory Reason for Change.
   - `GET|PUT /config/hold-rules`: `getHoldRules` and `updateHoldRules`. Triggers must reference existing events or stages (`RECEIVED`, `LOAD`, `UNLOAD`, `TRANSFER`, `STAGE_ENTER:<id>`, `STAGE_EXIT:<id>`). Validates limit > 0 and warning threshold (1–99%). All 4 default 1-hour rules from SPEC §6 are editable.
   - `GET|PUT /config/sign-route`: `getSignRoute` and `updateSignRoute`. Sequential 21 CFR Part 11 sign-off tiers with meaning, role, and mandatory flags.
   - `GET|PUT /config/storage-detail`: `getStorageDetailLevel` and `updateStorageDetailLevel` (`cold_room_only`, `cold_room_rack`, `cold_room_rack_pallet`).
   - `GET|PUT /config/company`: `getCompanyProfile` and `updateCompanyProfile` (legal name, division, facility code, address).
   - `GET|PUT /config/terms`: `getTerms` and `updateTerms`. Dynamically synchronizes vocabulary across app components.
   - `GET /config/export`: Exports full JSON snapshot (workflow, hold rules, routing, security policy, barcode formats, terms, company profile, and masters).
   - `POST /config/import`: Validates schema & rules, overwrites stores with audit trail logging, and restores system configuration.
2. **Domain & Services**:
   - `/src/domain/workflow.ts`: Pure business validation functions (`validateWorkflowStages`, `validateHoldRules`, `validateSignRoute`, `minutesToHhMm`, `hhMmToMinutes`).
   - `/src/config/terms.ts`: Reactive event subscription allowing instantaneous updates to terms across the application without reload.
   - `/src/services/session.tsx`: Reactive `terms` and `term()` hook exposing live terminology to layouts, sidebars, and views.
3. **UI Screen (`WorkflowConfigPage.tsx` / S22)**:
   - Four dedicated tabs: **Workflow Stages**, **Hold-time rules**, **Signature routing**, and **General Settings**.
   - **Stages tab**: Add, edit, reorder (move left/right), and remove stages. Interactive kind selector (START, STORAGE, PROCESS, END), operating roles checklist, transition path selection, and remarks required toggle. Validation error alerts when graph rules are broken.
   - **Hold-time rules tab**: Table showing rule triggers, limits, warning %, product filter, and active status toggles. Limits entered as `HH:MM` and stored as minutes. Start and stop triggers populated from existing events and stages.
   - **Signature routing tab**: 3 sequential verification tiers (Initiator → HOD → QA), editable meanings and roles.
   - **General settings tab**: Config-first terminology dictionary editor, storage resolution selector, and company/facility profile.
   - **Export / Import**: One-click download of `PTS_Config_Export_*.json` and upload with regulatory reason modal.
   - Wired seamlessly into routes `/admin/workflow/stages`, `/admin/workflow/hold-time-rules`, and `/admin/workflow/signature-routing`.
4. **Self-Test Diagnostics**:
   - Automated tests added to `selftest.ts` (25/25 passing):
     - Validation strictly blocks a flow with two START stages.
     - Validation blocks unreachable workflow stages.
     - Hold-time limit converts 00:02 ↔ 2 min and 01:00 ↔ 60 min.
     - Hold rules validate triggers against existing stages and positive limit.
     - Renaming "Binder" to "Lot Record" updates terminology dynamically.
     - Config export → modification → import successfully restores the original configuration.
   - Verified via `npx tsc --noEmit` exit code 0.

---

### What is Pending:
- **Phase 1**: Login, passwords, and idle lock (S01 Login logic, S02 Change password rules & checklist, S03 Session lock & re-authentication).
- **Phase 6**: Binders: list, form, detail, hold-time engine (S06, S07, S08, real-time hold clocks).
- **Phase 7**: Movements, scan, alerts (S09 movement dialogs, S10 cold room chamber map, S11 scan lookup, alert notifications).
- **Phase 8**: E-signatures and sign-off (S04 electronic signature dialog, 21 CFR Part 11 manifestation).
- **Phase 9**: Reports and PDFs (S12 hub, S15 batch report PDF with checksum, inventory & movement reports).
- **Phase 10**: Security policy, backup/restore, system status (S23 policy editor, S24 snapshots and network recovery).
- **Phase 11**: Hardening and demo walkthrough.

