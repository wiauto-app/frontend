import { META_PIXEL_ID } from "@/constants/external.constant";
import type { MetaFbqFunction } from "@/lib/analytics/window-globals";

interface MetaFbqStub extends MetaFbqFunction {
  queue: unknown[][];
  loaded: boolean;
  version: string;
  push: (item: unknown[]) => number;
}

const META_PIXEL_SCRIPT_ID = "meta-pixel-sdk";
const META_PIXEL_SRC = "https://connect.facebook.net/en_US/fbevents.js";

let loadPromise: Promise<void> | null = null;
let isInitialized = false;

const installFbqStub = (): void => {
  if (typeof window === "undefined" || window.fbq) {
    return;
  }

  const queue: unknown[][] = [];
  const fbq = ((
    action: string,
    event: string,
    params?: Record<string, unknown>,
    options?: { eventID: string },
  ) => {
    queue.push([action, event, params, options].filter((x) => x !== undefined));
  }) as MetaFbqStub;

  fbq.queue = queue;
  fbq.loaded = true;
  fbq.version = "2.0";
  fbq.push = queue.push.bind(queue);

  window.fbq = fbq;
  window._fbq = fbq;
};

/** Descarga `fbevents.js` una sola vez e inicializa el pixel (sin PageView). */
export const ensureMetaPixelLoaded = (): Promise<void> => {
  if (!META_PIXEL_ID || typeof window === "undefined") {
    return Promise.resolve();
  }

  installFbqStub();

  if (isInitialized) {
    return Promise.resolve();
  }

  if (document.getElementById(META_PIXEL_SCRIPT_ID)) {
    return loadPromise ?? Promise.resolve();
  }

  if (!loadPromise) {
    loadPromise = new Promise((resolve, reject) => {
      const script = document.createElement("script");
      script.id = META_PIXEL_SCRIPT_ID;
      script.async = true;
      script.src = META_PIXEL_SRC;
      script.onload = () => {
        const pixelId = META_PIXEL_ID;
        if (!isInitialized && window.fbq && pixelId) {
          window.fbq("consent", "revoke");
          window.fbq("init", pixelId);
          isInitialized = true;
        }
        resolve();
      };
      script.onerror = () => {
        loadPromise = null;
        reject(new Error("No se pudo cargar el pixel de Meta"));
      };
      document.head.appendChild(script);
    });
  }

  return loadPromise;
};
