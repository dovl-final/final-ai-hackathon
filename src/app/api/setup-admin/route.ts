import { NextResponse } from "next/server";
import prisma from "@/lib/db";

// This is a one-time setup endpoint to create the first admin user
// It should be disabled or removed after initial setup
export async function GET(request: Request) {
  // Extract email from URL query parameter
  const { searchParams } = new URL(request.url);
  const email = searchParams.get("email");
  const setupKey = searchParams.get("key");
  
  // Simple security measure - require a setup key
  // IMPORTANT: This is a very basic security measure and should be replaced with something more robust
  const SETUP_KEY = "hackathon-setup-2025"; // This should ideally come from an environment variable
  
  if (!setupKey || setupKey !== SETUP_KEY) {
    return NextResponse.json(
      { error: "Unauthorized. Invalid or missing setup key." },
      { status: 401 }
    );
  }

  if (!email) {
    return NextResponse.json(
      { error: "Email parameter is required" },
      { status: 400 }
    );
  }

  try {
    // Check if the user exists
    const user = await prisma.user.findUnique({
      where: { email: email },
    });

    if (!user) {
      return NextResponse.json(
        { error: `User with email ${email} not found. Make sure you've signed in at least once.` },
        { status: 404 }
      );
    }

    // Check if the user is already an admin
    if (user.isAdmin) {
      return NextResponse.json({
        message: `${email} is already an admin.`,
        isAdmin: true
      });
    }

    // Make the user an admin
    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data: { isAdmin: true },
      select: {
        id: true,
        email: true,
        isAdmin: true
      }
    });

    return NextResponse.json({
      message: `Successfully made ${updatedUser.email} an admin!`,
      user: updatedUser
    });
  } catch (error) {
    console.error("Error setting up admin:", error);
    return NextResponse.json(
      { error: "Failed to set up admin user" },
      { status: 500 }
    );
  }
}
