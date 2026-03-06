import { Metadata } from "next";
import { getCategories } from "@/lib/api/categories";

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://ole-knitwear.com';

type Props = {
    params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const [categories, { slug }] = await Promise.all([getCategories(), params]);
    const category = categories.find(c => c.slug === slug);

    if (!category) {
        return {
            title: 'Category Not Found',
            robots: { index: false, follow: true },
        };
    }

    const title = `Shop ${category.name}`;
    const description = category.description || `Browse our handcrafted ${category.name.toLowerCase()} collection. Luxury knitwear knitted by hand from premium wool. Free worldwide shipping.`;

    return {
        title,
        description,
        alternates: {
            canonical: `${baseUrl}/shop/category/${category.slug}`,
        },
        openGraph: {
            title: `${title} | Ole Knitwear`,
            description,
            url: `${baseUrl}/shop/category/${category.slug}`,
            type: 'website',
            images: [{
                url: '/og-image.png',
                width: 1200,
                height: 630,
                alt: `Ole Knitwear - ${category.name}`,
            }],
        },
        twitter: {
            card: 'summary_large_image',
            title: `${title} | Ole Knitwear`,
            description,
            images: ['/og-image.png'],
        },
    };
}

export default function CategoryLayout({ children }: { children: React.ReactNode }) {
    return <>{children}</>;
}
