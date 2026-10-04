"use client";

import { AppleIcon } from "@/components/icons/AppleIcon";
import { OAuthButton } from "@/components/auth/OAuthButton";

interface AppleLoginProps {
  disabled?: boolean;
  className?: string;
  iconClassName?: string;
  returnTo?: string;
  /** Texto del botón (`auth.compartido.boton_apple`). */
  label?: string | null;
}

export const AppleLogin = ({
  disabled = false,
  className,
  iconClassName,
  returnTo,
  label,
}: AppleLoginProps) => {
  return (
    <OAuthButton
      provider="apple"
      disabled={disabled}
      className={className}
      returnTo={returnTo}
    >
      <AppleIcon className={iconClassName} />
      {label || "Continuar con Apple ID"}
    </OAuthButton>
  );
};
