"use client";

import { useEffect, useState } from "react";

import { publishOAuthChannel } from "@/lib/auth/oauthChannel";
import { OAUTH_EVENTS } from "@/lib/auth/oauthPopup";

const PROVIDER_EVENTS = {
  google: {
    success: OAUTH_EVENTS.GOOGLE_LOGIN_SUCCESS,
    error: OAUTH_EVENTS.GOOGLE_LOGIN_ERROR,
    twoFactor: OAUTH_EVENTS.GOOGLE_LOGIN_2FA_REQUIRED,
  },
  apple: {
    success: OAUTH_EVENTS.APPLE_LOGIN_SUCCESS,
    error: OAUTH_EVENTS.APPLE_LOGIN_ERROR,
    twoFactor: OAUTH_EVENTS.APPLE_LOGIN_2FA_REQUIRED,
  },
} as const;

type OAuthProviderKey = keyof typeof PROVIDER_EVENTS;

const isOAuthProvider = (value: string | null): value is OAuthProviderKey =>
  value === "google" || value === "apple";

const POST_MESSAGE_RETRIES = 3;
const POST_MESSAGE_RETRY_DELAY_MS = 100;
const CLOSE_RETRIES = 5;
const CLOSE_RETRY_DELAY_MS = 200;
const CLOSE_FAIL_DELAY_MS = 1000;

export default function OAuthPopupCompletePage() {
  const [showManualCloseMessage, setShowManualCloseMessage] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const provider = params.get("provider");
    const status = params.get("status");
    const message = params.get("message");

    if (!isOAuthProvider(provider)) {
      return;
    }

    const events = PROVIDER_EVENTS[provider];
    const eventType =
      status === "success"
        ? events.success
        : status === "2fa_required"
          ? events.twoFactor
          : events.error;
    const payload = {
      type: eventType,
      message: message ?? undefined,
    };
    const targetOrigin = window.location.origin;

    publishOAuthChannel(payload);

    if (window.opener) {
      let retryCount = 0;

      const postMessageToOpener = () => {
        window.opener?.postMessage(payload, targetOrigin);
      };

      const retryPostMessage = () => {
        postMessageToOpener();

        if (retryCount < POST_MESSAGE_RETRIES) {
          retryCount += 1;
          window.setTimeout(retryPostMessage, POST_MESSAGE_RETRY_DELAY_MS);
        }
      };

      retryPostMessage();
    }

    let closeAttempts = 0;

    const tryClose = () => {
      window.close();
      closeAttempts += 1;

      if (!window.closed && closeAttempts < CLOSE_RETRIES) {
        window.setTimeout(tryClose, CLOSE_RETRY_DELAY_MS);
      }
    };

    tryClose();

    const failTimer = window.setTimeout(() => {
      if (!window.closed) {
        setShowManualCloseMessage(true);
      }
    }, CLOSE_FAIL_DELAY_MS);

    return () => {
      window.clearTimeout(failTimer);
    };
  }, []);

  return (
    <main className="flex min-h-screen items-center justify-center bg-white p-6">
      <p className="text-sm text-gray-600">
        {showManualCloseMessage
          ? "Sesión iniciada. Puedes cerrar esta pestaña."
          : "Cerrando..."}
      </p>
    </main>
  );
}
