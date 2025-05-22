import { notFound, redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import prisma from "@/lib/db";
import ProjectForm from "@/components/ProjectForm";
import { ProjectFormData } from "@/types";

type Props = {
  params: { id: string };
  searchParams: { [key: string]: string | string[] | undefined };
};

export default async function AdminEditProjectPage({ params }: Props) {
  // Check admin status
  const session = await getServerSession(authOptions);
  if (!session?.user?.isAdmin) {
    redirect('/');
  }

  // Fetch the project
  const project = await prisma.project.findUnique({
    where: { id: params.id },
  });

  if (!project) {
    notFound();
  }

  // Convert project to the format expected by ProjectForm
  const initialData: ProjectFormData = {
    title: project.title,
    description: project.description,
    minTeamSize: project.minTeamSize,
    maxTeamSize: project.maxTeamSize,
    environment: project.environment as "internal" | "external", // Type assertion to match Environment type
    additionalRequests: project.additionalRequests || '',
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Edit Project</h1>
      </div>
      <div className="bg-white rounded-lg shadow-md p-6">
        <ProjectForm 
          initialData={initialData} 
          projectId={params.id} 
          isEdit={true}
          adminMode={true} // Add this prop to indicate admin is editing
        />
      </div>
    </div>
  );
}
