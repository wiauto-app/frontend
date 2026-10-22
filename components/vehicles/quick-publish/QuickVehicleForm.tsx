"use client";

import {
  Suspense,
  useEffect,
  useRef,
  useState,
  type FormEvent,
  type KeyboardEvent,
} from "react";
import { useRouter } from "next/navigation";
import { FormProvider, useForm, type Resolver } from "react-hook-form";
import { standardSchemaResolver } from "@hookform/resolvers/standard-schema";
import { useQuery } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import {
  createQuickVehicleDefaultValues,
  quickVehicleSchema,
  type QuickVehicleSchema,
} from "@/components/vehicles/schemas/quick-vehicle.schema";
import { vehiclesService } from "@/components/vehicles/services/vehiclesService";
import { mapVehicleDetailToQuickFormValues } from "@/components/vehicles/utils/mapVehicleDetailToQuickFormValues";
import { mapAppraisalToQuickFormValues } from "@/components/vehicles/utils/mapAppraisalToQuickFormValues";
import { appraisalService } from "@/services/appraisal/appraisalService";
import { QuickVehiclePreview } from "./QuickVehiclePreview";
import { QuickVehicleIntroWizard } from "./QuickVehicleIntroWizard";
import { useUser } from "@/app/contexts/auth/useUser";
import { SignInDialog } from "@/components/auth/signInDialog";
import { isValidReturnPath } from "@/lib/auth/authReturnTo";
import { QUICK_VEHICLE_SUBMIT_ATTR } from "./quick-vehicle-wizard.constants";
import { serializeVehiclePayload } from "../utils/serializeVehiclePayload";
import { useQuickPublishDraft } from "./hooks/useQuickPublishDraft";
import {
  buildPublishTracking,
  createPublishEventId,
} from "@/lib/analytics/buildPublishTracking";
import {
  consumePublishAuthMethod,
  isRecentlyCreatedAccount,
  markPublishFlowAuth,
  trackPublishFlowAuth,
} from "@/lib/analytics/publishFlowAuth";
import {
  getPublishFunnelContext,
  resetPublishFunnel,
  track,
} from "@/lib/analytics/funnel";

/** Ruta actual con querystring (`?step`, `?tasacion`) para volver tras el login. */
const getCurrentReturnTo = (): string | undefined => {
  if (typeof window === "undefined") {
    return undefined;
  }

  const path = `${window.location.pathname}${window.location.search}`;
  return isValidReturnPath(path) ? path : undefined;
};

interface QuickVehicleFormProps {
  vehicleId?: string;
  redirectTo?: string;
  /** Tasación desde la que se publica (`/publicar?tasacion=<id>`): prellena coche y precio. */
  appraisalId?: string;
}

