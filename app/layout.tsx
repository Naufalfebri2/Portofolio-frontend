import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/layout/Navbar";
import QueryProvider from "@/components/providers/QueryProvider";
import PageViewTracker from "@/components/analytics/PageViewTracker";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Naufal Febriansyah — Backend Developer",
  description:
    "Portofolio Naufal Febriansyah, Backend Developer yang fokus membangun sistem SaaS dan aplikasi bisnis menggunakan Laravel & PostgreSQL.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="id"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-gray-950 text-white">
        <PageViewTracker />
        <QueryProvider>
          <Navbar />
          <main className="flex-1 pt-24 relative z-10">{children}</main>
        </QueryProvider>
      </body>
    </html>
  );
}
