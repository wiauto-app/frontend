import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@/constants", () => ({
  API_URL: "https://api.test",
  FRONTEND_URL: "https://www.wiauto.test",
}));

import { fetchAllDealershipSitemapEntries } from "@/lib/seo/fetch-dealership-sitemap";

const buildDealershipPage = (
  page: number,
  total: number,
  items: Array<{ slug: string; updated_at: string }>,
) =>
  new Response(
    JSON.stringify({
      ok: true,
      status: 200,
      data: { data: items, total, page, limit: 100 },
    }),
    { status: 200 },
  );

const buildItems = (from: number, count: number) =>
  Array.from({ length: count }, (_, index) => ({
    slug: `concesionario-${from + index}`,
    updated_at: "2026-09-01T10:00:00.000Z",
  }));

describe("fetchAllDealershipSitemapEntries", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("pagina hasta cubrir el total y mapea slug y updated_at", async () => {
    const fetchMock = vi
      .spyOn(globalThis, "fetch")
      .mockResolvedValueOnce(buildDealershipPage(1, 150, buildItems(1, 100)))
      .mockResolvedValueOnce(buildDealershipPage(2, 150, buildItems(101, 50)));

    const entries = await fetchAllDealershipSitemapEntries();

    expect(entries).toHaveLength(150);
    expect(entries[0]).toEqual({
      slug: "concesionario-1",
      updatedAt: "2026-09-01T10:00:00.000Z",
    });
    expect(fetchMock).toHaveBeenCalledTimes(2);

    const firstUrl = new URL(String(fetchMock.mock.calls[0]?.[0]));
    const secondUrl = new URL(String(fetchMock.mock.calls[1]?.[0]));

    expect(firstUrl.origin + firstUrl.pathname).toBe(
      "https://api.test/v1/dealerships",
    );
    expect(firstUrl.searchParams.get("limit")).toBe("100");
    expect(firstUrl.searchParams.get("page")).toBe("1");
    expect(secondUrl.searchParams.get("page")).toBe("2");
    expect(fetchMock.mock.calls[0]?.[1]).toEqual(
      expect.objectContaining({ next: { revalidate: 3600 } }),
    );
  });

  it("incluye todos los concesionarios sin filtrar por vehículos", async () => {
    const fetchMock = vi
      .spyOn(globalThis, "fetch")
      .mockResolvedValue(buildDealershipPage(1, 1, buildItems(1, 1)));

    await fetchAllDealershipSitemapEntries();

    const url = new URL(String(fetchMock.mock.calls[0]?.[0]));

    expect(url.searchParams.has("vehicles_number")).toBe(false);
  });

  it("devuelve lista vacía cuando no hay concesionarios", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValue(
      buildDealershipPage(1, 0, []),
    );

    await expect(fetchAllDealershipSitemapEntries()).resolves.toEqual([]);
  });

  it("lanza cuando la API responde con error", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValue(
      new Response("{}", { status: 503 }),
    );

    await expect(fetchAllDealershipSitemapEntries()).rejects.toThrow(/503/);
  });

  it("lanza ante una respuesta inválida", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValue(
      new Response(JSON.stringify({ ok: false }), { status: 200 }),
    );

    await expect(fetchAllDealershipSitemapEntries()).rejects.toThrow(
      /Respuesta inválida/,
    );
  });

  it("corta con un error cuando supera el máximo de páginas", async () => {
    const fetchMock = vi
      .spyOn(globalThis, "fetch")
      .mockImplementation(async () =>
        buildDealershipPage(1, 99_999_900, buildItems(1, 1)),
      );

    await expect(fetchAllDealershipSitemapEntries()).rejects.toThrow(
      /máximo de 500 páginas/,
    );
    expect(fetchMock).toHaveBeenCalledTimes(500);
  });
});
