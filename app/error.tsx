"use client";

import { useEffect } from "react";
import Link from "next/link";
import { Home, RotateCw } from "lucide-react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log to the console (and, later, to an error-tracking service like
    // Sentry) so unexpected failures are visible somewhere other than
    // just the visitor's broken screen.
    console.error(error);
  }, [error]);

  return (
    <section className="min-h-[70vh] flex flex-col items-center justify-center text-center px-6 py-24">
      <p className="text-sm font-medium text-accent-500 dark:text-accent-400 mb-4">
        Something went wrong
      </p>
      <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
        Unexpected <span className="text-gradient-accent">Error</span>
      </h1>
      <p className="text-gray-600 dark:text-gray-400 max-w-md mx-auto mb-10 leading-relaxed">
        Something went wrong on this page. You can try again, or head back to
        the homepage.
      </p>

      <div className="flex items-center gap-4">
        <button
          onClick={reset}
          className="inline-flex items-center gap-2 bg-gradient-accent hover:opacity-90 text-gray-950 font-medium px-6 py-3 rounded-lg transition-opacity"
        >
          <RotateCw size={16} />
          Try Again
        </button>
        <Link
          href="/"
          className="inline-flex items-center gap-2 border border-gray-300 dark:border-gray-700 hover:border-gray-500 text-gray-900 dark:text-white font-medium px-6 py-3 rounded-lg transition-colors"
        >
          <Home size={16} />
          Back to Home
        </Link>
      </div>
    </section>
  );
}
