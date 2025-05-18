import { Metadata } from "next";
import { redirect } from "next/navigation";
import { notFound } from "next/navigation";
import prisma from "../../../lib/db";
import Navbar from "../../../components/Navbar";
import ProjectForm from "../../../components/ProjectForm";
import { ProjectFormData } from "../../../types";

export const metadata: Metadata = {
  title: "Edit Project | Final AI Hackathon",
  description: "Edit your AI project idea for Final's hackathon",
};

export default async function EditProject({ params }: { params: { id: string } }) {
  const { id } = params;
  // const session = null; // Authentication removed

  // No redirect needed as authentication is disabled.

  // Fetch project data
  const project = await prisma.project.findUnique({
    where: { id },
  });

  // Check if project exists
  if (!project) {
    notFound();
  }

  // Ownership check removed as authentication is disabled.
  // if (project.creatorId !== session.user.id) {
  //   redirect("/");
  // }

  // Prepare project data for the form
  const projectData: ProjectFormData = {
    title: project.title,
    description: project.description,
    minTeamSize: project.minTeamSize,
    maxTeamSize: project.maxTeamSize,
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <main className="max-w-3xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <ProjectForm initialData={projectData} projectId={id} isEdit={true} />
      </main>

      <footer className="bg-white mt-12 py-8 border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <span className="text-xl font-bold text-blue-600">Final</span>
              <span className="ml-2 text-gray-500">Do the Math</span>
            </div>
            <p className="text-gray-500 text-sm">
              &copy; {new Date().getFullYear()} Final Ltd. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
