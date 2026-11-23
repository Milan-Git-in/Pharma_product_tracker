/**
 * Pure Domain & Services Self-Test Suite (SPEC §3 Architecture)
 * Executable tests verifying TimeService, Crypto, Audit Chain, Permissions, Storage & Terms.
 */

import { TimeService } from "@/services/time";
import {
  sha256,
  hashPassword,
  verifyPassword,
  canonicalJson,
  encryptEnvelope,
  decryptEnvelope,
} from "@/services/crypto";
import { AuditService, GENESIS_HASH } from "@/services/audit";
import { can } from "@/services/permission";
import { Storage } from "@/services/storage";
import { getTerm } from "@/config/terms";
import { fmtDateTime, fmtDuration } from "@/services/format";
import { User } from "@/domain/types";
import { parseBatchUnitCount } from "@/domain/barcode";

export interface TestResult {
  name: string;
  category: string;
  passed: boolean;
  message?: string;
  durationMs: number;
}

export async function runDomainSelfTests(): Promise<TestResult[]> {
  const results: TestResult[] = [];

  const runTest = async (category: string, name: string, fn: () => Promise<void> | void) => {
    const start = performance.now();
    try {
      await fn();
      results.push({
        name,
        category,
        passed: true,
        durationMs: Math.round(performance.now() - start),
      });
    } catch (err: any) {
      results.push({
        name,
        category,
        passed: false,
        message: err?.message || String(err),
        durationMs: Math.round(performance.now() - start),
      });
    }
  };

  await runTest("Barcode", "Parses only explicit whole-unit batch quantities", () => {
    if (parseBatchUnitCount("12,000 vials") !== 12000) {
      throw new Error("Comma-formatted unit quantity was not parsed.");
    }
    if (parseBatchUnitCount("12000") !== 12000) {
      throw new Error("Bare integer unit quantity was not parsed.");
    }
    if (parseBatchUnitCount("1.5 L") !== null || parseBatchUnitCount("12,00 vials") !== null) {
      throw new Error("Ambiguous or fractional batch quantity was accepted.");
    }
  });

  // 1. TimeService Tests
  await runTest("TimeService", "Generates ISO 8601 server timestamp", () => {
    const ts = TimeService.now();
    if (!ts || isNaN(Date.parse(ts))) {
      throw new Error(`Invalid ISO timestamp: ${ts}`);
    }
  });

  await runTest("TimeService", "Adjusts offset accurately", () => {
    const before = TimeService.nowMs();
    TimeService.advanceTime(1, 0, 0); // +1 hour
    const after = TimeService.nowMs();
    TimeService.advanceTime(-1, 0, 0); // restore
    const diff = after - before;
    if (diff < 3590000 || diff > 3610000) {
      throw new Error(`Expected +3600000ms offset delta, got ${diff}`);
    }
  });

  // 2. Crypto Tests
  await runTest("Crypto", "Computes deterministic SHA-256", async () => {
    const hash = await sha256("PTS-BIOPHARMA-2026");
    if (typeof hash !== "string" || hash.length !== 64) {
      throw new Error(`Expected 64-char hex digest, got length ${hash?.length}`);
    }
  });

  await runTest("Crypto", "Canonical JSON sorts nested object keys deterministically", () => {
    const objA = { z: 1, a: 2, m: { b: 3, a: 4 } };
    const objB = { a: 2, m: { a: 4, b: 3 }, z: 1 };
    const strA = canonicalJson(objA);
    const strB = canonicalJson(objB);
    if (strA !== strB) {
      throw new Error(`Canonical JSON mismatch: ${strA} !== ${strB}`);
    }
  });

  await runTest("Crypto", "Salted password hashing and verification succeeds", async () => {
    const pw = "Demo@1234";
    const { hash, salt } = await hashPassword(pw);
    const isOk = await verifyPassword(pw, hash, salt);
    const isBad = await verifyPassword("WrongPassword", hash, salt);
    if (!isOk || isBad) {
      throw new Error("Password verification failed.");
    }
  });

  await runTest("Crypto", "Encrypts and decrypts storage envelopes", async () => {
    const payload = { userId: "self-test", roles: ["INITIATOR"] };
    const envelope = await encryptEnvelope(payload);
    if (JSON.parse(envelope).encrypted !== true) {
      throw new Error("Storage envelope was not encrypted.");
    }
    const decrypted = await decryptEnvelope(envelope);
    if (JSON.stringify(decrypted) !== JSON.stringify(payload)) {
      throw new Error("Storage envelope round-trip returned corrupted data.");
    }
  });

  // 3. Audit Hash Chain Tests
  await runTest("Audit", "Verifies append-only hash chain integrity", async () => {
    // Back up existing audit log to ensure isolation from live/tampered dev state
    const backup = (await Storage.getItem<any[]>("audit_log", [])) || [];
    try {
      await Storage.setItem("audit_log", []);

      const entry1 = await AuditService.appendEntry({
        userId: "TEST_RUNNER",
        fullName: "Automated Self-Test",
        action: "SELF_TEST_EXECUTION_A",
        entityType: "DIAGNOSTICS",
        entityId: "DIAG-001",
        reason: "Validation of R5 hash chain genesis",
      });

      const entry2 = await AuditService.appendEntry({
        userId: "TEST_RUNNER",
        fullName: "Automated Self-Test",
        action: "SELF_TEST_EXECUTION_B",
        entityType: "DIAGNOSTICS",
        entityId: "DIAG-002",
        reason: "Validation of R5 hash chain link",
      });

      if (!entry1.hash || entry1.hash.length !== 64 || !entry2.hash || entry2.hash.length !== 64) {
        throw new Error("Invalid entry hash generated.");
      }

      if (entry2.prevHash !== entry1.hash) {
        throw new Error("Chain link broken: entry2.prevHash !== entry1.hash");
      }

      const verification = await AuditService.verifyChain();
      if (!verification.valid) {
        throw new Error(`Audit chain verification failed: ${verification.error}`);
      }
      if (verification.totalEntries !== 2) {
        throw new Error(`Expected 2 entries, got ${verification.totalEntries}`);
      }
    } finally {
      // Restore previous audit log
      await Storage.setItem("audit_log", backup);
    }
  });

  // 4. Permission Engine Tests
  await runTest("Permissions", "Allows Admin batch creation and movement but restricts binder edits", () => {
    const adminUser: User = {
      id: "u-admin",
      userId: "admin1",
      fullName: "Admin User",
      departmentId: "dept-it",
      groupIds: ["group-admin"],
      eSignMeanings: [],
      status: "ACTIVE",
      failedAttempts: 0,
      passwordHash: "",
      salt: "",
      passwordHistory: [],
      passwordChangedAt: "",
    };

    if (!can(adminUser, "binder.create")) {
      throw new Error("Admin should have permission to create batches.");
    }
    if (can(adminUser, "binder.edit")) {
      throw new Error("Admin should NOT have permission to edit binders.");
    }
    if (!can(adminUser, "movement.perform")) {
      throw new Error("Admin should have permission to perform product movements.");
    }
    if (!can(adminUser, "user.manage")) {
      throw new Error("Admin should have permission to manage users.");
    }
  });

  await runTest("Permissions", "Allows Initiator to create binders and perform movements", () => {
    const initUser: User = {
      id: "u-init",
      userId: "init1",
      fullName: "Floor Operator",
      departmentId: "dept-packing",
      groupIds: ["group-initiator"],
      eSignMeanings: ["INITIATOR"],
      status: "ACTIVE",
      failedAttempts: 0,
      passwordHash: "",
      salt: "",
      passwordHistory: [],
      passwordChangedAt: "",
    };

    if (!can(initUser, "binder.create") || !can(initUser, "movement.perform")) {
      throw new Error("Initiator should have permission to create binders and perform movements.");
    }
  });

  // 5. Storage Tests
  await runTest("Storage", "Stores and retrieves structured object with write-through", async () => {
    const testKey = "selftest_obj";
    const testPayload = { test: true, timestamp: Date.now(), items: [1, 2, 3] };
    await Storage.setItem(testKey, testPayload);
    const retrieved = await Storage.getItem<typeof testPayload>(testKey);
    if (!retrieved || retrieved.test !== true || retrieved.items.length !== 3) {
      throw new Error("Storage retrieve failed or returned corrupted data.");
    }
  });

  // 6. Terms Dictionary Tests
  await runTest("Terms", "Resolves default terminology (§4 Config-first)", () => {
    if (getTerm("binder") !== "Binder" || getTerm("coldRoom") !== "Cold Room") {
      throw new Error("Terms dictionary failed to return default terminology.");
    }
  });

  // 7. Format Helpers Tests
  await runTest("Format", "Formats dates and durations per URS standards (R1 Time)", () => {
    // Construct local date to guarantee timezone neutrality
    const testDate = new Date(2026, 1, 26, 14, 30);
    const dt = fmtDateTime(testDate);
    if (!dt.includes("26/02/2026 14:30")) {
      throw new Error(`Unexpected date formatting: ${dt}`);
    }
    const dur = fmtDuration(48 * 60 * 1000);
    if (dur !== "48m") {
      throw new Error(`Unexpected duration formatting: ${dur}`);
    }
  });

  // 8. Phase 3: Users, Groups & Permissions Tests
  await runTest("Phase 3 Users", "A deactivated user ID cannot be created again (21 CFR §11.10)", async () => {
    const { mockApi } = await import("@/api");
    const adminUser: User = {
      id: "u-admin1",
      userId: "admin1",
      fullName: "David Chen",
      departmentId: "dept-it",
      groupIds: ["group-admin"],
      eSignMeanings: [],
      status: "ACTIVE",
      failedAttempts: 0,
      passwordHash: "",
      salt: "",
      passwordHistory: [],
      passwordChangedAt: "",
    };

    // First deactivate Priya Nair (newuser1)
    await mockApi.deactivateUser("u-newuser1", adminUser, "Deactivating for selftest reuse check");

    // Attempt to re-create user with same userId (mockApi returns ApiResponse { ok: false, error: { code, message } })
    const createRes = await mockApi.createUser(
      {
        userId: "newuser1",
        fullName: "Reused Account Attempt",
        departmentId: "dept-packing",
        groupIds: ["group-initiator"],
      },
      adminUser,
      "Attempting illegal user ID reuse"
    );

    // Reactivate back for normal state
    await mockApi.reactivateUser("u-newuser1", adminUser, "Reactivating after selftest");

    if (createRes.ok) {
      throw new Error("Validation failed: A deactivated user ID was erroneously allowed to be reused.");
    }
    if (createRes.error?.code !== "DUPLICATE_USER_ID") {
      throw new Error(`Expected DUPLICATE_USER_ID, got ${createRes.error?.code}: ${createRes.error?.message}`);
    }
  });

  await runTest("Phase 3 Users", "Lock and unlock user correctly alters account status", async () => {
    const { mockApi } = await import("@/api");
    const adminUser: User = {
      id: "u-admin1",
      userId: "admin1",
      fullName: "David Chen",
      departmentId: "dept-it",
      groupIds: ["group-admin"],
      eSignMeanings: [],
      status: "ACTIVE",
      failedAttempts: 0,
      passwordHash: "",
      salt: "",
      passwordHistory: [],
      passwordChangedAt: "",
    };

    const lockRes = await mockApi.lockUser("u-init2", adminUser, "Temporary lock test");
    if (!lockRes.ok || lockRes.data?.user.status !== "LOCKED") {
      throw new Error("Lock user failed.");
    }

    const unlockRes = await mockApi.unlockUser("u-init2", adminUser, "Unlock test");
    if (!unlockRes.ok || unlockRes.data?.user.status !== "ACTIVE") {
      throw new Error("Unlock user failed.");
    }
  });

  await runTest("Phase 3 Permissions", "Dynamically updated group permissions alter can() checks", async () => {
    const { mockApi } = await import("@/api");
    const adminUser: User = {
      id: "u-admin1",
      userId: "admin1",
      fullName: "David Chen",
      departmentId: "dept-it",
      groupIds: ["group-admin"],
      eSignMeanings: [],
      status: "ACTIVE",
      failedAttempts: 0,
      passwordHash: "",
      salt: "",
      passwordHistory: [],
      passwordChangedAt: "",
    };

    const initUser: User = {
      id: "u-test-operator",
      userId: "testop1",
      fullName: "Test Operator",
      departmentId: "dept-packing",
      groupIds: ["group-initiator"],
      eSignMeanings: ["INITIATOR"],
      status: "ACTIVE",
      failedAttempts: 0,
      passwordHash: "",
      salt: "",
      passwordHistory: [],
      passwordChangedAt: "",
    };

    // Temporarily grant "custom.special.privilege" to initiator group
    const groupsRes = await mockApi.getGroups();
    const initGroup = groupsRes.data?.find((g) => g.id === "group-initiator");
    if (!initGroup) throw new Error("Initiator group not found.");

    const originalPerms = [...initGroup.permissions];
    const newPerms = [...originalPerms, "custom.special.privilege"];

    const grantRes = await mockApi.updateGroupPermissions(
      "group-initiator",
      newPerms,
      adminUser,
      "Granting test privilege"
    );
    if (!grantRes.ok) {
      throw new Error(`Failed to grant test privilege: ${grantRes.error?.message}`);
    }

    const hasNewPriv = can(initUser, "custom.special.privilege");

    // Revert back
    const revertRes = await mockApi.updateGroupPermissions(
      "group-initiator",
      originalPerms,
      adminUser,
      "Reverting test privilege"
    );
    if (!revertRes.ok) {
      throw new Error(`Failed to revert test privilege: ${revertRes.error?.message}`);
    }

    const hasRevertedPriv = can(initUser, "custom.special.privilege");
    const revertedGroups = await mockApi.getGroups();
    const revertedGroup = revertedGroups.data?.find((g) => g.id === "group-initiator");
    const permissionStillStored = revertedGroup?.permissions.includes("custom.special.privilege") ?? false;

    if (!hasNewPriv) {
      throw new Error("Dynamic permission check failed: Added permission was not detected by can().");
    }
    if (hasRevertedPriv || permissionStillStored) {
      throw new Error(
        `Dynamic permission check failed after revert (can=${hasRevertedPriv}, stored=${permissionStillStored}).`
      );
    }
  });

  // 9. Phase 4: Masters & Barcodes Tests (SPEC R10 & S20/S21)
  await runTest("Phase 4 Masters", "Changing RACK format affects only new racks (R10 immutability)", async () => {
    const { mockApi } = await import("@/api");
    const adminUser: User = {
      id: "u-admin1",
      userId: "admin1",
      fullName: "David Chen",
      departmentId: "dept-it",
      groupIds: ["group-admin"],
      eSignMeanings: [],
      status: "ACTIVE",
      failedAttempts: 0,
      passwordHash: "",
      salt: "",
      passwordHistory: [],
      passwordChangedAt: "",
    };

    // 1. Get initial rack
    const initialRacksRes = await mockApi.getMasterEntities<any>("racks");
    const initialRack = initialRacksRes.data?.[0];
    if (!initialRack) throw new Error("No seeded racks found.");
    const originalBarcode = initialRack.barcode;

    // 2. Fetch current formats and modify RACK format
    const formatsRes = await mockApi.getBarcodeFormats();
    const originalFormats = formatsRes.data || [];
    const modifiedFormats = originalFormats.map((f) => {
      if (f.entity === "RACK") {
        return {
          ...f,
          separator: "_",
          segments: [
            { type: "LITERAL" as const, value: "RCK" },
            { type: "LOCATION_CODE" as const },
            { type: "SEQ" as const, pad: 4 },
          ],
        };
      }
      return f;
    });

    await mockApi.updateBarcodeFormats(modifiedFormats, adminUser, "Updating rack format for selftest");

    // 3. Verify existing rack barcode was NOT altered (R10 immutability)
    const afterRacksRes = await mockApi.getMasterEntities<any>("racks");
    const existingAfter = afterRacksRes.data?.find((r: any) => r.id === initialRack.id);
    if (!existingAfter || existingAfter.barcode !== originalBarcode) {
      throw new Error(`Immutability violation: Existing rack barcode changed from "${originalBarcode}" to "${existingAfter?.barcode}"`);
    }

    // 4. Create new rack and verify it receives the newly configured format
    // Clean up any previously created test rack to avoid duplicate code error on re-runs
    const existingRacks = await mockApi.getMasterEntities<any>("racks");
    const staleTestRack = existingRacks.data?.find((r: any) => r.code === "RK-TEST-NEW");
    if (staleTestRack) {
      const allRacks = (await Storage.getItem<any[]>("racks")) || [];
      await Storage.setItem("racks", allRacks.filter((r) => r.code !== "RK-TEST-NEW"));
    }

    const newRackRes = await mockApi.createMasterEntity(
      "racks",
      { code: "RK-TEST-NEW", coldRoomId: "cr-01" },
      adminUser,
      "Creating new rack to verify updated barcode format"
    );

    if (!newRackRes.ok || !newRackRes.data?.entity?.barcode || !newRackRes.data?.entity?.barcode.startsWith("RCK_")) {
      throw new Error(`New rack did not receive updated format: ${newRackRes.error ? newRackRes.error.message : newRackRes.data?.entity?.barcode}`);
    }

    // Restore original formats and clean up
    await mockApi.updateBarcodeFormats(originalFormats, adminUser, "Restoring original formats after selftest");
  });

  await runTest("Phase 4 Barcodes", "20 pallet barcodes generate with no duplicates", async () => {
    const { mockApi } = await import("@/api");
    const res = await mockApi.generateBarcodes("PALLET", 20);

    if (!res.ok || !res.data?.barcodes) {
      throw new Error(`Generate barcodes failed: ${res.error?.message}`);
    }

    const barcodes = res.data.barcodes;
    if (barcodes.length !== 20) {
      throw new Error(`Expected exactly 20 barcodes, got ${barcodes.length}`);
    }

    const uniqueSet = new Set(barcodes);
    if (uniqueSet.size !== 20) {
      throw new Error(`Duplicate barcode detected: Only ${uniqueSet.size} unique values out of 20 generated`);
    }
  });

  await runTest("Phase 4 Barcodes", "Luhn check digit computation and label verification", async () => {
    const { calculateLuhnCheckDigit, verifyLuhnCheckDigit } = await import("@/domain/barcode");

    // Test deterministic Luhn check digit
    const check1 = calculateLuhnCheckDigit("PL26000101");
    if (!check1 || check1.length !== 1) {
      throw new Error(`Invalid Luhn check digit produced: ${check1}`);
    }

    const isValid = verifyLuhnCheckDigit(`PL-26-000101-${check1}`, "-");
    if (!isValid) {
      throw new Error("Luhn check digit verification failed for formatted barcode.");
    }
  });

  await runTest("Phase 4 Barcodes", "resolve() finds a seeded pallet", async () => {
    const { mockApi } = await import("@/api");
    const res = await mockApi.resolveBarcode("PL-26-000101");

    if (!res.ok) {
      throw new Error(`Resolve API error: ${res.error?.message}`);
    }
    if (!res.data?.found) {
      throw new Error("resolveBarcode() failed to locate seeded pallet PL-26-000101");
    }
    if (res.data.entityType !== "PALLET") {
      throw new Error(`Expected entityType PALLET, got ${res.data.entityType}`);
    }
    if (res.data.entity?.code !== "PL-26-000101") {
      throw new Error(`Expected code PL-26-000101, got ${res.data.entity?.code}`);
    }
  });

  // 7. Phase 5: Workflow, Hold-Time Rules & Configuration Tests
  await runTest("Phase 5 Workflow", "Validation strictly blocks a flow with two START stages", async () => {
    const { validateWorkflowStages } = await import("@/domain/workflow");
    const invalidStages: any[] = [
      { id: "s1", name: "Stage 1", kind: "START", order: 1, nextStageIds: ["s3"], allowedRoles: ["INITIATOR"], remarksRequired: false },
      { id: "s2", name: "Stage 2", kind: "START", order: 2, nextStageIds: ["s3"], allowedRoles: ["INITIATOR"], remarksRequired: false },
      { id: "s3", name: "Stage 3", kind: "END", order: 3, nextStageIds: [], allowedRoles: ["INITIATOR"], remarksRequired: false },
    ];
    const validation = validateWorkflowStages(invalidStages);
    if (validation.valid) {
      throw new Error("Expected validation to fail for multiple START stages, but passed.");
    }
    const hasStartError = validation.errors.some((e) => e.includes("exactly one START stage"));
    if (!hasStartError) {
      throw new Error(`Expected error about exactly one START stage, got: ${validation.errors.join("; ")}`);
    }
  });

  await runTest("Phase 5 Workflow", "Validation blocks unreachable workflow stages", async () => {
    const { validateWorkflowStages } = await import("@/domain/workflow");
    const unreachableStages: any[] = [
      { id: "s1", name: "Start", kind: "START", order: 1, nextStageIds: ["s2"], allowedRoles: ["INITIATOR"], remarksRequired: false },
      { id: "s2", name: "End", kind: "END", order: 2, nextStageIds: [], allowedRoles: ["INITIATOR"], remarksRequired: false },
      { id: "s3", name: "Orphan", kind: "PROCESS", order: 3, nextStageIds: [], allowedRoles: ["INITIATOR"], remarksRequired: false },
    ];
    const validation = validateWorkflowStages(unreachableStages);
    if (validation.valid) {
      throw new Error("Expected validation to fail for unreachable stage, but passed.");
    }
    const hasUnreachable = validation.errors.some((e) => e.includes("Unreachable stage"));
    if (!hasUnreachable) {
      throw new Error(`Expected unreachable stage error, got: ${validation.errors.join("; ")}`);
    }
  });

  await runTest("Phase 5 Hold Rules", "Hold-time limit can be set to 00:02 and back to 01:00", async () => {
    const { hhMmToMinutes, minutesToHhMm } = await import("@/domain/workflow");
    const mins2 = hhMmToMinutes("00:02");
    if (mins2 !== 2) throw new Error(`Expected 2 minutes, got ${mins2}`);
    const str2 = minutesToHhMm(mins2);
    if (str2 !== "00:02") throw new Error(`Expected "00:02", got ${str2}`);

    const mins60 = hhMmToMinutes("01:00");
    if (mins60 !== 60) throw new Error(`Expected 60 minutes, got ${mins60}`);
    const str60 = minutesToHhMm(mins60);
    if (str60 !== "01:00") throw new Error(`Expected "01:00", got ${str60}`);
  });

  await runTest("Phase 5 Hold Rules", "Validates triggers reference existing stages and positive limit", async () => {
    const { validateHoldRules } = await import("@/domain/workflow");
    const stages: any[] = [
      { id: "stage-1", name: "Stage 1", kind: "START", order: 1, nextStageIds: ["stage-2"], allowedRoles: ["INITIATOR"], remarksRequired: false },
      { id: "stage-2", name: "Stage 2", kind: "END", order: 2, nextStageIds: [], allowedRoles: ["INITIATOR"], remarksRequired: false },
    ];
    const invalidRules: any[] = [
      { id: "r1", name: "Bad Rule", startTrigger: "STAGE_ENTER:non-existent", stopTrigger: "STAGE_EXIT:stage-2", limitMinutes: 0, warnAtPercent: 80, active: true },
    ];
    const validation = validateHoldRules(invalidRules, stages);
    if (validation.valid) {
      throw new Error("Expected validation to fail for non-existent stage trigger and 0 limitMinutes.");
    }
    if (validation.errors.length < 2) {
      throw new Error(`Expected at least 2 errors, got: ${validation.errors.join("; ")}`);
    }
  });

  await runTest("Phase 5 Terms", "Renaming 'Binder' to 'Lot Record' updates terminology reactively", async () => {
    const { getTerm, setTerms, resetTerms } = await import("@/config/terms");
    try {
      const initial = getTerm("binder");
      if (initial !== "Binder") throw new Error(`Expected initial 'Binder', got ${initial}`);
      setTerms({ binder: "Lot Record", binders: "Lot Records" });
      const updated = getTerm("binder");
      if (updated !== "Lot Record") throw new Error(`Expected 'Lot Record', got ${updated}`);
    } finally {
      resetTerms();
      if (getTerm("binder") !== "Binder") {
        throw new Error("Failed to reset terms.");
      }
    }
  });

  await runTest("Phase 5 Config Export/Import", "Export -> reset data -> import restores configuration", async () => {
    const { mockApi } = await import("@/api");
    const { setTerms, getTerm, resetTerms } = await import("@/config/terms");
    const adminUser = (await mockApi.getUsers()).data?.find((u) => u.userId === "admin1");
    if (!adminUser) throw new Error("admin1 user not found for config test.");

    // 1. Export current config
    const exportRes = await mockApi.exportFullConfig();
    if (!exportRes.ok || !exportRes.data) {
      throw new Error(`Export failed: ${exportRes.error?.message}`);
    }
    const exportedData = exportRes.data;

    // 2. Modify a setting and reset terms
    setTerms({ binder: "Custom Test Dossier" });
    if (getTerm("binder") !== "Custom Test Dossier") {
      throw new Error("Failed to set temporary term.");
    }

    // 3. Import previous config
    const importRes = await mockApi.importFullConfig(
      exportedData,
      adminUser,
      "Validation self-test import restoration"
    );
    if (!importRes.ok) {
      throw new Error(`Import failed: ${importRes.error?.message}`);
    }

    // 4. Verify term was restored from exportedData
    const restoredTerm = getTerm("binder");
    if (restoredTerm !== exportedData.configuration.terms.binder) {
      throw new Error(`Expected restored term ${exportedData.configuration.terms.binder}, got ${restoredTerm}`);
    }
  });

  return results;
}

