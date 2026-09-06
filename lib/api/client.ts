const isServer = typeof window === "undefined";
export const BASE_URL = isServer ? (process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080") : "";

const CLOCK_SKEW_MS = 60_000;

export class ApiError extends Error {
    status: number;

    constructor(status: number, message: string) {
        super(message);
        this.status = status;
    }
}

export function readSessionExp(): number | null {
    if (isServer) return null;
    const match = document.cookie.match(/(?:^|;\s*)session_exp=(\d+)/);
    return match ? Number(match[1]) : null;
}

function hasLiveAccessToken(): boolean {
    const exp = readSessionExp();
    return exp !== null && exp * 1000 > Date.now() + CLOCK_SKEW_MS;
}

async function postRefresh(): Promise<boolean> {
    try {
        const res = await fetch(`${BASE_URL}/api/auth/refresh`, {
            method: "POST",
            credentials: "include",
            headers: { "Content-Type": "application/json" },
        });
        return res.ok;
    } catch {
        return false;
    }
}

let refreshPromise: Promise<boolean> | null = null;

export async function refreshSession(): Promise<boolean> {
    if (isServer) return false;

    if (!refreshPromise) {
        refreshPromise = (async () => {
            if (typeof navigator !== "undefined" && navigator.locks) {
                const granted: unknown = await navigator.locks.request("ole-auth-refresh", async () => {
                    if (hasLiveAccessToken()) return true;
                    return postRefresh();
                });
                return granted === true;
            }
            return postRefresh();
        })().finally(() => {
            refreshPromise = null;
        });
    }

    return refreshPromise;
}

export async function fetchApi<T>(
    endpoint: string,
    options?: RequestInit
): Promise<T> {
    const url = `${BASE_URL}${endpoint}`;
    const opts: RequestInit = {
        ...options,
        credentials: "include",
        headers: {
            "Content-Type": "application/json",
            ...options?.headers,
        },
    };

    let res: Response;
    try {
        res = await fetch(url, opts);
    } catch (err) {
        if (err instanceof DOMException && err.name === "AbortError") throw err;
        throw new ApiError(0, "Network error");
    }

    if (!isServer && res.status === 401 && !endpoint.startsWith("/api/auth/")) {
        const isRefreshed = await refreshSession();

        if (isRefreshed) {
            res = await fetch(url, opts);
        } else {
            throw new ApiError(401, "Session expired");
        }
    }

    const body = await res.text();
    let json: { success?: boolean; error?: unknown } | null = null;

    if (body) {
        try {
            json = JSON.parse(body);
        } catch {
            throw new ApiError(
                res.status,
                res.ok ? "Malformed response from server" : `Request failed (${res.status})`
            );
        }
    }

    if (!res.ok || json?.success === false) {
        let errorMessage = "Something went wrong";
        if (json?.error) {
            if (typeof json.error === "string") errorMessage = json.error;
            else if (typeof json.error === "object") errorMessage = JSON.stringify(json.error);
            else errorMessage = String(json.error);
        }
        throw new ApiError(res.status, errorMessage);
    }

    return json as T;
}
