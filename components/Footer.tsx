"use client";

import { motion } from "framer-motion";
import { Heart, Code2 } from "lucide-react";
import { GithubIcon, LinkedinIcon, TwitterIcon } from "@/components/ui/SocialIcons";

interface SocialLink {
  platform: string;
  url: string;
  icon: string;
}

interface FooterProps {
  socials: SocialLink[];
  name: string;
}

const iconMap: Record<string, React.ReactNode> = {
  github: <GithubIcon size={18} />,
  linkedin: <LinkedinIcon size={18} />,
  twitter: <TwitterIcon size={18} />,
};

export default function Footer({ socials, name }: FooterProps) {
  return (
    <footer className="border-t border-[#3dff7e]/30 bg-[#031014]">
      <div className="page-container" style={{ paddingTop: "2.5rem", paddingBottom: "2.5rem" }}>
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#3dff7e] to-[#1ad1ff] flex items-center justify-center">
              <Code2 size={16} className="text-[#00120a]" />
            </div>
            <span className="font-bold">
              <span className="gradient-text">{name.split(" ")[0]}</span>
              <span className="text-[#5ea884]">.dev</span>
            </span>
          </div>

          {/* Social links */}
          <div className="flex items-center gap-3">
            {socials.map((social) => (
              <motion.a
                key={social.platform}
                href={social.url}
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.1, y: -2 }}
                whileTap={{ scale: 0.9 }}
                className="w-9 h-9 rounded-lg glass-light flex items-center justify-center text-[#73b895] hover:text-[#3dff7e] transition-colors"
                title={social.platform}
              >
                {iconMap[social.icon] || <span className="text-xs">{social.platform[0]}</span>}
              </motion.a>
            ))}
          </div>

          {/* Copyright */}
          <p className="text-[#5ea884] text-sm flex items-center gap-1.5">
            Built with{" "}
            <Heart size={13} className="text-red-500 fill-current" />
            {" "}by{" "}
            <span className="text-[#d9ffe9] font-medium">{name}</span>
          </p>
        </div>
      </div>
    </footer>
  );
}
