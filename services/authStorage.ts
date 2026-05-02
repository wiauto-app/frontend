const TOKEN_STORAGE_KEY = "wiauto_access_token";

export const authStorage = {
  getToken: (): string | null => {
    if (typeof window === "undefined") return null;
    return localStorage.getItem(TOKEN_STORAGE_KEY);
  },

  saveToken: (token: string): void => {
    if (typeof window === "undefined") return;
    localStorage.setItem(TOKEN_STORAGE_KEY, token);
  },

  clearToken: (): void => {
    if (typeof window === "undefined") return;
    localStorage.removeItem(TOKEN_STORAGE_KEY);
  },
};
