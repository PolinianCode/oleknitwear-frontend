import { fetchApi, BASE_URL } from "./client";
import type { AuthLoginResponse } from "./types";

interface AuthUser {
    email: string;
    role: "admin" | "customer";
    full_name?: string;
}

export async function login(email: string, password: string): Promise<AuthUser> {
    const res = await fetchApi<AuthLoginResponse>("/api/auth/login", {
        method: "POST",
        body: JSON.stringify({ email, password }),
    });
    return res.user;
}

export async function register(email: string, password: string, fullName?: string): Promise<void> {
    await fetchApi("/api/auth/register", {
        method: "POST",
        body: JSON.stringify({ email, password, full_name: fullName || undefined }),
    });
}

export async function logout(): Promise<void> {
    await fetchApi("/api/auth/logout", { method: "POST" });
}

export async function refreshToken(signal?: AbortSignal): Promise<boolean> {
    try {
        const res = await fetch(`${BASE_URL}/api/auth/refresh`, {
            method: "POST",
            credentials: "include",
            headers: { "Content-Type": "application/json" },
            signal,
        });
        return res.ok;
    } catch (err) {
        if (err instanceof DOMException && err.name === "AbortError") throw err;
        return false;
    }
}
