import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

import { cookiesConfig } from "@/config/cookies.config";
import { FRONTEND_URL } from "@/constants";
import { isValidReturnPath } from "@/lib/auth/authReturnTo";
import { buildPopupCompleteUrl } from "./utils";

const resolvePostLoginPath = (
  redirectUrl: string | undefined,
  next: string | null,
): string => {
  if (redirectUrl && isValidReturnPath(redirectUrl)) {
    return redirectUrl;
  }

  if (next && isValidReturnPath(next)) {
    return next;
  }

  return "/";
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

    const loginError = new URL("/iniciar-sesion", FRONTEND_URL);
    loginError.searchParams.set(
      "error",
      message ?? "No se pudo iniciar sesión",
    );
    return NextResponse.redirect(loginError);
  }

  const cookieStore = await cookies();
  const redirectUrl = cookieStore.get(cookiesConfig.redirectUrl.name)?.value;

  cookieStore.set(
    cookiesConfig.accessToken.name,
    token,
    cookiesConfig.accessToken.options,
  );
  cookieStore.set(
    cookiesConfig.refreshToken.name,
    refreshToken,
    cookiesConfig.refreshToken.options,
  );
  cookieStore.delete({
    name: cookiesConfig.redirectUrl.name,
    path: cookiesConfig.redirectUrl.options.path,
    domain: cookiesConfig.redirectUrl.options.domain,
  });

  if (type === "2fa_challenge") {
    if (isPopup) {
      return NextResponse.redirect(
        buildPopupCompleteUrl(provider, "2fa_required"),
      );
    }

    return NextResponse.redirect(new URL("/verificacion-2fa", FRONTEND_URL));
  }

  if (message) {
    return NextResponse.redirect(new URL("/?verified=1", FRONTEND_URL));
  }

  const redirectPath = resolvePostLoginPath(
    redirectUrl,
    searchParams.get("next"),
  );

  return NextResponse.redirect(new URL(redirectPath, FRONTEND_URL));
}
