"use client";
import { objectToQueryString } from "@/lib/utils";
import { apiDelete, apiGet, apiPost, uploadSignedFile } from "@/lib/api";
import {
  CONFIRM_VIDEO_UPLOAD,
  GENERATE_FILE_SIGNED_URL,
  GENERATE_READ_FILE_SIGNED_URL,
  REMOVE_FILES,
  UPLOAD_TEMP_VEHICLE_IMAGE,
  TEMP_UPLOAD_VEHICLE_IMAGE,
  CONFIRM_TEMP_UPLOAD_VEHICLE_IMAGE,
  VEHICLE_VIDEO_UPLOADS,
  VEHICLE_VIDEO_UPLOAD,
  VEHICLE_VIDEO_UPLOAD_COMPLETE,
  VEHICLE_VIDEO_UPLOAD_PARTS,
  VEHICLE_VIDEO_UPLOAD_PART_URLS,
} from "./route.constants";
import type { ApiResponse } from "@/lib/api";
import { toast } from "sonner";
import axios from "axios";
import { API_URL } from "@/constants";
export type BucketName =
  | "files"
  | "vehicles-videos"
  | "vehicles-images"
  | "profile-images"
  | "dealership-images"
  | "chat-attachments";

const bucket_names_allowlist: BucketName[] = [
  "files",
  "vehicles-videos",
  "vehicles-images",
  "profile-images",
  "dealership-images",
  "chat-attachments",
];

const is_public_http_url = (value: string): boolean =>
  /^https?:\/\//i.test(value.trim());

/**
 * Convierte pathname CDN, URL absoluta o ruta compuesta en `bucket/clave`.
 * Alineado con el backend (`resolveObjectKeyFromStored`).
 */
export const normalize_compound_storage_path = (stored: string): string => {
  let trimmed = stored.trim();
  if (!trimmed) {
    return "";
  }

  if (is_public_http_url(trimmed)) {
    try {
      trimmed = new URL(trimmed).pathname;
    } catch {
      return stored.trim();
    }
  }

  const media_base = (process.env.NEXT_PUBLIC_MEDIA_URL ?? "").replace(
    /\/$/,
    "",
  );
  if (media_base && trimmed.startsWith(media_base)) {
    trimmed = trimmed.slice(media_base.length);
  }

  return trimmed.replace(/^\/+/, "");
};

/** Convierte `bucket/object/key` tal como guarda la subida en `uploadFile`. */
export const split_storage_compound_path = (
  compound_path: string,
): { bucket_name: BucketName; object_key: string } => {
  const normalized_path = normalize_compound_storage_path(compound_path);


  const first_slash = normalized_path.indexOf("/");


  if (first_slash <= 0) {
    throw new Error(
      'Ruta de almacén inválida: se esperaba "bucket/clave-del-objeto".',
    );
  }

  const bucket_segment = normalized_path.slice(0, first_slash);


  const object_key = normalized_path.slice(first_slash + 1);

  if (!object_key) {
    throw new Error("Ruta de almacén inválida: falta la clave del objeto.");
  }

  if (!bucket_names_allowlist.includes(bucket_segment as BucketName)) {
    throw new Error(
      `Bucket no admitido para esta operación: ${bucket_segment}`,
    );
  }

  return {
    bucket_name: bucket_segment as BucketName,
    object_key,
  };
};

export type UploadContentType =
  | "image/jpeg"
  | "image/png"
  | "image/jpg"
  | "image/webp"
  | "image/avif"
  | "image/heic"
  | "image/heif"
  | "image/heic-sequence"
  | "image/heif-sequence"
  | "video/mp4"
  | "video/mov"
  | "video/avi"
  | "video/mkv"
  | "video/webm"
  | "audio/mp3"
  | "audio/m4a"
  | "audio/webm"
  | "audio/ogg"
  | "audio/wav"
  | "application/pdf"
  | "application/octet-stream";

interface GenerateFileSignedUrlDto {
  file_key: string;
  content_type: UploadContentType;
  bucket_name: BucketName;
}

interface GenerateReadFileSignedUrlDto {
  file_key: string;
  bucket_name: BucketName;
}

interface GenerateFileSignedUrlResponse {
  signed_url: string;
}

interface GenerateReadFileSignedUrlResponse {
  signed_url: string;
}

interface ConfirmVideoUploadResponse {
  file_key: string;
  file_key_en_storage: string;
}

interface UploadTempVehicleImageResponse {
  path: string;
  preview_url: string;
}

interface RequestTempImageUploadDto {
  mime_type: string;
  original_filename: string;
  size_bytes: number;
}

interface RequestTempImageUploadResponse {
  upload_id: string;
  signed_url: string;
  storage_path: string;
  expires_at?: string;
}

