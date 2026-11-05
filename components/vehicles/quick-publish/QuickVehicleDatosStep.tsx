"use client";

import { useFormContext } from "react-hook-form";
import { VehicleFormStep } from "@/app/(public)/components/vehicleFormStep";
import type { QuickVehicleSchema } from "@/components/vehicles/schemas/quick-vehicle.schema";
import { QuickCatalogFields } from "./QuickCatalogFields";
import { QuickVehicleAiDescriptionCard } from "./QuickVehicleAiDescriptionCard";
import { QuickVehicleContactStep } from "./QuickVehicleContactStep";
import { QuickVehicleIdentificationFields } from "./QuickVehicleIdentificationFields";
import { QuickVehiclePricingFields } from "./QuickVehiclePricingFields";
import { QuickVehiclePublishDataTracker } from "./QuickVehiclePublishDataTracker";
import { QuickVehicleMediaStep } from "./QuickVehicleMediaStep";
import { QuickVehicleTypeStep } from "./QuickVehicleTypeStep";

interface QuickVehicleDatosStepProps {
  contactName: string;
  isEditMode?: boolean;
  vehicleId?: string;
  onImageUploadStatusChange?: (hasIncompleteUploads: boolean) => void;
  onGalleryLeadPreviewChange?: (preview: {
    url: string | null;
    totalCount: number;
  }) => void;
}

/** Paso «Datos del anuncio»: fotos, vehículo, precio, contacto y descripción. */
export const QuickVehicleDatosStep = ({
  contactName,
  isEditMode = false,
  vehicleId,
  onImageUploadStatusChange,
  onGalleryLeadPreviewChange,
}: QuickVehicleDatosStepProps) => {
  const form = useFormContext<QuickVehicleSchema>();
  const versionError = form.formState.errors.version_id;

  return (
    <div className="flex flex-col gap-10">
      <QuickVehiclePublishDataTracker />
      <QuickVehicleMediaStep
        onGalleryLeadPreviewChange={onGalleryLeadPreviewChange}
        onImageUploadStatusChange={onImageUploadStatusChange}
        stepNumber={1}
        vehicleId={vehicleId}
      />
      <QuickVehicleTypeStep stepNumber={2} />
      <QuickVehicleIdentificationFields stepNumber={3} />

      <VehicleFormStep number={4} label="¿Qué vehículo vendes?">
        <div data-field-name="version_id">
          <QuickCatalogFields />
        </div>
        {versionError ? (
          <p className="text-sm text-destructive">{versionError.message}</p>
        ) : null}
      </VehicleFormStep>

      <QuickVehiclePricingFields stepNumber={5} />

      <QuickVehicleContactStep
        contactName={contactName}
        isEditMode={isEditMode}
        locationStepNumber={6}
        contactStepNumber={7}
      />

      <VehicleFormStep
        number={8}
        isOptional
        label="Descripción del vehículo"
        description="Describe el estado, historial y puntos destacados del vehículo."
      >
        <div className="flex flex-col gap-4 rounded-lg bg-primary/10 p-4">
          <QuickVehicleAiDescriptionCard />
        </div>
      </VehicleFormStep>
    </div>
  );
};
