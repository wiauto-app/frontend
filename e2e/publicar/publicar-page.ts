import { expect, type Locator, type Page } from "@playwright/test";

import {
  selectFirstRadixOption,
  selectFirstSearchSelect,
} from "../helpers/selectFirstOption";

/**
 * Input dentro de un `Field` cuyo label coincide exactamente.
 * Necesario porque varios `ControllerInput` con `children` no ponen `id` en el control.
 */
const fieldControl = (page: Page, label: string): Locator =>
  page
    .locator('[data-slot="field"]')
    .filter({ has: page.getByText(label, { exact: true }) })
    .locator("input, textarea")
    .first();

/** Page Object de `/publicar` (publicación rápida). */
export class PublicarPage {
  readonly page: Page;
  readonly stepTypeHeading: Locator;
  readonly nextButton: Locator;
  readonly previousButton: Locator;
  readonly publishButton: Locator;
  readonly fileInput: Locator;
  readonly mileageInput: Locator;
  readonly priceInput: Locator;
  readonly powerInput: Locator;
  readonly descriptionTextarea: Locator;
  readonly phoneInput: Locator;
  readonly calculatePriceButton: Locator;
  readonly useRecommendedPriceButton: Locator;
  readonly generateDescriptionButton: Locator;
  readonly successHeading: Locator;

  constructor(page: Page) {
    this.page = page;
    this.stepTypeHeading = page.getByText("Tipo de vehículo");
    this.nextButton = page.getByRole("button", { name: "Siguiente" });
    this.previousButton = page.getByRole("button", { name: "Anterior" });
    this.publishButton = page.locator('[data-quick-vehicle-submit="true"]');
    this.fileInput = page.locator('input[type="file"]');
    this.mileageInput = fieldControl(page, "Kilometraje");
    this.priceInput = fieldControl(page, "Precio (€)");
    this.powerInput = fieldControl(page, "Potencia (CV o kW)");
    this.descriptionTextarea = page.locator("#quick-description");
    this.phoneInput = page.getByLabel("Número de teléfono");
    this.calculatePriceButton = page.getByRole("button", {
      name: "Calcular precio justo del vehículo",
    });
    this.useRecommendedPriceButton = page.getByRole("button", {
      name: /Usar precio recomendado/,
    });
    this.generateDescriptionButton = page.getByRole("button", {
      name: "Generar descripción del vehículo con IA",
    });
    this.successHeading = page.getByRole("heading", {
      name: "¡Anuncio publicado!",
    });
  }

  async goto() {
    await this.page.goto("/publicar");
  }

  vehicleTypeOption(name: string): Locator {
    return this.page.getByRole("button", { name });
  }

  async selectVehicleType(name: string) {
    await this.vehicleTypeOption(name).click();
  }

  /** Primer tipo real del catálogo (sin hardcodear «Turismo»). */
  async selectFirstVehicleType() {
    await expect(this.page.getByText("Cargando tipos…")).toBeHidden({
      timeout: 30_000,
    });

    const firstType = this.page
      .locator("button[type='button']")
      .filter({ has: this.page.locator("p.font-medium") })
      .first();

    await expect(firstType).toBeVisible({ timeout: 30_000 });
    await firstType.click();
  }

  async goNext() {
    await this.nextButton.click();
  }

  async uploadImages(paths: string[]) {
    await expect(this.fileInput).toBeAttached({ timeout: 15_000 });
    await this.fileInput.setInputFiles(paths);
  }

  /** Espera a que las fotos dejen de subirse (el CTA de publicar no está en este paso si hay paso 3). */
  async waitForGalleryReady(count = 3, timeout = 180_000) {
    const gallery = this.page.getByRole("list", {
      name: "Galería de imágenes del vehículo",
    });
    await expect(gallery.getByRole("listitem")).toHaveCount(count, {
      timeout,
    });
    await expect(this.page.getByText(/Subiendo/)).toHaveCount(0, { timeout });
  }

  /** Espera a que el CTA deje de indicar subidas pendientes. */
  async waitForImagesUploaded(timeout = 180_000) {
    await this.waitForGalleryReady(3, timeout);
    await expect(this.publishButton).toBeVisible({ timeout: 15_000 });
    await expect(this.publishButton).toHaveText(/Publicar anuncio ahora/, {
      timeout,
    });
    await expect(this.publishButton).toBeEnabled({ timeout: 30_000 });
  }

  /** Paso 3, solo perfil con suscripción: un plan, precio financiado y garantía. */
  async fillFinanceAndWarranty(financePrice = 14_000) {
    await expect(
      this.page.getByText("Financiación y garantía", { exact: false }),
    ).toBeVisible({ timeout: 15_000 });

    const firstPlan = this.page.locator("button[aria-pressed]").first();
    await expect(firstPlan).toBeVisible({ timeout: 30_000 });
    await firstPlan.click();

    const financeInput = fieldControl(this.page, "Precio de financiación (€)");
    await financeInput.scrollIntoViewIfNeeded();
    await financeInput.fill(String(financePrice));

    await selectFirstRadixOption(this.page, "Garantía (opcional)");
  }

  async logout() {
    await this.page
      .getByRole("button", { name: "Abrir menú de usuario" })
      .click();
    await this.page.getByRole("menuitem", { name: "Cerrar sesión" }).click();
    await expect(this.page.getByRole("link", { name: "Ingresar" })).toBeVisible({
      timeout: 30_000,
    });
  }

  async selectFirstMake() {
    await this.page
      .getByText("¿Qué vehículo vendes?", { exact: false })
      .scrollIntoViewIfNeeded();
    await selectFirstSearchSelect(this.page, "Marca");
  }

