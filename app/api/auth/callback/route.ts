import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { cookiesConfig } from "@/config/cookies.config";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const token = searchParams.get("token");
  const refreshToken = searchParams.get("refresh_token");
  const type = searchParams.get("type");
  if (!token) {
    return NextResponse.json({ error: "Token not found" }, { status: 400 });
  }

  if (!refreshToken) {
    return NextResponse.json({ error: "Refresh token not found" }, { status: 400 });
  }

  if (!type) {
    return NextResponse.json({ error: "Type not found" }, { status: 400 });
  }

  const cookieStore = await cookies();
  cookieStore.set(cookiesConfig.name, token, cookiesConfig.options);
  cookieStore.set(cookiesConfig.refreshTokenName, refreshToken, cookiesConfig.options);

  if (type === "2fa_challenge") {
    return NextResponse.redirect(new URL("/2fa-challenge", request.url));
  }

  return NextResponse.redirect(new URL("/", request.url));
}