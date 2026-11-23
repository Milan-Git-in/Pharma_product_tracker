/**
 * Session Context & Active Role Management
 * Identity is a user id in the directory. Role and permissions are derived
 * from that user's live group membership, and both refresh when users or
 * groups are written.
 */

import React, { createContext, useContext, useState, useEffect, useRef } from "react";
import { Role, User, Group } from "@/domain/types";
import { Storage } from "./storage";
import { initializeSeedData } from "@/config/seed";
import { TimeService } from "./time";
import { fmtDateTime } from "./format";
import { rolesForUser } from "./permission";
import { mockApi } from "@/api";

import { getAllTerms, subscribeTerms, TermsDictionary } from "@/config/terms";

interface SessionContextType {
  currentRole: Role;
  currentUser: User | null;
  ready: boolean;
  setRole: (role: Role) => Promise<boolean>;
  login: (user: User) => Promise<boolean>;
  logout: () => Promise<void>;
  isDevMode: boolean;
  setDevMode: (active: boolean) => void;
  serverTimeStr: string;
  terms: TermsDictionary;
  term: (key: keyof TermsDictionary) => string;
  resetAllData: () => Promise<void>;
}

const SessionContext = createContext<SessionContextType | null>(null);

const CANONICAL_USER_ID: Record<Role, string> = {
  ADMIN: "u-admin1",
  INITIATOR: "u-init1",
  HOD: "u-hod1",
  QA: "u-qa1",
};

const ROLES: Role[] = ["ADMIN", "INITIATOR", "HOD", "QA"];

function readStoredRole(): Role | null {
  if (typeof window === "undefined") return null;
  const saved = window.localStorage.getItem("pts_active_role") as Role;
  return ROLES.includes(saved) ? saved : null;
}

function readStoredUserId(): string | null {
  if (typeof window === "undefined") return null;
  if (window.localStorage.getItem("pts_signed_out") === "1") return null;
  const id = window.localStorage.getItem("pts_active_user_id");
  if (id) return id;
  const legacy = window.localStorage.getItem("pts_active_user");
  if (!legacy) return null;
  try {
    const parsed = JSON.parse(legacy);
    return typeof parsed?.id === "string" ? parsed.id : null;
  } catch {
    return null;
  }
}

function persistSession(user: User | null, role: Role) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem("pts_active_role", role);
  if (user) {
    window.localStorage.setItem("pts_active_user_id", user.id);
    window.localStorage.removeItem("pts_signed_out");
    window.localStorage.removeItem("pts_active_user");
  } else {
    window.localStorage.removeItem("pts_active_user_id");
    window.localStorage.removeItem("pts_active_user");
    window.localStorage.setItem("pts_signed_out", "1");
  }
}

function userForRole(users: User[], groups: Group[], role: Role): User | null {
  const groupIds = new Set(
    groups.filter((group) => group.active && group.role === role).map((group) => group.id)
  );
  const holdsRole = (user: User) =>
    user.status === "ACTIVE" && user.groupIds.some((id) => groupIds.has(id));

  return (
    users.find((user) => user.id === CANONICAL_USER_ID[role] && holdsRole(user)) ||
    users.find(holdsRole) ||
    null
  );
}

