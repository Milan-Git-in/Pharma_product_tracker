/**
 * Core Data Models & Types based on SPEC §5 & §8
 */

export type Role = "ADMIN" | "INITIATOR" | "HOD" | "QA";

export type ESignMeaning = "INITIATOR" | "REVIEW" | "APPROVAL";

export type UserStatus = "ACTIVE" | "LOCKED" | "DISABLED" | "DEACTIVATED";

export interface User {
  id: string;
  userId: string; // immutable, unique, never reused
  fullName: string;
  departmentId: string;
  groupIds: string[];
  eSignMeanings: ESignMeaning[];
  status: UserStatus;
  failedAttempts: number;
  mustChangePassword?: boolean;
  passwordHash: string;
  salt: string;
  passwordHistory: string[];
  passwordChangedAt: string;
  lastLoginAt?: string;
}

export interface Group {
  id: string;
  name: string;
  role: Role;
  permissions: string[];
  active: boolean;
}

export interface Department {
  id: string;
  code: string;
  name: string;
  active: boolean;
}

export type LocationType = "COLD_ROOM" | "AREA";

export interface Location {
  id: string;
  code: string;
  name: string;
  type: LocationType;
  departmentId?: string;
  active: boolean;
}

export interface Rack {
  id: string;
  code: string;
  barcode: string;
  coldRoomId: string;
  active: boolean;
}

export interface Pallet {
  id: string;
  code: string;
  barcode: string;
  rackId?: string;
  active: boolean;
}

export interface Equipment {
  id: string;
  code: string;
  name: string;
  locationId: string;
  active: boolean;
}

export interface ProductTray {
  id: string;
  binderId: string;
  trayNumber: number;
  barcode: string;
  stageId: string;
  locationId?: string;
  equipmentId?: string;
  createdAt: string;
  updatedAt: string;
  version: number;
  locked: boolean;
}

export interface Binder {
  id: string;
  productName: string;
  strength: string;
  productCode?: string;
  lotNo: string;
  batchNo: string;
  batchSize?: string;
  trayCount?: number;
  barcode?: string;
  unitBarcodes?: string[];
  stageSummary?: string;
  departmentId: string;
  receivedFromFillingAt: string;
  stageId: string; // current stage ID
  locationId?: string;
  equipmentId?: string;
  coldRoomId?: string;
  rackId?: string;
  palletId?: string;
  areaId?: string;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  version: number;
  locked: boolean;
}

export interface NewBinderData {
  productName: string;
  strength: string;
  productCode: string;
  lotNo: string;
  batchNo: string;
  batchSize: string;
  trayCount: number;
  departmentId: string;
  locationId: string;
  equipmentId: string;
  remarks: string;
}

export type MovementType =
  | "RECEIVED"
  | "LOAD"
  | "UNLOAD"
  | "TRANSFER"
  | "STAGE_ENTER"
  | "STAGE_EXIT";

export interface MovementEvent {
  id: string;
  binderId: string;
  trayId?: string;
  type: MovementType;
  stageId?: string;
  from?: string;
  to?: string;
  locationId?: string;
  locationName?: string;
  equipmentId?: string;
  remarks: string;
  at: string;
  by: string; // userId
  durationMs?: number;
}

export type StageKind = "START" | "STORAGE" | "PROCESS" | "END";

export interface WorkflowStage {
  id: string;
  name: string;
  kind: StageKind;
  order: number;
  nextStageIds: string[];
  allowedRoles: Role[];
  remarksRequired: boolean;
}

export type HoldLevel = "OK" | "WARNING" | "EXCEEDED";

export interface HoldRule {
  id: string;
  name: string;
  startTrigger: string; // e.g. "STAGE_ENTER:filling-complete"
  stopTrigger: string;  // e.g. "STAGE_EXIT:filling-complete"
  limitMinutes: number; // default 60
  warnAtPercent: number; // default 80
  productFilter?: string;
  active: boolean;
}

export interface HoldClock {
  binderId: string;
  ruleId: string;
  startedAt: string;
  stoppedAt?: string;
  elapsedMs: number;
  level: HoldLevel;
}

export interface Alert {
  id: string;
  binderId: string;
  ruleId: string;
  level: HoldLevel;
  raisedAt: string;
  ackBy?: string;
  ackAt?: string;
  ackRemarks?: string;
}

export interface Signature {
  id: string;
  binderId: string;
  meaning: ESignMeaning;
  signerUserId: string;
  signerFullName: string;
  at: string;
}

export interface SignRouteStep {
  order: number;
  meaning: ESignMeaning;
  role: Role;
  required: boolean;
}

export interface SignRoute {
  steps: SignRouteStep[];
}

export type Symbology = "CODE128" | "QR";
export type SegmentType =
  | "LITERAL"
  | "LOCATION_CODE"
  | "YEAR2"
  | "YEAR4"
  | "SEQ"
  | "DEPT_CODE";

export interface BarcodeSegment {
  type: SegmentType;
  value?: string;
  pad?: number;
}

export interface BarcodeFormat {
  entity: "RACK" | "PALLET" | "BINDER";
  symbology: Symbology;
  segments: BarcodeSegment[];
  separator: string;
  seqStart: number;
  checkDigit: boolean;
}

export interface AuditEntry {
  seq: number;
  at: string;
  userId: string;
  fullName: string;
  action: string;
  entityType: string;
  entityId: string;
  field?: string;
  oldValue?: any;
  newValue?: any;
  reason?: string;
  product?: string;
  lotNo?: string;
  batchNo?: string;
  prevHash: string;
  hash: string;
}

export interface SecurityPolicy {
  minLength: number; // default 8
  hardFloor: number; // fixed 6
  requireUpper: boolean;
  requireNumber: boolean;
  requireSpecial: boolean;
  historyCount: number; // default 3
  expiryDays: number; // default 60
  maxFailedAttempts: number; // default 5
  idleLockMinutes: number; // default 30
  autoLogoffAfterLockMinutes: number; // default 5
}

export interface BackupSnapshot {
  id: string;
  at: string;
  type: "AUTO" | "MANUAL";
  counts: Record<string, number>;
  checksum: string;
  payload: any;
}

export interface ApiResponse<T = any> {
  ok: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
  };
}

