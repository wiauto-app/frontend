"use client";

import { AppleIcon } from "@/components/icons/AppleIcon";
import { OAuthButton } from "@/components/auth/OAuthButton";

type AppleLoginProps = {
  disabled?: boolean;
  className?: string;
  iconClassName?: string;
  returnTo?: string;
  onSuccess?: () => void | Promise<void>;
};

export const AppleLogin = ({
  disabled = false,
  className,
  iconClassName,
  returnTo,
  onSuccess,
}: AppleLoginProps) => {
  return (
    <OAuthButton
      provider="apple"
      disabled={disabled}
      className={className}
      returnTo={returnTo}
      onSuccess={onSuccess}
    >
      <AppleIcon className={iconClassName} />
      Continuar con Apple ID
    </OAuthButton>
  );
};
