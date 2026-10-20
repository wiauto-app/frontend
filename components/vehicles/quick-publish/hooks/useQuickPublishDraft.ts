"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { UseFormReturn } from "react-hook-form";
import {
  createQuickVehicleDefaultValues,
  type QuickVehicleSchema,
} from "@/components/vehicles/schemas/quick-vehicle.schema";
import type { VehicleFormImage } from "@/components/vehicles/schemas/vehicle.schema";

import {
  QUICK_VEHICLE_STEP_QUERY_PARAM,
  parseQuickVehicleStep,
} from "../quick-vehicle-wizard.constants";
import {
  isQuickPublishDraftExpired,
  isQuickPublishPendingValid,
  useQuickPublishDraftStore,
  type QuickPublishDraftValues,
} from "../stores/quickPublishDraftStore";

const DRAFT_SAVE_DEBOUNCE_MS = 400;

/** Margen para no restaurar fotos que caducarían mientras el usuario termina. */
const IMAGE_EXPIRY_SAFETY_MARGIN_MS = 5 * 60 * 1000;

interface UseQuickPublishDraftOptions {
  form: UseFormReturn<QuickVehicleSchema>;
  /** `false` en modo edición: ni lee ni escribe el borrador. */
  enabled: boolean;
  appraisalId?: string;
}

const readCurrentStep = (): number | null => {
  if (typeof window === "undefined") {
    return null;
  }

  return parseQuickVehicleStep(
    new URLSearchParams(window.location.search).get(
      QUICK_VEHICLE_STEP_QUERY_PARAM,
    ),
  );
};

/** Las fotos nuevas solo sobreviven mientras su temp upload no haya caducado. */
const isRestorableImage = (image: VehicleFormImage, now: number): boolean => {
  if (!image.upload_id) {
    return true;
  }

  if (!image.expires_at) {
    return false;
  }

  const expiresAt = Date.parse(image.expires_at);
  return (
    Number.isFinite(expiresAt) &&
    expiresAt - IMAGE_EXPIRY_SAFETY_MARGIN_MS > now
  );
};

/** Un `blob:` no sobrevive a una recarga: nunca se persiste. */
const sanitizeDraftValues = (
  values: QuickPublishDraftValues,
): QuickPublishDraftValues => {
  const snapshot = structuredClone(values);

  if (snapshot.images) {
    snapshot.images = snapshot.images.map((image) => {
      if (!image.preview_url?.startsWith("blob:")) {
        return image;
      }

      const { preview_url: _blobPreview, ...rest } = image;
      return rest;
    });
  }

  return snapshot;
};

const subscribeToHydration = (onHydrated: () => void) =>
  useQuickPublishDraftStore.persist.onFinishHydration(onHydrated);

/**
 * Borrador persistente de `/publicar`. RHF sigue siendo la fuente de verdad:
 * aquí solo se restaura un snapshot al montar y se guarda con debounce.
 */
export const useQuickPublishDraft = ({
  form,
  enabled,
  appraisalId,
}: UseQuickPublishDraftOptions) => {
  const [hasHydrated, setHasHydrated] = useState(false);
  const [isDraftReady, setIsDraftReady] = useState(false);
  const [restoredFromDraft, setRestoredFromDraft] = useState(false);

  const restoreAttemptedRef = useRef(false);
  const saveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const savingStoppedRef = useRef(false);

  const pendingPublish = useQuickPublishDraftStore((state) =>
    isQuickPublishPendingValid(state),
  );
  const setPendingPublish = useQuickPublishDraftStore(
    (state) => state.setPendingPublish,
  );

  useEffect(() => {
    if (!enabled) {
      return;
    }

    if (useQuickPublishDraftStore.persist.hasHydrated()) {
      setHasHydrated(true);
      return;
    }

    return subscribeToHydration(() => setHasHydrated(true));
  }, [enabled]);

  // Restore: una sola vez, tras la hidratación del store.
  useEffect(() => {
    if (!enabled || !hasHydrated || restoreAttemptedRef.current) {
      return;
    }

    restoreAttemptedRef.current = true;

    const { values, appraisalId: draftAppraisalId, savedAt, clearDraft } =
      useQuickPublishDraftStore.getState();

    if (!values || isQuickPublishDraftExpired(savedAt)) {
      if (values) {
        clearDraft();
      }
      setIsDraftReady(true);
      return;
    }

    // Con `?tasacion=` distinta a la del borrador, gana la tasación.
    if (appraisalId && draftAppraisalId !== appraisalId) {
      clearDraft();
      setIsDraftReady(true);
      return;
    }

    const now = Date.now();
    const draftImages = values.images ?? [];
    const images = draftImages.filter((image) =>
      isRestorableImage(image, now),
    );

    form.reset({
      ...createQuickVehicleDefaultValues,
      ...values,
      images: images.map((image, index) => ({ ...image, order: index })),
    });

    setRestoredFromDraft(true);
    setIsDraftReady(true);
  }, [enabled, hasHydrated, appraisalId, form]);

  const saveDraftNow = useCallback(
    (values: QuickPublishDraftValues) => {
      if (!enabled || savingStoppedRef.current) {
        return;
      }

      useQuickPublishDraftStore.getState().saveDraft({
        values: sanitizeDraftValues(values),
        appraisalId,
        step: readCurrentStep(),
      });
    },
    [enabled, appraisalId],
  );

  // Save: debounce sobre `form.watch`. Solo tras decidir el restore, para no
  // pisar el borrador con los valores por defecto.
  useEffect(() => {
    if (!enabled || !isDraftReady) {
      return;
    }

    const subscription = form.watch((values) => {
      if (saveTimerRef.current) {
        clearTimeout(saveTimerRef.current);
      }

      saveTimerRef.current = setTimeout(() => {
        saveTimerRef.current = null;
        saveDraftNow(values as QuickPublishDraftValues);
      }, DRAFT_SAVE_DEBOUNCE_MS);
    });

    return () => {
      subscription.unsubscribe();
      if (saveTimerRef.current) {
        clearTimeout(saveTimerRef.current);
        saveTimerRef.current = null;
      }
    };
  }, [enabled, isDraftReady, form, saveDraftNow]);

  /** Borra el borrador y detiene el guardado (p. ej. tras publicar con éxito). */
  const discardDraft = useCallback(() => {
    savingStoppedRef.current = true;
    if (saveTimerRef.current) {
      clearTimeout(saveTimerRef.current);
      saveTimerRef.current = null;
    }
    useQuickPublishDraftStore.getState().clearDraft();
  }, []);

  return {
    /** `true` cuando ya se decidió restaurar (o no) el borrador. */
    isDraftReady: enabled ? isDraftReady : true,
    restoredFromDraft: enabled && restoredFromDraft,
    pendingPublish: enabled && pendingPublish,
    setPendingPublish,
    saveDraftNow,
    discardDraft,
  };
};
