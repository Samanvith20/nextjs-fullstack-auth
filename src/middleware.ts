import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Middleware function to handle authentication and redirection
export function middleware(request: NextRequest) {
    // Extract the path from the request URL
    const path = request.nextUrl.pathname

    // Check if the request is for a local path (not requiring authentication)
    const localPath = path === "/login" || path === "/signup" || path === "/verifyemail"

    // Extract the token from the request cookies, default to empty string if not found
    const token = request.cookies.get("token")?.value || ""

    // If the request is for a local path and a token exists, redirect to the profile page
    if (localPath && token) {
        return NextResponse.redirect(new URL('/profile', request.url))
    }

    // If the request is not for a local path and no token exists, redirect to the login page
    if (!localPath && !token) {
        return NextResponse.redirect(new URL('/login', request.nextUrl))
    }
}

// Configuration specifying the paths for which this middleware should be applied
export const config = {
    matcher: [
        '/',
        '/profile',
        '/login',
        '/signup',
        '/verifyemail'
    ]
}
