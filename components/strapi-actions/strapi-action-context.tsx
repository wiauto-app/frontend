"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";

import type { StrapiLink } from "@/interfaces/strapi-components.interface";
import type { StrapiMedia } from "@/lib/strapi.types";

import { StrapiActionHost } from "./strapi-action-host";
import {
  isStrapiActionKey,
  type StrapiActionKey,
} from "./strapi-action-keys";

interface StrapiActionContextValue {
  actionKey: StrapiActionKey | null;
  open: boolean;
  openAction: (button?: StrapiLink) => void;
  closeAction: () => void;
}

const StrapiActionContext = createContext<StrapiActionContextValue | null>(
  null,
);

interface StrapiActionProviderProps {
  actionKey?: string | null;
  /** Si se define, `openAction` hace scroll a este id en lugar de abrir el diálogo. */
  embedTargetId?: string | null;
  partnerLogo?: StrapiMedia | null;
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
  partnerLogo = null,
  children,
}: StrapiActionProviderProps) => {
  const [open, setOpen] = useState(false);
  const [activeButton, setActiveButton] = useState<StrapiLink | null>(null);
  const resolvedKey = isStrapiActionKey(actionKey) ? actionKey : null;
  const isEmbedded = Boolean(resolvedKey && embedTargetId);

  const openAction = useCallback(
    (button?: StrapiLink) => {
      if (!resolvedKey) {
        return;
      }

      setActiveButton(button ?? null);

      if (embedTargetId && scrollToEmbedTarget(embedTargetId)) {
        return;
      }

      if (isEmbedded) {
        return;
      }

      setOpen(true);
    },
    [resolvedKey, embedTargetId, isEmbedded],
  );

  const closeAction = useCallback(() => {
    setOpen(false);
    setActiveButton(null);
  }, []);

  const handleOpenChange = useCallback((nextOpen: boolean) => {
    setOpen(nextOpen);
    if (!nextOpen) {
      setActiveButton(null);
    }
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
          onOpenChange={handleOpenChange}
          activeButton={activeButton}
          partnerLogo={partnerLogo}
        />
      ) : null}
    </StrapiActionContext.Provider>
  );
};

export const useStrapiAction = (): StrapiActionContextValue | null => {
  return useContext(StrapiActionContext);
};
