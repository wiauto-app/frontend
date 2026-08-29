"use client";

import { useCookieConsent } from "./cookieConsentProvider";

/**
 * Enlace para reabrir el panel de cookies. La normativa exige poder retirar el
 * consentimiento con la misma facilidad con la que se otorga, así que debe
 * estar accesible de forma permanente (footer).
 */
export const CookiePreferencesButton = ({
  className,
}: {
  className?: string;
}) => {
  const { openPreferences } = useCookieConsent();

  return (
    <button type="button" onClick={openPreferences} className={className}>
      Preferencias de cookies
    </button>
  );
};
