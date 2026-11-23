/**
 * Seed Data & Initial Configuration (§6 Seed config and data)
 * All editable by Admin. Loaded on first run or upon dev reset.
 */

import {
  User,
  Group,
  Department,
  Location,
  Rack,
  Pallet,
  Equipment,
  Binder,
  MovementEvent,
  WorkflowStage,
  HoldRule,
  SignRoute,
  BarcodeFormat,
  SecurityPolicy,
} from "@/domain/types";
import { Storage } from "@/services/storage";
import { TimeService } from "@/services/time";
import { hashPassword } from "@/services/crypto";
import { AuditService } from "@/services/audit";
import { generateUniqueBarcodeBatch } from "@/domain/barcode";

export const SEED_SECURITY_POLICY: SecurityPolicy = {
  minLength: 8,
  hardFloor: 6,
  requireUpper: true,
  requireNumber: true,
  requireSpecial: true,
  historyCount: 3,
  expiryDays: 60,
  maxFailedAttempts: 5,
  idleLockMinutes: 30,
  autoLogoffAfterLockMinutes: 5,
};

export const SEED_DEPARTMENTS: Department[] = [
  { id: "dept-packing", code: "PKG", name: "Packing", active: true },
  { id: "dept-vi", code: "VI", name: "Visual Inspection", active: true },
  { id: "dept-qa", code: "QA", name: "Quality Assurance", active: true },
  { id: "dept-it", code: "IT", name: "Information Technology", active: true },
];

export const SEED_LOCATIONS: Location[] = [
  { id: "cr-01", code: "CR-01", name: "Cold Room Chamber 01 (+2°C to +8°C)", type: "COLD_ROOM", departmentId: "dept-packing", active: true },
  { id: "cr-02", code: "CR-02", name: "Cold Room Chamber 02 (+2°C to +8°C)", type: "COLD_ROOM", departmentId: "dept-packing", active: true },
  { id: "area-filling", code: "AREA-FILL", name: "Sterile Filling Line A", type: "AREA", departmentId: "dept-packing", active: true },
  { id: "area-vi", code: "AREA-VI", name: "Visual Inspection Cleanroom Area", type: "AREA", departmentId: "dept-vi", active: true },
  { id: "area-packing", code: "AREA-PKG", name: "Primary & Secondary Packing Line 2", type: "AREA", departmentId: "dept-packing", active: true },
];

export const SEED_EQUIPMENT: Equipment[] = [
  { id: "eq-filling-a", code: "FILL-A-01", name: "Sterile Filling Line A", locationId: "area-filling", active: true },
  { id: "eq-cr01-ch01", code: "CR-01-CH-01", name: "Cold Room Chamber 01", locationId: "cr-01", active: true },
  { id: "eq-cr02-ch01", code: "CR-02-CH-01", name: "Cold Room Chamber 02", locationId: "cr-02", active: true },
  { id: "eq-vi-04a", code: "VI-04A", name: "Visual Inspection Station 04-A", locationId: "area-vi", active: true },
  { id: "eq-pkg-02", code: "PKG-LINE-02", name: "Primary & Secondary Packing Line 2", locationId: "area-packing", active: true },
];

export const SEED_RACKS: Rack[] = [
  { id: "rk-cr01-001", code: "RK-CR01-001", barcode: "RK-CR01-001", coldRoomId: "cr-01", active: true },
  { id: "rk-cr01-002", code: "RK-CR01-002", barcode: "RK-CR01-002", coldRoomId: "cr-01", active: true },
  { id: "rk-cr01-003", code: "RK-CR01-003", barcode: "RK-CR01-003", coldRoomId: "cr-01", active: true },
  { id: "rk-cr02-001", code: "RK-CR02-001", barcode: "RK-CR02-001", coldRoomId: "cr-02", active: true },
  { id: "rk-cr02-002", code: "RK-CR02-002", barcode: "RK-CR02-002", coldRoomId: "cr-02", active: true },
  { id: "rk-cr02-003", code: "RK-CR02-003", barcode: "RK-CR02-003", coldRoomId: "cr-02", active: true },
];

