import { fetchApi } from "./client";
import type { ApiUser, ApiPaginatedResponse, ApiPaginationMeta } from "./types";

export const SWR_KEY_USERS = "/api/users";

export interface GetUsersParams {
    page?: number;
    limit?: number;
    search?: string;
    signal?: AbortSignal;
}

export async function getUsers(params?: GetUsersParams): Promise<{ data: ApiUser[]; meta: ApiPaginationMeta }> {
    const query = new URLSearchParams();
    if (params?.page && params.page > 1) query.set("page", String(params.page));
    if (params?.limit) query.set("limit", String(params.limit));
    if (params?.search) query.set("search", params.search);
    const qs = query.toString();
    const url = qs ? `/api/users?${qs}` : "/api/users";
    const res = await fetchApi<ApiPaginatedResponse<ApiUser[]>>(url, { signal: params?.signal });
    return { data: res.data, meta: res.meta };
}
