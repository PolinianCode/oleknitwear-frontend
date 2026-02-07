import { Metadata } from 'next';
import { products } from '@/data/products';

type Props = {
    params: Promise<{ id: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const resolvedParams = await params;
    const product = products.find((p) => p.id === Number(resolvedParams.id));

    if (!product) {
        return {
            title: 'Product Not Found',
            description: 'The product you are looking for could not be found.',
        };
    }

    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://ole-knitwear.com';
    const productUrl = `${baseUrl}/shop/${product.id}`;
    const productImages = product.images.map(img => `${baseUrl}${img}`);

    return {
        title: product.name,
        description: product.description,
        keywords: [
            product.name,
            product.category.toLowerCase(),
            'handmade knitwear',
            'luxury wool',
            product.season,
            product.length,
        ],
        openGraph: {
            title: `${product.name} | Ole Knitwear`,
            description: product.description,
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
            description: product.description,
            images: [productImages[0]],
        },
    };
}

export default function ProductLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <>{children}</>;
}
