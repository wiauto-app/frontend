"use client";

import { Controller, useFormContext } from "react-hook-form";
import { ImageIcon, VideoIcon } from "lucide-react";
import { VehicleFormStep } from "@/app/(public)/components/vehicleFormStep";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ImagesForm } from "@/components/vehicles/forms/imagesForm";
import { VideosForm } from "@/components/vehicles/forms/videosForm";
import {
  RECOMMENDED_VEHICLE_IMAGES,
  type QuickVehicleSchema,
} from "@/components/vehicles/schemas/quick-vehicle.schema";
import { useUser } from "@/app/contexts/auth/useUser";
import { useEntitlements } from "@/hooks/useEntitlements";
import { FREE_PLAN_PHOTOS_PER_VEHICLE_LIMIT } from "@/lib/billing/entitlements";
import { cn } from "@/lib/utils";

interface QuickVehicleMediaStepProps {
  vehicleId?: string;
  onImageUploadStatusChange?: (hasIncompleteUploads: boolean) => void;
}

export const QuickVehicleMediaStep = ({
  vehicleId,
  onImageUploadStatusChange,
}: QuickVehicleMediaStepProps) => {
  const form = useFormContext<QuickVehicleSchema>();

  const { isAuthenticated } = useUser();
  const { entitlements } = useEntitlements();
  // Anónimo: sin `billing_summary`; se aplica el límite del plan gratuito.
  const limit = isAuthenticated
    ? entitlements?.photos_per_vehicle?.limit
    : FREE_PLAN_PHOTOS_PER_VEHICLE_LIMIT;
  const videosLimit = entitlements?.videos_per_vehicle?.limit;
  const canUploadVideos =
    entitlements?.videos_per_vehicle?.type === "unlimited" ||
    entitlements?.videos_per_vehicle?.unlimited === true ||
    (typeof videosLimit === "number" && videosLimit > 0);
  const imageCount = form.watch("images")?.length ?? 0;
  const missingRecommendedImages = RECOMMENDED_VEHICLE_IMAGES - imageCount;

  return (
    <VehicleFormStep
      label="Sube las fotografías del vehículo"
      description={
        canUploadVideos
          ? `Con 1 foto ya puedes publicar, pero recomendamos subir al menos ${RECOMMENDED_VEHICLE_IMAGES}: exterior, interior y salpicadero. Los vídeos son opcionales.`
          : `Con 1 foto ya puedes publicar, pero recomendamos subir al menos ${RECOMMENDED_VEHICLE_IMAGES}: exterior, interior y salpicadero.`
      }
    >
      {imageCount > 0 && missingRecommendedImages > 0 ? (
        <p
          className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800"
          role="status"
          aria-live="polite"
        >
          {missingRecommendedImages === 1
            ? "Sube 1 foto más: los anuncios con más fotografías reciben más contactos."
            : `Sube ${missingRecommendedImages} fotos más: los anuncios con más fotografías reciben más contactos.`}
        </p>
      ) : null}
      <Tabs defaultValue="images">
        <TabsList
          className={cn(
            "grid w-full ",
            canUploadVideos ? "grid-cols-2" : "grid-cols-1",
          )}
        >
          <TabsTrigger value="images">
            <ImageIcon className="size-4" />
            Imágenes
          </TabsTrigger>
          {canUploadVideos && (
            <TabsTrigger value="videos">
              <VideoIcon className="size-4" />
              Vídeos (opcional)
            </TabsTrigger>
          )}
        </TabsList>
        <TabsContent value="images">
          <Controller
            name="images"
            control={form.control}
            render={({ field, fieldState }) => (
              <div data-field-name="images">
                <ImagesForm
                  featureFirstImage={true}
                  value={field.value}
                  onChange={field.onChange}
                  reference_id={vehicleId}
                  maxImages={limit}
                  onUploadStatusChange={onImageUploadStatusChange}
                />
                {fieldState.error ? (
                  <p className="mt-2 text-sm text-destructive">
                    {fieldState.error.message}
                  </p>
                ) : null}
              </div>
            )}
          />
        </TabsContent>
        {canUploadVideos && (
          <TabsContent value="videos">
            <Controller
              name="videos"
              control={form.control}
              render={({ field, fieldState }) => (
                <div>
                  <VideosForm
                    value={field.value ?? []}
                    onChange={field.onChange}
                  />
                  {fieldState.error ? (
                    <p className="mt-2 text-sm text-destructive">
                      {fieldState.error.message}
                    </p>
                  ) : null}
                </div>
              )}
            />
          </TabsContent>
        )}
      </Tabs>
    </VehicleFormStep>
  );
};
