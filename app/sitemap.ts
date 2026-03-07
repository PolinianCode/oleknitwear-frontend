import { getProducts } from "@/lib/api/products";
import { getCategories } from "@/lib/api/categories";
import { MetadataRoute } from 'next';

export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {

    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://ole-knitwear.com';

    let productUrls: MetadataRoute.Sitemap = [];
    let categoryUrls: MetadataRoute.Sitemap = [];
    let latestProductUpdate = new Date();

    try {
        const [products, categories] = await Promise.all([getProducts(), getCategories()]);

        if (products.length > 0) {
            latestProductUpdate = new Date(
                Math.max(...products.map(p => new Date(p.updated_at).getTime()))
            );
        }

        productUrls = products.map((product) => {
            const images = product.product_images
                ?.sort((a, b) => a.sort_order - b.sort_order)
                .map(img => img.url.startsWith('http') ? img.url : `${baseUrl}${img.url}`) ?? [];

            return {
                url: `${baseUrl}/shop/${product.slug}`,
                lastModified: new Date(product.updated_at),
                changeFrequency: 'weekly' as const,
                priority: 0.8,
                images,
            };
        });

        categoryUrls = categories.map((category) => {
            const categoryProducts = products.filter(
                p => String(p.category_id) === String(category.id)
            );
            const lastModified = categoryProducts.length > 0
                ? new Date(Math.max(...categoryProducts.map(p => new Date(p.updated_at).getTime())))
                : new Date();

            return {
                url: `${baseUrl}/shop/category/${category.slug}`,
                lastModified,
                changeFrequency: 'weekly' as const,
                priority: 0.7,
            };
        });
    } catch {
        // API unavailable, return static sitemap
    }

    return [
        {
            url: baseUrl,
            lastModified: latestProductUpdate,
            changeFrequency: 'weekly' as const,
            priority: 1,
        },
        {
            url: `${baseUrl}/shop`,
            lastModified: latestProductUpdate,
            changeFrequency: 'daily' as const,
            priority: 0.9,
        },
        ...categoryUrls,
        ...productUrls,
        {
            url: `${baseUrl}/care`,
            lastModified: new Date('2025-01-01'),
            changeFrequency: 'yearly' as const,
            priority: 0.6,
        },
        {
            url: `${baseUrl}/sizing-delivery`,
            lastModified: new Date('2025-01-01'),
            changeFrequency: 'yearly' as const,
            priority: 0.6,
        },
        {
            url: `${baseUrl}/contact-us`,
            lastModified: new Date('2025-01-01'),
            changeFrequency: 'yearly' as const,
            priority: 0.5,
        },
    ];
}
