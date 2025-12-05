import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
    // Check if the request is for /admin (but not /admin-login)
    if (request.nextUrl.pathname.startsWith("/admin") && !request.nextUrl.pathname.startsWith("/admin-login")) {
        const adminAuth = request.cookies.get("admin-auth");

        // If not authenticated, redirect to login
        if (!adminAuth || adminAuth.value !== "true") {
            return NextResponse.redirect(new URL("/admin-login", request.url));
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: "/admin/:path*",
};
