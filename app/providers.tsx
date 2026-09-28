"use client";
import { Toaster } from "sonner";
import { AuthProvider } from "./contexts/auth/authProvider";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AuthReturnRedirect } from "@/components/auth/AuthReturnRedirect";
import { NotificationSocketProvider } from "@/components/notifications/context/notificationSocketContext";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { CookieConsentProvider } from "@/components/consent/cookieConsentProvider";
import { OneTapSignIn } from "@/components/oneTapSignIn";
const queryClient = new QueryClient();

export default function Providers({ children }: { children: React.ReactNode }) {
  const isMobile = useMediaQuery("(max-width: 768px)");
  return (
    <AuthProvider>
      <OneTapSignIn />
      <AuthReturnRedirect />
      <QueryClientProvider client={queryClient}>
        <NotificationSocketProvider>
          <CookieConsentProvider>
            {children}
            <Toaster
              richColors
              position={isMobile ? "bottom-center" : "top-right"}
            />
          </CookieConsentProvider>
        </NotificationSocketProvider>
      </QueryClientProvider>
    </AuthProvider>
  );
}
