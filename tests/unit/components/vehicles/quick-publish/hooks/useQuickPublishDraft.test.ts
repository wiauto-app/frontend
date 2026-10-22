// @vitest-environment jsdom
import { act, cleanup, renderHook } from "@testing-library/react";
import { useForm } from "react-hook-form";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import {
  DRAFT_SAVE_DEBOUNCE_MS,
  useQuickPublishDraft,
} from "@/components/vehicles/quick-publish/hooks/useQuickPublishDraft";
import { useQuickPublishHandoffStore } from "@/components/vehicles/quick-publish/stores/quickPublishHandoffStore";
import {
  createQuickVehicleDefaultValues,
  type QuickVehicleSchema,
} from "@/components/vehicles/schemas/quick-vehicle.schema";
import {
  vehicleDraftService,
  type VehicleDraft,
} from "@/services/vehicleDraftService";

const navigation = vi.hoisted(() => ({
  searchParams: new URLSearchParams(),
}));

vi.mock("next/navigation", () => ({
  useSearchParams: () => navigation.searchParams,
}));

vi.mock("sonner", () => ({
  toast: { warning: vi.fn() },
}));

vi.mock("@/services/vehicleDraftService", () => ({
  vehicleDraftService: {
    getMine: vi.fn(),
    saveMine: vi.fn(),
    removeMine: vi.fn(),
  },
}));

interface HarnessProps {
  isAuthenticated?: boolean;
  appraisalId?: string;
}

const useHarness = ({ isAuthenticated, appraisalId }: HarnessProps) => {
  const form = useForm<QuickVehicleSchema>({
    defaultValues: { ...createQuickVehicleDefaultValues },
  });
  const draft = useQuickPublishDraft({
    form,
    enabled: true,
    isAuthenticated,
    appraisalId,
  });

  return { form, draft };
};

const buildDraft = (overrides: Partial<VehicleDraft> = {}): VehicleDraft => ({
  id: "draft-1",
  profile_id: "profile-1",
  values: { description: "Coche guardado en la API" },
  step: 2,
  appraisal_id: null,
  created_at: "2026-10-20T10:00:00.000Z",
  updated_at: "2026-10-20T10:00:00.000Z",
  ...overrides,
});

const flushAsync = () =>
  act(async () => {
    await vi.advanceTimersByTimeAsync(0);
  });

const advance = (ms: number) =>
  act(async () => {
    await vi.advanceTimersByTimeAsync(ms);
  });

const renderDraftHook = async (props: HarnessProps) => {
  const rendered = renderHook((hookProps: HarnessProps) => useHarness(hookProps), {
    initialProps: props,
  });
  await flushAsync();
  return rendered;
};

