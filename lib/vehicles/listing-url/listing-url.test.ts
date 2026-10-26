import { describe, expect, it } from "vitest";

import {
  buildCanonicalListingPath,
  buildFilterSegments,
  buildVehicleListingHref,
  buildVehicleListingUrl,
  DEFAULT_LISTING_PARAMS,
  normalizeVehicleListingHref,
  parseFilterSegments,
  parseVehicleListingUrl,
  resolveListingIndexability,
} from "./index";

describe("parseVehicleListingUrl", () => {
  it("devuelve defaults de paginación con path y query vacíos", () => {
    expect(parseVehicleListingUrl(undefined, new URLSearchParams())).toEqual({
      page: DEFAULT_LISTING_PARAMS.page,
      limit: DEFAULT_LISTING_PARAMS.limit,
      order_by: DEFAULT_LISTING_PARAMS.order_by,
      order_direction: DEFAULT_LISTING_PARAMS.order_direction,
    });
  });

  it("parsea segmentos con prefijo", () => {
    expect(
      parseVehicleListingUrl(
        ["marca-toyota", "modelo-corolla", "provincia-madrid"],
        new URLSearchParams(),
      ),
    ).toMatchObject({
      makes_slugs: ["toyota"],
      models_slugs: ["corolla"],
      provinces_slugs: ["madrid"],
    });
  });

  it("parsea legacy marca y modelo en path", () => {
    expect(
      parseVehicleListingUrl(["toyota", "corolla"], new URLSearchParams()),
    ).toMatchObject({
      makes_slugs: ["toyota"],
      models_slugs: ["corolla"],
    });
  });

  it("parsea filtros amigables en query (migración)", () => {
    const params = new URLSearchParams("marcas=toyota&modelos=corolla&color=rojo");
    expect(parseVehicleListingUrl(undefined, params)).toMatchObject({
      makes_slugs: ["toyota"],
      models_slugs: ["corolla"],
      color_slugs: ["rojo"],
    });
  });

  it("parsea estado y tipo en path", () => {
    expect(
      parseVehicleListingUrl(
        ["tipo-turismo", "estado-usado"],
        new URLSearchParams(),
      ),
    ).toMatchObject({
      type_slug: "turismo",
      condition: "used",
    });
  });

  it("parsea rango de precio en path", () => {
    expect(
      parseVehicleListingUrl(["precio-hasta-15000"], new URLSearchParams()),
    ).toMatchObject({
      until_price: 15000,
    });
  });

  it("parsea multi valor con coma codificada", () => {
    expect(
      parseFilterSegments(["color-rojo%2Cazul"]),
    ).toMatchObject({
      color_slugs: ["rojo", "azul"],
    });
  });
});

describe("buildVehicleListingUrl", () => {
  it("construye path base sin filtros", () => {
    expect(buildVehicleListingUrl({})).toEqual({
      pathname: "/vehiculos",
      search: "",
    });
  });

  it("construye marca y modelo en path", () => {
    expect(
      buildVehicleListingUrl({
        makes_slugs: ["toyota"],
        models_slugs: ["corolla"],
      }),
    ).toEqual({
      pathname: "/vehiculos/marca-toyota/modelo-corolla",
      search: "",
    });
  });

  it("ordena valores multi en path", () => {
    expect(
      buildVehicleListingHref({
        makes_slugs: ["toyota", "bmw"],
      }),
    ).toBe("/vehiculos/marca-bmw,toyota");
  });

  it("construye precio y vendedor en path", () => {
    expect(
      buildVehicleListingHref({
        makes_slugs: ["toyota"],
        until_price: 20000,
        publisher_types: ["dealership"],
      }),
    ).toBe(
      "/vehiculos/marca-toyota/vendedor-profesional/precio-hasta-20000",
    );
  });

  it("mantiene paginación y orden en query", () => {
    const { search } = buildVehicleListingUrl({
      makes_slugs: ["toyota"],
      page: 2,
      order_by: "price",
      order_direction: "ASC",
    });
    expect(search).toContain("pagina=2");
    expect(search).toContain("orden=price-asc");
  });
});

