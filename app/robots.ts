import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://ole-knitwear.com';

    const privateRoutes = [
        '/api/',
        '/admin/',
        '/profile/',
        '/login/',
        '/register/',
        '/checkout/',
        '/forgot-password/',
        '/reset-password/',
        '/verify-email/',
    ];

    return {
        rules: [
            {
                userAgent: '*',
                allow: '/',
                disallow: privateRoutes,
            },
            {
                userAgent: 'GPTBot',
                allow: '/',
                disallow: privateRoutes,
            },
            {
                userAgent: 'ClaudeBot',
                allow: '/',
                disallow: privateRoutes,
            },
            {
                userAgent: 'PerplexityBot',
                allow: '/',
                disallow: privateRoutes,
            },
        ],
        sitemap: `${baseUrl}/sitemap.xml`,
    };
}
