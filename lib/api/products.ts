import { mutate } from "swr";
import { fetchApi } from "./client";
import type { ApiProduct, ApiResponse, CreateProductPayload, UpdateProductPayload } from "./types";

export const SWR_KEY_PRODUCTS = "/api/products";

export async function getProducts(signal?: AbortSignal): Promise<ApiProduct[]> {
    const res = await fetchApi<ApiResponse<ApiProduct[]>>("/api/products", { signal });
    return res.data;
}

export async function createProduct(data: CreateProductPayload): Promise<ApiProduct> {
    const res = await fetchApi<ApiResponse<ApiProduct>>("/api/products", {
        method: "POST",
        body: JSON.stringify(data),
    });
    await mutate(SWR_KEY_PRODUCTS);
    return res.data;
}

export async function updateProduct(id: string, data: UpdateProductPayload): Promise<ApiProduct> {
    const res = await fetchApi<ApiResponse<ApiProduct>>(`/api/products/${id}`, {
        method: "PUT",
        body: JSON.stringify(data),
    });
    await mutate(SWR_KEY_PRODUCTS);
    return res.data;
}

export async function deleteProduct(id: string): Promise<void> {
    await fetchApi(`/api/products/${id}`, { method: "DELETE" });
    await mutate(SWR_KEY_PRODUCTS);
}
