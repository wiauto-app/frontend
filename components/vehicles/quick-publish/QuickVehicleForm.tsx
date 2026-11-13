"use client";

import {
  Suspense,
  useEffect,
  useRef,
  useState,
  useCallback,
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
import {
  SignInDialog,
  type AuthDialogTab,
} from "@/components/auth/signInDialog";
import { ReferralCaptureOnMount } from "@/components/referrals/ReferralCaptureOnMount";
import { isValidReturnPath } from "@/lib/auth/authReturnTo";
import {
  QUICK_VEHICLE_STEP_IDS,
  QUICK_VEHICLE_STEP_QUERY_PARAM,
  QUICK_VEHICLE_SUBMIT_ATTR,
} from "./quick-vehicle-wizard.constants";
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
  trackPublishAuthView,
} from "@/lib/analytics/funnel";
import type { PendingVehiclePayload } from "@/validations/Schemas";
import { getDealershipPublishContactDefaults } from "./utils/getDealershipPublishContactDefaults";

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
  const [hasIncompleteVideoUploads, setHasIncompleteVideoUploads] =
    useState(false);
  const hasIncompleteMediaUploads =
    hasIncompleteImageUploads || hasIncompleteVideoUploads;
  const [isSignInOpen, setIsSignInOpen] = useState(false);
  const [signInReturnTo, setSignInReturnTo] = useState<string>();
  const [pendingVehiclePayload, setPendingVehiclePayload] =
    useState<PendingVehiclePayload>();
  const autoPublishStartedRef = useRef(false);
  const publishAuthTrackedRef = useRef(false);
  const dealershipPrefillAppliedRef = useRef(false);

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

  // Contacto y ubica
  // ción del concesionario (solo creación, tras resolver borrador).
  useEffect(() => {
  
    if (
      isEditMode ||
      !isAuthResolved ||
      !isDraftReady ||
      dealershipPrefillAppliedRef.current ||
      !user?.dealership_membership
    ) {
      return;
    }

    if (appraisalId && appraisal === undefined) {
      return;
    }

    const defaults = getDealershipPublishContactDefaults(
      user.dealership_membership,
    );
    const current = form.getValues();
    const phoneEmpty = !current.phone?.phone?.trim();
    const latUnset = current.lat === undefined;
    const lngUnset = current.lng === undefined;
    if (phoneEmpty && defaults) {
      form.setValue(
        "phone",
        { phone_code: defaults.phone_code, phone: defaults.phone },
        { shouldDirty: false, shouldValidate: false },
      );
    }

    if (
      defaults &&
      latUnset &&
      lngUnset &&
      defaults.lat !== undefined &&
      defaults.lng !== undefined
    ) {
      form.setValue("lat", defaults.lat, {
        shouldDirty: false,
        shouldValidate: false,
      });
      form.setValue("lng", defaults.lng, {
        shouldDirty: false,
        shouldValidate: false,
      });
    }

    form.setValue("publisher_type", "dealership", {
      shouldDirty: false,
      shouldValidate: false,
    });
    dealershipPrefillAppliedRef.current = true;
  }, [
    isEditMode,
    isAuthResolved,
    isDraftReady,
    restoredFromDraft,
    user?.dealership_membership,
    appraisalId,
    appraisal,
    form,
  ]);

  const handleSubmit = async (data: QuickVehicleSchema) => {
    if (hasIncompleteMediaUploads) {
      toast.error(
        "Espera a que terminen de subirse todas las fotos y vídeos antes de publicar.",
      );
      return;
    }

    // Anónimo: se guarda el handoff, se marca la publicación pendiente y se
    // pide login. El efecto de auto-publicación publica al volver autenticado.
    // Si se registra con correo, el anuncio viaja en el registro como borrador.
    if (!isEditMode && !isAuthenticated) {
      saveDraftNow(form.getValues());
      setPendingPublish(true);
      markPublishFlowAuth();
      setPendingVehiclePayload({
        ...serializeVehiclePayload(data),
        tracking: buildPublishTracking(createPublishEventId()),
      });
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
      // Contiene teléfono de contacto: no debe sobrevivir a la publicación.
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
      hasIncompleteMediaUploads
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
    hasIncompleteMediaUploads,
  ]);

  // El borrador ya vive en el backend: incluye teléfono de contacto, no se guarda en local.
  const handlePendingVehicleCreated = () => {
    setPendingPublish(false);
    discardDraft();
    resetPublishFunnel();
    setPendingVehiclePayload(undefined);
  };

  const handleAuthTabView = (tab: AuthDialogTab) => {
    trackPublishAuthView(tab === "register" ? "registro" : "login");
  };

  const handleResetForm = useCallback(() => {
    if (isEditMode) {
      if (!vehicleDetail) {
        toast.error("Aún no hemos cargado el anuncio para restablecerlo.");
        return;
      }
      form.reset(mapVehicleDetailToQuickFormValues(vehicleDetail));
      toast.success("Cambios descartados");
      return;
    }

    discardDraft();
    setPendingPublish(false);
    setPendingVehiclePayload(undefined);
    autoPublishStartedRef.current = false;
    publishAuthTrackedRef.current = false;
    dealershipPrefillAppliedRef.current = false;
    resetPublishFunnel();

    const freshValues = {
      ...createQuickVehicleDefaultValues,
      images: [],
      videos: [],
      phone: { phone_code: "+34", phone: "" },
    };
    if (appraisal) {
      Object.assign(
        freshValues,
        mapAppraisalToQuickFormValues(appraisal, freshValues as QuickVehicleSchema),
      );
    }
    form.reset(freshValues);

    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      params.set(
        QUICK_VEHICLE_STEP_QUERY_PARAM,
        String(QUICK_VEHICLE_STEP_IDS.photos),
      );
      router.replace(`${window.location.pathname}?${params.toString()}`);
    }

    toast.success("Formulario restablecido");
  }, [appraisal, discardDraft, form, isEditMode, router, vehicleDetail]);

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

  return (
    <FormProvider {...form}>
      {!isEditMode ? (
        <Suspense fallback={null}>
          <ReferralCaptureOnMount />
        </Suspense>
      ) : null}
      {!isEditMode ? (
        // Fuera del <form>: los eventos de React atraviesan portales y el
        // onSubmit/onKeyDown del formulario del anuncio interferiría con el login.
        <SignInDialog
          open={isSignInOpen}
          onOpenChange={setIsSignInOpen}
          returnTo={signInReturnTo}
          pendingVehiclePayload={pendingVehiclePayload}
          onPendingVehicleCreated={handlePendingVehicleCreated}
          onTabView={handleAuthTabView}
        />
      ) : null}
      <form
        method="post"
        noValidate
        onSubmit={handleFormSubmit}
        onKeyDown={handleFormKeyDown}
        className="grid grid-cols-1 gap-5 "
      >
        <div className="flex flex-col gap-6 ">
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
              isEditMode={isEditMode}
              hasIncompleteMediaUploads={hasIncompleteMediaUploads}
              onImageUploadStatusChange={setHasIncompleteImageUploads}
              onVideoUploadStatusChange={setHasIncompleteVideoUploads}
              onResetForm={handleResetForm}
            />
          </Suspense>
        </div>

        {/* <aside className="hidden lg:flex flex-col gap-6 lg:col-span-1 relative">
          <QuickVehiclePreview
            className="sticky top-0 left-0 w-full h-full"
            leadPreviewUrl={galleryLeadPreview.url}
            galleryImageCount={galleryLeadPreview.totalCount}
          />
        </aside> */}
      </form>
    </FormProvider>
  );
};
