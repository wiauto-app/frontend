"use client";

import { useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  OAUTH_PROVIDERS,
  type OAuthProvider,
} from "@/lib/auth/oauthProviders";
import { cn } from "@/lib/utils";
import { saveRedirectUrlAction } from "./saveRedirectUrlAction";
import { useRouter } from "next/navigation";

interface OAuthButtonProps {
  provider: OAuthProvider;
  disabled?: boolean;
  className?: string;
  returnTo?: string;
  children: React.ReactNode;
}

export const OAuthButton = ({
  provider,
  disabled = false,
  className,
  returnTo,
  children,
}: OAuthButtonProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const providerConfig = OAUTH_PROVIDERS[provider];
  const router = useRouter();
  const handleClick = async () => {
    if (disabled || isLoading) {
      return;
    } 

    setIsLoading(true);

    try {
      const redirectPath = returnTo ?? window.location.pathname;
      await saveRedirectUrlAction(redirectPath);
      const url = providerConfig.getUrl(false);
      console.log("url", url);
      router.push(url);
    } catch {
      setIsLoading(false);
      toast.error("No se pudo iniciar sesión");
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
      aria-busy={isLoading}
    >
      {children}
    </Button>
  );
};
