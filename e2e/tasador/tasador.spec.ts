import { test, expect, type Page } from "@playwright/test";

import { dismissCookies } from "../helpers/dismissCookies";
import { TasadorPage } from "./tasador-page";

/** Ubicación fija para el permiso `geolocation` (evita depender del canvas real de Google Maps). */
const E2E_GEOLOCATION = { latitude: 41.3874, longitude: 2.1686 };

const TEST_CONTACT = {
  name: "Tasador E2E",
  email: "tasador.e2e@example.com",
  phone: "612345678",
};

const ERROR_MESSAGE = "No se pudo procesar la tasación (mock E2E)";

/** Mockea `POST /v1/appraisal-requests` (público) y `/v1/appraisal-requests/authenticated`. */
async function mockAppraisalRequest(
  page: Page,
  outcome: { ok: true } | { ok: false; message: string },
) {
  await page.route("**/v1/appraisal-requests**", async (route) => {
    if (route.request().method() !== "POST") {
      await route.continue();
      return;
    }

    if (outcome.ok) {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          ok: true,
          message: "OK",
          data: { id: "11111111-1111-1111-1111-111111111111" },
        }),
      });
      return;
    }

    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({
        ok: false,
        message: outcome.message,
        data: null,
      }),
    });
  });
}

test.describe("TasadorForm (/tasador)", () => {
  test.describe("variante pública", () => {
    // Contexto anónimo explícito: `/tasador` no exige sesión y no debe depender
    // del `storageState` autenticado que usa por defecto el proyecto `chromium`.
    test.use({
      storageState: { cookies: [], origins: [] },
      geolocation: E2E_GEOLOCATION,
      permissions: ["geolocation"],
    });

    test("envía la solicitud y muestra «¡Solicitud enviada!»", async ({
      page,
    }) => {
      test.setTimeout(90_000);

      await mockAppraisalRequest(page, { ok: true });

      const tasador = new TasadorPage(page);
      await tasador.gotoPublic();
      await dismissCookies(page);

      await tasador.fillFirstCatalogVehicle();
      await tasador.selectTransmission();
      await tasador.fillMileage(85_000);
      await tasador.useMyLocation();

      await tasador.fillName(TEST_CONTACT.name);
      await tasador.fillEmail(TEST_CONTACT.email);
      await tasador.fillPhone(TEST_CONTACT.phone);

      await tasador.submit();
      await tasador.expectSubmitSuccess();
    });

    test("no envía y muestra errores si faltan campos obligatorios", async ({
      page,
    }) => {
      let requestCreated = false;
      await page.route("**/v1/appraisal-requests**", async (route) => {
        requestCreated = true;
        await route.continue();
      });

      const tasador = new TasadorPage(page);
      await tasador.gotoPublic();
      await dismissCookies(page);

      await tasador.submit();

      await expect(page.getByText("El nombre es obligatorio.")).toBeVisible();
      await expect(
        page.getByText("Introduce un correo electrónico válido."),
      ).toBeVisible();
      await expect(
        page.getByText("El teléfono es obligatorio."),
      ).toBeVisible();

      await tasador.expectFieldInvalid("Marca");
      await tasador.expectFieldInvalid("Modelo");
      await tasador.expectFieldInvalid("Año");
      await tasador.expectFieldInvalid("Versión");

      await tasador.expectNoSuccess();
      expect(requestCreated).toBe(false);
    });

    test("muestra un toast de error cuando el backend rechaza la solicitud", async ({
      page,
    }) => {
      test.setTimeout(90_000);

      await mockAppraisalRequest(page, { ok: false, message: ERROR_MESSAGE });

      const tasador = new TasadorPage(page);
      await tasador.gotoPublic();
      await dismissCookies(page);

      await tasador.fillFirstCatalogVehicle();
      await tasador.selectTransmission();
      await tasador.fillMileage(85_000);
      await tasador.useMyLocation();

      await tasador.fillName(TEST_CONTACT.name);
      await tasador.fillEmail(TEST_CONTACT.email);
      await tasador.fillPhone(TEST_CONTACT.phone);

      await tasador.submit();

      await expect(page.getByText(ERROR_MESSAGE)).toBeVisible({
        timeout: 15_000,
      });
      await tasador.expectNoSuccess();
    });
  });

  test.describe("variante autenticada (/usuario/mi-tasador)", () => {
    // Usa el `storageState` autenticado por defecto del proyecto `chromium`
    // (ver `e2e/auth.setup.ts`); sin credenciales de `.env.e2e` este describe
    // no puede validar el precargado real del usuario.
    test("precarga nombre, email y teléfono del usuario autenticado", async ({
      page,
    }) => {
      test.skip(
        !process.env.E2E_USER_EMAIL,
        "Requiere E2E_USER_EMAIL/E2E_USER_PASSWORD en .env.e2e para iniciar sesión (ver auth.setup.ts).",
      );

      const tasador = new TasadorPage(page);
      await tasador.gotoUserArea();
      await dismissCookies(page);

      await expect(tasador.emailInput).toHaveValue(process.env.E2E_USER_EMAIL!, {
        timeout: 15_000,
      });

      await expect
        .poll(async () => (await tasador.nameInput.inputValue()).trim(), {
          timeout: 15_000,
          message: "El campo Nombre debería precargarse desde el usuario autenticado.",
        })
        .not.toBe("");
    });
  });
});
