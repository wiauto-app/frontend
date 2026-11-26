import { Card, CardContent } from "@/components/ui/card";
import { QuickPublishBackLink } from "@/components/vehicles/quick-publish/QuickPublishBackLink";
import { QuickVehicleForm } from "@/components/vehicles/quick-publish/QuickVehicleForm";
import { Metadata } from "next";
import { QuickPublishHeader } from "./components/quickPublishHeader";

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
        <QuickPublishBackLink />
        <QuickPublishHeader />
      </div>

      <Card className="p-0 shadow-none border-none ring-0 lg:shadow-sm lg:p-4 lg:ring-1">
        <CardContent className="p-0">
          <QuickVehicleForm appraisalId={tasacion?.trim() || undefined} />
        </CardContent>
      </Card>
    </div>
  );
}
