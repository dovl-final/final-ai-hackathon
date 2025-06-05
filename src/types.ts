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

// Define the structure for project registration
export interface ProjectRegistration {
  id: string;
  projectId: string;
  userId: string;
  createdAt: Date;
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
  registrations?: ProjectRegistration[];
  isUserRegistered?: boolean; // Flag to indicate if current user is registered
  registrationCount?: number; // Count of total registrations
}
