// Define the environment type as a union of string literals
export type Environment = "internal" | "external";

// Define the structure for project form data
export interface ProjectFormData {
  title: string;
  description: string;
  minTeamSize: number;
  maxTeamSize: number;
  environment: Environment;
  additionalRequests: string;
}

// Define the structure for project registration data
export interface ProjectRegistration {
  id: string;
  userId: string;
  projectId: string;
  preference: number;
  createdAt: string | Date; 
  updatedAt: string | Date; 
  project?: { 
    id: string;
    title: string;
    description: string;
  };
}

// Define the structure for project with creator data
export interface ProjectWithCreator {
  id: string;
  title: string;
  description: string;
  minTeamSize: number;
  maxTeamSize: number;
  environment: string;
  additionalRequests: string | null;
  createdAt: Date;
  updatedAt: Date;
  creatorId: string;
  creator: {
    id: string;
    name: string | null;
    email: string;
  };
  isRegistered?: boolean;      // Optional: Indicates if the current user is registered for this project
  userPreference?: number;     // Optional: The current user's preference (1, 2, or 3) if registered
}
