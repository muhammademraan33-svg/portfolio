import { redirect } from "next/navigation";
import { isAuthenticated } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import AdminSocialManager from "@/components/admin/AdminSocialManager";

export default async function AdminSocialPage() {
  const auth = await isAuthenticated();
  if (!auth) redirect("/admin/login");

  const socials = await prisma.socialLink.findMany({
    orderBy: { sortOrder: "asc" },
  });

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-100">Social Links</h1>
        <p className="text-slate-400 text-sm mt-1">
          Manage your social media profiles and links.
        </p>
      </div>
      <div className="max-w-5xl">
        <AdminSocialManager initialSocials={socials} />
      </div>
    </div>
  );
}
