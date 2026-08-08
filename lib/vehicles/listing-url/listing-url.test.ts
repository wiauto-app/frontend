import { describe, expect, it } from "vitest";

import {
  buildCanonicalListingPath,
  buildVehicleListingHref,
  buildVehicleListingUrl,
  DEFAULT_LISTING_PARAMS,
  normalizeVehicleListingHref,
  parseVehicleListingUrl,
} from "./index";

describe("parseVehicleListingUrl — Opción C", () => {
  it("devuelve defaults de paginación con path y query vacíos", () => {
    expect(parseVehicleListingUrl(undefined, new URLSearchParams())).toEqual({
      page: DEFAULT_LISTING_PARAMS.page,
      limit: DEFAULT_LISTING_PARAMS.limit,
      order_by: DEFAULT_LISTING_PARAMS.order_by,
      order_direction: DEFAULT_LISTING_PARAMS.order_direction,
    });
  });

  it("parsea 1 marca en path (legacy, migrable a query)", () => {
    expect(parseVehicleListingUrl(["toyota"], new URLSearchParams())).toMatchObject({
      makes_slugs: ["toyota"],
    });
  });

  it("parsea marca y modelo en path (legacy, migrable a query)", () => {
    expect(
      parseVehicleListingUrl(["toyota", "corolla"], new URLSearchParams()),
    ).toMatchObject({
      makes_slugs: ["toyota"],
      models_slugs: ["corolla"],
    });
  });

  it("parsea marca y modelo solo desde query", () => {
    const params = new URLSearchParams("marcas=toyota&modelos=corolla");
    expect(parseVehicleListingUrl(undefined, params)).toMatchObject({
      makes_slugs: ["toyota"],
      models_slugs: ["corolla"],
    });
  });

  it("parsea provincia con prefijo en path", () => {
    expect(
      parseVehicleListingUrl(["provincia-madrid"], new URLSearchParams()),
    ).toMatchObject({
      provinces_slugs: ["madrid"],
    });
  });

  it("parsea marca, modelo y provincia en path", () => {
    expect(
      parseVehicleListingUrl(
        ["toyota", "corolla", "provincia-madrid"],
        new URLSearchParams(),
      ),
    ).toMatchObject({
      makes_slugs: ["toyota"],
      models_slugs: ["corolla"],
      provinces_slugs: ["madrid"],
    });
  });

  it("parsea marca y provincia sin modelo", () => {
    expect(
      parseVehicleListingUrl(["toyota", "provincia-madrid"], new URLSearchParams()),
    ).toMatchObject({
      makes_slugs: ["toyota"],
      provinces_slugs: ["madrid"],
    });
  });

  it("parsea varias marcas desde query", () => {
    const params = new URLSearchParams("marcas=toyota,bmw");
    expect(parseVehicleListingUrl(undefined, params)).toMatchObject({
      makes_slugs: ["toyota", "bmw"],
    });
  });

  it("parsea categorías desde query amigable", () => {
    const params = new URLSearchParams("categoria=suv");
    expect(parseVehicleListingUrl(undefined, params)).toMatchObject({
      categories_slugs: ["suv"],
    });
  });

  it("parsea varias categorías desde query amigable", () => {
    const params = new URLSearchParams("categorias=suv,sedan");
    expect(parseVehicleListingUrl(undefined, params)).toMatchObject({
      categories_slugs: ["suv", "sedan"],
    });
  });

  it("parsea categories_slugs legacy desde query", () => {
    const params = new URLSearchParams("categories_slugs=suv&categories_slugs=sedan");
    expect(parseVehicleListingUrl(undefined, params)).toMatchObject({
      categories_slugs: ["suv", "sedan"],
    });
  });

  it("parsea varios modelos desde query con marca en path legacy", () => {
    const params = new URLSearchParams("modelos=corolla,rav4");
    expect(parseVehicleListingUrl(["toyota"], params)).toMatchObject({
      makes_slugs: ["toyota"],
      models_slugs: ["corolla", "rav4"],
    });
  });

  it("parsea varios modelos desde query sin path", () => {
    const params = new URLSearchParams(
      "marcas=toyota&modelos=corolla&modelos=rav4",
    );
    expect(parseVehicleListingUrl(undefined, params)).toMatchObject({
      makes_slugs: ["toyota"],
      models_slugs: ["corolla", "rav4"],
    });
  });

  it("parsea provincia en path y varias marcas en query", () => {
    const params = new URLSearchParams("marcas=toyota,bmw");
    expect(
      parseVehicleListingUrl(["provincia-madrid"], params),
    ).toMatchObject({
      provinces_slugs: ["madrid"],
      makes_slugs: ["toyota", "bmw"],
    });
  });

  it("acepta legacy provincia duplicada", () => {
    expect(
      parseVehicleListingUrl(["madrid", "madrid"], new URLSearchParams()),
    ).toMatchObject({
      provinces_slugs: ["madrid"],
    });
  });

  it("acepta legacy make, model y provincia duplicada", () => {
    expect(
      parseVehicleListingUrl(
        ["toyota", "corolla", "madrid", "madrid"],
        new URLSearchParams(),
      ),
    ).toMatchObject({
      makes_slugs: ["toyota"],
      models_slugs: ["corolla"],
      provinces_slugs: ["madrid"],
    });
  });
});

