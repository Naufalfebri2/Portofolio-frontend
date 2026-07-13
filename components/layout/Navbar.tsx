"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";

const navLinks = [
  { id: "home", label: "Home" },
  { id: "about", label: "About" },
  { id: "stacks", label: "Stack" },
  { id: "projects", label: "Projects" },
  { id: "contact", label: "Contact" },
];

export default function Navbar() {
  const pathname = usePathname();
  const isHome = pathname === "/";

  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState("home");
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    function handleScroll() {
      setScrolled(window.scrollY > 50);
    }
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (!isHome) return;

    const sections = navLinks
      .map((link) => document.getElementById(link.id))
      .filter((el): el is HTMLElement => el !== null);

    if (sections.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { rootMargin: "-40% 0px -55% 0px", threshold: 0 },
    );

    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, [isHome]);

  // lock body scroll while the mobile menu is open
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  function handleNavClick(e: React.MouseEvent, id: string) {
    setMobileOpen(false);
    if (!isHome) return;
    e.preventDefault();
    // Defer to the next tick instead of mutating document.body directly
    // here (that's what the body-scroll-lock useEffect below is for).
    // By the time this runs, the effect will already have reset
    // overflow back to normal, so scrollIntoView actually works instead
    // of silently no-op'ing while the body is still scroll-locked.
    setTimeout(() => {
      document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    }, 0);
  }

  return (
    <>
      {/* Backdrop — clicking outside the menu closes it. Kept separate from
          the header (not a child of it) so it isn't clipped by the
          dropdown panel's overflow-hidden, and its z-index is intentionally
          just below the header (z-40 vs z-50) so the header stays
          clickable while the rest of the page is covered by the backdrop. */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={() => setMobileOpen(false)}
            className="fixed inset-0 z-40 bg-black/50 md:hidden"
            aria-hidden="true"
          />
        )}
      </AnimatePresence>

      <div className="fixed top-0 left-0 right-0 z-50 flex justify-center">
        <motion.header
          animate={{
            marginTop: scrolled || mobileOpen ? 16 : 0,
            borderRadius: scrolled || mobileOpen ? 24 : 0,
            width: scrolled || mobileOpen ? "auto" : "100%",
          }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
          className={cn(
            "border border-gray-800 bg-gray-950/80 backdrop-blur w-full md:w-auto",
            scrolled || mobileOpen
              ? "shadow-lg shadow-black/40"
              : "border-x-0 border-t-0",
          )}
        >
          <nav className="flex items-center justify-between gap-8 px-6 py-3">
            <Link
              href="/"
              onClick={() => setMobileOpen(false)}
              className="font-bold text-white text-lg whitespace-nowrap"
            >
              Naufal Febriansyah.
            </Link>

            <div className="hidden md:flex items-center gap-6">
              {navLinks.map((link) => {
                const isActive = isHome && activeSection === link.id;
                const href = isHome ? `#${link.id}` : `/#${link.id}`;
                return (
                  <a
                    key={link.id}
                    href={href}
                    onClick={(e) => handleNavClick(e, link.id)}
                    className={cn(
                      "text-sm transition-colors whitespace-nowrap",
                      isActive
                        ? "text-gradient-accent font-medium"
                        : "text-gray-300 hover:text-white",
                    )}
                  >
                    {link.label}
                  </a>
                );
              })}
            </div>

            <a
              href="/api/resume"
              className="hidden md:inline-block bg-gradient-accent hover:opacity-90 text-gray-950 text-sm font-medium px-4 py-2 rounded-lg transition-opacity whitespace-nowrap"
            >
              Download CV
            </a>

            <button
              type="button"
              onClick={() => setMobileOpen((prev) => !prev)}
              aria-label={mobileOpen ? "Close menu" : "Open menu"}
              aria-expanded={mobileOpen}
              className="md:hidden text-gray-300 hover:text-white transition-colors relative z-10"
            >
              {mobileOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </nav>

          <AnimatePresence>
            {mobileOpen && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.25, ease: "easeInOut" }}
                className="md:hidden overflow-hidden relative z-10"
              >
                <div className="flex flex-col gap-1 px-6 pb-5 pt-1">
                  {navLinks.map((link) => {
                    const isActive = isHome && activeSection === link.id;
                    const href = isHome ? `#${link.id}` : `/#${link.id}`;
                    return (
                      <a
                        key={link.id}
                        href={href}
                        onClick={(e) => handleNavClick(e, link.id)}
                        className={cn(
                          "text-sm py-2.5 transition-colors",
                          isActive
                            ? "text-gradient-accent font-medium"
                            : "text-gray-300 hover:text-white",
                        )}
                      >
                        {link.label}
                      </a>
                    );
                  })}
                  <a
                    href="/api/resume"
                    onClick={() => setMobileOpen(false)}
                    className="mt-3 text-center bg-gradient-accent hover:opacity-90 text-gray-950 text-sm font-medium px-4 py-2.5 rounded-lg transition-opacity"
                  >
                    Download CV
                  </a>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.header>
      </div>
    </>
  );
}
