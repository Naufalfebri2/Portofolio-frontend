"use client";

import { useRef } from "react";
import { motion, useScroll, useSpring, useTransform } from "framer-motion";

const timeline = [
  {
    period: "2025 — Present",
    role: "Backend Developer",
    org: "Kelolain · Project Team",
    description:
      "Built 100+ REST API endpoints for a Laravel 12 + Sanctum + PostgreSQL SaaS platform targeting Indonesian SMEs. Developed the Auth, Product, Invoice, and Owner/User Dashboard modules, a Help Center system, soft deletes across 10 tables, an SEO/Marketing module, user management for Owners, and an automated daily backup system with a custom Artisan command and Laravel Scheduler.",
    tags: ["Laravel 12", "Sanctum", "PostgreSQL", "REST API"],
  },
  {
    period: "2024 — 2025",
    role: "Front-End Developer",
    org: "Employee Attendance App · Project Team",
    description:
      "Developed a mobile employee attendance app using Flutter with a Clean Architecture approach and BLoC state management, ensuring a structured and scalable data flow.",
    tags: ["Flutter", "Clean Architecture", "BLoC"],
  },
  {
    period: "2023 — 2024",
    role: "Web Developer (Solo)",
    org: "HvnCake's & KopiKita",
    description:
      "Designed and built F&B e-commerce landing pages from scratch using pure HTML, CSS, and JavaScript, complete with a WhatsApp checkout flow to streamline customer transactions.",
    tags: ["HTML/CSS", "JavaScript", "WhatsApp Checkout"],
  },
];

export default function Experience() {
  // Tracks scroll progress across the timeline rail itself (not the whole
  // section) so the dot's 0%/100% lines up exactly with the first and
  // last entry, regardless of how much heading/padding sits above it.
  const railRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: railRef,
    // progress = 0 when the rail's top crosses viewport center,
    // progress = 1 when the rail's bottom crosses viewport center.
    offset: ["start center", "end center"],
  });

  // Spring-smooth the raw scroll progress so the dot glides instead of
  // snapping to the exact scroll position every frame.
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 22,
    mass: 0.5,
  });

  const dotTop = useTransform(smoothProgress, [0, 1], ["0%", "100%"]);

  return (
    <section id="about" className="relative max-w-4xl mx-auto px-6 py-32">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.6 }}
        className="text-center mb-20"
      >
        <p className="text-sm text-accent-400 font-medium mb-2">
          Behind The Scenes
        </p>
        <h2 className="text-3xl md:text-5xl font-bold text-white">
          Experience <span className="text-gradient-accent">Built</span>
        </h2>
      </motion.div>

      <div ref={railRef} className="relative pl-10">
        {/* Static background rail line */}
        <div className="absolute -left-8.25 top-1.5 bottom-1.5 w-px bg-gray-800" />

        {/* The one dot that actually moves — position driven by scroll */}
        <motion.span
          style={{ top: dotTop }}
          className="absolute -left-10 w-3.5 h-3.5 -translate-y-1/2 rounded-full bg-accent-500 shadow-[0_0_12px_2px_var(--color-accent-500)] z-10"
        />

        {timeline.map((item, index) => (
          <motion.div
            key={item.org}
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className="relative mb-14 last:mb-0"
          >
            {/* Passive marker for this entry — doesn't move, just a tick
                on the rail so the moving dot has something to pass by */}
            <span className="absolute -left-10 top-1.5 w-3.5 h-3.5 rounded-full border-2 border-gray-700 bg-gray-950" />

            <p className="text-sm text-gray-500 mb-1">{item.period}</p>
            <h3 className="text-xl font-semibold text-white mb-0.5">
              {item.role}
            </h3>
            <p className="text-sm text-accent-400 mb-3">{item.org}</p>
            <p className="text-gray-400 leading-relaxed mb-4 max-w-2xl">
              {item.description}
            </p>

            <div className="flex flex-wrap gap-2">
              {item.tags.map((tag) => (
                <span
                  key={tag}
                  className="text-xs px-2.5 py-1 rounded-full border border-gray-800 text-gray-400"
                >
                  {tag}
                </span>
              ))}
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
