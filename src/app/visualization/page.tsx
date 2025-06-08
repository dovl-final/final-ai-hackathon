import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import Navbar from "@/components/Navbar";
import ProjectRegistrationChart from "@/components/visualization/ProjectRegistrationChart";

export const metadata = {
  title: 'Project Registration | Admin | Final AI Hackathon',
  description: 'View a visualization of projects and their participants',
};

export default async function VisualizationPage() {
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
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto py-12 px-4 sm:px-8 lg:px-16">
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight">Project Registrations</h1>
          <p className="mt-2 text-lg text-gray-600">
            Visualize projects and the people who have registered
          </p>
        </div>

        <ProjectRegistrationChart />
      </main>

      <footer className="mt-auto backdrop-blur-md bg-white/50 py-8 border-t border-gray-200/50 shadow-inner">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-16 text-center text-gray-500 text-sm">
          <p>&copy; {new Date().getFullYear()} Final Ltd. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}