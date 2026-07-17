import type { MetadataRoute } from "next";
import type { Project } from "@/types";

interface ProjectsResponse {
  data: Project[];
}

async function getAllProjectSlugs(): Promise<string[]> {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/projects`, {
      next: { revalidate: 3600 },
    });

    if (!res.ok) return [];

    const json: ProjectsResponse = await res.json();

    return json.data.map((project) => project.slug);
  } catch {
    // If the API is unreachable at build time, fall back to an empty
    // list rather than failing the whole build — the sitemap will just
    // be missing project pages until the next successful build.
    return [];
  }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${baseUrl}/projects`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.9,
    },
  ];

  const slugs = await getAllProjectSlugs();

  const projectRoutes: MetadataRoute.Sitemap = slugs.map((slug) => ({
    url: `${baseUrl}/projects/${slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  return [...staticRoutes, ...projectRoutes];
}