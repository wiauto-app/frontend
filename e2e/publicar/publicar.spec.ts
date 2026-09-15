import { test, expect } from "@playwright/test";

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

  test("flujo completo: publica anuncio real hasta éxito", async ({ page }) => {
    test.setTimeout(300_000);

    const imagePaths = getE2eTestImagePaths(3);
    const publicar = new PublicarPage(page);

    await publicar.goto();
    await dismissCookies(page);

    await expect(publicar.stepTypeHeading).toBeVisible({ timeout: 30_000 });
    await publicar.selectFirstVehicleType();
    await publicar.goNext();

    await expect(
      page.getByText("¿Qué vehículo vendes?", { exact: false }),
    ).toBeVisible({ timeout: 30_000 });

    await publicar.uploadImages(imagePaths);
    await publicar.waitForImagesUploaded();

    await publicar.selectFirstMake();
    await publicar.selectFirstModel();
    await publicar.selectFirstVersion();
    await publicar.waitForSpecsFilled();

    await publicar.fillMileage(45_000);
    await publicar.calculatePriceOrFallback(15_000);
    await publicar.generateDescription();
    await publicar.fillPhone("983708845");

    await publicar.publishNow();
    await publicar.expectPublishSuccess();
  });
});
