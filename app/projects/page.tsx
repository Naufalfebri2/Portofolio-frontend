"use client";

import { useQuery } from "@tanstack/react-query";
import Image from "next/image";
import Link from "next/link";
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

export default function ProjectsPage() {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["projects", "all"],
    queryFn: fetchProjects,
  });

  return (
    <section className="max-w-6xl mx-auto px-6 py-16">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
        All Projects
      </h1>
      <p className="text-gray-600 dark:text-gray-400 mb-10">
        A collection of projects I&apos;ve worked on, both solo and as part of a
        team.
      </p>

      {isLoading && (
        <p className="text-gray-500 text-sm">Loading projects...</p>
      )}

      {isError && (
        <p className="text-red-500 dark:text-red-400 text-sm">
          Failed to load projects. Make sure the API server is running.
        </p>
      )}

      {data && data.data.length === 0 && (
        <p className="text-gray-500 text-sm">
          No projects yet. Check back soon.
        </p>
      )}

      {data && data.data.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {data.data.map((project) => (
            <Link
              key={project.id}
              href={`/projects/${project.slug}`}
              className="block bg-gray-100 dark:bg-gray-900 border border-gray-300 dark:border-gray-800 rounded-xl overflow-hidden hover:border-gray-400 dark:hover:border-gray-700 transition-colors"
            >
              {project.thumbnail && (
                <div className="relative w-full aspect-video bg-gray-200 dark:bg-gray-800">
                  <Image
                    src={`${process.env.NEXT_PUBLIC_API_URL?.replace("/api", "")}${project.thumbnail}`}
                    alt={project.title}
                    fill
                    className="object-cover object-top"
                  />
                </div>
              )}

              <div className="p-4">
                <div className="flex items-center justify-between mb-1">
                  <h3 className="font-semibold text-gray-900 dark:text-white">
                    {project.title}
                  </h3>
                  <span className="text-xs bg-gray-200 dark:bg-gray-800 text-gray-600 dark:text-gray-400 px-2 py-0.5 rounded">
                    {project.type === "team" ? "Team" : "Solo"}
                  </span>
                </div>
                <p className="text-gray-600 dark:text-gray-400 text-sm mb-3 line-clamp-2">
                  {project.description}
                </p>
                <div className="flex flex-wrap gap-2">
                  {project.technologies.slice(0, 3).map((tech) => (
                    <span
                      key={tech.id}
                      className="text-xs bg-gray-200 dark:bg-gray-800 text-gray-700 dark:text-gray-300 px-2 py-1 rounded"
                    >
                      {tech.name}
                    </span>
                  ))}
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </section>
  );
}
