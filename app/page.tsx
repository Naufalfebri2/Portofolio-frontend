import Hero from "@/components/sections/Hero";
import Experience from "@/components/sections/Experience";
import Stacks from "@/components/sections/Stacks";
import FeaturedProjects from "@/components/sections/FeaturedProjects";
import Contact from "@/components/sections/Contact";
import type { Profile, Project, PaginationMeta } from "@/types";

interface ProfileResponse {
  data: Profile;
}

interface ProjectsResponse {
  data: Project[];
  meta: PaginationMeta;
}

async function getProfile(): Promise<Profile | undefined> {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/profile`, {
      next: { revalidate: 300 }, // matches the 5-minute client staleTime
    });

    if (!res.ok) return undefined;

    const json: ProfileResponse = await res.json();
    return json.data;
  } catch {
    return undefined;
  }
}

async function getProjects(): Promise<ProjectsResponse | undefined> {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/projects`, {
      next: { revalidate: 3600 },
    });

    if (!res.ok) return undefined;

    return await res.json();
  } catch {
    return undefined;
  }
}

export default async function Home() {
  // Fetched in parallel on the server, so the homepage's initial HTML
  // already contains real profile and project data for crawlers and
  // social-media link previews — instead of an empty shell that only
  // fills in after client-side JavaScript runs.
  const [profile, projects] = await Promise.all([getProfile(), getProjects()]);

  return (
    <>
      <Hero initialProfile={profile} />
      <Experience />
      <Stacks />
      <FeaturedProjects initialProjects={projects} />
      <Contact initialProfile={profile} />
    </>
  );
}
