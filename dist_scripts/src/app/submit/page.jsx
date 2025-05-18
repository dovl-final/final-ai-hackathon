import { getServerSession } from "next-auth/next";
import { redirect } from "next/navigation";
import { authOptions } from "../api/auth/[...nextauth]/route";
import Navbar from "../../components/Navbar";
import ProjectForm from "../../components/ProjectForm";
export const metadata = {
    title: "Submit Project | Final AI Hackathon",
    description: "Submit your AI project idea for Final's hackathon",
};
export default async function SubmitProject() {
    const session = await getServerSession(authOptions);
    // Redirect to login if not authenticated
    if (!session) {
        redirect("/");
    }
    return (<div className="min-h-screen bg-gray-50">
      <Navbar />

      <main className="max-w-3xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <ProjectForm />
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
    </div>);
}
