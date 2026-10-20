import Link from "next/link";
import { ArrowLeft, Car, CarFront } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
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
        <div className="flex items-center gap-2">
          <CarFront className="size-8 text-primary" />
          <div className="flex flex-col">
            <SectionHeading
              className="text-xl font-bold text-gray-900 not-sr-only text-start"
              lead=" Publicación rápida"
              description="Publica tu vehículo en menos de 1 minuto"
            ></SectionHeading>
          </div>
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
