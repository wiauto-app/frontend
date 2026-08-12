"use client";

import { Controller, useFormContext } from "react-hook-form";
import { ImageIcon, VideoIcon } from "lucide-react";
import { VehicleFormStep } from "@/app/(public)/components/vehicleFormStep";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ImagesForm } from "@/components/vehicles/forms/imagesForm";
import { VideosForm } from "@/components/vehicles/forms/videosForm";
import type { QuickVehicleSchema } from "@/components/vehicles/schemas/quick-vehicle.schema";

interface QuickVehicleMediaStepProps {
  vehicleId?: string;
}

export const QuickVehicleMediaStep = ({
  vehicleId,
}: QuickVehicleMediaStepProps) => {
  const form = useFormContext<QuickVehicleSchema>();

  return (
    <VehicleFormStep
      number={1}
      label="Fotos y vídeos"
      description="Añade al menos 3 fotos. Los vídeos son opcionales."
    >
      <Tabs defaultValue="images">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="images">
            <ImageIcon className="size-4" />
            Imágenes
          </TabsTrigger>
          <TabsTrigger value="videos">
            <VideoIcon className="size-4" />
            Vídeos (opcional)
          </TabsTrigger>
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
      </Tabs>
    </VehicleFormStep>
  );
};
