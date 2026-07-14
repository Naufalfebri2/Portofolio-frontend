"use client";

import { useQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { api } from "@/lib/api";
import type { Project } from "@/types";

interface ProjectDetailResponse {
  data: Project;
}

function GithubIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M12 .5C5.65.5.5 5.65.5 12c0 5.08 3.29 9.39 7.86 10.91.57.1.78-.25.78-.55 0-.27-.01-1.17-.02-2.12-3.2.7-3.88-1.36-3.88-1.36-.52-1.33-1.28-1.68-1.28-1.68-1.05-.72.08-.7.08-.7 1.16.08 1.77 1.19 1.77 1.19 1.03 1.77 2.7 1.26 3.36.96.1-.75.4-1.26.73-1.55-2.55-.29-5.24-1.28-5.24-5.68 0-1.25.45-2.28 1.19-3.08-.12-.29-.52-1.46.11-3.05 0 0 .97-.31 3.18 1.18a11.05 11.05 0 0 1 5.79 0c2.2-1.49 3.17-1.18 3.17-1.18.63 1.59.24 2.76.12 3.05.74.8 1.19 1.83 1.19 3.08 0 4.41-2.69 5.38-5.25 5.67.41.36.78 1.06.78 2.14 0 1.55-.01 2.79-.01 3.17 0 .3.2.66.79.55A10.52 10.52 0 0 0 23.5 12c0-6.35-5.15-11.5-11.5-11.5Z" />
    </svg>
  );
}

async function fetchProjectBySlug(
  slug: string,
): Promise<ProjectDetailResponse> {
  const res = await api.get<ProjectDetailResponse>(`/projects/${slug}`);
  return res.data;
}

export default function ProjectDetailPage() {
  const params = useParams<{ slug: string }>();

  const { data, isLoading, isError } = useQuery({
    queryKey: ["projects", "detail", params.slug],
    queryFn: () => fetchProjectBySlug(params.slug),
  });

  if (isLoading) {
    return (
      <section className="max-w-4xl mx-auto px-6 pt-8 pb-24">
        <p className="text-gray-500 text-sm">Loading project...</p>
      </section>
    );
  }

  if (isError || !data) {
    return (
      <section className="max-w-4xl mx-auto px-6 pt-8 pb-24 text-center">
        <p className="text-red-500 dark:text-red-400 text-sm mb-4">
          Project not found.
        </p>
        <Link
          href="/#projects"
          className="text-accent-500 dark:text-accent-400 text-sm hover:underline inline-flex items-center gap-1.5"
        >
          <ArrowLeft size={14} /> Back to Home
        </Link>
      </section>
    );
  }

  const project = data.data;
  const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL?.replace("/api", "");

  return (
    <section className="max-w-4xl mx-auto px-6 pt-8 pb-24">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <Link
          href="/#projects"
          className="text-gray-500 dark:text-gray-400 hover:text-accent-500 dark:hover:text-accent-400 text-sm mb-8 inline-flex items-center gap-1.5 transition-colors"
        >
          <ArrowLeft size={14} /> Back to all projects
        </Link>

        <div className="flex items-start justify-between gap-4 mb-1">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
            {project.title}
          </h1>
          <span className="shrink-0 text-xs border border-gray-300 dark:border-gray-800 text-gray-600 dark:text-gray-400 px-3 py-1 rounded-full whitespace-nowrap">
            {project.type === "team" ? "Team Project" : "Solo Project"}
          </span>
        </div>

        {project.role && (
          <p className="text-accent-500 dark:text-accent-400 text-sm mb-8">
            Role: {project.role}
          </p>
        )}
      </motion.div>

      {project.thumbnail && (
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="relative w-full aspect-video bg-gray-100 dark:bg-gray-900 rounded-xl overflow-hidden border border-gray-300 dark:border-gray-800 mb-8"
        >
          <Image
            src={`${apiBaseUrl}${project.thumbnail}`}
            alt={project.title}
            fill
            className="object-cover object-top"
            priority
          />
        </motion.div>
      )}

      <motion.p
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.15 }}
        className="text-gray-700 dark:text-gray-300 leading-relaxed mb-8"
      >
        {project.description}
      </motion.p>

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.2 }}
        className="mb-8"
      >
        <h2 className="text-xs font-semibold text-gray-500 tracking-wide mb-3">
          TECH STACK
        </h2>
        <div className="flex flex-wrap gap-2">
          {project.technologies.map((tech) => (
            <span
              key={tech.id}
              className="text-sm border border-gray-300 dark:border-gray-800 text-gray-700 dark:text-gray-300 px-3 py-1.5 rounded-full"
            >
              {tech.name}
            </span>
          ))}
        </div>
      </motion.div>

      {project.repo_url && (
        <motion.a
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.25 }}
          href={project.repo_url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 border border-gray-300 dark:border-gray-800 hover:border-accent-500/60 text-gray-900 dark:text-white text-sm font-medium px-4 py-2.5 rounded-lg transition-colors mb-14"
        >
          <GithubIcon width={16} height={16} />
          View Source Code
        </motion.a>
      )}

      {project.images.length > 0 && (
        <div>
          <h2 className="text-xs font-semibold text-gray-500 tracking-wide mb-4">
            GALLERY
          </h2>
          <div className="columns-1 sm:columns-2 gap-4 *:mb-4">
            {project.images.map((image, index) => (
              <motion.div
                key={image.id}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
                className="group relative w-full bg-gray-100 dark:bg-gray-900 rounded-lg overflow-hidden border border-gray-300 dark:border-gray-800 break-inside-avoid"
              >
                <Image
                  src={`${apiBaseUrl}${image.url}`}
                  alt={image.caption ?? project.title}
                  width={800}
                  height={600}
                  className="w-full h-auto transition-transform duration-500 group-hover:scale-[1.02]"
                />
              </motion.div>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}
