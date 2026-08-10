"use client";

import { Controller, useFormContext } from "react-hook-form";
import { ImageIcon, VideoIcon, Lock } from "lucide-react";
import { VehicleFormStep } from "@/app/(public)/components/vehicleFormStep";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ImagesForm } from "@/components/vehicles/forms/imagesForm";
import { VideosForm } from "@/components/vehicles/forms/videosForm";
import { useEntitlements } from "@/hooks/useEntitlements";
import type { VehicleFormValues } from "./form-values";

interface SharedMediaSectionProps {
  vehicleId?: string;
  layout?: "quick" | "professional";
}

export const SharedMediaSection = ({
  vehicleId,
  layout = "quick",
}: SharedMediaSectionProps) => {
  const form = useFormContext<VehicleFormValues>();
  const { has, getLimit, isLoading } = useEntitlements();
  const canUploadVideos = has("video_upload");
  const photosLimit = getLimit("photos_per_vehicle");
  const maxImages = photosLimit == null ? undefined : photosLimit;

  const mediaContent = (
    <>
      {!isLoading && maxImages != null ? (
        <p className="mb-3 text-sm text-muted-foreground">
          Tu plan permite hasta {maxImages} fotos por vehículo (mínimo 3).
        </p>
      ) : null}

      {canUploadVideos ? (
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
                    value={field.value}
                    onChange={field.onChange}
                    reference_id={vehicleId}
                    maxImages={maxImages}
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
      ) : (
        <div className="flex flex-col gap-4">
          <Controller
            name="images"
            control={form.control}
            render={({ field, fieldState }) => (
              <div>
                <ImagesForm
                  value={field.value}
                  onChange={field.onChange}
                  reference_id={vehicleId}
                  maxImages={maxImages}
                />
                {fieldState.error ? (
                  <p className="mt-2 text-sm text-destructive">
                    {fieldState.error.message}
                  </p>
                ) : null}
              </div>
            )}
          />
          {!isLoading ? (
            <div className="flex items-start gap-3 rounded-lg border border-dashed border-muted-foreground/30 bg-muted/40 px-4 py-3 text-sm text-muted-foreground">
              <Lock className="mt-0.5 size-4 shrink-0" aria-hidden />
              <p>
                La subida de vídeos no está incluida en tu plan actual. Mejora tu
                suscripción para añadir vídeos al anuncio.
              </p>
            </div>
          ) : null}
        </div>
      )}
    </>
  );

  if (layout === "professional") {
    return (
      <div className="flex flex-col gap-5">
        <Card className="bg-white shadow-sm ring-1 ring-gray-100">
          <CardHeader className="border-b border-gray-100 pb-4">
            <CardTitle className="text-base font-semibold text-gray-900">
              Fotografías
            </CardTitle>
            <CardDescription>
              Añade al menos 3 fotos del vehículo.
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-2">
            <Controller
              name="images"
              control={form.control}
              render={({ field, fieldState }) => (
                <div>
                  <ImagesForm
                    value={field.value}
                    onChange={field.onChange}
                    reference_id={vehicleId}
                    maxImages={maxImages}
                  />
                  {fieldState.error ? (
                    <p className="mt-2 text-sm text-destructive">
                      {fieldState.error.message}
                    </p>
                  ) : null}
                </div>
              )}
            />
          </CardContent>
        </Card>

        {canUploadVideos ? (
          <Card className="bg-white shadow-sm ring-1 ring-gray-100">
            <CardHeader className="border-b border-gray-100 pb-4">
              <CardTitle className="text-base font-semibold text-gray-900">
                Vídeos
              </CardTitle>
              <CardDescription>Opcional según tu plan.</CardDescription>
            </CardHeader>
            <CardContent className="pt-2">
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
            </CardContent>
          </Card>
        ) : !isLoading ? (
          <Card className="bg-white shadow-sm ring-1 ring-gray-100">
            <CardHeader className="border-b border-gray-100 pb-4">
              <CardTitle className="text-base font-semibold text-gray-900">
                Vídeos
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-2">
              <div className="flex items-start gap-3 rounded-lg border border-dashed border-muted-foreground/30 bg-muted/40 px-4 py-3 text-sm text-muted-foreground">
                <Lock className="mt-0.5 size-4 shrink-0" aria-hidden />
                <p>
                  La subida de vídeos no está incluida en tu plan actual.
                </p>
              </div>
            </CardContent>
          </Card>
        ) : null}
      </div>
    );
  }

  return (
    <VehicleFormStep
      number={1}
      label="Fotos y vídeos"
      description="Añade al menos 3 fotos. Los vídeos son opcionales si tu plan los incluye."
    >
      {mediaContent}
    </VehicleFormStep>
  );
};
