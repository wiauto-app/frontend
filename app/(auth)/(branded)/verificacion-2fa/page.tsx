"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { TwoFactorLoginStep } from "@/app/(auth)/components/TwoFactorLoginStep";
import { useUser } from "@/app/contexts/auth/useUser";
import { AUTH_ROUTES } from "@/constants/auth.constants";
import { authService } from "@/services/authService";

export default function Verificacion2faPage() {
  const router = useRouter();
  const { refreshUser } = useUser();
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadChallenge = async () => {
      try {
        const response = await authService.getTwoFactorChallenge();

        if (!response.ok || response.data?.type !== "2fa_required") {
          router.replace(AUTH_ROUTES.LOGIN);
          return;
        }

        setEmail(response.data.email);
      } catch {
        router.replace(AUTH_ROUTES.LOGIN);
      } finally {
        setIsLoading(false);
      }
    };

    void loadChallenge();
  }, [router]);

  const handleSuccess = async () => {
    await refreshUser();
    toast.success("Sesión iniciada correctamente");
    router.replace("/");
    router.refresh();
  };

  const handleBack = async () => {
    router.replace(AUTH_ROUTES.LOGIN);
  };

  if (isLoading) {
    return (
      <p className="text-center text-sm text-gray-600">
        Cargando verificación...
      </p>
    );
  }

  return (
    <TwoFactorLoginStep
      email={email}
      onSuccess={handleSuccess}
      onBack={handleBack}
    />
  );
}
