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
    price: number;
    category_id: number;
    featured: boolean;
    metadata?: Record<string, unknown>;
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
    price: number;
    category_id: number;
    featured?: boolean;
    metadata?: Record<string, string>;
    images: { url: string; sort_order: number }[];
}

export interface UpdateProductPayload {
    name?: string;
    description?: string;
    price?: number;
    category_id?: number;
    featured?: boolean;
    metadata?: Record<string, string>;
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
