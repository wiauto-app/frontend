

export const cookiesConfig = {
  name: "access_token",
  options: {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60 * 24 * 30, // 30 days
    path: "/",
  },
  refreshTokenName: "refresh_token",
}