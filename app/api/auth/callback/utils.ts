import { OAUTH_POPUP_COMPLETE_PATH } from "@/lib/auth/oauthPopup.constants";
import { FRONTEND_URL } from "@/constants";

export const buildPopupCompleteUrl = (
  provider: string | null,
  status: "success" | "error" | "2fa_required",
  message?: string | null,
): URL => {
  const url = new URL(OAUTH_POPUP_COMPLETE_PATH, FRONTEND_URL);

  if (provider) {
    url.searchParams.set("provider", provider);
  }

  url.searchParams.set("status", status);

  if (message) {
    url.searchParams.set("message", message);
  }

  return url;
};
