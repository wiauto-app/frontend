export const AUTH_RETURN_TO_KEY = "wiauto_auth_return_to";

// Caracteres de control (tab/CR/LF…) que el parser de URL elimina: "/\t/evil.com" → "//evil.com".
const hasControlChars = (value: string): boolean => {
  for (let index = 0; index < value.length; index += 1) {
    const code = value.charCodeAt(index);
    if (code <= 0x1f || code === 0x7f) {
      return true;
    }
  }
  return false;
};

/**
 * Solo rutas relativas al propio origen (se permite querystring, p. ej. `/publicar?step=2`).
 * Rechaza URLs absolutas y protocol-relative (`//host`, `/\host`, que el navegador normaliza a `//host`).
 */
export const isValidReturnPath = (path: string): boolean =>
  path.startsWith("/") &&
  !path.startsWith("//") &&
  !path.startsWith("/\\") &&
  !hasControlChars(path);

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
