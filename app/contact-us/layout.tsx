import { Metadata } from "next";

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://ole-knitwear.com';

export const metadata: Metadata = {
    title: 'Contact Us',
    description: 'Get in touch with Ole Knitwear. Questions about sizing, custom orders, or collaborations? We\'d love to hear from you.',
    keywords: ['contact ole knitwear', 'custom knitwear orders', 'handmade sweater inquiry', 'knitwear questions'],
    alternates: {
        canonical: `${baseUrl}/contact-us`,
    },
    openGraph: {
        title: 'Contact Us | Ole Knitwear',
        description: 'Get in touch with Ole Knitwear. Questions about sizing, custom orders, or collaborations? We\'d love to hear from you.',
        url: `${baseUrl}/contact-us`,
        type: 'website',
        images: [{
            url: '/og-image.png',
            width: 1200,
            height: 630,
            alt: 'Contact Ole Knitwear',
        }],
    },
    twitter: {
        card: 'summary_large_image',
        title: 'Contact Us | Ole Knitwear',
        description: 'Get in touch with Ole Knitwear for custom orders and inquiries.',
        images: ['/og-image.png'],
    },
};

const contactPageJsonLd = {
    "@context": "https://schema.org",
    "@type": "ContactPage",
    "name": "Contact Ole Knitwear",
    "url": `${baseUrl}/contact-us`,
    "mainEntity": {
        "@type": "Organization",
        "name": "Ole Knitwear",
        "email": "ole.knitting@gmail.com",
        "url": baseUrl,
    },
};

export default function ContactUsLayout({ children }: { children: React.ReactNode }) {
    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(contactPageJsonLd) }}
            />
            {children}
        </>
    );
}
