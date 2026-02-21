import { mutate } from "swr";
import { fetchApi } from "./client";
import { ApiProduct } from "./types";

export const SWR_KEY_CART = "/api/cart";

export interface CartItemResponse {
    id: string;
    product_id: string;
    quantity: number;
    product: ApiProduct;
}

export interface CartResponse {
    id: string;
    user_id: string;
    items: CartItemResponse[];
}

export async function getCart(): Promise<CartResponse> {
    const res = await fetchApi<{ success: boolean; data: CartResponse }>("/api/cart");
    return res.data;
}

export async function addToCart(product_id: string, quantity: number): Promise<void> {
    await fetchApi("/api/cart/items", {
        method: "POST",
        body: JSON.stringify({ product_id, quantity }),
    });
    await mutate(SWR_KEY_CART);
}

export async function updateCartItem(id: string, quantity: number): Promise<void> {
    await fetchApi(`/api/cart/items/${id}`, {
        method: "PATCH",
        body: JSON.stringify({ quantity }),
    });
    await mutate(SWR_KEY_CART);
}

export async function removeCartItem(id: string): Promise<void> {
    await fetchApi(`/api/cart/items/${id}`, {
        method: "DELETE",
    });
    await mutate(SWR_KEY_CART);
}

export async function syncCart(items: { product_id: string; quantity: number }[]): Promise<void> {
    if (items.length === 0) return;
    await fetchApi("/api/cart/sync", {
        method: "POST",
        body: JSON.stringify({ items }),
    });
    await mutate(SWR_KEY_CART);
}
