import { Metadata } from "next";

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://ole-knitwear.com';

export const metadata: Metadata = {
    title: 'Care Guide for Hand-Knitted Knitwear',
    description: 'Learn how to care for your handmade knitwear. Expert tips on washing, drying, and preserving your luxury wool garments from Ole Knitwear.',
    keywords: ['knitwear care', 'wool care guide', 'hand wash wool', 'sweater care', 'cardigan maintenance', 'wool garment care'],
    alternates: {
        canonical: `${baseUrl}/care`,
    },
    openGraph: {
        title: 'Care Guide for Hand-Knitted Knitwear | Ole Knitwear',
        description: 'Learn how to care for your handmade knitwear. Expert tips on washing, drying, and preserving your luxury wool garments.',
        url: `${baseUrl}/care`,
        type: 'article',
        images: [{
            url: '/og-image.png',
            width: 1200,
            height: 630,
            alt: 'Ole Knitwear Care Guide',
        }],
    },
    twitter: {
        card: 'summary_large_image',
        title: 'Care Guide for Hand-Knitted Knitwear | Ole Knitwear',
        description: 'Learn how to care for your handmade knitwear. Expert tips on washing, drying, and preserving your luxury wool garments.',
        images: ['/og-image.png'],
    },
};

export default function CareLayout({ children }: { children: React.ReactNode }) {
    return <>{children}</>;
}
