import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

import type { QuickVehicleSchema } from "@/components/vehicles/schemas/quick-vehicle.schema";

/**
 * Ventana en la que el handoff sigue siendo válido. Evita que un "Publicar"
 * abandonado (el usuario cerró el login) se dispare horas después.
 */
export const QUICK_PUBLISH_HANDOFF_TTL_MS = 60 * 60 * 1000;

/** Clave del antiguo borrador en localStorage (incluía email y teléfono). */
export const LEGACY_QUICK_PUBLISH_DRAFT_STORAGE_KEY = "quick-publish-draft";

const QUICK_PUBLISH_HANDOFF_STORE_VERSION = 1;

export type QuickPublishDraftValues = Partial<QuickVehicleSchema>;

interface QuickPublishHandoffState {
  values: QuickPublishDraftValues | null;
  appraisalId?: string;
  step: number | null;
  pendingPublishAt: number | null;
}

interface SaveHandoffInput {
  values: QuickPublishDraftValues;
  appraisalId?: string;
  step?: number | null;
}

interface QuickPublishHandoffActions {
  saveHandoff: (input: SaveHandoffInput) => void;
  setPendingPublish: (pending: boolean) => void;
  clearHandoff: () => void;
}

interface QuickPublishHandoffStore
  extends QuickPublishHandoffState,
    QuickPublishHandoffActions {}

const initialState: QuickPublishHandoffState = {
  values: null,
  appraisalId: undefined,
  step: null,
  pendingPublishAt: null,
};

export const isQuickPublishHandoffValid = (
  state: Pick<QuickPublishHandoffState, "values" | "pendingPublishAt">,
  now: number = Date.now(),
): boolean =>
  state.values != null &&
  state.pendingPublishAt != null &&
  now - state.pendingPublishAt <= QUICK_PUBLISH_HANDOFF_TTL_MS;

let legacyDraftRemoved = false;

export const removeLegacyQuickPublishDraft = (): void => {
  if (legacyDraftRemoved || typeof window === "undefined") {
    return;
  }

  legacyDraftRemoved = true;
  try {
    window.localStorage.removeItem(LEGACY_QUICK_PUBLISH_DRAFT_STORAGE_KEY);
  } catch {
    // Storage bloqueado (modo privado estricto): no hay nada que limpiar.
  }
};

/**
 * Snapshot del anuncio de un invitado que pulsa Publicar. Solo vive en la
 * pestaña (sessionStorage) para sobrevivir al login con redirección completa.
 */
export const useQuickPublishHandoffStore = create<QuickPublishHandoffStore>()(
  persist(
    (set) => ({
      ...initialState,
      saveHandoff: ({ values, appraisalId, step }) =>
        set((state) => ({
          values,
          appraisalId,
          step: step ?? state.step,
        })),
      setPendingPublish: (pending) =>
        set({ pendingPublishAt: pending ? Date.now() : null }),
      clearHandoff: () => set({ ...initialState }),
    }),
    {
      name: "quick-publish-handoff",
      version: QUICK_PUBLISH_HANDOFF_STORE_VERSION,
      storage: createJSONStorage(() => sessionStorage),
      partialize: (state): QuickPublishHandoffState => ({
        values: state.values,
        appraisalId: state.appraisalId,
        step: state.step,
        pendingPublishAt: state.pendingPublishAt,
      }),
      migrate: (persistedState, version) => {
        if (version === QUICK_PUBLISH_HANDOFF_STORE_VERSION) {
          return persistedState as QuickPublishHandoffState;
        }

        return { ...initialState };
      },
    },
  ),
);
