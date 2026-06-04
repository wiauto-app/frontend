export const cookiesConfig = {
  accessToken: {
    name: "access_token",
    options: {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "none" as const,
      maxAge: 60 * 15, // 15 minutos
      path: "/",
    },
  },
  refreshToken: {
    name: "refresh_token",
    options: {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "none" as const,
      maxAge: 60 * 60 * 24 * 30, // 30 días
      path: "/",
    },
  },
};