import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";

export interface Profile {
  name: string;
  role: string | null;
  bio: string | null;
  photo: string | null;
  resume_url: string | null;
  phone: string | null;
  email: string | null;
  location: string | null;
  github_url: string | null;
  linkedin_url: string | null;
  instagram_url: string | null;
}

interface ProfileResponse {
  data: Profile;
}

async function fetchProfile(): Promise<Profile> {
  const res = await api.get<ProfileResponse>("/profile");
  return res.data.data;
}

export function useProfile() {
  return useQuery({
    queryKey: ["profile"],
    queryFn: fetchProfile,
    staleTime: 5 * 60 * 1000, // data profil jarang berubah, cache 5 menit
  });
}
