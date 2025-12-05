import { NextResponse } from "next/server";

export async function POST() {
    const response = NextResponse.json({ success: true });

    // Clear the admin-auth cookie
    response.cookies.set("admin-auth", "", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 0,
    });

    return response;
}
