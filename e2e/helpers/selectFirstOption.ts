import { expect, type Locator, type Page } from "@playwright/test";

/** Contenedor `Field` cuyo label coincide exactamente con el texto dado. */
const fieldByLabel = (page: Page, label: string): Locator =>
  page
    .locator('[data-slot="field"]')
    .filter({ has: page.getByText(label, { exact: true }) })
    .first();

/**
 * Abre un SearchSelect (Marca / Modelo) y elige la primera opción de la lista.
 */
export const selectFirstSearchSelect = async (
  page: Page,
  label: string,
): Promise<void> => {
  const field = fieldByLabel(page, label);
  const trigger = field.getByRole("combobox");

  await expect(trigger).toBeEnabled({ timeout: 30_000 });
  await trigger.click();

  const searching = page.getByText("Buscando...");
  if (await searching.isVisible().catch(() => false)) {
    await expect(searching).toBeHidden({ timeout: 60_000 });
  }

  const option = page.locator("[cmdk-item]").first();
  await expect(option).toBeVisible({ timeout: 60_000 });
  await option.click();
};

/**
 * Abre un Select Radix/Base UI (Versión, Transmisión, Tracción) y elige la primera opción.
 */
export const selectFirstRadixOption = async (
  page: Page,
  label: string,
): Promise<void> => {
  const field = fieldByLabel(page, label);
  const trigger = field.locator('[data-slot="select-trigger"]');

  await expect(trigger).toBeEnabled({ timeout: 60_000 });
  await trigger.click();

  const option = page.locator('[data-slot="select-item"]').first();
  await expect(option).toBeVisible({ timeout: 60_000 });
  await option.click();
};
