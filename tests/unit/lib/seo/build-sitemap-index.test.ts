import { describe, expect, it, vi } from "vitest";

vi.mock("@/constants", () => ({
  FRONTEND_URL: "https://www.wiauto.test",
}));

import { buildSitemapIndexXml } from "@/lib/seo/build-sitemap-index";

describe("buildSitemapIndexXml", () => {
  it("genera un sitemapindex con un <sitemap><loc> por URL", () => {
    const xml = buildSitemapIndexXml([
      "https://www.wiauto.test/a.xml",
      "https://www.wiauto.test/b.xml",
    ]);

    expect(xml).toBe(`<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <sitemap>
    <loc>https://www.wiauto.test/a.xml</loc>
  </sitemap>
  <sitemap>
    <loc>https://www.wiauto.test/b.xml</loc>
  </sitemap>
</sitemapindex>`);
  });

  it("no emite <lastmod> (no hay fecha real que declarar)", () => {
    const xml = buildSitemapIndexXml(["https://www.wiauto.test/a.xml"]);

    expect(xml).not.toContain("<lastmod>");
  });

  it("escapa los caracteres reservados de XML en <loc>", () => {
    const xml = buildSitemapIndexXml([
      "https://www.wiauto.test/a.xml?x=1&y=<2>'\"",
    ]);

    expect(xml).toContain(
      "<loc>https://www.wiauto.test/a.xml?x=1&amp;y=&lt;2&gt;&apos;&quot;</loc>",
    );
  });

  it("lanza si alguna URL no es absoluta", () => {
    expect(() => buildSitemapIndexXml(["/sitemap/paginas/sitemap.xml"])).toThrow(
      /absolutas/,
    );
  });
});
