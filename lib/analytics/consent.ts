/**
 * Modo de consentimiento v2 de Google + consentimiento de Meta.
 *
 * El estado por defecto (todo denegado) lo fija `ConsentModeScript` antes de
 * que carguen las etiquetas. Este módulo solo se ocupa de leer la decisión
 * guardada y de propagarla a Google y a Meta cuando el usuario la cambia.
 */

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
  }
}

export interface ConsentPreferences {
  /** Medición de uso del sitio (GA4). */
  analytics: boolean;
  /** Publicidad y remarketing (Meta Pixel, Google Ads). */
  marketing: boolean;
}

interface StoredConsent extends ConsentPreferences {
  version: number;
  decidedAt: string;
}

export const CONSENT_COOKIE_NAME = "wiauto_consent";

/** Subir esta versión invalida los consentimientos previos y vuelve a preguntar. */
export const CONSENT_VERSION = 1;

/** La AEPD recomienda no superar los 24 meses; usamos 6. */
const CONSENT_MAX_AGE_SECONDS = 60 * 60 * 24 * 180;

export const CONSENT_DENIED: ConsentPreferences = {
  analytics: false,
  marketing: false,
};

export const CONSENT_GRANTED: ConsentPreferences = {
  analytics: true,
  marketing: true,
};

const readCookie = (name: string): string | null => {
  if (typeof document === "undefined") {
    return null;
  }

  const match = document.cookie
    .split("; ")
    .find((entry) => entry.startsWith(`${name}=`));

  return match ? decodeURIComponent(match.slice(name.length + 1)) : null;
};

/** Devuelve la decisión guardada, o `null` si nunca se decidió o caducó la versión. */
export const readStoredConsent = (): ConsentPreferences | null => {
  const raw = readCookie(CONSENT_COOKIE_NAME);
  if (!raw) {
    return null;
  }

  try {
    const parsed = JSON.parse(raw) as StoredConsent;
    if (parsed.version !== CONSENT_VERSION) {
      return null;
    }
    return { analytics: !!parsed.analytics, marketing: !!parsed.marketing };
  } catch {
    return null;
  }
};

export const persistConsent = (preferences: ConsentPreferences): void => {
  const payload: StoredConsent = {
    ...preferences,
    version: CONSENT_VERSION,
    decidedAt: new Date().toISOString(),
  };

  const secure = window.location.protocol === "https:" ? "; Secure" : "";

  document.cookie = `${CONSENT_COOKIE_NAME}=${encodeURIComponent(
    JSON.stringify(payload),
  )}; Max-Age=${CONSENT_MAX_AGE_SECONDS}; Path=/; SameSite=Lax${secure}`;
};

/**
 * Propaga la decisión a las etiquetas ya cargadas. Google actualiza su modo de
 * consentimiento y Meta concede o revoca el envío de eventos (los eventos
 * emitidos mientras está revocado quedan en cola).
 */
export const applyConsent = (preferences: ConsentPreferences): void => {
  if (typeof window === "undefined") {
    return;
  }

  const marketing = preferences.marketing ? "granted" : "denied";
  const analytics = preferences.analytics ? "granted" : "denied";

  window.gtag?.("consent", "update", {
    ad_storage: marketing,
    ad_user_data: marketing,
    ad_personalization: marketing,
    analytics_storage: analytics,
  });

  window.fbq?.("consent", preferences.marketing ? "grant" : "revoke");
};
