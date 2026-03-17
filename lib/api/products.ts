import { fetchApi } from "./client";
import type { ApiProduct, ApiPaginatedResponse, ApiPaginationMeta, ApiResponse, CreateProductPayload, UpdateProductPayload } from "./types";

export const SWR_KEY_PRODUCTS = "/api/products";

async function invalidateProducts() {
    const { mutate } = await import("swr");
    // Invalidate base key and all paginated/filtered keys
    await mutate((key: unknown) => typeof key === "string" && key.startsWith(SWR_KEY_PRODUCTS));
}

export interface GetProductsParams {
    page?: number;
    limit?: number;
    categoryId?: number;
    search?: string;
    isNew?: boolean;
    isSale?: boolean;
    isInStock?: boolean;
    isPreOrder?: boolean;
    signal?: AbortSignal;
}

export async function getProducts(params?: GetProductsParams): Promise<{ data: ApiProduct[]; meta: ApiPaginationMeta }> {
    const query = new URLSearchParams();
    if (params?.page && params.page > 1) query.set("page", String(params.page));
    if (params?.limit) query.set("limit", String(params.limit));
    if (params?.categoryId) query.set("category_id", String(params.categoryId));
    if (params?.search) query.set("search", params.search);
    if (params?.isNew) query.set("is_new", "true");
    if (params?.isSale) query.set("is_sale", "true");
    if (params?.isInStock) query.set("is_in_stock", "true");
    if (params?.isPreOrder) query.set("is_pre_order", "true");
    const qs = query.toString();
    const url = qs ? `/api/products?${qs}` : "/api/products";
    const res = await fetchApi<ApiPaginatedResponse<ApiProduct[]>>(url, { signal: params?.signal });
    return { data: res.data, meta: res.meta };
}

export async function getFeaturedProducts(): Promise<ApiProduct[]> {
    const res = await fetchApi<ApiResponse<ApiProduct[]>>("/api/products/featured");
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
