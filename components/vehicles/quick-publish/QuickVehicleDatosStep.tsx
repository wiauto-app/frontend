"use client";

import { useFormContext } from "react-hook-form";
import { VehicleFormStep } from "@/app/(public)/components/vehicleFormStep";
import type { QuickVehicleSchema } from "@/components/vehicles/schemas/quick-vehicle.schema";
import { useEntitlements } from "@/hooks/useEntitlements";
import { QuickCatalogFields } from "./QuickCatalogFields";
import { QuickVehicleContactStep } from "./QuickVehicleContactStep";
import { QuickVehicleDescriptionStep } from "./QuickVehicleDescriptionStep";
import { QuickVehicleIdentificationFields } from "./QuickVehicleIdentificationFields";
import { QuickVehiclePricingFields } from "./QuickVehiclePricingFields";
import { QuickVehiclePublishDataTracker } from "./QuickVehiclePublishDataTracker";
import { QuickVehicleMediaStep } from "./QuickVehicleMediaStep";
import { QuickVehicleTypeStep } from "./QuickVehicleTypeStep";

interface QuickVehicleDatosStepProps {
  isEditMode?: boolean;
  vehicleId?: string;
  onImageUploadStatusChange?: (hasIncompleteUploads: boolean) => void;
  onVideoUploadStatusChange?: (hasIncompleteUploads: boolean) => void;
  onGalleryLeadPreviewChange?: (preview: {
    url: string | null;
    totalCount: number;
  }) => void;
}

/** Paso «Datos del anuncio»: fotos, vehículo, contacto y precio. */
export const QuickVehicleDatosStep = ({
  isEditMode = false,
  vehicleId,
  onImageUploadStatusChange,
  onVideoUploadStatusChange,
  onGalleryLeadPreviewChange,
}: QuickVehicleDatosStepProps) => {
  const form = useFormContext<QuickVehicleSchema>();
  const versionError = form.formState.errors.version_id;
  const { isSubscribed } = useEntitlements();

  return (
    <div className="flex flex-col gap-10">
      <QuickVehiclePublishDataTracker />
      <QuickVehicleMediaStep
        onGalleryLeadPreviewChange={onGalleryLeadPreviewChange}
        onImageUploadStatusChange={onImageUploadStatusChange}
        onVideoUploadStatusChange={onVideoUploadStatusChange}
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

      <QuickVehicleContactStep
        isEditMode={isEditMode}
        locationStepNumber={5}
        contactStepNumber={6}
      />

      <QuickVehiclePricingFields stepNumber={7} />

      <QuickVehicleDescriptionStep stepNumber={8} />
    </div>
  );
};