describe("useQuickPublishDraft", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    navigation.searchParams = new URLSearchParams();
    useQuickPublishHandoffStore.getState().clearHandoff();

    vi.mocked(vehicleDraftService.getMine).mockResolvedValue({
      ok: true,
      message: "OK",
      status: 200,
      data: null,
    });
    vi.mocked(vehicleDraftService.saveMine).mockImplementation(
      async (payload) => ({
        ok: true,
        message: "OK",
        status: 200,
        data: buildDraft({ values: payload.values }),
      }),
    );
    vi.mocked(vehicleDraftService.removeMine).mockResolvedValue({
      ok: true,
      message: "No Content",
      status: 204,
      data: null,
    });
  });

  afterEach(() => {
    cleanup();
    vi.clearAllMocks();
    vi.useRealTimers();
  });

  it("no decide nada mientras la sesión no está resuelta", async () => {
    const { result } = await renderDraftHook({ isAuthenticated: undefined });

    expect(result.current.draft.isDraftReady).toBe(false);
    expect(vehicleDraftService.getMine).not.toHaveBeenCalled();
  });

  describe("anónimo", () => {
    it("no llama a la API ni autoguarda", async () => {
      const { result } = await renderDraftHook({ isAuthenticated: false });

      expect(result.current.draft.isDraftReady).toBe(true);
      expect(result.current.draft.restoredFromDraft).toBe(false);

      act(() => {
        result.current.form.setValue("description", "Escribiendo sin sesión");
      });
      await advance(DRAFT_SAVE_DEBOUNCE_MS * 2);

      expect(vehicleDraftService.getMine).not.toHaveBeenCalled();
      expect(vehicleDraftService.saveMine).not.toHaveBeenCalled();
      expect(useQuickPublishHandoffStore.getState().values).toBeNull();
    });

    it("al pulsar Publicar guarda el handoff en sessionStorage", async () => {
      const { result } = await renderDraftHook({
        isAuthenticated: false,
        appraisalId: "appraisal-1",
      });

      act(() => {
        result.current.form.setValue("description", "Listo para publicar");
        result.current.draft.saveDraftNow(result.current.form.getValues());
        result.current.draft.setPendingPublish(true);
      });

      const handoff = useQuickPublishHandoffStore.getState();
      expect(handoff.values?.description).toBe("Listo para publicar");
      expect(handoff.appraisalId).toBe("appraisal-1");
      expect(handoff.pendingPublishAt).not.toBeNull();
      expect(result.current.draft.pendingPublish).toBe(true);
      expect(vehicleDraftService.saveMine).not.toHaveBeenCalled();
    });
  });

  describe("autenticado", () => {
    it("restaura el borrador de la API", async () => {
      vi.mocked(vehicleDraftService.getMine).mockResolvedValue({
        ok: true,
        message: "OK",
        status: 200,
        data: buildDraft(),
      });

      const { result } = await renderDraftHook({ isAuthenticated: true });

      expect(vehicleDraftService.getMine).toHaveBeenCalledTimes(1);
      expect(result.current.draft.isDraftReady).toBe(true);
      expect(result.current.draft.restoredFromDraft).toBe(true);
      expect(result.current.form.getValues("description")).toBe(
        "Coche guardado en la API",
      );
    });

    it("no restaura un borrador de otra tasación", async () => {
      vi.mocked(vehicleDraftService.getMine).mockResolvedValue({
        ok: true,
        message: "OK",
        status: 200,
        data: buildDraft({ appraisal_id: "appraisal-old" }),
      });

      const { result } = await renderDraftHook({
        isAuthenticated: true,
        appraisalId: "appraisal-new",
      });

      expect(result.current.draft.isDraftReady).toBe(true);
      expect(result.current.draft.restoredFromDraft).toBe(false);
      expect(result.current.form.getValues("description")).toBe("");
    });

    it("descarta fotos temporales caducadas al restaurar", async () => {
      vi.mocked(vehicleDraftService.getMine).mockResolvedValue({
        ok: true,
        message: "OK",
        status: 200,
        data: buildDraft({
          values: {
            images: [
              {
                upload_id: "caducada",
                expires_at: new Date(Date.now() - 1000).toISOString(),
                order: 0,
              },
              {
                upload_id: "vigente",
                expires_at: new Date(Date.now() + 60 * 60 * 1000).toISOString(),
                order: 1,
              },
            ],
          },
        }),
      });

      const { result } = await renderDraftHook({ isAuthenticated: true });

      const images = result.current.form.getValues("images");
      expect(images).toHaveLength(1);
      expect(images[0]).toMatchObject({ upload_id: "vigente", order: 0 });
    });

    it("autoguarda con debounce de 1500 ms", async () => {
      const { result } = await renderDraftHook({
        isAuthenticated: true,
        appraisalId: "appraisal-1",
      });

      act(() => {
        result.current.form.setValue("description", "A");
      });
      await advance(1000);
      act(() => {
        result.current.form.setValue("description", "AB");
      });
      await advance(DRAFT_SAVE_DEBOUNCE_MS - 1);

      expect(vehicleDraftService.saveMine).not.toHaveBeenCalled();

      await advance(1);

      expect(vehicleDraftService.saveMine).toHaveBeenCalledTimes(1);
      expect(vehicleDraftService.saveMine).toHaveBeenCalledWith(
        expect.objectContaining({
          values: expect.objectContaining({ description: "AB" }),
          step: null,
          appraisal_id: "appraisal-1",
        }),
      );
    });

    it("guarda al momento cuando cambia ?step=", async () => {
      const { result, rerender } = await renderDraftHook({
        isAuthenticated: true,
      });

      act(() => {
        result.current.form.setValue("description", "Paso 1 terminado");
      });
      navigation.searchParams = new URLSearchParams("step=2");
      rerender({ isAuthenticated: true });
      await flushAsync();

      expect(vehicleDraftService.saveMine).toHaveBeenCalledTimes(1);
      expect(vehicleDraftService.saveMine).toHaveBeenCalledWith(
        expect.objectContaining({ step: 2 }),
      );
    });

    it("sube un handoff válido, lo limpia y activa pendingPublish", async () => {
      const handoffStore = useQuickPublishHandoffStore.getState();
      handoffStore.saveHandoff({
        values: { description: "Anuncio del invitado" },
        step: 3,
      });
      handoffStore.setPendingPublish(true);

      const { result } = await renderDraftHook({ isAuthenticated: true });

      expect(vehicleDraftService.getMine).not.toHaveBeenCalled();
      expect(vehicleDraftService.saveMine).toHaveBeenCalledWith({
        values: { description: "Anuncio del invitado" },
        step: 3,
        appraisal_id: null,
      });
      expect(useQuickPublishHandoffStore.getState().values).toBeNull();
      expect(result.current.draft.isDraftReady).toBe(true);
      expect(result.current.draft.pendingPublish).toBe(true);
      expect(result.current.form.getValues("description")).toBe(
        "Anuncio del invitado",
      );
    });

    it("sube el handoff al iniciar sesión sin recargar", async () => {
      const { result, rerender } = await renderDraftHook({
        isAuthenticated: false,
      });

      act(() => {
        result.current.form.setValue("description", "Publicar tras login");
        result.current.draft.saveDraftNow(result.current.form.getValues());
        result.current.draft.setPendingPublish(true);
      });

      rerender({ isAuthenticated: true });
      await flushAsync();

      expect(vehicleDraftService.saveMine).toHaveBeenCalledWith(
        expect.objectContaining({
          values: expect.objectContaining({ description: "Publicar tras login" }),
        }),
      );
      expect(result.current.draft.pendingPublish).toBe(true);
      expect(useQuickPublishHandoffStore.getState().values).toBeNull();
    });

    it("discardDraft borra el borrador tras los guardados pendientes", async () => {
      const { result } = await renderDraftHook({ isAuthenticated: true });

      act(() => {
        result.current.draft.saveDraftNow(result.current.form.getValues());
        result.current.draft.discardDraft();
      });
      await flushAsync();

      expect(vehicleDraftService.removeMine).toHaveBeenCalledTimes(1);

      act(() => {
        result.current.form.setValue("description", "Después de publicar");
      });
      await advance(DRAFT_SAVE_DEBOUNCE_MS * 2);

      expect(vehicleDraftService.saveMine).not.toHaveBeenCalled();
    });
  });
});
