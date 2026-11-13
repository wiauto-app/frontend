import {
  useCallback,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  AlertCircle,
  Clapperboard,
  GripVertical,
  Loader2,
  RotateCcw,
  Trash2,
  Upload,
  VideoIcon,
} from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  abortMultipartVideoUpload,
  MultipartVideoUploadError,
  uploadVideoMultipart,
} from "@/lib/upload/multipartVideoUpload";
import { cn, getImageUrl } from "@/lib/utils";
import {
  normalize_vehicle_video_upload_content_type,
  type VehicleVideoUploadSession,
} from "@/services/files/filesService";

import type { VehicleFormVideo } from "../schemas/vehicle.schema";

/** 300 MB: mismo límite que valida el backend al iniciar la subida. */
const VEHICLE_VIDEO_MAX_BYTES = 300 * 1024 * 1024;

/** 120 s: el backend vuelve a validarlo con ffprobe al completar. */
const VEHICLE_VIDEO_MAX_DURATION_SECONDS = 120;

const VIDEO_ACCEPT_ATTRIBUTE = [
  "video/mp4",
  "video/quicktime",
  "video/webm",
  "video/x-msvideo",
  "video/x-matroska",
  ".mp4",
  ".mov",
  ".webm",
  ".avi",
  ".mkv",
];

const VEHICLE_VIDEO_DRAG_TYPE = "application/x-vehicle-video-order";

export const normalize_vehicle_videos = (
  videos: VehicleFormVideo[],
): VehicleFormVideo[] =>
  [...videos]
    .sort((a, b) => a.order - b.order)
    .map((video, index) => ({ ...video, order: index }));

const get_video_key = (video: VehicleFormVideo) =>
  video.id ?? video.upload_id ?? `order-${video.order}`;

const resolve_video_src = (url?: string) => {
  if (!url) return undefined;
  return url.startsWith("blob:") ? url : getImageUrl(url);
};

type PendingVideoStatus = "uploading" | "completing" | "failed";

type PendingVideoItem = {
  temp_key: string;
  file: File;
  mime_type: string;
  blob_preview_url: string;
  status: PendingVideoStatus;
  /** 0…100 */
  progress: number;
  /** Sesión multipart: permite reanudar solo las partes que falten. */
  session?: VehicleVideoUploadSession;
  error_message?: string;
  /** `false` cuando el fichero nunca podrá subirse (p. ej. dura > 120 s). */
  can_retry: boolean;
};

/** Lee la duración desde los metadatos; `null` si el navegador no sabe decodificarlo. */
const read_video_duration_seconds_from_file = (
  file: File,
): Promise<number | null> =>
  new Promise((resolve) => {
    const object_url = URL.createObjectURL(file);
    const video_element = document.createElement("video");
    video_element.preload = "metadata";
    video_element.muted = true;

    const finish = (value: number | null) => {
      URL.revokeObjectURL(object_url);
      resolve(value);
    };

    video_element.addEventListener(
      "loadedmetadata",
      () => {
        const duration_value = video_element.duration;
        finish(
          Number.isFinite(duration_value) && duration_value > 0
            ? duration_value
            : null,
        );
      },
      { once: true },
    );
    video_element.addEventListener("error", () => finish(null), {
      once: true,
    });
    video_element.src = object_url;
  });

const validate_vehicle_video_constraints = async (
  file: File,
): Promise<string | null> => {
  if (file.size > VEHICLE_VIDEO_MAX_BYTES) {
    toast.error(
      `${file.name}: el vídeo supera el límite de 300 MB (${Math.round(file.size / (1024 * 1024))} MB).`,
    );
    return null;
  }

  const content_type = normalize_vehicle_video_upload_content_type(file);
  if (!content_type) {
    toast.error(
      `${file.name}: formato no admitido. Usa MP4, MOV, AVI, MKV o WEBM.`,
    );
    return null;
  }

  // Si el navegador no puede leerlo (AVI/MKV), lo valida el servidor al completar.
  const duration_seconds = await read_video_duration_seconds_from_file(file);
  if (
    duration_seconds !== null &&
    duration_seconds - VEHICLE_VIDEO_MAX_DURATION_SECONDS > 0.5
  ) {
    toast.error(
      `${file.name}: la duración máxima es de 2 minutos (detectado ~${Math.ceil(duration_seconds)} s).`,
    );
    return null;
  }

  return content_type;
};

