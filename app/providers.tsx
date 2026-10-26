"use client";
import { Toaster } from "sonner";
import { AuthProvider } from "./contexts/auth/authProvider";
import { FavoritesProvider } from "./contexts/favorites/favoritesProvider";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AuthReturnRedirect } from "@/components/auth/AuthReturnRedirect";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { CookieConsentProvider } from "@/components/consent/cookieConsentProvider";
import { DeferredOneTapSignIn } from "@/components/providers/DeferredOneTapSignIn";
import { AuthenticatedNotificationSocketProvider } from "@/components/providers/AuthenticatedNotificationSocketProvider";

const queryClient = new QueryClient();

export default function Providers({ children }: { children: React.ReactNode }) {
  const isMobile = useMediaQuery("(max-width: 768px)");
  return (
    <AuthProvider>
      <DeferredOneTapSignIn />
      <AuthReturnRedirect />
      <QueryClientProvider client={queryClient}>
        <FavoritesProvider>
          <AuthenticatedNotificationSocketProvider>
            <CookieConsentProvider>
              {children}
              <Toaster
                richColors
                position={isMobile ? "bottom-center" : "top-right"}
              />
            </CookieConsentProvider>
          </AuthenticatedNotificationSocketProvider>
        </FavoritesProvider>
      </QueryClientProvider>
    </AuthProvider>
  );
}
