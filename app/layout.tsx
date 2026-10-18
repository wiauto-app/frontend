import { Geist, Geist_Mono, Inter } from "next/font/google";
import "./globals.css";
import { AppDownloadBannerGate } from "@/components/app-download/AppDownloadBannerGate";
import { Navbar } from "@/components/navbar";
import { cn } from "@/lib/utils";
import Providers from "./providers";
import { Footer, NewsletterSection } from "@/components/home";
import { AssistantDialog } from "@/components/assistant/assistantDialog";
import { MobileNavbar } from "@/components/mobileNavbar/mobileNavbar";
import { ConditionalWrapper } from "@/components/ui/ConditionalWrapper";
import { AssistantChatProvider } from "@/components/assistant/assistantChatProvider";
import { MetaPixel } from "@/components/metaPixel";
import { ConsentModeScript } from "@/components/consent/consentModeScript";
import { CookieConsentBanner } from "@/components/consent/cookieConsentBanner";
import { GoogleAnalytics, GoogleTagManager } from "@next/third-parties/google";
import {
  GOOGLE_ANALYTICS_ID,
  GOOGLE_TAG_MANAGER_ID,
} from "@/constants/external.constant";
import { ViewTransitionStyles } from "@/components/view-transitions/view-transition-styles";
import { Metadata } from "next";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
});

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export function generateMetadata(): Metadata {
  return {
    title: "Wiauto",
    description: "Wiauto",
    verification: {
      other: {
        "facebook-domain-verification": "y9ztjy16o7ks2qs7tvdocwzo22ym45",
      },
    },
  };
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="es"
      className={cn(
        "antialiased",
        geistSans.variable,
        geistMono.variable,
        "font-sans",
        inter.variable,
      )}
    >
      <body className="flex flex-col relative">
        <ViewTransitionStyles />
        <ConsentModeScript />
        <Providers>
          <AssistantChatProvider>
            <div
              className="sticky top-0 z-40"
              style={{ viewTransitionName: "site-header" }}
            >
              <AppDownloadBannerGate />
              <Navbar />
            </div>
            <main className="flex flex-1 flex-col ">
              <MetaPixel />
              {children}
            </main>
            <ConditionalWrapper
              hideOnPaths={[
                "/usuario",
                "/asistente",
                "/publicar",
                "/editar-vehiculo",
                "/billing-plan",
              ]}
            >
              <NewsletterSection />
              <Footer />
            </ConditionalWrapper>
            <AssistantDialog />
            <MobileNavbar />
            <CookieConsentBanner />
          </AssistantChatProvider>
        </Providers>
        {/* Quitar GoogleAnalytics cuando G-D44GZQL4B2 esté publicado en GTM-PH39KM9H. */}
        {GOOGLE_ANALYTICS_ID ? (
          <GoogleAnalytics gaId={GOOGLE_ANALYTICS_ID} />
        ) : null}
        {GOOGLE_TAG_MANAGER_ID ? (
          <GoogleTagManager gtmId={GOOGLE_TAG_MANAGER_ID} />
        ) : null}
      </body>
    </html>
  );
}
