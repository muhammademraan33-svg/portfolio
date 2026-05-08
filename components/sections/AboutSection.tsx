"use client";

import { motion } from "framer-motion";
import { useInView } from "@/hooks/useInView";
import { MapPin, Mail, Phone, Download, CheckCircle } from "lucide-react";

interface AboutInfo {
  name: string;
  title: string;
  bio: string;
  email: string;
  phone: string;
  location: string;
  resumeUrl: string;
  avatarUrl: string;
}

interface AboutSectionProps {
  about: AboutInfo;
}

const achievements = [
  "5+ years of professional development experience",
  "50+ successful projects delivered",
  "Worked with 30+ clients worldwide",
  "Open source contributor with 1k+ GitHub stars",
];

export default function AboutSection({ about }: AboutSectionProps) {
  const { ref, inView } = useInView({ threshold: 0.2 });

  return (
    <section id="about" className="section-padding relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 grid-bg opacity-30 pointer-events-none" />

      <div className="page-container">
        {/* Section Header */}
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="text-indigo-400 text-sm font-semibold tracking-widest uppercase mb-3 block">
            Get To Know Me
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4">
            About <span className="gradient-text">Me</span>
          </h2>
          <div className="w-20 h-1 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full mx-auto" />
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left — Image */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="relative"
          >
            <div className="relative">
              {/* Decorative elements */}
              <div className="absolute -top-4 -left-4 w-72 h-72 bg-indigo-600/10 rounded-2xl" />
              <div className="absolute -bottom-4 -right-4 w-72 h-72 bg-purple-600/10 rounded-2xl" />

              <div className="relative w-full aspect-square max-w-sm mx-auto rounded-2xl overflow-hidden border border-indigo-500/20">
                {about.avatarUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={about.avatarUrl}
                    alt={about.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-indigo-900/50 to-purple-900/50 flex items-center justify-center">
                    <span className="text-9xl font-bold gradient-text opacity-40">
                      {about.name?.[0] || "A"}
                    </span>
                  </div>
                )}
              </div>

              {/* Stats card */}
              <div className="absolute -bottom-6 -right-6 glass rounded-xl p-4 text-center">
                <div className="text-3xl font-bold gradient-text">5+</div>
                <div className="text-slate-400 text-xs mt-1">Years Experience</div>
              </div>
            </div>
          </motion.div>

          {/* Right — Content */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.2 }}
          >
            <h3 className="text-2xl font-bold text-slate-100 mb-2">
              {about.name}
            </h3>
            <p className="text-indigo-400 font-medium mb-6">{about.title}</p>

            <p className="text-slate-400 leading-relaxed mb-8 text-base">
              {about.bio}
            </p>

            {/* Achievements */}
            <ul className="space-y-3 mb-8">
              {achievements.map((item, i) => (
                <motion.li
                  key={i}
                  initial={{ opacity: 0, x: 20 }}
                  animate={inView ? { opacity: 1, x: 0 } : {}}
                  transition={{ delay: 0.3 + i * 0.1 }}
                  className="flex items-start gap-3 text-slate-300 text-sm"
                >
                  <CheckCircle
                    size={16}
                    className="text-indigo-400 flex-shrink-0 mt-0.5"
                  />
                  {item}
                </motion.li>
              ))}
            </ul>

            {/* Contact info */}
            <div className="grid sm:grid-cols-3 gap-4 mb-8">
              {about.location && (
                <div className="flex items-center gap-2 text-slate-400 text-sm">
                  <MapPin size={14} className="text-indigo-400 flex-shrink-0" />
                  <span>{about.location}</span>
                </div>
              )}
              {about.email && (
                <div className="flex items-center gap-2 text-slate-400 text-sm">
                  <Mail size={14} className="text-indigo-400 flex-shrink-0" />
                  <span className="truncate">{about.email}</span>
                </div>
              )}
              {about.phone && (
                <div className="flex items-center gap-2 text-slate-400 text-sm">
                  <Phone size={14} className="text-indigo-400 flex-shrink-0" />
                  <span>{about.phone}</span>
                </div>
              )}
            </div>

            {about.resumeUrl && about.resumeUrl !== "#" && (
              <motion.a
                href={about.resumeUrl}
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-semibold hover:shadow-lg hover:shadow-indigo-500/30 transition-all"
              >
                <Download size={16} />
                Download Resume
              </motion.a>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
