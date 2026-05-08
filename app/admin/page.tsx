import { redirect } from "next/navigation";
import { isAuthenticated } from "@/lib/auth";

export default async function AdminPage() {
  const auth = await isAuthenticated();
  if (auth) redirect("/admin/dashboard");
  redirect("/admin/login");
}
