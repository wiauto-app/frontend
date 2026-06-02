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

  it("parsea 1 marca en path", () => {
    expect(parseVehicleListingUrl(["toyota"], new URLSearchParams())).toMatchObject({
      makes_slugs: ["toyota"],
    });
  });

  it("parsea marca y modelo en path", () => {
    expect(
      parseVehicleListingUrl(["toyota", "corolla"], new URLSearchParams()),
    ).toMatchObject({
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

  it("parsea varios modelos desde query con marca en path", () => {
    const params = new URLSearchParams("modelos=corolla,rav4");
    expect(parseVehicleListingUrl(["toyota"], params)).toMatchObject({
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

  it("construye 1 marca en path", () => {
    expect(buildVehicleListingUrl({ makes_slugs: ["toyota"] })).toEqual({
      pathname: "/vehiculos/toyota",
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
      pathname: "/vehiculos/toyota/corolla",
      search: "",
    });
  });

  it("construye marca, modelo y provincia en path", () => {
    expect(
      buildVehicleListingUrl({
        makes_slugs: ["toyota"],
        models_slugs: ["corolla"],
        provinces_slugs: ["madrid"],
      }),
    ).toEqual({
      pathname: "/vehiculos/toyota/corolla/provincia-madrid",
      search: "",
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

  it("degrada N modelos a query con marca en path", () => {
    expect(
      buildVehicleListingUrl({
        makes_slugs: ["toyota"],
        models_slugs: ["corolla", "rav4"],
      }),
    ).toEqual({
      pathname: "/vehiculos/toyota",
      search: "modelos=corolla%2Crav4",
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

  it("emite filtros secundarios solo en query", () => {
    expect(
      buildVehicleListingUrl({
        makes_slugs: ["toyota"],
        until_price: 20000,
      }),
    ).toEqual({
      pathname: "/vehiculos/toyota",
      search: "precio_hasta=20000",
    });
  });
});

describe("canonical", () => {
  it("canonical sin query degradada para N modelos", () => {
    expect(
      buildCanonicalListingPath({
        makes_slugs: ["toyota"],
        models_slugs: ["corolla", "rav4"],
      }),
    ).toBe("/vehiculos/toyota");
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
});
