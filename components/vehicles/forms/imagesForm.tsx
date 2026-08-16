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
  Check,
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

/** El backend es la fuente de verdad; aquí solo filtramos lo claramente no-imagen. */
const file_input_accept = "image/*,.heic,.heif,.avif";

const known_image_extensions = [
  ".jpg",
  ".jpeg",
  ".png",
  ".webp",
  ".avif",
  ".heic",
  ".heif",
  ".gif",
  ".bmp",
  ".tif",
  ".tiff",
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

  // HEIC en Safari/Chrome a menudo llega con type vacío u octet-stream.
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
    `${file.name}: formato no reconocido. Prueba JPG, PNG, WebP, AVIF o HEIC.`,
  );

  return false;
};

export type ImagesFormProps = {
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
};

export const ImagesForm = ({
  value: value_prop,
  onChange,
  featureFirstImage = false,
  maxImages,
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

  /**
   * Limpieza de todas las object URLs cuando el componente se desmonta.
   */
  useEffect(() => {
    return () => {
      for (const item of pending_items) {
        revoke_preview_url(item.preview_url);
      }
    };
  }, [pending_items, revoke_preview_url]);

  const append_committed_path = useCallback(
    (path: string) => {
      const sorted = normalize_vehicle_images(value_ref.current);

      const next: VehicleFormImage[] = [
        ...sorted,
        {
          path,
          order: sorted.length,
        },
      ];

      value_ref.current = next;

      onChange?.(next);
    },
    [onChange],
  );

  const commit_remove_committed_path = useCallback(
    (path: string) => {
      const next = normalize_vehicle_images(
        value_ref.current.filter((image) => image.path !== path),
      );

      value_ref.current = next;

      onChange?.(next);
    },
    [onChange],
  );

  const handle_click_remove_committed = useCallback(
    async (compound_path: string, id?: string) => {
      if (locked_remove_paths_ref.current.has(compound_path)) return;

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

      locked_remove_paths_ref.current.add(compound_path);

      set_paths_removing((previous) => {
        const next = new Set(previous);

        next.add(compound_path);

        return next;
      });

      try {
        const result = await filesService.removeStoredFiles({
          bucket_name,
          paths: [object_key],
        });
        if (id) {
          const result = await vehicleService.vehicles.removeImage(id);
          if (!result.ok) {
            toast.error("No se pudo eliminar la imagen del vehículo.");
            return;
          }
        }

        if (!result.ok) {
          console.error(result.message);

          toast.error("No se pudo eliminar el archivo del almacén.");

          return;
        }

        commit_remove_committed_path(compound_path);
      } finally {
        locked_remove_paths_ref.current.delete(compound_path);

        set_paths_removing((previous) => {
          const next = new Set(previous);

          next.delete(compound_path);

          return next;
        });
      }
    },
    [commit_remove_committed_path],
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
   * Sube una imagen mientras la preview local ya está visible.
   */
  const run_upload = useCallback(
    async (temp_key: string, file: File) => {
      try {
        const result = await filesService.uploadTempVehicleImage(file);

        /**
         * La subida terminó pero el usuario ya canceló la imagen.
         *
         * En ese caso NO añadimos el path al formulario.
         */
        if (cancelled_upload_keys_ref.current.has(temp_key)) {
          cancelled_upload_keys_ref.current.delete(temp_key);

          /**
           * El archivo remoto puede haber llegado a subirse.
           *
           * Si tu backend permite borrar inmediatamente el temporal,
           * aquí podrías llamar a removeStoredFiles().
           */
          return;
        }

        if (!result?.path) {
          remove_pending_item(temp_key);

          toast.error(`No se pudo obtener la ruta de ${file.name}`);

          return;
        }

        /**
         * Guardamos el path real en el formulario.
         */
        append_committed_path(result.path);

        /**
         * Ahora que el servidor confirmó la imagen,
         * eliminamos la preview local.
         */
        remove_pending_item(temp_key);
      } catch (error) {
        console.error(error);

        toast.error(`No se pudo subir ${file.name}`);

        remove_pending_item(temp_key);
      }
    },
    [append_committed_path, remove_pending_item],
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
    [run_upload],
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
            {["JPG", "PNG", "WEBP", "AVIF", "HEIC", "GIF"].map((label) => (
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

            return (
              <li
                key={image.path}
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
                  src={getImageUrl(image.path)}
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
                  disabled={paths_removing.has(image.path)}
                  className="absolute right-2 top-2 text-destructive hover:text-destructive-foreground"
                  onClick={(e) => {
                    e.stopPropagation();

                    void handle_click_remove_committed(image.path, image.id);
                  }}
                  aria-busy={paths_removing.has(image.path)}
                  aria-label={
                    paths_removing.has(image.path)
                      ? "Eliminando imagen…"
                      : "Quitar imagen"
                  }
                >
                  {paths_removing.has(image.path) ? (
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

            const is_uploaded = progress >= 100;

            return (
              <li
                key={item.temp_key}
                className="relative aspect-square overflow-hidden rounded-lg border border-border bg-muted"
                aria-busy={!is_uploaded}
                aria-label={
                  is_uploaded
                    ? `${item.file.name} subida`
                    : `Subiendo ${item.file.name}`
                }
              >
                {/*
                 * ESTA ES LA PARTE IMPORTANTE:
                 *
                 * La imagen se muestra inmediatamente desde el navegador.
                 * No esperamos al servidor.
                 */}
                <img
                  src={item.preview_url}
                  alt={item.file.name}
                  className={cn(
                    "size-full object-cover transition-all duration-300",
                    !is_uploaded && "scale-[1.01]",
                  )}
                  draggable={false}
                />

              

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
