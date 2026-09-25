"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";

interface AssistantSidebarUiContextValue {
  isOpen: boolean;
  open: () => void;
  close: () => void;
  toggle: () => void;
}

const AssistantSidebarUiContext =
  createContext<AssistantSidebarUiContextValue | null>(null);

interface AssistantSidebarUiProviderProps {
  children: React.ReactNode;
}

export const AssistantSidebarUiProvider = ({
  children,
}: AssistantSidebarUiProviderProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const open = useCallback(() => {
    setIsOpen(true);
  }, []);

  const close = useCallback(() => {
    setIsOpen(false);
  }, []);

  const toggle = useCallback(() => {
    setIsOpen((current) => !current);
  }, []);

  const value = useMemo(
    () => ({ isOpen, open, close, toggle }),
    [isOpen, open, close, toggle],
  );

  return (
    <AssistantSidebarUiContext.Provider value={value}>
      {children}
    </AssistantSidebarUiContext.Provider>
  );
};

export const useAssistantSidebarUi = () => {
  const context = useContext(AssistantSidebarUiContext);

  if (!context) {
    throw new Error(
      "useAssistantSidebarUi debe usarse dentro de AssistantSidebarUiProvider",
    );
  }

  return context;
};
