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
  children: ReactNode;
}

export const StrapiActionProvider = ({
  actionKey,
  children,
}: StrapiActionProviderProps) => {
  const [open, setOpen] = useState(false);
  const resolvedKey = isStrapiActionKey(actionKey) ? actionKey : null;

  const openAction = useCallback(() => {
    if (!resolvedKey) {
      return;
    }
    setOpen(true);
  }, [resolvedKey]);

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
      {resolvedKey ? (
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