describe("buildVehicleListingUrl — Opción C", () => {
  it("construye path base sin filtros", () => {
    expect(buildVehicleListingUrl({})).toEqual({
      pathname: "/vehiculos",
      search: "",
    });
  });

  it("construye 1 marca solo en query", () => {
    expect(buildVehicleListingUrl({ makes_slugs: ["toyota"] })).toEqual({
      pathname: "/vehiculos",
      search: "marcas=toyota",
    });
  });

  it("construye marca y modelo solo en query", () => {
    expect(
      buildVehicleListingUrl({
        makes_slugs: ["toyota"],
        models_slugs: ["corolla"],
      }),
    ).toEqual({
      pathname: "/vehiculos",
      search: "marcas=toyota&modelos=corolla",
    });
  });

  it("construye marca, modelo en query y provincia en path", () => {
    expect(
      buildVehicleListingUrl({
        makes_slugs: ["toyota"],
        models_slugs: ["corolla"],
        provinces_slugs: ["madrid"],
      }),
    ).toEqual({
      pathname: "/vehiculos/provincia-madrid",
      search: "marcas=toyota&modelos=corolla",
    });
  });

  it("construye solo provincia en path", () => {
    expect(buildVehicleListingUrl({ provinces_slugs: ["madrid"] })).toEqual({
      pathname: "/vehiculos/provincia-madrid",
      search: "",
    });
  });

  it("degrada N marcas a query", () => {
    expect(
      buildVehicleListingUrl({ makes_slugs: ["toyota", "bmw"] }),
    ).toEqual({
      pathname: "/vehiculos",
      search: "marcas=toyota%2Cbmw",
    });
  });

  it("construye N modelos en query", () => {
    expect(
      buildVehicleListingUrl({
        makes_slugs: ["toyota"],
        models_slugs: ["corolla", "rav4"],
      }),
    ).toEqual({
      pathname: "/vehiculos",
      search: "marcas=toyota&modelos=corolla%2Crav4",
    });
  });

  it("construye provincia en path y N marcas en query", () => {
    expect(
      buildVehicleListingUrl({
        makes_slugs: ["toyota", "bmw"],
        provinces_slugs: ["madrid"],
      }),
    ).toEqual({
      pathname: "/vehiculos/provincia-madrid",
      search: "marcas=toyota%2Cbmw",
    });
  });

  it("conserva publisher_types en query (clave legacy sin alias amigable)", () => {
    expect(
      buildVehicleListingUrl({
        makes_slugs: ["toyota"],
        type_slug: "ocasion",
        since_price: 1000,
        until_price: 14000,
        publisher_types: ["dealership"],
      }),
    ).toEqual({
      pathname: "/vehiculos",
      search:
        "marcas=toyota&tipo=ocasion&precio_desde=1000&precio_hasta=14000&publisher_types=dealership",
    });
  });

  it("emite filtros secundarios en query junto a marca", () => {
    expect(
      buildVehicleListingUrl({
        makes_slugs: ["toyota"],
        until_price: 20000,
      }),
    ).toEqual({
      pathname: "/vehiculos",
      search: "marcas=toyota&precio_hasta=20000",
    });
  });
});

describe("canonical", () => {
  it("canonical base con marca/modelo (solo geo en path)", () => {
    expect(
      buildCanonicalListingPath({
        makes_slugs: ["toyota"],
        models_slugs: ["corolla", "rav4"],
      }),
    ).toBe("/vehiculos");
  });

  it("canonical base para N marcas", () => {
    expect(
      buildCanonicalListingPath({ makes_slugs: ["toyota", "bmw"] }),
    ).toBe("/vehiculos");
  });

  it("canonical provincia para N marcas en query", () => {
    expect(
      buildCanonicalListingPath({
        makes_slugs: ["toyota", "bmw"],
        provinces_slugs: ["madrid"],
      }),
    ).toBe("/vehiculos/provincia-madrid");
  });
});

