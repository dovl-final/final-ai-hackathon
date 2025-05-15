import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import prisma from "../../../../lib/db";
import { authOptions } from "../../auth/[...nextauth]/route";

// Define context type for route handlers
type RouteContext = {
  params: {
    id: string;
  };
};

// GET: Fetch a single project
export async function GET(
  request: NextRequest,
  { params }: RouteContext
) {
  const { id } = params;

  try {
    const project = await prisma.project.findUnique({
      where: { id },
      include: {
        creator: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
          },
        },
      },
    });

    if (!project) {
      return NextResponse.json(
        { error: "Project not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(project);
  } catch (error) {
    console.error("Error fetching project:", error);
    return NextResponse.json(
      { error: "Failed to fetch project" },
      { status: 500 }
    );
  }
}

// PUT: Update a project
export async function PUT(
  request: NextRequest,
  { params }: RouteContext
) {
  const session = await getServerSession(authOptions);
  const { id } = params;

  // Check if user is authenticated
  if (!session) {
    return NextResponse.json(
      { error: "You must be signed in to update a project" },
      { status: 401 }
    );
  }

  try {
    // Check if project exists and user is the creator
    const existingProject = await prisma.project.findUnique({
      where: { id },
    });

    if (!existingProject) {
      return NextResponse.json(
        { error: "Project not found" },
        { status: 404 }
      );
    }

    if (existingProject.creatorId !== session.user.id) {
      return NextResponse.json(
        { error: "You can only edit your own projects" },
        { status: 403 }
      );
    }

    const { title, description, minTeamSize, maxTeamSize } = await request.json();

    // Validate required fields
    if (!title || !description || minTeamSize === undefined || maxTeamSize === undefined) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Validate team size
    if (minTeamSize < 1 || maxTeamSize < minTeamSize) {
      return NextResponse.json(
        { error: "Invalid team size values" },
        { status: 400 }
      );
    }

    const updatedProject = await prisma.project.update({
      where: { id },
      data: {
        title,
        description,
        minTeamSize,
        maxTeamSize,
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

// DELETE: Delete a project
export async function DELETE(
  request: NextRequest,
  { params }: RouteContext
) {
  const session = await getServerSession(authOptions);
  const { id } = params;

  // Check if user is authenticated
  if (!session) {
    return NextResponse.json(
      { error: "You must be signed in to delete a project" },
      { status: 401 }
    );
  }

  try {
    // Check if project exists and user is the creator
    const existingProject = await prisma.project.findUnique({
      where: { id },
    });

    if (!existingProject) {
      return NextResponse.json(
        { error: "Project not found" },
        { status: 404 }
      );
    }

    if (existingProject.creatorId !== session.user.id) {
      return NextResponse.json(
        { error: "You can only delete your own projects" },
        { status: 403 }
      );
    }

    await prisma.project.delete({
      where: { id },
    });

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error("Error deleting project:", error);
    return NextResponse.json(
      { error: "Failed to delete project" },
      { status: 500 }
    );
  }
}
