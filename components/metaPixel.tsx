import { Suspense } from "react";
import Script from "next/script";

import { MetaPixelPageView } from "@/components/metaPixelPageView";
import { META_PIXEL_ID } from "@/constants";


/**
 * El pixel se inicializa con el consentimiento revocado: los eventos se encolan
 * en el navegador y solo se envían si el usuario acepta publicidad, momento en
 * el que `applyConsent` ejecuta `fbq('consent', 'grant')`.
 */
export const MetaPixel = () => {
  if (!META_PIXEL_ID) {
    return null;
  }

  return (
    <>
      <Script id="meta-pixel" strategy="afterInteractive">
        {`
          !function(f,b,e,v,n,t,s)
          {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
          n.callMethod.apply(n,arguments):n.queue.push(arguments)};
          if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
          n.queue=[];t=b.createElement(e);t.async=!0;
          t.src=v;s=b.getElementsByTagName(e)[0];
          s.parentNode.insertBefore(t,s)}(window,document,'script',
          'https://connect.facebook.net/en_US/fbevents.js');
          fbq('consent', 'revoke');
          fbq('init', '${META_PIXEL_ID}');
          fbq('track', 'PageView');
        `}
      </Script>
      <Suspense fallback={null}>
        <MetaPixelPageView />
      </Suspense>
    </>
  );
};
