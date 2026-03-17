import { fetchApi } from "./client";
import type { ApiCategory, ApiResponse, CreateCategoryPayload, UpdateCategoryPayload } from "./types";

export const SWR_KEY_CATEGORIES = "/api/categories";

async function invalidateCategories() {
    const { mutate } = await import("swr");
    await mutate((key: unknown) => typeof key === "string" && key.startsWith(SWR_KEY_CATEGORIES));
}

export async function getCategories(signal?: AbortSignal): Promise<ApiCategory[]> {
    const res = await fetchApi<ApiResponse<ApiCategory[]>>("/api/categories", { signal });
    return res.data;
}

export async function createCategory(data: CreateCategoryPayload): Promise<ApiCategory> {
    const res = await fetchApi<ApiResponse<ApiCategory>>("/api/categories", {
        method: "POST",
        body: JSON.stringify(data),
    });
    await invalidateCategories();
    return res.data;
}

export async function updateCategory(id: string, data: UpdateCategoryPayload): Promise<ApiCategory> {
    const res = await fetchApi<ApiResponse<ApiCategory>>(`/api/categories/${id}`, {
        method: "PUT",
        body: JSON.stringify(data),
    });
    await invalidateCategories();
    return res.data;
}

export async function deleteCategory(id: string): Promise<void> {
    await fetchApi(`/api/categories/${id}`, { method: "DELETE" });
    await invalidateCategories();
}
