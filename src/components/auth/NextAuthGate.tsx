"use client";

import React, { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useSession } from "@/services/session";

const PUBLIC_PATHS = ["/login"];

const NextAuthGate: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { currentUser, ready } = useSession();
  const pathname = usePathname();
  const router = useRouter();
  const isPublicPath = pathname !== null && PUBLIC_PATHS.includes(pathname);

  useEffect(() => {
    if (ready && !currentUser && !isPublicPath) {
      router.replace("/login");
    }
  }, [currentUser, isPublicPath, pathname, ready, router]);

  if (!ready || (!currentUser && !isPublicPath)) {
    return (
      <div className="min-h-screen bg-surface flex items-center justify-center font-mono text-xs text-outline">
        {ready ? "Redirecting to sign in..." : "Restoring signed-in operator..."}
      </div>
    );
  }

  return <>{children}</>;
};

export default NextAuthGate;