const has_incomplete = (items: PendingVideoItem[]) => items.length > 0;

export type VideosFormProps = {
  value?: VehicleFormVideo[];
  onChange?: (videos: VehicleFormVideo[]) => void;
  /** Límite del plan (`videos_per_vehicle`); `undefined` = sin límite. */
  maxVideos?: number;
  /** `true` mientras haya vídeos subiéndose o fallidos sin resolver. */
  onUploadStatusChange?: (hasIncompleteUploads: boolean) => void;
};

export const VideosForm = ({
  value: valueProp,
  onChange,
  maxVideos,
  onUploadStatusChange,
}: VideosFormProps) => {
  const committedSorted = useMemo(
    () => normalize_vehicle_videos(valueProp ?? []),
    [valueProp],
  );

  const valueRef = useRef<VehicleFormVideo[]>(committedSorted);
  useEffect(() => {
    valueRef.current = normalize_vehicle_videos(valueProp ?? []);
  }, [valueProp]);

  // La lista de pendientes vive en un ref (fuente de verdad) para que una
  // subida que termina con el paso desmontado siga confirmando el vídeo y
  // desbloqueando Publicar.
  const pendingRef = useRef<PendingVideoItem[]>([]);
  const [pendingVideoItems, setPendingVideoItems] = useState<
    PendingVideoItem[]
  >([]);
  const controllersRef = useRef(new Map<string, AbortController>());
  const onChangeRef = useRef(onChange);
  const onUploadStatusChangeRef = useRef(onUploadStatusChange);
  useEffect(() => {
    onChangeRef.current = onChange;
    onUploadStatusChangeRef.current = onUploadStatusChange;
  }, [onChange, onUploadStatusChange]);

  const [isDraggingFiles, setIsDraggingFiles] = useState(false);
  const [dragSourceIndex, setDragSourceIndex] = useState<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const dragDepthFilesRef = useRef(0);
  const formFieldId = useId();

  const updatePending = useCallback(
    (updater: (previous: PendingVideoItem[]) => PendingVideoItem[]) => {
      const next = updater(pendingRef.current);
      pendingRef.current = next;
      setPendingVideoItems(next);
      onUploadStatusChangeRef.current?.(has_incomplete(next));
    },
    [],
  );

  const patchPending = useCallback(
    (tempKey: string, patch: Partial<PendingVideoItem>) => {
      updatePending((previous) =>
        previous.map((item) =>
          item.temp_key === tempKey ? { ...item, ...patch } : item,
        ),
      );
    },
    [updatePending],
  );

  // Al desmontar (cambio de paso) las subidas en curso siguen y se confirman
  // solas; las fallidas ya no tendrían UI para reintentar, así que se liberan.
  const mountedRef = useRef(false);
  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
      const failed = pendingRef.current.filter((p) => p.status === "failed");
      if (!failed.length) return;
      failed.forEach((item) => {
        if (item.session)
          void abortMultipartVideoUpload(item.session.upload_id);
        URL.revokeObjectURL(item.blob_preview_url);
      });
      pendingRef.current = pendingRef.current.filter(
        (p) => p.status !== "failed",
      );
      onUploadStatusChangeRef.current?.(has_incomplete(pendingRef.current));
    };
  }, []);

  const commitVideos = useCallback((next: VehicleFormVideo[]) => {
    const normalized = normalize_vehicle_videos(next);
    valueRef.current = normalized;
    onChangeRef.current?.(normalized);
  }, []);

  const runUpload = useCallback(
    async (tempKey: string) => {
      const item = pendingRef.current.find((p) => p.temp_key === tempKey);
      if (!item) return;

      const controller = new AbortController();
      controllersRef.current.set(tempKey, controller);
      patchPending(tempKey, {
        status: "uploading",
        error_message: undefined,
      });

      try {
        const completed = await uploadVideoMultipart({
          file: item.file,
          mimeType: item.mime_type,
          session: item.session,
          signal: controller.signal,
          onSession: (session) => patchPending(tempKey, { session }),
          onProgress: (fraction) =>
            patchPending(tempKey, { progress: Math.round(fraction * 100) }),
          onPhase: (phase) =>
            patchPending(tempKey, {
              status: phase === "completing" ? "completing" : "uploading",
            }),
        });

        if (controller.signal.aborted) return;

        // El blob pasa al valor del formulario como vista previa local.
        updatePending((previous) =>
          previous.filter((p) => p.temp_key !== tempKey),
        );
        commitVideos([
          ...valueRef.current,
          {
            upload_id: completed.upload_id,
            order: valueRef.current.length,
            preview_url: item.blob_preview_url,
            expires_at: completed.expires_at,
            duration_s: completed.duration_s,
          },
        ]);
      } catch (error) {
        if (controller.signal.aborted) return;

        const upload_error =
          error instanceof MultipartVideoUploadError ? error : null;
        const code = upload_error?.code ?? "network";
        const message = upload_error?.message ?? "No se pudo subir el vídeo.";

        if (code === "aborted") return;

        if (code === "forbidden") {
          toast.error(message);
          updatePending((previous) => {
            const target = previous.find((p) => p.temp_key === tempKey);
            if (target) URL.revokeObjectURL(target.blob_preview_url);
            return previous.filter((p) => p.temp_key !== tempKey);
          });
          return;
        }

        toast.error(`${item.file.name}: ${message}`);
        if (!mountedRef.current) {
          // Sin UI para reintentar: se descarta para no bloquear Publicar.
          const session = pendingRef.current.find(
            (p) => p.temp_key === tempKey,
          )?.session;
          if (session) void abortMultipartVideoUpload(session.upload_id);
          updatePending((previous) =>
            previous.filter((p) => p.temp_key !== tempKey),
          );
          return;
        }
        patchPending(tempKey, {
          status: "failed",
          error_message: message,
          can_retry: code !== "invalid_video",
          // Sesión perdida o vídeo rechazado: el reintento empieza de cero.
          ...(code === "session_lost" || code === "invalid_video"
            ? { session: undefined, progress: 0 }
            : {}),
        });
      } finally {
        if (controllersRef.current.get(tempKey) === controller) {
          controllersRef.current.delete(tempKey);
        }
      }
    },
    [commitVideos, patchPending, updatePending],
  );

  const handleRemovePending = useCallback(
    (tempKey: string) => {
      const target = pendingRef.current.find((p) => p.temp_key === tempKey);
      controllersRef.current.get(tempKey)?.abort();
      controllersRef.current.delete(tempKey);
      if (target?.session) {
        void abortMultipartVideoUpload(target.session.upload_id);
      }
      if (target) URL.revokeObjectURL(target.blob_preview_url);
      updatePending((previous) =>
        previous.filter((p) => p.temp_key !== tempKey),
      );
    },
    [updatePending],
  );

  const handleRetryPending = useCallback(
    (tempKey: string) => {
      void runUpload(tempKey);
    },
    [runUpload],
  );

  const handleRemoveCommitted = useCallback(
    (video: VehicleFormVideo) => {
      const key = get_video_key(video);
      // Vídeo nuevo sin publicar: se libera la sesión. Uno existente (`id`)
      // se borra en el backend al guardar (el array es el estado final).
      if (video.upload_id) {
        void abortMultipartVideoUpload(video.upload_id);
      }
      if (video.preview_url?.startsWith("blob:")) {
        URL.revokeObjectURL(video.preview_url);
      }
      commitVideos(
        valueRef.current.filter((item) => get_video_key(item) !== key),
      );
    },
    [commitVideos],
  );

  const reorderCommitted = useCallback(
    (fromIndex: number, toIndex: number) => {
      if (fromIndex === toIndex) return;
      const sorted = normalize_vehicle_videos(valueRef.current);
      if (
        fromIndex < 0 ||
        fromIndex >= sorted.length ||
        toIndex < 0 ||
        toIndex >= sorted.length
      ) {
        return;
      }
      const copy = [...sorted];
      const [moved] = copy.splice(fromIndex, 1);
      copy.splice(toIndex, 0, moved);
      commitVideos(copy.map((video, index) => ({ ...video, order: index })));
    },
    [commitVideos],
  );

  const handleFilesAdded = useCallback(
    async (fileList: FileList | null) => {
      if (!fileList?.length) return;

      const accepted: PendingVideoItem[] = [];
      for (const file of Array.from(fileList)) {
        const used =
          valueRef.current.length + pendingRef.current.length + accepted.length;
        if (typeof maxVideos === "number" && used >= maxVideos) {
          toast.error(
            maxVideos === 1
              ? "Tu plan permite 1 vídeo por vehículo."
              : `Tu plan permite ${maxVideos} vídeos por vehículo.`,
          );
          break;
        }

        const mime_type = await validate_vehicle_video_constraints(file);
        if (!mime_type) continue;

        accepted.push({
          temp_key: crypto.randomUUID(),
          file,
          mime_type,
          blob_preview_url: URL.createObjectURL(file),
          status: "uploading",
          progress: 0,
          can_retry: true,
        });
      }
      if (!accepted.length) return;

      updatePending((previous) => [...previous, ...accepted]);
      accepted.forEach((item) => {
        void runUpload(item.temp_key);
      });
    },
    [maxVideos, runUpload, updatePending],
  );

  const handleDropZoneDropFiles = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      dragDepthFilesRef.current = 0;
      setIsDraggingFiles(false);
      void handleFilesAdded(e.dataTransfer.files);
    },
    [handleFilesAdded],
  );

  const handleDropZoneDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDropZoneDragEnterFiles = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    dragDepthFilesRef.current += 1;
    setIsDraggingFiles(true);
  }, []);

  const handleDropZoneDragLeaveFiles = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    dragDepthFilesRef.current -= 1;
    if (dragDepthFilesRef.current <= 0) {
      dragDepthFilesRef.current = 0;
      setIsDraggingFiles(false);
    }
  }, []);

  const isAtLimit =
    typeof maxVideos === "number" &&
    committedSorted.length + pendingVideoItems.length >= maxVideos;

  const handleDropZoneActivate = useCallback(() => {
    if (isAtLimit) {
      toast.error("Has alcanzado el límite de vídeos de tu plan.");
      return;
    }
    fileInputRef.current?.click();
  }, [isAtLimit]);

  const handleDropZoneKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        handleDropZoneActivate();
      }
    },
    [handleDropZoneActivate],
  );

  const handleCommittedDragStart = useCallback(
    (index: number) => (e: React.DragEvent) => {
      e.dataTransfer.setData(VEHICLE_VIDEO_DRAG_TYPE, String(index));
      e.dataTransfer.effectAllowed = "move";
      setDragSourceIndex(index);
      setDragOverIndex(null);
    },
    [],
  );

  const handleCommittedDragEnd = useCallback(() => {
    setDragSourceIndex(null);
    setDragOverIndex(null);
  }, []);

  const handleCommittedDragOverItem = useCallback(
    (index: number) => (e: React.DragEvent) => {
      if (![...e.dataTransfer.types].includes(VEHICLE_VIDEO_DRAG_TYPE)) return;
      e.preventDefault();
      e.dataTransfer.dropEffect = "move";
      setDragOverIndex(index);
    },
    [],
  );

  const handleCommittedDragLeaveItem = useCallback((e: React.DragEvent) => {
    const related_target = e.relatedTarget as Node | null;
    if (related_target && e.currentTarget.contains(related_target)) return;
    setDragOverIndex(null);
  }, []);

  const handleCommittedDropOnItem = useCallback(
    (targetIndex: number) => (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      const fromIndex = Number.parseInt(
        e.dataTransfer.getData(VEHICLE_VIDEO_DRAG_TYPE),
        10,
      );
      setDragSourceIndex(null);
      setDragOverIndex(null);
      if (Number.isNaN(fromIndex)) return;
      reorderCommitted(fromIndex, targetIndex);
    },
    [reorderCommitted],
  );

  const inputId = `${formFieldId}-video-input`;
  const hasGallery = committedSorted.length > 0 || pendingVideoItems.length > 0;
  const limitLabel =
    typeof maxVideos === "number"
      ? ` · ${committedSorted.length + pendingVideoItems.length}/${maxVideos} vídeos`
      : "";

  return (
    <div className="flex flex-col gap-6">
      <div
        role="button"
        tabIndex={0}
        aria-label="Zona para arrastrar vídeos o abrir selector de archivos"
        aria-disabled={isAtLimit}
        onKeyDown={handleDropZoneKeyDown}
        onDrop={handleDropZoneDropFiles}
        onDragOver={handleDropZoneDragOver}
        onDragEnter={handleDropZoneDragEnterFiles}
        onDragLeave={handleDropZoneDragLeaveFiles}
        onClick={handleDropZoneActivate}
        className={cn(
          "relative rounded-lg border-2 border-dashed p-8 text-center cursor-pointer outline-none transition-all duration-200 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
          isDraggingFiles
            ? "scale-[1.02] border-primary bg-primary/10"
            : "border-muted-foreground/40 hover:border-muted-foreground hover:bg-muted/50",
          isAtLimit && "cursor-not-allowed opacity-60",
        )}
      >
        <input
          id={inputId}
          ref={fileInputRef}
          type="file"
          multiple
          accept={VIDEO_ACCEPT_ATTRIBUTE.join(",")}
          onChange={(e) => {
            void handleFilesAdded(e.target.files);
            e.target.value = "";
          }}
          className="sr-only"
        />

        <div className="flex flex-col items-center gap-4 pointer-events-none">
          <div
            className={cn(
              "rounded-full p-4 transition-colors",
              isDraggingFiles
                ? "bg-primary text-primary-foreground"
                : "bg-muted text-foreground",
            )}
          >
            {isDraggingFiles ? (
              <VideoIcon className="h-8 w-8" aria-hidden />
            ) : (
              <Upload className="h-8 w-8" aria-hidden />
            )}
          </div>
          <div>
            <p className="font-semibold text-foreground">
              {isDraggingFiles
                ? "Suelta los vídeos aquí"
                : "Arrastra y suelta tus vídeos"}
            </p>
            <p className="mt-1 text-sm text-muted-foreground">
              o haz clic para seleccionar (máximo 300 MB y 2 minutos cada uno
              {limitLabel})
            </p>
          </div>
          <div className="flex flex-wrap justify-center gap-2">
            {["MP4", "MOV", "WEBM", "AVI", "MKV"].map((tag) => (
              <span
                key={tag}
                className="rounded-full border border-border bg-muted px-3 py-1 text-xs text-foreground"
              >
                {tag}
              </span>
            ))}
          </div>
          <p className="max-w-md text-xs text-muted-foreground">
            La subida empieza al elegir el vídeo. Al publicar lo optimizamos en
            segundo plano (hasta 1080p); puede tardar unos minutos en aparecer
            en el anuncio.
          </p>
        </div>
      </div>

      {hasGallery ? (
        <ul
          className="grid grid-cols-1 gap-4 sm:grid-cols-2"
          aria-label="Lista de vídeos del vehículo"
        >
          {committedSorted.map((video, index) => {
            const key = get_video_key(video);
            const src = resolve_video_src(video.preview_url);
            const poster = video.thumbnail_url
              ? getImageUrl(video.thumbnail_url)
              : undefined;
            const isProcessing =
              video.status === "processing" || video.status === "uploaded";
            const isFailed = video.status === "failed";

            return (
              <li
                key={key}
                onDragOver={handleCommittedDragOverItem(index)}
                onDragLeave={handleCommittedDragLeaveItem}
                onDrop={handleCommittedDropOnItem(index)}
                className={cn(
                  "relative overflow-hidden rounded-lg border bg-muted transition-[outline,opacity]",
                  dragOverIndex === index
                    ? "outline-2 outline-offset-2 outline-primary"
                    : "border-border",
                  dragSourceIndex === index ? "opacity-50" : "opacity-100",
                )}
              >
                <div className="relative aspect-video w-full bg-black">
                  {src && !isProcessing && !isFailed ? (
                    <video
                      src={src}
                      poster={poster}
                      className="size-full object-contain"
                      controls
                      preload="metadata"
                      playsInline
                    >
                      Tu navegador no admite la reproducción de vídeo HTML5.
                    </video>
                  ) : (
                    <div className="flex size-full flex-col items-center justify-center gap-2 px-4 text-center text-white/80">
                      {isFailed ? (
                        <>
                          <AlertCircle
                            className="size-7 text-destructive"
                            aria-hidden
                          />
                          <span className="text-xs">
                            Error al procesar el vídeo. Quítalo y vuelve a
                            subirlo.
                          </span>
                        </>
                      ) : isProcessing ? (
                        <>
                          <Loader2
                            className="size-7 animate-spin"
                            aria-hidden
                          />
                          <span className="text-xs">Procesando vídeo…</span>
                        </>
                      ) : (
                        <>
                          <VideoIcon className="size-7" aria-hidden />
                          <span className="text-xs">
                            Vídeo subido. Se procesará al publicar.
                          </span>
                        </>
                      )}
                    </div>
                  )}
                </div>
                <div
                  draggable
                  onDragStart={handleCommittedDragStart(index)}
                  onDragEnd={handleCommittedDragEnd}
                  className={cn(
                    "absolute left-2 top-2 flex h-9 w-9 cursor-grab items-center justify-center rounded-md bg-background/90 text-foreground shadow-sm touch-none active:cursor-grabbing",
                    "hover:bg-background focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring",
                  )}
                  role="button"
                  tabIndex={0}
                  title="Arrastrar para reordenar"
                  aria-label={`Reordenar vídeo, posición ${index + 1}`}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                    }
                  }}
                >
                  <GripVertical className="size-5" aria-hidden />
                </div>
                <Button
                  type="button"
                  size="icon-sm"
                  variant="destructive"
                  className="absolute top-2 right-2 rounded-full shadow-md"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleRemoveCommitted(video);
                  }}
                  aria-label="Quitar vídeo"
                >
                  <Trash2 className="size-4" aria-hidden />
                </Button>
              </li>
            );
          })}

          {pendingVideoItems.map((item) => {
            const isUploading = item.status === "uploading";
            const isCompleting = item.status === "completing";
            const isFailed = item.status === "failed";

            return (
              <li
                key={item.temp_key}
                aria-busy={isUploading || isCompleting}
                className={cn(
                  "relative overflow-hidden rounded-lg border bg-muted",
                  isFailed ? "border-destructive" : "border-border",
                )}
              >
                <div className="relative aspect-video w-full bg-black">
                  <video
                    src={item.blob_preview_url}
                    className="size-full object-contain opacity-80"
                    muted
                    playsInline
                    preload="metadata"
                  />
                </div>

                {isUploading ? (
                  <div className="absolute inset-x-0 bottom-0 bg-black/60 p-2">
                    <div
                      className="h-1.5 w-full overflow-hidden rounded-full bg-muted"
                      role="progressbar"
                      aria-label={`Subiendo ${item.file.name}`}
                      aria-valuemin={0}
                      aria-valuemax={100}
                      aria-valuenow={item.progress}
                    >
                      <div
                        className="h-full bg-primary transition-all duration-300"
                        style={{ width: `${item.progress}%` }}
                      />
                    </div>
                    <p className="mt-1 text-center text-xs text-white">
                      {item.progress}%
                    </p>
                  </div>
                ) : null}

                {isCompleting ? (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                    <div className="flex flex-col items-center gap-2 text-white">
                      <Loader2 className="size-6 animate-spin" aria-hidden />
                      <span className="text-xs font-medium">
                        Comprobando vídeo…
                      </span>
                    </div>
                  </div>
                ) : null}

                {isFailed ? (
                  <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-black/70 px-4 text-center text-white">
                    <AlertCircle
                      className="size-6 text-destructive"
                      aria-hidden
                    />
                    <span className="text-xs">
                      {item.error_message ?? "No se pudo subir el vídeo."}
                    </span>
                    {item.can_retry ? (
                      <Button
                        type="button"
                        size="sm"
                        variant="secondary"
                        className="gap-1"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleRetryPending(item.temp_key);
                        }}
                      >
                        <RotateCcw className="size-4" aria-hidden />
                        Reintentar
                      </Button>
                    ) : null}
                  </div>
                ) : null}

                <Button
                  type="button"
                  size="icon-sm"
                  variant="destructive"
                  className="absolute top-2 right-2 rounded-full shadow-md"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleRemovePending(item.temp_key);
                  }}
                  aria-label={
                    isFailed
                      ? `Quitar ${item.file.name}`
                      : `Cancelar subida de ${item.file.name}`
                  }
                >
                  <Trash2 className="size-4" aria-hidden />
                </Button>
              </li>
            );
          })}
        </ul>
      ) : null}

      {committedSorted.length > 1 ? (
        <p className="text-sm text-muted-foreground">
          Usa el asa para arrastrar y cambiar el orden de los vídeos.
        </p>
      ) : null}

      <Button
        type="button"
        variant="default"
        className="w-full gap-2"
        disabled={isAtLimit}
        onClick={() => fileInputRef.current?.click()}
      >
        <Clapperboard className="h-5 w-5" aria-hidden />
        Seleccionar vídeos
      </Button>
    </div>
  );
};
