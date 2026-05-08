import { redirect } from "next/navigation";
import { isAuthenticated } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import AdminSkillsManager from "@/components/admin/AdminSkillsManager";

export default async function AdminSkillsPage() {
  const auth = await isAuthenticated();
  if (!auth) redirect("/admin/login");

  const skills = await prisma.skill.findMany({ orderBy: { sortOrder: "asc" } });

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-100">Skills</h1>
        <p className="text-slate-400 text-sm mt-1">
          Manage your skills and proficiency levels.
        </p>
      </div>
      <AdminSkillsManager initialSkills={skills} />
    </div>
  );
}
