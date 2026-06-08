"use client";

import { GoogleIcon } from "@/components/icons/GoogleIcon";
import { OAuthButton } from "@/components/auth/OAuthButton";

type GoogleLoginProps = {
  disabled?: boolean;
  className?: string;
  iconClassName?: string;
  returnTo?: string;
  onSuccess?: () => void | Promise<void>;
};

export const GoogleLogin = ({
  disabled = false,
  className,
  iconClassName,
  returnTo,
  onSuccess,
}: GoogleLoginProps) => {
  return (
    <OAuthButton
      provider="google"
      disabled={disabled}
      className={className}
      returnTo={returnTo}
      onSuccess={onSuccess}
    >
      <GoogleIcon className={iconClassName} />
      Continuar con Google
    </OAuthButton>
  );
};
