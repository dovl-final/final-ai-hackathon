import { NextResponse } from 'next/server'; // NextRequest removed, using standard Request
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/db'; // Updated to use default export from db.ts

export async function POST(
  request: Request,
  { params: paramsPromise }: { params: Promise<{ id: string }> } // User suggested typing
) {
  try {
    const session = await getServerSession(authOptions);
    
    // Check if user is authenticated
    if (!session || !session.user) {
      return NextResponse.json(
        { error: 'You must be signed in to register for a project' },
        { status: 401 }
      );
    }
    
    const { id: projectId } = await paramsPromise; // Correctly await and destructure projectId
    const userId = session.user.id;
    
    // Check if project exists
    const project = await prisma.project.findUnique({
      where: { id: projectId }
    });
    
    if (!project) {
      return NextResponse.json(
        { error: 'Project not found' },
        { status: 404 }
      );
    }
    
    // Check if user is already registered
    const existingRegistration = await prisma.projectRegistration.findUnique({
      where: {
        projectId_userId: {
          projectId,
          userId
        }
      }
    });
    
    if (existingRegistration) {
      return NextResponse.json(
        { error: 'You are already registered for this project' },
        { status: 400 }
      );
    }
    
    // Create registration
    const registration = await prisma.projectRegistration.create({
      data: {
        projectId,
        userId
      }
    });
    
    return NextResponse.json(registration);
  } catch (error) {
    console.error('Error registering for project:', error);
    return NextResponse.json(
      { error: 'Failed to register for project' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params: paramsPromise }: { params: Promise<{ id: string }> } // User suggested typing
) {
  try {
    const session = await getServerSession(authOptions);
    
    // Check if user is authenticated
    if (!session || !session.user) {
      return NextResponse.json(
        { error: 'You must be signed in to unregister from a project' },
        { status: 401 }
      );
    }
    
    const { id: projectId } = await paramsPromise; // Correctly await and destructure projectId
    const userId = session.user.id;
    
    // Delete registration
    await prisma.projectRegistration.delete({
      where: {
        projectId_userId: {
          projectId,
          userId
        }
      }
    });
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error unregistering from project:', error);
    return NextResponse.json(
      { error: 'Failed to unregister from project' },
      { status: 500 }
    );
  }
}
