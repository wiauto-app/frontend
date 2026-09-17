import { expect, type Locator, type Page } from "@playwright/test";

const MAKE_MODEL_LABEL = "Seleccionar marca y modelo";
const LOCATION_LABEL = "Seleccionar ubicación";
const PRICE_LABEL = "Seleccionar precio hasta";
const SEARCH_BUTTON_LABEL = "Buscar coches";
const ALL_MODELS_LABEL = "Todos los modelos";

const MAX_CANDIDATES = 5;

export interface SelectedMake {
  makeName: string;
}

export interface SelectedMakeAndModel {
  makeName: string;
  modelName: string;
}

/** Page Object del formulario de búsqueda del hero (home). */
export class HeroSearchFormPage {
  readonly page: Page;
  readonly makeModelTrigger: Locator;
  readonly locationTrigger: Locator;
  readonly priceTrigger: Locator;
  readonly searchButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.makeModelTrigger = page.getByRole("button", {
      name: MAKE_MODEL_LABEL,
    });
    this.locationTrigger = page.getByRole("button", { name: LOCATION_LABEL });
    this.priceTrigger = page.getByRole("combobox", { name: PRICE_LABEL });
    this.searchButton = page.getByRole("button", { name: SEARCH_BUTTON_LABEL });
  }

  async goto() {
    await this.page.goto("/");
  }

  async submit() {
    await this.searchButton.click();
  }

  /**
   * Último popover (portal) abierto. Base UI monta el `PopoverContent` en un
   * portal al final del `<body>`, así que basta con tomar el último para
   * referirnos al que acabamos de abrir.
   */
  private lastOpenPopoverContent(): Locator {
    return this.page.locator('[data-slot="popover-content"]').last();
  }

  /** Filas de marca dentro del popover marca/modelo (ya abierto). */
  private makeRows(): Locator {
    return this.lastOpenPopoverContent().locator("button[aria-expanded]");
  }

  /**
   * `CustomCheckbox` renderiza un `<input type="checkbox">` visualmente oculto
   * (`sr-only`) envuelto en un `<label>`; el texto visible vive en el `<label>`,
   * no en el propio `<input>` (que no tiene `innerText`). Por eso resolvemos el
   * nombre a partir del `<label>` ancestro en vez de leer el checkbox.
   */
  private async checkboxLabelText(checkbox: Locator): Promise<string> {
    const label = checkbox.locator("xpath=ancestor::label[1]");
    return (await label.innerText()).trim();
  }

  /**
   * `CustomCheckbox` oculta el `<input>` real (`sr-only`) detrás de un
   * `<span>` visual que ocupa su lugar en pantalla, así que un `.check()`
   * nativo sobre el input choca con ese `<span>` ("intercepts pointer
   * events") y nunca resuelve. Un usuario real hace click en el `<label>`
   * que envuelve a ambos, lo cual dispara el input asociado igual —
   * replicamos eso en vez de forzar el click.
   */
  private async checkViaLabel(checkbox: Locator): Promise<void> {
    const label = checkbox.locator("xpath=ancestor::label[1]");
    if (await checkbox.isChecked()) return;
    await label.click();
    await expect(checkbox).toBeChecked();
  }

  /**
   * Selecciona SOLO una marca (sin modelo) usando el checkbox
   * "Todos los modelos", que en el componente equivale a filtrar por marca
   * completa sin restringir por modelo.
   */
  async selectMakeOnly(): Promise<SelectedMake> {
    await this.makeModelTrigger.click();

    const popover = this.lastOpenPopoverContent();
    const rows = this.makeRows();
    await expect(rows.first()).toBeVisible({ timeout: 30_000 });

    const row = rows.first();
    const makeName = (await row.innerText()).trim();
    await row.click();

    const allModelsCheckbox = popover.getByRole("checkbox", {
      name: ALL_MODELS_LABEL,
    });
    await expect(allModelsCheckbox).toBeVisible({ timeout: 15_000 });
    await this.checkViaLabel(allModelsCheckbox);

    await this.closeMakeModelPopover();

    return { makeName };
  }

  /**
   * Selecciona una marca (de las primeras `MAX_CANDIDATES` disponibles) y,
   * dentro de ella, un modelo concreto (de los primeros disponibles para esa
   * marca). Si la primera marca candidata no tiene modelos, prueba con la
   * siguiente — nunca asumimos un nombre fijo.
   */
  async selectMakeAndModel(): Promise<SelectedMakeAndModel> {
    await this.makeModelTrigger.click();

    const popover = this.lastOpenPopoverContent();
    const rows = this.makeRows();
    await expect(rows.first()).toBeVisible({ timeout: 30_000 });

    const candidate_count = Math.min(await rows.count(), MAX_CANDIDATES);

    for (let index = 0; index < candidate_count; index += 1) {
      const row = this.makeRows().nth(index);
      const makeName = (await row.innerText()).trim();

      await row.click();

      // `MakeModels` siempre renderiza "Todos los modelos" primero (checkbox
      // índice 0) y, si los hay, los modelos reales a continuación (índice >= 1).
      const noModelsText = popover.getByText("No hay modelos disponibles");
      const checkboxesInRow = popover.getByRole("checkbox");
      const firstModelCheckbox = checkboxesInRow.nth(1);

      await Promise.race([
        firstModelCheckbox
          .waitFor({ state: "visible", timeout: 20_000 })
          .catch(() => undefined),
        noModelsText
          .waitFor({ state: "visible", timeout: 20_000 })
          .catch(() => undefined),
      ]);

      const model_count = Math.max((await checkboxesInRow.count()) - 1, 0);

      if (model_count > 0) {
        const modelName = await this.checkboxLabelText(firstModelCheckbox);
        await this.checkViaLabel(firstModelCheckbox);
        await this.closeMakeModelPopover();
        return { makeName, modelName };
      }

      // Esta marca no tiene modelos disponibles: colapsamos la fila y probamos la siguiente.
      await row.click();
    }

    throw new Error(
      `Ninguna de las primeras ${candidate_count} marcas tiene modelos disponibles.`,
    );
  }

  private async closeMakeModelPopover() {
    const applyButton = this.lastOpenPopoverContent().getByRole("button", {
      name: "Aplicar",
    });
    if (await applyButton.isVisible().catch(() => false)) {
      await applyButton.click();
    } else {
      await this.page.keyboard.press("Escape");
    }
  }

  /** Selecciona la primera provincia disponible. */
  async selectProvince(): Promise<string> {
    await this.locationTrigger.click();

    const popover = this.lastOpenPopoverContent();
    const provinceCheckboxes = popover.getByRole("checkbox");
    await expect(provinceCheckboxes.first()).toBeVisible({ timeout: 30_000 });

    const provinceName = await this.checkboxLabelText(provinceCheckboxes.first());
    await this.checkViaLabel(provinceCheckboxes.first());

    await this.page.keyboard.press("Escape");

    return provinceName;
  }

  /** Selecciona el primer precio disponible en el select (lista estática de rangos). */
  async selectPrice(): Promise<string> {
    await this.priceTrigger.click();

    const listbox = this.page.locator('[data-slot="select-content"]').last();
    const options = listbox.getByRole("option");
    await expect(options.first()).toBeVisible({ timeout: 15_000 });

    const label = (await options.first().innerText()).trim();
    await options.first().click();

    return label;
  }
}
