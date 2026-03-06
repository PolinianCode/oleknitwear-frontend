import { Metadata } from "next";

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://ole-knitwear.com';

export const metadata: Metadata = {
    title: "Shipping & Delivery",
    description: "Ole Knitwear shipping and delivery information. Free worldwide shipping on all orders. In-stock items ship within 1-2 days, pre-orders crafted in up to 15 days.",
    keywords: ["free shipping knitwear", "worldwide delivery", "Ole Knitwear shipping", "knitwear delivery times", "free worldwide shipping"],
    alternates: {
        canonical: `${baseUrl}/sizing-delivery`,
    },
    openGraph: {
        title: "Sizing & Delivery | Ole Knitwear",
        description: "Ole Knitwear sizing guide and delivery information. Free worldwide shipping on all orders.",
        url: `${baseUrl}/sizing-delivery`,
        type: "website",
        images: [{
            url: '/og-image.png',
            width: 1200,
            height: 630,
            alt: 'Ole Knitwear Sizing & Delivery',
        }],
    },
    twitter: {
        card: "summary_large_image",
        title: "Sizing & Delivery | Ole Knitwear",
        description: "Ole Knitwear sizing guide and delivery information. Free worldwide shipping on all orders.",
        images: ['/og-image.png'],
    },
};

export default function SizingDeliveryLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <>{children}</>;
}
