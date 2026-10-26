"use client";

import Script from "next/script";

/**
 * Estado por defecto del modo de consentimiento v2.
 *
 * Debe ejecutarse antes que gtag.js, GTM y el pixel de Meta. Se carga con el
 * bundle de terceros (`LazyThirdPartyLibraries`) con `afterInteractive` para
 * poder diferir el JS del layout.
 *
 * `wait_for_update` da margen a que la decisión guardada se aplique antes de
 * que las etiquetas envíen el primer hit.
 */
export const ConsentModeScript = () => (
  <Script id="consent-mode-default" strategy="afterInteractive">
    {`
      window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      window.gtag = window.gtag || gtag;
      gtag('consent', 'default', {
        ad_storage: 'denied',
        ad_user_data: 'denied',
        ad_personalization: 'denied',
        analytics_storage: 'denied',
        functionality_storage: 'granted',
        security_storage: 'granted',
        personalization_storage: 'denied',
        wait_for_update: 500
      });
      gtag('set', 'url_passthrough', true);
      gtag('set', 'ads_data_redaction', true);
    `}
  </Script>
);
