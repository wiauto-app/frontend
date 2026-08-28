"use client";
import { Toaster } from "sonner";
import { AuthProvider } from "./contexts/auth/authProvider";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AuthReturnRedirect } from "@/components/auth/AuthReturnRedirect";
import { NotificationSocketProvider } from "@/components/notifications/context/notificationSocketContext";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { GoogleAnalytics } from "@next/third-parties/google";
const queryClient = new QueryClient();

export default function Providers({ children }: { children: React.ReactNode }) {
  const isMobile = useMediaQuery("(max-width: 768px)");
  return (
    <AuthProvider>
      <AuthReturnRedirect />
      <QueryClientProvider client={queryClient}>
        <NotificationSocketProvider>
          {children}
          <GoogleAnalytics gaId="G-XYZ" />
          <Toaster richColors position={isMobile ? "bottom-center" : "top-right"} />
        </NotificationSocketProvider>
      </QueryClientProvider>
    </AuthProvider>
  );
}
