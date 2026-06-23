import { FRONTEND_URL } from "@/constants";

export const absoluteUrl = (path: string): string => {
  const base = (FRONTEND_URL ?? "").replace(/\/$/, "");
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return `${base}${normalizedPath}`;
};
