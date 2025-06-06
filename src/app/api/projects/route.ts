import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import prisma from "../../../lib/db";
import { authOptions } from "@/lib/auth";

// GET: Fetch all projects
export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    const userId = session?.user?.id;
    
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
        registrations: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });
    
    // Add registration information for each project
    const projectsWithRegistrationInfo = projects.map(project => {
      const registrationCount = project.registrations.length;
      const isUserRegistered = userId ? project.registrations.some(reg => reg.userId === userId) : false;
      
      // Remove the full registrations array from the response to reduce payload size
      const { registrations, ...projectWithoutRegistrations } = project;
      
      return {
        ...projectWithoutRegistrations,
        registrationCount,
        isUserRegistered
      };
    });
    
    return NextResponse.json(projectsWithRegistrationInfo);
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
  const session = await getServerSession(authOptions);

  // Check if user is authenticated
  if (!session) {
    return NextResponse.json(
      { error: "You must be signed in to create a project" },
      { status: 401 }
    );
  }

  try {
    const { title, description, minTeamSize, maxTeamSize, environment, additionalRequests } = await request.json();

    // Validate required fields
    if (!title || !description || minTeamSize === undefined || maxTeamSize === undefined || !environment) {
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
        environment,
        additionalRequests: additionalRequests || null,
        creatorId: session.user.id,
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
