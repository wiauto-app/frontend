"use client";

import { AppleIcon } from "@/components/icons/AppleIcon";
import { OAuthButton } from "@/components/auth/OAuthButton";

interface AppleLoginProps {
  disabled?: boolean;
  className?: string;
  iconClassName?: string;
  returnTo?: string;
}

export const AppleLogin = ({
  disabled = false,
  className,
  iconClassName,
  returnTo,
}: AppleLoginProps) => {
  return (
    <OAuthButton
      provider="apple"
      disabled={disabled}
      className={className}
      returnTo={returnTo}
    >
      <AppleIcon className={iconClassName} />
      Continuar con Apple ID
    </OAuthButton>
  );
};
