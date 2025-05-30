import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import AdminNavbar from "@/components/AdminNavbar";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);
  
  // Check if user is admin using the isAdmin flag from the session
  if (!session || !session.user?.isAdmin) {
    redirect('/');
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 dark:text-white">
      <AdminNavbar />
      <main className="container mx-auto px-4 py-8 p-8">
        {children}
      </main>
    </div>
  );
}
