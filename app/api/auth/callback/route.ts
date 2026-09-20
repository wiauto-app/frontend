import { NextRequest, NextResponse } from "next/server";

import {
  handleAuthSessionCallback,
  setAuthSessionCookies,
} from "@/lib/auth/handleAuthSessionCallback";
import { buildPopupCompleteUrl } from "./utils";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const token = searchParams.get("token");
  const refreshToken = searchParams.get("refresh_token");
  const type = searchParams.get("type");
  const message = searchParams.get("message");
  const isPopup = searchParams.get("popup") === "1";
  const provider = searchParams.get("provider");
  const status = searchParams.get("status");

  if (isPopup && status === "error") {
    return NextResponse.redirect(
      buildPopupCompleteUrl(provider, "error", message ?? "No se pudo iniciar sesión"),
    );
  }

  if (!token || !refreshToken || !type) {
    if (isPopup) {
      return NextResponse.redirect(
        buildPopupCompleteUrl(provider, "error", "No se pudo iniciar sesión"),
      );
    }

    return handleAuthSessionCallback({
      token,
      refreshToken,
      type,
      message,
      next: searchParams.get("next"),
    });
  }

  if (isPopup && type === "2fa_challenge") {
    await setAuthSessionCookies(token, refreshToken);
    return NextResponse.redirect(
      buildPopupCompleteUrl(provider, "2fa_required"),
    );
  }

  return handleAuthSessionCallback({
    token,
    refreshToken,
    type,
    message,
    next: searchParams.get("next"),
  });
}
