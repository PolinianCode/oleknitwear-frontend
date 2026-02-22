export interface ProductImage {
    id: string;
    product_id: string;
    url: string;
    sort_order: number;
    created_at: string;
}

export interface ApiProduct {
    id: string;
    name: string;
    slug: string;
    description?: string;
    price_uah: number;
    price_pln: number;
    price_eur: number;
    price_usd: number;
    is_new: boolean;
    is_sale: boolean;
    sale_price_uah?: number | null;
    sale_price_pln?: number | null;
    sale_price_eur?: number | null;
    sale_price_usd?: number | null;
    category_id: number;
    featured: boolean;
    is_in_stock: boolean;
    is_pre_order: boolean;
    metadata?: Record<string, string>;
    created_at: string;
    updated_at: string;
    product_images: ProductImage[];
}

export interface ApiCategory {
    id: string;
    name: string;
    slug: string;
    description: string;
    created_at: string;
}

export interface ApiUser {
    id: string;
    email: string;
    full_name: string;
    role: "admin" | "customer";
    created_at: string;
    updated_at: string;
}

export interface MetadataEntry {
    key: string;
    value: string;
}

export interface CreateProductPayload {
    name: string;
    description?: string;
    price_uah: number;
    price_pln: number;
    price_eur: number;
    price_usd: number;
    is_new: boolean;
    is_sale: boolean;
    sale_price_uah?: number | null;
    sale_price_pln?: number | null;
    sale_price_eur?: number | null;
    sale_price_usd?: number | null;
    category_id: number;
    featured?: boolean;
    is_in_stock?: boolean;
    is_pre_order?: boolean;
    metadata?: Record<string, string>;
    images: { url: string; sort_order: number }[];
}

export interface UpdateProductPayload {
    name?: string;
    description?: string;
    price_uah?: number;
    price_pln?: number;
    price_eur?: number;
    price_usd?: number;
    is_new?: boolean;
    is_sale?: boolean;
    sale_price_uah?: number | null;
    sale_price_pln?: number | null;
    sale_price_eur?: number | null;
    sale_price_usd?: number | null;
    category_id?: number;
    featured?: boolean;
    is_in_stock?: boolean;
    is_pre_order?: boolean;
    metadata?: Record<string, string>;
    images?: { id?: string; url: string; sort_order: number }[];
}

export interface CreateCategoryPayload {
    name: string;
    description?: string;
}

export interface UpdateCategoryPayload {
    name?: string;
    description?: string;
}

export interface ApiResponse<T> {
    success: boolean;
    data: T;
}

export interface AuthLoginResponse {
    success: boolean;
    user: { email: string; role: "admin" | "customer"; full_name?: string };
}

export interface UploadPresignedResponse {
    success: boolean;
    data: { url: string; key: string; publicUrl: string };
}
