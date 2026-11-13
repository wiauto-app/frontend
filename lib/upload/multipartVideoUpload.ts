"use client";

import type { ApiResponse } from "@/lib/api";
import {
  filesService,
  type CompletedVehicleVideoUpload,
  type VehicleVideoUploadSession,
} from "@/services/files/filesService";

/** Partes subidas en paralelo. */
export const MULTIPART_VIDEO_CONCURRENCY = 4;
/** Reintentos por parte tras el primer intento. */
export const MULTIPART_VIDEO_PART_RETRIES = 3;
/** Máximo de URLs firmadas por petición (límite del backend). */
export const MULTIPART_VIDEO_URL_BATCH = 20;

const RETRY_BASE_DELAY_MS = 1000;

export type MultipartVideoUploadPhase =
  "initiating" | "uploading" | "completing";

export type MultipartVideoUploadErrorCode =
  /** Sin entitlement `videos_per_vehicle` (403 en init). */
  | "forbidden"
  /** Demasiadas sesiones activas (429 en init). */
  | "too_many_sessions"
  /** El backend rechaza el fichero (no es vídeo, > 120 s, tamaño…). */
  | "invalid_video"
  /** La sesión ya no existe o caducó: hay que empezar de cero. */
  | "session_lost"
  /** El bucket no expone `ETag` (CORS mal configurado). */
  | "missing_etag"
  | "aborted"
  | "network";

export class MultipartVideoUploadError extends Error {
  readonly code: MultipartVideoUploadErrorCode;
  readonly status?: number;

  constructor(
    code: MultipartVideoUploadErrorCode,
    message: string,
    status?: number,
  ) {
    super(message);
    this.name = "MultipartVideoUploadError";
    this.code = code;
    this.status = status;
  }
}

export interface MultipartVideoUploadOptions {
  file: File;
  mimeType: string;
  /** Sesión previa para reanudar: solo se suben las partes que falten. */
  session?: VehicleVideoUploadSession;
  signal?: AbortSignal;
  /** Se llama en cuanto existe la sesión, para guardarla y poder reanudar. */
  onSession?: (session: VehicleVideoUploadSession) => void;
  /** Fracción 0…1 de bytes subidos (monótona). */
  onProgress?: (fraction: number) => void;
  onPhase?: (phase: MultipartVideoUploadPhase) => void;
}

interface PutPartResult {
  etag: string;
}

class PartHttpError extends Error {
  constructor(readonly status: number) {
    super(`PUT de la parte falló (${status})`);
  }
}

const sleep = (ms: number, signal?: AbortSignal) =>
  new Promise<void>((resolve, reject) => {
    if (signal?.aborted) {
      reject(new MultipartVideoUploadError("aborted", "Subida cancelada."));
      return;
    }
    const timer = setTimeout(() => {
      signal?.removeEventListener("abort", handleAbort);
      resolve();
    }, ms);
    const handleAbort = () => {
      clearTimeout(timer);
      reject(new MultipartVideoUploadError("aborted", "Subida cancelada."));
    };
    signal?.addEventListener("abort", handleAbort, { once: true });
  });

const throwIfAborted = (signal?: AbortSignal) => {
  if (signal?.aborted) {
    throw new MultipartVideoUploadError("aborted", "Subida cancelada.");
  }
};

/** 1 s, 2 s, 4 s… con ±25 % de jitter. */
const backoffDelay = (attempt: number) => {
  const base = RETRY_BASE_DELAY_MS * 2 ** attempt;
  return base * (0.75 + Math.random() * 0.5);
};

const isRetryableStatus = (status: number) =>
  status === 0 ||
  status === 403 || // URL firmada caducada: se pide otra
  status === 408 ||
  status === 429 ||
  status >= 500;

/** PUT de una parte con XHR para tener progreso por bytes y leer `ETag`. */
const putPart = (
  url: string,
  body: Blob,
  signal: AbortSignal | undefined,
  onLoaded: (loaded: number) => void,
): Promise<PutPartResult> =>
  new Promise((resolve, reject) => {
    if (signal?.aborted) {
      reject(new MultipartVideoUploadError("aborted", "Subida cancelada."));
      return;
    }

    const xhr = new XMLHttpRequest();
    const handleAbort = () => xhr.abort();
    signal?.addEventListener("abort", handleAbort, { once: true });
    const cleanup = () => signal?.removeEventListener("abort", handleAbort);

    xhr.open("PUT", url, true);
    // Sin Content-Type: la URL de UploadPart no lo firma y el slice no lleva tipo.
    xhr.upload.onprogress = (event) => {
      if (event.lengthComputable) onLoaded(event.loaded);
    };
    xhr.onload = () => {
      cleanup();
      if (xhr.status < 200 || xhr.status >= 300) {
        reject(new PartHttpError(xhr.status));
        return;
      }
      const etag = xhr.getResponseHeader("ETag");
      if (!etag) {
        reject(
          new MultipartVideoUploadError(
            "missing_etag",
            "El almacenamiento no devolvió el ETag de la parte. Revisa la configuración CORS del bucket.",
          ),
        );
        return;
      }
      resolve({ etag });
    };
    xhr.onerror = () => {
      cleanup();
      reject(new PartHttpError(0));
    };
    xhr.onabort = () => {
      cleanup();
      reject(new MultipartVideoUploadError("aborted", "Subida cancelada."));
    };
    xhr.send(body);
  });

