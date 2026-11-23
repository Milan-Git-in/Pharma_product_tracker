# 1. Purpose
Tracks filled pharmaceutical product from "received from filling" through cold-room storage, visual inspection and packing. Calculates hold times automatically, alerts when limits are exceeded, keeps an audit trail, collects electronic signatures, produces reports. It replaces paper movement sheets. PROTOTYPE: data is local to the browser, compliance behaviour is simulated, nothing is validated. Show a permanent "PROTOTYPE – NOT VALIDATED – do not enter real GMP data" ribbon.

# 2. Visual source of truth
The imported Stitch screens are the design. Reuse their layout, colours, typography and components; extract shared components and a theme file. Never redesign. Light theme only.

# 3. Architecture
Next.JS, HashRouter, no server code. Folders: /src/config, /src/domain (pure logic), /src/api (mock endpoints), /src/services, /src/pages, /src/components, /docs.
- The UI talks ONLY to /src/api. /src/api is the ONLY layer that touches storage.
- Every endpoint is async (150–400 ms simulated latency) and returns {ok:true,data} or {ok:false,error:{code,message}}.
- Every mutating endpoint: check permission → validate → write → append audit entry → return.
- Storage: one wrapper; AES-GCM (Web Crypto, demo key) envelope to simulate "encrypted at rest"; in-memory cache with write-through; falls back to memory if localStorage throws. One repository per entity so storage can later be swapped for a real backend.
- Allowed libraries: react-router-dom, lucide-react, date-fns, jsbarcode, qrcode, jspdf, jspdf-autotable, recharts.
- Business logic lives in /src/domain as pure functions, with a self-test page at /#/dev/selftest (only with ?dev=1).

# 4. Config-first
Anything that differs between companies is configuration (editable in Admin screens, persisted, exportable as JSON), never hard-coded in UI logic: terminology (Binder, Cold room, Rack, Pallet, Area…), company profile, workflow stages and transitions, hold-time rules, signature routing, barcode formats, storage detail level, security policy, masters. Read every label from the terms dictionary. Seed the defaults from §6.

# 5. Data model
Role = ADMIN | INITIATOR | HOD | QA
User {id, userId (immutable, unique, never reused), fullName, departmentId, groupIds[], eSignMeanings[] (INITIATOR|REVIEW|APPROVAL), status (ACTIVE|LOCKED|DISABLED|DEACTIVATED), failedAttempts, mustChangePassword, passwordHash, salt, passwordHistory[], passwordChangedAt, lastLoginAt}
Group {id, name, role, permissions[], active}
Department {id, code, name, active}
Location {id, code, name, type (COLD_ROOM|AREA), departmentId?, active}
Rack {id, code, barcode, coldRoomId, active}
Pallet {id, code, barcode, rackId?, active}
Binder {id, productName, strength, lotNo, batchNo, departmentId, receivedFromFillingAt, stageId, coldRoomId?, rackId?, palletId?, areaId?, createdBy, createdAt, updatedAt, version, locked}   // status = label of the current stage
MovementEvent {id, binderId, type (RECEIVED|LOAD|UNLOAD|TRANSFER|STAGE_ENTER|STAGE_EXIT), stageId?, from?, to?, remarks, at, by}   // immutable
WorkflowStage {id, name, kind (START|STORAGE|PROCESS|END), order, nextStageIds[], allowedRoles[], remarksRequired}
HoldRule {id, name, startTrigger, stopTrigger, limitMinutes (default 60), warnAtPercent (default 80), productFilter?, active}   // triggers: RECEIVED | LOAD | UNLOAD | TRANSFER | STAGE_ENTER:<stageId> | STAGE_EXIT:<stageId>
HoldClock (derived, never stored) {binderId, ruleId, startedAt, stoppedAt?, elapsedMs, level (OK|WARNING|EXCEEDED)}
Alert {id, binderId, ruleId, level, raisedAt, ackBy?, ackAt?, ackRemarks?}
Signature {id, binderId, meaning (INITIATOR|REVIEW|APPROVAL), signerUserId, signerFullName, at}
SignRoute {steps:[{order, meaning, role, required}]}
BarcodeFormat {entity (RACK|PALLET|BINDER), symbology (CODE128|QR), segments:[{type (LITERAL|LOCATION_CODE|YEAR2|YEAR4|SEQ|DEPT_CODE), value?, pad?}], separator, seqStart, checkDigit}
AuditEntry {seq, at, userId, fullName, action, entityType, entityId, field?, oldValue?, newValue?, reason?, prevHash, hash}
SecurityPolicy {minLength 8, hardFloor 6, requireUpper, requireNumber, requireSpecial, historyCount 3, expiryDays 60, maxFailedAttempts 5, idleLockMinutes 30, autoLogoffAfterLockMinutes 5}
BackupSnapshot {id, at, type (AUTO|MANUAL), counts, checksum, payload}

