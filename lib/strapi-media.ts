import { STRAPI_API_URL } from "@/constants/strapi.constants";

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
