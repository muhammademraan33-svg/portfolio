"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";
import {
  Code2,
  LayoutDashboard,
  FolderOpen,
  User,
  Zap,
  Share2,
  MessageSquare,
  LogOut,
  Menu,
  X,
  ExternalLink,
} from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/projects", label: "Projects", icon: FolderOpen },
  { href: "/admin/about", label: "About Me", icon: User },
  { href: "/admin/skills", label: "Skills", icon: Zap },
  { href: "/admin/social", label: "Social Links", icon: Share2 },
  { href: "/admin/messages", label: "Messages", icon: MessageSquare },
];

function NavContent({
  onClose,
  onLogout,
  pathname,
}: {
  onClose?: () => void;
  onLogout: () => void;
  pathname: string;
}) {
  return (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="flex-shrink-0 px-5 py-5 border-b border-white/[0.06]">
        <Link
          href="/admin/dashboard"
          onClick={onClose}
          className="flex items-center gap-3 group"
        >
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/30 flex-shrink-0">
            <Code2 size={17} className="text-white" />
          </div>
          <div className="leading-tight">
            <div className="text-sm font-bold text-white">Portfolio</div>
            <div className="text-[11px] text-indigo-400 font-medium">Admin Panel</div>
          </div>
        </Link>
      </div>

      {/* Nav links */}
      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-0.5">
        {navItems.map((item) => {
          const active =
            pathname === item.href ||
            (item.href !== "/admin/dashboard" && pathname.startsWith(item.href));
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onClose}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 group",
                active
                  ? "bg-indigo-600/20 text-indigo-300 border border-indigo-500/25"
                  : "text-slate-400 hover:text-slate-100 hover:bg-white/[0.05]"
              )}
            >
              <item.icon
                size={17}
                className={cn(
                  "flex-shrink-0",
                  active ? "text-indigo-400" : "text-slate-500 group-hover:text-slate-300"
                )}
              />
              <span>{item.label}</span>
              {active && (
                <span className="ml-auto w-1.5 h-1.5 rounded-full bg-indigo-400" />
              )}
            </Link>
          );
        })}
      </nav>

      {/* Bottom actions */}
      <div className="flex-shrink-0 px-3 py-4 border-t border-white/[0.06] space-y-1">
        <a
          href="/"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-slate-500 hover:text-slate-200 hover:bg-white/[0.05] transition-all"
        >
          <ExternalLink size={16} className="flex-shrink-0" />
          View Portfolio
        </a>
        <button
          onClick={onLogout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-red-400/90 hover:text-red-300 hover:bg-red-500/10 transition-all text-left"
        >
          <LogOut size={16} className="flex-shrink-0" />
          Sign Out
        </button>
      </div>
    </div>
  );
}

export default function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = async () => {
    await fetch("/api/auth", { method: "DELETE" });
    toast.success("Signed out");
    router.push("/admin/login");
    router.refresh();
  };

  return (
    <>
      {/* ── Desktop sidebar ── */}
      <aside
        className="hidden md:flex fixed inset-y-0 left-0 w-64 flex-col z-40"
        style={{
          background: "rgba(10, 10, 20, 0.98)",
          borderRight: "1px solid rgba(255,255,255,0.06)",
        }}
      >
        <NavContent
          onLogout={handleLogout}
          pathname={pathname}
        />
      </aside>

      {/* ── Mobile top bar ── */}
      <div
        className="md:hidden fixed top-0 inset-x-0 z-40 flex items-center justify-between px-4 h-14"
        style={{
          background: "rgba(10,10,20,0.97)",
          borderBottom: "1px solid rgba(255,255,255,0.06)",
        }}
      >
        <Link href="/admin/dashboard" className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
            <Code2 size={15} className="text-white" />
          </div>
          <span className="text-sm font-bold text-white">Admin Panel</span>
        </Link>
        <button
          onClick={() => setMobileOpen(true)}
          className="w-9 h-9 rounded-lg flex items-center justify-center text-slate-400 hover:text-white hover:bg-white/5 transition-colors"
        >
          <Menu size={20} />
        </button>
      </div>

      {/* ── Mobile drawer ── */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              key="backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 bg-black/70 md:hidden"
              onClick={() => setMobileOpen(false)}
            />
            {/* Drawer */}
            <motion.aside
              key="drawer"
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "tween", duration: 0.22 }}
              className="fixed inset-y-0 left-0 w-64 z-50 md:hidden"
              style={{
                background: "rgba(10, 10, 20, 0.99)",
                borderRight: "1px solid rgba(255,255,255,0.08)",
              }}
            >
              {/* Close button */}
              <button
                onClick={() => setMobileOpen(false)}
                className="absolute top-3 right-3 w-8 h-8 rounded-lg flex items-center justify-center text-slate-500 hover:text-white hover:bg-white/5 transition-colors"
              >
                <X size={18} />
              </button>
              <NavContent
                onClose={() => setMobileOpen(false)}
                onLogout={handleLogout}
                pathname={pathname}
              />
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
