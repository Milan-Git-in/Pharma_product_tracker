import React from "react";

export interface DrawerProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  badge?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  width?: "sm" | "md" | "lg" | "xl";
}

export const Drawer: React.FC<DrawerProps> = ({
  isOpen,
  onClose,
  title,
  subtitle,
  badge,
  children,
  footer,
  width = "md",
}) => {
  if (!isOpen) return null;

  const widthClasses = {
    sm: "w-80",
    md: "w-96", // 380px inspector standard
    lg: "w-[480px]",
    xl: "w-[600px]",
  }[width];

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-inverse-surface/40 backdrop-blur-xs animate-in fade-in duration-150">
      <div
        className={`h-full ${widthClasses} bg-surface-container-lowest border-l border-outline-variant/40 shadow-2xl flex flex-col justify-between`}
        role="dialog"
      >
        <div className="flex items-center justify-between p-4 border-b border-outline-variant/30 bg-surface-container-low">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-headline-sm text-base font-semibold text-on-surface">
                {title}
              </h3>
              {badge && (
                <span className="px-2 py-0.5 rounded font-mono text-[10px] uppercase font-bold bg-primary-fixed text-on-primary-fixed">
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
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg hover:bg-surface-container flex items-center justify-center text-outline hover:text-on-surface transition-colors min-h-[44px] min-w-[44px]"
            title="Close drawer"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        <div className="p-4 flex-1 overflow-y-auto">{children}</div>

        {footer && (
          <div className="p-4 border-t border-outline-variant/30 bg-surface-container-low flex items-center justify-end gap-2.5">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
};

export default Drawer;

