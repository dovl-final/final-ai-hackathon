import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import ProjectRegistrationChart from "@/components/visualization/ProjectRegistrationChart";

export const metadata = {
  title: 'Project Registration | Admin | Final AI Hackathon',
  description: 'View a visualization of projects and their participants',
};

export default async function AdminVisualizationPage() {
  const session = await getServerSession(authOptions);

  // Redirect to login if not authenticated
  if (!session) {
    redirect("/api/auth/signin");
  }
  
  // Redirect to homepage if not an admin
  if (!session.user?.isAdmin) {
    redirect("/");
  }

  return (
    <>
      <div className="mb-6">
        <h1 className="text-3xl font-bold tracking-tight">Project Registrations</h1>
        <p className="mt-2 text-lg text-gray-600 dark:text-gray-300">
          Visualize projects and the people who have registered
        </p>
      </div>

      <ProjectRegistrationChart />
    </>
  );
}