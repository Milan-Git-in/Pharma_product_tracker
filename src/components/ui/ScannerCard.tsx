import React from "react";

export const ScannerCard: React.FC<{
  placeholder?: string;
  onScan?: (value: string) => void;
}> = ({
  placeholder = "Scan barcode (Code 128 / DataMatrix) or type Lot / Pallet ID...",
}) => {
  return (
    <section className="bg-surface-container-lowest border border-outline-variant/50 rounded-xl p-4 shadow-sm mb-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-3 border-b border-surface-container-high">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-secondary-container/50 flex items-center justify-center text-primary">
            <span className="material-symbols-outlined text-[20px]">barcode_scanner</span>
          </div>
          <div>
            <span className="font-headline-sm text-sm font-semibold text-on-surface">
              Universal Cleanroom Scanner
            </span>
            <span className="block font-caption text-[11px] text-on-surface-variant">
              Immediate lot, pallet, or sterile bin lookup with auto-binder linkage
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-200 font-mono text-[11px]">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
            Wedge Scanner Ready
          </span>
        </div>
      </div>

      <div className="mt-3 flex flex-col sm:flex-row gap-2">
        <div className="relative flex-1">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline text-[18px]">
            qr_code_scanner
          </span>
          <input
            type="text"
            placeholder={placeholder}
            className="w-full pl-9 pr-24 py-2.5 bg-surface-container-low border border-outline-variant/60 rounded-lg text-xs font-mono text-on-surface focus:outline-none focus:ring-2 focus:ring-primary focus:bg-surface-container-lowest transition-all"
            defaultValue="PL-26-000124"
          />
          <span className="absolute right-2.5 top-1/2 -translate-y-1/2 font-mono text-[10px] text-outline px-1.5 py-0.5 bg-surface-container rounded border border-outline-variant/40">
            ENTER ↵
          </span>
        </div>

        <button
          type="button"
          className="min-h-[40px] px-4 py-2 bg-primary text-on-primary rounded-lg font-body-md text-xs font-semibold hover:bg-primary-container transition-colors flex items-center justify-center gap-1.5 shadow-sm"
        >
          <span className="material-symbols-outlined text-[16px]">search</span>
          <span>Lookup</span>
        </button>
      </div>
    </section>
  );
};

export default ScannerCard;

