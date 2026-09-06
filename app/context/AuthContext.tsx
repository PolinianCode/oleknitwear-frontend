"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import * as authApi from "@/lib/api/auth";
import type { AuthUser } from "@/lib/api/auth";
import { readSessionExp, refreshSession } from "@/lib/api/client";

const CLOCK_SKEW_MS = 60_000;
const CACHE_KEY = "ole_user";

interface AuthContextType {
  user: AuthUser | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, fullName?: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

function readCachedUser(): AuthUser | null {
  try {
    const cached = localStorage.getItem(CACHE_KEY);
    return cached ? (JSON.parse(cached) as AuthUser) : null;
  } catch {
    localStorage.removeItem(CACHE_KEY);
    return null;
  }
}

function isAbortError(err: unknown): boolean {
  return err instanceof DOMException && err.name === "AbortError";
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const controller = new AbortController();
    let cancelled = false;

    const init = async () => {
      const cached = readCachedUser();
      const exp = readSessionExp();

      if (exp === null && !cached) {
        setIsLoading(false);
        return;
      }

      const hasLiveToken = exp !== null && exp * 1000 > Date.now() + CLOCK_SKEW_MS;

      if (hasLiveToken && cached) {
        setUser(cached);
        setIsLoading(false);
      }

      try {
        if (!hasLiveToken) {
          const refreshed = await refreshSession();
          if (cancelled) return;

          if (!refreshed) {
            setUser(null);
            setIsLoading(false);
            return;
          }
        }

        const confirmed = await authApi.getMe(controller.signal);
        if (cancelled) return;
        setUser(confirmed);
      } catch (err) {
        if (isAbortError(err) || cancelled) return;
        setUser(null);
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    };

    init();

    return () => {
      cancelled = true;
      controller.abort();
    };
  }, []);

  useEffect(() => {
    if (user) {
      localStorage.setItem(CACHE_KEY, JSON.stringify(user));
    } else {
      localStorage.removeItem(CACHE_KEY);
    }
  }, [user]);

  const login = useCallback(async (email: string, password: string) => {
    const authUser = await authApi.login(email, password);
    setUser(authUser);
  }, []);

  const register = useCallback(async (email: string, password: string, fullName?: string) => {
    await authApi.register(email, password, fullName || undefined);
  }, []);

  const logout = useCallback(async () => {
    try {
      await authApi.logout();
    } catch {
    }
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider value={{ user, isLoading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};
