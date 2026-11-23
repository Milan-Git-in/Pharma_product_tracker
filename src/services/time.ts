/**
 * TimeService (R1 Time)
 * All timestamps come from TimeService.now() (simulated company-server time = device time + adjustable offset).
 * Never call new Date() directly in feature code.
 */

class TimeServiceClass {
  private offsetMs = 0;
  private readonly STORAGE_KEY = "pts_time_offset_ms";

  constructor() {
    if (typeof window !== "undefined") {
      try {
        const saved = localStorage.getItem(this.STORAGE_KEY);
        if (saved) {
          this.offsetMs = parseInt(saved, 10) || 0;
        }
      } catch {
        this.offsetMs = 0;
      }
    }
  }

  /**
   * Get simulated current timestamp as ISO 8601 string
   */
  public now(): string {
    return new Date(Date.now() + this.offsetMs).toISOString();
  }

  /**
   * Get simulated current Date object
   */
  public nowDate(): Date {
    return new Date(Date.now() + this.offsetMs);
  }

  /**
   * Get simulated current epoch ms
   */
  public nowMs(): number {
    return Date.now() + this.offsetMs;
  }

  /**
   * Get active simulated offset in milliseconds
   */
  public getOffsetMs(): number {
    return this.offsetMs;
  }

  /**
   * Set simulated offset in milliseconds
   */
  public setOffsetMs(offset: number): void {
    this.offsetMs = offset;
    if (typeof window !== "undefined") {
      try {
        localStorage.setItem(this.STORAGE_KEY, offset.toString());
      } catch {
        // storage disabled
      }
    }
  }

  /**
   * Adjust offset by delta hours, minutes, seconds
   */
  public advanceTime(hours = 0, minutes = 0, seconds = 0): void {
    const delta = ((hours * 60 + minutes) * 60 + seconds) * 1000;
    this.setOffsetMs(this.offsetMs + delta);
  }

  /**
   * Reset offset to zero (real device time)
   */
  public resetOffset(): void {
    this.setOffsetMs(0);
  }
}

export const TimeService = new TimeServiceClass();
export default TimeService;

