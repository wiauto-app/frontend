"use client";

import { Turnstile, type TurnstileInstance } from "@marsidev/react-turnstile";
import type { RefObject } from "react";

import { TURNSTILE_SITE_KEY } from "@/constants/external.constant";

export const TURNSTILE_FIELD = "turnstile_token";

export const isTurnstileEnabled = (): boolean =>
  Boolean(TURNSTILE_SITE_KEY?.trim());

export const buildTurnstilePayload = (
  token: string | null | undefined,
): { turnstile_token?: string } => {
  const trimmed = token?.trim();
  return trimmed ? { turnstile_token: trimmed } : {};
};

interface TurnstileFieldProps {
  turnstileRef?: RefObject<TurnstileInstance | null>;
  onSuccess: (token: string) => void;
  onExpire?: () => void;
  onError?: () => void;
  className?: string;
}

export const TurnstileField = ({
  turnstileRef,
  onSuccess,
  onExpire,
  onError,
  className,
}: TurnstileFieldProps) => {
  if (!isTurnstileEnabled()) {
    return null;
  }

  return (
    <div className={className}>
      <Turnstile
        ref={turnstileRef}
        siteKey={TURNSTILE_SITE_KEY}
        onSuccess={onSuccess}
        onExpire={() => {
          onExpire?.();
          onSuccess("");
        }}
        onError={() => {
          onError?.();
          onSuccess("");
        }}
        options={{
          theme: "auto",
          size: "flexible",
        }}
      />
    </div>
  );
};
