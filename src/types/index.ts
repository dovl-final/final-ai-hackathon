import { User } from '../generated/prisma';

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

// Note: Session type is already extended in [...nextauth]/route.ts
// This is just for reference
/*
declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
    } & DefaultSession['user'];
  }
}
*/
