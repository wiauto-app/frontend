import { authService } from "@/services/authService";

import { OAUTH_EVENTS } from "./oauthPopup";

export type OAuthProvider = "google" | "apple";

export const OAUTH_PROVIDERS: Record<
  OAuthProvider,
  {
    getUrl: (popup?: boolean) => string;
    successEvent: (typeof OAUTH_EVENTS)[keyof typeof OAUTH_EVENTS];
    errorEvent: (typeof OAUTH_EVENTS)[keyof typeof OAUTH_EVENTS];
  }
> = {
  google: {
    getUrl: (popup = true) => authService.googleLogin({ popup }),
    successEvent: OAUTH_EVENTS.GOOGLE_LOGIN_SUCCESS,
    errorEvent: OAUTH_EVENTS.GOOGLE_LOGIN_ERROR,
  },
  apple: {
    getUrl: (popup = true) => authService.appleLogin({ popup }),
    successEvent: OAUTH_EVENTS.APPLE_LOGIN_SUCCESS,
    errorEvent: OAUTH_EVENTS.APPLE_LOGIN_ERROR,
  },
};
