import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import prisma from "@/lib/db";
import { authOptions } from "@/lib/auth";

/**
 * GET /api/projects/registrations
 * Returns all projects with detailed registration information including users
 * For admin and visualization purposes
 */
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    // Check if user is authenticated
    if (!session) {
      return NextResponse.json(
        { error: "You must be signed in to access this data" },
        { status: 401 }
      );
    }

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
        registrations: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
                image: true,
              },
            },
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });
    
    // Transform the data for visualization purposes
    const formattedProjects = projects.map(project => {
      const { registrations, ...projectDetails } = project;
      
      return {
        ...projectDetails,
        registrationCount: registrations.length,
        registeredUsers: registrations.map(reg => reg.user),
      };
    });
    
    return NextResponse.json(formattedProjects);
  } catch (error) {
    console.error("Error fetching project registrations:", error);
    return NextResponse.json(
      { error: "Failed to fetch project registrations" },
      { status: 500 }
    );
  }
}