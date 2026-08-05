import { Suspense } from "react";
import { Geist, Geist_Mono, Inter } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/navbar";
import { cn } from "@/lib/utils";
import Providers from "./providers";
import { Footer, NewsletterSection } from "@/components/home";
import { AssistantDialog } from "@/components/assistant/assistantDialog";
import { MobileNavbar } from "@/components/mobileNavbar/mobileNavbar";
import { ConditionalWrapper } from "@/components/ui/ConditionalWrapper";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { ProfessionalSidebar } from "./usuario/components/professionalSidebar";

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
        lang="en"
        className={cn(
          "antialiased",
          geistSans.variable,
          geistMono.variable,
          "font-sans",
          inter.variable,
        )}
      >
        <body className="flex flex-col relative">
          <SidebarProvider>
            <Suspense fallback={null}>
              <ProfessionalSidebar />
            </Suspense>
            <SidebarInset>
              <Navbar />
              <main className="flex flex-1 flex-col">{children}</main>
              <ConditionalWrapper paths={["/usuario"]}>
                <NewsletterSection />
                <Footer />
              </ConditionalWrapper>
              <AssistantDialog />
              <MobileNavbar />
            </SidebarInset>
          </SidebarProvider>
        </body>
      </html>
    </Providers>
  );
}
