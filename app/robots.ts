import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
    const baseUrl = 'https://ole-knitwear.com';

    return {
        rules: {
            userAgent: '*',
            allow: '/',
            disallow: [
                '/api/',
                '/admin/',
                '/checkout/success',
            ],
        },
        sitemap: `${baseUrl}/sitemap.xml`,
    };
}