import { test, expect } from "@playwright/test";

import { dismissCookies } from "../helpers/dismissCookies";
import {
  collectCatalogNetwork,
  findCatalogItemByName,
  type CatalogNetworkStore,
} from "../helpers/catalogNetwork";
import { HeroSearchFormPage } from "./hero-search-form-page";

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

const expectListingPathSegment = (
  pathname: string,
  segment: string,
): void => {
  expect(pathname.startsWith(LISTING_BASE_PATH)).toBe(true);
  expect(pathname).toContain(segment);
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
    expectListingPathSegment(result_url.pathname, `marca-${makeSlug}`);
    expectListingPathSegment(result_url.pathname, `modelo-${modelSlug}`);
    expectListingPathSegment(result_url.pathname, `provincia-${provinceSlug}`);
    expectListingPathSegment(result_url.pathname, "precio-hasta-");
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
    expect(result_url.pathname).toBe(`${LISTING_BASE_PATH}/marca-${makeSlug}`);
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
    expect(result_url.pathname).toBe(
      `${LISTING_BASE_PATH}/provincia-${provinceSlug}`,
    );
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
    expectListingPathSegment(result_url.pathname, "precio-hasta-");
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
