import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getStorageUrl(path: string | null): string {
  if (!path) return "";
  const baseUrl = process.env.NEXT_PUBLIC_API_URL?.replace("/api", "");
  return `${baseUrl}${path}`;
}
