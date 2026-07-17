"use client";

import { Suspense, useEffect } from "react";
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
import { serializeQuickVehiclePayload } from "@/components/vehicles/utils/serializeQuickVehiclePayload";
import { mapVehicleDetailToQuickFormValues } from "@/components/vehicles/utils/mapVehicleDetailToQuickFormValues";
import { QuickVehiclePreview } from "./QuickVehiclePreview";
import { QuickVehicleOptionalSections } from "./QuickVehicleOptionalSections";
import { QuickVehicleIntroWizard } from "./QuickVehicleIntroWizard";
import { useUser } from "@/app/contexts/auth/useUser";

interface QuickVehicleFormProps {
  vehicleId?: string;
  onSuccess?: () => void;
}

export const QuickVehicleForm = ({ vehicleId, onSuccess }: QuickVehicleFormProps) => {
  const router = useRouter();
  const { user } = useUser();
  const isEditMode = Boolean(vehicleId);

  const { data: vehicleDetail, isLoading: isLoadingVehicle } = useQuery({
    queryKey: ["vehicle", vehicleId],
    queryFn: () => vehiclesService.findOne(vehicleId ?? ""),
    enabled: isEditMode,
  });

  const form = useForm<QuickVehicleSchema>({
    resolver: standardSchemaResolver(quickVehicleSchema) as Resolver<QuickVehicleSchema>,
    defaultValues: createQuickVehicleDefaultValues,
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
  }, [user, form, isEditMode]);

  const handleSubmit = async (data: QuickVehicleSchema) => {
    const payload = serializeQuickVehiclePayload(data, { isUpdate: Boolean(vehicleId) });
    if (vehicleId) {
      const response = await vehiclesService.update(vehicleId, payload as never);
      if (response.ok) {
        toast.success("Vehículo actualizado correctamente");
        onSuccess?.();
      } else {
        toast.error(response.message || "Error al actualizar el vehículo");
      }
      return;
    }

    const response = await vehiclesService.create(payload as never);
    if (response.ok && response.data?.id) {
      onSuccess?.();
      router.push(`/crear-vehiculo/exito?id=${encodeURIComponent(response.data.id)}`);
      return;
    }

    if (response.ok) {
      onSuccess?.();
      router.push("/crear-vehiculo/exito");
      return;
    }

    toast.error(response.message || "Error al publicar el vehículo");
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
        onSubmit={form.handleSubmit(handleSubmit)}
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

        <aside className="flex flex-col gap-6 lg:col-span-1">
          <QuickVehiclePreview />
          <QuickVehicleOptionalSections />
          <button
            type="button"
            className="text-left text-sm text-primary hover:underline"
            onClick={() => {
              document.getElementById("quick-optional-sections")?.scrollIntoView({
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
