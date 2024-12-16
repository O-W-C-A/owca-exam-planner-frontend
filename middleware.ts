import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import Cookies from 'js-cookie'; // Import js-cookie for handling cookies

export async function middleware(request: NextRequest) {
    const tokenCookie = request.cookies.get('authToken'); // Get the token from cookies
    const roleCookie = request.cookies.get('role'); // Get the token from cookies
    const userIdCookie = request.cookies.get('userId'); // Get the token from cookies

    if (!tokenCookie || !roleCookie || !userIdCookie) {
        return NextResponse.redirect(new URL('/login', request.url)); // Redirect to login if no token or user info
    }

    try {
        const role = roleCookie.value;
        const requestedPath = request.nextUrl.pathname;

        // Check for role-based access control
        if (requestedPath.startsWith('/dashboard/admin') && role !== 'Admin') {
            return NextResponse.redirect(new URL('/unauthorized', request.url)); // Redirect unauthorized users
        }

        if (requestedPath.startsWith('/dashboard/professor') && role !== 'Professor') {
            return NextResponse.redirect(new URL('/unauthorized', request.url)); // Redirect unauthorized users
        }

        if (requestedPath.startsWith('/dashboard/student') && role !== 'Student') {
            return NextResponse.redirect(new URL('/unauthorized', request.url)); // Redirect unauthorized users
        }

        return NextResponse.next(); // Allow the request to proceed if all checks pass
    } catch (error) {
        console.error('Error parsing user info or handling cookies:', error);
        return NextResponse.redirect(new URL('/login', request.url)); // Redirect if an error occurs
    }
}

export const config = {
    matcher: ['/dashboard/:path*'], // Apply middleware only to protected routes
};
