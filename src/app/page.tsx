import Image from "next/image";
import Link from "next/link";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../lib/auth";
import Navbar from "../components/Navbar";
import ProjectList from "../components/ProjectList";

export default async function Home() {
  const session = await getServerSession(authOptions);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <main className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl sm:tracking-tight lg:text-6xl">
            Final AI Hackathon
          </h1>
          <p className="mt-5 max-w-xl mx-auto text-xl text-gray-500">
            Do the Math with AI - Explore and submit project ideas for our company hackathon
          </p>
        </div>

        <div className="mb-10 flex flex-col sm:flex-row justify-between items-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4 sm:mb-0">Project Ideas</h2>
          {session ? (
            <Link
              href="/submit"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Submit a New Project
            </Link>
          ) : (
            <div className="text-sm text-gray-500">Sign in to submit a project</div>
          )}
        </div>

        <ProjectList />
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
