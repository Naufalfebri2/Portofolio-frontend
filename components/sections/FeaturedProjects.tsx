"use client";

import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { api } from "@/lib/api";
import type { Project, PaginationMeta } from "@/types";

interface ProjectsResponse {
  data: Project[];
  meta: PaginationMeta;
}

async function fetchProjects(): Promise<ProjectsResponse> {
  const res = await api.get<ProjectsResponse>("/projects");
  return res.data;
}

function SectionHeading() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.6 }}
      className="text-center mb-16"
    >
      <p className="text-sm text-accent-500 dark:text-accent-400 font-medium mb-2">
        From Idea to System
      </p>
      <h2 className="text-3xl md:text-5xl font-bold text-gray-900 dark:text-white">
        Featured <span className="text-gradient-accent">Projects</span>
      </h2>
    </motion.div>
  );
}

export default function FeaturedProjects({
  initialProjects,
}: {
  initialProjects?: ProjectsResponse;
}) {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["projects", "featured"],
    queryFn: fetchProjects,
    initialData: initialProjects,
  });

  if (isLoading) {
    return (
      <section id="projects" className="max-w-5xl mx-auto px-6 py-32">
        <SectionHeading />
        <p className="text-gray-500 text-sm text-center">Loading projects...</p>
      </section>
    );
  }

  if (isError || !data) {
    return (
      <section id="projects" className="max-w-5xl mx-auto px-6 py-32">
        <SectionHeading />
        <p className="text-red-500 dark:text-red-400 text-sm text-center">
          Failed to load projects. Make sure the API server is running.
        </p>
      </section>
    );
  }

  const featuredProjects = data.data.filter((project) => project.is_featured);

  return (
    <section id="projects" className="relative max-w-5xl mx-auto px-6 py-32">
      <SectionHeading />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {featuredProjects.map((project, index) => (
          <motion.div
            key={project.id}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.5, delay: index * 0.08 }}
          >
            <Link
              href={`/projects/${project.slug}`}
              className="group block bg-gray-100 dark:bg-gray-900/40 border border-gray-300 dark:border-gray-800 rounded-xl overflow-hidden hover:border-accent-500/60 transition-colors"
            >
              {project.thumbnail && (
                <div className="relative w-full aspect-video bg-gray-200 dark:bg-gray-800 overflow-hidden">
                  <Image
                    src={`${process.env.NEXT_PUBLIC_API_URL?.replace("/api", "")}${project.thumbnail}`}
                    alt={project.title}
                    fill
                    className="object-cover object-top transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
              )}

              <div className="p-5">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-1.5 group-hover:text-accent-500 dark:group-hover:text-accent-400 transition-colors">
                  {project.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 line-clamp-2 leading-relaxed">
                  {project.description}
                </p>
                <div className="flex flex-wrap gap-2">
                  {project.technologies.slice(0, 3).map((tech) => (
                    <span
                      key={tech.id}
                      className="text-xs px-2.5 py-1 rounded-full border border-gray-300 dark:border-gray-800 text-gray-600 dark:text-gray-400"
                    >
                      {tech.name}
                    </span>
                  ))}
                </div>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>

      {featuredProjects.length > 0 && (
        <div className="flex justify-center mt-14">
          <Link
            href="/projects"
            className="inline-flex items-center gap-2 text-sm text-gray-900 dark:text-white border border-gray-300 dark:border-gray-700 hover:border-accent-500/60 rounded-full px-5 py-2.5 transition-colors"
          >
            View All Projects <ArrowRight size={15} />
          </Link>
        </div>
      )}
    </section>
  );
}
