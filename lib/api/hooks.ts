import useSWR from "swr";
import { getProducts, SWR_KEY_PRODUCTS } from "./products";
import { getCategories, SWR_KEY_CATEGORIES } from "./categories";
import { getUsers, SWR_KEY_USERS } from "./users";
import type { ApiProduct, ApiCategory, ApiUser } from "./types";

export function useProducts() {
    const { data, error, isLoading, mutate } = useSWR<ApiProduct[]>(
        SWR_KEY_PRODUCTS,
        () => getProducts()
    );
    return { products: data ?? [], error, isLoading, mutate };
}

export function useCategories() {
    const { data, error, isLoading, mutate } = useSWR<ApiCategory[]>(
        SWR_KEY_CATEGORIES,
        () => getCategories()
    );
    return { categories: data ?? [], error, isLoading, mutate };
}

export function useUsers() {
    const { data, error, isLoading, mutate } = useSWR<ApiUser[]>(
        SWR_KEY_USERS,
        () => getUsers()
    );
    return { users: data ?? [], error, isLoading, mutate };
}
