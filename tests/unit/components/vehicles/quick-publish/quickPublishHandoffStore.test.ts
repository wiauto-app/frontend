// @vitest-environment jsdom
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import {
  LEGACY_QUICK_PUBLISH_DRAFT_STORAGE_KEY,
  QUICK_PUBLISH_HANDOFF_TTL_MS,
  isQuickPublishHandoffValid,
  removeLegacyQuickPublishDraft,
  useQuickPublishHandoffStore,
} from "@/components/vehicles/quick-publish/stores/quickPublishHandoffStore";

describe("quickPublishHandoffStore", () => {
  beforeEach(() => {
    useQuickPublishHandoffStore.getState().clearHandoff();
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("es válido con valores y publicación pendiente dentro del TTL", () => {
    const now = Date.now();

    expect(
      isQuickPublishHandoffValid(
        { values: { description: "Coche" }, pendingPublishAt: now - 1000 },
        now,
      ),
    ).toBe(true);
  });

  it("caduca pasado el TTL de una hora", () => {
    const now = Date.now();

    expect(
      isQuickPublishHandoffValid(
        {
          values: { description: "Coche" },
          pendingPublishAt: now - QUICK_PUBLISH_HANDOFF_TTL_MS - 1,
        },
        now,
      ),
    ).toBe(false);
  });

  it("no es válido sin valores o sin publicación pendiente", () => {
    expect(
      isQuickPublishHandoffValid({ values: null, pendingPublishAt: Date.now() }),
    ).toBe(false);
    expect(
      isQuickPublishHandoffValid({
        values: { description: "Coche" },
        pendingPublishAt: null,
      }),
    ).toBe(false);
  });

  it("guarda el snapshot y marca la publicación pendiente", () => {
    const store = useQuickPublishHandoffStore.getState();
    store.saveHandoff({
      values: { description: "Mi vehículo" },
      appraisalId: "appraisal-1",
      step: 2,
    });
    store.setPendingPublish(true);

    const state = useQuickPublishHandoffStore.getState();
    expect(state.values?.description).toBe("Mi vehículo");
    expect(state.appraisalId).toBe("appraisal-1");
    expect(state.step).toBe(2);
    expect(isQuickPublishHandoffValid(state)).toBe(true);
  });

  it("clearHandoff deja el store vacío", () => {
    const store = useQuickPublishHandoffStore.getState();
    store.saveHandoff({ values: { description: "Borrar" }, step: 3 });
    store.setPendingPublish(true);
    store.clearHandoff();

    const state = useQuickPublishHandoffStore.getState();
    expect(state.values).toBeNull();
    expect(state.step).toBeNull();
    expect(state.pendingPublishAt).toBeNull();
  });

  it("elimina una sola vez la clave antigua de localStorage", () => {
    const removeItem = vi.fn();
    vi.stubGlobal("window", { localStorage: { removeItem } });

    removeLegacyQuickPublishDraft();
    removeLegacyQuickPublishDraft();

    expect(removeItem).toHaveBeenCalledTimes(1);
    expect(removeItem).toHaveBeenCalledWith(
      LEGACY_QUICK_PUBLISH_DRAFT_STORAGE_KEY,
    );
  });
});
