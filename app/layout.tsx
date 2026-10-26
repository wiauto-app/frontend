import { Geist, Geist_Mono, Inter } from "next/font/google";
import "./globals.css";
import { AppDownloadBannerGate } from "@/components/app-download/AppDownloadBannerGate";
import { Navbar } from "@/components/navbar";
import { cn } from "@/lib/utils";
import Providers from "./providers";
import { Footer, NewsletterSection } from "@/components/home";
import { LazyAssistantDialog } from "@/components/home/lazyImports/LazyAssistantDialog";
import { ConditionalWrapper } from "@/components/ui/ConditionalWrapper";
import { AssistantChatProvider } from "@/components/assistant/assistantChatProvider";
import { ViewTransitionStyles } from "@/components/view-transitions/view-transition-styles";
import { Metadata } from "next";
import { LazyMobileNavbar } from "@/components/home/lazyImports/LazyMobileNavbar";
import { LazyCookieConsentBanner } from "@/components/home/lazyImports/LazyCookieConsentBanner";
import { LazyThirdPartyLibraries } from "@/components/home/lazyImports/LazyThirdPartyLibraries";

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
        <Providers>
          <AssistantChatProvider>
            <div
              className="sticky top-0 z-40"
              style={{ viewTransitionName: "site-header" }}
            >
              <AppDownloadBannerGate />
              <Navbar />
            </div>
            <main className="flex min-w-0 flex-1 flex-col overflow-x-clip">
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
            <LazyAssistantDialog />
            <LazyMobileNavbar />
            <LazyCookieConsentBanner />
          </AssistantChatProvider>
        </Providers>
        <LazyThirdPartyLibraries />
      </body>
    </html>
  );
}
