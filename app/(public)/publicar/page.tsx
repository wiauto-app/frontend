import Link from "next/link";
import { ArrowLeft, CarFront } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { QuickPublishMobileStepBreadcrumb } from "@/components/vehicles/quick-publish/QuickPublishMobileStepBreadcrumb";
import { QuickVehicleForm } from "@/components/vehicles/quick-publish/QuickVehicleForm";
import { Metadata } from "next";
import { SectionHeading } from "@/components/home/SectionHeading";

export const metadata: Metadata = {
  title: "Publicar un vehículo",
  description: "Publica tu vehículo en menos de 1 minuto con IA",
};

interface CrearVehiculoPageProps {
  searchParams: Promise<{ tasacion?: string }>;
}

export default async function CrearVehiculoPage({
  searchParams,
}: CrearVehiculoPageProps) {
  const { tasacion } = await searchParams;

  return (
    <div className="container-custom mx-auto lg:py-8 py-4 space-y-4">
      <div>
        <Link
          href="/usuario/perfil"
          className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700 transition-colors mb-4"
        >
          <ArrowLeft className="h-4 w-4" />
          Volver al perfil
        </Link>
        <div
          id="quick-publish-heading"
          className="flex justify-between gap-3 rounded-lg bg-primary/10 p-2 flex-row items-center lg:gap-4"
        >
          <div className="flex items-center gap-2 flex-1">
            <CarFront className="size-8 shrink-0 text-primary" />
            <div className="flex min-w-0 flex-col">
              <SectionHeading
                descriptionClassName="text-xs text-muted-foreground text-start"
                className="text-md font-bold text-gray-900 not-sr-only text-start"
                lead="Publica tu coche Gratis"
                description="En menos de 1 minuto"
              />
            </div>
          </div>
          <QuickPublishMobileStepBreadcrumb className="lg:hidden" />
        </div>
      </div>

      <Card className="p-0 shadow-none border-none ring-0 lg:shadow-sm lg:p-4 lg:ring-1">
        <CardContent className="p-0">
          <QuickVehicleForm appraisalId={tasacion?.trim() || undefined} />
        </CardContent>
      </Card>
    </div>
  );
}
