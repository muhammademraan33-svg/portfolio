"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";
import {
  Pencil,
  Trash2,
  ExternalLink,
  Star,
  Search,
  Eye,
} from "lucide-react";

interface Project {
  id: string;
  title: string;
  slug: string;
  description: string;
  category: string;
  date: string;
  projectUrl: string;
  githubUrl: string;
  image: string;
  featured: boolean;
  tags: string;
  createdAt: Date;
}

interface Props {
  initialProjects: Project[];
}

export default function AdminProjectsList({ initialProjects }: Props) {
  const router = useRouter();
  const [projects, setProjects] = useState(initialProjects);
  const [search, setSearch] = useState("");
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);

  const filtered = projects.filter(
    (p) =>
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      p.category.toLowerCase().includes(search.toLowerCase())
  );

  const handleDelete = async (id: string) => {
    setDeletingId(id);
    try {
      const res = await fetch(`/api/projects/${id}`, { method: "DELETE" });
      if (res.ok) {
        setProjects((prev) => prev.filter((p) => p.id !== id));
        toast.success("Project deleted");
      } else {
        toast.error("Failed to delete");
      }
    } catch {
      toast.error("Error deleting project");
    } finally {
      setDeletingId(null);
      setConfirmDelete(null);
    }
  };

  return (
    <div>
      {/* Search */}
      <div className="relative mb-6">
        <Search
          size={16}
          className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500"
        />
        <input
          type="text"
          placeholder="Search projects..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="form-input form-input-icon-left max-w-sm"
        />
      </div>

      {/* List */}
      {filtered.length === 0 ? (
        <div className="glass rounded-xl p-12 text-center">
          <p className="text-slate-400">No projects found.</p>
          <Link
            href="/admin/projects/new"
            className="inline-block mt-3 text-indigo-400 hover:text-indigo-300 text-sm"
          >
            Add your first project →
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          <AnimatePresence>
            {filtered.map((project, i) => {
              const tags = (() => {
                try {
                  return JSON.parse(project.tags) as string[];
                } catch {
                  return [];
                }
              })();

              return (
                <motion.div
                  key={project.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ delay: i * 0.03 }}
                  className="glass rounded-xl p-4 flex items-start gap-4 group"
                >
                  {/* Image thumbnail */}
                  <div className="w-16 h-16 rounded-lg overflow-hidden bg-gradient-to-br from-indigo-900 to-purple-900 flex-shrink-0 flex items-center justify-center">
                    {project.image ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={project.image}
                        alt={project.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="text-2xl font-bold gradient-text opacity-40">
                        {project.title[0]}
                      </span>
                    )}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold text-slate-200 truncate">
                        {project.title}
                      </h3>
                      {project.featured && (
                        <Star
                          size={13}
                          className="text-amber-400 fill-current flex-shrink-0"
                        />
                      )}
                    </div>
                    <div className="flex items-center gap-2 text-xs text-slate-500 mb-2">
                      <span className="tag text-xs">{project.category}</span>
                      <span>{project.date}</span>
                    </div>
                    <p className="text-slate-400 text-xs line-clamp-1 mb-2">
                      {project.description}
                    </p>
                    <div className="flex flex-wrap gap-1">
                      {tags.slice(0, 3).map((tag) => (
                        <span
                          key={tag}
                          className="px-1.5 py-0.5 rounded text-xs bg-indigo-500/10 text-indigo-400"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <Link
                      href={`/projects/${project.slug}`}
                      target="_blank"
                      className="w-8 h-8 rounded-lg hover:bg-white/5 flex items-center justify-center text-slate-500 hover:text-slate-300 transition-colors"
                      title="Preview"
                    >
                      <Eye size={15} />
                    </Link>
                    {project.projectUrl && (
                      <a
                        href={project.projectUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-8 h-8 rounded-lg hover:bg-white/5 flex items-center justify-center text-slate-500 hover:text-slate-300 transition-colors"
                        title="Live site"
                      >
                        <ExternalLink size={15} />
                      </a>
                    )}
                    <Link
                      href={`/admin/projects/${project.id}`}
                      className="w-8 h-8 rounded-lg hover:bg-indigo-500/10 flex items-center justify-center text-slate-400 hover:text-indigo-400 transition-colors"
                      title="Edit"
                    >
                      <Pencil size={15} />
                    </Link>
                    <button
                      onClick={() => setConfirmDelete(project.id)}
                      className="w-8 h-8 rounded-lg hover:bg-red-500/10 flex items-center justify-center text-slate-400 hover:text-red-400 transition-colors"
                      title="Delete"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      )}

      {/* Confirm Delete Modal */}
      <AnimatePresence>
        {confirmDelete && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60"
            onClick={() => setConfirmDelete(null)}
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              onClick={(e) => e.stopPropagation()}
              className="glass rounded-2xl p-6 max-w-sm w-full"
            >
              <h3 className="text-lg font-bold text-slate-100 mb-2">
                Delete Project?
              </h3>
              <p className="text-slate-400 text-sm mb-6">
                This action cannot be undone. The project will be permanently
                removed.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setConfirmDelete(null)}
                  className="flex-1 py-2.5 rounded-xl glass text-slate-300 text-sm font-medium"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleDelete(confirmDelete)}
                  disabled={!!deletingId}
                  className="flex-1 py-2.5 rounded-xl bg-red-500 hover:bg-red-600 text-white text-sm font-medium transition-colors disabled:opacity-70 flex items-center justify-center gap-2"
                >
                  {deletingId ? (
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <Trash2 size={14} />
                  )}
                  Delete
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
