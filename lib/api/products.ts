import { fetchApi } from "./client";
import type { ApiProduct, ApiResponse, CreateProductPayload, UpdateProductPayload } from "./types";

export const SWR_KEY_PRODUCTS = "/api/products";

async function invalidateProducts() {
    const { mutate } = await import("swr");
    await mutate(SWR_KEY_PRODUCTS);
}

export async function getProducts(signal?: AbortSignal, categoryId?: number): Promise<ApiProduct[]> {
    const params = new URLSearchParams();
    if (categoryId) params.set("category_id", String(categoryId));
    const query = params.toString();
    const url = query ? `/api/products?${query}` : "/api/products";
    const res = await fetchApi<ApiResponse<ApiProduct[]>>(url, { signal });
    return res.data;
}

export async function getProduct(id: string): Promise<ApiProduct> {
    const res = await fetchApi<ApiResponse<ApiProduct>>(`/api/products/${id}`);
    return res.data;
}

export async function getProductBySlug(slug: string): Promise<ApiProduct> {
    const res = await fetchApi<ApiResponse<ApiProduct>>(`/api/products/by-slug/${encodeURIComponent(slug)}`);
    return res.data;
}

export async function createProduct(data: CreateProductPayload): Promise<ApiProduct> {
    const res = await fetchApi<ApiResponse<ApiProduct>>("/api/products", {
        method: "POST",
        body: JSON.stringify(data),
    });
    await invalidateProducts();
    return res.data;
}

export async function updateProduct(id: string, data: UpdateProductPayload): Promise<ApiProduct> {
    const res = await fetchApi<ApiResponse<ApiProduct>>(`/api/products/${id}`, {
        method: "PUT",
        body: JSON.stringify(data),
    });
    await invalidateProducts();
    return res.data;
}

export async function deleteProduct(id: string): Promise<void> {
    await fetchApi(`/api/products/${id}`, { method: "DELETE" });
    await invalidateProducts();
}
