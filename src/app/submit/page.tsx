import { Metadata } from "next";
import { getServerSession } from "next-auth/next";
import { redirect } from "next/navigation";
import { authOptions } from "../api/auth/[...nextauth]/route";
import Navbar from "../../components/Navbar";
import ProjectForm from "../../components/ProjectForm";

export const metadata: Metadata = {
  title: "Submit Project | Final AI Hackathon",
  description: "Submit your AI project idea for Final's hackathon",
};

export default async function SubmitProject() {
  const session = await getServerSession(authOptions);

  // Redirect to login if not authenticated
  if (!session) {
    redirect("/");
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-1 w-full max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <ProjectForm />
      </main>

      <footer className="bg-white dark:bg-slate-900 mt-12 py-8 border-t border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <span className="text-xl font-bold text-blue-600 dark:text-blue-400">Final</span>
              <span className="ml-2 text-gray-500 dark:text-gray-400">Do the Math</span>
            </div>
            <p className="text-gray-500 dark:text-gray-400 text-sm">
              &copy; {new Date().getFullYear()} Final Ltd. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
