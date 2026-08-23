"use client";

import { Controller, useFormContext } from "react-hook-form";
import { ImageIcon, VideoIcon } from "lucide-react";
import { VehicleFormStep } from "@/app/(public)/components/vehicleFormStep";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ImagesForm } from "@/components/vehicles/forms/imagesForm";
import { VideosForm } from "@/components/vehicles/forms/videosForm";
import type { QuickVehicleSchema } from "@/components/vehicles/schemas/quick-vehicle.schema";
import { useEntitlements } from "@/hooks/useEntitlements";
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

  const { entitlements,billingSummary } = useEntitlements();
  const limit = entitlements?.photos_per_vehicle?.limit;
  const canUploadVideos = entitlements?.video_upload?.value;
  return (
    <VehicleFormStep
      number={1}
      label="Fotos y vídeos"
      description={
        canUploadVideos
          ? "Añade al menos 3 fotos. Los vídeos son opcionales."
          : "Añade al menos 3 fotos."
      }
    >
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
              <div>
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
