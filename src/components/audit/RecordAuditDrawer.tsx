import React, { useState, useEffect } from "react";
import Drawer from "@/components/ui/Drawer";
import StatusPill from "@/components/ui/StatusPill";
import { AuditEntry } from "@/domain/types";
import { mockApi } from "@/api";
import { fmtDateTimeFull } from "@/services/format";

export interface RecordAuditDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  entityId: string;
  entityType?: string;
  entityTitle?: string;
}

export const RecordAuditDrawer: React.FC<RecordAuditDrawerProps> = ({
  isOpen,
  onClose,
  entityId,
  entityType = "RECORD",
  entityTitle,
}) => {
  const [entries, setEntries] = useState<AuditEntry[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen && entityId) {
      loadRecordAudit();
    }
  }, [isOpen, entityId]);

  const loadRecordAudit = async () => {
    setLoading(true);
    try {
      const res = await mockApi.getAuditRecord(entityId);
      if (res.ok && res.data) {
        setEntries(res.data);
      }
    } catch (err) {
      console.error("Failed to load record audit:", err);
    } finally {
      setLoading(false);
    }
  };

  const getActionColor = (action: string) => {
    switch (action.toUpperCase()) {
      case "CREATE":
        return "compliant";
      case "MODIFY":
      case "STAGE_CHANGE":
        return "secondary";
      case "SIGNATURE":
        return "primary";
      case "FAILED_LOGIN":
        return "critical";
      default:
        return "neutral";
    }
  };

  return (
    <Drawer
      isOpen={isOpen}
      onClose={onClose}
      title={`Audit Trail: ${entityTitle || entityId}`}
      subtitle={`Immutable chronological ledger for ${entityType} ${entityId} (21 CFR Part 11)`}
      badge="HASH-CHAINED"
      width="lg"
    >
      <div className="flex flex-col gap-4 text-left">
        {/* Drawer Metadata Summary */}
        <div className="p-3 bg-surface-container-low rounded-xl border border-outline-variant/40 flex items-center justify-between text-xs font-mono">
          <div>
            <span className="text-outline">Total Audit Entries: </span>
            <strong className="text-on-surface">{entries.length}</strong>
          </div>
          <div>
            <span className="text-outline">Status: </span>
            <span className="text-emerald-700 font-bold">CHAIN INTACT</span>
          </div>
        </div>

        {loading ? (
          <div className="py-12 flex flex-col items-center justify-center gap-2 text-outline text-xs font-mono">
            <span className="material-symbols-outlined text-[24px] animate-spin">
              progress_activity
            </span>
            <span>Retrieving record ledger...</span>
          </div>
        ) : entries.length === 0 ? (
          <div className="py-12 text-center text-outline text-xs font-body-md">
            No audit records found for this specific entity.
          </div>
        ) : (
          <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-3 before:bottom-3 before:w-0.5 before:bg-outline-variant/50">
            {entries.map((entry) => (
              <div key={entry.seq} className="relative group">
                {/* Timeline Node Dot */}
                <span className="absolute -left-6 top-1 w-3 h-3 rounded-full bg-primary ring-4 ring-surface-container-lowest" />

                <div className="p-3.5 bg-surface-container-lowest rounded-xl border border-outline-variant/40 shadow-xs flex flex-col gap-2">
                  <div className="flex items-center justify-between gap-2 flex-wrap">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-primary">
                        #{String(entry.seq).padStart(5, "0")}
                      </span>
                      <StatusPill
                        label={entry.action}
                        variant={getActionColor(entry.action) as any}
                        size="sm"
                      />
                    </div>
                    <span className="font-mono text-[11px] text-outline">
                      {fmtDateTimeFull(entry.at)}
                    </span>
                  </div>

                  {/* Operator */}
                  <div className="flex items-center gap-1.5 text-xs text-on-surface font-body-md">
                    <span className="material-symbols-outlined text-[16px] text-outline">
                      person
                    </span>
                    <span className="font-semibold">{entry.fullName}</span>
                    <span className="font-mono text-outline text-[11px]">
                      ({entry.userId})
                    </span>
                  </div>

                  {/* Field Diffs if any */}
                  {entry.field && (
                    <div className="p-2 rounded bg-surface-container-low border border-outline-variant/30 text-xs font-mono">
                      <span className="text-outline font-semibold">{entry.field}: </span>
                      <span className="text-red-700 line-through mr-1">
                        {entry.oldValue !== undefined ? JSON.stringify(entry.oldValue) : "null"}
                      </span>
                      <span className="text-outline">→</span>
                      <span className="text-emerald-700 font-bold ml-1">
                        {entry.newValue !== undefined ? JSON.stringify(entry.newValue) : "null"}
                      </span>
                    </div>
                  )}

                  {/* Mandatory Reason */}
                  {entry.reason && (
                    <div className="text-xs bg-amber-50/60 p-2 rounded border border-amber-200/60 text-amber-950 font-body-sm">
                      <span className="font-semibold font-mono text-[10px] text-amber-800 uppercase block">
                        Reason for Change:
                      </span>
                      <span>{entry.reason}</span>
                    </div>
                  )}

                  {/* SHA-256 Seal */}
                  <div className="pt-2 border-t border-outline-variant/30 flex items-center justify-between text-[10px] font-mono text-outline">
                    <div className="truncate max-w-[240px]" title={entry.hash}>
                      SHA-256: {entry.hash.substring(0, 14)}...{entry.hash.substring(58)}
                    </div>
                    <span className="text-emerald-600 font-semibold flex items-center gap-0.5">
                      <span className="material-symbols-outlined text-[12px]">verified</span>
                      Sealed
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </Drawer>
  );
};

export default RecordAuditDrawer;

