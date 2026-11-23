/**
 * Permission Engine (R7 Permissions & §8 Default Permissions)
 * Checks string permissions in one place: can(user, permission, resource)
 * Enforces role boundaries:
 * - Admin can create batches but cannot edit binders or sign
 * - HOD sees only their own department
 */

import { User, Role, Group } from "@/domain/types";
import { Storage } from "./storage";

export const ROLE_DEFAULT_PERMISSIONS: Record<Role, string[]> = {
  ADMIN: [
    "user.manage",
    "group.manage",
    "master.manage",
    "barcode.manage",
    "workflow.configure",
    "security.configure",
    "backup.manage",
    "audit.view",
    "audit.export",
    "report.active-users",
    "movement.perform",
    "binder.create",
  ],
  INITIATOR: [
    "binder.view",
    "binder.create",
    "binder.edit",
    "movement.perform",
    "scan.use",
    "alert.ack",
    "report.view",
    "report.print",
    "sign.initiator",
  ],
  HOD: [
    "binder.view",
    "report.view",
    "report.export",
    "report.print",
    "report.generate",
    "sign.review",
  ],
  QA: [
    "binder.view",
    "report.view",
    "report.export",
    "report.active-users",
    "audit.view",
    "audit.export",
    "sign.approval",
  ],
};

/**
 * Check if user possesses permission for an optional resource
 */
export function can(
  user: User | null | undefined,
  permission: string,
  resource?: { departmentId?: string; [key: string]: any }
): boolean {
  if (!user || user.status !== "ACTIVE") {
    return false;
  }

  // Check against dynamically stored groups if available
  const groups = Storage.getMemItem<Group[]>("groups");
  if (groups !== null) {
    return canFromGroups(user, permission, groups, resource);
  }

  // Admin cannot edit binders or sign.
  const isBinderEditOrSign =
    permission.startsWith("binder.edit") ||
    permission.startsWith("sign.");

  const isOnlyAdmin = user.groupIds.includes("group-admin") && user.groupIds.length === 1;
  if (isOnlyAdmin && isBinderEditOrSign) {
    return false;
  }

  // HOD scope restriction (SPEC R7 & §8: "HOD sees only their own department")
  if (
    user.groupIds.includes("group-hod") &&
    !user.groupIds.includes("group-admin") &&
    resource &&
    resource.departmentId &&
    resource.departmentId !== user.departmentId
  ) {
    return false;
  }

  // Determine user permissions from groups or default role map
  const userPerms = new Set<string>();

  user.groupIds.forEach((gId) => {
    if (gId === "group-admin" || gId.includes("admin")) {
      ROLE_DEFAULT_PERMISSIONS.ADMIN.forEach((p) => userPerms.add(p));
    }
    if (gId === "group-initiator" || gId.includes("init")) {
      ROLE_DEFAULT_PERMISSIONS.INITIATOR.forEach((p) => userPerms.add(p));
    }
    if (gId === "group-hod" || gId.includes("hod")) {
      ROLE_DEFAULT_PERMISSIONS.HOD.forEach((p) => userPerms.add(p));
    }
    if (gId === "group-qa" || gId.includes("qa")) {
      ROLE_DEFAULT_PERMISSIONS.QA.forEach((p) => userPerms.add(p));
    }
  });

  return userPerms.has(permission) || userPerms.has("*");
}

/**
 * Check permission by reading actual stored Group objects instead of hardcoded defaults.
 * Matches user.groupIds to the provided groups array to collect permissions.
 */
export function canFromGroups(
  user: User | null | undefined,
  permission: string,
  groups: Group[],
  resource?: { departmentId?: string }
): boolean {
  if (!user || user.status !== "ACTIVE") {
    return false;
  }

  // Admin may create batches, but cannot edit them or provide regulated signatures.
  const isBinderEditOrSign =
    permission.startsWith("binder.edit") ||
    permission.startsWith("sign.");

  const adminGroup = groups.find(
    (g) => g.active && g.role === "ADMIN" && user.groupIds.includes(g.id)
  );
  const isOnlyAdmin = adminGroup !== undefined && user.groupIds.length === 1;
  if (isOnlyAdmin && isBinderEditOrSign) {
    return false;
  }
  if (permission === "movement.perform" && adminGroup) {
    return true;
  }

  // HOD scope restriction
  const hodGroup = groups.find(
    (g) => g.active && g.role === "HOD" && user.groupIds.includes(g.id)
  );
  if (
    hodGroup &&
    !adminGroup &&
    resource &&
    resource.departmentId &&
    resource.departmentId !== user.departmentId
  ) {
    return false;
  }

  // Collect permissions from actual group objects
  const userPerms = new Set<string>();
  for (const group of groups) {
    if (user.groupIds.includes(group.id) && group.active) {
      for (const p of group.permissions) {
        userPerms.add(p);
      }
    }
  }

  return userPerms.has(permission) || userPerms.has("*");
}

const ROLE_PRIORITY: Role[] = ["ADMIN", "QA", "HOD", "INITIATOR"];

/**
 * Roles granted by the user's active groups, highest privilege first.
 */
export function rolesForUser(user: User | null | undefined, groups: Group[]): Role[] {
  if (!user) return [];
  const found = new Set<Role>();

  for (const group of groups) {
    if (group.active && user.groupIds.includes(group.id)) {
      found.add(group.role);
    }
  }

  return ROLE_PRIORITY.filter((role) => found.has(role));
}

export function primaryRole(user: User | null | undefined, groups: Group[]): Role {
  return rolesForUser(user, groups)[0] || "INITIATOR";
}

/**
 * Get all effective permissions for a user
 */
export function getUserPermissions(user: User | null | undefined): string[] {
  if (!user) return [];

  // Check dynamically stored groups first
  const groups = Storage.getMemItem<Group[]>("groups");
  if (groups !== null) {
    const perms = new Set<string>();
    for (const group of groups) {
      if (user.groupIds.includes(group.id) && group.active) {
        for (const p of group.permissions) {
          perms.add(p);
        }
      }
    }
    return Array.from(perms);
  }

  const perms = new Set<string>();
  user.groupIds.forEach((gId) => {
    if (gId.includes("admin")) ROLE_DEFAULT_PERMISSIONS.ADMIN.forEach((p) => perms.add(p));
    if (gId.includes("init")) ROLE_DEFAULT_PERMISSIONS.INITIATOR.forEach((p) => perms.add(p));
    if (gId.includes("hod")) ROLE_DEFAULT_PERMISSIONS.HOD.forEach((p) => perms.add(p));
    if (gId.includes("qa")) ROLE_DEFAULT_PERMISSIONS.QA.forEach((p) => perms.add(p));
  });
  return Array.from(perms);
}

