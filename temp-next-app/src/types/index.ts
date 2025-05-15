import { User } from '@prisma/client';

export interface ProjectFormData {
  title: string;
  description: string;
  minTeamSize: number;
  maxTeamSize: number;
}

export interface ProjectWithCreator {
  id: string;
  title: string;
  description: string;
  minTeamSize: number;
  maxTeamSize: number;
  createdAt: Date;
  updatedAt: Date;
  creatorId: string;
  creator: User;
}

export interface SessionUser {
  id: string;
  name?: string | null;
  email?: string | null;
  image?: string | null;
}

// Extend next-auth session types
declare module 'next-auth' {
  interface Session {
    user: SessionUser;
  }
}
