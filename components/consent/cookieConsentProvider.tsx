"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

import {
  applyConsent,
  CONSENT_DENIED,
  CONSENT_GRANTED,
  persistConsent,
  readStoredConsent,
  type ConsentPreferences,
} from "@/lib/analytics/consent";

interface CookieConsentContextValue {
  /** `null` mientras no se ha leído la cookie o si el usuario no ha decidido. */
  preferences: ConsentPreferences | null;
  hasDecided: boolean;
  isBannerVisible: boolean;
  isPreferencesOpen: boolean;
  openPreferences: () => void;
  closePreferences: () => void;
  acceptAll: () => void;
  rejectAll: () => void;
  savePreferences: (preferences: ConsentPreferences) => void;
}

const CookieConsentContext = createContext<CookieConsentContextValue | null>(
  null,
);

export const useCookieConsent = (): CookieConsentContextValue => {
  const context = useContext(CookieConsentContext);

  if (!context) {
    throw new Error(
      "useCookieConsent debe usarse dentro de CookieConsentProvider",
    );
  }

  return context;
};

export const CookieConsentProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const [preferences, setPreferences] = useState<ConsentPreferences | null>(
    null,
  );
  const [hasDecided, setHasDecided] = useState(true);
  const [isPreferencesOpen, setIsPreferencesOpen] = useState(false);

  // Se ejecuta solo en cliente: el layout es estático y no puede leer la cookie
  // en servidor sin volver dinámica toda la web.
  useEffect(() => {
    const stored = readStoredConsent();

    if (!stored) {
      setHasDecided(false);
      return;
    }

    setPreferences(stored);
    applyConsent(stored);
  }, []);

  const commit = useCallback((next: ConsentPreferences) => {
    setPreferences(next);
    setHasDecided(true);
    setIsPreferencesOpen(false);
    persistConsent(next);
    applyConsent(next);
  }, []);

  const value = useMemo<CookieConsentContextValue>(
    () => ({
      preferences,
      hasDecided,
      isBannerVisible: !hasDecided,
      isPreferencesOpen,
      openPreferences: () => setIsPreferencesOpen(true),
      closePreferences: () => setIsPreferencesOpen(false),
      acceptAll: () => commit(CONSENT_GRANTED),
      rejectAll: () => commit(CONSENT_DENIED),
      savePreferences: commit,
    }),
    [preferences, hasDecided, isPreferencesOpen, commit],
  );

  return (
    <CookieConsentContext.Provider value={value}>
      {children}
    </CookieConsentContext.Provider>
  );
};
