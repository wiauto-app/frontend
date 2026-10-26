"use client";

import type { TurnstileInstance } from "@marsidev/react-turnstile";
import { useCallback, useRef, useState } from "react";
import { toast } from "sonner";

import {
  buildTurnstilePayload,
  isTurnstileEnabled,
} from "@/components/forms/TurnstileField";

export const useTurnstileField = () => {
  const turnstileRef = useRef<TurnstileInstance>(null);
  const [token, setToken] = useState("");

  const resetTurnstile = useCallback(() => {
    setToken("");
    turnstileRef.current?.reset();
  }, []);

  const requireToken = useCallback((): boolean => {
    if (!isTurnstileEnabled()) {
      return true;
    }
    if (!token.trim()) {
      toast.error("Completa la verificación de seguridad antes de enviar");
      return false;
    }
    return true;
  }, [token]);

  const getPayload = useCallback(() => buildTurnstilePayload(token), [token]);

  return {
    turnstileRef,
    setTurnstileToken: setToken,
    resetTurnstile,
    requireToken,
    getPayload,
  };
};
