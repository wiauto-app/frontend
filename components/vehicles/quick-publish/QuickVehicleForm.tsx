"use client";

import { Suspense, useEffect, type FormEvent, type KeyboardEvent } from "react";
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
import { QuickVehiclePreview } from "./QuickVehiclePreview";
import { QuickVehicleOptionalSections } from "./QuickVehicleOptionalSections";
import { QuickVehicleIntroWizard } from "./QuickVehicleIntroWizard";
import { useUser } from "@/app/contexts/auth/useUser";
import { QUICK_VEHICLE_SUBMIT_ATTR } from "./quick-vehicle-wizard.constants";
import { serializeVehiclePayload } from "../utils/serializeVehiclePayload";

interface QuickVehicleFormProps {
  vehicleId?: string;
  redirectTo?: string;
}

export const QuickVehicleForm = ({
  vehicleId,
  redirectTo,
}: QuickVehicleFormProps) => {
  const router = useRouter();
  const { user } = useUser();
  const isEditMode = Boolean(vehicleId);

  const { data: vehicleDetail, isLoading: isLoadingVehicle } = useQuery({
    queryKey: ["vehicle", vehicleId],
    queryFn: () => vehiclesService.findOne(vehicleId ?? ""),
    enabled: isEditMode,
  });

  const form = useForm<QuickVehicleSchema>({
    resolver: standardSchemaResolver(
      quickVehicleSchema,
    ) as Resolver<QuickVehicleSchema>,
    defaultValues: { ...createQuickVehicleDefaultValues },
  });

  useEffect(() => {
    if (vehicleDetail) {
      form.reset(mapVehicleDetailToQuickFormValues(vehicleDetail));
    }
  }, [vehicleDetail, form]);

  useEffect(() => {
    if (!user || isEditMode) return;

    if (user.email && !form.getValues("email")) {
      form.setValue("email", user.email);
    }
  }, [user, isEditMode, form]);

  const handleSubmit = async (data: QuickVehicleSchema) => {
    const payload = serializeVehiclePayload(data, {
      is_update: Boolean(vehicleId),
      // only_temp_images: Boolean(vehicleId),
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

    const response = await vehiclesService.create(payload as never);
    if (response.ok && response.data?.id) {
      if (redirectTo) {
        router.push(`${redirectTo}?id=${encodeURIComponent(response.data.id)}`);
      } else {
        router.push(
          `/publicar/exito?id=${encodeURIComponent(response.data.id)}`,
        );
      }
      return;
    }

    if (response.ok) {
      if (redirectTo) {
        router.push(redirectTo);
      } else {
        router.push("/publicar/exito");
      }
      return;
    }

    toast.error(response.message || "Error al publicar el vehículo");
  };

  const handleFormSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const submitter = (event.nativeEvent as SubmitEvent)
      .submitter as HTMLElement | null;
    const isExplicitPublish =
      submitter?.getAttribute(QUICK_VEHICLE_SUBMIT_ATTR) === "true";

    // Enter en un input dispara submit implícito (GET nativo) y borra ?step=…
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

    // Enter en inputs dispara submit implícito (GET) y pierde ?step=… + estado del form.
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
            />
          </Suspense>
        </div>

        <aside className="hidden lg:flex flex-col gap-6 lg:col-span-1">
          <QuickVehiclePreview />
          {/* <QuickVehicleOptionalSections /> */}
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
