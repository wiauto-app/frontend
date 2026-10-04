import type { Metadata } from "next";

import type { StrapiSeo } from "@/interfaces/strapi-components.interface";
import { getStrapiMediaUrl } from "@/lib/strapi-media";

import { absoluteUrl } from "./absolute-url";

const WIAUTO_BRAND_NAME = "WiAuto";

interface BuildStrapiMetadataInput {
  seo: StrapiSeo | null | undefined;
  /** Ruta de la página, para la URL canónica cuando `canonicalURL` está vacío. */
  path: string;
}

const buildRobots = (seo: StrapiSeo | null | undefined): Metadata["robots"] => {
  if (!seo?.noIndex && !seo?.noFollow) {
    return undefined;
  }

  return { index: !seo.noIndex, follow: !seo.noFollow };
};

/** Metadata de Next a partir del componente `shared.seo`. */
export const buildStrapiMetadata = ({
  seo,
  path,
}: BuildStrapiMetadataInput): Metadata => {
  const title = seo?.metaTitle?.trim() || undefined;
  const description = seo?.metaDescription?.trim() || undefined;
  const ogTitle = seo?.ogTitle?.trim() || title;
  const ogDescription = seo?.ogDescription?.trim() || description;
  const canonical = seo?.canonicalURL?.trim() || absoluteUrl(path);
  const shareImageUrl = getStrapiMediaUrl(seo?.shareImage?.url);

  return {
    title,
    description,
    keywords: seo?.keywords ?? undefined,
    alternates: {
      canonical,
    },
    robots: buildRobots(seo),
    openGraph: {
      type: seo?.ogType ?? "website",
      locale: "es_ES",
      siteName: WIAUTO_BRAND_NAME,
      title: ogTitle,
      description: ogDescription,
      url: canonical,
      images: shareImageUrl ? [{ url: shareImageUrl }] : undefined,
    },
    twitter: {
      card: seo?.twitterCard ?? "summary_large_image",
      title: ogTitle,
      description: ogDescription,
      images: shareImageUrl ? [shareImageUrl] : undefined,
    },
  };
};
