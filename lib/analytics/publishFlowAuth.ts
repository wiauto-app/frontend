import { analyticsService } from "@/services/analytics/analyticsService";
import {
  getMetaCookies,
  hasMarketingConsent,
  newEventId,
  track,
} from "@/lib/analytics/funnel";

const PUBLISH_AUTH_TRACKED_KEY = "wiauto_publish_auth_tracked";
const PUBLISH_FLOW_KEY = "wiauto_publish_auth_flow";

export const PUBLISH_AUTH_METHOD_KEY = "wiauto_publish_auth_method";

/** Ventana para tratar un OAuth recién creado como `new_user`. */
const NEW_ACCOUNT_WINDOW_MS = 2 * 60 * 1000;

export const isPublishFlowPath = (path?: string | null): boolean => {
  if (!path) {
    return false;
  }

  const pathname = path.split("?")[0] ?? "";
  return pathname === "/publicar";
};

export const markPublishFlowAuth = (): void => {
  try {
    sessionStorage.setItem(PUBLISH_FLOW_KEY, "1");
  } catch {
    // modo privado
  }
};

export const isMarkedPublishFlow = (): boolean => {
  try {
    return sessionStorage.getItem(PUBLISH_FLOW_KEY) === "1";
  } catch {
    return false;
  }
};

export const isRecentlyCreatedAccount = (createdAt?: string | null): boolean => {
  if (!createdAt) {
    return false;
  }

  const created = new Date(createdAt).getTime();
  if (!Number.isFinite(created)) {
    return false;
  }

  return Date.now() - created >= 0 && Date.now() - created < NEW_ACCOUNT_WINDOW_MS;
};

export const consumePublishAuthMethod = (): "email" | "google" | "apple" | null => {
  try {
    const value = sessionStorage.getItem(PUBLISH_AUTH_METHOD_KEY);
    sessionStorage.removeItem(PUBLISH_AUTH_METHOD_KEY);
    if (value === "google" || value === "apple" || value === "email") {
      return value;
    }
    return null;
  } catch {
    return null;
  }
};

export const trackPublishFlowAuth = async ({
  method,
  isNewUser,
}: {
  method: "email" | "google" | "apple";
  isNewUser: boolean;
}): Promise<void> => {
  if (typeof window === "undefined") {
    return;
  }

  if (sessionStorage.getItem(PUBLISH_AUTH_TRACKED_KEY)) {
    return;
  }

  sessionStorage.setItem(PUBLISH_AUTH_TRACKED_KEY, "1");

  const eventId = newEventId();
  const event = isNewUser ? "sign_up" : "login";

  track(
    event,
    { method, new_user: isNewUser },
    eventId,
  );

  if (!isNewUser) {
    return;
  }

  const { fbp, fbc } = getMetaCookies();

  try {
    await analyticsService.trackRegistration({
      eventId,
      pageUrl: window.location.href,
      consent: hasMarketingConsent(),
      method,
      ...(fbp ? { fbp } : {}),
      ...(fbc ? { fbc } : {}),
    });
  } catch {
    // no bloquear el flujo de publicación
  }
};

export const clearPublishAuthTracked = (): void => {
  try {
    sessionStorage.removeItem(PUBLISH_AUTH_TRACKED_KEY);
  } catch {
    // ignore
  }
};
