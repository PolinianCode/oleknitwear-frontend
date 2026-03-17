import useSWR from "swr";
import { getProducts, SWR_KEY_PRODUCTS } from "./products";
import { getCategories, SWR_KEY_CATEGORIES } from "./categories";
import { getUsers, SWR_KEY_USERS } from "./users";
import { getAdminOrders, SWR_KEY_ORDERS } from "./orders";
import type { ApiCategory } from "./types";

export function useAdminProducts(page: number, search: string) {
    const key = `${SWR_KEY_PRODUCTS}?page=${page}&limit=10${search ? `&search=${encodeURIComponent(search)}` : ""}`;
    const { data, error, isLoading, mutate } = useSWR(
        key,
        () => getProducts({ page, limit: 10, search: search || undefined })
    );
    return {
        products: data?.data ?? [],
        meta: data?.meta ?? { page, limit: 10, total: 0, totalPages: 0 },
        error,
        isLoading,
        mutate,
    };
}

export function useCategories() {
    const { data, error, isLoading, mutate } = useSWR<ApiCategory[]>(
        SWR_KEY_CATEGORIES,
        () => getCategories()
    );
    return { categories: data ?? [], error, isLoading, mutate };
}

export function useAdminUsers(page: number, search: string) {
    const key = `${SWR_KEY_USERS}?page=${page}&limit=10${search ? `&search=${encodeURIComponent(search)}` : ""}`;
    const { data, error, isLoading, mutate } = useSWR(
        key,
        () => getUsers({ page, limit: 10, search: search || undefined })
    );
    return {
        users: data?.data ?? [],
        meta: data?.meta ?? { page, limit: 10, total: 0, totalPages: 0 },
        error,
        isLoading,
        mutate,
    };
}

export function useAdminOrders(page: number, search: string, status?: string) {
    const key = `${SWR_KEY_ORDERS}?page=${page}&limit=20${search ? `&search=${encodeURIComponent(search)}` : ""}${status ? `&status=${status}` : ""}`;
    const { data, error, isLoading, mutate } = useSWR(
        key,
        () => getAdminOrders({ page, limit: 20, search: search || undefined, status: status || undefined })
    );
    return {
        orders: data?.data ?? [],
        meta: data?.meta ?? { page, limit: 20, total: 0, totalPages: 0 },
        error,
        isLoading,
        mutate,
    };
}