describe("normalizeVehicleListingHref", () => {
  it("normaliza path legacy con comas a query", () => {
    const target = normalizeVehicleListingHref(
      ["toyota,honda"],
      new URLSearchParams(),
    );
    expect(target).toBe("/vehiculos?marcas=toyota%2Chonda");
  });

  it("normaliza marca en path legacy a query", () => {
    const target = normalizeVehicleListingHref(
      ["toyota"],
      new URLSearchParams(),
    );
    expect(target).toBe("/vehiculos?marcas=toyota");
  });

  it("normaliza marca y modelo en path legacy a query", () => {
    const target = normalizeVehicleListingHref(
      ["toyota", "corolla"],
      new URLSearchParams(),
    );
    expect(target).toBe("/vehiculos?marcas=toyota&modelos=corolla");
  });

  it("no elimina publisher_types al normalizar", () => {
    const params = new URLSearchParams(
      "marcas=toyota,abarth&tipo=ocasion&precio_desde=1000&precio_hasta=14000&publisher_types=dealership",
    );
    const target = normalizeVehicleListingHref(undefined, params);
    expect(target).toBeNull();
  });

  it("normaliza provincia duplicada legacy", () => {
    const target = normalizeVehicleListingHref(
      ["madrid", "madrid"],
      new URLSearchParams(),
    );
    expect(target).toBe("/vehiculos/provincia-madrid");
  });
});

describe("round-trip", () => {
  const normalize = (value: string) => {
    const parsed_url = new URL(value, "http://localhost");
    const entries = [...parsed_url.searchParams.entries()].sort(([a], [b]) =>
      a.localeCompare(b),
    );
    const search = new URLSearchParams(entries).toString();
    return search ? `${parsed_url.pathname}?${search}` : parsed_url.pathname;
  };

  const extractSlugFromPathname = (pathname: string): string[] | undefined => {
    if (pathname === "/vehiculos" || pathname === "/vehiculos/") {
      return undefined;
    }
    const prefix = "/vehiculos/";
    if (!pathname.startsWith(prefix)) {
      return undefined;
    }
    const segments = pathname.slice(prefix.length).split("/").filter(Boolean);
    return segments.length > 0 ? segments : undefined;
  };

  it("round-trip estable para marca, modelo y provincia", () => {
    const href = buildVehicleListingHref({
      makes_slugs: ["toyota"],
      models_slugs: ["corolla"],
      provinces_slugs: ["madrid"],
      until_price: 15000,
      page: 2,
    });

    const url = new URL(href, "http://localhost");
    const slug = extractSlugFromPathname(url.pathname);
    const parsed = parseVehicleListingUrl(slug, url.searchParams);
    const rebuilt = buildVehicleListingHref(parsed);

    expect(parsed.makes_slugs).toEqual(["toyota"]);
    expect(parsed.models_slugs).toEqual(["corolla"]);
    expect(parsed.provinces_slugs).toEqual(["madrid"]);
    expect(normalize(rebuilt)).toBe(normalize(href));
  });

  it("round-trip estable con varias marcas en query", () => {
    const href = buildVehicleListingHref({
      makes_slugs: ["toyota", "honda"],
      until_price: 10000,
    });

    const url = new URL(href, "http://localhost");
    const slug = extractSlugFromPathname(url.pathname);
    const parsed = parseVehicleListingUrl(slug, url.searchParams);
    const rebuilt = buildVehicleListingHref(parsed);

    expect(parsed.makes_slugs).toEqual(["toyota", "honda"]);
    expect(normalize(rebuilt)).toBe(normalize(href));
  });

  it("round-trip multi marcas y modelos en query", () => {
    const href = buildVehicleListingHref({
      makes_slugs: ["toyota", "bmw"],
      models_slugs: ["corolla", "rav4"],
    });

    const url = new URL(href, "http://localhost");
    const slug = extractSlugFromPathname(url.pathname);
    const parsed = parseVehicleListingUrl(slug, url.searchParams);
    const rebuilt = buildVehicleListingHref(parsed);

    expect(parsed.makes_slugs).toEqual(["toyota", "bmw"]);
    expect(parsed.models_slugs).toEqual(["corolla", "rav4"]);
    expect(normalize(rebuilt)).toBe(normalize(href));
  });

  it("round-trip varias provincias solo en query", () => {
    const href = buildVehicleListingHref({
      provinces_slugs: ["madrid", "barcelona"],
    });

    const url = new URL(href, "http://localhost");
    const slug = extractSlugFromPathname(url.pathname);
    const parsed = parseVehicleListingUrl(slug, url.searchParams);
    const rebuilt = buildVehicleListingHref(parsed);

    expect(parsed.provinces_slugs).toEqual(["madrid", "barcelona"]);
    expect(normalize(rebuilt)).toBe(normalize(href));
  });

  it("round-trip categorías en query amigable", () => {
    const href = buildVehicleListingHref({
      categories_slugs: ["suv", "sedan"],
    });

    const url = new URL(href, "http://localhost");
    const slug = extractSlugFromPathname(url.pathname);
    const parsed = parseVehicleListingUrl(slug, url.searchParams);
    const rebuilt = buildVehicleListingHref(parsed);

    expect(parsed.categories_slugs).toEqual(["suv", "sedan"]);
    expect(rebuilt).toContain("categoria=suv%2Csedan");
    expect(normalize(rebuilt)).toBe(normalize(href));
  });
});