# 6. Seed config and data (all editable by Admin; the flow follows the URS, the hold limit is the product owner's default, the rest is placeholder)
Stages (ids in brackets): Filling complete [filling-complete] (START) → Cold room storage [cold-room] (STORAGE) → Visual inspection [visual-inspection] (PROCESS) → Packing [packing] (PROCESS) → Packed [packed] (END). Cold room → cold room transfer allowed.
Hold rules (default: one per stage, each limitMinutes 60, warnAtPercent 80, "time spent in the stage"): "Filling complete" STAGE_ENTER:filling-complete → STAGE_EXIT:filling-complete; "Cold room storage" STAGE_ENTER:cold-room → STAGE_EXIT:cold-room; "Visual inspection" STAGE_ENTER:visual-inspection → STAGE_EXIT:visual-inspection; "Packing" STAGE_ENTER:packing → STAGE_EXIT:packing. Admin can edit limits and triggers and add rules at any time.
SignRoute: INITIATOR (Initiator) → REVIEW (HOD) → APPROVAL (QA), all required; sign-off opens when the binder reaches an END stage.
Barcode formats: RACK "RK-{COLDROOM_CODE}-{SEQ:3}", PALLET "PL-{YEAR2}-{SEQ:6}", Code 128. Storage detail: cold room + rack + pallet.
Users (all passwords "Demo@1234"): admin1 (Admin), init1 and init2 (Initiator), hod1 (HOD), qa1 (QA), multi1 (Initiator + HOD), newuser1 (must change password).
Masters: departments Packing, Visual Inspection, QA, IT; cold rooms CR-01, CR-02; areas Visual Inspection Area, Packing Area; 3 racks per cold room; 12 pallets.
Binders: 6 in different stages incl. one with an EXCEEDED clock, one WARNING, one fully signed. Fictional products only.

# 7. Business rules
R1 Time: all timestamps come from TimeService.now() (simulated company-server time = device time + adjustable offset); never call new Date() in feature code. Store ISO; display DD/MM/YYYY HH:MM (24 h); durations "Xd Yh Zm".
R2 Movements: load, unload and transfer always need non-empty remarks; stage advance needs them when the stage says so. Date-time is automatic, never typed. Events are immutable (corrections are new events). Creating a binder writes RECEIVED and STAGE_ENTER for the START stage. LOAD enters the STORAGE stage that follows the current stage; UNLOAD (withdrawal) leaves the STORAGE stage into the next stage chosen by the user (default: the next stage in the workflow); "Move to next stage" handles the remaining transitions. Every stage change writes STAGE_EXIT and STAGE_ENTER events, so each moment belongs to exactly one stage. Unload without a prior load is blocked.
R3 Hold time: for each active rule and binder, the clock starts at the first start-trigger event and stops at the next stop-trigger event; elapsed is recomputed from events, never stored. OK below warn %, WARNING from warn % up to 100 %, EXCEEDED at 100 % or more. One alert per level per clock; recheck every 30 s and on window focus. Acknowledging an alert needs remarks.
R4 Binder edits: every edit needs a "Reason for change" and writes field-level old/new values to the audit trail; lot + batch is unique; approved binders are read-only.
R5 Audit: append-only and hash-chained (hash = SHA-256(prevHash + canonical JSON of the entry)); no update/delete endpoint exists and no setting disables it. Log: login, logout, failed login, lock, auto-lock, auto log-off, create/modify/delete, user and role/rights management, config changes, signatures, report print/export, backup/restore, alert acknowledgement.
R6 Auth: User ID + password; lock after maxFailedAttempts; idle lock after idleLockMinutes (overlay needs the password), then auto log-off after autoLogoffAfterLockMinutes; first login forces a password change; rules come from SecurityPolicy but never below hardFloor; no reuse of the last historyCount passwords; expiry forces a change; only Admin resets passwords (temporary password, must change); User IDs are immutable and never reusable, even when deactivated. Passwords are stored as salted SHA-256 (demo only).
R7 Permissions: string permissions checked in one place, can(user, permission, resource). HOD sees only their own department.
R8 E-signature: user re-enters the password (User ID read-only); needs the meaning in eSignMeanings and the correct SignRoute step; stamp = full name + DD/MM/YYYY HH:MM + meaning. One person may not apply more than one meaning on the same binder (this also blocks multi-profile users acting in two roles on one record).
R9 Reports: filters are date range, period, department, person, rack. PDFs (jsPDF) carry a header (company, division, title, filters) and "Printed by {full name} on DD/MM/YYYY HH:MM — Page X of Y" on every page. Screen and PDF use one data source; PDFs show a dataset checksum.
R10 Barcodes: generated from BarcodeFormat, unique, immutable once issued; changing a format never alters issued codes; reprint needs a reason and is audited. Scanning = a text input that submits on Enter (keyboard-wedge scanners).
R11 Network failure: when simulated, show a red banner, writes fail with NETWORK_ERROR, failure and recovery are audited, and re-authentication is forced on recovery.
R12 Backups: auto snapshot on a timer (default 15 min; 1 min in dev), manual snapshot, JSON download; restore verifies the checksum, needs password re-entry, replaces stores and writes an audit entry. Snapshots include metadata (app version, time, record counts, checksum).
R13 No edit/delete of system records in UI or API; only appends and new versions.

