const PENDING_REFERRAL_CODE_KEY = "wiauto_pending_referral_code";
const POST_REGISTER_REFERRAL_CODE_KEY = "wiauto_post_register_referral_code";
const THIRTY_DAYS_MS = 30 * 24 * 60 * 60 * 1000;

interface StoredReferralCode {
  code: string;
  saved_at: number;
}

const readStored = (key: string): string | null => {
  if (typeof window === "undefined") {
    return null;
  }

  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) {
      return null;
    }

    const parsed = JSON.parse(raw) as StoredReferralCode;
    if (!parsed.code || !parsed.saved_at) {
      return null;
    }

    if (Date.now() - parsed.saved_at > THIRTY_DAYS_MS) {
      window.localStorage.removeItem(key);
      return null;
    }

    return parsed.code.trim().toUpperCase();
  } catch {
    return null;
  }
};

const writeStored = (key: string, code: string) => {
  if (typeof window === "undefined") {
    return;
  }

  const payload: StoredReferralCode = {
    code: code.trim().toUpperCase(),
    saved_at: Date.now(),
  };

  window.localStorage.setItem(key, JSON.stringify(payload));
};

export const persistPendingReferralCode = (code: string) => {
  if (!code.trim()) {
    return;
  }

  writeStored(PENDING_REFERRAL_CODE_KEY, code);
};

export const consumePendingReferralCode = (): string | null => {
  const code = readStored(PENDING_REFERRAL_CODE_KEY);
  if (!code || typeof window === "undefined") {
    return code;
  }

  window.localStorage.removeItem(PENDING_REFERRAL_CODE_KEY);
  return code;
};

export const getPendingReferralCode = (): string | null =>
  readStored(PENDING_REFERRAL_CODE_KEY);

export const clearPendingReferralCode = () => {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.removeItem(PENDING_REFERRAL_CODE_KEY);
};

export const savePostRegisterReferralCode = (code: string) => {
  if (!code.trim()) {
    return;
  }

  writeStored(POST_REGISTER_REFERRAL_CODE_KEY, code);
};

export const consumePostRegisterReferralCode = (): string | null => {
  const code = readStored(POST_REGISTER_REFERRAL_CODE_KEY);
  if (!code || typeof window === "undefined") {
    return code;
  }

  window.localStorage.removeItem(POST_REGISTER_REFERRAL_CODE_KEY);
  return code;
};
