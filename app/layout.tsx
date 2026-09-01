import { Geist, Geist_Mono, Inter } from "next/font/google";
import "./globals.css";
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
import { GOOGLE_ANALYTICS_ID, GOOGLE_TAG_MANAGER_ID } from "@/constants/external.constant";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
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

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <Providers>
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
          <ConsentModeScript />
          <AssistantChatProvider>
            <Navbar />
            <main className="flex flex-1 flex-col pb-14 md:pb-0 mb-10">
              <MetaPixel />
              {children}
            </main>
            <ConditionalWrapper
              hideOnPaths={["/usuario", "/publicar", "/editar-vehiculo"]}
            >
              <NewsletterSection />
              <Footer />
            </ConditionalWrapper>
            <AssistantDialog />
            <MobileNavbar />
            {/* <CookieConsentBanner /> */}
          </AssistantChatProvider>
          {GOOGLE_ANALYTICS_ID ? (
            <GoogleAnalytics gaId={GOOGLE_ANALYTICS_ID} />
          ) : null}
          {GOOGLE_TAG_MANAGER_ID ? (
            <GoogleTagManager gtmId={GOOGLE_TAG_MANAGER_ID} />
          ) : null}
        </body>
      </html>
    </Providers>
  );
}
