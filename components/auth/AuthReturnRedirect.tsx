"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

import { consumeAuthReturnTo } from "@/lib/auth/authReturnTo";

export const AuthReturnRedirect = () => {
  const router = useRouter();

  useEffect(() => {
    if (typeof window !== "undefined" && window.opener) {
      return;
    }

    const path = consumeAuthReturnTo();

    if (path) {
      router.replace(path);
    }
  }, [router]);

  return null;
};
