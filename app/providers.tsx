"use client";
import { Toaster } from "sonner";
import { AuthProvider } from "./contexts/auth/authProvider";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AuthReturnRedirect } from "@/components/auth/AuthReturnRedirect";

const queryClient = new QueryClient();

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <AuthReturnRedirect />
        {children}
      </AuthProvider>
      <Toaster richColors position="top-right" />
    </QueryClientProvider>
  )
}