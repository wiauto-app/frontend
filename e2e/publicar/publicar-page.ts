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

  /** Espera a que el CTA deje de indicar subidas pendientes. */
  async waitForImagesUploaded(timeout = 180_000) {
    await expect(this.publishButton).toBeVisible({ timeout: 15_000 });
    await expect(this.publishButton).toHaveText(/Publicar anuncio ahora/, {
      timeout,
    });
    await expect(this.publishButton).toBeEnabled({ timeout: 30_000 });
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
    await selectFirstRadixOption(this.page, "Versión");
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
  }

  async publishNow() {
    await this.publishButton.scrollIntoViewIfNeeded();
    await expect(this.publishButton).toBeEnabled({ timeout: 30_000 });
    await this.publishButton.click();
  }

  async expectPublishSuccess() {
    await expect(this.page).toHaveURL(/\/publicar\/exito/, {
      timeout: 120_000,
    });
    await expect(this.successHeading).toBeVisible({ timeout: 30_000 });
  }
}
