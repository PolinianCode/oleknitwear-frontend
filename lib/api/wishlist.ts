import { mutate } from "swr";
import { fetchApi } from "./client";
import { ApiProduct } from "./types";

export const SWR_KEY_WISHLIST = "/api/wishlist";

export interface WishlistItemResponse {
    id: string;
    product_id: string;
    created_at: string;
    product: ApiProduct;
}

export interface WishlistResponse {
    id: string;
    user_id: string;
    items: WishlistItemResponse[];
}

export async function getWishlist(): Promise<WishlistResponse> {
    const res = await fetchApi<{ success: boolean; data: WishlistResponse }>("/api/wishlist");
    return res.data;
}

export async function toggleWishlist(product_id: string): Promise<{ action: "added" | "removed"; wishlist: WishlistResponse }> {
    const res = await fetchApi<{ success: boolean; data: { action: "added" | "removed"; wishlist: WishlistResponse } }>("/api/wishlist/toggle", {
        method: "POST",
        body: JSON.stringify({ product_id }),
    });
    await mutate(SWR_KEY_WISHLIST);
    return res.data;
}

export async function clearWishlist(): Promise<void> {
    await fetchApi("/api/wishlist", {
        method: "DELETE",
    });
    await mutate(SWR_KEY_WISHLIST);
}
