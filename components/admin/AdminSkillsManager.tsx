"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";
import { Plus, Pencil, Trash2, Check, X } from "lucide-react";

interface Skill {
  id: string;
  name: string;
  level: number;
  category: string;
  icon: string;
  sortOrder: number;
}

interface Props {
  initialSkills: Skill[];
}

const CATEGORIES = ["Frontend", "Backend", "DevOps", "Design", "Database", "Mobile", "Other"];

const categoryColors: Record<string, string> = {
  Frontend: "bg-blue-500/10 border-blue-500/20 text-blue-400",
  Backend: "bg-green-500/10 border-green-500/20 text-green-400",
  DevOps: "bg-orange-500/10 border-orange-500/20 text-orange-400",
  Design: "bg-pink-500/10 border-pink-500/20 text-pink-400",
  Database: "bg-indigo-500/10 border-indigo-500/20 text-indigo-400",
  Mobile: "bg-purple-500/10 border-purple-500/20 text-purple-400",
  Other: "bg-slate-500/10 border-slate-500/20 text-slate-400",
};

const barColors: Record<string, string> = {
  Frontend: "from-blue-500 to-cyan-500",
  Backend: "from-green-500 to-emerald-500",
  DevOps: "from-orange-500 to-amber-500",
  Design: "from-pink-500 to-rose-500",
  Database: "from-indigo-500 to-violet-500",
  Mobile: "from-purple-500 to-fuchsia-500",
  Other: "from-slate-500 to-gray-500",
};

