"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useState } from "react";
import { api } from "@/lib/api";
import { isAxiosError } from "axios";

const contactSchema = z.object({
  name: z.string().min(1, "Name is required").max(255),
  email: z.string().min(1, "Email is required").email("Invalid email format"),
  company: z.string().max(255).optional(),
  subject: z.string().max(255).optional(),
  message: z.string().min(10, "Message must be at least 10 characters"),
});

type ContactFormData = z.infer<typeof contactSchema>;

interface MessageResponse {
  message: string;
  whatsapp_url: string;
}

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);
  const [whatsappUrl, setWhatsappUrl] = useState("");
  const [serverError, setServerError] = useState("");

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
  });

  async function onSubmit(data: ContactFormData) {
    setServerError("");
    try {
      const res = await api.post<MessageResponse>("/messages", data);
      setWhatsappUrl(res.data.whatsapp_url);
      setSubmitted(true);
      reset();
    } catch (error) {
      if (isAxiosError(error) && error.response?.status === 429) {
        setServerError("Too many attempts. Please try again in a few minutes.");
      } else {
        setServerError("Failed to send message. Please try again.");
      }
    }
  }

  return (
    <section className="max-w-2xl mx-auto px-6 py-16">
      <h1 className="text-3xl font-bold text-white mb-2">Contact Me</h1>
      <p className="text-gray-400 mb-8">
        Have a question or want to collaborate? Send a message using the form
        below.
      </p>

      {submitted && (
        <div className="bg-emerald-900/40 border border-emerald-700 text-emerald-300 rounded-lg p-4 mb-6">
          <p className="mb-3">
            Thank you! Your message has been sent, I&apos;ll get back to you
            soon.
          </p>
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-2 rounded-lg text-sm transition-colors"
          >
            Continue via WhatsApp
          </a>
        </div>
      )}

      {serverError && (
        <div className="bg-red-900/40 border border-red-700 text-red-300 rounded-lg p-4 mb-6 text-sm">
          {serverError}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <div>
          <label className="block text-sm text-gray-400 mb-1">Name</label>
          <input
            type="text"
            {...register("name")}
            className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2.5 text-white focus:border-emerald-500 focus:outline-none"
          />
          {errors.name && (
            <p className="text-red-400 text-sm mt-1">{errors.name.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm text-gray-400 mb-1">Email</label>
          <input
            type="email"
            {...register("email")}
            className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2.5 text-white focus:border-emerald-500 focus:outline-none"
          />
          {errors.email && (
            <p className="text-red-400 text-sm mt-1">{errors.email.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm text-gray-400 mb-1">
            Company (optional)
          </label>
          <input
            type="text"
            {...register("company")}
            placeholder="Your company / organization name"
            className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2.5 text-white focus:border-emerald-500 focus:outline-none"
          />
        </div>

        <div>
          <label className="block text-sm text-gray-400 mb-1">
            Subject (optional)
          </label>
          <input
            type="text"
            {...register("subject")}
            className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2.5 text-white focus:border-emerald-500 focus:outline-none"
          />
        </div>

        <div>
          <label className="block text-sm text-gray-400 mb-1">Message</label>
          <textarea
            {...register("message")}
            rows={5}
            className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2.5 text-white focus:border-emerald-500 focus:outline-none"
          />
          {errors.message && (
            <p className="text-red-400 text-sm mt-1">
              {errors.message.message}
            </p>
          )}
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 text-gray-950 font-medium px-6 py-3 rounded-lg transition-colors"
        >
          {isSubmitting ? "Sending..." : "Send Message"}
        </button>
      </form>
    </section>
  );
}
