import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { password } = body;

        // Check password against env variable
        if (password === process.env.ADMIN_PASS) {
            const response = NextResponse.json({ success: true });

            // Set HTTP-only cookie
            response.cookies.set("admin-auth", "true", {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                sameSite: "lax",
                maxAge: 60 * 60 * 24 * 7, // 7 days
            });

            return response;
        } else {
            return NextResponse.json(
                { success: false, error: "Invalid password" },
                { status: 401 }
            );
        }
    } catch (error) {
        console.error("Error during login:", error);
        return NextResponse.json(
            { success: false, error: "Login failed" },
            { status: 500 }
        );
    }
}
