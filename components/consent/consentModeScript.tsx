import Script from "next/script";

/**
 * Estado por defecto del modo de consentimiento v2.
 *
 * Debe ejecutarse ANTES que gtag.js, GTM y el pixel de Meta, por eso usa
 * `beforeInteractive` y se monta en el layout raíz.
 */
export const ConsentModeScript = () => (
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
