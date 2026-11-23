"use client";

import React from "react";
import { SessionProvider } from "@/services/session";
import NextAuthGate from "./NextAuthGate";

const SessionAppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <SessionProvider>
    <NextAuthGate>{children}</NextAuthGate>
  </SessionProvider>
);

export default SessionAppProvider;
