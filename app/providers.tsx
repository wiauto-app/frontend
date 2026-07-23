"use client";
import { Toaster } from "sonner";
import { AuthProvider } from "./contexts/auth/authProvider";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AuthReturnRedirect } from "@/components/auth/AuthReturnRedirect";
import { NotificationSocketProvider } from "@/components/notifications/context/notificationSocketContext";

const queryClient = new QueryClient();

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <AuthReturnRedirect />
      <QueryClientProvider client={queryClient}>
        <NotificationSocketProvider>
          {children}
          <Toaster richColors position="top-right" />
        </NotificationSocketProvider>
      </QueryClientProvider>
    </AuthProvider>
  );
}
