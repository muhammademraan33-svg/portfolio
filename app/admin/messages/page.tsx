import { redirect } from "next/navigation";
import { isAuthenticated } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import AdminMessages from "@/components/admin/AdminMessages";

export default async function MessagesPage() {
  const auth = await isAuthenticated();
  if (!auth) redirect("/admin/login");

  const messages = await prisma.contactMessage.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-100">Messages</h1>
        <p className="text-slate-400 text-sm mt-1">
          {messages.length} message{messages.length !== 1 ? "s" : ""} received.
        </p>
      </div>
      <AdminMessages initialMessages={messages} />
    </div>
  );
}
