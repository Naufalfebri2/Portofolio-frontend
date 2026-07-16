import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import ProjectDetailClient from "@/components/projects/ProjectDetailClient";
import type { Project } from "@/types";

interface ProjectDetailResponse {
  data: Project;
}

async function getProject(slug: string): Promise<Project | null> {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/projects/${slug}`,
      {
        // Revalidate once an hour — project content rarely changes minute
        // to minute, so this avoids hitting the Laravel API on every
        // single page view while still keeping metadata reasonably fresh.
        next: { revalidate: 3600 },
      },
    );

    if (!res.ok) {
      return null;
    }

    const json: ProjectDetailResponse = await res.json();

    return json.data;
  } catch {
    return null;
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const project = await getProject(slug);

  if (!project) {
    return {
      title: "Project Not Found — Naufal Febriansyah",
    };
  }

  const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL?.replace("/api", "");
  const description = project.description.slice(0, 155);
  const imageUrl = project.thumbnail
    ? `${apiBaseUrl}${project.thumbnail}`
    : undefined;

  return {
    title: `${project.title} — Naufal Febriansyah`,
    description,
    openGraph: {
      title: project.title,
      description,
      type: "article",
      images: imageUrl ? [{ url: imageUrl }] : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title: project.title,
      description,
      images: imageUrl ? [imageUrl] : undefined,
    },
  };
}

export default async function ProjectDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = await getProject(slug);

  if (!project) {
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

  return <ProjectDetailClient project={project} />;
}
