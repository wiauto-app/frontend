import { describe, expect, it, vi } from "vitest";

import { buildBreadcrumbListJsonLd } from "@/lib/seo/build-breadcrumb-list-json-ld";

vi.mock("@/constants", () => ({
  FRONTEND_URL: "https://wiauto.test",
}));

describe("buildBreadcrumbListJsonLd", () => {
  it("genera ListItem con URLs absolutas para items con href", () => {
    const jsonLd = buildBreadcrumbListJsonLd([
      { label: "Inicio", href: "/" },
      { label: "Vehículos", href: "/vehiculos" },
      { label: "Detalle" },
    ]);

    expect(jsonLd).toEqual({
      "@type": "BreadcrumbList",
      itemListElement: [
        {
          "@type": "ListItem",
          position: 1,
          name: "Inicio",
          item: "https://wiauto.test/",
        },
        {
          "@type": "ListItem",
          position: 2,
          name: "Vehículos",
          item: "https://wiauto.test/vehiculos",
        },
        {
          "@type": "ListItem",
          position: 3,
          name: "Detalle",
        },
      ],
    });
  });
});
