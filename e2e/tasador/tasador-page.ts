import { expect, type Locator, type Page } from "@playwright/test";

import { selectFirstSearchSelect } from "../helpers/selectFirstOption";

/** Contenedor `Field` cuyo label coincide exactamente con el texto dado. */
const fieldByLabel = (page: Page, label: string): Locator =>
  page
    .locator('[data-slot="field"]')
    .filter({ has: page.getByText(label, { exact: true }) })
    .first();

/**
 * Abre un Select Base UI (`components/ui/select.tsx`, usado por `Año` y
 * `Tipo de transmisión` vía `BaseSelector`) y elige la primera opción.
 *
 * No reutiliza `selectFirstRadixOption` de `../helpers/selectFirstOption`:
 * ese helper busca `[data-slot="select-item"]` en TODA la página, y Base UI
 * (`@base-ui/react/select`) deja el popup anterior montado (cerrado) en el
 * DOM tras seleccionar — con dos selects Base UI en el mismo formulario
 * (Año + Transmisión), `.first()` puede resolver al ítem ya seleccionado y
 * oculto del select anterior en vez de al que se acaba de abrir. `getByRole`
 * solo entra en el árbol de accesibilidad de los elementos visibles/abiertos,
 * así que no sufre esa colisión.
 */
const selectFirstOpenBaseUiOption = async (
  page: Page,
  label: string,
): Promise<void> => {
  const field = fieldByLabel(page, label);
  const trigger = field.locator('[data-slot="select-trigger"]');

  await expect(trigger).toBeEnabled({ timeout: 60_000 });
  await trigger.click();

  const option = page.getByRole("option").first();
  await expect(option).toBeVisible({ timeout: 60_000 });
  await option.click();
};

/** Page Object de `TasadorForm` (`/tasador` público y `/usuario/mi-tasador`). */
export class TasadorPage {
  readonly page: Page;
  readonly submitButton: Locator;
  readonly successHeading: Locator;
  readonly nameInput: Locator;
  readonly emailInput: Locator;
  readonly mileageInput: Locator;
  readonly phoneNationalInput: Locator;
  readonly useMyLocationButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.submitButton = page.getByRole("button", {
      name: "Solicitar tasación",
    });
    this.successHeading = page.getByRole("heading", {
      name: "¡Solicitud enviada!",
    });
    this.nameInput = page.getByLabel("Nombre");
    this.emailInput = page.getByLabel("Email");
    this.mileageInput = page.getByLabel("Kilometraje");
    this.phoneNationalInput = page.getByLabel("Número de teléfono");
    this.useMyLocationButton = page.getByRole("button", {
      name: /Mi ubicación/,
    });
  }

  async gotoPublic() {
    await this.page.goto("/tasador");
  }

  async gotoUserArea() {
    await this.page.goto("/usuario/mi-tasador");
  }

  async selectFirstMake() {
    await selectFirstSearchSelect(this.page, "Marca");
  }

  async selectFirstModel() {
    await selectFirstSearchSelect(this.page, "Modelo");
  }

  async selectFirstYear() {
    await selectFirstOpenBaseUiOption(this.page, "Año");
  }

  async selectFirstVersion() {
    await selectFirstSearchSelect(this.page, "Versión");
  }

  async selectTransmission() {
    await selectFirstOpenBaseUiOption(this.page, "Tipo de transmisión");
  }

  async fillMileage(mileage: number) {
    await this.mileageInput.fill(String(mileage));
  }

  async fillName(name: string) {
    await this.nameInput.fill(name);
  }

  async fillEmail(email: string) {
    await this.emailInput.fill(email);
  }

  async fillPhone(nationalNumber: string) {
    await this.phoneNationalInput.fill(nationalNumber);
  }

  /**
   * Usa el botón «Mi ubicación» de `MapInput`, que llama a
   * `navigator.geolocation.getCurrentPosition`. El contexto de test debe
   * tener permiso `geolocation` concedido (ver `test.use({ geolocation, permissions })`)
   * para no depender de clicar sobre el canvas real de Google Maps.
   */
  async useMyLocation() {
    await expect(this.useMyLocationButton).toBeEnabled({ timeout: 15_000 });
    await this.useMyLocationButton.click();
    await expect(this.useMyLocationButton).toHaveText(/Mi ubicación/, {
      timeout: 15_000,
    });
  }

  /** Rellena el vehículo del catálogo con las primeras opciones reales del backend. */
  async fillFirstCatalogVehicle() {
    await this.selectFirstMake();
    await this.selectFirstModel();
    await this.selectFirstYear();
    await this.selectFirstVersion();
  }

  async submit() {
    await this.submitButton.click();
  }

  async expectSubmitSuccess() {
    await expect(this.successHeading).toBeVisible({ timeout: 15_000 });
  }

  async expectNoSuccess() {
    await expect(this.successHeading).toHaveCount(0);
  }

  async expectFieldInvalid(label: string) {
    await expect(fieldByLabel(this.page, label)).toHaveAttribute(
      "data-invalid",
      "true",
    );
  }
}
