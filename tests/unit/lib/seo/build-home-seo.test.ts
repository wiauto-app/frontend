import { describe, expect, it, vi } from "vitest";

import type { StrapiSeo } from "@/interfaces/strapi-components.interface";
import { buildHomeSeo } from "@/lib/seo/build-home-seo";

vi.mock("@/constants", () => ({
  FRONTEND_URL: "https://wiauto.test",
}));

vi.mock("@/lib/strapi-media", () => ({
  getStrapiMediaUrl: (url?: string | null) =>
    url ? `https://media.test/${url}` : undefined,
}));

const buildMockSeo = (overrides: Partial<StrapiSeo> = {}): StrapiSeo => ({
  id: 1,
  metaTitle: "WiAuto | Marketplace de coches",
  metaDescription: "Encuentra tu próximo coche en WiAuto.",
  keywords: "coches, ocasión, seminuevos",
  canonicalURL: "https://wiauto.test/",
  shareImage: { id: 1, url: "share/home.jpg" } as StrapiSeo["shareImage"],
  noIndex: false,
  ...overrides,
});

describe("buildHomeSeo", () => {
  it("genera metadata con canonical, openGraph y twitter", () => {
    const seo = buildHomeSeo({ seo: buildMockSeo() });

    expect(seo.metadata.title).toBe("WiAuto | Marketplace de coches");
    expect(seo.metadata.description).toBe("Encuentra tu próximo coche en WiAuto.");
    expect(seo.metadata.alternates?.canonical).toBe("https://wiauto.test/");
    expect(seo.metadata.openGraph?.type).toBe("website");
    expect(seo.metadata.openGraph?.locale).toBe("es_ES");
    expect(seo.metadata.openGraph?.siteName).toBe("WiAuto");
    expect(seo.metadata.openGraph?.url).toBe("https://wiauto.test/");
    expect(seo.metadata.twitter?.card).toBe("summary_large_image");
  });

  it("aplica noIndex cuando Strapi lo indica", () => {
    const seo = buildHomeSeo({ seo: buildMockSeo({ noIndex: true }) });

    expect(seo.metadata.robots).toEqual({ index: false, follow: false });
  });

  it("genera JSON-LD con Organization, WebSite y WebPage", () => {
    const seo = buildHomeSeo({ seo: buildMockSeo() });

    expect(seo.jsonLdGraph["@context"]).toBe("https://schema.org");
    expect(seo.jsonLdGraph["@graph"]).toHaveLength(3);

    const [organization, website, webPage] = seo.jsonLdGraph["@graph"] as Record<
      string,
      unknown
    >[];

    expect(organization["@type"]).toBe("Organization");
    expect(organization.name).toBe("WiAuto");

    expect(website["@type"]).toBe("WebSite");
    expect(website.inLanguage).toBe("es-ES");
    expect(website.potentialAction).toMatchObject({
      "@type": "SearchAction",
      target: {
        urlTemplate: "https://wiauto.test/vehiculos?q={search_term_string}",
      },
    });

    expect(webPage["@type"]).toBe("WebPage");
    expect(webPage.primaryImageOfPage).toEqual({
      "@type": "ImageObject",
      url: "https://media.test/share/home.jpg",
    });
  });

  it("usa fallbacks cuando Strapi no tiene SEO", () => {
    const seo = buildHomeSeo({ seo: null });

    expect(seo.metadata.title).toContain("WiAuto");
    expect(seo.metadata.description).toContain("WiAuto");
    expect(seo.metadata.alternates?.canonical).toBe("https://wiauto.test/");
  });
});
