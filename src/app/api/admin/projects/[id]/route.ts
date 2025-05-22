import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import prisma from "@/lib/db";

// DELETE endpoint for admins to delete any project
export async function DELETE(
  request: NextRequest,
  { params }: any
) {
  const session = await getServerSession(authOptions);
  
  // Only allow admins to delete any project
  if (!session?.user?.isAdmin) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  try {
    // Check if project exists
    const project = await prisma.project.findUnique({
      where: { id: params.id },
    });

    if (!project) {
      return NextResponse.json(
        { error: "Project not found" },
        { status: 404 }
      );
    }

    // Delete the project
    await prisma.project.delete({
      where: { id: params.id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting project:", error);
    return NextResponse.json(
      { error: "Failed to delete project" },
      { status: 500 }
    );
  }
}

// PUT endpoint for admins to update any project
export async function PUT(
  request: NextRequest,
  { params }: any
) {
  const session = await getServerSession(authOptions);
  
  // Only allow admins to update any project
  if (!session?.user?.isAdmin) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  try {
    const data = await request.json();
    
    // Validate the request body
    const { title, description, minTeamSize, maxTeamSize, environment, additionalRequests } = data;
    
    if (!title || !description || !minTeamSize || !maxTeamSize || !environment) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Check if project exists
    const existingProject = await prisma.project.findUnique({
      where: { id: params.id },
    });

    if (!existingProject) {
      return NextResponse.json(
        { error: "Project not found" },
        { status: 404 }
      );
    }

    // Update the project
    const updatedProject = await prisma.project.update({
      where: { id: params.id },
      data: {
        title,
        description,
        minTeamSize,
        maxTeamSize,
        environment,
        additionalRequests: additionalRequests || null,
      },
    });

    return NextResponse.json(updatedProject);
  } catch (error) {
    console.error("Error updating project:", error);
    return NextResponse.json(
      { error: "Failed to update project" },
      { status: 500 }
    );
  }
}
