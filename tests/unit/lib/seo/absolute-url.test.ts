import { describe, expect, it, vi } from "vitest";

import { absoluteUrl } from "@/lib/seo/absolute-url";

vi.mock("@/constants", () => ({
  FRONTEND_URL: "https://wiauto.test",
}));

describe("absoluteUrl", () => {
  it("combina FRONTEND_URL con path relativo", () => {
    expect(absoluteUrl("/vehiculos")).toBe("https://wiauto.test/vehiculos");
    expect(absoluteUrl("concesionarias")).toBe(
      "https://wiauto.test/concesionarias",
    );
  });
});