function SkillRow({ skill, onUpdate, onDelete }: {
  skill: Skill;
  onUpdate: (id: string, data: Partial<Skill>) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
}) {
  const [editing, setEditing] = useState(false);
  const [values, setValues] = useState(skill);
  const [saving, setSaving] = useState(false);

  const save = async () => {
    setSaving(true);
    await onUpdate(skill.id, values);
    setSaving(false);
    setEditing(false);
  };

  if (editing) {
    return (
      <motion.div
        layout
        className="glass rounded-xl p-4 border border-indigo-500/20"
      >
        <div className="grid sm:grid-cols-4 gap-3 mb-3">
          <input
            value={values.name}
            onChange={(e) => setValues({ ...values, name: e.target.value })}
            placeholder="Skill name"
            className="form-input col-span-2"
          />
          <select
            value={values.category}
            onChange={(e) => setValues({ ...values, category: e.target.value })}
            className="form-input"
          >
            {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
          <div className="flex items-center gap-2">
            <input
              type="number"
              min={0}
              max={100}
              value={values.level}
              onChange={(e) => setValues({ ...values, level: Number(e.target.value) })}
              className="form-input"
            />
            <span className="text-slate-400 text-sm">%</span>
          </div>
        </div>
        <div className="flex justify-end gap-2">
          <button
            onClick={() => setEditing(false)}
            className="px-3 py-1.5 rounded-lg glass text-slate-400 hover:text-white text-sm transition-colors"
          >
            <X size={14} />
          </button>
          <button
            onClick={save}
            disabled={saving}
            className="px-3 py-1.5 rounded-lg bg-indigo-500 text-white text-sm hover:bg-indigo-600 transition-colors flex items-center gap-1"
          >
            {saving ? <span className="w-3 h-3 border border-white/30 border-t-white rounded-full animate-spin" /> : <Check size={14} />}
            Save
          </button>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div layout className="glass rounded-xl p-4 group">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-3">
          <span className={`px-2 py-0.5 rounded-full text-xs border ${categoryColors[skill.category] || categoryColors.Other}`}>
            {skill.category}
          </span>
          <span className="font-medium text-slate-200">{skill.name}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-slate-400 text-sm">{skill.level}%</span>
          <button
            onClick={() => setEditing(true)}
            className="w-7 h-7 rounded-lg hover:bg-indigo-500/10 flex items-center justify-center text-slate-500 hover:text-indigo-400 opacity-0 group-hover:opacity-100 transition-all"
          >
            <Pencil size={13} />
          </button>
          <button
            onClick={() => onDelete(skill.id)}
            className="w-7 h-7 rounded-lg hover:bg-red-500/10 flex items-center justify-center text-slate-500 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-all"
          >
            <Trash2 size={13} />
          </button>
        </div>
      </div>
      <div className="skill-bar">
        <div
          className={`h-full bg-gradient-to-r ${barColors[skill.category] || "from-indigo-500 to-purple-500"} rounded-full transition-all`}
          style={{ width: `${skill.level}%` }}
        />
      </div>
    </motion.div>
  );
}

export default function AdminSkillsManager({ initialSkills }: Props) {
  const [skills, setSkills] = useState(initialSkills);
  const [showAdd, setShowAdd] = useState(false);
  const [newSkill, setNewSkill] = useState({
    name: "",
    level: 80,
    category: "Frontend",
    icon: "",
    sortOrder: 0,
  });
  const [adding, setAdding] = useState(false);

  const handleAdd = async () => {
    if (!newSkill.name.trim()) return;
    setAdding(true);
    try {
      const res = await fetch("/api/skills", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newSkill),
      });
      if (res.ok) {
        const created = await res.json() as Skill;
        setSkills((prev) => [...prev, created]);
        setNewSkill({ name: "", level: 80, category: "Frontend", icon: "", sortOrder: 0 });
        setShowAdd(false);
        toast.success("Skill added!");
      } else {
        toast.error("Failed to add skill");
      }
    } finally {
      setAdding(false);
    }
  };

  const handleUpdate = async (id: string, data: Partial<Skill>) => {
    const res = await fetch(`/api/skills/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (res.ok) {
      const updated = await res.json() as Skill;
      setSkills((prev) => prev.map((s) => (s.id === id ? updated : s)));
      toast.success("Skill updated!");
    } else {
      toast.error("Failed to update");
    }
  };

  const handleDelete = async (id: string) => {
    const res = await fetch(`/api/skills/${id}`, { method: "DELETE" });
    if (res.ok) {
      setSkills((prev) => prev.filter((s) => s.id !== id));
      toast.success("Skill deleted");
    } else {
      toast.error("Failed to delete");
    }
  };

  const categories = [...new Set(skills.map((s) => s.category))];

  return (
    <div>
      <div className="flex justify-end mb-6">
        <button
          onClick={() => setShowAdd(!showAdd)}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-medium text-sm hover:shadow-lg hover:shadow-indigo-500/25 transition-all"
        >
          <Plus size={16} />
          Add Skill
        </button>
      </div>

      {/* Add form */}
      <AnimatePresence>
        {showAdd && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="glass rounded-xl p-6 mb-6 border border-indigo-500/20"
          >
            <h3 className="font-semibold text-slate-100 mb-4">New Skill</h3>
            <div className="grid sm:grid-cols-4 gap-3 mb-4">
              <input
                value={newSkill.name}
                onChange={(e) => setNewSkill({ ...newSkill, name: e.target.value })}
                placeholder="Skill name"
                className="form-input col-span-2"
              />
              <select
                value={newSkill.category}
                onChange={(e) => setNewSkill({ ...newSkill, category: e.target.value })}
                className="form-input"
              >
                {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  min={0}
                  max={100}
                  value={newSkill.level}
                  onChange={(e) => setNewSkill({ ...newSkill, level: Number(e.target.value) })}
                  className="form-input"
                />
                <span className="text-slate-400 text-sm">%</span>
              </div>
            </div>
            <div className="flex gap-3">
              <button
                onClick={handleAdd}
                disabled={adding || !newSkill.name.trim()}
                className="px-5 py-2 rounded-lg bg-indigo-500 hover:bg-indigo-600 text-white text-sm font-medium transition-colors disabled:opacity-70 flex items-center gap-2"
              >
                {adding ? <span className="w-3 h-3 border border-white/30 border-t-white rounded-full animate-spin" /> : <Plus size={14} />}
                Add Skill
              </button>
              <button
                onClick={() => setShowAdd(false)}
                className="px-4 py-2 rounded-lg glass text-slate-400 hover:text-white text-sm transition-colors"
              >
                Cancel
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Skills by category */}
      {categories.map((cat) => (
        <div key={cat} className="mb-8">
          <h3 className={`text-sm font-semibold mb-3 px-1 ${categoryColors[cat]?.split(" ")[2] || "text-slate-400"}`}>
            {cat}
          </h3>
          <div className="space-y-2">
            {skills
              .filter((s) => s.category === cat)
              .map((skill) => (
                <SkillRow
                  key={skill.id}
                  skill={skill}
                  onUpdate={handleUpdate}
                  onDelete={handleDelete}
                />
              ))}
          </div>
        </div>
      ))}

      {skills.length === 0 && (
        <div className="glass rounded-xl p-12 text-center text-slate-500">
          No skills yet. Add your first skill!
        </div>
      )}
    </div>
  );
}