export const QuickVehicleForm = ({
  vehicleId,
  redirectTo,
  appraisalId,
}: QuickVehicleFormProps) => {
  const router = useRouter();
  const { user, isAuthenticated, isAuthResolved } = useUser();
  const isEditMode = Boolean(vehicleId);
  const [hasIncompleteImageUploads, setHasIncompleteImageUploads] =
    useState(false);
  const [isSignInOpen, setIsSignInOpen] = useState(false);
  const [signInReturnTo, setSignInReturnTo] = useState<string>();
  const autoPublishStartedRef = useRef(false);
  const publishAuthTrackedRef = useRef(false);

  const { data: vehicleDetail, isLoading: isLoadingVehicle } = useQuery({
    queryKey: ["vehicle", vehicleId],
    queryFn: () => vehiclesService.findOne(vehicleId ?? ""),
    enabled: isEditMode,
  });

  const { data: appraisal } = useQuery({
    queryKey: ["appraisals", appraisalId],
    queryFn: async () => {
      const response = await appraisalService.findOne(appraisalId ?? "");
      return response.ok ? response.data : null;
    },
    enabled: Boolean(appraisalId) && !isEditMode,
    staleTime: Infinity,
  });

  const form = useForm<QuickVehicleSchema>({
    resolver: standardSchemaResolver(
      quickVehicleSchema,
    ) as Resolver<QuickVehicleSchema>,
    defaultValues: { ...createQuickVehicleDefaultValues },
    mode: "onChange",
  });

  const {
    isDraftReady,
    restoredFromDraft,
    pendingPublish,
    setPendingPublish,
    saveDraftNow,
    discardDraft,
  } = useQuickPublishDraft({
    form,
    enabled: !isEditMode,
    appraisalId,
    // `isLoading` arranca en `false` antes de consultar la sesión: no sirve aquí.
    isAuthenticated: isAuthResolved ? isAuthenticated : undefined,
  });

  useEffect(() => {
    if (vehicleDetail) {
      form.reset(mapVehicleDetailToQuickFormValues(vehicleDetail));
    }
  }, [vehicleDetail]);

  // Si se restauró un borrador de esta misma tasación, gana el borrador.
  useEffect(() => {
    if (!appraisal || isEditMode || !isDraftReady || restoredFromDraft) return;
    form.reset(mapAppraisalToQuickFormValues(appraisal, form.getValues()));
  }, [appraisal, isEditMode, form, isDraftReady, restoredFromDraft]);

  useEffect(() => {
    if (!user || isEditMode || !isDraftReady) return;

    if (user.email && !form.getValues("email")) {
      form.setValue("email", user.email);
    }
  }, [user, isEditMode, isDraftReady]);

  const handleSubmit = async (data: QuickVehicleSchema) => {
    if (hasIncompleteImageUploads) {
      toast.error(
        "Espera a que terminen de subirse todas las imágenes antes de publicar.",
      );
      return;
    }

    // Anónimo: se guarda el handoff, se marca la publicación pendiente y se
    // pide login. El efecto de auto-publicación publica al volver autenticado.
    if (!isEditMode && !isAuthenticated) {
      saveDraftNow(form.getValues());
      setPendingPublish(true);
      markPublishFlowAuth();
      setSignInReturnTo(getCurrentReturnTo());
      setIsSignInOpen(true);
      return;
    }

    const payload = serializeVehiclePayload(data, {
      is_update: Boolean(vehicleId),
    });
    if (vehicleId) {
      const response = await vehiclesService.update(
        vehicleId,
        payload as never,
      );
      if (response.ok) {
        toast.success("Vehículo actualizado correctamente");
        if (redirectTo) {
          router.push(redirectTo);
        }
      } else {
        toast.error(response.message || "Error al actualizar el vehículo");
      }
      return;
    }

    const publishEventId = createPublishEventId();
    const response = await vehiclesService.create({
      ...(payload as Record<string, unknown>),
      tracking: buildPublishTracking(publishEventId),
    } as never);

    if (response.ok) {
      // Contiene email y teléfono: no debe sobrevivir a la publicación.
      discardDraft();
      const context = getPublishFunnelContext();
      track(
        "anuncio_publicado",
        {
          ...(response.data?.id ? { listing_id: response.data.id } : {}),
          vehicle_type: context.vehicleType ?? data.vehicle_type_id,
          ...(context.brand
            ? { brand: context.brand }
            : data.catalog_make_id
              ? { brand: String(data.catalog_make_id) }
              : {}),
          ...(context.model
            ? { model: context.model }
            : data.catalog_model_id
              ? { model: String(data.catalog_model_id) }
              : {}),
          ...(typeof context.year === "number" ? { year: context.year } : {}),
          price: Number(data.price),
          currency: "EUR",
        },
        publishEventId,
      );
      resetPublishFunnel();

      if (response.data?.id) {
        if (redirectTo) {
          router.push(
            `${redirectTo}?id=${encodeURIComponent(response.data.id)}`,
          );
        } else {
          router.push(
            `/publicar/exito?id=${encodeURIComponent(response.data.id)}`,
          );
        }
        return;
      }

      if (redirectTo) {
        router.push(redirectTo);
      } else {
        router.push("/publicar/exito");
      }
      return;
    }

    toast.error(response.message || "Error al publicar el vehículo");
  };

  // Auto-publicación tras el login (contraseña u OAuth con redirect completo).
  // `useUser.isLoading` arranca en `false` con `user` undefined: se gatea solo
  // con `isAuthenticated === true`. El ref evita el doble disparo (StrictMode).
  useEffect(() => {
    if (
      isEditMode ||
      isAuthenticated !== true ||
      !user ||
      publishAuthTrackedRef.current
    ) {
      return;
    }

    const method = consumePublishAuthMethod();
    if (method !== "google" && method !== "apple") {
      return;
    }

    publishAuthTrackedRef.current = true;
    void trackPublishFlowAuth({
      method,
      isNewUser: isRecentlyCreatedAccount(user.created_at),
    });
  }, [isEditMode, isAuthenticated, user]);

  useEffect(() => {
    if (isEditMode || autoPublishStartedRef.current) return;
    if (
      !isDraftReady ||
      !pendingPublish ||
      isAuthenticated !== true ||
      hasIncompleteImageUploads
    ) {
      return;
    }

    autoPublishStartedRef.current = true;
    // Se limpia ANTES de enviar: si falla, el borrador se conserva pero no se
    // reintenta en bucle; el usuario corrige y vuelve a pulsar Publicar.
    setPendingPublish(false);
    void form.handleSubmit(handleSubmit)();
  }, [
    isEditMode,
    isDraftReady,
    pendingPublish,
    isAuthenticated,
    hasIncompleteImageUploads,
  ]);

  const handleFormSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const submitter = (event.nativeEvent as SubmitEvent)
      .submitter as HTMLElement | null;
    const isExplicitPublish =
      submitter?.getAttribute(QUICK_VEHICLE_SUBMIT_ATTR) === "true";

    if (!isExplicitPublish) {
      return;
    }

    void form.handleSubmit(handleSubmit)(event);
  };

  const handleFormKeyDown = (event: KeyboardEvent<HTMLFormElement>) => {
    if (event.key !== "Enter") return;

    const target = event.target as HTMLElement;
    if (target.tagName === "TEXTAREA") return;
    if (target.tagName === "BUTTON" || target.closest("button")) return;
    if (target.closest(`[${QUICK_VEHICLE_SUBMIT_ATTR}="true"]`)) return;

    event.preventDefault();
  };

  if (isEditMode && isLoadingVehicle) {
    return (
      <div className="flex min-h-48 items-center justify-center gap-2 text-muted-foreground">
        <Loader2 className="size-5 animate-spin" />
        Cargando anuncio…
      </div>
    );
  }

  const contactName = user
    ? [user.name, user.last_name].filter(Boolean).join(" ")
    : "";

  return (
    <FormProvider {...form}>
      {!isEditMode ? (
        // Fuera del <form>: los eventos de React atraviesan portales y el
        // onSubmit/onKeyDown del formulario del anuncio interferiría con el login.
        <SignInDialog
          open={isSignInOpen}
          onOpenChange={setIsSignInOpen}
          returnTo={signInReturnTo}
        />
      ) : null}
      <form
        method="post"
        noValidate
        onSubmit={handleFormSubmit}
        onKeyDown={handleFormKeyDown}
        className="grid grid-cols-1 gap-5 lg:grid-cols-4"
      >
        <div className="flex flex-col gap-6 lg:col-span-3">
          <Suspense
            fallback={
              <div className="flex min-h-48 items-center justify-center gap-2 text-muted-foreground">
                <Loader2 className="size-5 animate-spin" aria-hidden />
                Cargando pasos…
              </div>
            }
          >
            <QuickVehicleIntroWizard
              vehicleId={vehicleId}
              contactName={contactName}
              isEditMode={isEditMode}
              hasIncompleteImageUploads={hasIncompleteImageUploads}
              onImageUploadStatusChange={setHasIncompleteImageUploads}
            />
          </Suspense>
        </div>

        <aside className="hidden lg:flex flex-col gap-6 lg:col-span-1 relative">
          <QuickVehiclePreview className="sticky top-0 left-0 w-full h-full" />
          <button
            type="button"
            className="text-left text-sm text-primary hover:underline"
            onClick={() => {
              document
                .getElementById("quick-optional-sections")
                ?.scrollIntoView({
                  behavior: "smooth",
                });
            }}
          >
            Completar después →
          </button>
        </aside>
      </form>
    </FormProvider>
  );
};
