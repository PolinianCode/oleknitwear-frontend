import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://ole-knitwear.com';

    return {
        rules: [
            {
                userAgent: '*',
                allow: '/',
                disallow: [
                    '/api/',
                    '/admin/',
                    '/profile/',
                    '/login/',
                    '/register/',
                    '/checkout/',
                    '/forgot-password/',
                    '/reset-password/',
                    '/verify-email/',
                ],
            },
            {
                userAgent: 'Googlebot',
                allow: '/',
                disallow: [
                    '/api/',
                    '/admin/',
                    '/profile/',
                    '/login/',
                    '/register/',
                    '/checkout/',
                    '/forgot-password/',
                    '/reset-password/',
                    '/verify-email/',
                ],
            },
        ],
        sitemap: `${baseUrl}/sitemap.xml`,
    };
}
