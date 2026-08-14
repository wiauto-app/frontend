import { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import {
  Card,
  CardContent,
} from "@/components/ui/card";
import { QuickVehicleForm } from "@/components/vehicles/quick-publish/QuickVehicleForm";

export const metadata: Metadata = {
  title: "Editar vehículo",
  description: "Editar vehículo",
}

export default async function EditarVehiculoPage(props: { params: Promise<{ id: string }> }) {

  const { id } = await props.params;
  return (
    <div className="container-custom mx-auto lg:py-8 py-4 space-y-4">
      <div>
        <Link
          href="/perfil"
          className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700 transition-colors mb-4"
        >
          <ArrowLeft className="h-4 w-4" />
          Volver al perfil
        </Link>
        <h1 className="text-xl font-bold text-gray-900 sr-only md:not-sr-only">
          Editar vehículo
        </h1>
      
      </div>

      <Card>
        <CardContent>
          <QuickVehicleForm
            vehicleId={id}
            redirectTo="/usuario/mis-anuncios"
          />
        </CardContent>
      </Card>
    </div>
  );
}
