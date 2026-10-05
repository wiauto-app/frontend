import { test, expect, type Page } from "@playwright/test";

import { dismissCookies } from "../helpers/dismissCookies";
import { TasadorPage } from "./tasador-page";

const APPRAISAL_ID = "11111111-1111-1111-1111-111111111111";

const TEST_CONTACT = {
  name: "Tasador E2E",
  email: "tasador.e2e@example.com",
  phone: "612345678",
};

const APPRAISAL_DETAIL = {
  id: APPRAISAL_ID,
  status: "estimated",
  created_at: "2026-10-05T12:00:00.000Z",
  offers_requested_at: null,
  offers_expire_at: null,
  accepted_offer_id: null,
  vehicle: {
    make_id: 1,
    model_id: 1,
    year_id: 1,
    version_id: 1,
    fuel_type_id: 1,
    make_name: "SEAT",
    model_name: "Ateca",
    year: 2020,
    version_name: "2.0 TDI 150 CV Style",
    fuel_type_name: "Diésel",
    transmission_type: "manual",
    mileage: 92_000,
    power: 150,
    vehicle_label: "SEAT Ateca (2020)",
  },
  estimate: {
    recommended_price: 19_000,
    range_min: 18_200,
    range_max: 19_800,
    explanation: "Precio en línea con el mercado español para este kilometraje.",
    confidence: "medium",
    source: "ai",
  },
  contact: { name: TEST_CONTACT.name, email: TEST_CONTACT.email, phone_code: "+34", phone: TEST_CONTACT.phone },
  offers: [],
};

const json = (data: unknown) => ({
  status: 200,
  contentType: "application/json",
  body: JSON.stringify({ ok: true, message: "OK", data }),
});

/** Mockea la tasación IA y la solicitud de ofertas (no consume cuota de IA en E2E). */
async function mockAppraisalApi(page: Page) {
  await page.route("**/v1/appraisals/estimate", (route) =>
    route.fulfill({ ...json(APPRAISAL_DETAIL), status: 201 }),
  );
  await page.route(`**/v1/appraisals/${APPRAISAL_ID}/request-offers`, (route) =>
    route.fulfill(json({ ...APPRAISAL_DETAIL, status: "open_for_offers" })),
  );
}

async function fillValuationForm(tasador: TasadorPage) {
  await tasador.fillFirstCatalogVehicle();
  await tasador.fillMileage(92_000);
  await tasador.fillName(TEST_CONTACT.name);
  await tasador.fillEmail(TEST_CONTACT.email);
  await tasador.fillPhone(TEST_CONTACT.phone);
}

test.describe("Tasador con IA (/tasador)", () => {
  test.describe("sin sesión", () => {
    // `/tasador` es pública: la landing se ve sin sesión y el login se pide al tasar.
    test.use({ storageState: { cookies: [], origins: [] } });

    test("no envía y marca los campos obligatorios vacíos", async ({ page }) => {
      let estimateCalled = false;
      await page.route("**/v1/appraisals/estimate", async (route) => {
        estimateCalled = true;
        await route.continue();
      });

      const tasador = new TasadorPage(page);
      await tasador.gotoPublic();
      await dismissCookies(page);
      await tasador.submit();

      await expect(page.getByText("Selecciona la marca")).toBeVisible();
      await expect(page.getByText("El nombre debe tener al menos 2 caracteres")).toBeVisible();
      await expect(page.getByText("Email inválido")).toBeVisible();
      expect(estimateCalled).toBe(false);
    });

    test("al tasar sin sesión abre el inicio de sesión y no llama a la IA", async ({ page }) => {
      test.setTimeout(90_000);

      let estimateCalled = false;
      await page.route("**/v1/appraisals/estimate", async (route) => {
        estimateCalled = true;
        await route.continue();
      });

      const tasador = new TasadorPage(page);
      await tasador.gotoPublic();
      await dismissCookies(page);
      await fillValuationForm(tasador);
      await tasador.submit();

      await expect(tasador.signInDialog).toBeVisible({ timeout: 15_000 });
      expect(estimateCalled).toBe(false);
    });
  });

  test.describe("con sesión", () => {
    test("tasa el coche, muestra el resultado y pide ofertas", async ({ page }) => {
      test.skip(
        !process.env.E2E_USER_EMAIL,
        "Requiere E2E_USER_EMAIL/E2E_USER_PASSWORD en .env.e2e (ver auth.setup.ts).",
      );
      test.setTimeout(90_000);

      await mockAppraisalApi(page);

      const tasador = new TasadorPage(page);
      await tasador.gotoPublic();
      await dismissCookies(page);
      await fillValuationForm(tasador);
      await tasador.submit();

      await tasador.expectResult();
      await expect(page.getByText("18.200 € – 19.800 €").first()).toBeVisible();
      await expect(page.getByRole("link", { name: /Publicar ahora/ })).toHaveAttribute(
        "href",
        `/publicar?tasacion=${APPRAISAL_ID}`,
      );

      await page.getByRole("button", { name: /Quiero recibir ofertas/ }).click();
      await expect(page.getByRole("heading", { name: "¡Solicitud enviada!" })).toBeVisible();
    });

    test("lista las tasaciones del usuario en /usuario/mi-tasador", async ({ page }) => {
      test.skip(
        !process.env.E2E_USER_EMAIL,
        "Requiere E2E_USER_EMAIL/E2E_USER_PASSWORD en .env.e2e (ver auth.setup.ts).",
      );

      await page.route("**/v1/appraisals/me", (route) =>
        route.fulfill(
          json([
            {
              id: APPRAISAL_ID,
              status: "open_for_offers",
              created_at: APPRAISAL_DETAIL.created_at,
              offers_expire_at: "2026-10-12T12:00:00.000Z",
              vehicle: APPRAISAL_DETAIL.vehicle,
              estimate: APPRAISAL_DETAIL.estimate,
              offers_count: 2,
              best_offer_amount: 18_900,
            },
          ]),
        ),
      );

      const tasador = new TasadorPage(page);
      await tasador.gotoUserArea();
      await dismissCookies(page);

      const item = page.getByRole("link", { name: /SEAT Ateca \(2020\)/ });
      await expect(item).toBeVisible({ timeout: 15_000 });
      await expect(item).toHaveAttribute("href", `/usuario/mi-tasador/${APPRAISAL_ID}`);
      await expect(item.getByText(/2 ofertas/)).toBeVisible();
    });
  });
});
