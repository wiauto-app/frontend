import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@/constants", () => ({
  ENVIRONMENT: "production",
  FRONTEND_URL: "https://www.wiauto.test",
}));

vi.mock("@/constants/strapi.constants", () => ({
  STRAPI_API_URL: "https://strapi.test",
  STRAPI_TOKEN: "token",
}));

import { fetchAllStrapiSitemapEntries } from "@/lib/seo/fetch-strapi-sitemap-entries";

const buildStrapiPage = (
  page: number,
  pageCount: number,
  total: number,
  items: Array<Record<string, unknown>>,
) =>
  new Response(
    JSON.stringify({
      data: items,
      meta: { pagination: { page, pageSize: 100, pageCount, total } },
    }),
    { status: 200 },
  );

const buildItems = (from: number, count: number) =>
  Array.from({ length: count }, (_, index) => ({
    id: from + index,
    slug: `noticia-${from + index}`,
    updatedAt: "2026-09-01T10:00:00.000Z",
    seo: null,
  }));

const requestedUrl = (fetchMock: ReturnType<typeof vi.spyOn>, call: number) =>
  new URL(String(fetchMock.mock.calls[call]?.[0]));

describe("fetchAllStrapiSitemapEntries", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("pagina 250 items en 3 páginas y se detiene en pageCount", async () => {
    const fetchMock = vi
      .spyOn(globalThis, "fetch")
      .mockResolvedValueOnce(buildStrapiPage(1, 3, 250, buildItems(1, 100)))
      .mockResolvedValueOnce(buildStrapiPage(2, 3, 250, buildItems(101, 100)))
      .mockResolvedValueOnce(buildStrapiPage(3, 3, 250, buildItems(201, 50)));

    const entries = await fetchAllStrapiSitemapEntries("/noticias", {
      includeSeo: true,
    });

    expect(entries).toHaveLength(250);
    expect(entries[0]).toEqual({
      slug: "noticia-1",
      updatedAt: "2026-09-01T10:00:00.000Z",
      noIndex: false,
    });
    expect(fetchMock).toHaveBeenCalledTimes(3);
    expect(
      [0, 1, 2].map((call) =>
        requestedUrl(fetchMock, call).searchParams.get("pagination[page]"),
      ),
    ).toEqual(["1", "2", "3"]);
  });

  it("envía pageSize=100, campos mínimos, orden estable y status=published", async () => {
    const fetchMock = vi
      .spyOn(globalThis, "fetch")
      .mockResolvedValue(buildStrapiPage(1, 1, 0, []));

    await fetchAllStrapiSitemapEntries("/noticias", { includeSeo: true });

    const url = requestedUrl(fetchMock, 0);

    expect(url.origin + url.pathname).toBe("https://strapi.test/api/noticias");
    expect(url.searchParams.get("pagination[pageSize]")).toBe("100");
    expect(url.searchParams.get("fields[0]")).toBe("slug");
    expect(url.searchParams.get("fields[1]")).toBe("updatedAt");
    expect(url.searchParams.get("populate[seo][fields][0]")).toBe("noIndex");
    expect(url.searchParams.get("status")).toBe("published");
    expect(url.searchParams.get("sort[0]")).toBe("updatedAt:desc");
    expect(url.searchParams.get("sort[1]")).toBe("id:asc");
  });

  it("no popula seo cuando includeSeo es false", async () => {
    const fetchMock = vi
      .spyOn(globalThis, "fetch")
      .mockResolvedValue(buildStrapiPage(1, 1, 0, []));

    await fetchAllStrapiSitemapEntries("/landings-colaboracions", {
      includeSeo: false,
    });

    const url = requestedUrl(fetchMock, 0);

    expect(url.pathname).toBe("/api/landings-colaboracions");
    expect(url.searchParams.has("populate[seo][fields][0]")).toBe(false);
  });

  it("mapea noIndex desde seo.noIndex", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValue(
      buildStrapiPage(1, 1, 3, [
        { slug: "a", updatedAt: "2026-09-01T00:00:00.000Z", seo: { noIndex: true } },
        { slug: "b", updatedAt: "2026-09-01T00:00:00.000Z", seo: { noIndex: null } },
        { slug: "c", updatedAt: "2026-09-01T00:00:00.000Z" },
      ]),
    );

    const entries = await fetchAllStrapiSitemapEntries("/noticias", {
      includeSeo: true,
    });

    expect(entries.map((entry) => entry.noIndex)).toEqual([true, false, false]);
  });

  it("lanza cuando Strapi responde con error (no lo traga)", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValue(
      new Response(JSON.stringify({ error: { message: "boom" } }), {
        status: 500,
      }),
    );

    await expect(
      fetchAllStrapiSitemapEntries("/noticias", { includeSeo: true }),
    ).rejects.toThrow(/Strapi GET failed: 500/);
  });

  it("lanza si la respuesta no trae meta.pagination", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValue(
      new Response(JSON.stringify({ data: [] }), { status: 200 }),
    );

    await expect(
      fetchAllStrapiSitemapEntries("/noticias", { includeSeo: true }),
    ).rejects.toThrow(/Respuesta inválida/);
  });

  it("corta con un error cuando supera el máximo de páginas", async () => {
    const fetchMock = vi
      .spyOn(globalThis, "fetch")
      .mockImplementation(async () =>
        buildStrapiPage(1, 999_999, 99_999_900, buildItems(1, 1)),
      );

    await expect(
      fetchAllStrapiSitemapEntries("/noticias", { includeSeo: true }),
    ).rejects.toThrow(/máximo de 500 páginas/);
    expect(fetchMock).toHaveBeenCalledTimes(500);
  });
});
