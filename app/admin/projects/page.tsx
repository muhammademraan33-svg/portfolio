import { redirect } from "next/navigation";
import Link from "next/link";
import { isAuthenticated } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import AdminProjectsList from "@/components/admin/AdminProjectsList";
import { Plus } from "lucide-react";

export default async function AdminProjectsPage() {
  const auth = await isAuthenticated();
  if (!auth) redirect("/admin/login");

  let projects: Awaited<ReturnType<typeof prisma.project.findMany>> = [];
  try {
    projects = await prisma.project.findMany({
      orderBy: { createdAt: "desc" },
    });
  } catch (error) {
    console.error("Projects DB unavailable:", error);
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-100">Projects</h1>
          <p className="text-slate-400 text-sm mt-1">
            {projects.length} project{projects.length !== 1 ? "s" : ""} total
          </p>
        </div>
        <Link
          href="/admin/projects/new"
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-medium text-sm hover:shadow-lg hover:shadow-indigo-500/25 transition-all"
        >
          <Plus size={16} />
          Add Project
        </Link>
      </div>

      <AdminProjectsList initialProjects={projects} />
    </div>
  );
}
