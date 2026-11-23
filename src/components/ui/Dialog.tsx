import React from "react";

export interface DialogProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  badge?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  maxWidth?: "sm" | "md" | "lg" | "xl" | "2xl";
}

export const Dialog: React.FC<DialogProps> = ({
  isOpen,
  onClose,
  title,
  subtitle,
  badge,
  children,
  footer,
  maxWidth = "lg",
}) => {
  if (!isOpen) return null;

  const maxWidthClasses = {
    sm: "max-w-sm",
    md: "max-w-md",
    lg: "max-w-lg",
    xl: "max-w-xl",
    "2xl": "max-w-2xl",
  }[maxWidth];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-inverse-surface/60 backdrop-blur-xs">
      <div
        className={`w-full ${maxWidthClasses} bg-surface-container-lowest rounded-xl border border-outline-variant/40 shadow-[0_8px_30px_rgb(0,0,0,0.12)] overflow-hidden flex flex-col`}
        role="dialog"
        aria-modal="true"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-outline-variant/30 bg-surface-container-low">
          <div className="flex items-center gap-2">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-headline-sm text-base font-semibold text-on-surface">
                  {title}
                </h3>
                {badge && (
                  <span className="px-2 py-0.5 rounded font-mono text-[10px] uppercase font-bold bg-secondary-container text-on-secondary-container">
                    {badge}
                  </span>
                )}
              </div>
              {subtitle && (
                <p className="font-caption text-xs text-on-surface-variant mt-0.5">
                  {subtitle}
                </p>
              )}
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg hover:bg-surface-container flex items-center justify-center text-outline hover:text-on-surface transition-colors"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        {/* Body */}
        <div className="p-5 overflow-y-auto max-h-[80vh]">{children}</div>

        {/* Footer */}
        {footer && (
          <div className="p-4 border-t border-outline-variant/30 bg-surface-container-low flex items-center justify-end gap-2.5">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dialog;

