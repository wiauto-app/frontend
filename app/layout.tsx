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

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });

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
          <AssistantChatProvider>
          <Navbar />
          <main className="flex flex-1 flex-col pb-14 md:pb-0 mb-10">{children}</main>
          <ConditionalWrapper hideOnPaths={["/usuario","/publicar","/editar-vehiculo"]}>
            <NewsletterSection />
            <Footer />
          </ConditionalWrapper>
          <AssistantDialog />
          <MobileNavbar />
          </AssistantChatProvider>
        </body>
      </html>
    </Providers>
  );
}
