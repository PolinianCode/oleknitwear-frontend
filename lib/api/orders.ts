import { fetchApi } from "./client";
import type { ApiOrder, ApiPaginatedResponse, ApiResponse, PaymentFormData } from "./types";

export const SWR_KEY_ORDERS = "/api/orders";

export interface CreateOrderPayload {
    customer_name: string;
    customer_email: string;
    customer_phone?: string;
    shipping_country: string;
    shipping_city: string;
    shipping_street: string;
    shipping_apartment?: string;
    shipping_postal_code: string;
    currency: "UAH" | "PLN" | "EUR" | "USD";
    language?: string;
    items: { product_id: string; quantity: number }[];
}

export interface GetOrdersParams {
    page?: number;
    limit?: number;
    status?: string;
    search?: string;
}

export async function createOrder(data: CreateOrderPayload): Promise<{ order: ApiOrder; paymentForm: PaymentFormData }> {
    const res = await fetchApi<ApiResponse<{ order: ApiOrder; paymentForm: PaymentFormData }>>("/api/orders", {
        method: "POST",
        body: JSON.stringify(data),
    });
    return res.data;
}

export async function getMyOrders(): Promise<ApiOrder[]> {
    const res = await fetchApi<ApiResponse<ApiOrder[]>>("/api/orders/my");
    return res.data;
}

export async function getMyOrder(ref: string): Promise<ApiOrder> {
    const res = await fetchApi<ApiResponse<ApiOrder>>(`/api/orders/my/${ref}`);
    return res.data;
}

export async function getAdminOrders(params?: GetOrdersParams): Promise<{ data: ApiOrder[]; meta: { page: number; limit: number; total: number; totalPages: number } }> {
    const query = new URLSearchParams();
    if (params?.page) query.set("page", String(params.page));
    if (params?.limit) query.set("limit", String(params.limit));
    if (params?.status) query.set("status", params.status);
    if (params?.search) query.set("search", params.search);
    const qs = query.toString();
    const res = await fetchApi<ApiPaginatedResponse<ApiOrder[]>>(qs ? `/api/orders?${qs}` : "/api/orders");
    return { data: res.data, meta: res.meta };
}

export async function updateOrderStatus(id: string, status: string, notes?: string): Promise<ApiOrder> {
    const res = await fetchApi<ApiResponse<ApiOrder>>(`/api/orders/${id}/status`, {
        method: "PATCH",
        body: JSON.stringify({ status, notes }),
    });
    return res.data;
}
