export interface Technology {
  id: number;
  name: string;
  icon: string | null;
}

export interface ProjectImage {
  id: number;
  url: string;
  caption: string | null;
  order: number;
}

export interface Project {
  id: number;
  title: string;
  slug: string;
  description: string;
  type: "solo" | "team";
  role: string | null;
  repo_url: string | null;
  demo_url: string | null;
  thumbnail: string | null;
  is_featured: boolean;
  order: number;
  technologies: Technology[];
  images: ProjectImage[];
}

export interface Profile {
  name: string;
  role: string | null;
  bio: string;
  photo: string | null;
  resume_url: string | null;
  phone: string | null;
  email: string | null;
  location: string | null;
  github_url: string | null;
  linkedin_url: string | null;
  instagram_url: string | null;
}

export interface PaginationMeta {
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
}
