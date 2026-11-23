import React from "react";
import TopBar from "./TopBar";
import Sidebar from "./Sidebar";
import { ToastProvider } from "@/components/ui/Toast";
import DevMenu from "@/components/dev/DevMenu";

interface AppLayoutProps {
  children: React.ReactNode;
  screenCode?: string;
  hideSidebar?: boolean;
}

export const AppLayout: React.FC<AppLayoutProps> = ({
  children,
  screenCode,
  hideSidebar = false,
}) => {
  return (
      <ToastProvider>
        <div className="min-h-screen bg-surface font-body-md text-on-surface antialiased flex flex-col">
          <TopBar currentScreenCode={screenCode} />
          <div className="flex-1 flex pt-16">
            {!hideSidebar && <Sidebar />}
            <main
              className={`flex-1 min-h-[calc(100vh-4rem)] bg-surface ${
                hideSidebar ? "" : "pl-64"
              } overflow-x-hidden`}
            >
              <div className="p-gutter max-w-[1600px] mx-auto w-full">
                {children}
              </div>
            </main>
          </div>
          <DevMenu />
        </div>
      </ToastProvider>
  );
};

export default AppLayout;
