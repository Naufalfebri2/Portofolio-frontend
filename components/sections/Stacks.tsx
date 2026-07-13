"use client";

import { motion } from "framer-motion";
import {
  SiLaravel,
  SiPhp,
  SiPostgresql,
  SiMysql,
  SiLivewire,
  SiNextdotjs,
  SiReact,
  SiTypescript,
  SiTailwindcss,
  SiFlutter,
  SiGit,
  SiGithub,
} from "react-icons/si";
import { VscVscode } from "react-icons/vsc";

const stackGroups = [
  {
    label: "Backend",
    items: [
      { name: "Laravel", icon: SiLaravel, color: "#FF2D20" },
      { name: "PHP", icon: SiPhp, color: "#777BB4" },
      { name: "PostgreSQL", icon: SiPostgresql, color: "#4169E1" },
      { name: "MySQL", icon: SiMysql, color: "#4479A1" },
      { name: "Livewire", icon: SiLivewire, color: "#4E56A6" },
    ],
  },
  {
    label: "Frontend",
    items: [
      // Official brand color is pure black — overridden to white so the
      // mark stays visible on this dark background (same treatment
      // Vercel/GitHub use on their own dark-mode surfaces).
      { name: "Next.js", icon: SiNextdotjs, color: "#FFFFFF" },
      { name: "React", icon: SiReact, color: "#61DAFB" },
      { name: "TypeScript", icon: SiTypescript, color: "#3178C6" },
      { name: "Tailwind CSS", icon: SiTailwindcss, color: "#06B6D4" },
    ],
  },
  {
    label: "Mobile & Tools",
    items: [
      { name: "Flutter", icon: SiFlutter, color: "#02569B" },
      { name: "Git", icon: SiGit, color: "#F05032" },
      // Same black-override reasoning as Next.js above.
      { name: "GitHub", icon: SiGithub, color: "#FFFFFF" },
      { name: "VS Code", icon: VscVscode, color: "#007ACC" },
    ],
  },
];

export default function Stacks() {
  return (
    <section id="stacks" className="relative max-w-5xl mx-auto px-6 py-32">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.6 }}
        className="text-center mb-16"
      >
        <p className="text-sm text-accent-400 font-medium mb-2">
          Built With Precision
        </p>
        <h2 className="text-3xl md:text-5xl font-bold text-white">
          Core <span className="text-gradient-accent">Stack</span>
        </h2>
      </motion.div>

      <div className="space-y-12">
        {stackGroups.map((group, groupIndex) => (
          <div key={group.label}>
            <p className="text-sm text-gray-500 mb-4 text-center md:text-left">
              {group.label}
            </p>
            <div className="flex flex-wrap justify-center md:justify-start gap-3">
              {group.items.map((item, index) => {
                const Icon = item.icon;
                return (
                  <motion.div
                    key={item.name}
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true, margin: "-60px" }}
                    transition={{
                      duration: 0.35,
                      delay: groupIndex * 0.1 + index * 0.04,
                    }}
                    whileHover={{ y: -3 }}
                    className="group flex items-center gap-2.5 px-4 py-2.5 rounded-xl border border-gray-800 bg-gray-900/40 hover:border-accent-500/60 transition-colors"
                  >
                    <Icon
                      size={18}
                      style={{ color: item.color }}
                      className="grayscale opacity-50 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-300"
                    />
                    <span className="text-sm text-gray-300 group-hover:text-white transition-colors">
                      {item.name}
                    </span>
                  </motion.div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
