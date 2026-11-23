/**
 * Audit Service (R5 Audit)
 * - Append-only and hash-chained
 * - hash = SHA-256(prevHash + canonical JSON of the entry)
 * - No update or delete endpoints exist, and no setting disables it.
 * - Logs all compliance-critical operations.
 */

import { AuditEntry } from "@/domain/types";
import { Storage } from "./storage";
import { TimeService } from "./time";
import { sha256, canonicalJson } from "./crypto";

const AUDIT_STORAGE_KEY = "audit_log";
export const GENESIS_HASH = "0000000000000000000000000000000000000000000000000000000000000000";

export interface AuditFilterParams {
  from?: string;
  to?: string;
  userId?: string;
  user?: string;
  action?: string;
  entityType?: string;
  entity?: string;
  entityId?: string;
  product?: string;
  lot?: string;
  lotNo?: string;
  batch?: string;
  batchNo?: string;
}

class AuditServiceClass {
  /**
   * Append a new entry to the immutable hash chain
   */
  public async appendEntry(params: {
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
    at?: string; // allow explicit timestamp for seeding if provided
  }): Promise<AuditEntry> {
    const existing = (await Storage.getItem<AuditEntry[]>(AUDIT_STORAGE_KEY, [])) || [];
    const seq = existing.length + 1;
    const prevHash = existing.length > 0 ? existing[existing.length - 1].hash : GENESIS_HASH;
    const at = params.at || TimeService.now();

    // Canonical payload for hash computation
    const payloadToHash = {
      seq,
      at,
      userId: params.userId,
      fullName: params.fullName,
      action: params.action,
      entityType: params.entityType,
      entityId: params.entityId,
      field: params.field || null,
      oldValue: params.oldValue !== undefined ? params.oldValue : null,
      newValue: params.newValue !== undefined ? params.newValue : null,
      reason: params.reason || null,
      product: params.product || null,
      lotNo: params.lotNo || null,
      batchNo: params.batchNo || null,
      prevHash,
    };

    const hash = await sha256(prevHash + canonicalJson(payloadToHash));

    const newEntry: AuditEntry = {
      seq,
      at,
      userId: params.userId,
      fullName: params.fullName,
      action: params.action,
      entityType: params.entityType,
      entityId: params.entityId,
      field: params.field,
      oldValue: params.oldValue,
      newValue: params.newValue,
      reason: params.reason,
      product: params.product,
      lotNo: params.lotNo,
      batchNo: params.batchNo,
      prevHash,
      hash,
    };

    existing.push(newEntry);
    await Storage.setItem(AUDIT_STORAGE_KEY, existing);

    return newEntry;
  }

  /**
   * Retrieve audit entries with comprehensive filters
   */
  public async getEntries(filters?: AuditFilterParams): Promise<AuditEntry[]> {
    let entries = (await Storage.getItem<AuditEntry[]>(AUDIT_STORAGE_KEY, [])) || [];

    if (!filters) return entries;

    const userQuery = filters.user || filters.userId;
    if (userQuery && userQuery !== "ALL") {
      const q = userQuery.toLowerCase();
      entries = entries.filter(
        (e) =>
          e.userId.toLowerCase().includes(q) ||
          e.fullName.toLowerCase().includes(q)
      );
    }

    if (filters.action && filters.action !== "ALL") {
      const act = filters.action.toLowerCase();
      entries = entries.filter((e) => e.action.toLowerCase() === act);
    }

    const entityQuery = filters.entity || filters.entityType;
    if (entityQuery && entityQuery !== "ALL") {
      const eq = entityQuery.toLowerCase();
      entries = entries.filter((e) => e.entityType.toLowerCase() === eq);
    }

    if (filters.entityId) {
      entries = entries.filter((e) => e.entityId === filters.entityId);
    }

    if (filters.product && filters.product !== "ALL") {
      const p = filters.product.toLowerCase();
      entries = entries.filter(
        (e) =>
          (e.product && e.product.toLowerCase().includes(p)) ||
          (e.reason && e.reason.toLowerCase().includes(p))
      );
    }

    const lotQuery = filters.lot || filters.lotNo;
    if (lotQuery) {
      const l = lotQuery.toLowerCase().trim();
      entries = entries.filter(
        (e) =>
          (e.lotNo && e.lotNo.toLowerCase().includes(l)) ||
          (e.reason && e.reason.toLowerCase().includes(l)) ||
          e.entityId.toLowerCase().includes(l)
      );
    }

    const batchQuery = filters.batch || filters.batchNo;
    if (batchQuery) {
      const b = batchQuery.toLowerCase().trim();
      entries = entries.filter(
        (e) =>
          (e.batchNo && e.batchNo.toLowerCase().includes(b)) ||
          (e.reason && e.reason.toLowerCase().includes(b)) ||
          e.entityId.toLowerCase().includes(b)
      );
    }

    if (filters.from) {
      const fromTime = new Date(filters.from).getTime();
      if (!isNaN(fromTime)) {
        entries = entries.filter((e) => new Date(e.at).getTime() >= fromTime);
      }
    }

    if (filters.to) {
      const toTime = new Date(filters.to).getTime();
      if (!isNaN(toTime)) {
        // If "to" has no time part, include the whole day
        const endOfDay = filters.to.includes("T") ? toTime : toTime + 86400000;
        entries = entries.filter((e) => new Date(e.at).getTime() <= endOfDay);
      }
    }

    return entries;
  }

