import { STRAPI_API_URL } from "@/constants/strapi.constants";
import type { StrapiMedia } from "@/lib/strapi.types";

export const getStrapiMediaUrl = (url?: string | null): string | null => {
  if (!url) {
    return null;
  }
  if (url.startsWith("http://") || url.startsWith("https://")) {
    return url;
  }
  const base_url = STRAPI_API_URL?.replace(/\/$/, "") ?? "";
  return `${base_url}${url}`;
};

export type StrapiImageFormat =
  | "thumbnail"
  | "small"
  | "medium"
  | "large"
  | "full";

export const getStrapiImageUrl = (
  media?: StrapiMedia | null,
  format: StrapiImageFormat = "full",
): string | null => {
  if (!media) {
    return null;
  }

  const format_url =
    format === "full" ? media.url : media.formats?.[format]?.url;

  return getStrapiMediaUrl(format_url ?? media.url);
};