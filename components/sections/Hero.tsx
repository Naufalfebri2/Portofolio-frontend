"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { MapPin } from "lucide-react";
import { useProfile } from "@/lib/hooks/useProfile";

function GithubIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M12 .5C5.65.5.5 5.65.5 12c0 5.08 3.29 9.39 7.86 10.91.57.1.78-.25.78-.55 0-.27-.01-1.17-.02-2.12-3.2.7-3.88-1.36-3.88-1.36-.52-1.33-1.28-1.68-1.28-1.68-1.05-.72.08-.7.08-.7 1.16.08 1.77 1.19 1.77 1.19 1.03 1.77 2.7 1.26 3.36.96.1-.75.4-1.26.73-1.55-2.55-.29-5.24-1.28-5.24-5.68 0-1.25.45-2.28 1.19-3.08-.12-.29-.52-1.46.11-3.05 0 0 .97-.31 3.18 1.18a11.05 11.05 0 0 1 5.79 0c2.2-1.49 3.17-1.18 3.17-1.18.63 1.59.24 2.76.12 3.05.74.8 1.19 1.83 1.19 3.08 0 4.41-2.69 5.38-5.25 5.67.41.36.78 1.06.78 2.14 0 1.55-.01 2.79-.01 3.17 0 .3.2.66.79.55A10.52 10.52 0 0 0 23.5 12c0-6.35-5.15-11.5-11.5-11.5Z" />
    </svg>
  );
}

function LinkedinIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M20.45 20.45h-3.55v-5.57c0-1.33-.02-3.04-1.85-3.04-1.86 0-2.15 1.45-2.15 2.94v5.67H9.35V9h3.41v1.56h.05c.47-.9 1.63-1.85 3.36-1.85 3.6 0 4.27 2.37 4.27 5.45v6.29ZM5.34 7.43a2.06 2.06 0 1 1 0-4.12 2.06 2.06 0 0 1 0 4.12ZM7.12 20.45H3.56V9h3.56v11.45Z" />
    </svg>
  );
}

const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL?.replace("/api", "");

const fallback = {
  name: "Naufal Febriansyah",
  role: "Backend Developer",
  bio: "a Backend Developer focused on building SaaS systems and business applications using Laravel & PostgreSQL.",
  location: "South Tangerang, Indonesia",
};

export default function Hero() {
  const { data: profile } = useProfile();

  const name = profile?.name || fallback.name;
  const role = profile?.role || fallback.role;
  const bio = profile?.bio || fallback.bio;
  const location = profile?.location || fallback.location;
  const photoUrl = profile?.photo ? `${apiBaseUrl}${profile.photo}` : null;

  // Split role into words so the last word gets the gradient accent,
  // matching the original two-tone "Backend Developer" headline style.
  const roleWords = role.trim().split(" ");
  const roleLastWord = roleWords.pop() ?? "";
  const roleFirstPart = roleWords.join(" ");

  const socials = [
    profile?.github_url && {
      href: profile.github_url,
      icon: GithubIcon,
      label: "GitHub",
    },
    profile?.linkedin_url && {
      href: profile.linkedin_url,
      icon: LinkedinIcon,
      label: "LinkedIn",
    },
  ].filter(Boolean) as {
    href: string;
    icon: typeof GithubIcon;
    label: string;
  }[];

  return (
    <section
      id="home"
      className="relative min-h-[90vh] flex flex-col items-center justify-center max-w-4xl mx-auto px-6 py-24 text-center"
    >
      {photoUrl && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="relative w-32 h-32 md:w-40 md:h-40 rounded-full overflow-hidden border-2 border-accent-500/40 mb-5"
        >
          <Image
            src={photoUrl}
            alt={`Photo of ${name}`}
            fill
            sizes="160px"
            className="object-cover"
            priority
          />
        </motion.div>
      )}

      {location && (
        <div className="flex items-center gap-1.5 text-sm text-gray-500 dark:text-gray-400 mb-6">
          <MapPin size={14} className="text-accent-500 dark:text-accent-400" />
          <span>{location}</span>
        </div>
      )}

      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
        className="text-4xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6 leading-tight"
      >
        {roleFirstPart && `${roleFirstPart} `}
        <span className="text-gradient-accent">{roleLastWord}</span>
      </motion.h1>

      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto mb-10 leading-relaxed"
      >
        Hi, I&apos;m{" "}
        <span className="text-gray-900 dark:text-white font-semibold">
          {name}
        </span>
        , {bio}
      </motion.p>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.3 }}
        className="flex items-center justify-center gap-4"
      >
        <a
          href="#projects"
          onClick={(e) => {
            e.preventDefault();
            document
              .getElementById("projects")
              ?.scrollIntoView({ behavior: "smooth" });
          }}
          className="bg-gradient-accent hover:opacity-90 text-gray-950 font-medium px-6 py-3 rounded-lg transition-opacity"
        >
          View Projects
        </a>
        <a
          href="#contact"
          onClick={(e) => {
            e.preventDefault();
            document
              .getElementById("contact")
              ?.scrollIntoView({ behavior: "smooth" });
          }}
          className="border border-gray-300 dark:border-gray-700 hover:border-gray-500 text-gray-900 dark:text-white font-medium px-6 py-3 rounded-lg transition-colors"
        >
          Contact Me
        </a>
      </motion.div>

      {socials.length > 0 && (
        <div className="hidden lg:flex flex-col gap-4 fixed right-8 top-1/2 -translate-y-1/2 z-20">
          {socials.map((social) => {
            const Icon = social.icon;
            return (
              <a
                key={social.label}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={social.label}
                className="text-gray-400 dark:text-gray-500 hover:text-accent-500 dark:hover:text-accent-400 transition-colors"
              >
                <Icon width={20} height={20} />
              </a>
            );
          })}
        </div>
      )}
    </section>
  );
}
