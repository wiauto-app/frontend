import {
  useCallback,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  Camera,
  GripVertical,
  ImagePlus,
  Loader2,
  Trash2,
  Upload,
} from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { cn, getImageUrl } from "@/lib/utils";
import {
  filesService,
  split_storage_compound_path,
} from "@/services/files/filesService";

import type { VehicleFormImage } from "../schemas/vehicle.schema";
import { vehicleService } from "@/services/vehicleService";

/** El backend acepta: JPEG, PNG, WebP, AVIF (sin HEIC). */
const file_input_accept = "image/jpeg,image/jpg,image/png,image/webp,image/avif";

const known_image_extensions = [
  ".jpg",
  ".jpeg",
  ".png",
  ".webp",
  ".avif",
] as const;

const blocked_non_image_extensions = [
  ".pdf",
  ".exe",
  ".zip",
  ".rar",
  ".7z",
  ".doc",
  ".docx",
  ".xls",
  ".xlsx",
  ".ppt",
  ".pptx",
  ".mp4",
  ".mov",
  ".avi",
  ".mkv",
  ".webm",
  ".mp3",
  ".wav",
  ".txt",
  ".csv",
  ".json",
  ".html",
  ".js",
  ".dmg",
  ".apk",
] as const;

const get_file_extension = (file_name: string): string => {
  const lower = file_name.toLowerCase();
  const dot = lower.lastIndexOf(".");

  if (dot < 0) return "";

  return lower.slice(dot);
};

const VEHICLE_IMAGE_DRAG_TYPE = "application/x-vehicle-image-order";

export const normalize_vehicle_images = (
  images: VehicleFormImage[],
): VehicleFormImage[] =>
  [...images]
    .sort((a, b) => a.order - b.order)
    .map((image, index) => ({
      ...image,
      order: index,
    }));
interface PendingItem {
  temp_key: string;
  file: File;

  /**
   * URL local creada con URL.createObjectURL().
   * Se utiliza inmediatamente para mostrar la imagen.
   */
  preview_url: string;

  /**
   * ID de subida temporal obtenido del backend.
   */
  upload_id?: string;

  /**
   * Estado de la subida: 'uploading' | 'confirming' | 'completed' | 'failed'
   */
  status: "uploading" | "confirming" | "completed" | "failed";
}

const is_valid_image_file = (file: File) => {
  const extension = get_file_extension(file.name);

  if ((blocked_non_image_extensions as readonly string[]).includes(extension)) {
    toast.error(`${file.name}: solo se admiten imágenes.`);
    return false;
  }

  const mime = file.type.trim().toLowerCase();

  if (mime.startsWith("image/")) {
    return true;
  }

  // Extensión conocida sin MIME válido (fallback)
  if (
    (!mime || mime === "application/octet-stream") &&
    (known_image_extensions as readonly string[]).includes(extension)
  ) {
    return true;
  }

  if (
    mime &&
    !mime.startsWith("image/") &&
    mime !== "application/octet-stream"
  ) {
    toast.error(`${file.name}: solo se admiten imágenes.`);
    return false;
  }

  toast.error(
    `${file.name}: formato no reconocido. Prueba JPG, PNG, WebP o AVIF.`,
  );

  return false;
};

export interface ImagesFormProps {
  /** Imágenes confirmadas (ruta + orden), persistidas en el formulario. */
  value?: VehicleFormImage[];

  /** Emite el array completo, con `order` normalizado (0 … n-1). */
  onChange?: (images: VehicleFormImage[]) => void;

  /**
   * ID de referencia para la subida (p. ej. id del vehículo).
   * Si no se pasa, se usa un UUID estable por montaje del formulario.
   */
  reference_id?: string;
  featureFirstImage?: boolean;
  maxImages?: number | null;

  /**
   * Callback que se ejecuta cuando hay uploads incompletos o fallidos.
   * Útil para bloquear el botón de publicar.
   */
  onUploadStatusChange?: (hasIncompleteUploads: boolean) => void;
}

