import { Metadata } from "next";

export const metadata: Metadata = {
    title: 'Shop',
    description: 'Browse our collection of handcrafted luxury knitwear. Cardigans, sweaters, and accessories made with love.',
    keywords: ['buy luxury knitwear', 'handmade cardigans', 'wool sweaters', 'bespoke knitwear shop', 'artisan clothing'],
    openGraph: {
        title: 'Shop Handmade Knitwear | Ole Knitwear',
        description: 'Browse our collection of handcrafted luxury knitwear.',
        url: `${process.env.NEXT_PUBLIC_BASE_URL || 'https://ole-knitwear.com'}/shop`,
        type: 'website',
        images: [{
            url: '/og-image.jpg',
            width: 1200,
            height: 630,
            alt: 'Ole Knitwear Shop',
        }],
    },
    twitter: {
        card: 'summary_large_image',
        title: 'Shop Handmade Knitwear | Ole Knitwear',
        description: 'Browse our collection of handcrafted luxury knitwear.',
        images: ['/og-image.jpg'],
    },
};

export default function ShopLayout({ children }: { children: React.ReactNode }) {
    return <>{children}</>;
}