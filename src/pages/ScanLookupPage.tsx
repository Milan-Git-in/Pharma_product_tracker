"use client";

import React from "react";
import AppLayout from "@/components/layout/AppLayout";
import ProductMovementConsole from "@/components/movements/ProductMovementConsole";

export default function ScanLookupPage() {
  return (
    <AppLayout screenCode="S11">
      <div className="mb-4">
        <h1 className="text-2xl font-bold text-on-surface">Live Product Scan &amp; Trace</h1>
        <p className="mt-1 text-sm text-on-surface-variant">
          Scan a product label to inspect its batch, phase history, movement durations, and operator audit trail.
        </p>
      </div>
      <ProductMovementConsole />
    </AppLayout>
  );
}
