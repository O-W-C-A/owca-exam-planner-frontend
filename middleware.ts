import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server'; // Explicitly type the request

export async function middleware(request: NextRequest) {
    const token = request.cookies.get('authToken'); // Directly access cookies via NextRequest
    if (!token) {
        return NextResponse.redirect(new URL('/login', request.url)); // Redirect to login if no token
    }

    return NextResponse.next(); // Allow the request to proceed
}

export const config = {
    matcher: ['/dashboard/:path*'], // Apply middleware only to protected routes
};
