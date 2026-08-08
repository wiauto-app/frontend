"use client";

import { useEffect } from "react";
import { FormProvider, useForm, type Resolver } from "react-hook-form";
import { standardSchemaResolver } from "@hookform/resolvers/standard-schema";
import { useQuery } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  createQuickVehicleDefaultValues,
  quickVehicleSchema,
  type QuickVehicleSchema,
} from "@/components/vehicles/schemas/quick-vehicle.schema";
import { vehiclesService } from "@/components/vehicles/services/vehiclesService";
import { serializeQuickVehiclePayload } from "@/components/vehicles/utils/serializeQuickVehiclePayload";
import { mapVehicleDetailToQuickFormValues } from "@/components/vehicles/utils/mapVehicleDetailToQuickFormValues";
import { ProfessionalEditPreview } from "./ProfessionalEditPreview";
import { ProfessionalEditSections } from "./ProfessionalEditSections";
import { useUser } from "@/app/contexts/auth/useUser";

interface ProfessionalVehicleEditFormProps {
  vehicleId: string;
  onSuccess?: () => void;
}

export const ProfessionalVehicleEditForm = ({
  vehicleId,
  onSuccess,
}: ProfessionalVehicleEditFormProps) => {
  const { data: vehicleDetail, isLoading: isLoadingVehicle } = useQuery({
    queryKey: ["vehicle", vehicleId],
    queryFn: () => vehiclesService.findOne(vehicleId),
  });

  const { user } = useUser();
  const form = useForm<QuickVehicleSchema>({
    resolver: standardSchemaResolver(
      quickVehicleSchema,
    ) as Resolver<QuickVehicleSchema>,
    defaultValues: createQuickVehicleDefaultValues,
  });

  useEffect(() => {
    if (!vehicleDetail) {
      return;
    }

    const values = mapVehicleDetailToQuickFormValues(vehicleDetail);
    form.reset({
      ...values,
      publisher_type: "dealership",
    });
  }, [vehicleDetail, form]);

  const handleSubmit = async (data: QuickVehicleSchema) => {
    const payload = serializeQuickVehiclePayload(
      { ...data, publisher_type: "dealership" },
      { isUpdate: true },
    );
    const response = await vehiclesService.update(vehicleId, payload as never);

    if (response.ok) {
      toast.success("Vehículo actualizado correctamente");
      onSuccess?.();
      return;
    }

    toast.error(response.message || "Error al actualizar el vehículo");
  };

  if (isLoadingVehicle) {
    return (
      <div className="flex min-h-48 items-center justify-center gap-2 text-muted-foreground">
        <Loader2 className="size-5 animate-spin" aria-hidden />
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
        className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_320px]"
      >
        <div className="min-w-0 space-y-5">
          <ProfessionalEditSections
            vehicleId={vehicleId}
            contactName={contactName}
          />
          <div className="sticky bottom-4 z-10 flex justify-end rounded-xl border border-gray-100 bg-white/95 p-3 shadow-sm backdrop-blur">
            <Button
              type="submit"
              disabled={form.formState.isSubmitting}
              aria-label="Guardar cambios del anuncio"
            >
              {form.formState.isSubmitting ? (
                <>
                  <Loader2 className="size-4 animate-spin" aria-hidden />
                  Guardando…
                </>
              ) : (
                "Guardar cambios"
              )}
            </Button>
          </div>
        </div>

        <aside className="hidden lg:block">
          <ProfessionalEditPreview />
        </aside>
      </form>
    </FormProvider>
  );
};
