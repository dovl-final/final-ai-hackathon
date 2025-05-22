import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import prisma from "@/lib/db";

export async function PATCH(
  request: NextRequest,
  { params }: any
) {
  const session = await getServerSession(authOptions);
  
  // Only allow admins to modify admin status
  if (!session?.user?.isAdmin) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  try {
    const { isAdmin } = await request.json();
    
    // Prevent removing the last admin
    if (isAdmin === false) {
      const adminCount = await prisma.user.count({
        where: { isAdmin: true }
      });
      
      if (adminCount <= 1) {
        return NextResponse.json(
          { error: "Cannot remove the last admin" },
          { status: 400 }
        );
      }
    }

    const user = await prisma.user.update({
      where: { id: params.id },
      data: { isAdmin },
      select: {
        id: true,
        email: true,
        isAdmin: true
      }
    });

    return NextResponse.json(user);
  } catch (error) {
    console.error("Error updating user:", error);
    return NextResponse.json(
      { error: "Failed to update user" },
      { status: 500 }
    );
  }
}
