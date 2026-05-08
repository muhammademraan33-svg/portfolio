"use client";

import { motion } from "framer-motion";
import { useInView } from "@/hooks/useInView";

interface Skill {
  id: string;
  name: string;
  level: number;
  category: string;
}

interface SkillsSectionProps {
  skills: Skill[];
}

const categoryColors: Record<string, string> = {
  Frontend: "from-blue-500 to-cyan-400",
  Backend:  "from-green-500 to-emerald-400",
  DevOps:   "from-orange-500 to-amber-400",
  Design:   "from-pink-500 to-rose-400",
  Database: "from-indigo-500 to-violet-400",
  Mobile:   "from-purple-500 to-fuchsia-400",
  Other:    "from-slate-500 to-gray-400",
};

const categoryBadge: Record<string, { bg: string; text: string; border: string }> = {
  Frontend: { bg: "rgba(59,130,246,0.1)",  text: "#60a5fa", border: "rgba(59,130,246,0.25)" },
  Backend:  { bg: "rgba(34,197,94,0.1)",   text: "#4ade80", border: "rgba(34,197,94,0.25)"  },
  DevOps:   { bg: "rgba(249,115,22,0.1)",  text: "#fb923c", border: "rgba(249,115,22,0.25)" },
  Design:   { bg: "rgba(236,72,153,0.1)",  text: "#f472b6", border: "rgba(236,72,153,0.25)"},
  Database: { bg: "rgba(99,102,241,0.1)",  text: "#818cf8", border: "rgba(99,102,241,0.25)" },
  Mobile:   { bg: "rgba(168,85,247,0.1)",  text: "#c084fc", border: "rgba(168,85,247,0.25)" },
  Other:    { bg: "rgba(100,116,139,0.1)", text: "#94a3b8", border: "rgba(100,116,139,0.25)"},
};

const defaultBadge = categoryBadge.Other;

function getBadge(cat: string) {
  return categoryBadge[cat] || defaultBadge;
}

function getGradient(cat: string) {
  return categoryColors[cat] || categoryColors.Other;
}

const stats = [
  { value: "50+", label: "Projects Completed" },
  { value: "30+", label: "Happy Clients" },
  { value: "5+",  label: "Years Experience" },
  { value: "10+", label: "Awards Won" },
];

export default function SkillsSection({ skills }: SkillsSectionProps) {
  const { ref, inView } = useInView({ threshold: 0.1 });

  const categories = [...new Set(skills.map(s => s.category))];

  return (
    <section id="skills" className="section-padding relative overflow-hidden">
      {/* Background */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "radial-gradient(ellipse at 50% 0%, rgba(99,102,241,0.08) 0%, transparent 60%)",
          pointerEvents: "none",
        }}
      />

      <div className="page-container">
        {/* ── Header ── */}
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          style={{ textAlign: "center", marginBottom: "3.5rem" }}
        >
          <span className="section-label">What I Know</span>
          <h2 className="section-heading">
            My <span className="gradient-text">Skills</span>
          </h2>
          <div className="section-divider" />
        </motion.div>

        {/* ── Category filter pills ── */}
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "center",
            gap: "0.6rem",
            marginBottom: "2.5rem",
          }}
        >
          {categories.map(cat => {
            const badge = getBadge(cat);
            return (
              <span
                key={cat}
                style={{
                  padding: "0.35rem 1rem",
                  borderRadius: 99,
                  fontSize: "0.8rem",
                  fontWeight: 600,
                  background: badge.bg,
                  color: badge.text,
                  border: `1px solid ${badge.border}`,
                }}
              >
                {cat}
              </span>
            );
          })}
        </div>

        {/* ── Skills grid ── */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
            gap: "1.25rem",
            width: "100%",
          }}
        >
          {skills.map((skill, i) => {
            const gradient = getGradient(skill.category);
            const badge    = getBadge(skill.category);
            return (
              <motion.div
                key={skill.id}
                initial={{ opacity: 0, y: 18 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.45, delay: i * 0.04 }}
                className="glass card-hover"
                style={{ borderRadius: 14, padding: "1.2rem 1.4rem" }}
              >
                {/* Name + badge + percent */}
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    marginBottom: "0.9rem",
                    gap: "0.5rem",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: "0.6rem", minWidth: 0 }}>
                    <div
                      className={`bg-gradient-to-r ${gradient}`}
                      style={{ width: 8, height: 8, borderRadius: "50%", flexShrink: 0 }}
                    />
                    <span
                      style={{
                        fontWeight: 600,
                        fontSize: "0.9rem",
                        color: "#e2e8f0",
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                      }}
                    >
                      {skill.name}
                    </span>
                  </div>

                  <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", flexShrink: 0 }}>
                    <span
                      style={{
                        padding: "0.15rem 0.55rem",
                        borderRadius: 99,
                        fontSize: "0.68rem",
                        fontWeight: 600,
                        background: badge.bg,
                        color: badge.text,
                        border: `1px solid ${badge.border}`,
                      }}
                    >
                      {skill.category}
                    </span>
                    <span style={{ color: "#94a3b8", fontSize: "0.82rem", fontWeight: 600 }}>
                      {skill.level}%
                    </span>
                  </div>
                </div>

                {/* Progress bar */}
                <div className="skill-bar">
                  <motion.div
                    className={`h-full bg-gradient-to-r ${gradient} rounded-full`}
                    initial={{ width: 0 }}
                    animate={inView ? { width: `${skill.level}%` } : { width: 0 }}
                    transition={{ duration: 1.1, delay: 0.25 + i * 0.04, ease: "easeOut" }}
                  />
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* ── Stats ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.7 }}
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))",
            gap: "1.25rem",
            marginTop: "4rem",
          }}
        >
          {stats.map(stat => (
            <div
              key={stat.label}
              className="glass"
              style={{
                borderRadius: 14,
                padding: "1.5rem 1rem",
                textAlign: "center",
              }}
            >
              <div
                className="gradient-text"
                style={{ fontSize: "2rem", fontWeight: 800, lineHeight: 1 }}
              >
                {stat.value}
              </div>
              <div style={{ color: "#64748b", fontSize: "0.8rem", marginTop: "0.4rem" }}>
                {stat.label}
              </div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