const toInitError = (response: ApiResponse<unknown>) => {
  if (response.status === 403) {
    return new MultipartVideoUploadError(
      "forbidden",
      response.message || "Tu plan no permite subir vídeos.",
      403,
    );
  }
  if (response.status === 429) {
    return new MultipartVideoUploadError(
      "too_many_sessions",
      response.message ||
        "Tienes demasiadas subidas de vídeo pendientes. Publica o elimina alguna.",
      429,
    );
  }
  if (
    response.status >= 400 &&
    response.status < 500 &&
    response.status !== 408
  ) {
    return new MultipartVideoUploadError(
      "invalid_video",
      response.message || "El vídeo no es válido.",
      response.status,
    );
  }
  return new MultipartVideoUploadError(
    "network",
    response.message || "No se pudo iniciar la subida del vídeo.",
    response.status,
  );
};

/** 404/409/410 tras iniciar ⇒ la sesión ya no sirve (409: multipart caducado, 6 h). */
const toSessionError = (response: ApiResponse<unknown>, fallback: string) => {
  if (
    response.status === 404 ||
    response.status === 409 ||
    response.status === 410
  ) {
    return new MultipartVideoUploadError(
      "session_lost",
      "La subida caducó. Vuelve a intentarlo.",
      response.status,
    );
  }
  return new MultipartVideoUploadError(
    "network",
    response.message || fallback,
    response.status,
  );
};

const expectedPartSize = (
  partNumber: number,
  session: VehicleVideoUploadSession,
  fileSize: number,
) => {
  const start = (partNumber - 1) * session.part_size;
  return Math.max(0, Math.min(session.part_size, fileSize - start));
};

/**
 * Sube un vídeo directo a R2 por multipart:
 * init → URLs en lotes (≤ 20) → PUT de partes (concurrencia 4, 3 reintentos con
 * backoff, guarda `ETag`) → complete.
 * Con `session` reanuda: `GET /parts` y solo sube las que falten.
 * Cancelar el `signal` corta los PUT; abortar la sesión (`DELETE`) es cosa del
 * llamador con {@link abortMultipartVideoUpload}.
 */
