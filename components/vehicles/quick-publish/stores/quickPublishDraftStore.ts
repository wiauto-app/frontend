import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

import type { QuickVehicleSchema } from "@/components/vehicles/schemas/quick-vehicle.schema";

/** El borrador (incluye email y teléfono) caduca a los 7 días. */
export const QUICK_PUBLISH_DRAFT_TTL_MS = 7 * 24 * 60 * 60 * 1000;

/**
 * Ventana en la que `pendingPublish` sigue siendo válido. Evita que un "Publicar"
 * abandonado (el usuario cerró el login) se dispare días después.
 */
export const QUICK_PUBLISH_PENDING_TTL_MS = 60 * 60 * 1000;

const QUICK_PUBLISH_DRAFT_STORE_VERSION = 1;

export type QuickPublishDraftValues = Partial<QuickVehicleSchema>;

interface QuickPublishDraftState {
  values: QuickPublishDraftValues | null;
  appraisalId?: string;
  step: number | null;
  pendingPublish: boolean;
  pendingPublishAt: number | null;
  savedAt: number | null;
}

interface SaveDraftInput {
  values: QuickPublishDraftValues;
  appraisalId?: string;
  step?: number | null;
}

interface QuickPublishDraftActions {
  saveDraft: (input: SaveDraftInput) => void;
  setPendingPublish: (pending: boolean) => void;
  clearDraft: () => void;
}

type QuickPublishDraftStore = QuickPublishDraftState & QuickPublishDraftActions;

const initialState: QuickPublishDraftState = {
  values: null,
  appraisalId: undefined,
  step: null,
  pendingPublish: false,
  pendingPublishAt: null,
  savedAt: null,
};

export const isQuickPublishDraftExpired = (
  savedAt: number | null,
  now: number = Date.now(),
): boolean => savedAt == null || now - savedAt > QUICK_PUBLISH_DRAFT_TTL_MS;

export const isQuickPublishPendingValid = (
  state: Pick<QuickPublishDraftState, "pendingPublish" | "pendingPublishAt">,
  now: number = Date.now(),
): boolean =>
  state.pendingPublish &&
  state.pendingPublishAt != null &&
  now - state.pendingPublishAt <= QUICK_PUBLISH_PENDING_TTL_MS;

export const useQuickPublishDraftStore = create<QuickPublishDraftStore>()(
  persist(
    (set) => ({
      ...initialState,
      saveDraft: ({ values, appraisalId, step }) =>
        set((state) => ({
          values,
          appraisalId,
          step: step ?? state.step,
          savedAt: Date.now(),
        })),
      setPendingPublish: (pending) =>
        set({
          pendingPublish: pending,
          pendingPublishAt: pending ? Date.now() : null,
        }),
      clearDraft: () => set({ ...initialState }),
    }),
    {
      name: "quick-publish-draft",
      version: QUICK_PUBLISH_DRAFT_STORE_VERSION,
      storage: createJSONStorage(() => localStorage),
      partialize: (state): QuickPublishDraftState => ({
        values: state.values,
        appraisalId: state.appraisalId,
        step: state.step,
        pendingPublish: state.pendingPublish,
        pendingPublishAt: state.pendingPublishAt,
        savedAt: state.savedAt,
      }),
      // v0 no existe aún; ante una versión desconocida se descarta el borrador.
      migrate: (persistedState, version) => {
        if (version === QUICK_PUBLISH_DRAFT_STORE_VERSION) {
          return persistedState as QuickPublishDraftState;
        }

        return { ...initialState };
      },
    },
  ),
);
