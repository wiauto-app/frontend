import { test as setup, expect } from "@playwright/test";
import path from "node:path";

import { dismissCookies } from "./helpers/dismissCookies";

const authFile = path.join(__dirname, "../playwright/.auth/user.json");

setup("iniciar sesión", async ({ page }) => {
  const email = process.env.E2E_USER_EMAIL;
  const password = process.env.E2E_USER_PASSWORD;

  if (!email || !password) {
    throw new Error(
      "Faltan E2E_USER_EMAIL / E2E_USER_PASSWORD. Crea `.env.e2e` (ver `.env.e2e.example`).",
    );
  }

  await page.goto("/iniciar-sesion?redirect=/publicar");
  await dismissCookies(page);

  await page.getByLabel("Email *").fill(email);
  await page.getByLabel("Contraseña *").fill(password);
  await page.getByRole("button", { name: "Iniciar Sesión" }).click();

  await expect(page).toHaveURL(/\/publicar/, { timeout: 30_000 });
  await expect(page.getByText("Tipo de vehículo")).toBeVisible({
    timeout: 30_000,
  });

  await page.context().storageState({ path: authFile });
});
