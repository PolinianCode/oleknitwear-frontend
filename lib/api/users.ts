import { fetchApi } from "./client";
import type { ApiUser, ApiResponse } from "./types";

export const SWR_KEY_USERS = "/api/users";

export async function getUsers(signal?: AbortSignal): Promise<ApiUser[]> {
    const res = await fetchApi<ApiResponse<ApiUser[]>>("/api/users", { signal });
    return res.data;
}
