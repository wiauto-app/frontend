import { test, expect } from "@playwright/test";

import { dismissCookies } from "../helpers/dismissCookies";
import {
  collectCatalogNetwork,
  findCatalogItemByName,
  type CatalogNetworkStore,
} from "../helpers/catalogNetwork";
import { HeroSearchFormPage } from "./hero-search-form-page";

/**
 * Nombres de query param amigables que construye `buildHeroListingHref`
 * (`lib/vehicles/listing-url/build-hero-listing-href.ts`), a partir de las
 * constantes en
 * `app/(public)/vehiculos/[[...slug]]/constants/filterKeys.constants.ts`:
 *   MAKE_KEY = "marcas", MODEL_KEY = "modelos", PROVINCE_KEY = "provincias",
 *   PRICE_KEYS.UNTIL = "precio_hasta".
 * Los arrays se serializan repitiendo la clave (`FILTERS_QS_STRINGIFY_REPEAT_OPTIONS`,
 * `arrayFormat: "repeat"`), por lo que con un solo valor queda `marcas=<slug>`.
 */
const MAKE_KEY = "marcas";
const MODEL_KEY = "modelos";
const PROVINCE_KEY = "provincias";
const PRICE_UNTIL_KEY = "precio_hasta";

const LISTING_BASE_PATH = "/vehiculos";

/** Espera a que el store de red tenga el slug de un ítem buscado por nombre. */
const waitForCatalogSlug = async (
  getItems: () => CatalogNetworkStore["makes"],
  name: string,
): Promise<string> => {
  await expect
    .poll(() => Boolean(findCatalogItemByName(getItems(), name)), {
      timeout: 15_000,
      message: `No se recibió por red el catálogo con el ítem "${name}".`,
    })
    .toBe(true);

  const item = findCatalogItemByName(getItems(), name);
  if (!item) {
    throw new Error(`No se encontró el slug de "${name}" en la red.`);
  }
  return item.slug;
};

test.describe("HeroSearchForm (home)", () => {
  test("búsqueda completa: marca + modelo + provincia + precio", async ({
    page,
  }) => {
    const catalog = collectCatalogNetwork(page);
    const hero = new HeroSearchFormPage(page);

    await hero.goto();
    await dismissCookies(page);

    const { makeName, modelName } = await hero.selectMakeAndModel();
    const provinceName = await hero.selectProvince();
    await hero.selectPrice();

    const makeSlug = await waitForCatalogSlug(() => catalog.makes, makeName);
    const modelSlug = await waitForCatalogSlug(() => catalog.models, modelName);
    const provinceSlug = await waitForCatalogSlug(
      () => catalog.provinces,
      provinceName,
    );

    await hero.submit();
    await page.waitForURL((url) => url.pathname.includes(LISTING_BASE_PATH), {
      timeout: 15_000,
    });

    const result_url = new URL(page.url());
    expect(result_url.pathname).toBe(LISTING_BASE_PATH);
    expect(result_url.searchParams.getAll(MAKE_KEY)).toEqual([makeSlug]);
    expect(result_url.searchParams.getAll(MODEL_KEY)).toEqual([modelSlug]);
    expect(result_url.searchParams.getAll(PROVINCE_KEY)).toEqual([
      provinceSlug,
    ]);
    expect(result_url.searchParams.get(PRICE_UNTIL_KEY)).toMatch(/^\d+$/);
  });

  test("solo marca: navega con únicamente el filtro de marca", async ({
    page,
  }) => {
    const catalog = collectCatalogNetwork(page);
    const hero = new HeroSearchFormPage(page);

    await hero.goto();
    await dismissCookies(page);

    const { makeName } = await hero.selectMakeOnly();
    const makeSlug = await waitForCatalogSlug(() => catalog.makes, makeName);

    await hero.submit();
    await page.waitForURL((url) => url.pathname.includes(LISTING_BASE_PATH), {
      timeout: 15_000,
    });

    const result_url = new URL(page.url());
    expect(result_url.pathname).toBe(LISTING_BASE_PATH);
    expect(result_url.searchParams.getAll(MAKE_KEY)).toEqual([makeSlug]);
    expect(result_url.searchParams.has(MODEL_KEY)).toBe(false);
    expect(result_url.searchParams.has(PROVINCE_KEY)).toBe(false);
    expect(result_url.searchParams.has(PRICE_UNTIL_KEY)).toBe(false);
  });

  test("solo provincia: navega con únicamente el filtro de ubicación", async ({
    page,
  }) => {
    const catalog = collectCatalogNetwork(page);
    const hero = new HeroSearchFormPage(page);

    await hero.goto();
    await dismissCookies(page);

    const provinceName = await hero.selectProvince();
    const provinceSlug = await waitForCatalogSlug(
      () => catalog.provinces,
      provinceName,
    );

    await hero.submit();
    await page.waitForURL((url) => url.pathname.includes(LISTING_BASE_PATH), {
      timeout: 15_000,
    });

    const result_url = new URL(page.url());
    expect(result_url.pathname).toBe(LISTING_BASE_PATH);
    expect(result_url.searchParams.getAll(PROVINCE_KEY)).toEqual([
      provinceSlug,
    ]);
    expect(result_url.searchParams.has(MAKE_KEY)).toBe(false);
    expect(result_url.searchParams.has(MODEL_KEY)).toBe(false);
    expect(result_url.searchParams.has(PRICE_UNTIL_KEY)).toBe(false);
  });

  test("solo precio: navega con únicamente el filtro de precio", async ({
    page,
  }) => {
    const hero = new HeroSearchFormPage(page);

    await hero.goto();
    await dismissCookies(page);

    await hero.selectPrice();

    await hero.submit();
    await page.waitForURL((url) => url.pathname.includes(LISTING_BASE_PATH), {
      timeout: 15_000,
    });

    const result_url = new URL(page.url());
    expect(result_url.pathname).toBe(LISTING_BASE_PATH);
    expect(result_url.searchParams.get(PRICE_UNTIL_KEY)).toMatch(/^\d+$/);
    expect(result_url.searchParams.has(MAKE_KEY)).toBe(false);
    expect(result_url.searchParams.has(MODEL_KEY)).toBe(false);
    expect(result_url.searchParams.has(PROVINCE_KEY)).toBe(false);
  });

  test("búsqueda vacía: navega al listado base sin filtros", async ({
    page,
  }) => {
    const hero = new HeroSearchFormPage(page);

    await hero.goto();
    await dismissCookies(page);

    await hero.submit();
    await page.waitForURL((url) => url.pathname.includes(LISTING_BASE_PATH), {
      timeout: 15_000,
    });

    const result_url = new URL(page.url());
    expect(result_url.pathname).toBe(LISTING_BASE_PATH);
    expect(result_url.search).toBe("");
  });
});