export const uploadVideoMultipart = async ({
  file,
  mimeType,
  session: previousSession,
  signal,
  onSession,
  onProgress,
  onPhase,
}: MultipartVideoUploadOptions): Promise<CompletedVehicleVideoUpload> => {
  throwIfAborted(signal);

  let session = previousSession;
  const doneEtags = new Map<number, string>();
  let confirmedBytes = 0;

  if (session) {
    onPhase?.("uploading");
    const response = await filesService.listVehicleVideoUploadParts(
      session.upload_id,
    );
    throwIfAborted(signal);
    if (!response.ok) {
      throw toSessionError(response, "No se pudo reanudar la subida.");
    }
    for (const part of response.data?.parts ?? []) {
      // Una parte con tamaño distinto se vuelve a subir.
      if (
        part.size === expectedPartSize(part.part_number, session, file.size)
      ) {
        doneEtags.set(part.part_number, part.etag);
        confirmedBytes += part.size;
      }
    }
  } else {
    onPhase?.("initiating");
    const response = await filesService.initVehicleVideoUpload({
      mime_type: mimeType,
      size_bytes: file.size,
      original_filename: file.name,
    });
    throwIfAborted(signal);
    if (!response.ok || !response.data?.upload_id) {
      throw toInitError(response);
    }
    session = response.data;
    onSession?.(session);
    onPhase?.("uploading");
  }

  const activeSession = session;
  const total = file.size || 1;
  const inFlight = new Map<number, number>();
  let reported = 0;

  const reportProgress = () => {
    let loaded = confirmedBytes;
    inFlight.forEach((bytes) => {
      loaded += bytes;
    });
    const fraction = Math.min(1, loaded / total);
    if (fraction > reported) {
      reported = fraction;
      onProgress?.(fraction);
    }
  };
  reportProgress();

  const missing: number[] = [];
  for (let part = 1; part <= activeSession.part_count; part += 1) {
    if (!doneEtags.has(part)) missing.push(part);
  }

  // URLs firmadas por lote, pedidas bajo demanda y compartidas entre workers.
  const urlBatches = new Map<number, Promise<Map<number, string>>>();
  const requestUrls = async (partNumbers: number[]) => {
    const response = await filesService.getVehicleVideoPartUrls(
      activeSession.upload_id,
      partNumbers,
    );
    if (!response.ok || !response.data?.urls) {
      throw toSessionError(
        response,
        "No se pudieron firmar las partes del vídeo.",
      );
    }
    return new Map(
      response.data.urls.map((item) => [item.part_number, item.url]),
    );
  };
  const getUrl = async (missingIndex: number, forceFresh: boolean) => {
    const partNumber = missing[missingIndex];
    if (forceFresh) {
      const fresh = await requestUrls([partNumber]);
      return fresh.get(partNumber);
    }
    const batchIndex = Math.floor(missingIndex / MULTIPART_VIDEO_URL_BATCH);
    let batch = urlBatches.get(batchIndex);
    if (!batch) {
      const start = batchIndex * MULTIPART_VIDEO_URL_BATCH;
      batch = requestUrls(
        missing.slice(start, start + MULTIPART_VIDEO_URL_BATCH),
      );
      urlBatches.set(batchIndex, batch);
      // Un lote fallido se puede volver a pedir en el siguiente intento.
      batch.catch(() => urlBatches.delete(batchIndex));
    }
    return (await batch).get(partNumber);
  };

  // Un fallo definitivo de una parte corta también los PUT de las demás.
  // (Sin `AbortSignal.any`: Safari < 17.4 no lo tiene.)
  const internalAbort = new AbortController();
  const forwardAbort = () => internalAbort.abort();
  signal?.addEventListener("abort", forwardAbort, { once: true });
  const partSignal = internalAbort.signal;

  const uploadPart = async (missingIndex: number) => {
    const partNumber = missing[missingIndex];
    const start = (partNumber - 1) * activeSession.part_size;
    const blob = file.slice(start, start + activeSession.part_size);
    let forceFreshUrl = false;

    for (let attempt = 0; ; attempt += 1) {
      throwIfAborted(partSignal);
      try {
        const url = await getUrl(missingIndex, forceFreshUrl);
        if (!url) {
          throw new MultipartVideoUploadError(
            "network",
            "El servidor no devolvió la URL de la parte.",
          );
        }
        const { etag } = await putPart(url, blob, partSignal, (loaded) => {
          inFlight.set(partNumber, loaded);
          reportProgress();
        });
        inFlight.delete(partNumber);
        doneEtags.set(partNumber, etag);
        confirmedBytes += blob.size;
        reportProgress();
        return;
      } catch (error) {
        inFlight.delete(partNumber);
        if (error instanceof MultipartVideoUploadError) {
          if (
            error.code !== "network" ||
            attempt >= MULTIPART_VIDEO_PART_RETRIES
          ) {
            throw error;
          }
        } else if (error instanceof PartHttpError) {
          if (
            !isRetryableStatus(error.status) ||
            attempt >= MULTIPART_VIDEO_PART_RETRIES
          ) {
            throw new MultipartVideoUploadError(
              "network",
              "No se pudo subir una parte del vídeo.",
              error.status,
            );
          }
          forceFreshUrl = error.status === 403;
        } else if (attempt >= MULTIPART_VIDEO_PART_RETRIES) {
          throw new MultipartVideoUploadError(
            "network",
            "No se pudo subir una parte del vídeo.",
          );
        }
        await sleep(backoffDelay(attempt), partSignal);
      }
    }
  };

  // Pool de workers: el primer error para a los demás.
  let nextIndex = 0;
  let failure: unknown = null;
  const worker = async () => {
    while (failure === null && nextIndex < missing.length) {
      const index = nextIndex;
      nextIndex += 1;
      try {
        await uploadPart(index);
      } catch (error) {
        if (failure === null) failure = error;
        internalAbort.abort();
        return;
      }
    }
  };
  try {
    await Promise.all(
      Array.from(
        { length: Math.min(MULTIPART_VIDEO_CONCURRENCY, missing.length) },
        worker,
      ),
    );
  } finally {
    signal?.removeEventListener("abort", forwardAbort);
  }
  throwIfAborted(signal);
  if (failure !== null) throw failure;
  throwIfAborted(signal);

  onPhase?.("completing");
  const parts = [...doneEtags.entries()]
    .sort(([a], [b]) => a - b)
    .map(([part_number, etag]) => ({ part_number, etag }));
  const response = await filesService.completeVehicleVideoUpload(
    activeSession.upload_id,
    parts,
  );
  if (!response.ok || !response.data) {
    if (response.status === 422 || response.status === 400) {
      // El backend ya borró el objeto: no se puede reintentar con este fichero.
      throw new MultipartVideoUploadError(
        "invalid_video",
        response.message || "El vídeo no es válido.",
        response.status,
      );
    }
    throw toSessionError(response, "No se pudo finalizar la subida del vídeo.");
  }
  onProgress?.(1);
  return response.data;
};

/** Aborta la sesión en el backend. Nunca lanza: es limpieza best-effort. */
export const abortMultipartVideoUpload = async (uploadId: string) => {
  try {
    await filesService.abortVehicleVideoUpload(uploadId);
  } catch {
    // La limpieza horaria del backend recoge lo que quede.
  }
};
