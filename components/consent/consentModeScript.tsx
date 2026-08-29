import Script from "next/script";

/**
 * Estado por defecto del modo de consentimiento v2.
 *
 * Debe ejecutarse ANTES que gtag.js, GTM y el pixel de Meta, por eso usa
 * `beforeInteractive` y se monta en el layout raíz. Todo se deniega de partida:
 * las etiquetas de Google se cargan sin cookies y Meta encola los eventos hasta
 * que el usuario decide.
 *
 * `wait_for_update` da margen a que la decisión guardada se aplique antes de
 * que las etiquetas envíen el primer hit.
 */
export const ConsentModeScript = () => (
  // La regla del linter apunta al Pages Router; en App Router la ubicación
  // correcta de `beforeInteractive` es justamente el layout raíz.
  // eslint-disable-next-line @next/next/no-before-interactive-script-outside-document
  <Script id="consent-mode-default" strategy="beforeInteractive">
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
