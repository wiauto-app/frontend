"use client";

import { useCallback, useEffect, useState } from "react";

/** Claves de antiguas versiones que guardaban el formulario en el navegador. */
export const LEGACY_QUICK_PUBLISH_STORAGE_KEYS = {
  localStorage: "quick-publish-draft",
  sessionStorage: "quick-publish-handoff",
} as const;

let legacyStorageRemoved = false;

/** Borra lo que dejaron versiones anteriores (incluía teléfono de contacto). */
export const removeLegacyQuickPublishStorage = (): void => {
  if (legacyStorageRemoved || typeof window === "undefined") {
    return;
  }

  legacyStorageRemoved = true;
  try {
    window.localStorage.removeItem(
      LEGACY_QUICK_PUBLISH_STORAGE_KEYS.localStorage,
    );
    window.sessionStorage.removeItem(
      LEGACY_QUICK_PUBLISH_STORAGE_KEYS.sessionStorage,
    );
  } catch {
    // Storage bloqueado (modo privado estricto): no hay nada que limpiar.
  }
};

interface UseQuickPublishDraftOptions {
  /** `false` en modo edición. */
  enabled: boolean;
}

/**
 * Estado de `/publicar` sin persistencia: el formulario solo vive en memoria,
 * así que recargar o salir de la página lo resetea. `pendingPublish` permite
 * auto-publicar tras un login dentro del diálogo (sin recarga); un login con
 * redirección completa (Google/Apple) pierde lo escrito.
 */
export const useQuickPublishDraft = ({
  enabled,
}: UseQuickPublishDraftOptions) => {
  const [pendingPublish, setPendingPublishState] = useState(false);

  useEffect(() => {
    if (enabled) {
      removeLegacyQuickPublishStorage();
    }
  }, [enabled]);

  const setPendingPublish = useCallback((pending: boolean) => {
    setPendingPublishState(pending);
  }, []);

  const discardDraft = useCallback(() => {
    setPendingPublishState(false);
  }, []);

  return {
    /** Siempre listo: no hay borrador que restaurar. */
    isDraftReady: true,
    restoredFromDraft: false,
    pendingPublish: enabled && pendingPublish,
    setPendingPublish,
    discardDraft,
  };
};
