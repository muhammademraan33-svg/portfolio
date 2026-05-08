import { redirect } from "next/navigation";
import { isAuthenticated } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import AdminAboutForm from "@/components/admin/AdminAboutForm";

export default async function AdminAboutPage() {
  const auth = await isAuthenticated();
  if (!auth) redirect("/admin/login");

  const about = await prisma.aboutInfo.findFirst();

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-100">About Me</h1>
        <p className="text-slate-400 text-sm mt-1">
          Update your personal information and bio.
        </p>
      </div>
      <div className="max-w-3xl">
        <AdminAboutForm initialData={about} />
      </div>
    </div>
  );
}
