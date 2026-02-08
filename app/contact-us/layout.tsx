import { Metadata } from "next";

export const metadata: Metadata = {
    title: 'Contact Us',
    description: 'Get in touch with Ole Knitwear. Questions about sizing, custom orders, or just want to say hello? We\'d love to hear from you.',
    keywords: ['contact ole knitwear', 'custom knitwear orders', 'handmade sweater inquiry', 'knitwear questions'],
    openGraph: {
        title: 'Contact Us | Ole Knitwear',
        description: 'Get in touch with Ole Knitwear. Questions about sizing, custom orders, or just want to say hello? We\'d love to hear from you.',
        url: `${process.env.NEXT_PUBLIC_BASE_URL || 'https://ole-knitwear.com'}/contact-us`,
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

export default function ContactUsLayout({ children }: { children: React.ReactNode }) {
    return <>{children}</>;
}