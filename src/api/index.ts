/**
 * Mock API Layer (SPEC §3 Architecture & §9 Mock API)
 * The UI talks ONLY to /src/api. /src/api is the ONLY layer that touches storage.
 * Every endpoint is async (150–400 ms simulated latency) and returns:
 * { ok: true, data } or { ok: false, error: { code, message } }
 * Every mutating endpoint: check permission → validate → write → append audit entry → return.
 */

import { Api } from "@/services/api";
import { Storage, EntityRepository } from "@/services/storage";
import { TimeService } from "@/services/time";
import { AuditService } from "@/services/audit";
import { can, rolesForUser } from "@/services/permission";
import { verifyPassword, hashPassword } from "@/services/crypto";
import {
  User,
  Group,
  Role,
  Binder,
  ProductTray,
  MovementEvent,
  AuditEntry,
  ApiResponse,
  Department,
  Location,
  Rack,
  Pallet,
  Equipment,
  NewBinderData,
  SecurityPolicy,
  WorkflowStage,
  HoldRule,
  SignRoute,
  BarcodeFormat,
} from "@/domain/types";
import {
  validateWorkflowStages,
  validateHoldRules,
  validateSignRoute,
} from "@/domain/workflow";
import { getAllTerms, setTerms, TermsDictionary } from "@/config/terms";
import { initializeSeedData, SEED_BARCODE_FORMATS, SEED_EQUIPMENT } from "@/config/seed";
import {
  formatBarcodeString,
  generateUniqueBarcodeBatch,
  MAX_TRAYS_PER_BATCH,
  previewNextBarcodes,
} from "@/domain/barcode";

// Entity Repositories
const userRepo = new EntityRepository<User>("users");
const groupRepo = new EntityRepository<Group>("groups");
const binderRepo = new EntityRepository<Binder>("binders");
const trayRepo = new EntityRepository<ProductTray>("product_trays");
const eventRepo = new EntityRepository<MovementEvent>("movement_events");
const deptRepo = new EntityRepository<Department>("departments");
const locRepo = new EntityRepository<Location>("locations");
const rackRepo = new EntityRepository<Rack>("racks");
const palletRepo = new EntityRepository<Pallet>("pallets");

async function getEquipmentCatalog(): Promise<Equipment[]> {
  const equipment = await Storage.getItem<Equipment[]>("equipment", SEED_EQUIPMENT);
  return equipment || [];
}

function addTrayStageSummary(binder: Binder, trays: ProductTray[], stages: WorkflowStage[]): Binder {
  const binderTrays = trays.filter((tray) => tray.binderId === binder.id);
  if (!binderTrays.length) return binder;

  const counts = new Map<string, number>();
  binderTrays.forEach((tray) => counts.set(tray.stageId, (counts.get(tray.stageId) || 0) + 1));
  const summary = Array.from(counts.entries())
    .map(([stageId, count]) => {
      const name = stages.find((stage) => stage.id === stageId)?.name || stageId;
      return `${name}: ${count}/${binderTrays.length} trays`;
    })
    .join(" · ");

  return { ...binder, stageSummary: summary };
}

