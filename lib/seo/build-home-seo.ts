import type { Metadata } from "next";

import type { StrapiSeo } from "@/interfaces/strapi-components.interface";
import { getStrapiMediaUrl } from "@/lib/strapi-media";
import { VEHICLES_LISTING_BASE_PATH } from "@/lib/vehicles/listing-url/constants";

import { absoluteUrl } from "./absolute-url";

const WIAUTO_BRAND_NAME = "WiAuto";
const WIAUTO_LOGO_PATH = "/branding/logo-v2.svg";
const WIAUTO_DEFAULT_META_TITLE = "WiAuto | Coches de ocasión y seminuevos";
const WIAUTO_DEFAULT_META_DESCRIPTION =
  "Compra y vende coches de ocasión y seminuevos en WiAuto. Busca vehículos, conoce concesionarios, compara modelos y accede a financiación y seguros.";

interface BuildHomeSeoInput {
  seo?: StrapiSeo | null;
}

const buildHomeCanonicalUrl = (canonicalURL?: string | null): string => {
  if (canonicalURL?.trim()) {
    return canonicalURL.trim();
  }

  return absoluteUrl("/");
};

const buildHomeTitle = (metaTitle?: string | null): string =>
  metaTitle?.trim() || WIAUTO_DEFAULT_META_TITLE;

const buildHomeDescription = (metaDescription?: string | null): string =>
  metaDescription?.trim() || WIAUTO_DEFAULT_META_DESCRIPTION;

export const buildHomeMetadata = ({ seo }: BuildHomeSeoInput): Metadata => {
  const title = buildHomeTitle(seo?.metaTitle);
  const description = buildHomeDescription(seo?.metaDescription);
  const canonical = buildHomeCanonicalUrl(seo?.canonicalURL);
  const shareImageUrl = getStrapiMediaUrl(seo?.shareImage?.url);
  const ogImages = shareImageUrl ? [{ url: shareImageUrl }] : undefined;

  return {
    title,
    description,
    keywords: seo?.keywords ?? undefined,
    alternates: {
      canonical,
    },
    robots: seo?.noIndex ? { index: false, follow: false } : undefined,
    openGraph: {
      type: "website",
      locale: "es_ES",
      siteName: WIAUTO_BRAND_NAME,
      title,
      description,
      url: canonical,
      images: ogImages,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: shareImageUrl ? [shareImageUrl] : undefined,
    },
  };
};

export const buildHomeJsonLd = ({ seo }: BuildHomeSeoInput) => {
  const homeUrl = absoluteUrl("/");
  const organizationId = `${homeUrl}#organization`;
  const websiteId = `${homeUrl}#website`;
  const webPageId = `${homeUrl}#webpage`;
  const title = buildHomeTitle(seo?.metaTitle);
  const description = buildHomeDescription(seo?.metaDescription);
  const shareImageUrl = getStrapiMediaUrl(seo?.shareImage?.url);

  const organization: Record<string, unknown> = {
    "@type": "Organization",
    "@id": organizationId,
    name: WIAUTO_BRAND_NAME,
    url: homeUrl,
    logo: {
      "@type": "ImageObject",
      url: absoluteUrl(WIAUTO_LOGO_PATH),
    },
  };

  if (shareImageUrl) {
    organization.image = shareImageUrl;
  }

  const website: Record<string, unknown> = {
    "@type": "WebSite",
    "@id": websiteId,
    url: homeUrl,
    name: WIAUTO_BRAND_NAME,
    description,
    inLanguage: "es-ES",
    publisher: { "@id": organizationId },
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: absoluteUrl(
          `${VEHICLES_LISTING_BASE_PATH}?q={search_term_string}`,
        ),
      },
      "query-input": "required name=search_term_string",
    },
  };

  const webPage: Record<string, unknown> = {
    "@type": "WebPage",
    "@id": webPageId,
    url: homeUrl,
    name: title,
    description,
    isPartOf: { "@id": websiteId },
    about: { "@id": organizationId },
    inLanguage: "es-ES",
  };

  if (shareImageUrl) {
    webPage.primaryImageOfPage = {
      "@type": "ImageObject",
      url: shareImageUrl,
    };
  }

  return {
    "@context": "https://schema.org",
    "@graph": [organization, website, webPage],
  };
};

export type HomeSeo = {
  metadata: Metadata;
  jsonLdGraph: ReturnType<typeof buildHomeJsonLd>;
};

export const buildHomeSeo = ({ seo }: BuildHomeSeoInput): HomeSeo => ({
  metadata: buildHomeMetadata({ seo }),
  jsonLdGraph: buildHomeJsonLd({ seo }),
});
