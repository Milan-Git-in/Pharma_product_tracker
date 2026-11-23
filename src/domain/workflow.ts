/**
 * Workflow Domain Logic & Validation Engine (§5 Data model, §6 Seed, §7 Rules)
 * Pure functions for validating workflow stage topology, transitions, and hold-time rule parameters.
 */

import { WorkflowStage, HoldRule, SignRoute, Role } from "./types";

export interface WorkflowValidationResult {
  valid: boolean;
  errors: string[];
}

/**
 * Validates Workflow Stages:
 * - Exactly one START stage.
 * - At least one END stage.
 * - No unreachable stages (all stages must be reachable from the START stage).
 * - All nextStageIds must refer to existing stage IDs.
 * - Stage names must not be empty.
 */
export function validateWorkflowStages(stages: WorkflowStage[]): WorkflowValidationResult {
  const errors: string[] = [];

  if (!stages || stages.length === 0) {
    return { valid: false, errors: ["At least one workflow stage must exist."] };
  }

  const startStages = stages.filter((s) => s.kind === "START");
  if (startStages.length === 0) {
    errors.push("Workflow must contain exactly one START stage (0 found).");
  } else if (startStages.length > 1) {
    errors.push(`Workflow must contain exactly one START stage (${startStages.length} found: ${startStages.map((s) => s.name).join(", ")}).`);
  }

  const endStages = stages.filter((s) => s.kind === "END");
  if (endStages.length === 0) {
    errors.push("Workflow must contain at least one END stage.");
  }

  const stageIds = new Set(stages.map((s) => s.id));
  if (stageIds.size !== stages.length) {
    errors.push("Duplicate stage IDs detected.");
  }

  // Check nextStageIds exist
  for (const stage of stages) {
    if (!stage.name.trim()) {
      errors.push(`Stage with ID "${stage.id}" has an empty name.`);
    }
    for (const nextId of stage.nextStageIds) {
      if (!stageIds.has(nextId)) {
        errors.push(`Stage "${stage.name}" has next transition to non-existent stage "${nextId}".`);
      }
    }
  }

  // Check reachability from START stage
  if (startStages.length === 1) {
    const visited = new Set<string>();
    const queue = [startStages[0].id];
    visited.add(startStages[0].id);

    while (queue.length > 0) {
      const currentId = queue.shift()!;
      const currentStage = stages.find((s) => s.id === currentId);
      if (currentStage) {
        for (const nextId of currentStage.nextStageIds) {
          if (!visited.has(nextId) && stageIds.has(nextId)) {
            visited.add(nextId);
            queue.push(nextId);
          }
        }
      }
    }

    const unreachable = stages.filter((s) => !visited.has(s.id));
    if (unreachable.length > 0) {
      errors.push(
        `Unreachable stage(s) detected from START: ${unreachable.map((s) => `"${s.name}" (${s.id})`).join(", ")}.`
      );
    }
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

/**
 * Validates Hold-Time Rules:
 * - Triggers must reference existing stages or standard movement event types:
 *   RECEIVED | LOAD | UNLOAD | TRANSFER | STAGE_ENTER:<stageId> | STAGE_EXIT:<stageId>
 * - limitMinutes > 0
 * - warnAtPercent between 1 and 99
 */
export function validateHoldRules(rules: HoldRule[], stages: WorkflowStage[]): WorkflowValidationResult {
  const errors: string[] = [];
  const stageIds = new Set(stages.map((s) => s.id));
  const validBaseTriggers = new Set(["RECEIVED", "LOAD", "UNLOAD", "TRANSFER"]);

  const isValidTrigger = (trigger: string): boolean => {
    if (!trigger) return false;
    if (validBaseTriggers.has(trigger)) return true;
    if (trigger.startsWith("STAGE_ENTER:")) {
      const stageId = trigger.slice("STAGE_ENTER:".length);
      return stageIds.has(stageId);
    }
    if (trigger.startsWith("STAGE_EXIT:")) {
      const stageId = trigger.slice("STAGE_EXIT:".length);
      return stageIds.has(stageId);
    }
    return false;
  };

  for (const rule of rules) {
    if (!rule.name.trim()) {
      errors.push(`Rule with ID "${rule.id}" has an empty name.`);
    }
    if (!rule.startTrigger || !isValidTrigger(rule.startTrigger)) {
      errors.push(`Rule "${rule.name}" has invalid start trigger: "${rule.startTrigger}". Must reference a valid event or existing stage.`);
    }
    if (!rule.stopTrigger || !isValidTrigger(rule.stopTrigger)) {
      errors.push(`Rule "${rule.name}" has invalid stop trigger: "${rule.stopTrigger}". Must reference a valid event or existing stage.`);
    }
    if (rule.limitMinutes <= 0) {
      errors.push(`Rule "${rule.name}" limitMinutes must be greater than 0 (got ${rule.limitMinutes}).`);
    }
    if (rule.warnAtPercent <= 0 || rule.warnAtPercent >= 100) {
      errors.push(`Rule "${rule.name}" warnAtPercent must be between 1 and 99 (got ${rule.warnAtPercent}%).`);
    }
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

/**
 * Validates Signature Route:
 * - At least one step
 * - Valid roles
 * - Sequential orders
 */
export function validateSignRoute(route: SignRoute): WorkflowValidationResult {
  const errors: string[] = [];
  if (!route || !route.steps || route.steps.length === 0) {
    return { valid: false, errors: ["Signature route must define at least one verification step."] };
  }

  const validRoles: Role[] = ["INITIATOR", "HOD", "QA", "ADMIN"];
  const orders = new Set<number>();

  for (const step of route.steps) {
    if (!validRoles.includes(step.role)) {
      errors.push(`Step ${step.order} has invalid role "${step.role}".`);
    }
    if (!step.meaning) {
      errors.push(`Step ${step.order} has no assigned signature meaning.`);
    }
    if (orders.has(step.order)) {
      errors.push(`Duplicate step order ${step.order} detected.`);
    }
    orders.add(step.order);
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

/**
 * Time Helpers: convert hh:mm string to minutes and minutes to hh:mm
 */
export function minutesToHhMm(totalMinutes: number): string {
  if (isNaN(totalMinutes) || totalMinutes < 0) return "00:00";
  const hours = Math.floor(totalMinutes / 60);
  const minutes = Math.floor(totalMinutes % 60);
  const hh = hours.toString().padStart(2, "0");
  const mm = minutes.toString().padStart(2, "0");
  return `${hh}:${mm}`;
}

export function hhMmToMinutes(hhMm: string): number {
  if (!hhMm) return 0;
  const parts = hhMm.split(":");
  if (parts.length !== 2) return 0;
  const hours = parseInt(parts[0], 10);
  const minutes = parseInt(parts[1], 10);
  if (isNaN(hours) || isNaN(minutes)) return 0;
  return hours * 60 + minutes;
}
