import { describe, expect, it, vi } from "vitest";

vi.mock("@/constants", () => ({
  FRONTEND_URL: "https://www.wiauto.test",
}));

import { buildContentSitemap } from "@/lib/seo/build-content-sitemap";

describe("buildContentSitemap", () => {
  it("genera URLs absolutas con lastModified = updatedAt", () => {
    expect(
      buildContentSitemap(
        [
          {
            slug: "guia-de-compra",
            updatedAt: "2026-09-01T10:00:00.000Z",
            noIndex: false,
          },
        ],
        "/noticias",
      ),
    ).toEqual([
      {
        url: "https://www.wiauto.test/noticias/guia-de-compra",
        lastModified: "2026-09-01T10:00:00.000Z",
      },
    ]);
  });

  it("usa el basePath de colaboraciones", () => {
    const [entry] = buildContentSitemap(
      [{ slug: "renting", updatedAt: "2026-09-01T10:00:00.000Z", noIndex: false }],
      "/colaboraciones",
    );

    expect(entry?.url).toBe("https://www.wiauto.test/colaboraciones/renting");
  });

  it("omite entradas noIndex y sin slug", () => {
    const sitemap = buildContentSitemap(
      [
        { slug: "visible", updatedAt: "2026-09-01T10:00:00.000Z", noIndex: false },
        { slug: "oculta", updatedAt: "2026-09-01T10:00:00.000Z", noIndex: true },
        { slug: "", updatedAt: "2026-09-01T10:00:00.000Z", noIndex: false },
      ],
      "/noticias",
    );

    expect(sitemap.map((entry) => entry.url)).toEqual([
      "https://www.wiauto.test/noticias/visible",
    ]);
  });

  it("no inventa lastModified cuando falta updatedAt", () => {
    const [entry] = buildContentSitemap(
      [{ slug: "sin-fecha", noIndex: false }],
      "/noticias",
    );

    expect(entry?.lastModified).toBeUndefined();
  });

  it("escapa el slug para que el loc sea seguro en XML", () => {
    const [entry] = buildContentSitemap(
      [{ slug: "a&b", updatedAt: "2026-09-01T10:00:00.000Z", noIndex: false }],
      "/noticias",
    );

    expect(entry?.url).toBe("https://www.wiauto.test/noticias/a%26b");
  });

  it("devuelve un urlset vacío válido sin entradas", () => {
    expect(buildContentSitemap([], "/noticias")).toEqual([]);
  });
});
