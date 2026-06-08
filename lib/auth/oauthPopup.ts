import { FRONTEND_URL } from "@/constants";

import {
  subscribeOAuthChannel,
  type OAuthChannelMessage,
} from "./oauthChannel";

export type OAuthPopupResult =
  | { success: true }
  | {
      success: false;
      reason: "closed" | "timeout" | "error";
      message?: string;
    };

export const OAUTH_EVENTS = {
  GOOGLE_LOGIN_SUCCESS: "GOOGLE_LOGIN_SUCCESS",
  GOOGLE_LOGIN_ERROR: "GOOGLE_LOGIN_ERROR",
  APPLE_LOGIN_SUCCESS: "APPLE_LOGIN_SUCCESS",
  APPLE_LOGIN_ERROR: "APPLE_LOGIN_ERROR",
} as const;

const DEFAULT_TIMEOUT_MS = 1000 * 60 * 5;

const getPopupOrigin = (): string => {
  if (typeof window !== "undefined") {
    return window.location.origin;
  }

  return FRONTEND_URL?.replace(/\/$/, "") ?? "";
};

const openOAuthTab = (url: string): Window | null => window.open(url, "_blank");

export const oauthPopup = async (options: {
  url: string;
  successEvent: string;
  errorEvent?: string;
  timeoutMs?: number;
}): Promise<OAuthPopupResult> => {
  const { url, successEvent, errorEvent, timeoutMs = DEFAULT_TIMEOUT_MS } = options;
  const expectedOrigin = getPopupOrigin();

  const tab = openOAuthTab(url);

  if (!tab) {
    return {
      success: false,
      reason: "error",
      message: "No se pudo abrir la pestaña de inicio de sesión",
    };
  }

  return new Promise<OAuthPopupResult>((resolve) => {
    let settled = false;

    const cleanup = (
      messageListener: (event: MessageEvent<OAuthChannelMessage>) => void,
      unsubscribeChannel: () => void,
      pollIntervalId: ReturnType<typeof setInterval>,
      timeoutId: ReturnType<typeof setTimeout>,
    ) => {
      window.removeEventListener("message", messageListener);
      unsubscribeChannel();
      clearInterval(pollIntervalId);
      clearTimeout(timeoutId);
    };

    const finish = (
      result: OAuthPopupResult,
      messageListener: (event: MessageEvent<OAuthChannelMessage>) => void,
      unsubscribeChannel: () => void,
      pollIntervalId: ReturnType<typeof setInterval>,
      timeoutId: ReturnType<typeof setTimeout>,
    ) => {
      if (settled) {
        return;
      }

      settled = true;
      cleanup(messageListener, unsubscribeChannel, pollIntervalId, timeoutId);

      if (!tab.closed) {
        tab.close();
      }

      resolve(result);
    };

    const handleOAuthEvent = (data: OAuthChannelMessage) => {
      if (data.type === successEvent) {
        finish({ success: true }, handleMessage, unsubscribeChannel, pollIntervalId, timeoutId);
        return;
      }

      if (errorEvent && data.type === errorEvent) {
        finish(
          {
            success: false,
            reason: "error",
            message: data.message,
          },
          handleMessage,
          unsubscribeChannel,
          pollIntervalId,
          timeoutId,
        );
      }
    };

    const handleMessage = (event: MessageEvent<OAuthChannelMessage>) => {
      if (event.origin !== expectedOrigin) {
        return;
      }

      handleOAuthEvent(event.data);
    };

    const unsubscribeChannel = subscribeOAuthChannel(handleOAuthEvent);

    const pollIntervalId = setInterval(() => {
      if (tab.closed) {
        finish(
          { success: false, reason: "closed" },
          handleMessage,
          unsubscribeChannel,
          pollIntervalId,
          timeoutId,
        );
      }
    }, 500);

    const timeoutId = setTimeout(() => {
      finish(
        { success: false, reason: "timeout" },
        handleMessage,
        unsubscribeChannel,
        pollIntervalId,
        timeoutId,
      );
    }, timeoutMs);

    window.addEventListener("message", handleMessage);
  });
};
