import { META_PIXEL_ID } from "@/constants/external.constant";
import type { MetaFbqFunction } from "@/lib/analytics/window-globals";

interface MetaFbqStub extends MetaFbqFunction {
  callMethod?: (...args: unknown[]) => void;
  queue: ArrayLike<unknown>[];
  loaded: boolean;
  version: string;
  push: MetaFbqStub;
}

const META_PIXEL_SCRIPT_ID = "meta-pixel-sdk";
const META_PIXEL_SRC = "https://connect.facebook.net/en_US/fbevents.js";

let loadPromise: Promise<void> | null = null;
let isInitialized = false;

/**
 * Stub base oficial de Meta Pixel.
 *
 * `fbevents.js` asigna `callMethod` a esta misma función y drena `queue`.
 * Si el stub solo hace `queue.push`, `init` y `track` nunca se envían.
 *
 * @see https://developers.facebook.com/docs/meta-pixel/get-started
 */
export const installMetaFbqStub = (): void => {
  if (typeof window === "undefined" || window.fbq) {
    return;
  }

  let fbq: MetaFbqStub;
  fbq = function metaFbqStub() {
    if (fbq.callMethod) {
      fbq.callMethod.apply(fbq, arguments as unknown as unknown[]);
      return;
    }
    fbq.queue.push(arguments);
  } as unknown as MetaFbqStub;

  window.fbq = fbq;
  if (!window._fbq) {
    window._fbq = fbq;
  }
  fbq.push = fbq;
  fbq.loaded = true;
  fbq.version = "2.0";
  fbq.queue = [];
};

/** Descarga `fbevents.js` una sola vez e inicializa el pixel (sin PageView). */
export const ensureMetaPixelLoaded = (): Promise<void> => {
  if (!META_PIXEL_ID || typeof window === "undefined") {
    return Promise.resolve();
  }

  installMetaFbqStub();

  if (!isInitialized) {
    window.fbq?.("consent", "revoke");
    window.fbq?.("init", META_PIXEL_ID);
    isInitialized = true;
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
      script.onload = () => resolve();
      script.onerror = () => {
        loadPromise = null;
        reject(new Error("No se pudo cargar el pixel de Meta"));
      };
      document.head.appendChild(script);
    });
  }

  return loadPromise;
};
