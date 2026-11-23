import React, { useState, useEffect } from "react";
import AppLayout from "@/components/layout/AppLayout";
import { runDomainSelfTests, TestResult } from "@/domain/selftest";
import StatusPill from "@/components/ui/StatusPill";
import Button from "@/components/ui/Button";

export default function DevSelfTestPage() {
  const [results, setResults] = useState<TestResult[]>([]);
  const [running, setRunning] = useState(false);

  const executeTests = async () => {
    setRunning(true);
    try {
      const res = await runDomainSelfTests();
      setResults(res);
    } catch (err) {
      console.error("Self-test error:", err);
    } finally {
      setRunning(false);
    }
  };

  useEffect(() => {
    executeTests();
  }, []);

  const total = results.length;
  const passed = results.filter((r) => r.passed).length;
  const failed = total - passed;

  return (
    <AppLayout screenCode="SELF-TEST">
      <div className="flex flex-col gap-6 text-left max-w-5xl mx-auto pb-12">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-xl bg-surface-container-lowest border border-outline-variant/40 shadow-xs">
          <div>
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-primary text-[24px]">
                verified
              </span>
              <h1 className="font-headline-md text-xl font-bold text-on-surface">
                Pure Domain & Services Self-Test
              </h1>
              <span className="font-mono text-xs px-2 py-0.5 rounded bg-amber-100 text-amber-900 border border-amber-300 font-bold">
                DEV ONLY (?dev=1)
              </span>
            </div>
            <p className="font-body-sm text-xs text-on-surface-variant mt-1">
              Automated diagnostics verifying TimeService (R1), Crypto SHA-256, Audit Hash Chain (R5), Permissions (R7/§8), Storage Envelopes, and Terminology.
            </p>
          </div>

          <Button
            variant="primary"
            size="sm"
            onClick={executeTests}
            loading={running}
            icon="play_arrow"
          >
            Re-run Tests
          </Button>
        </div>

        {/* Metrics Row */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          <div className="p-4 rounded-xl bg-surface-container-lowest border border-outline-variant/40 shadow-xs">
            <span className="font-caption text-xs text-on-surface-variant uppercase font-medium">
              Total Tests
            </span>
            <div className="font-headline-lg text-2xl font-bold font-mono text-on-surface mt-1">
              {total}
            </div>
          </div>
          <div className="p-4 rounded-xl bg-emerald-50/40 border border-emerald-200 shadow-xs">
            <span className="font-caption text-xs text-emerald-800 uppercase font-medium">
              Passed
            </span>
            <div className="font-headline-lg text-2xl font-bold font-mono text-emerald-700 mt-1">
              {passed}
            </div>
          </div>
          <div className="p-4 rounded-xl bg-red-50/40 border border-red-200 shadow-xs">
            <span className="font-caption text-xs text-red-800 uppercase font-medium">
              Failed
            </span>
            <div className="font-headline-lg text-2xl font-bold font-mono text-red-700 mt-1">
              {failed}
            </div>
          </div>
          <div className="p-4 rounded-xl bg-surface-container-lowest border border-outline-variant/40 shadow-xs">
            <span className="font-caption text-xs text-on-surface-variant uppercase font-medium">
              Status
            </span>
            <div className="mt-1">
              <StatusPill
                label={failed === 0 ? "ALL PASSING" : `${failed} FAILED`}
                variant={failed === 0 ? "compliant" : "critical"}
                dot={true}
              />
            </div>
          </div>
        </div>

        {/* Test Cases Table */}
        <div className="w-full overflow-hidden rounded-xl border border-outline-variant/40 bg-surface-container-lowest shadow-xs">
          <div className="p-3.5 bg-surface-container-low border-b border-outline-variant/30 flex items-center justify-between">
            <span className="font-headline-sm text-xs font-semibold text-on-surface">
              Test Suite Results
            </span>
            <span className="font-mono text-xs text-outline">
              Execution: pure browser memory
            </span>
          </div>

          <div className="divide-y divide-outline-variant/20">
            {results.map((res, idx) => (
              <div
                key={idx}
                className="p-3.5 flex items-start justify-between gap-4 hover:bg-surface-container/30 transition-colors"
              >
                <div className="flex items-start gap-3">
                  <span
                    className={`material-symbols-outlined text-[20px] mt-0.5 ${
                      res.passed ? "text-emerald-600" : "text-red-600"
                    }`}
                  >
                    {res.passed ? "check_circle" : "cancel"}
                  </span>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-[11px] font-semibold px-2 py-0.5 rounded bg-surface-container text-outline uppercase">
                        {res.category}
                      </span>
                      <span className="font-body-md text-xs font-semibold text-on-surface">
                        {res.name}
                      </span>
                    </div>
                    {res.message && (
                      <p className="font-mono text-[11px] text-red-700 mt-1 bg-red-50 p-2 rounded border border-red-200">
                        {res.message}
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-3 font-mono text-xs">
                  <span className="text-outline">{res.durationMs}ms</span>
                  <StatusPill
                    label={res.passed ? "PASSED" : "FAILED"}
                    variant={res.passed ? "compliant" : "critical"}
                    size="sm"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </AppLayout>
  );
}

