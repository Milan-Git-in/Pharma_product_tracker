import React, { createContext, useContext, useState, useCallback } from "react";

export type ToastType = "success" | "error" | "warning" | "info";

export interface ToastMessage {
  id: string;
  type: ToastType;
  title: string;
  description?: string;
}

interface ToastContextType {
  showToast: (type: ToastType, title: string, description?: string) => void;
}

const ToastContext = createContext<ToastContextType | null>(null);

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const showToast = useCallback((type: ToastType, title: string, description?: string) => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, type, title, description }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  }, []);

  const dismiss = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const typeConfig: Record<ToastType, { bg: string; border: string; icon: string; iconColor: string }> = {
    success: {
      bg: "bg-[#ECFDF5]",
      border: "border-[#A7F3D0]",
      icon: "check_circle",
      iconColor: "text-[#10B981]",
    },
    error: {
      bg: "bg-[#FEF2F2]",
      border: "border-[#FECACA]",
      icon: "error",
      iconColor: "text-[#EF4444]",
    },
    warning: {
      bg: "bg-[#FFFBEB]",
      border: "border-[#FDE68A]",
      icon: "warning",
      iconColor: "text-[#F59E0B]",
    },
    info: {
      bg: "bg-surface-container",
      border: "border-outline-variant/60",
      icon: "info",
      iconColor: "text-primary",
    },
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none">
        {toasts.map((toast) => {
          const cfg = typeConfig[toast.type];
          return (
            <div
              key={toast.id}
              className={`pointer-events-auto p-3.5 rounded-xl border shadow-lg flex items-start gap-3 animate-in slide-in-from-bottom-2 duration-150 ${cfg.bg} ${cfg.border}`}
            >
              <span className={`material-symbols-outlined text-[20px] ${cfg.iconColor} mt-0.5`}>
                {cfg.icon}
              </span>
              <div className="flex-1 text-left">
                <h4 className="font-headline-sm text-xs font-semibold text-on-surface">
                  {toast.title}
                </h4>
                {toast.description && (
                  <p className="font-body-sm text-[11px] text-on-surface-variant mt-0.5">
                    {toast.description}
                  </p>
                )}
              </div>
              <button
                onClick={() => dismiss(toast.id)}
                className="text-outline hover:text-on-surface transition-colors p-1"
              >
                <span className="material-symbols-outlined text-[16px]">close</span>
              </button>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
};

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    return {
      showToast: (type: ToastType, title: string, description?: string) => {
        console.log(`[Toast ${type}]: ${title} - ${description}`);
      },
    };
  }
  return context;
}

