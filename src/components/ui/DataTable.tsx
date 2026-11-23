import React, { useState } from "react";

export interface Column<T> {
  key: string;
  header: string;
  render?: (row: T) => React.ReactNode;
  width?: string;
  monospace?: boolean;
}

export interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  keyField: keyof T;
  onRowClick?: (row: T) => void;
  pageSize?: number;
  emptyMessage?: string;
}

export function DataTable<T extends Record<string, any>>({
  columns,
  data,
  keyField,
  onRowClick,
  pageSize = 10,
  emptyMessage = "No records found.",
}: DataTableProps<T>) {
  const [currentPage, setCurrentPage] = useState(1);

  const totalRecords = data.length;
  const totalPages = Math.ceil(totalRecords / pageSize) || 1;
  const startIndex = (currentPage - 1) * pageSize;
  const currentData = data.slice(startIndex, startIndex + pageSize);

  return (
    <div className="w-full overflow-hidden rounded-xl border border-outline-variant/40 bg-surface-container-lowest shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-left font-body-md text-xs">
          <thead className="bg-surface-container-low text-on-surface-variant font-mono text-[11px] uppercase tracking-wider border-b border-outline-variant/40">
            <tr>
              {columns.map((col) => (
                <th
                  key={col.key}
                  style={{ width: col.width }}
                  className="py-3 px-3 font-semibold"
                >
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-outline-variant/20">
            {currentData.length === 0 ? (
              <tr>
                <td
                  colSpan={columns.length}
                  className="py-8 text-center text-on-surface-variant font-body-sm"
                >
                  {emptyMessage}
                </td>
              </tr>
            ) : (
              currentData.map((row) => (
                <tr
                  key={String(row[keyField])}
                  onClick={() => onRowClick?.(row)}
                  className={`hover:bg-surface-container/60 transition-colors h-11 ${
                    onRowClick ? "cursor-pointer" : ""
                  }`}
                >
                  {columns.map((col) => (
                    <td
                      key={col.key}
                      className={`py-2.5 px-3 text-on-surface ${
                        col.monospace ? "font-mono" : ""
                      }`}
                    >
                      {col.render ? col.render(row) : String(row[col.key] ?? "—")}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-4 py-3 border-t border-outline-variant/30 bg-surface-container-low font-body-sm text-xs text-on-surface-variant">
        <div>
          Showing <span className="font-semibold text-on-surface">{totalRecords > 0 ? startIndex + 1 : 0}</span> to{" "}
          <span className="font-semibold text-on-surface">
            {Math.min(startIndex + pageSize, totalRecords)}
          </span>{" "}
          of <span className="font-semibold text-on-surface">{totalRecords}</span> entries
        </div>
        <div className="flex items-center gap-1 font-mono">
          <button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            className="min-h-[32px] px-2.5 py-1 rounded bg-surface-container border border-outline-variant/40 text-on-surface disabled:opacity-40 disabled:cursor-not-allowed hover:bg-surface-container-high transition-colors flex items-center gap-1"
          >
            <span className="material-symbols-outlined text-[16px]">chevron_left</span>
            <span>Prev</span>
          </button>
          <span className="px-3 py-1 text-xs font-semibold text-primary bg-primary-fixed rounded">
            {currentPage} / {totalPages}
          </span>
          <button
            disabled={currentPage >= totalPages}
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            className="min-h-[32px] px-2.5 py-1 rounded bg-surface-container border border-outline-variant/40 text-on-surface disabled:opacity-40 disabled:cursor-not-allowed hover:bg-surface-container-high transition-colors flex items-center gap-1"
          >
            <span>Next</span>
            <span className="material-symbols-outlined text-[16px]">chevron_right</span>
          </button>
        </div>
      </div>
    </div>
  );
}

export default DataTable;

