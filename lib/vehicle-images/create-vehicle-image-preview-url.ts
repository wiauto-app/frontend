const HEIC_HEIF_MIMES = new Set([
  "image/heic",
  "image/heif",
  "image/heic-sequence",
  "image/heif-sequence",
]);

const HEIC_HEIF_EXTENSIONS = new Set([".heic", ".heif"]);

const CLIENT_PREVIEW_JPEG_QUALITY = 0.82;
const CLIENT_PREVIEW_MAX_EDGE_PX = 1200;

export interface VehicleImagePreviewResult {
  previewUrl: string | null;
  /** Si true, Safari ya pinta el HEIC; si false, hace falta confirmar para ver el WebP del servidor. */
  usedNativeBlob: boolean;
}

const getFileExtension = (fileName: string): string => {
  const lower = fileName.toLowerCase();
  const dot = lower.lastIndexOf(".");
  if (dot < 0) return "";
  return lower.slice(dot);
};

export const fileNeedsClientHeicPreview = (file: File): boolean => {
  const mime = file.type.trim().toLowerCase();
  if (HEIC_HEIF_MIMES.has(mime)) {
    return true;
  }
  return HEIC_HEIF_EXTENSIONS.has(getFileExtension(file.name));
};

const heicFileAsBlob = async (file: File): Promise<Blob> => {
  const mime =
    file.type.trim() ||
    (HEIC_HEIF_EXTENSIONS.has(getFileExtension(file.name))
      ? "image/heic"
      : "application/octet-stream");

  if (file.type.trim() === mime) {
    return file;
  }

  const bytes = await file.arrayBuffer();
  return new Blob([bytes], { type: mime });
};

const pickHeic2AnyBlob = (result: Blob | Blob[]): Blob => {
  const blob = Array.isArray(result) ? result[0] : result;
  if (!(blob instanceof Blob)) {
    throw new Error("Conversión HEIC sin resultado");
  }
  return blob;
};

const tryNativeHeicObjectUrl = async (file: File): Promise<string | null> => {
  if (typeof document === "undefined") {
    return null;
  }

  const objectUrl = URL.createObjectURL(file);
  try {
    const image = await new Promise<HTMLImageElement>((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.onerror = () => reject(new Error("HEIC no decodificable en el navegador"));
      img.src = objectUrl;
    });

    if (image.naturalWidth > 0 && image.naturalHeight > 0) {
      return objectUrl;
    }
  } catch {
    // Safari u otros que no decodifican HEIC en <img>
  }

  URL.revokeObjectURL(objectUrl);
  return null;
};

const downscaleJpegBlob = async (
  blob: Blob,
  maxEdge: number,
): Promise<Blob> => {
  if (typeof document === "undefined") {
    return blob;
  }

  const objectUrl = URL.createObjectURL(blob);
  try {
    const image = await new Promise<HTMLImageElement>((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.onerror = () => reject(new Error("No se pudo decodificar la vista previa"));
      img.src = objectUrl;
    });

    const scale = Math.min(
      1,
      maxEdge / Math.max(image.naturalWidth, image.naturalHeight),
    );
    const width = Math.max(1, Math.round(image.naturalWidth * scale));
    const height = Math.max(1, Math.round(image.naturalHeight * scale));

    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    const context = canvas.getContext("2d");
    if (!context) {
      return blob;
    }

    context.drawImage(image, 0, 0, width, height);

    const downscaled = await new Promise<Blob | null>((resolve) => {
      canvas.toBlob(
        (result) => resolve(result),
        "image/jpeg",
        CLIENT_PREVIEW_JPEG_QUALITY,
      );
    });

    return downscaled ?? blob;
  } catch {
    return blob;
  } finally {
    URL.revokeObjectURL(objectUrl);
  }
};

let previewQueue: Promise<void> = Promise.resolve();

const enqueuePreviewTask = <T>(task: () => Promise<T>): Promise<T> => {
  const run = previewQueue.then(task, task);
  previewQueue = run.then(
    () => undefined,
    () => undefined,
  );
  return run;
};

const runHeic2Any = async (
  blob: Blob,
  options: {
    toType: string;
    quality: number;
    multiple?: true;
  },
): Promise<Blob> => {
  const { default: heic2any } = await import("heic2any");
  const result = await heic2any({
    blob,
    toType: options.toType,
    quality: options.quality,
    multiple: options.multiple,
  });
  return pickHeic2AnyBlob(result);
};

const convertHeicToPreviewBlob = async (file: File): Promise<Blob> => {
  const sourceBlob = await heicFileAsBlob(file);

  const attempts = [
    () =>
      runHeic2Any(sourceBlob, {
        toType: "image/jpeg",
        quality: CLIENT_PREVIEW_JPEG_QUALITY,
      }),
  ] as Array<() => Promise<Blob>>;

  if (file.type.includes("sequence")) {
    attempts.push(() =>
      runHeic2Any(sourceBlob, {
        toType: "image/jpeg",
        quality: CLIENT_PREVIEW_JPEG_QUALITY,
        multiple: true,
      }),
    );
  }

  attempts.push(
    () =>
      runHeic2Any(sourceBlob, {
        toType: "image/png",
        quality: CLIENT_PREVIEW_JPEG_QUALITY,
      }),
    () =>
      runHeic2Any(sourceBlob, {
        toType: "image/jpeg",
        quality: 0.92,
        multiple: true,
      }),
  );

  let lastError: unknown;
  for (const attempt of attempts) {
    try {
      const jpegOrPng = await attempt();
      if (jpegOrPng.type === "image/png") {
        return jpegOrPng;
      }
      return downscaleJpegBlob(jpegOrPng, CLIENT_PREVIEW_MAX_EDGE_PX);
    } catch (error) {
      lastError = error;
    }
  }

  throw lastError ?? new Error("Conversión HEIC no disponible en este navegador");
};

/**
 * Vista previa local. Si falla HEIC en WASM, devuelve `previewUrl: null`
 * (la miniatura llegará con `preview_url` del confirm en el servidor).
 */
export const createVehicleImagePreviewUrl = (
  file: File,
): Promise<VehicleImagePreviewResult> => {
  if (!fileNeedsClientHeicPreview(file)) {
    return Promise.resolve({
      previewUrl: URL.createObjectURL(file),
      usedNativeBlob: false,
    });
  }

  return enqueuePreviewTask(async () => {
    const nativeUrl = await tryNativeHeicObjectUrl(file);
    if (nativeUrl) {
      return { previewUrl: nativeUrl, usedNativeBlob: true };
    }

    try {
      const blob = await convertHeicToPreviewBlob(file);
      return {
        previewUrl: URL.createObjectURL(blob),
        usedNativeBlob: false,
      };
    } catch {
      return { previewUrl: null, usedNativeBlob: false };
    }
  });
};
