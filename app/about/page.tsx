"use client";

import { useQuery } from "@tanstack/react-query";
import Image from "next/image";
import { api } from "@/lib/api";
import { getStorageUrl } from "@/lib/utils";
import type { Profile } from "@/types";

interface ProfileResponse {
  data: Profile;
}

async function fetchProfile(): Promise<ProfileResponse> {
  const res = await api.get<ProfileResponse>("/profile");
  return res.data;
}

export default function AboutPage() {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["profile"],
    queryFn: fetchProfile,
  });

  if (isLoading) {
    return (
      <section className="max-w-4xl mx-auto px-6 py-16">
        <p className="text-gray-500 text-sm">Loading profile...</p>
      </section>
    );
  }

  if (isError || !data) {
    return (
      <section className="max-w-4xl mx-auto px-6 py-16">
        <p className="text-red-400 text-sm">
          Failed to load profile. Make sure the API server is running.
        </p>
      </section>
    );
  }

  const profile = data.data;

  return (
    <section className="max-w-4xl mx-auto px-6 py-16">
      <h1 className="text-3xl font-bold text-white mb-10">About Me</h1>

      <div className="flex flex-col md:flex-row gap-8 mb-12">
        {profile.photo && (
          <div className="relative w-32 h-32 rounded-full overflow-hidden shrink-0 bg-gray-800">
            <Image
              src={getStorageUrl(profile.photo)}
              alt={profile.name}
              fill
              className="object-cover"
            />
          </div>
        )}

        <div>
          <h2 className="text-xl font-semibold text-white mb-3">
            {profile.name}
          </h2>
          <p className="text-gray-300 leading-relaxed mb-4">{profile.bio}</p>

          <div className="flex flex-wrap gap-3">
            {profile.email && (
              <a
                href={`mailto:${profile.email}`}
                className="text-sm bg-gray-800 hover:bg-gray-700 text-gray-300 px-3 py-1.5 rounded-lg transition-colors"
              >
                {profile.email}
              </a>
            )}
            {profile.phone && (
              <a
                href={`https://wa.me/${profile.phone.replace(/[^0-9]/g, "")}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm bg-gray-800 hover:bg-gray-700 text-gray-300 px-3 py-1.5 rounded-lg transition-colors"
              >
                {profile.phone}
              </a>
            )}
            {profile.github_url && (
              <a
                href={profile.github_url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm bg-gray-800 hover:bg-gray-700 text-gray-300 px-3 py-1.5 rounded-lg transition-colors"
              >
                GitHub
              </a>
            )}
            {profile.linkedin_url && (
              <a
                href={profile.linkedin_url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm bg-gray-800 hover:bg-gray-700 text-gray-300 px-3 py-1.5 rounded-lg transition-colors"
              >
                LinkedIn
              </a>
            )}
          </div>
        </div>
      </div>

      {profile.resume_url && (
        <a
          href={getStorageUrl(profile.resume_url)}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block bg-emerald-500 hover:bg-emerald-400 text-gray-950 font-medium px-6 py-3 rounded-lg transition-colors"
        >
          Download CV
        </a>
      )}
    </section>
  );
}
