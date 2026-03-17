import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

function decodeJwtPayload(token: string): Record<string, unknown> | null {
    try {
        const parts = token.split('.');
        if (parts.length !== 3) return null;
        const padded = parts[1].replace(/-/g, '+').replace(/_/g, '/');
        const json = atob(padded);
        return JSON.parse(json);
    } catch {
        return null;
    }
}

export function middleware(request: NextRequest) {
    const accessToken = request.cookies.get('accessToken');

    if (!accessToken) {
        const loginUrl = new URL('/login', request.url);
        loginUrl.searchParams.set('from', request.nextUrl.pathname);
        return NextResponse.redirect(loginUrl);
    }

    const payload = decodeJwtPayload(accessToken.value);

    // Reject malformed tokens
    if (!payload) {
        const loginUrl = new URL('/login', request.url);
        loginUrl.searchParams.set('from', request.nextUrl.pathname);
        return NextResponse.redirect(loginUrl);
    }

    // Guard admin routes by role claim (without full signature verification)
    if (request.nextUrl.pathname.startsWith('/admin') && payload.role !== 'admin') {
        return NextResponse.redirect(new URL('/login', request.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/admin/:path*', '/profile/:path*'],
};
