"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Mail, MapPin, Loader2 } from "lucide-react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { api } from "@/lib/api";
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

const fallback = {
  email: "naufalfebriansyah9043@gmail.com",
  location: "South Tangerang, Indonesia",
  github_url: "https://github.com/Naufalfebri2",
  linkedin_url: "https://www.linkedin.com/in/naufal-febriansyah-7b75b31b5/",
};

interface FormState {
  name: string;
  email: string;
  company: string;
  subject: string;
  eventDate: Date | null;
  message: string;
  website: string; // honeypot — must stay empty
}

const initialForm: FormState = {
  name: "",
  email: "",
  company: "",
  subject: "",
  eventDate: null,
  message: "",
  website: "",
};

// Map API field names (snake_case) to our FormState keys (camelCase)
// where they differ, so validation errors from Laravel land on the right field.
const apiFieldMap: Record<string, keyof FormState> = {
  event_date: "eventDate",
};

function formatDateForApi(date: Date): string {
  const yyyy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, "0");
  const dd = String(date.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}

export default function Contact() {
  const { data: profile } = useProfile();

  const email = profile?.email || fallback.email;
  const location = profile?.location || fallback.location;
  const githubUrl = profile?.github_url || fallback.github_url;
  const linkedinUrl = profile?.linkedin_url || fallback.linkedin_url;

  const infoLinks = [
    { label: "Email", value: email, href: `mailto:${email}`, icon: Mail },
    githubUrl && {
      label: "GitHub",
      value: githubUrl.replace("https://github.com/", "@"),
      href: githubUrl,
      icon: GithubIcon,
    },
    linkedinUrl && {
      label: "LinkedIn",
      value: profile?.name || "Naufal Febriansyah",
      href: linkedinUrl,
      icon: LinkedinIcon,
    },
  ].filter(Boolean) as {
    label: string;
    value: string;
    href: string;
    icon: typeof Mail;
  }[];

  const [form, setForm] = useState<FormState>(initialForm);
  const [status, setStatus] = useState<
    "idle" | "submitting" | "success" | "error"
  >("idle");
  const [errors, setErrors] = useState<
    Partial<Record<keyof FormState, string>>
  >({});
  const [whatsappUrl, setWhatsappUrl] = useState("");

  function handleChange(field: keyof FormState) {
    return (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setForm((prev) => ({ ...prev, [field]: e.target.value }));
    };
  }

  function handleDateChange(date: Date | null) {
    setForm((prev) => ({ ...prev, eventDate: date }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErrors({});
    setStatus("submitting");

    try {
      const res = await api.post("/messages", {
        name: form.name,
        email: form.email,
        company: form.company,
        subject: form.subject,
        event_date: form.eventDate ? formatDateForApi(form.eventDate) : "",
        message: form.message,
        website: form.website, // honeypot — server silently no-ops if filled
      });

      const waUrl = res.data?.whatsapp_url || "";

      if (waUrl) {
        const waText = encodeURIComponent(
          `Hi, I'm ${form.name}. I just sent you a message through your portfolio:\n\n"${form.message}"`,
        );
        setWhatsappUrl(
          waUrl.includes("text=") ? waUrl : `${waUrl}&text=${waText}`,
        );
      }

      setForm(initialForm);
      setStatus("success");
    } catch (err: unknown) {
      const apiErrors = (
        err as { response?: { data?: { errors?: Record<string, string[]> } } }
      )?.response?.data?.errors;

      if (apiErrors) {
        const flattened: Partial<Record<keyof FormState, string>> = {};
        (Object.keys(apiErrors) as string[]).forEach((key) => {
          const mappedKey = (apiFieldMap[key] ?? key) as keyof FormState;
          flattened[mappedKey] = apiErrors[key]?.[0];
        });
        setErrors(flattened);
      }
      setStatus("error");
    }
  }

  return (
    <section id="contact" className="relative max-w-5xl mx-auto px-6 py-32">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.6 }}
        className="text-center mb-14"
      >
        <p className="text-sm text-accent-500 dark:text-accent-400 font-medium mb-2">
          Have a Backend Project?
        </p>
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
          Let&apos;s Discuss Your System Requirements
        </h2>
        <p className="text-gray-600 dark:text-gray-400 max-w-lg mx-auto leading-relaxed">
          Open to internship opportunities, project collaborations, or just
          chatting about backend & system architecture.
        </p>
      </motion.div>

      <div className="grid lg:grid-cols-5 gap-8">
        {/* Contact info */}
        <motion.div
          initial={{ opacity: 0, x: -16 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.5 }}
          className="lg:col-span-2 space-y-3"
        >
          {infoLinks.map((link) => {
            const Icon = link.icon;
            return (
              <a
                key={link.label}
                href={link.href}
                target={link.label !== "Email" ? "_blank" : undefined}
                rel={link.label !== "Email" ? "noopener noreferrer" : undefined}
                className="group flex items-center gap-3 p-4 rounded-xl border border-gray-300 dark:border-gray-800 bg-gray-100 dark:bg-gray-900/40 hover:border-accent-500/60 transition-colors"
              >
                <span className="w-9 h-9 shrink-0 rounded-lg bg-accent-500/10 text-accent-500 dark:text-accent-400 flex items-center justify-center">
                  <Icon size={16} width={16} height={16} />
                </span>
                <div className="min-w-0">
                  <p className="text-xs text-gray-500">{link.label}</p>
                  <p className="text-sm text-gray-900 dark:text-white truncate group-hover:text-accent-500 dark:group-hover:text-accent-400 transition-colors">
                    {link.value}
                  </p>
                </div>
              </a>
            );
          })}

          <div className="flex items-center gap-3 p-4 rounded-xl border border-gray-300 dark:border-gray-800 bg-linear-to-br from-accent-500/10 to-cyan-400/10">
            <span className="w-9 h-9 shrink-0 rounded-lg bg-accent-500/10 text-accent-500 dark:text-accent-400 flex items-center justify-center">
              <MapPin size={16} />
            </span>
            <div>
              <p className="text-xs text-gray-500">Location</p>
              <p className="text-sm text-gray-900 dark:text-white">
                {location}
              </p>
            </div>
          </div>
        </motion.div>

        {/* Form */}
        <motion.div
          initial={{ opacity: 0, x: 16 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="lg:col-span-3"
        >
          {status === "success" ? (
            <div className="bg-accent-500/10 border border-accent-500/30 text-accent-700 dark:text-accent-300 rounded-xl p-5">
              <p className="mb-3 text-sm leading-relaxed">
                Thank you! Your message has been sent, I&apos;ll get back to you
                soon.
              </p>
              {whatsappUrl && (
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-gradient-accent hover:opacity-90 text-gray-950 text-sm font-medium px-4 py-2 rounded-lg transition-opacity"
                >
                  Continue via WhatsApp
                </a>
              )}
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Honeypot field: hidden from real users via off-screen
                  positioning (not display:none — some bots specifically
                  skip fields hidden that way), aria-hidden + tabIndex=-1
                  so screen readers and keyboard navigation skip it too. */}
              <div className="absolute left-[-9999px]" aria-hidden="true">
                <label htmlFor="website">Website</label>
                <input
                  type="text"
                  id="website"
                  name="website"
                  tabIndex={-1}
                  autoComplete="off"
                  value={form.website}
                  onChange={handleChange("website")}
                />
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-600 dark:text-gray-400 mb-1">
                    Name
                  </label>
                  <input
                    type="text"
                    value={form.name}
                    onChange={handleChange("name")}
                    className="w-full bg-gray-100 dark:bg-gray-900/60 border border-gray-300 dark:border-gray-800 rounded-lg px-4 py-2.5 text-gray-900 dark:text-white text-sm focus:border-accent-500 focus:outline-none transition-colors"
                  />
                  {errors.name && (
                    <p className="text-red-500 dark:text-red-400 text-xs mt-1">
                      {errors.name}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm text-gray-600 dark:text-gray-400 mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    value={form.email}
                    onChange={handleChange("email")}
                    className="w-full bg-gray-100 dark:bg-gray-900/60 border border-gray-300 dark:border-gray-800 rounded-lg px-4 py-2.5 text-gray-900 dark:text-white text-sm focus:border-accent-500 focus:outline-none transition-colors"
                  />
                  {errors.email && (
                    <p className="text-red-500 dark:text-red-400 text-xs mt-1">
                      {errors.email}
                    </p>
                  )}
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-600 dark:text-gray-400 mb-1">
                    Company (optional)
                  </label>
                  <input
                    type="text"
                    value={form.company}
                    onChange={handleChange("company")}
                    placeholder="Your company / organization name"
                    className="w-full bg-gray-100 dark:bg-gray-900/60 border border-gray-300 dark:border-gray-800 rounded-lg px-4 py-2.5 text-gray-900 dark:text-white text-sm placeholder:text-gray-400 dark:placeholder:text-gray-600 focus:border-accent-500 focus:outline-none transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-sm text-gray-600 dark:text-gray-400 mb-1">
                    Subject (optional)
                  </label>
                  <input
                    type="text"
                    value={form.subject}
                    onChange={handleChange("subject")}
                    className="w-full bg-gray-100 dark:bg-gray-900/60 border border-gray-300 dark:border-gray-800 rounded-lg px-4 py-2.5 text-gray-900 dark:text-white text-sm focus:border-accent-500 focus:outline-none transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm text-gray-600 dark:text-gray-400 mb-1">
                  Interview / Meeting Date
                </label>
                <DatePicker
                  selected={form.eventDate}
                  onChange={handleDateChange}
                  minDate={new Date()}
                  dateFormat="dd MMMM yyyy"
                  placeholderText="Select a date"
                  wrapperClassName="w-full"
                  className="w-full bg-gray-100 dark:bg-gray-900/60 border border-gray-300 dark:border-gray-800 rounded-lg px-4 py-2.5 text-gray-900 dark:text-white text-sm focus:border-accent-500 focus:outline-none transition-colors"
                />
                {errors.eventDate && (
                  <p className="text-red-500 dark:text-red-400 text-xs mt-1">
                    {errors.eventDate}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm text-gray-600 dark:text-gray-400 mb-1">
                  Message
                </label>
                <textarea
                  rows={4}
                  value={form.message}
                  onChange={handleChange("message")}
                  className="w-full bg-gray-100 dark:bg-gray-900/60 border border-gray-300 dark:border-gray-800 rounded-lg px-4 py-2.5 text-gray-900 dark:text-white text-sm focus:border-accent-500 focus:outline-none transition-colors resize-none"
                />
                {errors.message && (
                  <p className="text-red-500 dark:text-red-400 text-xs mt-1">
                    {errors.message}
                  </p>
                )}
              </div>

              {status === "error" && Object.keys(errors).length === 0 && (
                <p className="text-red-500 dark:text-red-400 text-sm">
                  Failed to send message. Please try again in a moment.
                </p>
              )}

              <button
                type="submit"
                disabled={status === "submitting"}
                className="inline-flex items-center gap-2 bg-gradient-accent hover:opacity-90 disabled:opacity-50 text-gray-950 font-medium px-6 py-3 rounded-lg transition-opacity"
              >
                {status === "submitting" && (
                  <Loader2 size={15} className="animate-spin" />
                )}
                {status === "submitting" ? "Sending..." : "Send Message"}
              </button>
            </form>
          )}
        </motion.div>
      </div>
    </section>
  );
}
