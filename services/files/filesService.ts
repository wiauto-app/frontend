import { apiPost, uploadSignedFile } from "@/lib/api";
import { toast } from "sonner";
import { GENERATE_FILE_SIGNED_URL } from "./route.constants";

export type BucketName = "chat-attachments";

export type UploadContentType =
  | "image/jpeg"
  | "image/png"
  | "image/jpg"
  | "image/webp"
  | "audio/webm"
  | "audio/ogg"
  | "audio/wav"
  | "audio/mp3"
  | "audio/m4a"
  | "application/pdf"
  | "application/octet-stream";

interface GenerateFileSignedUrlDto {
  file_key: string;
  content_type: UploadContentType;
  bucket_name: BucketName;
}

interface GenerateFileSignedUrlResponse {
  signed_url: string;
}

export const filesService = {
  async generateFileSignedUrl(
    dto: GenerateFileSignedUrlDto,
  ): Promise<string | null> {
    const response = await apiPost<GenerateFileSignedUrlResponse>(
      GENERATE_FILE_SIGNED_URL,
      dto,
    );
    if (!response.ok) {
      return null;
    }
    return response.data.signed_url;
  },

  generateFileKey(path: string, file: File): string {
    const extension = file.name.split(".").pop();
    return `${path}/${crypto.randomUUID()}.${extension}`;
  },

  normalizeChatAttachmentContentType(file: File): UploadContentType | null {
    const typeKey = file.type.trim().toLowerCase();
    const mimeMap: Record<string, UploadContentType> = {
      "image/jpeg": "image/jpeg",
      "image/jpg": "image/jpg",
      "image/png": "image/png",
      "image/webp": "image/webp",
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

    if (typeKey && mimeMap[typeKey]) {
      return mimeMap[typeKey];
    }

    const extension = file.name.includes(".")
      ? file.name.split(".").pop()?.toLowerCase()
      : "";
    const extMap: Record<string, UploadContentType> = {
      jpg: "image/jpeg",
      jpeg: "image/jpeg",
      png: "image/png",
      webp: "image/webp",
      webm: "audio/webm",
      ogg: "audio/ogg",
      wav: "audio/wav",
      mp3: "audio/mp3",
      m4a: "audio/m4a",
      pdf: "application/pdf",
    };

    return extension ? (extMap[extension] ?? null) : null;
  },

  async uploadChatAttachment(file: File): Promise<{ path: string | null }> {
    const contentType = filesService.normalizeChatAttachmentContentType(file);
    if (!contentType) {
      toast.error(`${file.name}: formato no admitido para el chat.`);
      return { path: null };
    }

    const fileKey = filesService.generateFileKey("chat", file);
    const signedUrl = await filesService.generateFileSignedUrl({
      file_key: fileKey,
      content_type: contentType,
      bucket_name: "chat-attachments",
    });

    if (!signedUrl) {
      toast.error("No se pudo generar la URL de subida.");
      return { path: null };
    }

    const putResult = await uploadSignedFile<void>(signedUrl, file, {
      content_type: contentType,
    });

    if (!putResult.ok) {
      toast.error(`No se pudo subir el archivo (${file.name}).`);
      return { path: null };
    }

    return { path: `chat-attachments/${fileKey}` };
  },
};
