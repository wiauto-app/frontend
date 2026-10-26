"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";

const OneTapSignIn = dynamic(
  () =>
    import("@/components/oneTapSignIn").then((mod) => mod.OneTapSignIn),
  { ssr: false },
);

export const DeferredOneTapSignIn = () => {
  const [shouldMount, setShouldMount] = useState(false);

  useEffect(() => {
    if (typeof window.requestIdleCallback === "function") {
      const idle_id = window.requestIdleCallback(() => setShouldMount(true), {
        timeout: 3000,
      });
      return () => window.cancelIdleCallback(idle_id);
    }

    const timeout_id = window.setTimeout(() => setShouldMount(true), 2000);
    return () => window.clearTimeout(timeout_id);
  }, []);

  if (!shouldMount) {
    return null;
  }

  return <OneTapSignIn />;
};
