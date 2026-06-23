import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { cookiesConfig } from "@/config/cookies.config";

export const GET = async () => {
  const cookieStore = await cookies();
  const refreshToken = cookieStore.get(cookiesConfig.refreshToken.name);

  if (!refreshToken) {
    return NextResponse.json({ isLoggedIn: false });
  }

  return NextResponse.json({ isLoggedIn: true });
};
