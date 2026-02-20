import { mutate } from "swr";
import { fetchApi } from "./client";
import type { ApiCategory, ApiResponse, CreateCategoryPayload, UpdateCategoryPayload } from "./types";

export const SWR_KEY_CATEGORIES = "/api/categories";

export async function getCategories(signal?: AbortSignal): Promise<ApiCategory[]> {
    const res = await fetchApi<ApiResponse<ApiCategory[]>>("/api/categories", { signal });
    return res.data;
}

export async function createCategory(data: CreateCategoryPayload): Promise<ApiCategory> {
    const res = await fetchApi<ApiResponse<ApiCategory>>("/api/categories", {
        method: "POST",
        body: JSON.stringify(data),
    });
    await mutate(SWR_KEY_CATEGORIES);
    return res.data;
}

export async function updateCategory(id: string, data: UpdateCategoryPayload): Promise<ApiCategory> {
    const res = await fetchApi<ApiResponse<ApiCategory>>(`/api/categories/${id}`, {
        method: "PUT",
        body: JSON.stringify(data),
    });
    await mutate(SWR_KEY_CATEGORIES);
    return res.data;
}

export async function deleteCategory(id: string): Promise<void> {
    await fetchApi(`/api/categories/${id}`, { method: "DELETE" });
    await mutate(SWR_KEY_CATEGORIES);
}
