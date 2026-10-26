"use client";
import dynamic from "next/dynamic";

export const CookieConsentBanner = dynamic(
  () => import("@/components/consent/cookieConsentBanner").then(
    (mod) => mod.CookieConsentBanner,
  ),
  {
    ssr: false,
  },
);


export const LazyCookieConsentBanner = () => {
  return <CookieConsentBanner />;
};
