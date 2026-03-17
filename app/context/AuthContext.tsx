"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import * as authApi from "@/lib/api/auth";

interface User {
  email: string;
  role: "admin" | "customer";
  full_name?: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, fullName?: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const cached = localStorage.getItem("ole_user");
    if (!cached) {
      setIsLoading(false);
      return;
    }

    let cachedUser: User | null = null;
    try {
      cachedUser = JSON.parse(cached);
    } catch {
      localStorage.removeItem("ole_user");
      setIsLoading(false);
      return;
    }

    const controller = new AbortController();

    const refresh = async () => {
      try {
        const ok = await authApi.refreshToken(controller.signal);
        if (ok) {
          // Only trust cached user data after the server confirms the session is valid
          setUser(cachedUser);
        } else {
          localStorage.removeItem("ole_user");
        }
      } catch (err) {
        if (err instanceof DOMException && err.name === "AbortError") return;
        localStorage.removeItem("ole_user");
      } finally {
        setIsLoading(false);
      }
    };

    refresh();

    return () => controller.abort();
  }, []);

  useEffect(() => {
    if (user) {
      localStorage.setItem("ole_user", JSON.stringify(user));
    } else {
      localStorage.removeItem("ole_user");
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
