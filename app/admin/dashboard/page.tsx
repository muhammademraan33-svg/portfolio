import { redirect } from "next/navigation";
import Link from "next/link";
import { isAuthenticated } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import {
  FolderOpen,
  Zap,
  Share2,
  MessageSquare,
  Plus,
  Eye,
  ArrowUpRight,
  Sparkles,
  User,
} from "lucide-react";

export default async function DashboardPage() {
  const auth = await isAuthenticated();
  if (!auth) redirect("/admin/login");

  const [projectCount, skillCount, socialCount, messageCount, unreadCount] =
    await Promise.all([
      prisma.project.count(),
      prisma.skill.count(),
      prisma.socialLink.count(),
      prisma.contactMessage.count(),
      prisma.contactMessage.count({ where: { read: false } }),
    ]);

  const recentProjects = await prisma.project.findMany({
    take: 5,
    orderBy: { createdAt: "desc" },
    select: { id: true, title: true, category: true, createdAt: true, slug: true },
  });

  const stats = [
    {
      label: "Total Projects",
      value: projectCount,
      icon: FolderOpen,
      iconBg: "#3b82f6,#22d3ee",
      glow: "rgba(59,130,246,0.3)",
      href: "/admin/projects",
    },
    {
      label: "Skills Listed",
      value: skillCount,
      icon: Zap,
      iconBg: "#f59e0b,#f97316",
      glow: "rgba(245,158,11,0.3)",
      href: "/admin/skills",
    },
    {
      label: "Social Links",
      value: socialCount,
      icon: Share2,
      iconBg: "#34d399,#14b8a6",
      glow: "rgba(52,211,153,0.3)",
      href: "/admin/social",
    },
    {
      label: "Messages",
      value: messageCount,
      icon: MessageSquare,
      iconBg: "#a855f7,#ec4899",
      glow: "rgba(168,85,247,0.3)",
      href: "/admin/messages",
      badge: unreadCount > 0 ? unreadCount : null,
    },
  ];

  const quickActions = [
    { label: "Add New Project", href: "/admin/projects/new", icon: Plus },
    { label: "View Portfolio",  href: "/", icon: Eye, external: true },
    { label: "Edit About Me",  href: "/admin/about", icon: User },
    { label: "Manage Skills",  href: "/admin/skills", icon: Zap },
  ];

  return (
    <div>
      {/* Header */}
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Dashboard</h1>
          <p className="text-slate-400 text-sm mt-0.5">
            Welcome back! Here&apos;s your portfolio overview.
          </p>
        </div>
        <Link
          href="/admin/projects/new"
          className="hidden sm:flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-white"
          style={{
            background: "linear-gradient(135deg,#6366f1,#8b5cf6)",
            boxShadow: "0 4px 20px rgba(99,102,241,0.4)",
          }}
        >
          <Plus size={15} />
          New Project
        </Link>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4 mb-8">
        {stats.map((stat) => (
          <Link key={stat.label} href={stat.href}>
            <div
              className="relative rounded-2xl p-5 overflow-hidden transition-transform duration-200 hover:scale-[1.03] hover:shadow-xl"
              style={{
                background: "rgba(255,255,255,0.03)",
                border: "1px solid rgba(255,255,255,0.07)",
              }}
            >
              {/* glow blob */}
              <div
                className="absolute -top-5 -right-5 w-24 h-24 rounded-full blur-2xl pointer-events-none"
                style={{ background: stat.glow, opacity: 0.55 }}
              />

              {/* top row */}
              <div className="relative flex items-start justify-between mb-4">
                <div
                  className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{
                    background: `linear-gradient(135deg,${stat.iconBg})`,
                    boxShadow: `0 4px 14px ${stat.glow}`,
                  }}
                >
                  <stat.icon size={19} className="text-white" />
                </div>
                {stat.badge ? (
                  <span className="w-6 h-6 rounded-full bg-red-500 text-white text-xs font-bold flex items-center justify-center">
                    {stat.badge}
                  </span>
                ) : (
                  <ArrowUpRight size={15} className="text-slate-600 mt-0.5" />
                )}
              </div>

              <div className="relative text-4xl font-extrabold text-white mb-1 leading-none">
                {stat.value}
              </div>
              <div className="relative text-xs text-slate-400 font-medium">
                {stat.label}
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Bottom section */}
      <div className="grid lg:grid-cols-3 gap-6">

        {/* Recent projects */}
        <div
          className="lg:col-span-2 rounded-2xl p-6"
          style={{
            background: "rgba(255,255,255,0.03)",
            border: "1px solid rgba(255,255,255,0.07)",
          }}
        >
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-base font-semibold text-white">Recent Projects</h2>
            <Link
              href="/admin/projects/new"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-indigo-300 hover:text-indigo-200 transition-colors"
              style={{
                background: "rgba(99,102,241,0.1)",
                border: "1px solid rgba(99,102,241,0.2)",
              }}
            >
              <Plus size={11} />
              Add New
            </Link>
          </div>

          {recentProjects.length === 0 ? (
            <div className="py-12 text-center text-sm text-slate-500">
              No projects yet.{" "}
              <Link href="/admin/projects/new" className="text-indigo-400 underline underline-offset-2">
                Add your first →
              </Link>
            </div>
          ) : (
            <div className="space-y-1">
              {recentProjects.map((project) => (
                <div
                  key={project.id}
                  className="flex items-center justify-between px-3 py-3 rounded-xl hover:bg-white/[0.03] transition-colors"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div
                      className="w-8 h-8 rounded-lg flex-shrink-0 flex items-center justify-center text-xs font-bold text-white"
                      style={{ background: "rgba(99,102,241,0.18)" }}
                    >
                      {project.title[0].toUpperCase()}
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-slate-200 truncate">
                        {project.title}
                      </p>
                      <p className="text-xs text-slate-500 mt-0.5">
                        {project.category} · {new Date(project.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5 ml-3 flex-shrink-0">
                    <Link
                      href={`/projects/${project.slug}`}
                      target="_blank"
                      title="Preview"
                      className="w-7 h-7 rounded-lg flex items-center justify-center text-slate-500 hover:text-slate-200 transition-colors"
                    >
                      <Eye size={14} />
                    </Link>
                    <Link
                      href={`/admin/projects/${project.id}`}
                      className="px-2.5 py-1 rounded-lg text-xs font-medium text-indigo-400 hover:text-indigo-300 hover:bg-indigo-500/10 transition-colors"
                    >
                      Edit
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Quick actions */}
        <div
          className="rounded-2xl p-6 flex flex-col"
          style={{
            background: "rgba(255,255,255,0.03)",
            border: "1px solid rgba(255,255,255,0.07)",
          }}
        >
          <h2 className="text-base font-semibold text-white mb-4">Quick Actions</h2>
          <div className="space-y-1.5 flex-1">
            {quickActions.map((action) => (
              <Link
                key={action.label}
                href={action.href}
                target={action.external ? "_blank" : undefined}
                className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-slate-300 hover:text-white hover:bg-white/[0.05] border border-transparent hover:border-white/[0.06] transition-all"
              >
                <div
                  className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                  style={{ background: "rgba(99,102,241,0.12)" }}
                >
                  <action.icon size={14} className="text-indigo-400" />
                </div>
                <span className="font-medium">{action.label}</span>
              </Link>
            ))}
          </div>

          {/* Tip */}
          <div
            className="mt-5 p-4 rounded-xl"
            style={{
              background:
                "linear-gradient(135deg,rgba(99,102,241,0.1),rgba(139,92,246,0.06))",
              border: "1px solid rgba(99,102,241,0.15)",
            }}
          >
            <div className="flex items-center gap-1.5 mb-1.5">
              <Sparkles size={12} className="text-indigo-400" />
              <span className="text-xs font-semibold text-indigo-400">Tip</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              All changes are reflected on your live portfolio instantly after saving.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