export const SEED_PALLETS: Pallet[] = [
  { id: "pl-101", code: "PL-26-000101", barcode: "PL-26-000101", rackId: "rk-cr01-001", active: true },
  { id: "pl-102", code: "PL-26-000102", barcode: "PL-26-000102", rackId: "rk-cr01-001", active: true },
  { id: "pl-103", code: "PL-26-000103", barcode: "PL-26-000103", rackId: "rk-cr01-002", active: true },
  { id: "pl-104", code: "PL-26-000104", barcode: "PL-26-000104", rackId: "rk-cr01-002", active: true },
  { id: "pl-105", code: "PL-26-000105", barcode: "PL-26-000105", rackId: "rk-cr01-003", active: true },
  { id: "pl-106", code: "PL-26-000106", barcode: "PL-26-000106", rackId: "rk-cr01-003", active: true },
  { id: "pl-107", code: "PL-26-000107", barcode: "PL-26-000107", rackId: "rk-cr02-001", active: true },
  { id: "pl-108", code: "PL-26-000108", barcode: "PL-26-000108", rackId: "rk-cr02-001", active: true },
  { id: "pl-109", code: "PL-26-000109", barcode: "PL-26-000109", rackId: "rk-cr02-002", active: true },
  { id: "pl-110", code: "PL-26-000110", barcode: "PL-26-000110", rackId: "rk-cr02-002", active: true },
  { id: "pl-111", code: "PL-26-000111", barcode: "PL-26-000111", rackId: "rk-cr02-003", active: true },
  { id: "pl-112", code: "PL-26-000112", barcode: "PL-26-000112", rackId: "rk-cr02-003", active: true },
];

export const SEED_GROUPS: Group[] = [
  { id: "group-admin", name: "System Administrators", role: "ADMIN", permissions: ["user.manage", "group.manage", "master.manage", "barcode.manage", "workflow.configure", "security.configure", "backup.manage", "audit.view", "audit.export", "report.active-users", "movement.perform", "binder.create"], active: true },
  { id: "group-initiator", name: "Packaging Initiators / Operators", role: "INITIATOR", permissions: ["binder.view", "binder.create", "binder.edit", "movement.perform", "scan.use", "alert.ack", "report.view", "report.print", "sign.initiator"], active: true },
  { id: "group-hod", name: "Department Reviewers (HOD)", role: "HOD", permissions: ["binder.view", "report.view", "report.export", "report.print", "report.generate", "sign.review"], active: true },
  { id: "group-qa", name: "Quality Assurance Auditors", role: "QA", permissions: ["binder.view", "report.view", "report.export", "report.active-users", "audit.view", "audit.export", "sign.approval"], active: true },
];

export const SEED_STAGES: WorkflowStage[] = [
  { id: "filling-complete", name: "Filling complete", kind: "START", order: 1, nextStageIds: ["cold-room"], allowedRoles: ["INITIATOR"], remarksRequired: false },
  { id: "cold-room", name: "Cold room storage", kind: "STORAGE", order: 2, nextStageIds: ["visual-inspection", "cold-room"], allowedRoles: ["INITIATOR"], remarksRequired: true },
  { id: "visual-inspection", name: "Visual inspection", kind: "PROCESS", order: 3, nextStageIds: ["packing"], allowedRoles: ["INITIATOR"], remarksRequired: true },
  { id: "packing", name: "Packing", kind: "PROCESS", order: 4, nextStageIds: ["packed"], allowedRoles: ["INITIATOR"], remarksRequired: true },
  { id: "packed", name: "Packed", kind: "END", order: 5, nextStageIds: [], allowedRoles: ["INITIATOR", "HOD", "QA"], remarksRequired: false },
];

export const SEED_HOLD_RULES: HoldRule[] = [
  { id: "rule-filling", name: "Filling complete hold time", startTrigger: "STAGE_ENTER:filling-complete", stopTrigger: "STAGE_EXIT:filling-complete", limitMinutes: 60, warnAtPercent: 80, active: true },
  { id: "rule-coldroom", name: "Cold room storage hold time", startTrigger: "STAGE_ENTER:cold-room", stopTrigger: "STAGE_EXIT:cold-room", limitMinutes: 60, warnAtPercent: 80, active: true },
  { id: "rule-inspection", name: "Visual inspection hold time", startTrigger: "STAGE_ENTER:visual-inspection", stopTrigger: "STAGE_EXIT:visual-inspection", limitMinutes: 60, warnAtPercent: 80, active: true },
  { id: "rule-packing", name: "Packing stage hold time", startTrigger: "STAGE_ENTER:packing", stopTrigger: "STAGE_EXIT:packing", limitMinutes: 60, warnAtPercent: 80, active: true },
];

export const SEED_SIGN_ROUTE: SignRoute = {
  steps: [
    { order: 1, meaning: "INITIATOR", role: "INITIATOR", required: true },
    { order: 2, meaning: "REVIEW", role: "HOD", required: true },
    { order: 3, meaning: "APPROVAL", role: "QA", required: true },
  ],
};

