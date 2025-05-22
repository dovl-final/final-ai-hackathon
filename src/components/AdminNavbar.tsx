import Link from "next/link";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route"; // Assuming @ is src/
import { Button } from "@/components/ui/button";
import SignOutButton from "./SignOutButton"; // Assuming SignOutButton is in the same components directory

export default async function AdminNavbar() {
  const session = await getServerSession(authOptions);
  
  // Check if user is admin using the isAdmin flag from the session
  if (!session?.user?.isAdmin) return null;

  return (
    <nav className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <Link href="/admin" className="font-bold text-xl">
                Admin Panel
              </Link>
            </div>
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              <Link
                href="/admin"
                className="border-indigo-500 text-gray-900 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
              >
                Dashboard
              </Link>
              <Link
                href="/admin/users"
                className="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
              >
                Users
              </Link>
            </div>
          </div>
          <div className="flex items-center">
            {session && <SignOutButton />}
          </div>
        </div>
      </div>
    </nav>
  );
}
