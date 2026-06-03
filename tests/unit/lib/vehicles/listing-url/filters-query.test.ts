import { describe, expect, it } from "vitest";

import {
  parseFiltersQueryString,
  stringifyFiltersQuery,
  toggleFilterQueryArrayItem,
} from "@/lib/vehicles/listing-url/filters-query";

describe("filters-query", () => {
  it("parsea arrays en coma", () => {
    const parsed = parseFiltersQueryString("marcas=audi,bmw&pagina=2");
    expect(parsed.marcas).toEqual(["audi", "bmw"]);
    expect(parsed.pagina).toBe("2");
  });

  it("parsea claves repetidas como array", () => {
    const parsed = parseFiltersQueryString("marcas=audi&marcas=bmw");
    expect(parsed.marcas).toEqual(["audi", "bmw"]);
  });

  it("serializa arrays en coma por defecto", () => {
    const query = stringifyFiltersQuery({
      marcas: ["audi", "bmw"],
      pagina: "1",
    });
    expect(query).toBe("marcas=audi%2Cbmw&pagina=1");
  });

  it("toggleFilterQueryArrayItem añade y quita slugs", () => {
    const record = parseFiltersQueryString("marcas=audi");
    toggleFilterQueryArrayItem(record, "marcas", "bmw", true);
    expect(record.marcas).toEqual(["audi", "bmw"]);
    toggleFilterQueryArrayItem(record, "marcas", "audi", false);
    expect(record.marcas).toEqual(["bmw"]);
  });
});
