import { readdirSync, readFileSync } from "node:fs";
import path from "node:path";

import { describe, expect, it } from "vitest";

import {
  INDEXABLE_STATIC_PAGES,
  NOINDEX_STATIC_PAGES,
} from "@/lib/seo/static-pages";

const PROJECT_ROOT = path.resolve(__dirname, "../../../..");
const APP_DIR = path.join(PROJECT_ROOT, "app");

const NOINDEX_PAGE_FILES = [
  "app/(landing)/seguros/page.tsx",
  "app/(landing)/garantia-mecanica/page.tsx",
  "app/(landing)/revision-vehiculo/page.tsx",
  "app/(landing)/informe-historial-vehiculo/page.tsx",
  "app/(public)/comparador/page.tsx",
];

/** Rutas con `page.tsx` bajo app/, sin grupos `(x)` ni catch-all opcional final. */
const collectAppRoutes = (): Set<string> => {
  const routes = new Set<string>();

  for (const entry of readdirSync(APP_DIR, { recursive: true })) {
    const relative = String(entry).split(path.sep);

    if (relative.at(-1) !== "page.tsx") {
      continue;
    }

    const segments = relative
      .slice(0, -1)
      .filter((segment) => !/^\(.+\)$/.test(segment))
      .filter((segment) => !/^\[\[\.\.\..+\]\]$/.test(segment));

    routes.add(`/${segments.join("/")}`);
  }

  return routes;
};

describe("static pages del sitemap", () => {
  it("ninguna página noindex está en la lista indexable", () => {
    const overlap = NOINDEX_STATIC_PAGES.filter((page) =>
      INDEXABLE_STATIC_PAGES.includes(page),
    );

    expect(overlap).toEqual([]);
  });

  it("no incluye rutas eliminadas ni duplicados", () => {
    expect(INDEXABLE_STATIC_PAGES).not.toContain("/tasacion");
    expect(INDEXABLE_STATIC_PAGES).not.toContain("/tramites");
    expect(new Set(INDEXABLE_STATIC_PAGES).size).toBe(
      INDEXABLE_STATIC_PAGES.length,
    );
  });

  it("cada ruta indexable y noindex existe en app/", () => {
    const routes = collectAppRoutes();
    const missing = [...INDEXABLE_STATIC_PAGES, ...NOINDEX_STATIC_PAGES].filter(
      (page) => !routes.has(page),
    );

    expect(missing).toEqual([]);
  });

  it.each(NOINDEX_PAGE_FILES)("%s declara NOINDEX_ROBOTS", (file) => {
    const source = readFileSync(path.join(PROJECT_ROOT, file), "utf8");

    expect(source).toMatch(/from ['"]@\/lib\/seo\/noindex['"]/);
    expect(source).toContain("robots: NOINDEX_ROBOTS");
  });

  it("las páginas noindex del test coinciden con NOINDEX_STATIC_PAGES", () => {
    expect(NOINDEX_PAGE_FILES).toHaveLength(NOINDEX_STATIC_PAGES.length);
  });
});
