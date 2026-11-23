/**
 * API Wrapper Service (§3 Architecture & §9 Mock API)
 * - Simulates async network latency: 150–400 ms
 * - Handles NETWORK_ERROR simulation switch (R11)
 * - Standard envelope: { ok: true, data } or { ok: false, error: { code, message } }
 */

import { ApiResponse } from "@/domain/types";

class ApiWrapperClass {
  private networkFailureSimulated = false;

  /**
   * Check or toggle network failure state
   */
  public isNetworkFailure(): boolean {
    return this.networkFailureSimulated;
  }

  public setNetworkFailure(active: boolean): void {
    this.networkFailureSimulated = active;
  }

  /**
   * Simulated random latency between 150ms and 400ms
   */
  private async simulateLatency(): Promise<void> {
    const delay = Math.floor(Math.random() * (400 - 150 + 1)) + 150;
    return new Promise((resolve) => setTimeout(resolve, delay));
  }

  /**
   * Wrap an async handler with simulated latency & network failure check
   */
  public async call<T>(handler: () => Promise<T> | T): Promise<ApiResponse<T>> {
    await this.simulateLatency();

    if (this.networkFailureSimulated) {
      return {
        ok: false,
        error: {
          code: "NETWORK_ERROR",
          message: "Network connection lost or server unreachable (Simulated).",
        },
      };
    }

    try {
      const data = await handler();
      return { ok: true, data };
    } catch (err: any) {
      console.error("API Endpoint error:", err);
      return {
        ok: false,
        error: {
          code: err?.code || "INTERNAL_ERROR",
          message: err?.message || "An unexpected error occurred during operation.",
        },
      };
    }
  }

  /**
   * Helper to return standard success
   */
  public success<T>(data: T): ApiResponse<T> {
    return { ok: true, data };
  }

  /**
   * Helper to return standard failure
   */
  public fail(code: string, message: string): ApiResponse<never> {
    return {
      ok: false,
      error: { code, message },
    };
  }
}

export const Api = new ApiWrapperClass();
export default Api;

