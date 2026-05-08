import { isAuthenticated } from "@/lib/auth";
import AdminSidebar from "@/components/admin/AdminSidebar";
import AdminShell from "@/components/admin/AdminShell";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const auth = await isAuthenticated();

  if (!auth) {
    return (
      <div style={{ minHeight: "100vh", background: "#07070f" }}>
        {children}
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", background: "#07070f" }}>
      <AdminSidebar />
      <AdminShell>{children}</AdminShell>
    </div>
  );
}