  async selectFirstModel() {
    await selectFirstSearchSelect(this.page, "Modelo");
  }

  async selectFirstVersion() {
    await selectFirstSearchSelect(this.page, "Versión");
  }

  /** Espera a que desaparezcan skeletons y la potencia tenga valor. */
  async waitForSpecsFilled(timeout = 120_000) {
    await this.page
      .getByText("Ficha técnica", { exact: true })
      .scrollIntoViewIfNeeded();

    await expect(this.powerInput).toBeVisible({ timeout });
    await expect
      .poll(
        async () => {
          const value = await this.powerInput.inputValue();
          return Number(value) > 0;
        },
        { timeout },
      )
      .toBe(true);

    const tractionTrigger = this.page
      .locator('[data-slot="field"]')
      .filter({ has: this.page.getByText("Tracción", { exact: true }) })
      .first()
      .locator('[data-slot="select-trigger"]');
    const tractionLabel = (await tractionTrigger.innerText()).trim();

    if (tractionLabel === "Tracción" || tractionLabel === "Cargando...") {
      await selectFirstRadixOption(this.page, "Tracción");
    }
  }

  async fillMileage(mileage: number) {
    await this.mileageInput.scrollIntoViewIfNeeded();
    await this.mileageInput.fill(String(mileage));
  }

  async fillPrice(price: number) {
    await this.priceInput.scrollIntoViewIfNeeded();
    await this.priceInput.fill(String(price));
  }

  async fillPhone(nationalNumber: string) {
    await this.phoneInput.scrollIntoViewIfNeeded();
    await this.phoneInput.fill(nationalNumber);
  }

  /**
   * Calcula precio con IA; si aparece «Usar precio recomendado» lo aplica.
   * Si la IA no responde, rellena el fallback.
   */
  async calculatePriceOrFallback(fallbackPrice = 15_000) {
    await this.calculatePriceButton.scrollIntoViewIfNeeded();
    await expect(this.calculatePriceButton).toBeEnabled({ timeout: 30_000 });
    await this.calculatePriceButton.click();

    const useRecommended = this.useRecommendedPriceButton;
    const appeared = await useRecommended
      .waitFor({ state: "visible", timeout: 120_000 })
      .then(() => true)
      .catch(() => false);

    if (appeared) {
      await useRecommended.click();
      return;
    }

    await this.fillPrice(fallbackPrice);
  }

  async generateDescription() {
    await this.generateDescriptionButton.scrollIntoViewIfNeeded();
    await expect(this.generateDescriptionButton).toBeEnabled({
      timeout: 60_000,
    });
    await this.generateDescriptionButton.click();

    await expect
      .poll(
        async () => {
          const value = await this.descriptionTextarea.inputValue();
          return value.trim().length > 0;
        },
        {
          timeout: 120_000,
          message:
            "La descripción generada por IA quedó vacía (¿error o rate limit?).",
        },
      )
      .toBe(true);

    const description = await this.descriptionTextarea.inputValue();
    if (description.length > 1000) {
      await this.descriptionTextarea.fill(description.slice(0, 1000));
    }
  }

  async publishNow() {
    await this.publishButton.scrollIntoViewIfNeeded();
    await expect(this.publishButton).toBeEnabled({ timeout: 30_000 });
    await this.publishButton.click();
  }

  async expectPublishSuccess(): Promise<string> {
    const errorToast = this.page.locator('[data-sonner-toast][data-type="error"]');

    await expect
      .poll(
        async () => {
          if (/\/publicar\/exito/.test(this.page.url())) {
            return "ok";
          }

          if ((await errorToast.count()) > 0) {
            return "error";
          }

          return "";
        },
        { timeout: 120_000 },
      )
      .not.toBe("");

    if (!/\/publicar\/exito/.test(this.page.url())) {
      const message = (await errorToast.first().innerText()).trim();
      throw new Error(
        `La publicación se quedó en ${this.page.url()}: ${message}`,
      );
    }

    await expect(this.page).toHaveURL(/\/publicar\/exito/);
    await expect(this.successHeading).toBeVisible({ timeout: 30_000 });

    const vehicleId = new URL(this.page.url()).searchParams.get("id");
    expect(vehicleId, "La URL de éxito debe incluir el id del anuncio").toBeTruthy();
    return vehicleId!;
  }

  /** Menú de usuario → Mis anuncios → elimina el anuncio recién creado. */
  async deleteListingFromMyAds(vehicleId: string) {
    await this.page
      .getByRole("button", { name: "Abrir menú de usuario" })
      .click();
    await this.page.getByRole("link", { name: "Mis anuncios" }).click();

    await expect(this.page).toHaveURL(/\/usuario\/mis-anuncios/, {
      timeout: 30_000,
    });

    const card = this.page.locator('[data-slot="card"]').filter({
      has: this.page.locator(`a[href="/vehiculo/${vehicleId}"]`),
    });

    await expect(card).toBeVisible({ timeout: 30_000 });
    await card.getByRole("button", { name: "Más acciones del anuncio" }).click();
    await this.page.getByRole("menuitem", { name: "Eliminar", exact: true }).click();

    const dialog = this.page.getByRole("alertdialog");
    await expect(dialog.getByText("Eliminar anuncio")).toBeVisible();
    await dialog.getByRole("button", { name: "Eliminar", exact: true }).click();

    await expect(this.page.getByText("Anuncio eliminado correctamente")).toBeVisible({
      timeout: 30_000,
    });
    await expect(card).toHaveCount(0, { timeout: 30_000 });
  }
}
