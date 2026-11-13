import { beforeEach, describe, expect, it, vi } from "vitest";

const filesServiceMock = vi.hoisted(() => ({
  initVehicleVideoUpload: vi.fn(),
  getVehicleVideoPartUrls: vi.fn(),
  listVehicleVideoUploadParts: vi.fn(),
  completeVehicleVideoUpload: vi.fn(),
  abortVehicleVideoUpload: vi.fn(),
}));

vi.mock("@/services/files/filesService", () => ({
  filesService: filesServiceMock,
}));

import {
  MultipartVideoUploadError,
  uploadVideoMultipart,
} from "@/lib/upload/multipartVideoUpload";

type PutBehaviour = (url: string) => { status: number; etag?: string };

let putBehaviour: PutBehaviour;
const putCalls: string[] = [];

class FakeXhr {
  status = 0;
  upload: { onprogress: ((event: ProgressEvent) => void) | null } = {
    onprogress: null,
  };
  onload: (() => void) | null = null;
  onerror: (() => void) | null = null;
  onabort: (() => void) | null = null;
  private url = "";
  private etag: string | null = null;

  open(_method: string, url: string) {
    this.url = url;
  }

  getResponseHeader(name: string) {
    return name === "ETag" ? this.etag : null;
  }

  abort() {
    this.onabort?.();
  }

  send(body: Blob) {
    putCalls.push(this.url);
    queueMicrotask(() => {
      const result = putBehaviour(this.url);
      this.status = result.status;
      this.etag = result.etag ?? null;
      if (result.status === 0) {
        this.onerror?.();
        return;
      }
      this.upload.onprogress?.({
        lengthComputable: true,
        loaded: body.size,
        total: body.size,
      } as ProgressEvent);
      this.onload?.();
    });
  }
}

const ok = <T>(data: T) => ({ ok: true, status: 200, message: "", data });

const PART = 10;
const makeFile = (size: number) =>
  new File([new Uint8Array(size)], "clip.mp4", { type: "video/mp4" });

const urlsFor = (partNumbers: number[]) =>
  ok({
    urls: partNumbers.map((part_number) => ({
      part_number,
      url: `https://r2.test/part-${part_number}`,
    })),
  });

