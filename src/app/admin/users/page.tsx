import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/db";
import UserManagement from "@/components/admin/UserManagement";

export default async function AdminUsersPage() {
  const session = await getServerSession(authOptions);
  
  // Double-check admin status (redundant with layout check, but good practice)
  if (!session?.user?.isAdmin) {
    redirect('/');
  }

  // Fetch all users with their project counts
  const users = await prisma.user.findMany({
    orderBy: { name: 'asc' },
    select: {
      id: true,
      name: true,
      email: true,
      isAdmin: true,
      _count: {
        select: { projects: true }
      }
    }
  });

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold dark:text-white">User Management</h1>
      </div>
      <div className="bg-white dark:bg-gray-900 rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4 dark:text-gray-100">Users</h2>
        <UserManagement users={users} />
      </div>
    </div>
  );
}
