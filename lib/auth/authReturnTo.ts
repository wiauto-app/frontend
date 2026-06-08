export const AUTH_RETURN_TO_KEY = "wiauto_auth_return_to";

export const isValidReturnPath = (path: string): boolean =>
  path.startsWith("/") && !path.startsWith("//");

export const saveAuthReturnTo = (path: string): void => {
  if (typeof window === "undefined") {
    return;
  }

  if (!isValidReturnPath(path)) {
    return;
  }

  sessionStorage.setItem(AUTH_RETURN_TO_KEY, path);
};

export const consumeAuthReturnTo = (): string | null => {
  if (typeof window === "undefined") {
    return null;
  }

  const path = sessionStorage.getItem(AUTH_RETURN_TO_KEY);

  if (!path) {
    return null;
  }

  sessionStorage.removeItem(AUTH_RETURN_TO_KEY);

  if (!isValidReturnPath(path)) {
    return null;
  }

  return path;
};
