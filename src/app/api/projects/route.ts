import { NextRequest, NextResponse } from "next/server";
import prisma from "../../../lib/db";

// GET: Fetch all projects
export async function GET() {
  try {
    const projects = await prisma.project.findMany({
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
      orderBy: {
        createdAt: "desc",
      },
    });
    return NextResponse.json(projects);
  } catch (error) {
    console.error("Error fetching projects:", error);
    return NextResponse.json(
      { error: "Failed to fetch projects" },
      { status: 500 }
    );
  }
}

// POST: Create a new project
export async function POST(request: NextRequest) {
  // const session = null; // Authentication removed

  // No authentication check needed.

  try {
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

    const project = await prisma.project.create({
      data: {
        title,
        description,
        minTeamSize,
        maxTeamSize,
        // creatorId is now optional and will be null
      },
    });

    return NextResponse.json(project, { status: 201 });
  } catch (error) {
    console.error("Error creating project:", error);
    return NextResponse.json(
      { error: "Failed to create project" },
      { status: 500 }
    );
  }
}
