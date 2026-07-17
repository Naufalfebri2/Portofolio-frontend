import Link from "next/link";
import { Home, Search } from "lucide-react";

export default function NotFound() {
  return (
    <section className="min-h-[70vh] flex flex-col items-center justify-center text-center px-6 py-24">
      <p className="text-sm font-medium text-accent-500 dark:text-accent-400 mb-4">
        404
      </p>
      <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
        Page <span className="text-gradient-accent">Not Found</span>
      </h1>
      <p className="text-gray-600 dark:text-gray-400 max-w-md mx-auto mb-10 leading-relaxed">
        The page you&apos;re looking for doesn&apos;t exist or may have been
        moved.
      </p>

      <div className="flex items-center gap-4">
        <Link
          href="/"
          className="inline-flex items-center gap-2 bg-gradient-accent hover:opacity-90 text-gray-950 font-medium px-6 py-3 rounded-lg transition-opacity"
        >
          <Home size={16} />
          Back to Home
        </Link>
        <Link
          href="/projects"
          className="inline-flex items-center gap-2 border border-gray-300 dark:border-gray-700 hover:border-gray-500 text-gray-900 dark:text-white font-medium px-6 py-3 rounded-lg transition-colors"
        >
          <Search size={16} />
          View Projects
        </Link>
      </div>
    </section>
  );
}
