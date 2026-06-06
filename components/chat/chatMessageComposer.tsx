"use client";

import { useCallback, useEffect, useRef, useState, type ReactElement } from "react";
import {
  ArrowUp,
  FileText,
  Loader2,
  Mic,
  Paperclip,
  Square,
  X,
} from "lucide-react";
import { toast } from "sonner";

import { cn } from "@/lib/utils";
import {
  CHAT_MESSAGE_TYPE,
  type ChatMessageListItem,
  type ChatMessageType,
} from "@/interfaces/chat.interface";
import { chatService, unwrapChatResponse } from "@/services/chatService";
import { filesService } from "@/services/files/filesService";

type UploadStatus = "pending" | "uploading" | "complete" | "error";

interface AttachedFile {
  id: string;
  file: File;
  preview: string | null;
  uploadStatus: UploadStatus;
  messageType: ChatMessageType;
}

export type ComposerSendPayload = {
  type: ChatMessageType;
  content: string;
  metadata?: {
    file_name?: string;
    mime_type?: string;
    file_size_bytes?: number;
    duration_seconds?: number;
    caption?: string;
  };
};

interface ChatMessageComposerProps {
  chatId: string;
  disabled?: boolean;
  onSend?: (payload: ComposerSendPayload) => Promise<void>;
  onMessageSent?: (message: ChatMessageListItem) => void;
  onTypingStart?: () => void;
  onTypingStop?: () => void;
}

const resolveMessageType = (file: File): ChatMessageType => {
  const type = file.type.toLowerCase();
  if (type.startsWith("image/")) return CHAT_MESSAGE_TYPE.IMAGE;
  if (type.startsWith("audio/")) return CHAT_MESSAGE_TYPE.AUDIO;
  return CHAT_MESSAGE_TYPE.FILE;
};