export const SessionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentRole, setCurrentRole] = useState<Role>("ADMIN");
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [ready, setReady] = useState(false);
  const [isDevMode, setIsDevMode] = useState(true);
  const [serverTimeStr, setServerTimeStr] = useState("26/02/2025 14:30");
  const [terms, setTermsState] = useState<TermsDictionary>(getAllTerms());

  const userIdRef = useRef<string | null>(null);
  const roleRef = useRef<Role>("ADMIN");

  useEffect(() => {
    return subscribeTerms((latest) => {
      setTermsState(latest);
    });
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const searchParams = new URLSearchParams(window.location.search);
    const hashParams = window.location.hash.includes("dev=1");
    if (searchParams.get("dev") === "1" || hashParams) {
      setIsDevMode(true);
    }
  }, []);

  useEffect(() => {
    const updateTime = () => {
      setServerTimeStr(fmtDateTime(TimeService.now()));
    };
    updateTime();
    const timer = setInterval(updateTime, 1000);
    return () => clearInterval(timer);
  }, []);

  const commit = (user: User | null, role: Role) => {
    userIdRef.current = user?.id ?? null;
    roleRef.current = role;
    setCurrentUser(user ? { ...user } : null);
    setCurrentRole(role);
    persistSession(user, role);
  };

  const syncFromDirectory = () => {
    const id = userIdRef.current;
    if (!id) return;
    const users = Storage.getMemItem<User[]>("users");
    const groups = Storage.getMemItem<Group[]>("groups");
    if (!users || !groups) return;

    const fresh = users.find((user) => user.id === id);
    if (!fresh || fresh.status !== "ACTIVE") {
      commit(null, roleRef.current);
      return;
    }

    const roles = rolesForUser(fresh, groups);
    if (roles.length === 0) {
      commit(null, roleRef.current);
      return;
    }
    const nextRole = roles.includes(roleRef.current) ? roleRef.current : roles[0];
    commit(fresh, nextRole);
  };

  useEffect(() => {
    let cancelled = false;

    const init = async () => {
      await initializeSeedData(false);
      await Storage.getItem<Group[]>("groups");
      await Storage.getItem<User[]>("users");
      if (cancelled) return;

      const storedId = readStoredUserId();
      userIdRef.current = storedId;
      const storedRole = readStoredRole();
      if (storedRole) roleRef.current = storedRole;

      if (storedId) {
        syncFromDirectory();
      }
      setReady(true);
    };

    init();

    const unsubscribe = Storage.subscribe((key) => {
      if (key === "users" || key === "groups") {
        syncFromDirectory();
      }
    });

    return () => {
      cancelled = true;
      unsubscribe();
    };
  }, []);

  const login = async (user: User): Promise<boolean> => {
    const users = (await Storage.getItem<User[]>("users")) || [];
    const groups = (await Storage.getItem<Group[]>("groups")) || [];
    const freshUser = users.find((candidate) => candidate.id === user.id);
    const roles = rolesForUser(freshUser, groups);
    if (!freshUser || freshUser.status !== "ACTIVE" || roles.length === 0) {
      commit(null, roleRef.current);
      return false;
    }
    commit(freshUser, roles[0]);
    return true;
  };

  const logout = async () => {
    const user = currentUser;
    commit(null, roleRef.current);
    if (user) {
      try {
        await mockApi.logout(user);
      } catch {
        // Session is already cleared locally if the audit write fails.
      }
    }
  };

  const handleSetRole = async (role: Role): Promise<boolean> => {
    const users = (await Storage.getItem<User[]>("users")) || [];
    const groups = (await Storage.getItem<Group[]>("groups")) || [];
    const match = userForRole(users, groups, role);
    if (!match) return false;
    commit(match, role);
    return true;
  };

  const handleResetData = async () => {
    await initializeSeedData(true);
    await Storage.getItem<Group[]>("groups");
    await Storage.getItem<User[]>("users");
    const restored = await handleSetRole(roleRef.current);
    if (!restored) {
      await handleSetRole("ADMIN");
    }
  };

  const term = (key: keyof TermsDictionary) => {
    return terms[key] || key;
  };

  return (
    <SessionContext.Provider
      value={{
        currentRole,
        currentUser,
        ready,
        setRole: handleSetRole,
        login,
        logout,
        isDevMode,
        setDevMode: setIsDevMode,
        serverTimeStr,
        terms,
        term,
        resetAllData: handleResetData,
      }}
    >
      {children}
    </SessionContext.Provider>
  );
};

const FALLBACK_DEFAULT_TERMS = getAllTerms();

export function useSession() {
  const context = useContext(SessionContext);
  if (!context) {
    return {
      currentRole: "INITIATOR" as Role,
      currentUser: null as User | null,
      ready: false,
      setRole: async () => false,
      login: async () => false,
      logout: async () => {},
      isDevMode: true,
      setDevMode: () => {},
      serverTimeStr: "26/02/2025 14:30",
      terms: FALLBACK_DEFAULT_TERMS,
      term: (key: keyof TermsDictionary) => FALLBACK_DEFAULT_TERMS[key] || key,
      resetAllData: async () => {},
    };
  }
  return context;
}
