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

export interface ApiPaginationMeta {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
}

export interface ApiPaginatedResponse<T> {
    success: boolean;
    data: T;
    meta: ApiPaginationMeta;
}

export type OrderStatus = 'pending' | 'processing' | 'paid' | 'shipped' | 'delivered' | 'cancelled' | 'refunded';
export type PaymentStatus = 'pending' | 'paid' | 'failed' | 'refunded';

export interface ApiOrderItem {
    id: string;
    product_id: string | null;
    product_name: string;
    product_slug: string;
    product_image: string | null;
    unit_price: number;
    quantity: number;
    total_price: number;
    created_at: string;
}

export interface ApiOrder {
    id: string;
    user_id: string | null;
    order_number: string;
    status: OrderStatus;
    customer_email: string;
    customer_name: string;
    customer_phone: string | null;
    shipping_country: string;
    shipping_city: string;
    shipping_street: string;
    shipping_apartment: string | null;
    shipping_postal_code: string;
    payment_method: string;
    payment_status: PaymentStatus;
    currency: string;
    subtotal: number;
    total: number;
    notes: string | null;
    items: ApiOrderItem[];
    created_at: string;
    updated_at: string;
}

export interface PaymentFormData {
    wayforpayUrl: string;
    fields: Record<string, string | string[]>;
}

export interface AuthLoginResponse {
    success: boolean;
    user: { email: string; role: "admin" | "customer"; full_name?: string };
}

export interface UploadPresignedResponse {
    success: boolean;
    data: { url: string; key: string; publicUrl: string };
}
