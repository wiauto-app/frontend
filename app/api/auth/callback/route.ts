import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { cookiesConfig } from "@/config/cookies.config";
import { FRONTEND_URL } from "@/constants";
import { isValidReturnPath } from "@/lib/auth/authReturnTo";
import { buildPopupCompleteUrl } from "./utils";


export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const token = searchParams.get("token");
  const refreshToken = searchParams.get("refresh_token");
  const type = searchParams.get("type");
  const message = searchParams.get("message");
  const isPopup = searchParams.get("popup") === "1";
  console.log("isPopup", isPopup);
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
  const redirectUrl = cookieStore.get("redirect_url")?.value;
  cookieStore.set(cookiesConfig.accessToken.name, token, cookiesConfig.accessToken.options);
  cookieStore.set(cookiesConfig.refreshToken.name, refreshToken, cookiesConfig.refreshToken.options);

  if (type === "2fa_challenge") {
    if (isPopup) {
      return NextResponse.redirect(
        buildPopupCompleteUrl(provider, "2fa_required"),
      );
    }

    return NextResponse.redirect(new URL("/verificacion-2fa", FRONTEND_URL));
  }

  if (isPopup) {
    return NextResponse.redirect(new URL(redirectUrl as string, FRONTEND_URL));
  }

  if (message) {
    return NextResponse.redirect(new URL("/?verified=1", FRONTEND_URL));
  }

  const next = searchParams.get("next");
  const redirectPath =
    next && isValidReturnPath(next) ? next : "/";

  return NextResponse.redirect(new URL(redirectPath, FRONTEND_URL));
}
