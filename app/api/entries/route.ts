import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
    try {
        // Check if admin is authenticated
        const adminAuth = request.cookies.get("admin-auth");
        if (!adminAuth || adminAuth.value !== "true") {
            return NextResponse.json(
                { success: false, error: "Unauthorized" },
                { status: 401 }
            );
        }

        // Get query parameters
        const searchParams = request.nextUrl.searchParams;
        const search = searchParams.get("search") || "";
        const filter = searchParams.get("filter") || "all";
        const page = parseInt(searchParams.get("page") || "1");
        const limit = parseInt(searchParams.get("limit") || "20");

        // Build where clause
        let where: any = {};

        // Search by name or phone
        if (search) {
            where.OR = [
                { name: { contains: search, mode: "insensitive" } },
                { phoneNumber: { contains: search } },
            ];
        }

        // Filter by date
        if (filter !== "all") {
            const now = new Date();
            let startDate: Date;

            if (filter === "today") {
                startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
            } else if (filter === "week") {
                startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
            } else {
                startDate = new Date(0); // All time
            }

            where.createdAt = {
                gte: startDate,
            };
        }

        // Get total count
        const total = await prisma.guestEntry.count({ where });

        // Get entries with pagination
        const entries = await prisma.guestEntry.findMany({
            where,
            orderBy: { createdAt: "desc" },
            skip: (page - 1) * limit,
            take: limit,
        });

        return NextResponse.json({
            success: true,
            entries,
            pagination: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit),
            },
        });
    } catch (error) {
        console.error("Error fetching entries:", error);
        return NextResponse.json(
            { success: false, error: "Failed to fetch entries" },
            { status: 500 }
        );
    }
}
