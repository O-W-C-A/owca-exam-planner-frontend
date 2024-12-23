import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
    const tokenCookie = request.cookies.get('authToken');
    const roleCookie = request.cookies.get('role');
    const userIdCookie = request.cookies.get('userId');

    if (!tokenCookie || !roleCookie || !userIdCookie) {
        return NextResponse.redirect(new URL('/login', request.url));
    }

    try {
        const role = roleCookie.value.toLowerCase();
        const requestedPath = request.nextUrl.pathname;

        // Check for role-based access control
        if (requestedPath.startsWith('/dashboard/admin') && role !== 'admin') {
            return NextResponse.redirect(new URL('/unauthorized', request.url));
        }

        if (requestedPath.startsWith('/dashboard/professor') && role !== 'professor') {
            return NextResponse.redirect(new URL('/unauthorized', request.url));
        }

        // Check studentleader path first (more specific)
        if (requestedPath.startsWith('/dashboard/studentleader') && role !== 'studentleader') {
            return NextResponse.redirect(new URL('/unauthorized', request.url));
        }

        // Then check student path (more general)
        if (requestedPath.startsWith('/dashboard/student') && role !== 'student' && role !== 'studentleader') {
            return NextResponse.redirect(new URL('/unauthorized', request.url));
        }

        if (requestedPath.startsWith('/dashboard/secretary') && role !== 'secretary') {
            return NextResponse.redirect(new URL('/unauthorized', request.url));
        }

        return NextResponse.next();
    } catch (error) {
        console.error('Error handling cookies:', error);
        return NextResponse.redirect(new URL('/login', request.url));
    }
}

export const config = {
    matcher: ['/dashboard/:path*'], // Apply middleware only to protected routes
};
