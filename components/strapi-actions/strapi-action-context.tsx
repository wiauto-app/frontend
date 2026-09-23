"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";

import { StrapiActionHost } from "./strapi-action-host";
import {
  isStrapiActionKey,
  type StrapiActionKey,
} from "./strapi-action-keys";

interface StrapiActionContextValue {
  actionKey: StrapiActionKey | null;
  open: boolean;
  openAction: () => void;
  closeAction: () => void;
}

const StrapiActionContext = createContext<StrapiActionContextValue | null>(
  null,
);

interface StrapiActionProviderProps {
  actionKey?: string | null;
  /** Si se define, `openAction` hace scroll a este id en lugar de abrir el diálogo. */
  embedTargetId?: string | null;
  children: ReactNode;
}

const scrollToEmbedTarget = (targetId: string): boolean => {
  const target = document.getElementById(targetId);
  if (!target) {
    return false;
  }

  const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)",
  ).matches;

  target.scrollIntoView({
    behavior: prefersReducedMotion ? "auto" : "smooth",
    block: "start",
  });

  return true;
};

export const StrapiActionProvider = ({
  actionKey,
  embedTargetId,
  children,
}: StrapiActionProviderProps) => {
  const [open, setOpen] = useState(false);
  const resolvedKey = isStrapiActionKey(actionKey) ? actionKey : null;
  const isEmbedded = Boolean(resolvedKey && embedTargetId);

  const openAction = useCallback(() => {
    if (!resolvedKey) {
      return;
    }

    if (embedTargetId && scrollToEmbedTarget(embedTargetId)) {
      return;
    }

    if (isEmbedded) {
      return;
    }

    setOpen(true);
  }, [resolvedKey, embedTargetId, isEmbedded]);

  const closeAction = useCallback(() => {
    setOpen(false);
  }, []);

  const value = useMemo<StrapiActionContextValue>(
    () => ({
      actionKey: resolvedKey,
      open,
      openAction,
      closeAction,
    }),
    [resolvedKey, open, openAction, closeAction],
  );

  return (
    <StrapiActionContext.Provider value={value}>
      {children}
      {resolvedKey && !isEmbedded ? (
        <StrapiActionHost
          actionKey={resolvedKey}
          open={open}
          onOpenChange={setOpen}
        />
      ) : null}
    </StrapiActionContext.Provider>
  );
};

export const useStrapiAction = (): StrapiActionContextValue | null => {
  return useContext(StrapiActionContext);
};