export const ImagesForm = ({
  value: value_prop,
  onChange,
  featureFirstImage = false,
  maxImages,
  onUploadStatusChange,
}: ImagesFormProps) => {
  const committed_sorted = useMemo(
    () => normalize_vehicle_images(value_prop ?? []),
    [value_prop],
  );

  const value_ref = useRef<VehicleFormImage[]>(committed_sorted);

  useEffect(() => {
    value_ref.current = normalize_vehicle_images(value_prop ?? []);
  }, [value_prop]);

  /**
   * Imágenes que todavía están subiendo.
   *
   * La diferencia importante respecto al componente anterior es que
   * cada pending item YA tiene una imagen visible mediante preview_url.
   */
  const [pending_items, setPendingItems] = useState<PendingItem[]>([]);

  /**
   * Progreso individual por archivo.
   */
  const [upload_progress, set_upload_progress] = useState<
    Record<string, number>
  >({});

  /**
   * Notifica al padre cuando hay uploads incompletos.
   */
  useEffect(() => {
    const has_incomplete_uploads = pending_items.some(
      (item) => item.status === "uploading" || item.status === "confirming" || item.status === "failed"
    );
    onUploadStatusChange?.(has_incomplete_uploads);
  }, [pending_items, onUploadStatusChange]);

  const [is_dragging, setIsDragging] = useState(false);

  const [drag_source_index, set_drag_source_index] = useState<number | null>(
    null,
  );

  const [drag_over_index, set_drag_over_index] = useState<number | null>(null);

  const [paths_removing, set_paths_removing] = useState(
    () => new Set<string>(),
  );

  const file_input_ref = useRef<HTMLInputElement>(null);

  const drag_depth_ref = useRef(0);

  const form_field_id = useId();

  const cancelled_upload_keys_ref = useRef(new Set<string>());

  const locked_remove_paths_ref = useRef(new Set<string>());

  /**
   * Libera una URL creada mediante URL.createObjectURL().
   */
  const revoke_preview_url = useCallback((preview_url: string) => {
    if (preview_url.startsWith("blob:")) {
      URL.revokeObjectURL(preview_url);
    }
  }, []);

  /**
   * Elimina una imagen temporal.
   */
  const remove_pending_item = useCallback(
    (temp_key: string, revoke_url = true) => {
      setPendingItems((prev) => {
        const item = prev.find((p) => p.temp_key === temp_key);

        if (item && revoke_url) {
          revoke_preview_url(item.preview_url);
        }

        return prev.filter((p) => p.temp_key !== temp_key);
      });

      set_upload_progress((prev) => {
        if (!(temp_key in prev)) {
          return prev;
        }

        const next = { ...prev };
        delete next[temp_key];

        return next;
      });
    },
    [revoke_preview_url],
  );

  /**
   * Cancela una subida y elimina inmediatamente la preview.
   */
  const handle_remove_pending = useCallback(
    (temp_key: string) => {
      cancelled_upload_keys_ref.current.add(temp_key);

      remove_pending_item(temp_key);
    },
    [remove_pending_item],
  );

  const pending_items_ref = useRef(pending_items);
  pending_items_ref.current = pending_items;

  /**
   * Limpieza de blob URLs solo al desmontar (no al cambiar pending_items).
   */
  useEffect(() => {
    return () => {
      for (const item of pending_items_ref.current) {
        revoke_preview_url(item.preview_url);
      }
      for (const image of value_ref.current) {
        if (image.preview_url?.startsWith("blob:")) {
          revoke_preview_url(image.preview_url);
        }
      }
    };
  }, [revoke_preview_url]);

  const append_committed_image = useCallback(
    (image: {
      path?: string;
      upload_id?: string;
      preview_url?: string;
    }) => {
      const sorted = normalize_vehicle_images(value_ref.current);

      const next: VehicleFormImage[] = [
        ...sorted,
        {
          ...image,
          order: sorted.length,
        },
      ];

      value_ref.current = next;

      onChange?.(next);
    },
    [onChange],
  );

  const commit_remove_committed = useCallback(
    (matcher: { path?: string; upload_id?: string }) => {
      const next = normalize_vehicle_images(
        value_ref.current.filter((image) => {
          if (matcher.upload_id) {
            return image.upload_id !== matcher.upload_id;
          }
          if (matcher.path) {
            return image.path !== matcher.path;
          }
          return true;
        }),
      );

      value_ref.current = next;

      onChange?.(next);
    },
    [onChange],
  );

  const handle_click_remove_committed = useCallback(
    async (image: VehicleFormImage) => {
      const lock_key = image.upload_id ?? image.path ?? "";
      if (!lock_key || locked_remove_paths_ref.current.has(lock_key)) {
        return;
      }

      // Solo upload_id: aún no hay path público; quitar del form y liberar blob.
      if (image.upload_id && !image.path) {
        locked_remove_paths_ref.current.add(lock_key);
        set_paths_removing((previous) => {
          const next = new Set(previous);
          next.add(lock_key);
          return next;
        });
        try {
          if (image.preview_url) {
            revoke_preview_url(image.preview_url);
          }
          commit_remove_committed({ upload_id: image.upload_id });
        } finally {
          locked_remove_paths_ref.current.delete(lock_key);
          set_paths_removing((previous) => {
            const next = new Set(previous);
            next.delete(lock_key);
            return next;
          });
        }
        return;
      }

      const compound_path = image.path ?? "";
      let bucket_name: ReturnType<
        typeof split_storage_compound_path
      >["bucket_name"];

      let object_key: string;

      try {
        ({ bucket_name, object_key } =
          split_storage_compound_path(compound_path));
      } catch (error) {
        toast.error(
          error instanceof Error ? error.message : "Ruta de imagen no válida.",
        );

        return;
      }

      locked_remove_paths_ref.current.add(lock_key);

      set_paths_removing((previous) => {
        const next = new Set(previous);

        next.add(lock_key);

        return next;
      });

      try {
        const result = await filesService.removeStoredFiles({
          bucket_name,
          paths: [object_key],
        });
        if (image.id) {
          const remove_result = await vehicleService.vehicles.removeImage(
            image.id,
          );
          if (!remove_result.ok) {
            toast.error("No se pudo eliminar la imagen del vehículo.");
            return;
          }
        }

        if (!result.ok) {
          console.error(result.message);

          toast.error("No se pudo eliminar el archivo del almacén.");

          return;
        }

        if (image.preview_url) {
          revoke_preview_url(image.preview_url);
        }
        commit_remove_committed({ path: compound_path });
      } finally {
        locked_remove_paths_ref.current.delete(lock_key);

        set_paths_removing((previous) => {
          const next = new Set(previous);

          next.delete(lock_key);

          return next;
        });
      }
    },
    [commit_remove_committed, revoke_preview_url],
  );

  const reorder_committed = useCallback(
    (from_index: number, to_index: number) => {
      if (from_index === to_index) return;

      const sorted = normalize_vehicle_images(value_ref.current);

      if (
        from_index < 0 ||
        from_index >= sorted.length ||
        to_index < 0 ||
        to_index >= sorted.length
      ) {
        return;
      }

      const copy = [...sorted];

      const [moved] = copy.splice(from_index, 1);

      copy.splice(to_index, 0, moved);

      const next = copy.map((image, index) => ({
        ...image,
        order: index,
      }));

      value_ref.current = next;

      onChange?.(next);
    },
    [onChange],
  );
  /**
   * Sube una imagen usando el nuevo flujo: signed URL → PUT → confirm → commit upload_id.
   */
  const run_upload = useCallback(
    async (temp_key: string, file: File) => {
      try {
        // 1. Solicitar signed URL + upload_id
        const upload_response = await filesService.requestTempImageUpload({
          mime_type: file.type || "image/jpeg",
          original_filename: file.name,
          size_bytes: file.size,
        });
        if (cancelled_upload_keys_ref.current.has(temp_key)) {
          cancelled_upload_keys_ref.current.delete(temp_key);
          return;
        }

        if (!upload_response) {
          setPendingItems((prev) =>
            prev.map((item) =>
              item.temp_key === temp_key
                ? { ...item, status: "failed" }
                : item
            )
          );
          toast.error(`No se pudo iniciar la subida de ${file.name}`);
          return;
        }

        // Actualizar pending item con upload_id
        setPendingItems((prev) =>
          prev.map((item) =>
            item.temp_key === temp_key
              ? { ...item, upload_id: upload_response.upload_id }
              : item
          )
        );

        // 2. PUT con progreso
        const upload_success = await filesService.uploadToSignedUrl(
          upload_response.signed_url,
          file,
          file.type || "image/jpeg",
          (progress) => {
            set_upload_progress((prev) => ({ ...prev, [temp_key]: progress }));
          }
        );
        if (cancelled_upload_keys_ref.current.has(temp_key)) {
          cancelled_upload_keys_ref.current.delete(temp_key);
          return;
        }

        if (!upload_success) {
          setPendingItems((prev) =>
            prev.map((item) =>
              item.temp_key === temp_key
                ? { ...item, status: "failed" }
                : item
            )
          );
          toast.error(`No se pudo subir ${file.name}`);
          return;
        }

        // 3. Confirmar
        setPendingItems((prev) =>
          prev.map((item) =>
            item.temp_key === temp_key
              ? { ...item, status: "confirming" }
              : item
          )
        );

        const confirm_success = await filesService.confirmTempImageUpload(
          upload_response.upload_id
        );
        if (cancelled_upload_keys_ref.current.has(temp_key)) {
          cancelled_upload_keys_ref.current.delete(temp_key);
          return;
        }

        if (!confirm_success) {
          setPendingItems((prev) =>
            prev.map((item) =>
              item.temp_key === temp_key
                ? { ...item, status: "failed" }
                : item
            )
          );
          toast.error(`No se pudo confirmar ${file.name}`);
          return;
        }

        // 4. Commit: conservar blob local (TEMP en R2 no es público).
        const pending = pending_items_ref.current.find(
          (item) => item.temp_key === temp_key,
        );
        append_committed_image({
          upload_id: upload_response.upload_id,
          preview_url: pending?.preview_url,
        });

        // 5. Quitar de pending sin revocar el blob (ahora lo usa committed).
        remove_pending_item(temp_key, false);
      } catch (error) {
        console.error(error);

        setPendingItems((prev) =>
          prev.map((item) =>
            item.temp_key === temp_key
              ? { ...item, status: "failed" }
              : item
          )
        );

        toast.error(`No se pudo subir ${file.name}`);
      }
    },
    [append_committed_image, remove_pending_item],
  );

  /**
   * Recibe los archivos seleccionados y crea las previews
   * ANTES de comenzar la subida.
   */
  const handleAddedFiles = useCallback(
    (file_list: FileList | null) => {
      if (!file_list?.length) return;
      if (maxImages && file_list.length > maxImages) {
        toast.warning(`Solo se agregarán ${maxImages} imágenes`, {
          position: "bottom-center",
        });
      }
      const files = Array.from(file_list)
        .filter(is_valid_image_file)
        .slice(0, maxImages ?? undefined);

      if (!files.length) return;

      const new_pending: PendingItem[] = files.map((file) => ({
        temp_key: crypto.randomUUID(),

        file,

        /**
         * Esta operación es prácticamente inmediata.
         *
         * El navegador muestra el archivo local sin esperar
         * absolutamente nada del servidor.
         */
        preview_url: URL.createObjectURL(file),

        status: "uploading",
      }));

      /**
       * Primero mostramos las imágenes.
       */
      setPendingItems((prev) => [...prev, ...new_pending]);

      /**
       * Inicializamos progreso.
       */
      set_upload_progress((prev) => {
        const next = { ...prev };

        for (const item of new_pending) {
          next[item.temp_key] = 0;
        }

        return next;
      });

      /**
       * Y EN PARALELO empezamos las subidas.
       */
      new_pending.forEach((item) => {
        void run_upload(item.temp_key, item.file);
      });
    },
    [run_upload, maxImages],
  );

  const handle_drop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();

      drag_depth_ref.current = 0;

      setIsDragging(false);

      handleAddedFiles(e.dataTransfer.files);
    },
    [handleAddedFiles],
  );

  const handle_drag_over = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handle_drag_enter = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();

    drag_depth_ref.current += 1;

    setIsDragging(true);
  }, []);

  const handle_drag_leave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();

    drag_depth_ref.current -= 1;

    if (drag_depth_ref.current <= 0) {
      drag_depth_ref.current = 0;

      setIsDragging(false);
    }
  }, []);

  const handle_drop_zone_click = useCallback(() => {
    file_input_ref.current?.click();
  }, []);

  const handle_drop_zone_key_down = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();

        handle_drop_zone_click();
      }
    },
    [handle_drop_zone_click],
  );

  const handle_committed_drag_start = useCallback(
    (index: number) => (e: React.DragEvent) => {
      e.dataTransfer.setData(VEHICLE_IMAGE_DRAG_TYPE, String(index));

      e.dataTransfer.effectAllowed = "move";

      set_drag_source_index(index);

      set_drag_over_index(null);
    },
    [],
  );

  const handle_committed_drag_end = useCallback(() => {
    set_drag_source_index(null);

    set_drag_over_index(null);
  }, []);

  const handle_committed_drag_over_item = useCallback(
    (index: number) => (e: React.DragEvent) => {
      if (![...e.dataTransfer.types].includes(VEHICLE_IMAGE_DRAG_TYPE)) {
        return;
      }

      e.preventDefault();

      e.dataTransfer.dropEffect = "move";

      set_drag_over_index(index);
    },
    [],
  );

  const handle_committed_drag_leave_item = useCallback((e: React.DragEvent) => {
    const related = e.relatedTarget as Node | null;

    if (related && e.currentTarget.contains(related)) {
      return;
    }

    set_drag_over_index(null);
  }, []);

  const handle_committed_drop_on_item = useCallback(
    (target_index: number) => (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();

      const from_str = e.dataTransfer.getData(VEHICLE_IMAGE_DRAG_TYPE);

      const from_index = Number.parseInt(from_str, 10);

      set_drag_source_index(null);

      set_drag_over_index(null);

      if (Number.isNaN(from_index)) return;

      reorder_committed(from_index, target_index);
    },
    [reorder_committed],
  );

  const input_id = `${form_field_id}-file-input`;

  const has_gallery = committed_sorted.length > 0 || pending_items.length > 0;

  return (
    <div className="flex flex-col gap-6">
      <div
        role="button"
        tabIndex={0}
        aria-label="Zona para arrastrar imágenes o abrir selector de archivos"
        onKeyDown={handle_drop_zone_key_down}
        onDrop={handle_drop}
        onDragOver={handle_drag_over}
        onDragEnter={handle_drag_enter}
        onDragLeave={handle_drag_leave}
        onClick={handle_drop_zone_click}
        className={cn(
          "relative cursor-pointer rounded-lg border-2 border-dashed p-8 text-center transition-all duration-200 outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
          is_dragging
            ? "scale-[1.02] border-primary bg-primary/10"
            : "border-muted-foreground/40 hover:border-muted-foreground hover:bg-muted/50",
        )}
      >
        <input
          id={input_id}
          ref={file_input_ref}
          type="file"
          multiple
          accept={file_input_accept}
          onChange={(e) => {
            handleAddedFiles(e.target.files);

            e.target.value = "";
          }}
          className="sr-only"
        />

        <div className="pointer-events-none flex flex-col items-center gap-4">
          <div
            className={cn(
              "rounded-full p-4 transition-colors",
              is_dragging
                ? "bg-primary text-primary-foreground"
                : "bg-muted text-foreground",
            )}
          >
            {is_dragging ? (
              <ImagePlus className="h-8 w-8" aria-hidden />
            ) : (
              <Upload className="h-8 w-8" aria-hidden />
            )}
          </div>

          <div>
            <p className="font-semibold text-foreground">
              {is_dragging
                ? "Suelta las fotos aquí"
                : "Arrastra y suelta tus fotos"}
            </p>

            <p className="mt-1 text-sm text-muted-foreground">
              o haz clic para seleccionar archivos
            </p>
          </div>

          <div className="flex flex-wrap justify-center gap-2">
            {["JPG", "PNG", "WEBP", "AVIF"].map((label) => (
              <span
                key={label}
                className="rounded-full border border-border bg-muted px-3 py-1 text-xs text-foreground"
              >
                {label}
              </span>
            ))}
          </div>
        </div>
      </div>

      {has_gallery ? (
        <ul
          className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4"
          aria-label="Galería de imágenes del vehículo"
        >
          {committed_sorted.map((image, index) => {
            const is_first_image = featureFirstImage && index === 0;
            const image_key =
              image.upload_id ?? image.path ?? image.id ?? `order-${image.order}`;
            const image_src =
              image.preview_url || getImageUrl(image.path ?? "");
            const is_removing = paths_removing.has(image_key);

            return (
              <li
                key={image_key}
                onDragOver={handle_committed_drag_over_item(index)}
                onDragLeave={handle_committed_drag_leave_item}
                onDrop={handle_committed_drop_on_item(index)}
                className={cn(
                  "relative aspect-square overflow-hidden rounded-lg border bg-muted transition-[outline,opacity,box-shadow,border-color]",
                  drag_over_index === index
                    ? "outline-2 outline-offset-2 outline-primary"
                    : is_first_image
                      ? "border-primary ring-2 ring-primary/20"
                      : "border-border",
                  drag_source_index === index ? "opacity-50" : "opacity-100",
                )}
              >
                <img
                  src={image_src}
                  alt=""
                  className="pointer-events-none size-full object-cover"
                  draggable={false}
                />

                {is_first_image ? (
                  <div className="absolute bottom-2 left-2 z-10">
                    <span className="rounded-full bg-primary px-2.5 py-1 text-xs font-semibold text-primary-foreground shadow-sm">
                      Imagen principal
                    </span>
                  </div>
                ) : null}

                <Button
                  size="icon-sm"
                  draggable
                  onDragStart={handle_committed_drag_start(index)}
                  onDragEnd={handle_committed_drag_end}
                  className={cn(
                    "absolute left-2 top-2 flex cursor-grab items-center justify-center rounded-md bg-background/90 text-foreground shadow-sm touch-none active:cursor-grabbing",
                    "hover:bg-background focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring",
                  )}
                  role="button"
                  tabIndex={0}
                  title="Arrastrar para reordenar"
                  aria-label={`Reordenar imagen, posición ${index + 1}`}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                    }
                  }}
                >
                  <GripVertical className="size-4" aria-hidden />
                </Button>

                <Button
                  type="button"
                  size="icon-sm"
                  variant="outline"
                  disabled={is_removing}
                  className="absolute right-2 top-2 text-destructive hover:text-destructive-foreground"
                  onClick={(e) => {
                    e.stopPropagation();

                    void handle_click_remove_committed(image);
                  }}
                  aria-busy={is_removing}
                  aria-label={
                    is_removing ? "Eliminando imagen…" : "Quitar imagen"
                  }
                >
                  {is_removing ? (
                    <Loader2 className="size-4 animate-spin" aria-hidden />
                  ) : (
                    <Trash2 className="size-4" aria-hidden />
                  )}
                </Button>
              </li>
            );
          })}

          {pending_items.map((item) => {
            const progress = upload_progress[item.temp_key] ?? 0;

            const is_uploading = item.status === "uploading";
            const is_confirming = item.status === "confirming";
            const is_failed = item.status === "failed";

            return (
              <li
                key={item.temp_key}
                className="relative aspect-square overflow-hidden rounded-lg border border-border bg-muted"
                aria-busy={is_uploading || is_confirming}
                aria-label={
                  is_failed
                    ? `Error al subir ${item.file.name}`
                    : is_confirming
                      ? `Confirmando ${item.file.name}`
                      : is_uploading
                        ? `Subiendo ${item.file.name}`
                        : `${item.file.name} subida`
                }
              >
                <img
                  src={item.preview_url}
                  alt={item.file.name}
                  className={cn(
                    "size-full object-cover transition-all duration-300",
                    (is_uploading || is_confirming) && "scale-[1.01]",
                    is_failed && "opacity-50 grayscale"
                  )}
                  draggable={false}
                />

                {/* Barra de progreso */}
                {is_uploading && (
                  <div className="absolute inset-x-0 bottom-0 bg-black/60 p-2">
                    <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
                      <div
                        className="h-full bg-primary transition-all duration-300"
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                    <p className="mt-1 text-center text-xs text-white">
                      {progress}%
                    </p>
                  </div>
                )}

                {/* Indicador de confirmación */}
                {is_confirming && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                    <div className="flex flex-col items-center gap-2 text-white">
                      <Loader2 className="size-6 animate-spin" aria-hidden />
                      <p className="text-xs">Confirmando...</p>
                    </div>
                  </div>
                )}

                {/* Indicador de error */}
                {is_failed && (
                  <div className="absolute inset-0 flex items-center justify-center bg-red-900/60">
                    <p className="text-xs font-semibold text-white">Error</p>
                  </div>
                )}

                <Button
                  type="button"
                  size="icon-sm"
                  variant="destructive"
                  className="absolute right-2 top-2 z-10 rounded-full text-white shadow-md"
                  onClick={(e) => {
                    e.stopPropagation();

                    handle_remove_pending(item.temp_key);
                  }}
                  aria-label={`Cancelar subida de ${item.file.name}`}
                >
                  <Trash2 className="size-4" aria-hidden />
                </Button>
              </li>
            );
          })}
        </ul>
      ) : null}

      {committed_sorted.length > 1 ? (
        <p className="text-sm text-muted-foreground">
          Usa el asa de cada imagen para arrastrarla y cambiar el orden.
        </p>
      ) : null}

      <Button
        type="button"
        variant="default"
        className="w-full gap-2"
        onClick={() => file_input_ref.current?.click()}
      >
        <Camera className="h-5 w-5" aria-hidden />
        Tomar foto o subir archivo
      </Button>
    </div>
  );
};