export const ChatMessageComposer = ({
  chatId,
  disabled = false,
  onSend,
  onMessageSent,
  onTypingStart,
  onTypingStop,
}: ChatMessageComposerProps): ReactElement => {
  const sendMessage = async (payload: ComposerSendPayload) => {
    if (onSend) {
      await onSend(payload);
      return;
    }
    const message = unwrapChatResponse(
      await chatService.sendMessage(chatId, {
        content: payload.content,
        type: payload.type,
        metadata: payload.metadata,
      }),
    );
    onMessageSent?.(message);
  };

  const [message, setMessage] = useState("");
  const [files, setFiles] = useState<AttachedFile[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingSeconds, setRecordingSeconds] = useState(0);

  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const recordingTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (!textareaRef.current) return;
    textareaRef.current.style.height = "auto";
    textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 160)}px`;
  }, [message]);

  useEffect(() => {
    return () => {
      if (recordingTimerRef.current) clearInterval(recordingTimerRef.current);
      mediaRecorderRef.current?.stream
        .getTracks()
        .forEach((track) => track.stop());
    };
  }, []);

  const uploadAttachment = async (file: File): Promise<string | null> => {
    const result = await filesService.uploadChatAttachment(file);
    return result.path;
  };

  const handleFiles = useCallback((incoming: FileList | File[]) => {
    const mapped = Array.from(incoming).map((file) => {
      const isImage = file.type.startsWith("image/");
      return {
        id: crypto.randomUUID(),
        file,
        preview: isImage ? URL.createObjectURL(file) : null,
        uploadStatus: "pending" as const,
        messageType: resolveMessageType(file),
      };
    });
    setFiles((prev) => [...prev, ...mapped]);
  }, []);

  const handleSend = async () => {
    if (disabled || isSending) return;

    const trimmed = message.trim();
    const hasText = trimmed.length > 0;
    const hasFiles = files.length > 0;
    if (!hasText && !hasFiles) return;

    setIsSending(true);
    onTypingStop?.();

    try {
      if (hasFiles) {
        for (const [index, attachment] of files.entries()) {
          setFiles((prev) =>
            prev.map((item) =>
              item.id === attachment.id
                ? { ...item, uploadStatus: "uploading" }
                : item,
            ),
          );
          const storagePath = await uploadAttachment(attachment.file);
          if (!storagePath) {
            setFiles((prev) =>
              prev.map((item) =>
                item.id === attachment.id
                  ? { ...item, uploadStatus: "error" }
                  : item,
              ),
            );
            continue;
          }
          await sendMessage({
            type: attachment.messageType,
            content: storagePath,
            metadata: {
              file_name: attachment.file.name,
              mime_type: attachment.file.type || undefined,
              file_size_bytes: attachment.file.size,
              caption:
                hasText && index === files.length - 1 ? trimmed : undefined,
            },
          });
        }
        if (hasText && files.length > 1) {
          await sendMessage({ type: CHAT_MESSAGE_TYPE.TEXT, content: trimmed });
        }
      } else if (hasText) {
        await sendMessage({ type: CHAT_MESSAGE_TYPE.TEXT, content: trimmed });
      }

      setMessage("");
      setFiles([]);
      if (textareaRef.current) textareaRef.current.style.height = "auto";
    } finally {
      setIsSending(false);
    }
  };

  const handleStartRecording = async () => {
    if (disabled || isRecording) return;
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      audioChunksRef.current = [];
      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) audioChunksRef.current.push(event.data);
      };
      recorder.onstop = async () => {
        stream.getTracks().forEach((track) => track.stop());
        const blob = new Blob(audioChunksRef.current, { type: "audio/webm" });
        const file = new File([blob], `audio-${Date.now()}.webm`, {
          type: "audio/webm",
        });
        setIsSending(true);
        try {
          const storagePath = await uploadAttachment(file);
          if (storagePath) {
            await sendMessage({
              type: CHAT_MESSAGE_TYPE.AUDIO,
              content: storagePath,
              metadata: {
                file_name: file.name,
                mime_type: "audio/webm",
                file_size_bytes: file.size,
                duration_seconds: recordingSeconds,
              },
            });
          }
        } finally {
          setIsSending(false);
          setRecordingSeconds(0);
        }
      };
      mediaRecorderRef.current = recorder;
      recorder.start();
      setIsRecording(true);
      setRecordingSeconds(0);
      recordingTimerRef.current = setInterval(() => {
        setRecordingSeconds((prev) => prev + 1);
      }, 1000);
    } catch {
      toast.error("No se pudo acceder al micrófono");
    }
  };

  const handleStopRecording = () => {
    if (!mediaRecorderRef.current || !isRecording) return;
    mediaRecorderRef.current.stop();
    setIsRecording(false);
    if (recordingTimerRef.current) {
      clearInterval(recordingTimerRef.current);
      recordingTimerRef.current = null;
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      void handleSend();
    }
  };

  const handleChange = (value: string) => {
    setMessage(value);
    if (value.trim()) onTypingStart?.();
    else onTypingStop?.();
  };

  const hasContent = message.trim().length > 0 || files.length > 0;

  return (
    <div
      className="relative w-full"
      onDragOver={(event) => {
        event.preventDefault();
        setIsDragging(true);
      }}
      onDragLeave={(event) => {
        event.preventDefault();
        setIsDragging(false);
      }}
      onDrop={(event) => {
        event.preventDefault();
        setIsDragging(false);
        if (event.dataTransfer.files.length > 0) {
          handleFiles(event.dataTransfer.files);
        }
      }}
    >
      <div
        className={cn(
          "flex flex-col gap-2 rounded-xl border bg-background p-3 shadow-sm",
          isDragging && "border-primary ring-2 ring-primary/20",
        )}
      >
        {files.length > 0 ? (
          <div className="flex gap-2 overflow-x-auto pb-1">
            {files.map((file) => (
              <div
                key={file.id}
                className="relative h-20 w-20 shrink-0 overflow-hidden rounded-lg border bg-muted"
              >
                {file.preview ? (
                  <img
                    src={file.preview}
                    alt=""
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full flex-col justify-between p-2">
                    <FileText className="size-4 text-muted-foreground" />
                    <span className="truncate text-[10px]">{file.file.name}</span>
                  </div>
                )}
                {file.uploadStatus === "uploading" ? (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/40">
                    <Loader2 className="size-4 animate-spin text-white" />
                  </div>
                ) : null}
                <button
                  type="button"
                  className="absolute right-1 top-1 rounded-full bg-black/50 p-0.5 text-white"
                  onClick={() =>
                    setFiles((prev) => prev.filter((item) => item.id !== file.id))
                  }
                  aria-label="Quitar adjunto"
                >
                  <X className="size-3" />
                </button>
              </div>
            ))}
          </div>
        ) : null}

        {isRecording ? (
          <div className="flex items-center justify-between rounded-lg bg-destructive/10 px-3 py-2 text-sm text-destructive">
            <span>Grabando… {recordingSeconds}s</span>
            <button
              type="button"
              onClick={handleStopRecording}
              className="inline-flex items-center gap-1 rounded-md bg-destructive px-2 py-1 text-xs text-white"
            >
              <Square className="size-3" />
              Detener
            </button>
          </div>
        ) : (
          <textarea
            ref={textareaRef}
            value={message}
            disabled={disabled || isSending}
            onChange={(event) => handleChange(event.target.value)}
            onKeyDown={handleKeyDown}
            onPaste={(event) => {
              const pastedFiles = Array.from(event.clipboardData.files);
              if (pastedFiles.length > 0) {
                event.preventDefault();
                handleFiles(pastedFiles);
              }
            }}
            placeholder="Escribe un mensaje…"
            rows={1}
            className="max-h-40 min-h-10 w-full resize-none bg-transparent text-sm outline-none"
            aria-label="Escribir mensaje"
          />
        )}

        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-1">
            <button
              type="button"
              disabled={disabled || isSending || isRecording}
              onClick={() => fileInputRef.current?.click()}
              className="inline-flex size-8 items-center justify-center rounded-lg text-muted-foreground hover:bg-muted"
              aria-label="Adjuntar archivo"
            >
              <Paperclip className="size-4" />
            </button>
            <button
              type="button"
              disabled={disabled || isSending}
              onClick={isRecording ? handleStopRecording : handleStartRecording}
              className={cn(
                "inline-flex size-8 items-center justify-center rounded-lg",
                isRecording
                  ? "bg-destructive text-white"
                  : "text-muted-foreground hover:bg-muted",
              )}
              aria-label={isRecording ? "Detener grabación" : "Grabar audio"}
            >
              <Mic className="size-4" />
            </button>
          </div>
          <button
            type="button"
            disabled={!hasContent || disabled || isSending || isRecording}
            onClick={() => void handleSend()}
            className={cn(
              "inline-flex size-8 items-center justify-center rounded-lg",
              hasContent
                ? "bg-primary text-primary-foreground"
                : "bg-muted text-muted-foreground",
            )}
            aria-label="Enviar mensaje"
          >
            {isSending ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              <ArrowUp className="size-4" />
            )}
          </button>
        </div>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        multiple
        className="hidden"
        onChange={(event) => {
          if (event.target.files) handleFiles(event.target.files);
          event.target.value = "";
        }}
      />
    </div>
  );
};
