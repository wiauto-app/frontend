import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { cookiesConfig } from "@/config/cookies.config";
import { FRONTEND_URL } from "@/constants";
import { isValidReturnPath } from "@/lib/auth/authReturnTo";
import { OAUTH_POPUP_COMPLETE_PATH } from "@/lib/auth/oauthPopup.constants";

const buildPopupCompleteUrl = (
  provider: string | null,
  status: "success" | "error",
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

    if (!token) {
      return NextResponse.json({ error: "Token not found" }, { status: 400 });
    }

    if (!refreshToken) {
      return NextResponse.json({ error: "Refresh token not found" }, { status: 400 });
    }

    return NextResponse.json({ error: "Type not found" }, { status: 400 });
  }

  const cookieStore = await cookies();
  cookieStore.set(cookiesConfig.accessToken.name, token, cookiesConfig.accessToken.options);
  cookieStore.set(cookiesConfig.refreshToken.name, refreshToken, cookiesConfig.refreshToken.options);

  if (type === "2fa_challenge") {
    if (isPopup) {
      return NextResponse.redirect(
        buildPopupCompleteUrl(provider, "error", "No se pudo iniciar sesión"),
      );
    }

    return NextResponse.redirect(new URL("/2fa-challenge", FRONTEND_URL));
  }

  if (isPopup) {
    return NextResponse.redirect(buildPopupCompleteUrl(provider, "success"));
  }

  if (message) {
    return NextResponse.redirect(new URL("/?verified=1", FRONTEND_URL));
  }

  const next = searchParams.get("next");
  const redirectPath =
    next && isValidReturnPath(next) ? next : "/";

  return NextResponse.redirect(new URL(redirectPath, FRONTEND_URL));
}
