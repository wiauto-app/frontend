"use client";

import { GoogleIcon } from "@/components/icons/GoogleIcon";
import { OAuthButton } from "@/components/auth/OAuthButton";

interface GoogleLoginProps {
  disabled?: boolean;
  className?: string;
  iconClassName?: string;
  returnTo?: string;
}

export const GoogleLogin = ({
  disabled = false,
  className,
  iconClassName,
  returnTo,
}: GoogleLoginProps) => {
  return (
    <OAuthButton
      provider="google"
      disabled={disabled}
      className={className}
      returnTo={returnTo}
    >
      <GoogleIcon className={iconClassName} />
      Continuar con Google
    </OAuthButton>
  );
};