export interface ConfirmTempImageUploadResponse {
  /** URL GET firmada (≈24h) para mostrar la miniatura tras recargar. */
  preview_url?: string;
  /** Caducidad (ISO) de la temp upload tras confirmar. */
  expires_at?: string;
}

export interface InitVehicleVideoUploadDto {
  mime_type: string;
  size_bytes: number;
  original_filename: string;
}

export interface VehicleVideoUploadSession {
  upload_id: string;
  part_size: number;
  part_count: number;
  expires_at: string;
}

export interface VehicleVideoUploadPart {
  part_number: number;
  etag: string;
  size: number;
}

export interface CompletedVehicleVideoUpload {
  upload_id: string;
  status: "uploaded";
  duration_s: number;
  width: number;
  height: number;
  expires_at: string;
}

interface UploadFileDto {
  file_key: string;
  content_type?: UploadContentType;
  bucket_name: BucketName;
  file: File;
  reference_id?: string;
}

/** Tipos MIME de vídeo aceptados por el backend (`GenerateFileSignedUrlHttpDto`). */
export type VehicleVideoUploadContentType =
  | "video/mp4"
  | "video/mov"
  | "video/avi"
  | "video/mkv"
  | "video/webm";

/** Coincide con `CONTENT_TYPES` del servidor; mapea `video/quicktime` → `video/mov`. */
export function normalize_vehicle_video_upload_content_type(
  file: File,
): VehicleVideoUploadContentType | null {
  const type_key = file.type.trim().toLowerCase();
  const MIME_MAP: Record<string, VehicleVideoUploadContentType> = {
    "video/mp4": "video/mp4",
    "video/webm": "video/webm",
    "video/avi": "video/avi",
    "video/mkv": "video/mkv",
    "video/mov": "video/mov",
    "video/quicktime": "video/mov",
    "video/x-quicktime": "video/mov",
    "video/x-msvideo": "video/avi",
    "video/x-matroska": "video/mkv",
  };
  const from_mime = type_key !== "" ? MIME_MAP[type_key] : undefined;
  if (from_mime) return from_mime;

  const ext_segment = file.name.includes(".")
    ? file.name.split(".").pop()?.toLowerCase()
    : "";
  const EXT_MAP: Record<string, VehicleVideoUploadContentType> = {
    mp4: "video/mp4",
    mov: "video/mov",
    avi: "video/avi",
    mkv: "video/mkv",
    webm: "video/webm",
  };
  const from_ext =
    ext_segment !== undefined ? EXT_MAP[ext_segment] : undefined;
  return from_ext ?? null;
}

