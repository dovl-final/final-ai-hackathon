import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/db";
import ProjectTable from "@/components/admin/ProjectTable";

export default async function AdminDashboardPage() {
  const session = await getServerSession(authOptions);
  
  // Fetch all projects for admin view
  const projects = await prisma.project.findMany({
    include: {
      creator: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
      </div>
      
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">Projects</h2>
        <ProjectTable projects={projects} />
      </div>
    </div>
  );
}
