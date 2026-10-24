import { CLARITY_PROJECT_ID } from "@/constants/external.constant";
import type { ClarityFunction } from "@/lib/analytics/window-globals";

const CLARITY_SCRIPT_ID = "microsoft-clarity";

let loadPromise: Promise<void> | null = null;

const installClarityStub = (): void => {
  if (typeof window === "undefined" || window.clarity) {
    return;
  }

  const clarity = ((...args: unknown[]) => {
    (clarity.q = clarity.q ?? []).push(args);
  }) as ClarityFunction;

  window.clarity = clarity;
};

/** Descarga el tag de Microsoft Clarity una sola vez. */
export const ensureClarityLoaded = (): Promise<void> => {
  if (!CLARITY_PROJECT_ID || typeof window === "undefined") {
    return Promise.resolve();
  }

  installClarityStub();

  if (document.getElementById(CLARITY_SCRIPT_ID)) {
    return loadPromise ?? Promise.resolve();
  }

  if (!loadPromise) {
    loadPromise = new Promise((resolve, reject) => {
      const script = document.createElement("script");
      script.id = CLARITY_SCRIPT_ID;
      script.async = true;
      script.src = `https://www.clarity.ms/tag/${CLARITY_PROJECT_ID}`;
      script.onload = () => resolve();
      script.onerror = () => {
        loadPromise = null;
        reject(new Error("No se pudo cargar Microsoft Clarity"));
      };

      const firstScript = document.getElementsByTagName("script")[0];
      if (firstScript?.parentNode) {
        firstScript.parentNode.insertBefore(script, firstScript);
      } else {
        document.head.appendChild(script);
      }
    });
  }

  return loadPromise;
};