export const filesService = {
  async generateFileSignedUrl(
    generateFileSignedUrlDto: GenerateFileSignedUrlDto,
  ): Promise<string | null> {
    const response = await apiPost<GenerateFileSignedUrlResponse>(
      GENERATE_FILE_SIGNED_URL,
      generateFileSignedUrlDto,
    );
    if (!response.ok) {
      return null;
    }
    return response.data.signed_url;
  },

  async uploadImage(url: string, image: File): Promise<string | null> {
    const response = await uploadSignedFile<string>(url, image, {
      content_type: image.type,
    });
    if (!response.ok) {
      return null;
    }
    return response.data;
  },

  

  async removeStoredFiles(remove_dto: {
    paths: string[];
    bucket_name: BucketName;
  }): Promise<{ ok: boolean; message?: string }> {
    const response = await apiDelete<void>(REMOVE_FILES, remove_dto);
    return { ok: response.ok, message: response.message };
  },

  async generateReadFileSignedUrl(
    generateReadFileSignedUrlDto: GenerateReadFileSignedUrlDto,
  ): Promise<string | null> {
    const queryString = objectToQueryString(generateReadFileSignedUrlDto);
    const response = await apiGet<GenerateReadFileSignedUrlResponse>(
      `${GENERATE_READ_FILE_SIGNED_URL}?${queryString}`,
    );
    if (!response.ok) {
      return null;
    }
    return response.data.signed_url;
  },

  async uploadFile(
    uploadFileDto: UploadFileDto,
  ): Promise<{ path: string | null }> {
    const content_type =
      uploadFileDto.content_type ??
      filesService.normalize_chat_attachment_content_type(uploadFileDto.file) ??
      (uploadFileDto.file.type as UploadContentType | undefined);

    if (!content_type) {
      toast.error(
        `${uploadFileDto.file.name}: no se pudo determinar el tipo de archivo`,
      );
      return { path: null };
    }

    const signedUrl = await filesService.generateFileSignedUrl({
      file_key: uploadFileDto.file_key,
      content_type,
      bucket_name: uploadFileDto.bucket_name,
    });
    if (!signedUrl) {
      toast.error("No se pudo generar la URL de subida");
      return { path: null };
    }
    await filesService.uploadImage(signedUrl, uploadFileDto.file);
    return { path: `${uploadFileDto.bucket_name}/${uploadFileDto.file_key}` };
  },

  /**
   * Sube una imagen de galería al backend: convierte a WebP y guarda en temp.
   * Devuelve `path` (compound) y `preview_url` pública.
   */
  async uploadTempVehicleImage(
    file: File,
    //@deprecate this is not used
  ): Promise<UploadTempVehicleImageResponse | null> {
    const formData = new FormData();
    formData.append("file", file);
  
    const response = await apiPost<UploadTempVehicleImageResponse>(
      UPLOAD_TEMP_VEHICLE_IMAGE,
      formData,
    );

    if (!response.data?.path) {
      toast.error(
        response.message?.trim() ||
        `No se pudo subir la imagen (${file.name}). Comprueba el formato e inténtalo de nuevo.`,
      );
      return null;
    }

    return response.data;
  },

  async confirm_vehicle_video_upload(
    file_key_used_for_signed_put: string,
  ): Promise<ConfirmVideoUploadResponse | null> {
    const response = await apiPost<ConfirmVideoUploadResponse>(
      CONFIRM_VIDEO_UPLOAD,
      { file_key: file_key_used_for_signed_put },
    );
    if (!response.ok) {
      toast.error("No se pudo confirmar el vídeo tras la subida.");
      return null;
    }
    return response.data;
  },

  /** URL firmada → PUT al storage (host de la URL firmada) → cola de transcodificación (clave final esperada `.mp4`). */
  async upload_vehicle_video(file: File): Promise<{ path: string | null }> {
    const content_type = normalize_vehicle_video_upload_content_type(file);
    if (!content_type) {
      toast.error(
        `${file.name}: formato de vídeo no admitido (MP4, MOV, AVI, MKV, WEBM).`,
      );
      return { path: null };
    }

    const file_key = filesService.generateFileKey("vehicles-videos", file);
    const signed_url = await filesService.generateFileSignedUrl({
      file_key,
      content_type,
      bucket_name: "vehicles-videos",
    });

    if (!signed_url) {
      return { path: null };
    }

    const put_result = await uploadSignedFile<void>(signed_url, file, {
      content_type,
    });

    if (!put_result.ok) {
      toast.error(`No se pudo subir el vídeo (${file.name}).`);
      return { path: null };
    }

    const confirmation = await filesService.confirm_vehicle_video_upload(
      file_key,
    );
    if (!confirmation) {
      return { path: null };
    }

    return {
      path: `vehicles-videos/${confirmation.file_key_en_storage}`,
    };
  },

  generateFileKey(path: string, file: File) {
    const extension = file.name.split(".").pop();
    return `${path}/${crypto.randomUUID()}.${extension}`;
  },

  normalize_chat_attachment_content_type(
    file: File,
  ): UploadContentType | null {
    const type_key = file.type.trim().toLowerCase();
    const MIME_MAP: Record<string, UploadContentType> = {
      "image/jpeg": "image/jpeg",
      "image/jpg": "image/jpg",
      "image/png": "image/png",
      "image/webp": "image/webp",
      "image/avif": "image/avif",
      "image/heic": "image/heic",
      "image/heif": "image/heif",
      "image/heic-sequence": "image/heic-sequence",
      "image/heif-sequence": "image/heif-sequence",
      "audio/webm": "audio/webm",
      "audio/ogg": "audio/ogg",
      "audio/wav": "audio/wav",
      "audio/x-wav": "audio/wav",
      "audio/mp3": "audio/mp3",
      "audio/mpeg": "audio/mp3",
      "audio/m4a": "audio/m4a",
      "audio/mp4": "audio/m4a",
      "application/pdf": "application/pdf",
      "application/octet-stream": "application/octet-stream",
    };
    if (type_key && MIME_MAP[type_key]) {
      return MIME_MAP[type_key];
    }
    const extension = file.name.includes(".")
      ? file.name.split(".").pop()?.toLowerCase()
      : "";
    const EXT_MAP: Record<string, UploadContentType> = {
      jpg: "image/jpeg",
      jpeg: "image/jpeg",
      png: "image/png",
      webp: "image/webp",
      avif: "image/avif",
      heic: "image/heic",
      heif: "image/heif",
      webm: "audio/webm",
      ogg: "audio/ogg",
      wav: "audio/wav",
      mp3: "audio/mp3",
      m4a: "audio/m4a",
      pdf: "application/pdf",
    };
    return extension ? (EXT_MAP[extension] ?? null) : null;
  },

  normalizeChatAttachmentContentType(file: File): UploadContentType | null {
    return filesService.normalize_chat_attachment_content_type(file);
  },

  async uploadChatAttachment(file: File): Promise<{ path: string | null }> {
    const content_type =
      filesService.normalize_chat_attachment_content_type(file);
    if (!content_type) {
      toast.error(`${file.name}: formato no admitido para el chat.`);
      return { path: null };
    }

    const file_key = filesService.generateFileKey("chat", file);
    const signed_url = await filesService.generateFileSignedUrl({
      file_key,
      content_type,
      bucket_name: "chat-attachments",
    });

    if (!signed_url) {
      toast.error("No se pudo generar la URL de subida.");
      return { path: null };
    }

    const put_result = await uploadSignedFile<void>(signed_url, file, {
      content_type,
    });

    if (!put_result.ok) {
      toast.error(`No se pudo subir el archivo (${file.name}).`);
      return { path: null };
    }

    return { path: `chat-attachments/${file_key}` };
  },

  async requestTempImageUpload(
    dto: RequestTempImageUploadDto,
  ): Promise<RequestTempImageUploadResponse | null> {
    const response = await apiPost<RequestTempImageUploadResponse>(
      TEMP_UPLOAD_VEHICLE_IMAGE,
      dto,
    );
    if (!response.ok || !response.data) {
      toast.error(
        response.message || "No se pudo generar la URL de subida temporal.",
      );
      return null;
    }
    return response.data;
  },

  async confirmTempImageUpload(
    uploadId: string,
  ): Promise<ConfirmTempImageUploadResponse | null> {
    const response = await apiPost<ConfirmTempImageUploadResponse | null>(
      CONFIRM_TEMP_UPLOAD_VEHICLE_IMAGE(uploadId),
      {},
    );
    if (!response.ok) {
      toast.error(
        response.message || "No se pudo confirmar la subida de la imagen.",
      );
      return null;
    }
    return response.data ?? {};
  },

  /** Multipart de vídeo: abre la sesión (403 sin entitlement, 429 demasiadas sesiones). */
  initVehicleVideoUpload(
    dto: InitVehicleVideoUploadDto,
  ): Promise<ApiResponse<VehicleVideoUploadSession>> {
    return apiPost<VehicleVideoUploadSession>(VEHICLE_VIDEO_UPLOADS, dto);
  },

  /** URLs PUT firmadas para un lote de partes (máximo 20 por petición). */
  getVehicleVideoPartUrls(
    uploadId: string,
    partNumbers: number[],
  ): Promise<ApiResponse<{ urls: { part_number: number; url: string }[] }>> {
    return apiPost(VEHICLE_VIDEO_UPLOAD_PART_URLS(uploadId), {
      part_numbers: partNumbers,
    });
  },

  /** Partes ya subidas (para reanudar). */
  listVehicleVideoUploadParts(
    uploadId: string,
  ): Promise<ApiResponse<{ parts: VehicleVideoUploadPart[] }>> {
    return apiGet(VEHICLE_VIDEO_UPLOAD_PARTS(uploadId));
  },

  /** Cierra el multipart; el backend valida con ffprobe (422 si no es vídeo o dura > 120 s). */
  completeVehicleVideoUpload(
    uploadId: string,
    parts: { part_number: number; etag: string }[],
  ): Promise<ApiResponse<CompletedVehicleVideoUpload>> {
    return apiPost<CompletedVehicleVideoUpload>(
      VEHICLE_VIDEO_UPLOAD_COMPLETE(uploadId),
      { parts },
    );
  },

  /** Aborta el multipart y libera la sesión. */
  abortVehicleVideoUpload(uploadId: string): Promise<ApiResponse<null>> {
    return apiDelete<null>(VEHICLE_VIDEO_UPLOAD(uploadId));
  },

  async uploadToSignedUrl(
    signedUrl: string,
    file: File,
    contentType: string,
    onProgress?: (progress: number) => void,
  ): Promise<boolean> {
    return new Promise((resolve) => {
      const xhr = new XMLHttpRequest();

      xhr.upload.addEventListener("progress", (event) => {
        if (event.lengthComputable && onProgress) {
          const progress = Math.round((event.loaded / event.total) * 100);
          onProgress(progress);
        }
      });

      xhr.addEventListener("load", () => {
        if (xhr.status >= 200 && xhr.status < 300) {
          resolve(true);
        } else {
          toast.error(`Error al subir el archivo: ${xhr.statusText}`);
          resolve(false);
        }
      });

      xhr.addEventListener("error", () => {
        toast.error("Error de red al subir el archivo.");
        resolve(false);
      });

      xhr.addEventListener("abort", () => {
        toast.error("Subida cancelada.");
        resolve(false);
      });

      xhr.open("PUT", signedUrl);
      xhr.setRequestHeader("Content-Type", contentType);
      xhr.send(file);
    });
  },
};
