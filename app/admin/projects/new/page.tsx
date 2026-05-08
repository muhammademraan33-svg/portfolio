import { redirect } from "next/navigation";
import Link from "next/link";
import { isAuthenticated } from "@/lib/auth";
import ProjectForm from "@/components/admin/ProjectForm";
import { ArrowLeft } from "lucide-react";

export default async function NewProjectPage() {
  const auth = await isAuthenticated();
  if (!auth) redirect("/admin/login");

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
        <h1 className="text-2xl font-bold text-slate-100">Add New Project</h1>
        <p className="text-slate-400 text-sm mt-1">
          Fill in the details to add a new project to your portfolio.
        </p>
      </div>

      <div className="max-w-5xl">
        <ProjectForm />
      </div>
    </div>
  );
}
