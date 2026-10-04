"use client";

import { GoogleIcon } from "@/components/icons/GoogleIcon";
import { OAuthButton } from "@/components/auth/OAuthButton";

interface GoogleLoginProps {
  disabled?: boolean;
  className?: string;
  iconClassName?: string;
  returnTo?: string;
  /** Texto del botón (`auth.compartido.boton_google`). */
  label?: string | null;
}

export const GoogleLogin = ({
  disabled = false,
  className,
  iconClassName,
  returnTo,
  label,
}: GoogleLoginProps) => {
  return (
    <OAuthButton
      provider="google"
      disabled={disabled}
      className={className}
      returnTo={returnTo}
    >
      <GoogleIcon className={iconClassName} />
      {label || "Continuar con Google"}
    </OAuthButton>
  );
};
