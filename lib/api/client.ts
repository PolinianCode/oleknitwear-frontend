export const BASE_URL = "";

export class ApiError extends Error {
    status: number;

    constructor(status: number, message: string) {
        super(message);
        this.status = status;
    }
}

let refreshPromise: Promise<boolean> | null = null;

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

    if (res.status === 401 && !endpoint.startsWith("/api/auth/")) {
        if (!refreshPromise) {
            refreshPromise = fetch(`${BASE_URL}/api/auth/refresh`, {
                method: "POST",
                credentials: "include",
                headers: { "Content-Type": "application/json" },
            })
                .then((r) => r.ok)
                .catch(() => false)
                .finally(() => {
                    refreshPromise = null;
                });
        }

        const isRefreshed = await refreshPromise;

        if (isRefreshed) {
            res = await fetch(url, opts);
        } else {
            throw new ApiError(401, "Session expired");
        }
    }

    const json = await res.json();

    if (!res.ok || json.success === false) {
        let errorMessage = "Something went wrong";
        if (json.error) {
            if (typeof json.error === "string") errorMessage = json.error;
            else if (typeof json.error === "object") errorMessage = JSON.stringify(json.error);
            else errorMessage = String(json.error);
        }
        throw new ApiError(res.status, errorMessage);
    }

    return json as T;
}
