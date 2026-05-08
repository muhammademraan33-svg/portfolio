import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import { isAuthenticated } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import ProjectForm from "@/components/admin/ProjectForm";
import { ArrowLeft } from "lucide-react";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function EditProjectPage({ params }: PageProps) {
  const auth = await isAuthenticated();
  if (!auth) redirect("/admin/login");

  const { id } = await params;
  let project: Awaited<ReturnType<typeof prisma.project.findUnique>> = null;
  try {
    project = await prisma.project.findUnique({ where: { id } });
  } catch (error) {
    console.error("Project detail DB unavailable:", error);
  }
  if (!project) notFound();

  return (
    <div>
      <div className="mb-8">
        <Link
          href="/admin/projects"
          className="flex items-center gap-2 text-slate-400 hover:text-slate-200 text-sm mb-4 transition-colors"
        >
          <ArrowLeft size={14} />
          Back to Projects
        </Link>
        <h1 className="text-2xl font-bold text-slate-100">Edit Project</h1>
        <p className="text-slate-400 text-sm mt-1">
          Update the details for &quot;{project.title}&quot;
        </p>
      </div>

      <div className="max-w-5xl">
        <ProjectForm project={project} isEdit />
      </div>
    </div>
  );
}