  /**
   * Retrieve chronological entries for a specific record
   */
  public async getRecordEntries(entityId: string): Promise<AuditEntry[]> {
    const all = await this.getEntries();
    return all.filter((e) => e.entityId === entityId);
  }

  /**
   * Verify the integrity of the entire hash chain
   */
  public async verifyChain(): Promise<{
    valid: boolean;
    totalEntries: number;
    tamperedSeq?: number;
    error?: string;
  }> {
    const entries = (await Storage.getItem<AuditEntry[]>(AUDIT_STORAGE_KEY, [])) || [];
    if (entries.length === 0) {
      return { valid: true, totalEntries: 0 };
    }

    let expectedPrevHash = GENESIS_HASH;

    for (let i = 0; i < entries.length; i++) {
      const entry = entries[i];

      // Check sequence number
      if (entry.seq !== i + 1) {
        return {
          valid: false,
          totalEntries: entries.length,
          tamperedSeq: entry.seq,
          error: `Broken sequence at index ${i}: expected #${i + 1}, found #${entry.seq}`,
        };
      }

      // Check prevHash linkage
      if (entry.prevHash !== expectedPrevHash) {
        return {
          valid: false,
          totalEntries: entries.length,
          tamperedSeq: entry.seq,
          error: `Broken hash chain at sequence #${entry.seq}: prevHash mismatch. Expected: ${expectedPrevHash.slice(0, 16)}..., stored: ${entry.prevHash.slice(0, 16)}...`,
        };
      }

      // Recalculate hash
      const payloadToHash = {
        seq: entry.seq,
        at: entry.at,
        userId: entry.userId,
        fullName: entry.fullName,
        action: entry.action,
        entityType: entry.entityType,
        entityId: entry.entityId,
        field: entry.field || null,
        oldValue: entry.oldValue !== undefined ? entry.oldValue : null,
        newValue: entry.newValue !== undefined ? entry.newValue : null,
        reason: entry.reason || null,
        product: entry.product || null,
        lotNo: entry.lotNo || null,
        batchNo: entry.batchNo || null,
        prevHash: entry.prevHash,
      };

      const calculatedHash = await sha256(expectedPrevHash + canonicalJson(payloadToHash));
      if (calculatedHash !== entry.hash) {
        return {
          valid: false,
          totalEntries: entries.length,
          tamperedSeq: entry.seq,
          error: `Cryptographic tamper detected at sequence #${entry.seq}: Stored hash does not match computed hash. Expected: ${calculatedHash.slice(0, 16)}..., stored: ${entry.hash.slice(0, 16)}...`,
        };
      }

      expectedPrevHash = entry.hash;
    }

    return { valid: true, totalEntries: entries.length };
  }

  /**
   * DEV ONLY (?dev=1): Corrupt one row in storage without recalculating hash
   * Used to demonstrate tamper-evident detection failure
   */
  public async corruptOneRow(seqIndex?: number): Promise<{ corruptedSeq: number }> {
    const entries = (await Storage.getItem<AuditEntry[]>(AUDIT_STORAGE_KEY, [])) || [];
    if (entries.length === 0) {
      throw new Error("Cannot corrupt: Audit trail is empty.");
    }

    // Default to the second entry or specified
    const targetIdx = seqIndex !== undefined ? Math.min(seqIndex, entries.length - 1) : Math.min(1, entries.length - 1);
    const target = entries[targetIdx];

    // Tamper with data without updating hash
    target.reason = "TAMPERED: Unauthorized manual database edit (simulated attack)";
    target.oldValue = "MODIFIED_UNAUTHORIZED";

    await Storage.setItem(AUDIT_STORAGE_KEY, entries);
    return { corruptedSeq: target.seq };
  }

  /**
   * DEV ONLY: Repair / Re-hash all entries to restore integrity
   */
  public async repairChain(): Promise<void> {
    const entries = (await Storage.getItem<AuditEntry[]>(AUDIT_STORAGE_KEY, [])) || [];
    let prevHash = GENESIS_HASH;

    for (let i = 0; i < entries.length; i++) {
      entries[i].seq = i + 1;
      entries[i].prevHash = prevHash;

      const payloadToHash = {
        seq: entries[i].seq,
        at: entries[i].at,
        userId: entries[i].userId,
        fullName: entries[i].fullName,
        action: entries[i].action,
        entityType: entries[i].entityType,
        entityId: entries[i].entityId,
        field: entries[i].field || null,
        oldValue: entries[i].oldValue !== undefined ? entries[i].oldValue : null,
        newValue: entries[i].newValue !== undefined ? entries[i].newValue : null,
        reason: entries[i].reason || null,
        product: entries[i].product || null,
        lotNo: entries[i].lotNo || null,
        batchNo: entries[i].batchNo || null,
        prevHash,
      };

      const hash = await sha256(prevHash + canonicalJson(payloadToHash));
      entries[i].hash = hash;
      prevHash = hash;
    }

    await Storage.setItem(AUDIT_STORAGE_KEY, entries);
  }
}

export const AuditService = new AuditServiceClass();
export default AuditService;