export const SEED_BARCODE_FORMATS: BarcodeFormat[] = [
  {
    entity: "RACK",
    symbology: "CODE128",
    segments: [
      { type: "LITERAL", value: "RK" },
      { type: "LOCATION_CODE" },
      { type: "SEQ", pad: 3 },
    ],
    separator: "-",
    seqStart: 1,
    checkDigit: false,
  },
  {
    entity: "PALLET",
    symbology: "CODE128",
    segments: [
      { type: "LITERAL", value: "PL" },
      { type: "YEAR2" },
      { type: "SEQ", pad: 6 },
    ],
    separator: "-",
    seqStart: 1,
    checkDigit: false,
  },
  {
    entity: "BINDER",
    symbology: "CODE128",
    segments: [
      { type: "LITERAL", value: "BND" },
      { type: "YEAR2" },
      { type: "SEQ", pad: 5 },
    ],
    separator: "-",
    seqStart: 1,
    checkDigit: false,
  },
];

/**
 * Initialize Seed Database if not already present
 */
export async function initializeSeedData(forceReset = false): Promise<void> {
  const isInitialized = await Storage.getItem<boolean>("pts_initialized");
  if (isInitialized && !forceReset) {
    await Storage.getItem<Equipment[]>("equipment", SEED_EQUIPMENT);
    const storedLocations = (await Storage.getItem<Location[]>("locations")) || [];
    if (!storedLocations.some((location) => location.id === "area-filling")) {
      const fillingLocation = SEED_LOCATIONS.find((location) => location.id === "area-filling");
      if (fillingLocation) {
        await Storage.setItem("locations", [...storedLocations, fillingLocation]);
      }
    }

    const groups = (await Storage.getItem<Group[]>("groups")) || [];
    const adminGroup = groups.find((group) => group.id === "group-admin");
    if (adminGroup && !adminGroup.permissions.includes("binder.create")) {
      const oldPermissions = [...adminGroup.permissions];
      adminGroup.permissions = [...adminGroup.permissions, "binder.create"];
      await Storage.setItem("groups", groups);
      await AuditService.appendEntry({
        userId: "SYSTEM",
        fullName: "PTS System",
        action: "ROLE_RIGHTS",
        entityType: "GROUP",
        entityId: adminGroup.id,
        field: "permissions",
        oldValue: oldPermissions,
        newValue: adminGroup.permissions,
        reason: "Enabled Admin batch creation for dynamic batch tracking and reporting.",
      });
    }

    const binders = (await Storage.getItem<Binder[]>("binders")) || [];
    const unlabelled = binders.filter((binder) => !binder.barcode);
    if (unlabelled.length > 0) {
      const format = SEED_BARCODE_FORMATS.find((item) => item.entity === "BINDER")!;
      const existingCodes = new Set(
        binders.flatMap((binder) =>
          [binder.id, binder.barcode, binder.lotNo, binder.batchNo].filter((value): value is string => Boolean(value))
        )
      );
      const generated = generateUniqueBarcodeBatch(format, unlabelled.length, 1, existingCodes);
      const barcodeById = new Map(unlabelled.map((binder, index) => [binder.id, generated.barcodes[index]]));
      const updatedBinders = binders.map((binder) => ({
        ...binder,
        barcode: binder.barcode || barcodeById.get(binder.id),
      }));
      await Storage.setItem("binders", updatedBinders);

      const counters = (await Storage.getItem<Record<string, number>>("barcode_seq_counters", {
        RACK: 6,
        PALLET: 112,
        BINDER: 6,
      })) || { RACK: 6, PALLET: 112, BINDER: 6 };
      counters.BINDER = Math.max(counters.BINDER || 0, generated.finalSeq - 1);
      await Storage.setItem("barcode_seq_counters", counters);
      await AuditService.appendEntry({
        userId: "SYSTEM",
        fullName: "PTS System",
        action: "PRODUCT_BARCODES_MIGRATED",
        entityType: "BINDER",
        entityId: "EXISTING_PRODUCTS",
        reason: "Assigned missing scan labels to existing demo product records.",
        newValue: Array.from(barcodeById.entries()).map(([binderId, barcode]) => ({ binderId, barcode })),
      });
    }
    return;
  }

  if (forceReset) {
    await Storage.clearAll();
  }

  const nowIso = TimeService.now();
  const nowMs = TimeService.nowMs();

  // 1. Save Configs & Masters
  await Storage.setItem("security_policy", SEED_SECURITY_POLICY);
  await Storage.setItem("departments", SEED_DEPARTMENTS);
  await Storage.setItem("locations", SEED_LOCATIONS);
  await Storage.setItem("racks", SEED_RACKS);
  await Storage.setItem("pallets", SEED_PALLETS);
  await Storage.setItem("equipment", SEED_EQUIPMENT);
  await Storage.setItem("groups", SEED_GROUPS);
  await Storage.setItem("workflow_stages", SEED_STAGES);
  await Storage.setItem("hold_rules", SEED_HOLD_RULES);
  await Storage.setItem("sign_route", SEED_SIGN_ROUTE);
  await Storage.setItem("barcode_formats", SEED_BARCODE_FORMATS);

  // 2. Hash default passwords ("Demo@1234")
  const defaultPw = "Demo@1234";
  const { hash: pwHash, salt } = await hashPassword(defaultPw);

  const users: User[] = [
    {
      id: "u-admin1",
      userId: "admin1",
      fullName: "David Chen",
      departmentId: "dept-it",
      groupIds: ["group-admin"],
      eSignMeanings: [],
      status: "ACTIVE",
      failedAttempts: 0,
      passwordHash: pwHash,
      salt,
      passwordHistory: [pwHash],
      passwordChangedAt: nowIso,
      lastLoginAt: nowIso,
    },
    {
      id: "u-init1",
      userId: "init1",
      fullName: "Anita Shah",
      departmentId: "dept-packing",
      groupIds: ["group-initiator"],
      eSignMeanings: ["INITIATOR"],
      status: "ACTIVE",
      failedAttempts: 0,
      passwordHash: pwHash,
      salt,
      passwordHistory: [pwHash],
      passwordChangedAt: nowIso,
      lastLoginAt: nowIso,
    },
    {
      id: "u-init2",
      userId: "init2",
      fullName: "Raj Patel",
      departmentId: "dept-packing",
      groupIds: ["group-initiator"],
      eSignMeanings: ["INITIATOR"],
      status: "ACTIVE",
      failedAttempts: 0,
      passwordHash: pwHash,
      salt,
      passwordHistory: [pwHash],
      passwordChangedAt: nowIso,
      lastLoginAt: nowIso,
    },
    {
      id: "u-hod1",
      userId: "hod1",
      fullName: "Dr. Marcus Vance",
      departmentId: "dept-packing",
      groupIds: ["group-hod"],
      eSignMeanings: ["REVIEW"],
      status: "ACTIVE",
      failedAttempts: 0,
      passwordHash: pwHash,
      salt,
      passwordHistory: [pwHash],
      passwordChangedAt: nowIso,
      lastLoginAt: nowIso,
    },
    {
      id: "u-qa1",
      userId: "qa1",
      fullName: "Elena Rostova",
      departmentId: "dept-qa",
      groupIds: ["group-qa"],
      eSignMeanings: ["APPROVAL"],
      status: "ACTIVE",
      failedAttempts: 0,
      passwordHash: pwHash,
      salt,
      passwordHistory: [pwHash],
      passwordChangedAt: nowIso,
      lastLoginAt: nowIso,
    },
    {
      id: "u-multi1",
      userId: "multi1",
      fullName: "Sanjay Mehta",
      departmentId: "dept-packing",
      groupIds: ["group-initiator", "group-hod"],
      eSignMeanings: ["INITIATOR", "REVIEW"],
      status: "ACTIVE",
      failedAttempts: 0,
      passwordHash: pwHash,
      salt,
      passwordHistory: [pwHash],
      passwordChangedAt: nowIso,
      lastLoginAt: nowIso,
    },
    {
      id: "u-newuser1",
      userId: "newuser1",
      fullName: "Priya Nair",
      departmentId: "dept-packing",
      groupIds: ["group-initiator"],
      eSignMeanings: ["INITIATOR"],
      status: "ACTIVE",
      mustChangePassword: true,
      failedAttempts: 0,
      passwordHash: pwHash,
      salt,
      passwordHistory: [pwHash],
      passwordChangedAt: nowIso,
    },
  ];

  await Storage.setItem("users", users);

  // 3. Seed Binders & Movement Events (6 binders per §6)
  const binders: Binder[] = [
    {
      id: "bnd-001",
      productName: "Insulin Glargine 100 IU/mL",
      strength: "100 IU/mL (3.64 mg/mL)",
      lotNo: "LT-26A017",
      batchNo: "B260117",
      barcode: "BND-26-00001",
      departmentId: "dept-packing",
      receivedFromFillingAt: new Date(nowMs - 75 * 60 * 1000).toISOString(),
      stageId: "cold-room",
      coldRoomId: "cr-01",
      rackId: "rk-cr01-001",
      palletId: "pl-101",
      createdBy: "init1",
      createdAt: new Date(nowMs - 75 * 60 * 1000).toISOString(),
      updatedAt: new Date(nowMs - 70 * 60 * 1000).toISOString(),
      version: 1,
      locked: false,
    },
    {
      id: "bnd-002",
      productName: "Adalimumab 40 mg/0.8 mL",
      strength: "40 mg/0.8 mL",
      lotNo: "LT-26A024",
      batchNo: "B260124",
      barcode: "BND-26-00002",
      departmentId: "dept-packing",
      receivedFromFillingAt: new Date(nowMs - 55 * 60 * 1000).toISOString(),
      stageId: "cold-room",
      coldRoomId: "cr-01",
      rackId: "rk-cr01-002",
      palletId: "pl-103",
      createdBy: "init1",
      createdAt: new Date(nowMs - 55 * 60 * 1000).toISOString(),
      updatedAt: new Date(nowMs - 50 * 60 * 1000).toISOString(),
      version: 1,
      locked: false,
    },
    {
      id: "bnd-003",
      productName: "Filgrastim 300 mcg/0.5 mL",
      strength: "300 mcg/0.5 mL",
      lotNo: "LT-26A031",
      batchNo: "B260131",
      barcode: "BND-26-00003",
      departmentId: "dept-packing",
      receivedFromFillingAt: new Date(nowMs - 40 * 60 * 1000).toISOString(),
      stageId: "visual-inspection",
      areaId: "area-vi",
      createdBy: "init2",
      createdAt: new Date(nowMs - 40 * 60 * 1000).toISOString(),
      updatedAt: new Date(nowMs - 20 * 60 * 1000).toISOString(),
      version: 2,
      locked: false,
    },
    {
      id: "bnd-004",
      productName: "Trastuzumab 440 mg",
      strength: "440 mg vial",
      lotNo: "LT-26A045",
      batchNo: "B260145",
      barcode: "BND-26-00004",
      departmentId: "dept-packing",
      receivedFromFillingAt: new Date(nowMs - 30 * 60 * 1000).toISOString(),
      stageId: "packing",
      areaId: "area-packing",
      createdBy: "init1",
      createdAt: new Date(nowMs - 30 * 60 * 1000).toISOString(),
      updatedAt: new Date(nowMs - 10 * 60 * 1000).toISOString(),
      version: 3,
      locked: false,
    },
    {
      id: "bnd-005",
      productName: "Rituximab 500 mg/50 mL",
      strength: "10 mg/mL",
      lotNo: "LT-26A008",
      batchNo: "B260108",
      barcode: "BND-26-00005",
      departmentId: "dept-packing",
      receivedFromFillingAt: new Date(nowMs - 180 * 60 * 1000).toISOString(),
      stageId: "packed",
      areaId: "area-packing",
      createdBy: "init1",
      createdAt: new Date(nowMs - 180 * 60 * 1000).toISOString(),
      updatedAt: new Date(nowMs - 15 * 60 * 1000).toISOString(),
      version: 5,
      locked: true,
    },
    {
      id: "bnd-006",
      productName: "Erythropoietin 4000 IU/mL",
      strength: "4000 IU/mL PFS",
      lotNo: "LT-26A052",
      batchNo: "B260152",
      barcode: "BND-26-00006",
      departmentId: "dept-packing",
      receivedFromFillingAt: new Date(nowMs - 5 * 60 * 1000).toISOString(),
      stageId: "filling-complete",
      createdBy: "init2",
      createdAt: new Date(nowMs - 5 * 60 * 1000).toISOString(),
      updatedAt: new Date(nowMs - 5 * 60 * 1000).toISOString(),
      version: 1,
      locked: false,
    },
  ];

  await Storage.setItem("binders", binders);

  // 4. Movement Events
  const events: MovementEvent[] = [
    // bnd-001 events (exceeded hold time: loaded 70m ago, 60m limit)
    { id: "ev-101", binderId: "bnd-001", type: "RECEIVED", stageId: "filling-complete", remarks: "Received from Sterile Filling Line A", at: new Date(nowMs - 75 * 60 * 1000).toISOString(), by: "init1" },
    { id: "ev-102", binderId: "bnd-001", type: "STAGE_ENTER", stageId: "filling-complete", remarks: "Entered filling-complete", at: new Date(nowMs - 75 * 60 * 1000).toISOString(), by: "init1" },
    { id: "ev-103", binderId: "bnd-001", type: "STAGE_EXIT", stageId: "filling-complete", remarks: "Exiting filling-complete for cold storage", at: new Date(nowMs - 70 * 60 * 1000).toISOString(), by: "init1" },
    { id: "ev-104", binderId: "bnd-001", type: "LOAD", stageId: "cold-room", to: "CR-01 / RK-CR01-001 / PL-26-000101", remarks: "Loaded into Chamber 01 per SOP-PTS-001", at: new Date(nowMs - 70 * 60 * 1000).toISOString(), by: "init1" },
    { id: "ev-105", binderId: "bnd-001", type: "STAGE_ENTER", stageId: "cold-room", remarks: "Stage cold-room clock running", at: new Date(nowMs - 70 * 60 * 1000).toISOString(), by: "init1" },

    // bnd-002 events (warning hold time: loaded 50m ago, 60m limit, 83% elapsed)
    { id: "ev-201", binderId: "bnd-002", type: "RECEIVED", stageId: "filling-complete", remarks: "Initial reception batch transfer", at: new Date(nowMs - 55 * 60 * 1000).toISOString(), by: "init1" },
    { id: "ev-202", binderId: "bnd-002", type: "STAGE_ENTER", stageId: "filling-complete", remarks: "Entered filling complete", at: new Date(nowMs - 55 * 60 * 1000).toISOString(), by: "init1" },
    { id: "ev-203", binderId: "bnd-002", type: "STAGE_EXIT", stageId: "filling-complete", remarks: "Transfer to cold chain", at: new Date(nowMs - 50 * 60 * 1000).toISOString(), by: "init1" },
    { id: "ev-204", binderId: "bnd-002", type: "LOAD", stageId: "cold-room", to: "CR-01 / RK-CR01-002 / PL-26-000103", remarks: "Secured in rack 002", at: new Date(nowMs - 50 * 60 * 1000).toISOString(), by: "init1" },
    { id: "ev-205", binderId: "bnd-002", type: "STAGE_ENTER", stageId: "cold-room", remarks: "Hold clock initiated", at: new Date(nowMs - 50 * 60 * 1000).toISOString(), by: "init1" },

    // bnd-005 events (fully signed)
    { id: "ev-501", binderId: "bnd-005", type: "RECEIVED", stageId: "filling-complete", remarks: "Batch reception", at: new Date(nowMs - 180 * 60 * 1000).toISOString(), by: "init1" },
    { id: "ev-502", binderId: "bnd-005", type: "STAGE_ENTER", stageId: "packed", remarks: "Final packaging completed", at: new Date(nowMs - 30 * 60 * 1000).toISOString(), by: "init1" },
  ];

  await Storage.setItem("movement_events", events);

  // 5. Signatures on bnd-005 (fully signed by all 3 roles)
  const signatures = [
    { id: "sig-501", binderId: "bnd-005", meaning: "INITIATOR" as const, signerUserId: "init1", signerFullName: "Anita Shah", at: new Date(nowMs - 25 * 60 * 1000).toISOString() },
    { id: "sig-502", binderId: "bnd-005", meaning: "REVIEW" as const, signerUserId: "hod1", signerFullName: "Dr. Marcus Vance", at: new Date(nowMs - 20 * 60 * 1000).toISOString() },
    { id: "sig-503", binderId: "bnd-005", meaning: "APPROVAL" as const, signerUserId: "qa1", signerFullName: "Elena Rostova", at: new Date(nowMs - 15 * 60 * 1000).toISOString() },
  ];
  await Storage.setItem("signatures", signatures);

  // 6. Append System Genesis & Phase 1 & Operational Audit Trail Entries (Sequentially hash-chained per R5)
  // Clear any existing audit log before re-seeding
  await Storage.removeItem("audit_log");

  // Seq 1: Genesis System Boot
  await AuditService.appendEntry({
    userId: "SYSTEM",
    fullName: "System Bootstrapper",
    action: "SYSTEM_INITIALIZE",
    entityType: "SYSTEM",
    entityId: "SYSTEM_ROOT",
    reason: "21 CFR Part 11 Electronic Records system initialization & cryptographic genesis block",
    at: new Date(nowMs - 240 * 60 * 1000).toISOString(),
  });

  // Seq 2: Login - Admin
  await AuditService.appendEntry({
    userId: "admin1",
    fullName: "David Chen",
    action: "LOGIN",
    entityType: "SESSION",
    entityId: "u-admin1",
    reason: "Initial administrator session logon via 2FA cleanroom terminal",
    at: new Date(nowMs - 220 * 60 * 1000).toISOString(),
  });

  // Seq 3: User Management - Provision new user
  await AuditService.appendEntry({
    userId: "admin1",
    fullName: "David Chen",
    action: "USER_MANAGEMENT",
    entityType: "USER",
    entityId: "u-newuser1",
    field: "status",
    oldValue: "PENDING_ACTIVATION",
    newValue: "ACTIVE",
    reason: "Provisioned floor operator account for Priya Nair (newuser1) per HR-SOP-012",
    at: new Date(nowMs - 210 * 60 * 1000).toISOString(),
  });

  // Seq 4: Password Change - First login forced reset
  await AuditService.appendEntry({
    userId: "newuser1",
    fullName: "Priya Nair",
    action: "PASSWORD_CHANGE",
    entityType: "CREDENTIAL",
    entityId: "u-newuser1",
    field: "passwordHash",
    oldValue: "[ENCRYPTED_TEMPORARY]",
    newValue: "[ENCRYPTED_COMPLIANT_HASH]",
    reason: "Mandatory first-login password rotation per Security Policy UPWD-1",
    at: new Date(nowMs - 200 * 60 * 1000).toISOString(),
  });

  // Seq 5: Login - Initiator Anita Shah
  await AuditService.appendEntry({
    userId: "init1",
    fullName: "Anita Shah",
    action: "LOGIN",
    entityType: "SESSION",
    entityId: "u-init1",
    reason: "Cleanroom Terminal Line 2 shift commencement authentication",
    at: new Date(nowMs - 190 * 60 * 1000).toISOString(),
  });

  // Seq 6: Binder Created - BND-005
  await AuditService.appendEntry({
    userId: "init1",
    fullName: "Anita Shah",
    action: "CREATE",
    entityType: "BINDER",
    entityId: "bnd-005",
    product: "Rituximab 500 mg/50 mL",
    lotNo: "LT-26A008",
    batchNo: "B260108",
    reason: "Received filled batch Rituximab 500 mg/50 mL from Filling Suite B",
    at: new Date(nowMs - 180 * 60 * 1000).toISOString(),
  });

  // Seq 7: Binder Created - BND-001 (Insulin Glargine)
  await AuditService.appendEntry({
    userId: "init1",
    fullName: "Anita Shah",
    action: "CREATE",
    entityType: "BINDER",
    entityId: "bnd-001",
    product: "Insulin Glargine 100 IU/mL",
    lotNo: "LT-26A017",
    batchNo: "B260117",
    reason: "Received filled sterile lot Insulin Glargine 100 IU/mL per BMR-IG-26A",
    at: new Date(nowMs - 75 * 60 * 1000).toISOString(),
  });

  // Seq 8: Modify / Custody Load - BND-001 into Cold Room
  await AuditService.appendEntry({
    userId: "init1",
    fullName: "Anita Shah",
    action: "MODIFY",
    entityType: "BINDER",
    entityId: "bnd-001",
    product: "Insulin Glargine 100 IU/mL",
    lotNo: "LT-26A017",
    batchNo: "B260117",
    field: "location",
    oldValue: "Visual Inspection Cleanroom Area",
    newValue: "CR-01 / RK-CR01-001 / PL-26-000101",
    reason: "Loaded into cold chain storage chamber 01 per SOP-PTS-001 Rev 4",
    at: new Date(nowMs - 70 * 60 * 1000).toISOString(),
  });

  // Seq 9: Binder Created - BND-002 (Adalimumab)
  await AuditService.appendEntry({
    userId: "init1",
    fullName: "Anita Shah",
    action: "CREATE",
    entityType: "BINDER",
    entityId: "bnd-002",
    product: "Adalimumab 40 mg/0.8 mL",
    lotNo: "LT-26A024",
    batchNo: "B260124",
    reason: "Received filled syringes batch Adalimumab 40 mg/0.8 mL",
    at: new Date(nowMs - 55 * 60 * 1000).toISOString(),
  });

  // Seq 10: Modify / Custody Load - BND-002 into Cold Room
  await AuditService.appendEntry({
    userId: "init1",
    fullName: "Anita Shah",
    action: "MODIFY",
    entityType: "BINDER",
    entityId: "bnd-002",
    product: "Adalimumab 40 mg/0.8 mL",
    lotNo: "LT-26A024",
    batchNo: "B260124",
    field: "location",
    oldValue: "Staging Bay Line 2",
    newValue: "CR-01 / RK-CR01-002 / PL-26-000103",
    reason: "Secured in cold chain storage rack 002 pallet 103",
    at: new Date(nowMs - 50 * 60 * 1000).toISOString(),
  });

  // Seq 11: Modify / Stage Transition - BND-003 to Visual Inspection
  await AuditService.appendEntry({
    userId: "init2",
    fullName: "Raj Patel",
    action: "MODIFY",
    entityType: "BINDER",
    entityId: "bnd-003",
    product: "Filgrastim 300 mcg/0.5 mL",
    lotNo: "LT-26A031",
    batchNo: "B260131",
    field: "stageId",
    oldValue: "cold-room",
    newValue: "visual-inspection",
    reason: "Withdrawn from cold room and moved to Visual Inspection inspection line",
    at: new Date(nowMs - 20 * 60 * 1000).toISOString(),
  });

  // Seq 12: Role & Rights Modification
  await AuditService.appendEntry({
    userId: "admin1",
    fullName: "David Chen",
    action: "ROLE_RIGHTS",
    entityType: "GROUP",
    entityId: "group-initiator",
    field: "permissions",
    oldValue: "['binder.view', 'binder.create', 'movement.perform']",
    newValue: "['binder.view', 'binder.create', 'binder.edit', 'movement.perform', 'scan.use', 'alert.ack', 'report.view', 'report.print', 'sign.initiator']",
    reason: "Updated Initiator permissions matrix for automated barcode wedge lookup",
    at: new Date(nowMs - 35 * 60 * 1000).toISOString(),
  });

  // Seq 13: Failed Login Deviation
  await AuditService.appendEntry({
    userId: "qa1",
    fullName: "Elena Rostova",
    action: "FAILED_LOGIN",
    entityType: "SECURITY",
    entityId: "u-qa1",
    field: "failedAttempts",
    oldValue: 0,
    newValue: 1,
    reason: "Authentication deviation: Password mismatch at cleanroom portal (Attempt 1 of 5)",
    at: new Date(nowMs - 32 * 60 * 1000).toISOString(),
  });

  // Seq 14: Auto Log-Off Event
  await AuditService.appendEntry({
    userId: "hod1",
    fullName: "Dr. Marcus Vance",
    action: "AUTO_LOGOFF",
    entityType: "SESSION",
    entityId: "u-hod1",
    reason: "Automated session termination: 30-minute cleanroom inactivity policy triggered",
    at: new Date(nowMs - 30 * 60 * 1000).toISOString(),
  });

  // Seq 15: Electronic Signature - Initiator Sign-off
  await AuditService.appendEntry({
    userId: "init1",
    fullName: "Anita Shah",
    action: "SIGNATURE",
    entityType: "BINDER",
    entityId: "bnd-005",
    product: "Rituximab 500 mg/50 mL",
    lotNo: "LT-26A008",
    batchNo: "B260108",
    field: "signature.initiator",
    oldValue: null,
    newValue: "Anita Shah [INITIATOR] at " + new Date(nowMs - 25 * 60 * 1000).toISOString(),
    reason: "Confirmed batch packaging execution and 100% reconciliation complete",
    at: new Date(nowMs - 25 * 60 * 1000).toISOString(),
  });

  // Seq 16: Electronic Signature - HOD Review
  await AuditService.appendEntry({
    userId: "hod1",
    fullName: "Dr. Marcus Vance",
    action: "SIGNATURE",
    entityType: "BINDER",
    entityId: "bnd-005",
    product: "Rituximab 500 mg/50 mL",
    lotNo: "LT-26A008",
    batchNo: "B260108",
    field: "signature.review",
    oldValue: null,
    newValue: "Dr. Marcus Vance [REVIEW] at " + new Date(nowMs - 20 * 60 * 1000).toISOString(),
    reason: "Departmental review: Environmental temperature logs and batch records verified",
    at: new Date(nowMs - 20 * 60 * 1000).toISOString(),
  });

  // Seq 17: Electronic Signature - QA Final Release Approval
  await AuditService.appendEntry({
    userId: "qa1",
    fullName: "Elena Rostova",
    action: "SIGNATURE",
    entityType: "BINDER",
    entityId: "bnd-005",
    product: "Rituximab 500 mg/50 mL",
    lotNo: "LT-26A008",
    batchNo: "B260108",
    field: "signature.approval",
    oldValue: null,
    newValue: "Elena Rostova [APPROVAL] at " + new Date(nowMs - 15 * 60 * 1000).toISOString(),
    reason: "Quality Assurance Final Disposition: Lot released for distribution per SOP-QA-089",
    at: new Date(nowMs - 15 * 60 * 1000).toISOString(),
  });

  // Mark initialized
  await Storage.setItem("pts_initialized", true);
  console.log("PTS Seed database successfully initialized with verified cryptographic audit trail.");
}