describe("uploadVideoMultipart", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.useRealTimers();
    putCalls.length = 0;
    putBehaviour = (url) => ({ status: 200, etag: `"etag-${url.split("-").pop()}"` });
    vi.stubGlobal("XMLHttpRequest", FakeXhr);
    filesServiceMock.getVehicleVideoPartUrls.mockImplementation(
      async (_id: string, parts: number[]) => urlsFor(parts),
    );
    filesServiceMock.completeVehicleVideoUpload.mockResolvedValue(
      ok({
        upload_id: "up-1",
        status: "uploaded",
        duration_s: 30,
        width: 1920,
        height: 1080,
        expires_at: "2099-01-01T00:00:00.000Z",
      }),
    );
  });

  it("inicia, pide URLs en lotes de 20 y completa con todos los ETags", async () => {
    const file = makeFile(PART * 25 - 3);
    filesServiceMock.initVehicleVideoUpload.mockResolvedValue(
      ok({ upload_id: "up-1", part_size: PART, part_count: 25, expires_at: "x" }),
    );
    const onSession = vi.fn();
    const onProgress = vi.fn();

    const result = await uploadVideoMultipart({
      file,
      mimeType: "video/mp4",
      onSession,
      onProgress,
    });

    expect(result.upload_id).toBe("up-1");
    expect(onSession).toHaveBeenCalledWith(
      expect.objectContaining({ upload_id: "up-1" }),
    );
    const batches = filesServiceMock.getVehicleVideoPartUrls.mock.calls.map(
      ([, parts]) => parts as number[],
    );
    expect(batches.every((parts) => parts.length <= 20)).toBe(true);
    expect(batches.flat().sort((a, b) => a - b)).toEqual(
      Array.from({ length: 25 }, (_, i) => i + 1),
    );
    const [, parts] = filesServiceMock.completeVehicleVideoUpload.mock.calls[0];
    expect(parts).toHaveLength(25);
    expect(parts[0]).toEqual({ part_number: 1, etag: '"etag-1"' });
    expect(onProgress).toHaveBeenLastCalledWith(1);
  });

  it("al reanudar solo sube las partes que faltan", async () => {
    const file = makeFile(PART * 3);
    filesServiceMock.listVehicleVideoUploadParts.mockResolvedValue(
      ok({
        parts: [
          { part_number: 1, etag: '"a"', size: PART },
          // Tamaño incorrecto: se vuelve a subir.
          { part_number: 2, etag: '"b"', size: 3 },
        ],
      }),
    );

    await uploadVideoMultipart({
      file,
      mimeType: "video/mp4",
      session: { upload_id: "up-1", part_size: PART, part_count: 3, expires_at: "x" },
    });

    expect(filesServiceMock.initVehicleVideoUpload).not.toHaveBeenCalled();
    expect(putCalls.sort()).toEqual([
      "https://r2.test/part-2",
      "https://r2.test/part-3",
    ]);
    const [, parts] = filesServiceMock.completeVehicleVideoUpload.mock.calls[0];
    expect(parts).toEqual([
      { part_number: 1, etag: '"a"' },
      { part_number: 2, etag: '"etag-2"' },
      { part_number: 3, etag: '"etag-3"' },
    ]);
  });

  it("reintenta una parte tras un error de red", async () => {
    vi.useFakeTimers();
    const file = makeFile(PART);
    filesServiceMock.initVehicleVideoUpload.mockResolvedValue(
      ok({ upload_id: "up-1", part_size: PART, part_count: 1, expires_at: "x" }),
    );
    let attempts = 0;
    putBehaviour = () => {
      attempts += 1;
      return attempts === 1 ? { status: 0 } : { status: 200, etag: '"ok"' };
    };

    const promise = uploadVideoMultipart({ file, mimeType: "video/mp4" });
    await vi.runAllTimersAsync();
    await promise;

    expect(attempts).toBe(2);
  });

  it("falla con missing_etag si el bucket no expone ETag", async () => {
    const file = makeFile(PART);
    filesServiceMock.initVehicleVideoUpload.mockResolvedValue(
      ok({ upload_id: "up-1", part_size: PART, part_count: 1, expires_at: "x" }),
    );
    putBehaviour = () => ({ status: 200 });

    await expect(
      uploadVideoMultipart({ file, mimeType: "video/mp4" }),
    ).rejects.toMatchObject({ code: "missing_etag" });
  });

  it("mapea 403 del init a forbidden", async () => {
    filesServiceMock.initVehicleVideoUpload.mockResolvedValue({
      ok: false,
      status: 403,
      message: "Sin vídeos en tu plan",
      data: null,
    });

    const error = await uploadVideoMultipart({
      file: makeFile(PART),
      mimeType: "video/mp4",
    }).catch((e: unknown) => e);

    expect(error).toBeInstanceOf(MultipartVideoUploadError);
    expect((error as MultipartVideoUploadError).code).toBe("forbidden");
  });

  it("mapea 422 del complete a invalid_video", async () => {
    filesServiceMock.initVehicleVideoUpload.mockResolvedValue(
      ok({ upload_id: "up-1", part_size: PART, part_count: 1, expires_at: "x" }),
    );
    filesServiceMock.completeVehicleVideoUpload.mockResolvedValue({
      ok: false,
      status: 422,
      message: "El vídeo dura más de 120 segundos.",
      data: null,
    });

    await expect(
      uploadVideoMultipart({ file: makeFile(PART), mimeType: "video/mp4" }),
    ).rejects.toMatchObject({ code: "invalid_video" });
  });
});
