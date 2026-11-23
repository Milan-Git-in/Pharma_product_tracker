import React from "react";

export const TableContainer: React.FC<{
  children: React.ReactNode;
  className?: string;
}> = ({ children, className = "" }) => {
  return (
    <div
      className={`w-full overflow-hidden rounded-xl border border-outline-variant/40 bg-surface-container-lowest shadow-sm ${className}`}
    >
      <div className="overflow-x-auto">{children}</div>
    </div>
  );
};

export const Table: React.FC<React.TableHTMLAttributes<HTMLTableElement>> = ({
  children,
  className = "",
  ...props
}) => {
  return (
    <table className={`w-full border-collapse text-left font-body-md text-xs ${className}`} {...props}>
      {children}
    </table>
  );
};

export const TableHead: React.FC<React.HTMLAttributes<HTMLTableSectionElement>> = ({
  children,
  className = "",
  ...props
}) => {
  return (
    <thead
      className={`bg-surface-container-low text-on-surface-variant font-mono text-[11px] uppercase tracking-wider border-b border-outline-variant/40 ${className}`}
      {...props}
    >
      {children}
    </thead>
  );
};

export const TableBody: React.FC<React.HTMLAttributes<HTMLTableSectionElement>> = ({
  children,
  className = "",
  ...props
}) => {
  return (
    <tbody className={`divide-y divide-outline-variant/20 ${className}`} {...props}>
      {children}
    </tbody>
  );
};

export const TableRow: React.FC<React.HTMLAttributes<HTMLTableRowElement>> = ({
  children,
  className = "",
  ...props
}) => {
  return (
    <tr
      className={`hover:bg-surface-container/60 transition-colors h-11 ${className}`}
      {...props}
    >
      {children}
    </tr>
  );
};

export const TableHeaderCell: React.FC<React.ThHTMLAttributes<HTMLTableCellElement>> = ({
  children,
  className = "",
  ...props
}) => {
  return (
    <th className={`py-2.5 px-3 font-semibold ${className}`} {...props}>
      {children}
    </th>
  );
};

export const TableCell: React.FC<React.TdHTMLAttributes<HTMLTableCellElement>> = ({
  children,
  className = "",
  ...props
}) => {
  return (
    <td className={`py-2.5 px-3 text-on-surface ${className}`} {...props}>
      {children}
    </td>
  );
};

export const TablePagination: React.FC<{
  currentPage?: number;
  totalPages?: number;
  totalRecords?: number;
  pageSize?: number;
}> = ({
  currentPage = 1,
  totalPages = 5,
  totalRecords = 48,
  pageSize = 10,
}) => {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-4 py-3 border-t border-outline-variant/30 bg-surface-container-low font-body-sm text-xs text-on-surface-variant">
      <div>
        Showing <span className="font-semibold text-on-surface">1</span> to{" "}
        <span className="font-semibold text-on-surface">{pageSize}</span> of{" "}
        <span className="font-semibold text-on-surface">{totalRecords}</span> entries
      </div>
      <div className="flex items-center gap-1 font-mono">
        <button
          disabled
          className="min-h-[32px] px-2.5 py-1 rounded bg-surface-container border border-outline-variant/40 text-outline cursor-not-allowed opacity-60 flex items-center gap-1"
        >
          <span className="material-symbols-outlined text-[16px]">chevron_left</span>
          <span>Prev</span>
        </button>
        <span className="px-3 py-1 text-xs font-semibold text-primary bg-primary-fixed rounded">
          {currentPage}
        </span>
        <button className="min-h-[32px] px-2.5 py-1 rounded hover:bg-surface-container border border-outline-variant/40 text-on-surface flex items-center gap-1">
          <span>Next</span>
          <span className="material-symbols-outlined text-[16px]">chevron_right</span>
        </button>
      </div>
    </div>
  );
};

