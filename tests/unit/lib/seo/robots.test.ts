import { describe, expect, it, vi } from "vitest";

vi.mock("@/constants", () => ({
  FRONTEND_URL: "https://www.wiauto.test",
}));

import robots from "@/app/robots";
import {
  INDEXABLE_STATIC_PAGES,
  NOINDEX_STATIC_PAGES,
} from "@/lib/seo/static-pages";

const getRule = () => {
  const { rules } = robots();

  if (Array.isArray(rules)) {
    throw new Error("robots() debe devolver una sola regla");
  }

  return rules;
};

describe("robots", () => {
  it("permite todo el sitio para cualquier user agent", () => {
    const rule = getRule();

    expect(rule.userAgent).toBe("*");
    expect(rule.allow).toBe("/");
  });

  it("apunta al sitemap master con URL absoluta", () => {
    expect(robots().sitemap).toBe("https://www.wiauto.test/sitemap.xml");
  });

  it("bloquea las rutas privadas y de flujo", () => {
    expect(getRule().disallow).toEqual(
      expect.arrayContaining([
        "/usuario",
        "/publicar",
        "/editar-vehiculo",
        "/billing-plan",
        "/asistente",
        "/api/",
        "/auth/",
        "/iniciar-sesion",
        "/registro",
        "/cambiar-contrasena",
        "/confirmar-correo",
        "/olvide-contrasena",
        "/verificacion-2fa",
        "/oauth-popup-complete",
        "/invitacion/",
      ]),
    );
  });

  it("no bloquea las páginas noindex (el crawler debe ver el meta robots)", () => {
    const disallow = getRule().disallow;
    const blocked = Array.isArray(disallow) ? disallow : [disallow ?? ""];

    for (const page of NOINDEX_STATIC_PAGES) {
      expect(blocked.some((path) => path && page.startsWith(path))).toBe(false);
    }
  });

  it("no bloquea ninguna página indexable del sitemap", () => {
    const disallow = getRule().disallow;
    const blocked = Array.isArray(disallow) ? disallow : [disallow ?? ""];

    for (const page of INDEXABLE_STATIC_PAGES) {
      expect(blocked.some((path) => path && page.startsWith(path))).toBe(false);
    }
  });

  it("no bloquea /_next/ ni el sitemap", () => {
    const disallow = getRule().disallow;
    const blocked = Array.isArray(disallow) ? disallow : [disallow ?? ""];

    expect(blocked).not.toContain("/_next/");
    expect(blocked.some((path) => path && "/sitemap.xml".startsWith(path))).toBe(
      false,
    );
  });
});
