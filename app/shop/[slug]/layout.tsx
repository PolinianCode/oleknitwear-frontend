import { Metadata } from 'next';
import { getProducts } from '@/lib/api/products';
import { getCategories } from '@/lib/api/categories';

type Props = {
    params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const resolvedParams = await params;

    try {
        const [products, categories] = await Promise.all([getProducts(), getCategories()]);
        const product = products.find((p) => p.slug === resolvedParams.slug);

        if (!product) {
            return {
                title: 'Product Not Found',
                description: 'The product you are looking for could not be found.',
            };
        }

        const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://ole-knitwear.com';
        const productUrl = `${baseUrl}/shop/${product.slug}`;
        const productImages = product.product_images
            ?.sort((a, b) => a.sort_order - b.sort_order)
            .map(img => img.url.startsWith('http') ? img.url : `${baseUrl}${img.url}`) ?? [];

        const category = categories.find(c => String(c.id) === String(product.category_id));

        return {
            title: product.name,
            description: product.description || product.name,
            keywords: [
                product.name,
                category?.name?.toLowerCase() ?? '',
                'handmade knitwear',
                'luxury wool',
            ].filter(Boolean),
            openGraph: {
                title: `${product.name} | Ole Knitwear`,
                description: product.description || product.name,
                url: productUrl,
                type: 'website',
                images: productImages.map((img, index) => ({
                    url: img,
                    width: 800,
                    height: 1000,
                    alt: `${product.name} - Image ${index + 1}`,
                })),
                siteName: 'Ole Knitwear',
            },
            twitter: {
                card: 'summary_large_image',
                title: `${product.name} | Ole Knitwear`,
                description: product.description || product.name,
                images: productImages[0] ? [productImages[0]] : [],
            },
        };
    } catch {
        return {
            title: 'Product',
            description: 'Ole Knitwear product',
        };
    }
}

export default function ProductLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <>{children}</>;
}
