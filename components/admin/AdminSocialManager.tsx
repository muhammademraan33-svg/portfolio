"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";
import {Plus, Pencil, Trash2, Check, X, Globe} from "lucide-react";
import { GithubIcon, LinkedinIcon, TwitterIcon } from "@/components/ui/SocialIcons";

interface SocialLink {
  id: string;
  platform: string;
  url: string;
  icon: string;
  sortOrder: number;
}

const iconMap: Record<string, React.ReactNode> = {
  github: <GithubIcon size={16} />,
  linkedin: <LinkedinIcon size={16} />,
  twitter: <TwitterIcon size={16} />,
};

const PLATFORMS = [
  { label: "GitHub", value: "GitHub", icon: "github" },
  { label: "LinkedIn", value: "LinkedIn", icon: "linkedin" },
  { label: "Twitter / X", value: "Twitter", icon: "twitter" },
  { label: "Dribbble", value: "Dribbble", icon: "dribbble" },
  { label: "Behance", value: "Behance", icon: "behance" },
  { label: "YouTube", value: "YouTube", icon: "youtube" },
  { label: "Instagram", value: "Instagram", icon: "instagram" },
  { label: "Personal Website", value: "Website", icon: "globe" },
];

interface Props {
  initialSocials: SocialLink[];
}

export default function AdminSocialManager({ initialSocials }: Props) {
  const [socials, setSocials] = useState(initialSocials);
  const [showAdd, setShowAdd] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [newSocial, setNewSocial] = useState({ platform: "GitHub", url: "", icon: "github" });
  const [editValues, setEditValues] = useState<Partial<SocialLink>>({});
  const [loading, setLoading] = useState(false);

  const handleAdd = async () => {
    if (!newSocial.url.trim()) return;
    setLoading(true);
    try {
      const res = await fetch("/api/social", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newSocial),
      });
      if (res.ok) {
        const created = await res.json() as SocialLink;
        setSocials((prev) => [...prev, created]);
        setNewSocial({ platform: "GitHub", url: "", icon: "github" });
        setShowAdd(false);
        toast.success("Social link added!");
      } else {
        toast.error("Failed to add");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = async (id: string) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/social/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editValues),
      });
      if (res.ok) {
        const updated = await res.json() as SocialLink;
        setSocials((prev) => prev.map((s) => (s.id === id ? updated : s)));
        setEditingId(null);
        toast.success("Updated!");
      } else {
        toast.error("Failed to update");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    const res = await fetch(`/api/social/${id}`, { method: "DELETE" });
    if (res.ok) {
      setSocials((prev) => prev.filter((s) => s.id !== id));
      toast.success("Deleted");
    } else {
      toast.error("Failed to delete");
    }
  };

  return (
    <div className="space-y-5">
      <div className="flex justify-end">
        <button
          onClick={() => setShowAdd(!showAdd)}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-semibold text-sm hover:shadow-lg transition-all"
        >
          <Plus size={16} />
          Add Social Link
        </button>
      </div>

      <AnimatePresence>
        {showAdd && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="glass rounded-xl p-6 border border-indigo-500/20"
          >
            <h3 className="font-semibold text-slate-100 text-base mb-4">Add Social Link</h3>
            <div className="grid sm:grid-cols-2 gap-3 mb-4">
              <div>
                <label className="block text-sm text-slate-400 mb-1.5">Platform</label>
                <select
                  value={newSocial.platform}
                  onChange={(e) => {
                    const p = PLATFORMS.find((x) => x.value === e.target.value);
                    setNewSocial({ platform: e.target.value, url: newSocial.url, icon: p?.icon || e.target.value.toLowerCase() });
                  }}
                  className="form-input"
                >
                  {PLATFORMS.map((p) => (
                    <option key={p.value} value={p.value}>{p.label}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm text-slate-400 mb-1.5">URL</label>
                <input
                  value={newSocial.url}
                  onChange={(e) => setNewSocial({ ...newSocial, url: e.target.value })}
                  placeholder="https://github.com/username"
                  className="form-input"
                />
              </div>
            </div>
            <div className="flex gap-3">
              <button
                onClick={handleAdd}
                disabled={loading || !newSocial.url.trim()}
                className="px-5 py-2.5 rounded-lg bg-indigo-500 hover:bg-indigo-600 text-white text-sm font-medium disabled:opacity-70 flex items-center gap-2"
              >
                {loading ? <span className="w-3 h-3 border border-white/30 border-t-white rounded-full animate-spin" /> : <Plus size={14} />}
                Add
              </button>
              <button onClick={() => setShowAdd(false)} className="px-4 py-2.5 rounded-lg glass text-slate-400 text-sm">
                Cancel
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {socials.length === 0 ? (
        <div className="glass rounded-xl p-12 text-center text-slate-500 text-sm">
          No social links yet.
        </div>
      ) : (
        <div className="space-y-3">
          {socials.map((social) => (
            <motion.div
              key={social.id}
              layout
              className="glass rounded-xl p-5"
            >
              {editingId === social.id ? (
                <div className="grid sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm text-slate-400 mb-1.5">Platform</label>
                    <select
                      value={editValues.platform || social.platform}
                      onChange={(e) => {
                        const p = PLATFORMS.find((x) => x.value === e.target.value);
                        setEditValues({ ...editValues, platform: e.target.value, icon: p?.icon || e.target.value.toLowerCase() });
                      }}
                      className="form-input"
                    >
                      {PLATFORMS.map((p) => (
                        <option key={p.value} value={p.value}>{p.label}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm text-slate-400 mb-1.5">URL</label>
                    <input
                      value={editValues.url ?? social.url}
                      onChange={(e) => setEditValues({ ...editValues, url: e.target.value })}
                      className="form-input"
                    />
                  </div>
                  <div className="col-span-2 flex gap-2 justify-end">
                    <button onClick={() => setEditingId(null)} className="px-3 py-2 rounded-lg glass text-slate-400 text-sm">
                      <X size={14} />
                    </button>
                    <button
                      onClick={() => handleEdit(social.id)}
                      disabled={loading}
                      className="px-3 py-2 rounded-lg bg-indigo-500 text-white text-sm flex items-center gap-1"
                    >
                      <Check size={14} /> Save
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg glass-light flex items-center justify-center text-slate-400">
                      {iconMap[social.icon] || <Globe size={16} />}
                    </div>
                    <div>
                      <div className="font-medium text-slate-200 text-sm">{social.platform}</div>
                      <a href={social.url} target="_blank" rel="noopener noreferrer" className="text-slate-500 text-xs hover:text-indigo-400 truncate max-w-48 block">
                        {social.url}
                      </a>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => {
                        setEditingId(social.id);
                        setEditValues({ platform: social.platform, url: social.url, icon: social.icon });
                      }}
                      className="w-7 h-7 rounded-lg hover:bg-indigo-500/10 flex items-center justify-center text-slate-500 hover:text-indigo-400 transition-colors"
                    >
                      <Pencil size={13} />
                    </button>
                    <button
                      onClick={() => handleDelete(social.id)}
                      className="w-7 h-7 rounded-lg hover:bg-red-500/10 flex items-center justify-center text-slate-500 hover:text-red-400 transition-colors"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                </div>
              )}
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
