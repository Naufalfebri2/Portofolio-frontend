"use client";

import { useProfile } from "@/lib/hooks/useProfile";

const fallback = {
  name: "Naufal Febriansyah",
};

export default function Footer() {
  const { data: profile } = useProfile();
  const name = profile?.name || fallback.name;

  return (
    <footer className="border-t border-gray-200 dark:border-gray-800 mt-24">
      <div className="max-w-6xl mx-auto px-6 py-6 flex flex-col sm:flex-row items-center justify-between gap-3">
        <p className="text-xs text-gray-500 dark:text-gray-600">
          &copy; {new Date().getFullYear()} {name}. All rights reserved.
        </p>
        <p className="text-xs text-gray-500 dark:text-gray-600">
          Built with Next.js, TypeScript &amp; Tailwind CSS.
        </p>
      </div>
    </footer>
  );
}
