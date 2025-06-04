// src/app/api/projects/[projectId]/register/route.ts
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth'; // Path to your NextAuth options
import { prisma } from '@/lib/prisma';   // Path to your Prisma client instance

export async function POST(
  request: Request,
  { params }: { params: { projectId: string } }
) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
  }

  const userId = session.user.id;
  const { projectId } = params;

  if (!projectId) {
    return NextResponse.json({ error: 'Project ID is required' }, { status: 400 });
  }

  try {
    // Check if the project exists
    const project = await prisma.project.findUnique({
      where: { id: projectId },
    });

    if (!project) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    }

    // Prevent project creator from registering for their own project
    if (project.creatorId === userId) {
      return NextResponse.json({ error: 'Project creators cannot register for their own projects' }, { status: 403 });
    }

    // Check if already registered
    const existingRegistration = await prisma.projectRegistration.findUnique({
      where: {
        projectId_userId: {
          projectId,
          userId,
        },
      },
    });

    if (existingRegistration) {
      return NextResponse.json({ message: 'Already registered for this project' }, { status: 409 });
    }

    // Create the registration
    const registration = await prisma.projectRegistration.create({
      data: {
        projectId,
        userId,
      },
    });

    return NextResponse.json(registration, { status: 201 });
  } catch (error) {
    console.error('Registration error:', error);
    // Handle potential Prisma unique constraint violation if the above check somehow fails
    if (error instanceof Error && 'code' in error && (error as any).code === 'P2002') {
        return NextResponse.json({ error: 'Already registered for this project (unique constraint failed)' }, { status: 409 });
    }
    return NextResponse.json({ error: 'Failed to register for project' }, { status: 500 });
  }
}
