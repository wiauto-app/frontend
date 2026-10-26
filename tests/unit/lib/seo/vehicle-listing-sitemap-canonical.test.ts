import { describe, expect, it } from "vitest";

import { resolveListingIndexability } from "@/lib/vehicles/listing-url";

describe("vehicle listing sitemap canonical paths", () => {
  it("marca y modelo indexables", () => {
    const { isIndexable, canonicalPath } = resolveListingIndexability({
      makes_slugs: ["toyota"],
      models_slugs: ["4runner"],
    });

    expect(isIndexable).toBe(true);
    expect(canonicalPath).toBe("/vehiculos/marca-toyota/modelo-4runner");
  });

  it("marca, modelo y provincia indexables", () => {
    const { isIndexable, canonicalPath } = resolveListingIndexability({
      makes_slugs: ["toyota"],
      models_slugs: ["4runner"],
      provinces_slugs: ["madrid"],
    });

    expect(isIndexable).toBe(true);
    expect(canonicalPath).toBe(
      "/vehiculos/marca-toyota/modelo-4runner/provincia-madrid",
    );
  });
});
