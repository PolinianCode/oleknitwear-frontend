import { getProducts } from "@/lib/api/products";
import { getCategories } from "@/lib/api/categories";
import { MetadataRoute } from 'next';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {

    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://ole-knitwear.com';

    let productUrls: MetadataRoute.Sitemap = [];
    let categoryUrls: MetadataRoute.Sitemap = [];

    try {
        const [products, categories] = await Promise.all([getProducts(), getCategories()]);

        productUrls = products.map((product) => ({
            url: `${baseUrl}/shop/${product.slug}`,
            lastModified: new Date(product.updated_at),
            changeFrequency: 'weekly' as const,
            priority: 0.8,
        }));

        categoryUrls = categories.map((category) => ({
            url: `${baseUrl}/shop?cat=${category.slug}`,
            lastModified: new Date(),
            changeFrequency: 'weekly' as const,
            priority: 0.7,
        }));
    } catch {
        // API unavailable, return static sitemap
    }

    return [
        {
            url: baseUrl,
            lastModified: new Date(),
            changeFrequency: 'weekly' as const,
            priority: 1,
        },
        {
            url: `${baseUrl}/shop`,
            lastModified: new Date(),
            changeFrequency: 'daily' as const,
            priority: 0.9,
        },
        ...categoryUrls,
        ...productUrls,
        {
            url: `${baseUrl}/care`,
            lastModified: new Date(),
            changeFrequency: 'yearly' as const,
            priority: 0.6,
        },
        {
            url: `${baseUrl}/sizing-delivery`,
            lastModified: new Date(),
            changeFrequency: 'yearly' as const,
            priority: 0.6,
        },
        {
            url: `${baseUrl}/contact-us`,
            lastModified: new Date(),
            changeFrequency: 'yearly' as const,
            priority: 0.5,
        },
    ];
}