describe("normalizeVehicleListingHref", () => {
  it("redirige legacy marca/modelo a path con prefijos", () => {
    const target = normalizeVehicleListingHref(
      ["toyota", "corolla", "madrid"],
      new URLSearchParams(),
    );
    expect(target).toBe(
      "/vehiculos/marca-toyota/modelo-corolla/provincia-madrid",
    );
  });

  it("redirige query de catálogo a path", () => {
    const target = normalizeVehicleListingHref(
      undefined,
      new URLSearchParams("marcas=toyota&modelos=corolla&color=rojo"),
    );
    expect(target).toBe(
      "/vehiculos/marca-toyota/modelo-corolla/color-rojo",
    );
  });

  it("devuelve null si la URL ya es canónica", () => {
    const href = buildVehicleListingHref({
      makes_slugs: ["toyota"],
      models_slugs: ["corolla"],
    });
    const url = new URL(href, "http://localhost");
    const slug = url.pathname.replace("/vehiculos/", "").split("/").filter(Boolean);
    expect(
      normalizeVehicleListingHref(slug, url.searchParams),
    ).toBeNull();
  });

  it("conserva show_map al normalizar", () => {
    const target = normalizeVehicleListingHref(
      undefined,
      new URLSearchParams("marcas=toyota&show_map=true"),
    );
    expect(target).toBe("/vehiculos/marca-toyota?show_map=true");
  });

  it("no redirige si solo cambia show_map en una URL ya canónica", () => {
    expect(
      normalizeVehicleListingHref(
        ["marca-toyota"],
        new URLSearchParams("show_map=true"),
      ),
    ).toBeNull();
  });

  it("conserva etiqueta por id al mover catálogo de query a path", () => {
    const target = normalizeVehicleListingHref(
      undefined,
      new URLSearchParams("marcas=toyota&etiqueta=label-uuid-1"),
    );
    expect(target).toBe(
      "/vehiculos/marca-toyota?etiqueta=label-uuid-1",
    );
  });
});

describe("resolveListingIndexability", () => {
  it("indexa listado con hasta 3 filtros indexables de valor único", () => {
    const result = resolveListingIndexability({
      makes_slugs: ["toyota"],
      models_slugs: ["corolla"],
      provinces_slugs: ["madrid"],
    });
    expect(result.isIndexable).toBe(true);
    expect(result.canonicalPath).toBe(
      "/vehiculos/marca-toyota/modelo-corolla/provincia-madrid",
    );
  });

  it("no indexa con multiselección", () => {
    const result = resolveListingIndexability({
      color_slugs: ["rojo", "azul"],
    });
    expect(result.isIndexable).toBe(false);
  });

  it("no indexa con geolocalización", () => {
    const result = resolveListingIndexability({
      makes_slugs: ["toyota"],
      lat: 40.4,
      lng: -3.7,
      radius: 25000,
    });
    expect(result.isIndexable).toBe(false);
  });

  it("canonical recorta a 3 filtros indexables", () => {
    const result = resolveListingIndexability({
      type_slug: "turismo",
      condition: "used",
      makes_slugs: ["toyota"],
      models_slugs: ["corolla"],
      provinces_slugs: ["madrid"],
    });
    expect(result.isIndexable).toBe(false);
    expect(result.canonicalPath).toBe(
      "/vehiculos/tipo-turismo/estado-usado/marca-toyota",
    );
  });
});

describe("round-trip", () => {
  it("parse → build estable para filtros mixtos", () => {
    const href = buildVehicleListingHref({
      makes_slugs: ["toyota"],
      models_slugs: ["corolla"],
      provinces_slugs: ["madrid"],
      until_price: 15000,
      fuel_type_slugs: ["hibrido"],
      page: 2,
    });

    const url = new URL(href, "http://localhost");
    const slug = url.pathname
      .replace(/^\/vehiculos\/?/, "")
      .split("/")
      .filter(Boolean);
    const parsed = parseVehicleListingUrl(slug, url.searchParams);
    const rebuilt = buildVehicleListingHref(parsed);

    expect(parsed.makes_slugs).toEqual(["toyota"]);
    expect(parsed.until_price).toBe(15000);
    expect(rebuilt).toBe(href);
  });
});

describe("buildCanonicalListingPath", () => {
  it("usa canonical indexable reducida", () => {
    expect(
      buildCanonicalListingPath({
        makes_slugs: ["toyota"],
        models_slugs: ["corolla"],
        color_slugs: ["rojo"],
      }),
    ).toBe("/vehiculos/marca-toyota/modelo-corolla");
  });
});

describe("buildFilterSegments", () => {
  it("usa cuota- en lugar de precio- cuando hay plazo", () => {
    const segments = buildFilterSegments({
      cuota_slugs: ["36"],
      since_price: 200,
      until_price: 400,
    });
    expect(segments.some((s) => s.startsWith("cuota-"))).toBe(true);
    expect(segments.some((s) => s.startsWith("precio-"))).toBe(false);
  });
});
