import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';

interface Params {
  params: {
    projectId: string;
  };
}

// Join a project (POST)
export async function POST(request: Request, { params }: Params) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
  }

  const userId = session.user.id;
  // Note: projectId will need to be passed in the request body 
  // or as a query parameter since this is not a dynamic route file.
  // For now, we'll expect it in the request body.
  const { projectId } = await request.json(); 

  if (!projectId) {
    return NextResponse.json({ error: 'Project ID is required in request body' }, { status: 400 });
  }

  try {
    // Check if project exists
    const project = await prisma.project.findUnique({
      where: { id: projectId as string },
    });

    if (!project) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    }

    // Check if already registered
    const existingRegistration = await prisma.projectRegistration.findUnique({
      where: {
        UserProjectPreferenceUnique: {
          userId,
          projectId: projectId as string,
        },
      },
    });

    if (existingRegistration) {
      return NextResponse.json({ message: 'Already joined this project' }, { status: 200 });
    }

    const registration = await prisma.projectRegistration.create({
      data: {
        userId,
        projectId: projectId as string,
      },
    });

    return NextResponse.json(registration, { status: 201 });
  } catch (error) {
    console.error('Failed to join project:', error);
    return NextResponse.json({ error: 'Failed to join project' }, { status: 500 });
  }
}

// Unjoin a project (DELETE)
export async function DELETE(request: Request, { params }: Params) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
  }

  const userId = session.user.id;
  // Note: projectId will need to be passed as a query parameter 
  // or in the request body since this is not a dynamic route file.
  // For now, we'll expect it as a query parameter.
  const { searchParams } = new URL(request.url);
  const projectId = searchParams.get('projectId');

  if (!projectId) {
    return NextResponse.json({ error: 'Project ID is required as a query parameter' }, { status: 400 });
  }

  try {
    // Check if project exists (optional, but good practice)
    const project = await prisma.project.findUnique({
      where: { id: projectId },
    });

    if (!project) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    }
    
    // Check if registration exists
    const existingRegistration = await prisma.projectRegistration.findUnique({
      where: {
        UserProjectPreferenceUnique: {
          userId,
          projectId,
        },
      },
    });

    if (!existingRegistration) {
      return NextResponse.json({ error: 'Not joined this project' }, { status: 404 });
    }

    await prisma.projectRegistration.delete({
      where: {
        UserProjectPreferenceUnique: {
          userId,
          projectId,
        },
      },
    });

    return NextResponse.json({ message: 'Successfully unjoined project' }, { status: 200 });
  } catch (error) {
    console.error('Failed to unjoin project:', error);
    return NextResponse.json({ error: 'Failed to unjoin project' }, { status: 500 });
  }
}