export const mockApi = {
  // --- Auth Endpoints ---
  async login(userId: string, password: string): Promise<ApiResponse<{ user: User }>> {
    return Api.call(async () => {
      const users = await userRepo.getAll();
      const user = users.find((u) => u.userId.toLowerCase() === userId.toLowerCase());

      if (!user) {
        throw { code: "AUTH_FAILED", message: "Invalid User ID or credentials." };
      }

      if (user.status === "LOCKED") {
        throw { code: "ACCOUNT_LOCKED", message: "Account is locked due to excessive failed attempts." };
      }
      if (user.status !== "ACTIVE") {
        throw { code: "ACCOUNT_INACTIVE", message: `Account is ${user.status.toLowerCase()}.` };
      }

      const isValid = await verifyPassword(password, user.passwordHash, user.salt);
      if (!isValid) {
        user.failedAttempts = (user.failedAttempts || 0) + 1;
        if (user.failedAttempts >= 5) {
          user.status = "LOCKED";
          await AuditService.appendEntry({
            userId: user.userId,
            fullName: user.fullName,
            action: "ACCOUNT_LOCKED",
            entityType: "USER",
            entityId: user.id,
            reason: "Exceeded maximum failed login attempts (5)",
          });
        }
        await userRepo.update(user.id, user);
        throw { code: "AUTH_FAILED", message: `Invalid credentials. (${user.failedAttempts} of 5 used)` };
      }

      const groups = await groupRepo.getAll();
      if (rolesForUser(user, groups).length === 0) {
        throw {
          code: "NO_ACTIVE_GROUP",
          message: "This account has no active access group. Contact an administrator.",
        };
      }

      // Successful login
      user.failedAttempts = 0;
      user.lastLoginAt = TimeService.now();
      await userRepo.update(user.id, user);

      await AuditService.appendEntry({
        userId: user.userId,
        fullName: user.fullName,
        action: "LOGIN",
        entityType: "SESSION",
        entityId: user.id,
        reason: "User authenticated successfully",
      });

      return { user };
    });
  },

  async logout(user: User): Promise<ApiResponse<{ loggedOut: boolean }>> {
    return Api.call(async () => {
      await AuditService.appendEntry({
        userId: user.userId,
        fullName: user.fullName,
        action: "LOGOUT",
        entityType: "SESSION",
        entityId: user.id,
        reason: "User logged out",
      });
      return { loggedOut: true };
    });
  },

  // --- System & Diagnostics Endpoints ---
  async getTime(): Promise<ApiResponse<{ iso: string; formatted: string; offsetMs: number }>> {
    return Api.call(async () => {
      return {
        iso: TimeService.now(),
        formatted: TimeService.nowDate().toLocaleString(),
        offsetMs: TimeService.getOffsetMs(),
      };
    });
  },

  async resetData(): Promise<ApiResponse<{ reset: boolean }>> {
    return Api.call(async () => {
      await initializeSeedData(true);
      return { reset: true };
    });
  },

  async setNetworkSimulation(active: boolean): Promise<ApiResponse<{ networkActive: boolean }>> {
    Api.setNetworkFailure(active);
    await AuditService.appendEntry({
      userId: "DEV_OPERATOR",
      fullName: "Developer Simulation",
      action: active ? "NETWORK_FAILURE_START" : "NETWORK_FAILURE_RECOVERED",
      entityType: "SYSTEM",
      entityId: "NETWORK",
      reason: active ? "Simulated network interruption" : "Simulated network restored",
    });
    return { ok: true, data: { networkActive: !active } };
  },

  // --- Terms Config ---
  async getTerms(): Promise<ApiResponse<TermsDictionary>> {
    return Api.call(async () => getAllTerms());
  },

  async updateTerms(newTerms: Partial<TermsDictionary>, actingUser: User, reason: string): Promise<ApiResponse<TermsDictionary>> {
    return Api.call(async () => {
      if (!can(actingUser, "workflow.configure")) {
        throw { code: "FORBIDDEN", message: "Insufficient permissions to update terminology." };
      }
      if (!reason || reason.trim().length < 5) {
        throw { code: "VALIDATION_ERROR", message: "Mandatory reason for change must be provided." };
      }
      setTerms(newTerms);
      await AuditService.appendEntry({
        userId: actingUser.userId,
        fullName: actingUser.fullName,
        action: "TERMS_UPDATED",
        entityType: "CONFIG",
        entityId: "TERMS",
        reason,
        newValue: newTerms,
      });
      return getAllTerms();
    });
  },

  // --- Binders ---
  async getBinders(): Promise<ApiResponse<Binder[]>> {
    return Api.call(async () => {
      const [binders, trays, stages] = await Promise.all([
        binderRepo.getAll(),
        trayRepo.getAll(),
        Storage.getItem<WorkflowStage[]>("workflow_stages", []),
      ]);
      return binders.map((binder) => addTrayStageSummary(binder, trays, stages || []));
    });
  },

  async getEquipment(): Promise<ApiResponse<Equipment[]>> {
    return Api.call(async () => getEquipmentCatalog());
  },

  async createBinder(
    payload: NewBinderData,
    actingUser: User
  ): Promise<ApiResponse<{ binder: Binder }>> {
    return Api.call(async () => {
      const groups = await groupRepo.getAll();
      const activeRoles = rolesForUser(actingUser, groups);
      if (
        actingUser.status !== "ACTIVE" ||
        !activeRoles.some((role) => role === "ADMIN" || role === "INITIATOR") ||
        !can(actingUser, "binder.create")
      ) {
        throw { code: "FORBIDDEN", message: "Only an authorized Admin or Initiator can create batches." };
      }

      const requiredFields: Array<[string, string]> = [
        ["productName", payload.productName],
        ["strength", payload.strength],
        ["productCode", payload.productCode],
        ["lotNo", payload.lotNo],
        ["batchNo", payload.batchNo],
        ["batchSize", payload.batchSize],
        ["departmentId", payload.departmentId],
        ["locationId", payload.locationId],
        ["equipmentId", payload.equipmentId],
      ];
      const missingField = requiredFields.find(([, value]) => !value?.trim());
      if (missingField) {
        throw { code: "VALIDATION_ERROR", message: `${missingField[0]} is required.` };
      }
      if (!Number.isSafeInteger(payload.trayCount) || payload.trayCount < 1 || payload.trayCount > MAX_TRAYS_PER_BATCH) {
        throw {
          code: "INVALID_TRAY_COUNT",
          message: `Tray count must be a whole number between 1 and ${MAX_TRAYS_PER_BATCH}.`,
        };
      }
      if (!payload.remarks || payload.remarks.trim().length < 5) {
        throw { code: "VALIDATION_ERROR", message: "Creation remarks must contain at least 5 characters." };
      }

      const [binders, storedTrays, departments, locations, equipment, racks, pallets, stages] = await Promise.all([
        binderRepo.getAll(),
        trayRepo.getAll(),
        deptRepo.getAll(),
        locRepo.getAll(),
        getEquipmentCatalog(),
        rackRepo.getAll(),
        palletRepo.getAll(),
        Storage.getItem<WorkflowStage[]>("workflow_stages", []),
      ]);
      const normalizedLot = payload.lotNo.trim().toLowerCase();
      const normalizedBatch = payload.batchNo.trim().toLowerCase();
      if (binders.some((binder) =>
        binder.lotNo.trim().toLowerCase() === normalizedLot ||
        binder.batchNo.trim().toLowerCase() === normalizedBatch
      )) {
        throw { code: "DUPLICATE_BATCH", message: "The lot number or batch number is already in use." };
      }

      const department = departments.find((item) => item.id === payload.departmentId && item.active);
      const location = locations.find((item) => item.id === payload.locationId && item.active);
      const selectedEquipment = equipment.find((item) =>
        item.id === payload.equipmentId &&
        item.active &&
        item.locationId === payload.locationId
      );
      if (!department) throw { code: "INVALID_DEPARTMENT", message: "Select an active department." };
      if (!location) throw { code: "INVALID_LOCATION", message: "Select an active location." };
      if (!selectedEquipment) {
        throw { code: "INVALID_EQUIPMENT", message: "Select equipment assigned to the chosen location." };
      }
      const initialStage = (stages || [])
        .filter((stage) => stage.kind === "START")
        .sort((a, b) => a.order - b.order)[0];
      if (!initialStage) {
        throw { code: "WORKFLOW_NOT_CONFIGURED", message: "Configure a START stage before creating batches." };
      }

      const formats = (await Storage.getItem<BarcodeFormat[]>("barcode_formats", SEED_BARCODE_FORMATS)) || SEED_BARCODE_FORMATS;
      const format = formats.find((item) => item.entity === "BINDER") || SEED_BARCODE_FORMATS.find((item) => item.entity === "BINDER")!;
      const existingCodes = new Set(
        binders.flatMap((item) => [item.id, item.barcode, item.lotNo, item.batchNo, ...(item.unitBarcodes || [])]
          .filter((value): value is string => Boolean(value)))
      );
      storedTrays.forEach((tray) => existingCodes.add(tray.barcode));
      racks.forEach((rack) => {
        existingCodes.add(rack.id);
        existingCodes.add(rack.code);
        existingCodes.add(rack.barcode);
      });
      pallets.forEach((pallet) => {
        existingCodes.add(pallet.id);
        existingCodes.add(pallet.code);
        existingCodes.add(pallet.barcode);
      });
      locations.forEach((item) => existingCodes.add(item.code));
      const counters = (await Storage.getItem<Record<string, number>>("barcode_seq_counters", {
        RACK: 6,
        PALLET: 112,
        BINDER: 6,
      })) || { RACK: 6, PALLET: 112, BINDER: 6 };
      const at = TimeService.now();
      const id = `bnd-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
      const generated = generateUniqueBarcodeBatch(
        format,
        payload.trayCount + 1,
        (counters.BINDER || 0) + 1,
        existingCodes
      );
      const barcode = generated.barcodes[0];
      const binder: Binder = {
        id,
        productName: payload.productName.trim(),
        strength: payload.strength.trim(),
        productCode: payload.productCode.trim(),
        lotNo: payload.lotNo.trim(),
        batchNo: payload.batchNo.trim(),
        batchSize: payload.batchSize.trim(),
        trayCount: payload.trayCount,
        barcode,
        departmentId: department.id,
        receivedFromFillingAt: at,
        stageId: initialStage.id,
        locationId: location.id,
        equipmentId: selectedEquipment.id,
        ...(location.type === "COLD_ROOM" ? { coldRoomId: location.id } : { areaId: location.id }),
        createdBy: actingUser.userId,
        createdAt: at,
        updatedAt: at,
        version: 1,
        locked: false,
      };
      const trays: ProductTray[] = Array.from({ length: payload.trayCount }, (_, index) => ({
        id: `${id}-tray-${String(index + 1).padStart(4, "0")}`,
        binderId: id,
        trayNumber: index + 1,
        barcode: generated.barcodes[index + 1],
        stageId: initialStage.id,
        locationId: location.id,
        equipmentId: selectedEquipment.id,
        createdAt: at,
        updatedAt: at,
        version: 1,
        locked: false,
      }));
      const initialEvents: MovementEvent[] = [
        {
          id: `${id}-received`,
          binderId: id,
          type: "RECEIVED",
          stageId: initialStage.id,
          to: initialStage.name,
          locationId: location.id,
          locationName: location.name,
          equipmentId: selectedEquipment.id,
          remarks: payload.remarks.trim(),
          at,
          by: actingUser.userId,
        },
        {
          id: `${id}-stage-enter`,
          binderId: id,
          type: "STAGE_ENTER",
          stageId: initialStage.id,
          to: initialStage.name,
          locationId: location.id,
          locationName: location.name,
          equipmentId: selectedEquipment.id,
          remarks: payload.remarks.trim(),
          at,
          by: actingUser.userId,
        },
      ];
      const trayInitialEvents: MovementEvent[] = trays.map((tray) => ({
        id: `${tray.id}-stage-enter`,
        binderId: id,
        trayId: tray.id,
        type: "STAGE_ENTER",
        stageId: initialStage.id,
        to: initialStage.name,
        locationId: location.id,
        locationName: location.name,
        equipmentId: selectedEquipment.id,
        remarks: payload.remarks.trim(),
        at,
        by: actingUser.userId,
      }));
      const allEvents = await eventRepo.getAll();
      await binderRepo.add(binder);
      await trayRepo.saveAll([...storedTrays, ...trays]);
      await eventRepo.saveAll([...allEvents, ...initialEvents, ...trayInitialEvents]);
      counters.BINDER = generated.finalSeq - 1;
      await Storage.setItem("barcode_seq_counters", counters);
      await AuditService.appendEntry({
        userId: actingUser.userId,
        fullName: actingUser.fullName,
        action: "BATCH_CREATED",
        entityType: "BINDER",
        entityId: id,
        newValue: {
          productName: binder.productName,
          productCode: binder.productCode,
          lotNo: binder.lotNo,
          batchNo: binder.batchNo,
          batchSize: binder.batchSize,
          trayCount: binder.trayCount,
          barcode,
          location: location.name,
          equipment: selectedEquipment.code,
        },
        reason: payload.remarks.trim(),
      });

      return { binder };
    });
  },

  async getBinderById(id: string): Promise<ApiResponse<{ binder: Binder; events: MovementEvent[] }>> {
    return Api.call(async () => {
      const binder = await binderRepo.getById(id);
      if (!binder) throw { code: "NOT_FOUND", message: `Binder with ID ${id} not found.` };
      const allEvents = await eventRepo.getAll();
      const events = allEvents.filter((e) => e.binderId === id);
      return { binder, events };
    });
  },

  async getBinderTrace(id: string): Promise<ApiResponse<{
    binder: Binder;
    trays: ProductTray[];
    events: MovementEvent[];
    stages: WorkflowStage[];
    actors: Array<{ userId: string; fullName: string }>;
  }>> {
    return Api.call(async () => {
      const binder = await binderRepo.getById(id);
      if (!binder) throw { code: "NOT_FOUND", message: `Binder with ID ${id} not found.` };

      const [allEvents, stages, users, allTrays] = await Promise.all([
        eventRepo.getAll(),
        Storage.getItem<WorkflowStage[]>("workflow_stages", []),
        userRepo.getAll(),
        trayRepo.getAll(),
      ]);

      return {
        binder: addTrayStageSummary(binder, allTrays, stages || []),
        trays: allTrays.filter((tray) => tray.binderId === id).sort((a, b) => a.trayNumber - b.trayNumber),
        events: allEvents
          .filter((event) => event.binderId === id)
          .sort((a, b) => Date.parse(a.at) - Date.parse(b.at)),
        stages: (stages || []).sort((a, b) => a.order - b.order),
        actors: users.map(({ userId, fullName }) => ({ userId, fullName })),
      };
    });
  },

  async moveBinder(
    id: string,
    nextStageId: string,
    actingUser: User,
    actingRole: Role,
    remarks: string,
    locationId: string,
    equipmentId: string
  ): Promise<ApiResponse<{ binder: Binder; events: MovementEvent[]; durationMs: number }>> {
    return Api.call(async () => {
      const groups = await groupRepo.getAll();
      const activeRoles = rolesForUser(actingUser, groups);
      const allowedRole = actingRole === "ADMIN" || actingRole === "INITIATOR";
      if (
        actingUser.status !== "ACTIVE" ||
        !allowedRole ||
        !activeRoles.includes(actingRole) ||
        !can(actingUser, "movement.perform")
      ) {
        throw { code: "FORBIDDEN", message: "Only an authorized Admin or Initiator can move products." };
      }
      if (!remarks || remarks.trim().length < 5) {
        throw { code: "VALIDATION_ERROR", message: "Movement remarks must contain at least 5 characters." };
      }
      const [locations, equipment] = await Promise.all([locRepo.getAll(), getEquipmentCatalog()]);
      const location = locations.find((item) => item.id === locationId && item.active);
      const selectedEquipment = equipment.find((item) =>
        item.id === equipmentId && item.active && item.locationId === locationId
      );
      if (!location) throw { code: "INVALID_LOCATION", message: "Select an active movement location." };
      if (!selectedEquipment) {
        throw { code: "INVALID_EQUIPMENT", message: "Select equipment assigned to the chosen location." };
      }

      const binder = await binderRepo.getById(id);
      if (!binder) throw { code: "NOT_FOUND", message: `Binder with ID ${id} not found.` };
      if ((await trayRepo.getAll()).some((tray) => tray.binderId === id)) {
        throw { code: "TRAY_SCAN_REQUIRED", message: "Move this batch by scanning an individual tray barcode." };
      }
      if (binder.locked) {
        throw { code: "BINDER_LOCKED", message: "This product record is locked and cannot be moved." };
      }

      const stages = (await Storage.getItem<WorkflowStage[]>("workflow_stages", [])) || [];
      const currentStage = stages.find((stage) => stage.id === binder.stageId);
      const nextStage = stages.find((stage) => stage.id === nextStageId);
      if (!currentStage || !nextStage || !currentStage.nextStageIds.includes(nextStageId)) {
        throw { code: "INVALID_TRANSITION", message: "That product phase transition is not configured." };
      }
      if (actingRole === "INITIATOR" && !nextStage.allowedRoles.includes("INITIATOR")) {
        throw { code: "FORBIDDEN", message: "Initiators are not authorized for the selected destination phase." };
      }

      const at = TimeService.now();
      const allEvents = await eventRepo.getAll();
      const lastStageEntry = allEvents
        .filter((event) => event.binderId === id && event.type === "STAGE_ENTER" && event.stageId === currentStage.id)
        .sort((a, b) => Date.parse(b.at) - Date.parse(a.at))[0];
      const startedAt = Date.parse(lastStageEntry?.at || binder.updatedAt);
      const durationMs = Number.isFinite(startedAt) ? Math.max(0, Date.parse(at) - startedAt) : 0;
      const eventId = `move-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
      const exitEvent: MovementEvent = {
        id: `${eventId}-exit`,
        binderId: id,
        type: "STAGE_EXIT",
        stageId: currentStage.id,
        from: currentStage.name,
        to: nextStage.name,
        locationId: location.id,
        locationName: location.name,
        equipmentId: selectedEquipment.id,
        remarks: remarks.trim(),
        at,
        by: actingUser.userId,
        durationMs,
      };
      const enterEvent: MovementEvent = {
        id: `${eventId}-enter`,
        binderId: id,
        type: "STAGE_ENTER",
        stageId: nextStage.id,
        from: currentStage.name,
        to: nextStage.name,
        locationId: location.id,
        locationName: location.name,
        equipmentId: selectedEquipment.id,
        remarks: remarks.trim(),
        at,
        by: actingUser.userId,
      };
      const updatedBinder: Binder = {
        ...binder,
        stageId: nextStage.id,
        locationId: location.id,
        equipmentId: selectedEquipment.id,
        ...(location.type === "COLD_ROOM"
          ? { coldRoomId: location.id, areaId: undefined }
          : { areaId: location.id, coldRoomId: undefined }),
        updatedAt: at,
        version: binder.version + 1,
      };

      await binderRepo.update(id, updatedBinder);
      await eventRepo.saveAll([...allEvents, exitEvent, enterEvent]);
      await AuditService.appendEntry({
        userId: actingUser.userId,
        fullName: actingUser.fullName,
        action: "PRODUCT_STAGE_MOVED",
        entityType: "BINDER",
        entityId: id,
        oldValue: {
          stageId: currentStage.id,
          stageName: currentStage.name,
          locationId: binder.locationId,
          equipmentId: binder.equipmentId,
        },
        newValue: {
          stageId: nextStage.id,
          stageName: nextStage.name,
          durationMs,
          locationId: location.id,
          equipmentId: selectedEquipment.id,
        },
        reason: remarks.trim(),
      });

      return { binder: updatedBinder, events: [...allEvents, exitEvent, enterEvent], durationMs };
    });
  },

  async moveTray(
    trayId: string,
    nextStageId: string,
    actingUser: User,
    actingRole: Role,
    remarks: string,
    locationId: string,
    equipmentId: string
  ): Promise<ApiResponse<{ binder: Binder; tray: ProductTray; events: MovementEvent[]; durationMs: number }>> {
    return Api.call(async () => {
      const groups = await groupRepo.getAll();
      const activeRoles = rolesForUser(actingUser, groups);
      if (
        actingUser.status !== "ACTIVE" ||
        !["ADMIN", "INITIATOR"].includes(actingRole) ||
        !activeRoles.includes(actingRole) ||
        !can(actingUser, "movement.perform")
      ) {
        throw { code: "FORBIDDEN", message: "Only an authorized Admin or Initiator can move trays." };
      }
      if (!remarks || remarks.trim().length < 5) {
        throw { code: "VALIDATION_ERROR", message: "Movement remarks must contain at least 5 characters." };
      }

      const [locations, equipment] = await Promise.all([locRepo.getAll(), getEquipmentCatalog()]);
      const location = locations.find((item) => item.id === locationId && item.active);
      const selectedEquipment = equipment.find((item) =>
        item.id === equipmentId && item.active && item.locationId === locationId
      );
      if (!location) throw { code: "INVALID_LOCATION", message: "Select an active movement location." };
      if (!selectedEquipment) {
        throw { code: "INVALID_EQUIPMENT", message: "Select equipment assigned to the chosen location." };
      }

      const tray = await trayRepo.getById(trayId);
      if (!tray) throw { code: "NOT_FOUND", message: `Tray ${trayId} was not found.` };
      const binder = await binderRepo.getById(tray.binderId);
      if (!binder) throw { code: "NOT_FOUND", message: `Batch ${tray.binderId} for this tray was not found.` };
      if (binder.locked || tray.locked) {
        throw { code: "BINDER_LOCKED", message: "This batch or tray is locked and cannot be moved." };
      }

      const stages = (await Storage.getItem<WorkflowStage[]>("workflow_stages", [])) || [];
      const currentStage = stages.find((stage) => stage.id === tray.stageId);
      const nextStage = stages.find((stage) => stage.id === nextStageId);
      if (!currentStage || !nextStage || !currentStage.nextStageIds.includes(nextStageId)) {
        throw { code: "INVALID_TRANSITION", message: "That tray phase transition is not configured." };
      }
      if (actingRole === "INITIATOR" && !nextStage.allowedRoles.includes("INITIATOR")) {
        throw { code: "FORBIDDEN", message: "Initiators are not authorized for the selected destination phase." };
      }

      const at = TimeService.now();
      const allEvents = await eventRepo.getAll();
      const lastStageEntry = allEvents
        .filter((event) =>
          event.trayId === tray.id &&
          event.type === "STAGE_ENTER" &&
          event.stageId === currentStage.id
        )
        .sort((a, b) => Date.parse(b.at) - Date.parse(a.at))[0];
      const startedAt = Date.parse(lastStageEntry?.at || tray.updatedAt);
      const durationMs = Number.isFinite(startedAt) ? Math.max(0, Date.parse(at) - startedAt) : 0;
      const eventId = `tray-move-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
      const movementEvents: MovementEvent[] = [
        {
          id: `${eventId}-exit`,
          binderId: binder.id,
          trayId: tray.id,
          type: "STAGE_EXIT",
          stageId: currentStage.id,
          from: currentStage.name,
          to: nextStage.name,
          locationId: location.id,
          locationName: location.name,
          equipmentId: selectedEquipment.id,
          remarks: remarks.trim(),
          at,
          by: actingUser.userId,
          durationMs,
        },
        {
          id: `${eventId}-enter`,
          binderId: binder.id,
          trayId: tray.id,
          type: "STAGE_ENTER",
          stageId: nextStage.id,
          from: currentStage.name,
          to: nextStage.name,
          locationId: location.id,
          locationName: location.name,
          equipmentId: selectedEquipment.id,
          remarks: remarks.trim(),
          at,
          by: actingUser.userId,
        },
      ];
      const updatedTray: ProductTray = {
        ...tray,
        stageId: nextStage.id,
        locationId: location.id,
        equipmentId: selectedEquipment.id,
        updatedAt: at,
        version: tray.version + 1,
      };
      const updatedBinder: Binder = {
        ...binder,
        updatedAt: at,
        version: binder.version + 1,
      };

      const persistedTray = await trayRepo.update(tray.id, updatedTray);
      if (!persistedTray) {
        throw { code: "PERSISTENCE_ERROR", message: "The tray movement could not be saved." };
      }
      await binderRepo.update(binder.id, updatedBinder);
      await eventRepo.saveAll([...allEvents, ...movementEvents]);
      await AuditService.appendEntry({
        userId: actingUser.userId,
        fullName: actingUser.fullName,
        action: "TRAY_STAGE_MOVED",
        entityType: "TRAY",
        entityId: tray.id,
        oldValue: {
          trayNumber: tray.trayNumber,
          stageId: currentStage.id,
          locationId: tray.locationId,
          equipmentId: tray.equipmentId,
        },
        newValue: {
          trayNumber: tray.trayNumber,
          stageId: nextStage.id,
          durationMs,
          locationId: location.id,
          equipmentId: selectedEquipment.id,
        },
        reason: remarks.trim(),
      });

      return { binder: updatedBinder, tray: updatedTray, events: [...allEvents, ...movementEvents], durationMs };
    });
  },

  async issueBinderBarcode(
    id: string,
    actingUser: User,
    reason: string
  ): Promise<ApiResponse<{ binder: Binder }>> {
    return Api.call(async () => {
      if (!can(actingUser, "barcode.manage")) {
        throw { code: "FORBIDDEN", message: "barcode.manage permission required to issue product labels." };
      }
      if (!reason || reason.trim().length < 5) {
        throw { code: "VALIDATION_ERROR", message: "A reason of at least 5 characters is required." };
      }

      const binder = await binderRepo.getById(id);
      if (!binder) throw { code: "NOT_FOUND", message: `Binder with ID ${id} not found.` };
      if (binder.barcode) {
        throw { code: "BARCODE_ALREADY_ISSUED", message: `Product label ${binder.barcode} has already been issued.` };
      }

      const formats = (await Storage.getItem<BarcodeFormat[]>("barcode_formats", SEED_BARCODE_FORMATS)) || SEED_BARCODE_FORMATS;
      const format = formats.find((item) => item.entity === "BINDER") || SEED_BARCODE_FORMATS.find((item) => item.entity === "BINDER")!;
      const [binders, racks, pallets, locations] = await Promise.all([
        binderRepo.getAll(),
        rackRepo.getAll(),
        palletRepo.getAll(),
        locRepo.getAll(),
      ]);
      const existingCodes = new Set<string>([
        ...binders.flatMap((item) =>
          [item.id, item.barcode, item.lotNo, item.batchNo, ...(item.unitBarcodes || [])]
            .filter((value): value is string => Boolean(value))),
        ...racks.flatMap((item) => [item.id, item.code, item.barcode]),
        ...pallets.flatMap((item) => [item.id, item.code, item.barcode]),
        ...locations.map((item) => item.code),
      ]);
      const counters = (await Storage.getItem<Record<string, number>>("barcode_seq_counters", { RACK: 6, PALLET: 112, BINDER: 6 })) || { RACK: 6, PALLET: 112, BINDER: 6 };
      const startSeq = (counters.BINDER || 0) + 1;
      const generated = generateUniqueBarcodeBatch(format, 1, startSeq, existingCodes);
      const barcode = generated.barcodes[0];
      const updatedBinder = { ...binder, barcode };

      await binderRepo.update(id, updatedBinder);
      counters.BINDER = generated.finalSeq - 1;
      await Storage.setItem("barcode_seq_counters", counters);
      await AuditService.appendEntry({
        userId: actingUser.userId,
        fullName: actingUser.fullName,
        action: "PRODUCT_BARCODE_ISSUED",
        entityType: "BINDER",
        entityId: id,
        newValue: { barcode },
        reason: reason.trim(),
      });

      return { binder: updatedBinder };
    });
  },

  async issueTrayBarcodes(
    id: string,
    trayCount: number,
    actingUser: User,
    reason: string
  ): Promise<ApiResponse<{ binder: Binder; trays: ProductTray[] }>> {
    return Api.call(async () => {
      if (
        actingUser.status !== "ACTIVE" ||
        (!can(actingUser, "binder.create") && !can(actingUser, "barcode.manage"))
      ) {
        throw { code: "FORBIDDEN", message: "Batch creation or barcode management permission is required." };
      }
      if (!reason || reason.trim().length < 5) {
        throw { code: "VALIDATION_ERROR", message: "A reason of at least 5 characters is required." };
      }
      if (!Number.isSafeInteger(trayCount) || trayCount < 1 || trayCount > MAX_TRAYS_PER_BATCH) {
        throw {
          code: "INVALID_TRAY_COUNT",
          message: `Tray count must be a whole number between 1 and ${MAX_TRAYS_PER_BATCH}.`,
        };
      }

      const binder = await binderRepo.getById(id);
      if (!binder) throw { code: "NOT_FOUND", message: `Binder with ID ${id} not found.` };
      if (binder.locked) {
        throw { code: "BINDER_LOCKED", message: "This product record is locked and cannot be assigned trays." };
      }
      if (binder.trayCount !== undefined && binder.trayCount !== trayCount) {
        throw {
          code: "TRAY_COUNT_MISMATCH",
          message: `This batch was recorded with ${binder.trayCount} trays. The tray count cannot be changed after batch creation.`,
        };
      }

      const currentTrays = await trayRepo.getAll();
      if (currentTrays.some((tray) => tray.binderId === id)) {
        throw { code: "TRAYS_ALREADY_ISSUED", message: "Tray labels have already been issued for this batch." };
      }
      const stageList = (await Storage.getItem<WorkflowStage[]>("workflow_stages", [])) || [];
      const currentStage = stageList.find((stage) => stage.id === binder.stageId);
      if (!currentStage) {
        throw { code: "WORKFLOW_NOT_CONFIGURED", message: "The batch current phase is not configured." };
      }

      const formats = (await Storage.getItem<BarcodeFormat[]>("barcode_formats", SEED_BARCODE_FORMATS)) || SEED_BARCODE_FORMATS;
      const format = formats.find((item) => item.entity === "BINDER") || SEED_BARCODE_FORMATS.find((item) => item.entity === "BINDER")!;
      const [binders, racks, pallets, locations] = await Promise.all([
        binderRepo.getAll(),
        rackRepo.getAll(),
        palletRepo.getAll(),
        locRepo.getAll(),
      ]);
      const existingCodes = new Set<string>([
        ...binders.flatMap((item) =>
          [item.id, item.barcode, item.lotNo, item.batchNo, ...(item.unitBarcodes || [])]
            .filter((value): value is string => Boolean(value))),
        ...currentTrays.map((tray) => tray.barcode),
        ...racks.flatMap((item) => [item.id, item.code, item.barcode]),
        ...pallets.flatMap((item) => [item.id, item.code, item.barcode]),
        ...locations.map((item) => item.code),
      ]);
      const counters = (await Storage.getItem<Record<string, number>>("barcode_seq_counters", {
        RACK: 6,
        PALLET: 112,
        BINDER: 6,
      })) || { RACK: 6, PALLET: 112, BINDER: 6 };
      const generated = generateUniqueBarcodeBatch(
        format,
        trayCount,
        (counters.BINDER || 0) + 1,
        existingCodes
      );
      const at = TimeService.now();
      const locationId = binder.locationId || binder.coldRoomId || binder.areaId;
      const location = locations.find((item) => item.id === locationId);
      const issuedTrays: ProductTray[] = generated.barcodes.map((barcode, index) => ({
        id: `${binder.id}-tray-${String(index + 1).padStart(4, "0")}`,
        binderId: binder.id,
        trayNumber: index + 1,
        barcode,
        stageId: binder.stageId,
        locationId,
        equipmentId: binder.equipmentId,
        createdAt: at,
        updatedAt: at,
        version: 1,
        locked: false,
      }));
      const trackingStartRemark =
        "Tray-level tracking started when tray labels were issued; earlier tray movement history is unavailable.";
      const initialEvents: MovementEvent[] = issuedTrays.map((tray) => ({
        id: `${tray.id}-stage-enter`,
        binderId: binder.id,
        trayId: tray.id,
        type: "STAGE_ENTER",
        stageId: currentStage.id,
        to: currentStage.name,
        locationId,
        locationName: location?.name,
        equipmentId: binder.equipmentId,
        remarks: trackingStartRemark,
        at,
        by: actingUser.userId,
      }));
      const updatedBinder = {
        ...binder,
        trayCount,
        updatedAt: at,
        version: binder.version + 1,
      };
      const persistedBinder = await binderRepo.update(id, updatedBinder);
      if (!persistedBinder) {
        throw { code: "PERSISTENCE_ERROR", message: "The tray count could not be saved to this batch." };
      }
      await trayRepo.saveAll([...currentTrays, ...issuedTrays]);
      await eventRepo.saveAll([...(await eventRepo.getAll()), ...initialEvents]);
      counters.BINDER = generated.finalSeq - 1;
      await Storage.setItem("barcode_seq_counters", counters);
      await AuditService.appendEntry({
        userId: actingUser.userId,
        fullName: actingUser.fullName,
        action: "TRAY_BARCODES_ISSUED",
        entityType: "BINDER",
        entityId: id,
        newValue: {
          trayCount,
          firstBarcode: issuedTrays[0].barcode,
          lastBarcode: issuedTrays[issuedTrays.length - 1].barcode,
        },
        reason: reason.trim(),
      });

      return { binder: updatedBinder, trays: issuedTrays };
    });
  },

  // --- Masters Endpoints (SPEC §9 & Phase 4 S20) ---
  async getMasters(): Promise<
    ApiResponse<{
      departments: Department[];
      locations: Location[];
      racks: Rack[];
      pallets: Pallet[];
    }>
  > {
    return Api.call(async () => {
      const [departments, locations, racks, pallets] = await Promise.all([
        deptRepo.getAll(),
        locRepo.getAll(),
        rackRepo.getAll(),
        palletRepo.getAll(),
      ]);
      return { departments, locations, racks, pallets };
    });
  },

  async getMasterEntities<T = any>(
    type: "departments" | "locations" | "racks" | "pallets"
  ): Promise<ApiResponse<T[]>> {
    return Api.call(async () => {
      switch (type) {
        case "departments":
          return (await deptRepo.getAll()) as unknown as T[];
        case "locations":
          return (await locRepo.getAll()) as unknown as T[];
        case "racks":
          return (await rackRepo.getAll()) as unknown as T[];
        case "pallets":
          return (await palletRepo.getAll()) as unknown as T[];
        default:
          throw { code: "INVALID_ENTITY_TYPE", message: `Unknown master entity type: ${type}` };
      }
    });
  },

  async createMasterEntity(
    type: "departments" | "locations" | "racks" | "pallets",
    payload: any,
    actingUser: User,
    reason: string
  ): Promise<ApiResponse<{ entity: any }>> {
    return Api.call(async () => {
      if (!can(actingUser, "master.manage")) {
        throw { code: "FORBIDDEN", message: "Access Denied: master.manage permission required." };
      }
      if (!reason || reason.trim().length < 5) {
        throw { code: "VALIDATION_ERROR", message: "Mandatory regulatory Reason for Change must be provided." };
      }
      if (!payload.code || !payload.code.trim()) {
        throw { code: "VALIDATION_ERROR", message: "Entity Code is required and cannot be empty." };
      }

      const cleanCode = payload.code.trim().toUpperCase();

      if (type === "departments") {
        const existing = await deptRepo.getAll();
        if (existing.some((d) => d.code.toUpperCase() === cleanCode)) {
          throw { code: "DUPLICATE_CODE", message: `Department code "${cleanCode}" already exists.` };
        }
        const newDept: Department = {
          id: payload.id || `dept-${cleanCode.toLowerCase()}`,
          code: cleanCode,
          name: payload.name.trim(),
          active: payload.active !== undefined ? payload.active : true,
        };
        await deptRepo.add(newDept);
        await AuditService.appendEntry({
          userId: actingUser.userId,
          fullName: actingUser.fullName,
          action: "CREATE",
          entityType: "DEPARTMENT",
          entityId: newDept.id,
          reason,
          newValue: newDept,
        });
        return { entity: newDept };
      }

      if (type === "locations") {
        const existing = await locRepo.getAll();
        if (existing.some((l) => l.code.toUpperCase() === cleanCode)) {
          throw { code: "DUPLICATE_CODE", message: `Location code "${cleanCode}" already exists.` };
        }
        const newLoc: Location = {
          id: payload.id || `loc-${cleanCode.toLowerCase().replace(/[^a-z0-9]/g, "-")}`,
          code: cleanCode,
          name: payload.name.trim(),
          type: payload.type || "COLD_ROOM",
          departmentId: payload.departmentId,
          active: payload.active !== undefined ? payload.active : true,
        };
        await locRepo.add(newLoc);
        await AuditService.appendEntry({
          userId: actingUser.userId,
          fullName: actingUser.fullName,
          action: "CREATE",
          entityType: "LOCATION",
          entityId: newLoc.id,
          reason,
          newValue: newLoc,
        });
        return { entity: newLoc };
      }

      if (type === "racks") {
        const existing = await rackRepo.getAll();
        if (existing.some((r) => r.code.toUpperCase() === cleanCode)) {
          throw { code: "DUPLICATE_CODE", message: `Rack code "${cleanCode}" already exists.` };
        }
        let barcode = payload.barcode ? payload.barcode.trim() : "";
        if (!barcode) {
          // Auto-generate barcode using active RACK format
          const formats = (await Storage.getItem<BarcodeFormat[]>("barcode_formats", SEED_BARCODE_FORMATS)) || SEED_BARCODE_FORMATS;
          const rackFormat = formats.find((f) => f.entity === "RACK") || SEED_BARCODE_FORMATS[0];
          const allRacks = await rackRepo.getAll();
          const existingCodes = new Set(allRacks.map((r) => r.barcode));
          const seq = existing.length + 1;
          const gen = generateUniqueBarcodeBatch(rackFormat, 1, seq, existingCodes, { locationCode: payload.coldRoomId });
          barcode = gen.barcodes[0] || cleanCode;
        } else if (existing.some((r) => r.barcode === barcode)) {
          throw { code: "DUPLICATE_BARCODE", message: `Barcode "${barcode}" is already assigned to another rack.` };
        }

        const newRack: Rack = {
          id: payload.id || `rk-${cleanCode.toLowerCase().replace(/[^a-z0-9]/g, "-")}`,
          code: cleanCode,
          barcode,
          coldRoomId: payload.coldRoomId || "cr-01",
          active: payload.active !== undefined ? payload.active : true,
        };
        await rackRepo.add(newRack);
        await AuditService.appendEntry({
          userId: actingUser.userId,
          fullName: actingUser.fullName,
          action: "CREATE",
          entityType: "RACK",
          entityId: newRack.id,
          reason,
          newValue: newRack,
        });
        return { entity: newRack };
      }

      if (type === "pallets") {
        const existing = await palletRepo.getAll();
        if (existing.some((p) => p.code.toUpperCase() === cleanCode)) {
          throw { code: "DUPLICATE_CODE", message: `Pallet code "${cleanCode}" already exists.` };
        }
        let barcode = payload.barcode ? payload.barcode.trim() : "";
        if (!barcode) {
          // Auto-generate barcode using active PALLET format
          const formats = (await Storage.getItem<BarcodeFormat[]>("barcode_formats", SEED_BARCODE_FORMATS)) || SEED_BARCODE_FORMATS;
          const palletFormat = formats.find((f) => f.entity === "PALLET") || SEED_BARCODE_FORMATS[1];
          const existingCodes = new Set(existing.map((p) => p.barcode));
          const seq = existing.length + 101;
          const gen = generateUniqueBarcodeBatch(palletFormat, 1, seq, existingCodes);
          barcode = gen.barcodes[0] || cleanCode;
        } else if (existing.some((p) => p.barcode === barcode)) {
          throw { code: "DUPLICATE_BARCODE", message: `Barcode "${barcode}" is already assigned to another pallet.` };
        }

        const newPallet: Pallet = {
          id: payload.id || `pl-${cleanCode.toLowerCase().replace(/[^a-z0-9]/g, "-")}`,
          code: cleanCode,
          barcode,
          rackId: payload.rackId || undefined,
          active: payload.active !== undefined ? payload.active : true,
        };
        await palletRepo.add(newPallet);
        await AuditService.appendEntry({
          userId: actingUser.userId,
          fullName: actingUser.fullName,
          action: "CREATE",
          entityType: "PALLET",
          entityId: newPallet.id,
          reason,
          newValue: newPallet,
        });
        return { entity: newPallet };
      }

      throw { code: "INVALID_ENTITY_TYPE", message: `Unknown master entity type: ${type}` };
    });
  },

  async updateMasterEntity(
    type: "departments" | "locations" | "racks" | "pallets",
    id: string,
    updates: any,
    actingUser: User,
    reason: string
  ): Promise<ApiResponse<{ entity: any }>> {
    return Api.call(async () => {
      if (!can(actingUser, "master.manage")) {
        throw { code: "FORBIDDEN", message: "Access Denied: master.manage permission required." };
      }
      if (!reason || reason.trim().length < 5) {
        throw { code: "VALIDATION_ERROR", message: "Mandatory regulatory Reason for Change must be provided." };
      }

      let repo: EntityRepository<any>;
      switch (type) {
        case "departments": repo = deptRepo; break;
        case "locations": repo = locRepo; break;
        case "racks": repo = rackRepo; break;
        case "pallets": repo = palletRepo; break;
        default: throw { code: "INVALID_ENTITY_TYPE", message: `Unknown master entity type: ${type}` };
      }

      const entity = await repo.getById(id);
      if (!entity) throw { code: "NOT_FOUND", message: `${type} with ID ${id} not found.` };

      const oldVal = { ...entity };

      // Validate code uniqueness if changing code
      if (updates.code && updates.code.toUpperCase() !== entity.code.toUpperCase()) {
        const all = await repo.getAll();
        if (all.some((item) => item.id !== id && item.code.toUpperCase() === updates.code.toUpperCase())) {
          throw { code: "DUPLICATE_CODE", message: `Code "${updates.code}" is already in use by another record.` };
        }
      }

      // Barcode uniqueness check for rack or pallet
      if (updates.barcode && updates.barcode !== entity.barcode) {
        const all = await repo.getAll();
        if (all.some((item) => item.id !== id && item.barcode === updates.barcode)) {
          throw { code: "DUPLICATE_BARCODE", message: `Barcode "${updates.barcode}" is already assigned to another record.` };
        }
      }

      const updated = await repo.update(id, updates);

      await AuditService.appendEntry({
        userId: actingUser.userId,
        fullName: actingUser.fullName,
        action: "MODIFY",
        entityType: type.toUpperCase(),
        entityId: id,
        oldValue: oldVal,
        newValue: updated,
        reason,
      });

      return { entity: updated };
    });
  },

  async activateMasterEntity(
    type: "departments" | "locations" | "racks" | "pallets",
    id: string,
    actingUser: User,
    reason: string
  ): Promise<ApiResponse<{ entity: any }>> {
    return mockApi.updateMasterEntity(type, id, { active: true }, actingUser, reason);
  },

  async deactivateMasterEntity(
    type: "departments" | "locations" | "racks" | "pallets",
    id: string,
    actingUser: User,
    reason: string
  ): Promise<ApiResponse<{ entity: any }>> {
    return mockApi.updateMasterEntity(type, id, { active: false }, actingUser, reason);
  },

  // --- Barcode Designer & Resolution Endpoints (SPEC R10 & S21) ---
  async getBarcodeFormats(): Promise<ApiResponse<BarcodeFormat[]>> {
    return Api.call(async () => {
      const formats = await Storage.getItem<BarcodeFormat[]>("barcode_formats", SEED_BARCODE_FORMATS);
      return formats || SEED_BARCODE_FORMATS;
    });
  },

  async updateBarcodeFormats(
    formats: BarcodeFormat[],
    actingUser: User,
    reason: string
  ): Promise<ApiResponse<{ formats: BarcodeFormat[] }>> {
    return Api.call(async () => {
      if (!can(actingUser, "barcode.manage")) {
        throw { code: "FORBIDDEN", message: "Access Denied: barcode.manage permission required." };
      }
      if (!reason || reason.trim().length < 5) {
        throw { code: "VALIDATION_ERROR", message: "Mandatory regulatory Reason for Change must be provided." };
      }

      const oldFormats = (await Storage.getItem<BarcodeFormat[]>("barcode_formats", SEED_BARCODE_FORMATS)) || SEED_BARCODE_FORMATS;
      await Storage.setItem("barcode_formats", formats);

      // Note: Changing format does NOT alter already issued rack, pallet, or binder barcodes (R10)
      await AuditService.appendEntry({
        userId: actingUser.userId,
        fullName: actingUser.fullName,
        action: "BARCODE_CONFIG",
        entityType: "CONFIG",
        entityId: "BARCODE_FORMATS",
        oldValue: oldFormats,
        newValue: formats,
        reason,
      });

      return { formats };
    });
  },

  async generateBarcodes(
    entity: "RACK" | "PALLET" | "BINDER",
    count: number = 1,
    context?: { locationCode?: string; deptCode?: string },
    actingUser?: User,
    reason?: string
  ): Promise<ApiResponse<{ barcodes: string[]; entity: string }>> {
    return Api.call(async () => {
      const formats = (await Storage.getItem<BarcodeFormat[]>("barcode_formats", SEED_BARCODE_FORMATS)) || SEED_BARCODE_FORMATS;
      const format = formats.find((f) => f.entity === entity) || SEED_BARCODE_FORMATS.find((f) => f.entity === entity) || SEED_BARCODE_FORMATS[0];

      // Gather all existing barcodes across racks, pallets, and binders to guarantee zero duplicates
      const [racks, pallets, binders, trays] = await Promise.all([
        rackRepo.getAll(),
        palletRepo.getAll(),
        binderRepo.getAll(),
        trayRepo.getAll(),
      ]);

      const existingCodes = new Set<string>();
      racks.forEach((r) => { if (r.barcode) existingCodes.add(r.barcode); });
      pallets.forEach((p) => { if (p.barcode) existingCodes.add(p.barcode); });
      binders.forEach((b) => {
        [b.id, b.barcode, b.lotNo, b.batchNo, ...(b.unitBarcodes || [])].forEach((value) => {
          if (value) existingCodes.add(value);
        });
      });
      trays.forEach((tray) => existingCodes.add(tray.barcode));

      // Retrieve sequence counter
      const counters = (await Storage.getItem<Record<string, number>>("barcode_seq_counters", { RACK: 6, PALLET: 112, BINDER: 6 })) || { RACK: 6, PALLET: 112, BINDER: 6 };
      let startSeq = (counters[entity] || 0) + 1;

      const { barcodes, finalSeq } = generateUniqueBarcodeBatch(
        format,
        count,
        startSeq,
        existingCodes,
        context
      );

      counters[entity] = finalSeq - 1;
      await Storage.setItem("barcode_seq_counters", counters);

      if (actingUser && reason) {
        await AuditService.appendEntry({
          userId: actingUser.userId,
          fullName: actingUser.fullName,
          action: "BARCODE_GENERATION",
          entityType: entity,
          entityId: barcodes[0] || "BATCH",
          reason,
          newValue: { count, barcodes },
        });
      }

      return { barcodes, entity };
    });
  },

  async resolveBarcode(code: string): Promise<
    ApiResponse<{
      found: boolean;
      entityType?: "PALLET" | "RACK" | "LOCATION" | "BINDER" | "TRAY";
      entity?: any;
      details?: string;
    }>
  > {
    return Api.call(async () => {
      const q = (code || "").trim();
      if (!q) {
        return { found: false };
      }

      const [pallets, racks, locations, binders, trays] = await Promise.all([
        palletRepo.getAll(),
        rackRepo.getAll(),
        locRepo.getAll(),
        binderRepo.getAll(),
        trayRepo.getAll(),
      ]);

      // 1. Pallet search
      const pallet = pallets.find(
        (p) => p.barcode.toLowerCase() === q.toLowerCase() || p.code.toLowerCase() === q.toLowerCase()
      );
      if (pallet) {
        return {
          found: true,
          entityType: "PALLET",
          entity: pallet,
          details: `Pallet ${pallet.code} (Status: ${pallet.active ? "ACTIVE" : "INACTIVE"})`,
        };
      }

      // 2. Rack search
      const rack = racks.find(
        (r) => r.barcode.toLowerCase() === q.toLowerCase() || r.code.toLowerCase() === q.toLowerCase()
      );
      if (rack) {
        return {
          found: true,
          entityType: "RACK",
          entity: rack,
          details: `Rack ${rack.code} in Chamber ${rack.coldRoomId}`,
        };
      }

      // 3. Location search
      const location = locations.find((l) => l.code.toLowerCase() === q.toLowerCase());
      if (location) {
        return {
          found: true,
          entityType: "LOCATION",
          entity: location,
          details: `${location.name} (${location.type})`,
        };
      }

      const tray = trays.find((item) => item.barcode.toLowerCase() === q.toLowerCase());
      if (tray) {
        const binder = binders.find((item) => item.id === tray.binderId);
        return {
          found: true,
          entityType: "TRAY",
          entity: tray,
          details: `${binder?.productName || "Product"} — Batch ${binder?.batchNo || tray.binderId} · Tray ${tray.trayNumber} of ${binder?.trayCount || "?"}`,
        };
      }

      // 4. Binder search
      const binder = binders.find(
        (b) =>
          b.id.toLowerCase() === q.toLowerCase() ||
          b.barcode?.toLowerCase() === q.toLowerCase() ||
          b.unitBarcodes?.some((barcode) => barcode.toLowerCase() === q.toLowerCase()) ||
          b.lotNo.toLowerCase() === q.toLowerCase() ||
          b.batchNo.toLowerCase() === q.toLowerCase()
      );
      if (binder) {
        return {
          found: true,
          entityType: "BINDER",
          entity: binder,
          details: `${binder.productName} — Lot: ${binder.lotNo} / Batch: ${binder.batchNo}`,
        };
      }

      return { found: false };
    });
  },

  async reprintBarcode(
    id: string,
    entityType: "RACK" | "PALLET" | "BINDER",
    labelSize: "50x25" | "100x50",
    actingUser: User,
    reason: string
  ): Promise<ApiResponse<{ reprinted: boolean; entityId: string; labelSize: string }>> {
    return Api.call(async () => {
      if (!reason || reason.trim().length < 5) {
        throw { code: "VALIDATION_ERROR", message: "Mandatory regulatory Reason for Reprint must be provided." };
      }

      await AuditService.appendEntry({
        userId: actingUser.userId,
        fullName: actingUser.fullName,
        action: "BARCODE_REPRINT",
        entityType,
        entityId: id,
        reason,
        field: "labelPrint",
        newValue: { labelSize, timestamp: TimeService.now() },
      });

      return { reprinted: true, entityId: id, labelSize };
    });
  },

  // --- Users & Groups Endpoints (SPEC §9 & Phase 3) ---
  async getUsers(): Promise<ApiResponse<User[]>> {
    return Api.call(async () => {
      return userRepo.getAll();
    });
  },

  async createUser(
    payload: {
      userId: string;
      fullName: string;
      departmentId: string;
      groupIds: string[];
      eSignMeanings?: any[];
      password?: string;
    },
    actingUser: User,
    reason: string
  ): Promise<ApiResponse<{ user: User }>> {
    return Api.call(async () => {
      if (!can(actingUser, "user.manage")) {
        throw { code: "FORBIDDEN", message: "Access Denied: user.manage permission required to provision users." };
      }
      if (!reason || reason.trim().length < 5) {
        throw { code: "VALIDATION_ERROR", message: "Mandatory regulatory Reason for Change must be provided." };
      }
      if (!payload.userId || !payload.fullName || !payload.departmentId || !payload.groupIds?.length) {
        throw { code: "VALIDATION_ERROR", message: "User ID, Full Name, Department, and at least one Group are required." };
      }

      const cleanUserId = payload.userId.trim();
      const allUsers = await userRepo.getAll();
      const existing = allUsers.find(
        (u) => u.userId.toLowerCase() === cleanUserId.toLowerCase()
      );
      if (existing) {
        throw {
          code: "DUPLICATE_USER_ID",
          message: `User ID "${cleanUserId}" is already in use or permanently retired. Under 21 CFR §11.10(d), User IDs can never be reused.`,
        };
      }

      const initialPassword = payload.password || "Demo@1234";
      const { hash: passwordHash, salt } = await hashPassword(initialPassword);
      const nowIso = TimeService.now();

      const newUser: User = {
        id: `u-${cleanUserId.toLowerCase()}`,
        userId: cleanUserId,
        fullName: payload.fullName.trim(),
        departmentId: payload.departmentId,
        groupIds: payload.groupIds,
        eSignMeanings: payload.eSignMeanings || [],
        status: "ACTIVE",
        failedAttempts: 0,
        mustChangePassword: true,
        passwordHash,
        salt,
        passwordHistory: [passwordHash],
        passwordChangedAt: nowIso,
      };

      await userRepo.add(newUser);

      await AuditService.appendEntry({
        userId: actingUser.userId,
        fullName: actingUser.fullName,
        action: "USER_MANAGEMENT",
        entityType: "USER",
        entityId: newUser.id,
        reason,
        newValue: {
          userId: newUser.userId,
          fullName: newUser.fullName,
          departmentId: newUser.departmentId,
          groupIds: newUser.groupIds,
          eSignMeanings: newUser.eSignMeanings,
          status: newUser.status,
        },
      });

      return { user: newUser };
    });
  },

  async updateUser(
    id: string,
    updates: Partial<User>,
    actingUser: User,
    reason: string
  ): Promise<ApiResponse<{ user: User }>> {
    return Api.call(async () => {
      if (!can(actingUser, "user.manage")) {
        throw { code: "FORBIDDEN", message: "Access Denied: user.manage permission required." };
      }
      if (!reason || reason.trim().length < 5) {
        throw { code: "VALIDATION_ERROR", message: "Mandatory regulatory Reason for Change must be provided." };
      }
      const user = await userRepo.getById(id);
      if (!user) throw { code: "NOT_FOUND", message: `User with ID ${id} not found.` };

      if (updates.userId && updates.userId.toLowerCase() !== user.userId.toLowerCase()) {
        throw { code: "IMMUTABLE_FIELD", message: "User ID is immutable after creation and cannot be modified." };
      }

      const oldState = {
        fullName: user.fullName,
        departmentId: user.departmentId,
        groupIds: [...user.groupIds],
        eSignMeanings: [...user.eSignMeanings],
        status: user.status,
      };

      if (updates.fullName !== undefined) user.fullName = updates.fullName.trim();
      if (updates.departmentId !== undefined) user.departmentId = updates.departmentId;
      if (updates.groupIds !== undefined) user.groupIds = updates.groupIds;
      if (updates.eSignMeanings !== undefined) user.eSignMeanings = updates.eSignMeanings;
      if (updates.status !== undefined) user.status = updates.status;

      const newState = {
        fullName: user.fullName,
        departmentId: user.departmentId,
        groupIds: user.groupIds,
        eSignMeanings: user.eSignMeanings,
        status: user.status,
      };

      await userRepo.update(id, user);

      await AuditService.appendEntry({
        userId: actingUser.userId,
        fullName: actingUser.fullName,
        action: "USER_MANAGEMENT",
        entityType: "USER",
        entityId: user.id,
        field: "profile",
        oldValue: oldState,
        newValue: newState,
        reason,
      });

      return { user };
    });
  },

  async lockUser(id: string, actingUser: User, reason: string): Promise<ApiResponse<{ user: User }>> {
    return Api.call(async () => {
      if (!can(actingUser, "user.manage")) {
        throw { code: "FORBIDDEN", message: "Access Denied: user.manage permission required." };
      }
      if (!reason || reason.trim().length < 5) {
        throw { code: "VALIDATION_ERROR", message: "Mandatory regulatory Reason must be provided." };
      }
      const user = await userRepo.getById(id);
      if (!user) throw { code: "NOT_FOUND", message: `User ${id} not found.` };

      const oldStatus = user.status;
      user.status = "LOCKED";
      await userRepo.update(id, user);

      await AuditService.appendEntry({
        userId: actingUser.userId,
        fullName: actingUser.fullName,
        action: "ACCOUNT_LOCKED",
        entityType: "USER",
        entityId: user.id,
        field: "status",
        oldValue: oldStatus,
        newValue: "LOCKED",
        reason,
      });

      return { user };
    });
  },

  async unlockUser(id: string, actingUser: User, reason: string): Promise<ApiResponse<{ user: User }>> {
    return Api.call(async () => {
      if (!can(actingUser, "user.manage")) {
        throw { code: "FORBIDDEN", message: "Access Denied: user.manage permission required." };
      }
      if (!reason || reason.trim().length < 5) {
        throw { code: "VALIDATION_ERROR", message: "Mandatory regulatory Reason must be provided." };
      }
      const user = await userRepo.getById(id);
      if (!user) throw { code: "NOT_FOUND", message: `User ${id} not found.` };

      const oldStatus = user.status;
      user.status = "ACTIVE";
      user.failedAttempts = 0;
      await userRepo.update(id, user);

      await AuditService.appendEntry({
        userId: actingUser.userId,
        fullName: actingUser.fullName,
        action: "ACCOUNT_UNLOCKED",
        entityType: "USER",
        entityId: user.id,
        field: "status",
        oldValue: oldStatus,
        newValue: "ACTIVE",
        reason,
      });

      return { user };
    });
  },

  async deactivateUser(id: string, actingUser: User, reason: string): Promise<ApiResponse<{ user: User }>> {
    return Api.call(async () => {
      if (!can(actingUser, "user.manage")) {
        throw { code: "FORBIDDEN", message: "Access Denied: user.manage permission required." };
      }
      if (!reason || reason.trim().length < 5) {
        throw { code: "VALIDATION_ERROR", message: "Mandatory regulatory Reason must be provided." };
      }
      const user = await userRepo.getById(id);
      if (!user) throw { code: "NOT_FOUND", message: `User ${id} not found.` };

      const oldStatus = user.status;
      user.status = "DEACTIVATED";
      await userRepo.update(id, user);

      await AuditService.appendEntry({
        userId: actingUser.userId,
        fullName: actingUser.fullName,
        action: "USER_MANAGEMENT",
        entityType: "USER",
        entityId: user.id,
        field: "status",
        oldValue: oldStatus,
        newValue: "DEACTIVATED",
        reason,
      });

      return { user };
    });
  },

  async reactivateUser(id: string, actingUser: User, reason: string): Promise<ApiResponse<{ user: User }>> {
    return Api.call(async () => {
      if (!can(actingUser, "user.manage")) {
        throw { code: "FORBIDDEN", message: "Access Denied: user.manage permission required." };
      }
      if (!reason || reason.trim().length < 5) {
        throw { code: "VALIDATION_ERROR", message: "Mandatory regulatory Reason must be provided." };
      }
      const user = await userRepo.getById(id);
      if (!user) throw { code: "NOT_FOUND", message: `User ${id} not found.` };

      const oldStatus = user.status;
      user.status = "ACTIVE";
      await userRepo.update(id, user);

      await AuditService.appendEntry({
        userId: actingUser.userId,
        fullName: actingUser.fullName,
        action: "USER_MANAGEMENT",
        entityType: "USER",
        entityId: user.id,
        field: "status",
        oldValue: oldStatus,
        newValue: "ACTIVE",
        reason,
      });

      return { user };
    });
  },

  async resetUserPassword(
    id: string,
    actingUser: User,
    reason: string
  ): Promise<ApiResponse<{ temporaryPassword: string; user: User }>> {
    return Api.call(async () => {
      if (!can(actingUser, "user.manage")) {
        throw { code: "FORBIDDEN", message: "Access Denied: Only Administrator accounts can reset user credentials." };
      }
      if (!reason || reason.trim().length < 5) {
        throw { code: "VALIDATION_ERROR", message: "Mandatory regulatory Reason for password reset must be documented." };
      }
      const user = await userRepo.getById(id);
      if (!user) throw { code: "NOT_FOUND", message: `User ${id} not found.` };

      // Generate compliant temporary password (Upper, lower, number, special, >= 8 chars)
      const randomSuffix = Math.floor(100000 + Math.random() * 900000);
      const temporaryPassword = `Temp#${randomSuffix}`;
      const { hash, salt } = await hashPassword(temporaryPassword);

      user.passwordHash = hash;
      user.salt = salt;
      user.mustChangePassword = true;
      user.passwordChangedAt = TimeService.now();
      user.passwordHistory = [...(user.passwordHistory || []), hash];
      user.failedAttempts = 0;

      await userRepo.update(id, user);

      await AuditService.appendEntry({
        userId: actingUser.userId,
        fullName: actingUser.fullName,
        action: "PASSWORD_CHANGE",
        entityType: "CREDENTIAL",
        entityId: user.id,
        field: "passwordHash",
        oldValue: "[ENCRYPTED_PREVIOUS]",
        newValue: "[ENCRYPTED_TEMPORARY]",
        reason,
      });

      return { temporaryPassword, user };
    });
  },

  // --- Groups & Permissions Endpoints ---
  async getGroups(): Promise<ApiResponse<Group[]>> {
    return Api.call(async () => {
      return groupRepo.getAll();
    });
  },

  async createGroup(
    groupData: Partial<Group>,
    actingUser: User,
    reason: string
  ): Promise<ApiResponse<{ group: Group }>> {
    return Api.call(async () => {
      if (!can(actingUser, "group.manage")) {
        throw { code: "FORBIDDEN", message: "Access Denied: group.manage permission required." };
      }
      if (!reason || reason.trim().length < 5) {
        throw { code: "VALIDATION_ERROR", message: "Mandatory regulatory Reason for Change must be provided." };
      }
      if (!groupData.name || !groupData.role) {
        throw { code: "VALIDATION_ERROR", message: "Group Name and Role Tier are required." };
      }

      const id = groupData.id || `group-${groupData.name.toLowerCase().replace(/[^a-z0-9]/g, "-")}`;
      const newGroup: Group = {
        id,
        name: groupData.name.trim(),
        role: groupData.role,
        permissions: groupData.permissions || [],
        active: groupData.active !== undefined ? groupData.active : true,
      };

      await groupRepo.add(newGroup);
      const allGroups = await groupRepo.getAll();
      await Storage.setItem("groups", allGroups);

      await AuditService.appendEntry({
        userId: actingUser.userId,
        fullName: actingUser.fullName,
        action: "ROLE_RIGHTS",
        entityType: "GROUP",
        entityId: newGroup.id,
        reason,
        newValue: newGroup,
      });

      return { group: newGroup };
    });
  },

  async updateGroup(
    id: string,
    updates: Partial<Group>,
    actingUser: User,
    reason: string
  ): Promise<ApiResponse<{ group: Group }>> {
    return Api.call(async () => {
      if (!can(actingUser, "group.manage")) {
        throw { code: "FORBIDDEN", message: "Access Denied: group.manage permission required." };
      }
      if (!reason || reason.trim().length < 5) {
        throw { code: "VALIDATION_ERROR", message: "Mandatory regulatory Reason for Change must be provided." };
      }
      const group = await groupRepo.getById(id);
      if (!group) throw { code: "NOT_FOUND", message: `Group ${id} not found.` };

      const oldVal = { ...group };
      if (updates.name !== undefined) group.name = updates.name.trim();
      if (updates.role !== undefined) group.role = updates.role;
      if (updates.permissions !== undefined) group.permissions = updates.permissions;
      if (updates.active !== undefined) group.active = updates.active;

      await groupRepo.update(id, group);
      const allGroups = await groupRepo.getAll();
      await Storage.setItem("groups", allGroups);

      await AuditService.appendEntry({
        userId: actingUser.userId,
        fullName: actingUser.fullName,
        action: "ROLE_RIGHTS",
        entityType: "GROUP",
        entityId: group.id,
        oldValue: oldVal,
        newValue: group,
        reason,
      });

      return { group };
    });
  },

  async updateGroupPermissions(
    id: string,
    permissions: string[],
    actingUser: User,
    reason: string
  ): Promise<ApiResponse<{ group: Group }>> {
    return Api.call(async () => {
      if (!can(actingUser, "group.manage")) {
        throw { code: "FORBIDDEN", message: "Access Denied: group.manage permission required." };
      }
      if (!reason || reason.trim().length < 5) {
        throw { code: "VALIDATION_ERROR", message: "Mandatory regulatory Reason for Change must be provided." };
      }
      const group = await groupRepo.getById(id);
      if (!group) throw { code: "NOT_FOUND", message: `Group ${id} not found.` };

      const oldPermissions = [...group.permissions];
      group.permissions = permissions;

      await groupRepo.update(id, group);
      const allGroups = await groupRepo.getAll();
      await Storage.setItem("groups", allGroups);

      await AuditService.appendEntry({
        userId: actingUser.userId,
        fullName: actingUser.fullName,
        action: "ROLE_RIGHTS",
        entityType: "GROUP",
        entityId: group.id,
        field: "permissions",
        oldValue: oldPermissions,
        newValue: permissions,
        reason,
      });

      return { group };
    });
  },

  // --- Audit Trail Endpoints (SPEC §9 & Phase 2) ---
  async getAuditLog(filters?: any, actingUser?: User): Promise<ApiResponse<AuditEntry[]>> {
    return Api.call(async () => {
      if (actingUser && !can(actingUser, "audit.view")) {
        throw { code: "FORBIDDEN", message: "Access Denied: 21 CFR Part 11 Audit Trail inspection requires audit.view permission." };
      }
      return AuditService.getEntries(filters);
    });
  },

  async getAuditRecord(entityId: string, actingUser?: User): Promise<ApiResponse<AuditEntry[]>> {
    return Api.call(async () => {
      if (actingUser && !can(actingUser, "audit.view")) {
        throw { code: "FORBIDDEN", message: "Access Denied: audit.view permission required." };
      }
      return AuditService.getRecordEntries(entityId);
    });
  },

  async verifyAuditChain(): Promise<ApiResponse<{ valid: boolean; totalEntries: number; tamperedSeq?: number; error?: string }>> {
    return Api.call(async () => {
      return AuditService.verifyChain();
    });
  },

  async corruptAuditRow(seqIndex?: number): Promise<ApiResponse<{ corruptedSeq: number }>> {
    return Api.call(async () => {
      return AuditService.corruptOneRow(seqIndex);
    });
  },

  async repairAuditChain(): Promise<ApiResponse<{ repaired: boolean }>> {
    return Api.call(async () => {
      await AuditService.repairChain();
      return { repaired: true };
    });
  },

  // --- Phase 5: Workflow, Hold Rules, Routing, & Config Endpoints (SPEC §9 & S22) ---
  async getWorkflowStages(): Promise<ApiResponse<WorkflowStage[]>> {
    return Api.call(async () => {
      const stages = (await Storage.getItem<WorkflowStage[]>("workflow_stages")) || [];
      return stages.sort((a, b) => a.order - b.order);
    });
  },

  async updateWorkflowStages(
    stages: WorkflowStage[],
    actingUser: User,
    reason: string
  ): Promise<ApiResponse<{ stages: WorkflowStage[]; version: number }>> {
    return Api.call(async () => {
      if (!can(actingUser, "workflow.configure")) {
        throw { code: "FORBIDDEN", message: "Insufficient privileges to modify workflow stages (workflow.configure required)." };
      }
      if (!reason || reason.trim().length < 5) {
        throw { code: "VALIDATION_ERROR", message: "Mandatory Reason for Change (min 5 characters) must be provided." };
      }

      const validation = validateWorkflowStages(stages);
      if (!validation.valid) {
        throw { code: "VALIDATION_ERROR", message: validation.errors.join(" ") };
      }

      const oldStages = (await Storage.getItem<WorkflowStage[]>("workflow_stages")) || [];
      const currentVersion = (await Storage.getItem<number>("config_version_workflow", 1)) || 1;
      const nextVersion = currentVersion + 1;

      // Assign sorted orders
      const normalizedStages = stages.map((s, idx) => ({ ...s, order: idx + 1 }));

      await Storage.setItem("workflow_stages", normalizedStages);
      await Storage.setItem("config_version_workflow", nextVersion);

      await AuditService.appendEntry({
        userId: actingUser.userId,
        fullName: actingUser.fullName,
        action: "WORKFLOW_STAGES_UPDATED",
        entityType: "CONFIG",
        entityId: "WORKFLOW_STAGES",
        oldValue: oldStages,
        newValue: normalizedStages,
        reason: `${reason} (Bumped to v${nextVersion})`,
      });

      return { stages: normalizedStages, version: nextVersion };
    });
  },

  async getHoldRules(): Promise<ApiResponse<HoldRule[]>> {
    return Api.call(async () => {
      const rules = (await Storage.getItem<HoldRule[]>("hold_rules")) || [];
      return rules;
    });
  },

  async updateHoldRules(
    rules: HoldRule[],
    actingUser: User,
    reason: string
  ): Promise<ApiResponse<{ rules: HoldRule[]; version: number }>> {
    return Api.call(async () => {
      if (!can(actingUser, "workflow.configure")) {
        throw { code: "FORBIDDEN", message: "Insufficient privileges to configure hold-time rules (workflow.configure required)." };
      }
      if (!reason || reason.trim().length < 5) {
        throw { code: "VALIDATION_ERROR", message: "Mandatory Reason for Change (min 5 characters) must be provided." };
      }

      const stages = (await Storage.getItem<WorkflowStage[]>("workflow_stages")) || [];
      const validation = validateHoldRules(rules, stages);
      if (!validation.valid) {
        throw { code: "VALIDATION_ERROR", message: validation.errors.join(" ") };
      }

      const oldRules = (await Storage.getItem<HoldRule[]>("hold_rules")) || [];
      const currentVersion = (await Storage.getItem<number>("config_version_hold_rules", 1)) || 1;
      const nextVersion = currentVersion + 1;

      await Storage.setItem("hold_rules", rules);
      await Storage.setItem("config_version_hold_rules", nextVersion);

      await AuditService.appendEntry({
        userId: actingUser.userId,
        fullName: actingUser.fullName,
        action: "HOLD_RULES_UPDATED",
        entityType: "CONFIG",
        entityId: "HOLD_RULES",
        oldValue: oldRules,
        newValue: rules,
        reason: `${reason} (Bumped to v${nextVersion})`,
      });

      return { rules, version: nextVersion };
    });
  },

  async getSignRoute(): Promise<ApiResponse<SignRoute>> {
    return Api.call(async () => {
      const route = (await Storage.getItem<SignRoute>("sign_route")) || { steps: [] };
      return route;
    });
  },

  async updateSignRoute(
    route: SignRoute,
    actingUser: User,
    reason: string
  ): Promise<ApiResponse<{ route: SignRoute; version: number }>> {
    return Api.call(async () => {
      if (!can(actingUser, "workflow.configure")) {
        throw { code: "FORBIDDEN", message: "Insufficient privileges to configure signature routing." };
      }
      if (!reason || reason.trim().length < 5) {
        throw { code: "VALIDATION_ERROR", message: "Mandatory Reason for Change (min 5 characters) must be provided." };
      }

      const validation = validateSignRoute(route);
      if (!validation.valid) {
        throw { code: "VALIDATION_ERROR", message: validation.errors.join(" ") };
      }

      const oldRoute = await Storage.getItem<SignRoute>("sign_route");
      const currentVersion = (await Storage.getItem<number>("config_version_sign_route", 1)) || 1;
      const nextVersion = currentVersion + 1;

      await Storage.setItem("sign_route", route);
      await Storage.setItem("config_version_sign_route", nextVersion);

      await AuditService.appendEntry({
        userId: actingUser.userId,
        fullName: actingUser.fullName,
        action: "SIGN_ROUTE_UPDATED",
        entityType: "CONFIG",
        entityId: "SIGN_ROUTE",
        oldValue: oldRoute,
        newValue: route,
        reason: `${reason} (Bumped to v${nextVersion})`,
      });

      return { route, version: nextVersion };
    });
  },

  async getStorageDetailLevel(): Promise<ApiResponse<string>> {
    return Api.call(async () => {
      return (await Storage.getItem<string>("storage_detail_level")) || "cold_room_rack_pallet";
    });
  },

  async updateStorageDetailLevel(
    level: string,
    actingUser: User,
    reason: string
  ): Promise<ApiResponse<{ level: string }>> {
    return Api.call(async () => {
      if (!can(actingUser, "workflow.configure")) {
        throw { code: "FORBIDDEN", message: "Insufficient privileges to configure storage detail level." };
      }
      if (!reason || reason.trim().length < 5) {
        throw { code: "VALIDATION_ERROR", message: "Mandatory Reason for Change (min 5 characters) must be provided." };
      }

      const oldLevel = await Storage.getItem<string>("storage_detail_level");
      await Storage.setItem("storage_detail_level", level);

      await AuditService.appendEntry({
        userId: actingUser.userId,
        fullName: actingUser.fullName,
        action: "STORAGE_DETAIL_UPDATED",
        entityType: "CONFIG",
        entityId: "STORAGE_DETAIL",
        oldValue: oldLevel,
        newValue: level,
        reason,
      });

      return { level };
    });
  },

  async getCompanyProfile(): Promise<
    ApiResponse<{
      companyName: string;
      divisionName: string;
      facilityCode: string;
      address: string;
    }>
  > {
    return Api.call(async () => {
      const terms = getAllTerms();
      const profile = (await Storage.getItem<any>("company_profile")) || {
        companyName: terms.companyName,
        divisionName: terms.divisionName,
        facilityCode: "FAC-BLR-01",
        address: "Plot 12-B, Cleanroom Park, Bangalore, KA, India",
      };
      return profile;
    });
  },

  async updateCompanyProfile(
    profile: {
      companyName: string;
      divisionName: string;
      facilityCode: string;
      address: string;
    },
    actingUser: User,
    reason: string
  ): Promise<ApiResponse<{ profile: any }>> {
    return Api.call(async () => {
      if (!can(actingUser, "workflow.configure")) {
        throw { code: "FORBIDDEN", message: "Insufficient privileges to update company profile." };
      }
      if (!reason || reason.trim().length < 5) {
        throw { code: "VALIDATION_ERROR", message: "Mandatory Reason for Change (min 5 characters) must be provided." };
      }

      const oldProfile = await Storage.getItem<any>("company_profile");
      await Storage.setItem("company_profile", profile);

      // Keep terms dictionary in sync with company and division name
      setTerms({
        companyName: profile.companyName,
        divisionName: profile.divisionName,
      });

      await AuditService.appendEntry({
        userId: actingUser.userId,
        fullName: actingUser.fullName,
        action: "COMPANY_PROFILE_UPDATED",
        entityType: "CONFIG",
        entityId: "COMPANY_PROFILE",
        oldValue: oldProfile,
        newValue: profile,
        reason,
      });

      return { profile };
    });
  },

  // --- Configuration Export & Import (JSON) ---
  async exportFullConfig(): Promise<ApiResponse<any>> {
    return Api.call(async () => {
      const [
        terms,
        company,
        workflow,
        holdRules,
        signRoute,
        storageDetail,
        securityPolicy,
        barcodeFormats,
        departments,
        locations,
        racks,
        pallets,
      ] = await Promise.all([
        Storage.getItem("terms", getAllTerms()),
        Storage.getItem("company_profile", {
          companyName: "Company Pharmaceutical Limited",
          divisionName: "Biopharma Division",
          facilityCode: "FAC-BLR-01",
          address: "Plot 12-B, Cleanroom Park, Bangalore, KA, India",
        }),
        Storage.getItem("workflow_stages"),
        Storage.getItem("hold_rules"),
        Storage.getItem("sign_route"),
        Storage.getItem("storage_detail_level", "cold_room_rack_pallet"),
        Storage.getItem("security_policy"),
        Storage.getItem("barcode_formats"),
        deptRepo.getAll(),
        locRepo.getAll(),
        rackRepo.getAll(),
        palletRepo.getAll(),
      ]);

      const configExport = {
        app: "Product Tracking System (PTS) - Biopharma",
        version: "2.1.0",
        exportedAt: TimeService.now(),
        configuration: {
          terms,
          company,
          workflow,
          holdRules,
          signRoute,
          storageDetail,
          securityPolicy,
          barcodeFormats,
          masters: {
            departments,
            locations,
            racks,
            pallets,
          },
        },
      };

      return configExport;
    });
  },

  async importFullConfig(
    importData: any,
    actingUser: User,
    reason: string
  ): Promise<ApiResponse<{ imported: boolean; timestamp: string }>> {
    return Api.call(async () => {
      if (!can(actingUser, "workflow.configure")) {
        throw { code: "FORBIDDEN", message: "Insufficient privileges to import system configuration." };
      }
      if (!reason || reason.trim().length < 5) {
        throw { code: "VALIDATION_ERROR", message: "Mandatory Reason for Change (min 5 characters) must be provided." };
      }

      if (!importData || !importData.configuration) {
        throw { code: "INVALID_CONFIG", message: "Supplied JSON file does not contain a valid PTS configuration envelope." };
      }

      const conf = importData.configuration;

      // Validate stages & rules inside configuration if provided
      if (conf.workflow) {
        const vWorkflow = validateWorkflowStages(conf.workflow);
        if (!vWorkflow.valid) {
          throw { code: "VALIDATION_ERROR", message: `Invalid workflow stages in import: ${vWorkflow.errors.join(" ")}` };
        }
      }

      if (conf.holdRules && conf.workflow) {
        const vHold = validateHoldRules(conf.holdRules, conf.workflow);
        if (!vHold.valid) {
          throw { code: "VALIDATION_ERROR", message: `Invalid hold rules in import: ${vHold.errors.join(" ")}` };
        }
      }

      if (conf.signRoute) {
        const vRoute = validateSignRoute(conf.signRoute);
        if (!vRoute.valid) {
          throw { code: "VALIDATION_ERROR", message: `Invalid signature route in import: ${vRoute.errors.join(" ")}` };
        }
      }

      // Write imported configurations
      if (conf.terms) {
        setTerms(conf.terms);
        await Storage.setItem("terms", conf.terms);
      }
      if (conf.company) await Storage.setItem("company_profile", conf.company);
      if (conf.workflow) await Storage.setItem("workflow_stages", conf.workflow);
      if (conf.holdRules) await Storage.setItem("hold_rules", conf.holdRules);
      if (conf.signRoute) await Storage.setItem("sign_route", conf.signRoute);
      if (conf.storageDetail) await Storage.setItem("storage_detail_level", conf.storageDetail);
      if (conf.securityPolicy) await Storage.setItem("security_policy", conf.securityPolicy);
      if (conf.barcodeFormats) await Storage.setItem("barcode_formats", conf.barcodeFormats);

      if (conf.masters) {
        if (conf.masters.departments) await Storage.setItem("departments", conf.masters.departments);
        if (conf.masters.locations) await Storage.setItem("locations", conf.masters.locations);
        if (conf.masters.racks) await Storage.setItem("racks", conf.masters.racks);
        if (conf.masters.pallets) await Storage.setItem("pallets", conf.masters.pallets);
      }

      // Increment versions
      const curVersion = (await Storage.getItem<number>("config_version_overall", 1)) || 1;
      await Storage.setItem("config_version_overall", curVersion + 1);

      await AuditService.appendEntry({
        userId: actingUser.userId,
        fullName: actingUser.fullName,
        action: "CONFIG_IMPORTED",
        entityType: "CONFIG",
        entityId: "SYSTEM_CONFIG",
        reason: `${reason} (Imported schema version ${importData.version || "unknown"})`,
      });

      return { imported: true, timestamp: TimeService.now() };
    });
  },
};

export default mockApi;

