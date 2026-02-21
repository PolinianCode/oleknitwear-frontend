import { Metadata } from "next";

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://ole-knitwear.com';

export const metadata: Metadata = {
    title: 'Shop Handmade Knitwear',
    description: 'Browse our collection of handcrafted luxury knitwear. Cardigans, sweaters, and accessories knitted by hand from premium wool. Free worldwide shipping.',
    keywords: ['buy luxury knitwear', 'handmade cardigans', 'wool sweaters', 'bespoke knitwear shop', 'artisan clothing', 'Ukrainian knitwear'],
    alternates: {
        canonical: `${baseUrl}/shop`,
    },
    openGraph: {
        title: 'Shop Handmade Knitwear | Ole Knitwear',
        description: 'Browse our collection of handcrafted luxury knitwear. Cardigans, sweaters, and accessories knitted by hand from premium wool.',
        url: `${baseUrl}/shop`,
        type: 'website',
        images: [{
            url: '/og-image.png',
            width: 1200,
            height: 630,
            alt: 'Ole Knitwear Shop',
        }],
    },
    twitter: {
        card: 'summary_large_image',
        title: 'Shop Handmade Knitwear | Ole Knitwear',
        description: 'Browse our collection of handcrafted luxury knitwear.',
        images: ['/og-image.png'],
    },
};

export default function ShopLayout({ children }: { children: React.ReactNode }) {
    return <>{children}</>;
}
