import { expect, type Page } from "@playwright/test";

/**
 * Cierra el aviso de cookies si aparece.
 * El banner solo se muestra tras hidratar el cliente (`hasDecided` empieza en true),
 * así que hay que esperar un momento antes de decidir que no hay banner.
 */
export const dismissCookies = async (page: Page) => {
  const bannerTitle = page.getByRole("heading", { name: "Aviso de cookies" });
  const rejectButton = page.getByRole("button", { name: "Rechazar todas" });
  const acceptButton = page.getByRole("button", { name: "Aceptar todas" });

  const bannerVisible = await bannerTitle
    .waitFor({ state: "visible", timeout: 10_000 })
    .then(() => true)
    .catch(() => false);

  if (!bannerVisible) {
    return;
  }

  // Preferir aceptar (menos fricción con Maps / analytics en E2E).
  if (await acceptButton.isVisible().catch(() => false)) {
    await acceptButton.click();
  } else {
    await rejectButton.click();
  }

  await expect(bannerTitle).toBeHidden({ timeout: 10_000 });
  await expect(page.locator('[data-slot="sheet-portal"]')).toHaveCount(0, {
    timeout: 10_000,
  });
};
