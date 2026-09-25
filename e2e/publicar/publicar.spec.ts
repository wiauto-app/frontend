import { test, expect, type Page } from "@playwright/test";

import { dismissCookies } from "../helpers/dismissCookies";
import { getE2eTestImagePaths } from "../helpers/testImages";
import { PublicarPage } from "./publicar-page";

const MOCK_VEHICLE_TYPE_ID = "550e8400-e29b-41d4-a716-446655440000";

/** Envelope típico Nest + `PaginatedResult` que consume `vehicleTypesService.findAll`. */
async function mockVehicleTypes(page: import("@playwright/test").Page) {
  await page.route("**/v1/vehicle-types**", async (route) => {
    if (route.request().method() !== "GET") {
      await route.continue();
      return;
    }

    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({
        ok: true,
        message: "OK",
        data: {
          data: [
            {
              id: MOCK_VEHICLE_TYPE_ID,
              name: "Turismo",
              slug: "turismo",
            },
          ],
          total: 1,
          page: 1,
          limit: 100,
        },
      }),
    });
  });
}

test.describe("Publicación rápida (/publicar)", () => {
  test.describe("smoke (mock catálogo)", () => {
    test.beforeEach(async ({ page }) => {
      await mockVehicleTypes(page);
    });

    test("smoke: carga el wizard y muestra el paso Tipo de vehículo", async ({
      page,
    }) => {
      const publicar = new PublicarPage(page);

      await publicar.goto();
      await dismissCookies(page);

      await expect(publicar.stepTypeHeading).toBeVisible({ timeout: 15_000 });
      await expect(publicar.nextButton).toBeVisible();
      await expect(publicar.vehicleTypeOption("Turismo")).toBeVisible();
    });

    test("simulación: elige tipo y avanza al paso de ficha", async ({
      page,
    }) => {
      const publicar = new PublicarPage(page);

      await publicar.goto();
      await dismissCookies(page);

      await expect(publicar.vehicleTypeOption("Turismo")).toBeVisible({
        timeout: 15_000,
      });
      await publicar.selectVehicleType("Turismo");
      await publicar.goNext();

      await expect(
        page.getByText("¿Qué vehículo vendes?", { exact: false }),
      ).toBeVisible({ timeout: 15_000 });
      await expect(publicar.previousButton).toBeVisible();
    });
  });

  test("flujo completo: publica con perfil personal y luego profesional", async ({
    page,
  }) => {
    test.setTimeout(600_000);

    const email = process.env.E2E_PRO_USER_EMAIL;
    const password = process.env.E2E_PRO_USER_PASSWORD;

    test.skip(
      !email || !password,
      "Requiere E2E_PRO_USER_EMAIL / E2E_PRO_USER_PASSWORD en .env.e2e.",
    );

    await publishRealListing(page);
    await new PublicarPage(page).logout();

    await page.goto("/iniciar-sesion?redirect=/publicar");
    await dismissCookies(page);
    await page.getByLabel("Email *").fill(email!);
    await page.getByLabel("Contraseña *").fill(password!);
    await page.getByRole("button", { name: "Iniciar Sesión" }).click();
    await page.waitForURL((url) => url.pathname === "/publicar", {
      timeout: 30_000,
    });

    await publishRealListing(page, { includesFinanceStep: true });
  });
});

async function publishRealListing(
  page: Page,
  options: { includesFinanceStep?: boolean } = {},
) {
  const imagePaths = getE2eTestImagePaths(3);
  const publicar = new PublicarPage(page);

  if (new URL(page.url()).pathname !== "/publicar") {
    await publicar.goto();
  }
  await dismissCookies(page);

  await expect(publicar.stepTypeHeading).toBeVisible({ timeout: 30_000 });
  await publicar.selectFirstVehicleType();
  await publicar.goNext();

  await expect(
    page.getByText("¿Qué vehículo vendes?", { exact: false }),
  ).toBeVisible({ timeout: 30_000 });

  await publicar.uploadImages(imagePaths);
  if (options.includesFinanceStep) {
    await publicar.waitForGalleryReady();
  } else {
    await publicar.waitForImagesUploaded();
  }

  await publicar.selectFirstMake();
  await publicar.selectFirstModel();
  await publicar.selectFirstVersion();
  await publicar.waitForSpecsFilled();

  await publicar.fillMileage(45_000);
  await publicar.calculatePriceOrFallback(15_000);
  await publicar.generateDescription();
  await publicar.fillPhone("983708845");

  if (options.includesFinanceStep) {
    await publicar.goNext();
    await publicar.fillFinanceAndWarranty();
  }

  await publicar.publishNow();
  const vehicleId = await publicar.expectPublishSuccess();
  await publicar.deleteListingFromMyAds(vehicleId);
}
