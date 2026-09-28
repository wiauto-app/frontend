import { describe, expect, it } from "vitest";

import {
  buildCarVerticalReportUrl,
  normalizeCarVerticalSub3,
} from "@/app/(landing)/colaboraciones/utils/buildCarVerticalReportUrl";

describe("buildCarVerticalReportUrl", () => {
  it("incluye parámetros de afiliado fijos", () => {
    const url = new URL(buildCarVerticalReportUrl("1234BCD"));

    expect(url.origin + url.pathname).toBe(
      "https://www.carvertical.deal/2MLHC3D/CDLHJH/",
    );
    expect(url.searchParams.get("uid")).toBe("293");
    expect(url.searchParams.get("source_id")).toBe("AFF");
    expect(url.searchParams.get("sub1")).toBe("wiauto");
    expect(url.searchParams.get("sub3")).toBe("1234BCD");
  });

  it("normaliza sub3 sin espacios ni guiones", () => {
    expect(normalizeCarVerticalSub3("1234 bcd")).toBe("1234BCD");
    expect(normalizeCarVerticalSub3("wv wzzz3czwe123456")).toBe(
      "WVWZZZ3CZWE123456",
    );
    expect(buildCarVerticalReportUrl("1234-BCD")).toContain("sub3=1234BCD");
  });
});
