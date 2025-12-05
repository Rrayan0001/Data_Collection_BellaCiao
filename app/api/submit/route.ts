import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// Validation regex for phone number (must start with 6-9 and be exactly 10 digits)
const PHONE_REGEX = /^[6-9][0-9]{9}$/;

// Validation regex for name (letters and spaces only)
const NAME_REGEX = /^[a-zA-Z\s]+$/;

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { name, phoneNumber, area, rating, tags, feedback } = body;

        // Validate required fields
        if (!name || !phoneNumber) {
            return NextResponse.json(
                { success: false, error: "Name and phone number are required." },
                { status: 400 }
            );
        }

        // Validate name format
        if (!NAME_REGEX.test(name.trim())) {
            return NextResponse.json(
                { success: false, error: "Name can only contain letters and spaces." },
                { status: 400 }
            );
        }

        // Validate phone number format
        if (!PHONE_REGEX.test(phoneNumber.trim())) {
            return NextResponse.json(
                { success: false, error: "Phone number must start with 6-9 and be exactly 10 digits." },
                { status: 400 }
            );
        }

        // Insert into database
        await prisma.guestEntry.create({
            data: {
                name: name.trim(),
                phoneNumber: phoneNumber.trim(),
                area: area?.trim() || null,
                rating: rating || null,
                tags: Array.isArray(tags) ? tags.join(",") : tags || null,
                feedback: feedback?.trim() || null,
            },
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Error creating guest entry:", error);
        return NextResponse.json(
            { success: false, error: "Failed to save entry. Please try again." },
            { status: 500 }
        );
    }
}
