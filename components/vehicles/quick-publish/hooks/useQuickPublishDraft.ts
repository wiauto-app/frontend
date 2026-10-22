"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import type { UseFormReturn } from "react-hook-form";
import { toast } from "sonner";
import {
  createQuickVehicleDefaultValues,
  type QuickVehicleSchema,
} from "@/components/vehicles/schemas/quick-vehicle.schema";
import type { VehicleFormImage } from "@/components/vehicles/schemas/vehicle.schema";
import { vehicleDraftService } from "@/services/vehicleDraftService";

import {
  QUICK_VEHICLE_STEP_QUERY_PARAM,
  parseQuickVehicleStep,
} from "../quick-vehicle-wizard.constants";
import {
  isQuickPublishHandoffValid,
  removeLegacyQuickPublishDraft,
  useQuickPublishHandoffStore,
  type QuickPublishDraftValues,
} from "../stores/quickPublishHandoffStore";

export const DRAFT_SAVE_DEBOUNCE_MS = 1500;

/** Fallos seguidos antes de avisar: un fallo aislado se recupera solo. */
const DRAFT_SAVE_FAILURES_BEFORE_WARNING = 3;

const DRAFT_SAVE_WARNING_TOAST_ID = "quick-publish-draft-save-error";

/** Margen para no restaurar fotos que caducarían mientras el usuario termina. */
const IMAGE_EXPIRY_SAFETY_MARGIN_MS = 5 * 60 * 1000;

type DraftMode = "anonymous" | "authenticated";

interface UseQuickPublishDraftOptions {
  form: UseFormReturn<QuickVehicleSchema>;
  /** `false` en modo edición: ni lee ni escribe el borrador. */
  enabled: boolean;
  /** `undefined` mientras la sesión no se ha resuelto. */
  isAuthenticated?: boolean;
  appraisalId?: string;
}

interface DraftSnapshot {
  values: QuickPublishDraftValues;
  step: number | null;
  appraisalId?: string;
}

