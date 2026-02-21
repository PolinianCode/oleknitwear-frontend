import { Metadata } from "next";

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://ole-knitwear.com';

export const metadata: Metadata = {
    title: "Sizing & Delivery",
    description: "Ole Knitwear sizing guide and delivery information. Free worldwide shipping on all orders. Find your perfect fit with our size chart.",
    keywords: ["knitwear sizing", "size guide", "free shipping", "worldwide delivery", "Ole Knitwear delivery"],
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
