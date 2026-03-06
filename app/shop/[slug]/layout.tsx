import { Metadata } from 'next';
import { getProductBySlug } from '@/lib/api/products';
import { getCategories } from '@/lib/api/categories';

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://ole-knitwear.com';

type Props = {
    params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const resolvedParams = await params;

    try {
        const [product, categories] = await Promise.all([
            getProductBySlug(resolvedParams.slug),
            getCategories(),
        ]);

        if (!product) {
            return {
                title: 'Product Not Found',
                description: 'The product you are looking for could not be found.',
                robots: { index: false, follow: true },
            };
        }

        const productUrl = `${baseUrl}/shop/${product.slug}`;
        const productImages = product.product_images
            ?.sort((a, b) => a.sort_order - b.sort_order)
            .map(img => img.url.startsWith('http') ? img.url : `${baseUrl}${img.url}`) ?? [];

        const category = categories.find(c => String(c.id) === String(product.category_id));
        const description = product.description || `${product.name} — handmade luxury knitwear by Ole Knitwear. Crafted from premium wool with free worldwide shipping.`;

        return {
            title: product.name,
            description,
            keywords: [
                product.name,
                category?.name?.toLowerCase() ?? '',
                'handmade knitwear',
                'luxury wool',
                'Ole Knitwear',
            ].filter(Boolean),
            alternates: {
                canonical: productUrl,
            },
            openGraph: {
                title: `${product.name} | Ole Knitwear`,
                description,
                url: productUrl,
                type: 'website',
                images: productImages.map((img, index) => ({
                    url: img,
                    width: 800,
                    height: 1000,
                    alt: `${product.name}${index === 0 ? '' : ` - Image ${index + 1}`}`,
                })),
                siteName: 'Ole Knitwear',
            },
            twitter: {
                card: 'summary_large_image',
                title: `${product.name} | Ole Knitwear`,
                description,
                images: productImages[0] ? [productImages[0]] : [],
            },
        };
    } catch {
        return {
            title: 'Product',
            description: 'Handmade luxury knitwear by Ole Knitwear.',
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