const toDraftMode = (isAuthenticated?: boolean): DraftMode | null => {
  if (isAuthenticated === undefined) {
    return null;
  }

  return isAuthenticated ? "authenticated" : "anonymous";
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
  useQuickPublishHandoffStore.persist.onFinishHydration(onHydrated);

/**
 * Borrador de `/publicar`. RHF sigue siendo la fuente de verdad.
 * - Invitado: sin borrador; solo un handoff en sessionStorage al pulsar Publicar.
 * - Autenticado: borrador único en la API, restaurado al montar y guardado con
 *   debounce. Un handoff válido tiene prioridad y activa la auto-publicación.
 */
export const useQuickPublishDraft = ({
  form,
  enabled,
  isAuthenticated,
  appraisalId,
}: UseQuickPublishDraftOptions) => {
  const searchParams = useSearchParams();
  const currentStep = parseQuickVehicleStep(
    searchParams?.get(QUICK_VEHICLE_STEP_QUERY_PARAM) ?? null,
  );
  const currentMode = toDraftMode(isAuthenticated);

  const [hasHydrated, setHasHydrated] = useState(false);
  const [readyMode, setReadyMode] = useState<DraftMode | null>(null);
  const [restoredFromDraft, setRestoredFromDraft] = useState(false);
  const [serverPendingPublish, setServerPendingPublish] = useState(false);

  const resolvedModeRef = useRef<DraftMode | null>(null);
  const isMountedRef = useRef(false);
  const stepRef = useRef<number | null>(currentStep);
  const saveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const unsavedValuesRef = useRef<QuickPublishDraftValues | null>(null);
  const savingStoppedRef = useRef(false);
  const failedSavesRef = useRef(0);
  // Cola: los PUT llegan en orden y el DELETE final nunca se adelanta a un PUT.
  const persistQueueRef = useRef<Promise<void>>(Promise.resolve());

  const handoffPendingPublish = useQuickPublishHandoffStore((state) =>
    isQuickPublishHandoffValid(state),
  );

  const isDraftReady = currentMode !== null && readyMode === currentMode;

  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  useEffect(() => {
    if (!enabled) {
      return;
    }

    removeLegacyQuickPublishDraft();

    if (useQuickPublishHandoffStore.persist.hasHydrated()) {
      setHasHydrated(true);
      return;
    }

    return subscribeToHydration(() => setHasHydrated(true));
  }, [enabled]);

  const enqueuePersist = useCallback((task: () => Promise<void>) => {
    persistQueueRef.current = persistQueueRef.current.then(task, task);
  }, []);

  const registerSaveResult = useCallback((ok: boolean) => {
    if (ok) {
      failedSavesRef.current = 0;
      return;
    }

    failedSavesRef.current += 1;
    if (failedSavesRef.current === DRAFT_SAVE_FAILURES_BEFORE_WARNING) {
      toast.warning(
        "No hemos podido guardar el borrador. Revisa tu conexión; seguiremos intentándolo.",
        { id: DRAFT_SAVE_WARNING_TOAST_ID },
      );
    }
  }, []);

  const persistDraft = useCallback(
    (snapshot: DraftSnapshot) => {
      enqueuePersist(async () => {
        if (savingStoppedRef.current) {
          return;
        }

        try {
          const response = await vehicleDraftService.saveMine({
            values: sanitizeDraftValues(snapshot.values),
            step: snapshot.step,
            appraisal_id: snapshot.appraisalId ?? null,
          });
          registerSaveResult(response.ok);
        } catch {
          registerSaveResult(false);
        }
      });
    },
    [enqueuePersist, registerSaveResult],
  );

  const flushPendingSave = useCallback(() => {
    if (saveTimerRef.current) {
      clearTimeout(saveTimerRef.current);
      saveTimerRef.current = null;
    }

    const values = unsavedValuesRef.current;
    if (!values || savingStoppedRef.current) {
      return;
    }

    unsavedValuesRef.current = null;
    persistDraft({ values, step: stepRef.current, appraisalId });
  }, [persistDraft, appraisalId]);

  const restoreValues = useCallback(
    (values: QuickPublishDraftValues) => {
      const now = Date.now();
      const images = (values.images ?? []).filter((image) =>
        isRestorableImage(image, now),
      );

      form.reset({
        ...createQuickVehicleDefaultValues,
        ...values,
        images: images.map((image, index) => ({ ...image, order: index })),
      });
      setRestoredFromDraft(true);
    },
    [form],
  );

  // Resolución por modo: una vez por cada cambio de sesión (p. ej. login en el
  // diálogo sin recarga). Mientras no hay sesión resuelta, no se decide nada.
  useEffect(() => {
    if (!enabled || !hasHydrated || currentMode === null) {
      return;
    }

    if (resolvedModeRef.current === currentMode) {
      return;
    }

    const previousMode = resolvedModeRef.current;
    resolvedModeRef.current = currentMode;

    const isSameAppraisal = (draftAppraisalId?: string | null) =>
      !appraisalId || draftAppraisalId === appraisalId;

    const handoff = useQuickPublishHandoffStore.getState();
    const hasValidHandoff =
      isQuickPublishHandoffValid(handoff) &&
      isSameAppraisal(handoff.appraisalId);

    if (handoff.values && !hasValidHandoff) {
      handoff.clearHandoff();
    }

    if (currentMode === "anonymous") {
      // Login cancelado y recarga: se recupera lo escrito, sin tocar la API.
      if (hasValidHandoff && handoff.values) {
        restoreValues(handoff.values);
      }
      setReadyMode("anonymous");
      return;
    }

    if (hasValidHandoff && handoff.values) {
      restoreValues(handoff.values);
      persistDraft({
        values: handoff.values,
        step: handoff.step,
        appraisalId: handoff.appraisalId,
      });
      handoff.clearHandoff();
      setServerPendingPublish(true);
      setReadyMode("authenticated");
      return;
    }

    // Login sin recarga a mitad de formulario: lo escrito gana al borrador.
    if (previousMode === "anonymous") {
      setReadyMode("authenticated");
      return;
    }

    const restoreServerDraft = async () => {
      try {
        const response = await vehicleDraftService.getMine();
        const draft = response.ok ? response.data : null;

        if (
          !isMountedRef.current ||
          resolvedModeRef.current !== "authenticated"
        ) {
          return;
        }

        if (draft?.values && isSameAppraisal(draft.appraisal_id)) {
          restoreValues(draft.values);
        }
      } catch {
        // Sin borrador recuperable: se empieza con el formulario vacío.
      }

      if (isMountedRef.current && resolvedModeRef.current === "authenticated") {
        setReadyMode("authenticated");
      }
    };

    void restoreServerDraft();
  }, [
    enabled,
    hasHydrated,
    currentMode,
    appraisalId,
    restoreValues,
    persistDraft,
  ]);

  // Autoguardado (solo autenticado): debounce sobre `form.watch`, tras decidir
  // el restore para no pisar el borrador con los valores por defecto.
  const isAutosaveActive =
    enabled && isDraftReady && currentMode === "authenticated";

  useEffect(() => {
    if (!isAutosaveActive) {
      return;
    }

    const subscription = form.watch((values) => {
      unsavedValuesRef.current = values as QuickPublishDraftValues;

      if (saveTimerRef.current) {
        clearTimeout(saveTimerRef.current);
      }
      saveTimerRef.current = setTimeout(
        flushPendingSave,
        DRAFT_SAVE_DEBOUNCE_MS,
      );
    });

    return () => {
      subscription.unsubscribe();
      flushPendingSave();
    };
  }, [isAutosaveActive, form, flushPendingSave]);

  useEffect(() => {
    if (stepRef.current === currentStep) {
      return;
    }

    stepRef.current = currentStep;
    flushPendingSave();
  }, [currentStep, flushPendingSave]);

  const saveDraftNow = useCallback(
    (values: QuickPublishDraftValues) => {
      if (!enabled || savingStoppedRef.current) {
        return;
      }

      if (isAuthenticated === true) {
        unsavedValuesRef.current = values;
        flushPendingSave();
        return;
      }

      useQuickPublishHandoffStore.getState().saveHandoff({
        values: sanitizeDraftValues(values),
        appraisalId,
        step: stepRef.current,
      });
    },
    [enabled, isAuthenticated, appraisalId, flushPendingSave],
  );

  const setPendingPublish = useCallback(
    (pending: boolean) => {
      if (isAuthenticated === true) {
        setServerPendingPublish(pending);
        return;
      }

      useQuickPublishHandoffStore.getState().setPendingPublish(pending);
    },
    [isAuthenticated],
  );

  /** Borra el borrador y detiene el guardado (p. ej. tras publicar con éxito). */
  const discardDraft = useCallback(() => {
    savingStoppedRef.current = true;
    unsavedValuesRef.current = null;
    if (saveTimerRef.current) {
      clearTimeout(saveTimerRef.current);
      saveTimerRef.current = null;
    }
    useQuickPublishHandoffStore.getState().clearHandoff();

    if (isAuthenticated === true) {
      enqueuePersist(async () => {
        await vehicleDraftService.removeMine();
      });
    }
  }, [isAuthenticated, enqueuePersist]);

  const pendingPublish =
    currentMode === "authenticated"
      ? serverPendingPublish
      : handoffPendingPublish;

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