# 8. Default permissions
ADMIN: user.manage, group.manage, master.manage, barcode.manage, workflow.configure, security.configure, backup.manage, audit.view, audit.export, report.active-users
INITIATOR: binder.view, binder.create, binder.edit, movement.perform, scan.use, alert.ack, report.view, report.print, sign.initiator
HOD: binder.view, report.view, report.export, report.print, report.generate, sign.review
QA: binder.view, report.view, report.export, report.active-users, audit.view, audit.export, sign.approval
Admin cannot create binders, record movements or sign. Groups hold editable copies of these sets.

# 9. Mock API (all in /src/api; paths are logical names)
Auth: POST /auth/login, /auth/logout, /auth/change-password, /auth/reverify, /auth/esign · GET /session · POST /session/heartbeat
Users: GET|POST /users · PATCH /users/:id (never userId) · POST /users/:id/lock|unlock|deactivate|reactivate|reset-password
Groups: GET|POST /groups · PATCH /groups/:id · PUT /groups/:id/permissions
Masters: GET|POST /masters/{departments|locations|racks|pallets} · PATCH /masters/:type/:id · POST /masters/:type/:id/activate|deactivate
Barcodes: GET|PUT /config/barcode-formats · POST /barcodes/generate · GET /barcodes/resolve?code= · POST /barcodes/:id/reprint
Config: GET|PUT /config/{terms|company|workflow|hold-rules|sign-route|storage-detail|security-policy} · GET /config/export · POST /config/import
Binders: GET /binders?q&product&strength&lot&batch&status&coldRoom&dept&from&to · POST /binders · GET|PATCH /binders/:id · GET /binders/:id/events · GET /binders/:id/hold-clocks
Movements: POST /binders/:id/load|unload|transfer|advance
Alerts: GET /alerts · POST /alerts/:id/ack
Signatures: GET /binders/:id/signatures · POST /binders/:id/sign
Reports: GET /reports/cold-room-inventory|movement-hold-time|active-users · GET /reports/batch/:binderId · POST /reports/log-print
Audit: GET /audit?from&to&user&action&entity&product&lot&batch · GET /audit/record/:entityId · GET /audit/verify
System: GET /system/time · GET /system/status · GET|POST /system/backups · POST /system/backups/:id/restore · POST /system/simulate/network

# 10. Working agreement for every phase
- Build only what the phase lists; do not touch unrelated pages except to wire navigation.
- Order: domain logic and endpoints first, then the page, then audit hooks, then end with a short "How to test" list.
- After each phase append what was built and what is pending to /docs/PROGRESS.md.
- Ask me before changing anything in this SPEC.

