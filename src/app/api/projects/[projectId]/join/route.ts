import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';

export async function POST(request: Request, { params }: { params: { projectId: string } }) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
  }
  const userId = session.user.id;
  const { projectId } = params;

  // Check if project exists
  const project = await prisma.project.findUnique({ where: { id: projectId } });
  if (!project) {
    return NextResponse.json({ error: 'Project not found' }, { status: 404 });
  }

  // Create ProjectRegistration if not already exists
  try {
    await prisma.projectRegistration.create({
      data: {
        userId,
        projectId,
      },
    });
    return NextResponse.json({ success: true });
  } catch (err: any) {
    if (err.code === 'P2002') {
      // Unique constraint failed (already joined)
      return NextResponse.json({ success: true });
    }
    return NextResponse.json({ error: 'Failed to join project' }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: { projectId: string } }) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
  }
  const userId = session.user.id;
  const { projectId } = params;

  // Delete ProjectRegistration if exists
  try {
    await prisma.projectRegistration.delete({
      where: {
        userId_projectId: {
          userId,
          projectId,
        },
      },
    });
    return NextResponse.json({ success: true });
  } catch (err: any) {
    // If not found, treat as success (idempotent)
    return NextResponse.json({ success: true });
  }
}
