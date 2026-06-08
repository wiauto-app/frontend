"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { useUser } from "@/app/contexts/auth/useUser";
import { Button } from "@/components/ui/button";
import { consumeAuthReturnTo, saveAuthReturnTo } from "@/lib/auth/authReturnTo";
import { oauthPopup } from "@/lib/auth/oauthPopup";
import {
  OAUTH_PROVIDERS,
  type OAuthProvider,
} from "@/lib/auth/oauthProviders";
import { cn } from "@/lib/utils";

type OAuthButtonProps = {
  provider: OAuthProvider;
  disabled?: boolean;
  className?: string;
  returnTo?: string;
  onSuccess?: () => void | Promise<void>;
  onError?: (reason: "closed" | "timeout" | "error", message?: string) => void;
  children: React.ReactNode;
};

export const OAuthButton = ({
  provider,
  disabled = false,
  className,
  returnTo,
  onSuccess,
  onError,
  children,
}: OAuthButtonProps) => {
  const router = useRouter();
  const { refreshUser } = useUser();
  const [isLoading, setIsLoading] = useState(false);

  const providerConfig = OAUTH_PROVIDERS[provider];

  const handleClick = async () => {
    if (disabled || isLoading) {
      return;
    }

    saveAuthReturnTo(returnTo ?? window.location.pathname);
    setIsLoading(true);

    try {
      const result = await oauthPopup({
        url: providerConfig.getUrl(true),
        successEvent: providerConfig.successEvent,
        errorEvent: providerConfig.errorEvent,
      });

      if (!result.success) {
        if (result.reason === "closed") {
          return;
        }

        const message = result.message ?? "No se pudo iniciar sesión";
        toast.error(message);
        onError?.(result.reason, result.message);
        return;
      }

      await refreshUser();
      router.refresh();

      const returnPath = consumeAuthReturnTo();

      if (returnPath && returnPath !== window.location.pathname) {
        router.replace(returnPath);
      }

      await onSuccess?.();
    } catch {
      toast.error("No se pudo iniciar sesión");
      onError?.("error");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      type="button"
      variant="outline"
      size="lg"
      className={cn("flex-1", className)}
      disabled={disabled || isLoading}
      onClick={handleClick}
    >
      {children}
    </Button>
  );
};
