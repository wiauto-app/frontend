import { afterEach, describe, expect, it, vi } from "vitest";

const constants = vi.hoisted(() => ({
  FRONTEND_URL: "https://www.wiauto.test" as string | undefined,
}));

vi.mock("@/constants", () => constants);

import { buildMasterSitemapLocs } from "@/lib/seo/build-sitemap-index";

const CONTENT_LOCS = [
  "https://www.wiauto.test/sitemap/paginas/sitemap.xml",
  "https://www.wiauto.test/sitemap/noticias/sitemap.xml",
  "https://www.wiauto.test/sitemap/colaboraciones/sitemap.xml",
  "https://www.wiauto.test/sitemap/concesionarios/sitemap.xml",
];

describe("buildMasterSitemapLocs", () => {
  afterEach(() => {
    constants.FRONTEND_URL = "https://www.wiauto.test";
  });

  it("lista solo las hojas: vehículos, catálogo, con provincia y contenido", () => {
    expect(
      buildMasterSitemapLocs({
        vehiclePages: 2,
        catalogPages: 1,
        withProvincePages: 2,
      }),
    ).toEqual([
      "https://www.wiauto.test/vehiculo/sitemap/0.xml",
      "https://www.wiauto.test/vehiculo/sitemap/1.xml",
      "https://www.wiauto.test/sitemap/vehiculos/catalog/sitemap/0.xml",
      "https://www.wiauto.test/sitemap/vehiculos/with-province/sitemap/0.xml",
      "https://www.wiauto.test/sitemap/vehiculos/with-province/sitemap/1.xml",
      ...CONTENT_LOCS,
    ]);
  });

  it("usa el segmento 0 cuando totalPages es 0", () => {
    const locs = buildMasterSitemapLocs({
      vehiclePages: 0,
      catalogPages: 0,
      withProvincePages: 0,
    });

    expect(locs).toEqual([
      "https://www.wiauto.test/vehiculo/sitemap/0.xml",
      "https://www.wiauto.test/sitemap/vehiculos/catalog/sitemap/0.xml",
      "https://www.wiauto.test/sitemap/vehiculos/with-province/sitemap/0.xml",
      ...CONTENT_LOCS,
    ]);
  });

  it("nunca emite URLs de sitemap index (-index)", () => {
    const locs = buildMasterSitemapLocs({
      vehiclePages: 3,
      catalogPages: 3,
      withProvincePages: 3,
    });

    expect(locs.filter((loc) => loc.includes("-index"))).toEqual([]);
    expect(locs.filter((loc) => loc.includes("listings-index"))).toEqual([]);
  });

  it("lanza si FRONTEND_URL no está definido (loc relativo es inválido)", () => {
    constants.FRONTEND_URL = undefined;

    expect(() =>
      buildMasterSitemapLocs({
        vehiclePages: 1,
        catalogPages: 1,
        withProvincePages: 1,
      }),
    ).toThrow(/NEXT_PUBLIC_FRONTEND_URL/);
  });

  it("lanza si FRONTEND_URL no tiene host", () => {
    constants.FRONTEND_URL = "/";

    expect(() =>
      buildMasterSitemapLocs({
        vehiclePages: 1,
        catalogPages: 1,
        withProvincePages: 1,
      }),
    ).toThrow(/NEXT_PUBLIC_FRONTEND_URL/);
  });
});
