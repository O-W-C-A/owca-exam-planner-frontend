import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { ROUTES, hasAccess } from '@/utils/routes';

export async function middleware(request: NextRequest) {
    const tokenCookie = request.cookies.get('authToken');
    const roleCookie = request.cookies.get('role');
    const userIdCookie = request.cookies.get('userId');

    if (!tokenCookie || !roleCookie || !userIdCookie) {
        return NextResponse.redirect(new URL(ROUTES.LOGIN, request.url));
    }

    try {
        const role = roleCookie.value;
        const requestedPath = request.nextUrl.pathname;

        if (!hasAccess(role, requestedPath)) {
            return NextResponse.redirect(new URL(ROUTES.UNAUTHORIZED, request.url));
        }

        return NextResponse.next();
    } catch (error) {
        console.error('Error in middleware:', error);
        return NextResponse.redirect(new URL(ROUTES.LOGIN, request.url));
    }
}

export const config = {
    matcher: ['/dashboard/:path*'],
};
