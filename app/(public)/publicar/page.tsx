import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { QuickVehicleForm } from "@/components/vehicles/quick-publish/QuickVehicleForm";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Publicar un vehículo",
  description: "Publica tu vehículo en menos de 1 minuto con IA",
};

export default function CrearVehiculoPage() {
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
        <h1 className="text-xl font-bold text-gray-900 sr-only md:not-sr-only">
          Publicación rápida
        </h1>
        <p className="text-sm text-muted-foreground  sr-only md:not-sr-only">
          Publica tu vehículo en menos de 1 minuto
        </p>
      </div>

      <Card className="p-0 shadow-none border-none ring-0 lg:shadow-sm lg:p-4 lg:ring-1">
        <CardContent className="p-0">
          <QuickVehicleForm />
        </CardContent>
      </Card>
    </div>
  );
}
