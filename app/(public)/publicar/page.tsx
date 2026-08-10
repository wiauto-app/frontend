
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import {
  Card,
  CardContent,
} from "@/components/ui/card";
import { QuickVehicleForm } from "@/components/vehicles/quick-publish/QuickVehicleForm";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Publicar un vehículo",
  description: "Publica tu vehículo en menos de 1 minuto con IA",
};

export default function CrearVehiculoPage() {

  return (
    <div className="container-custom mx-auto py-8">
      <div className="mb-8">
        <Link
          href="/perfil"
          className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700 transition-colors mb-4"
        >
          <ArrowLeft className="h-4 w-4" />
          Volver al perfil
        </Link>
        <h1 className="text-2xl font-bold text-gray-900">Publicación rápida</h1>
        <p className="text-gray-500 mt-1">
          Publica tu vehículo en menos de 1 minuto
        </p>
      </div>

      <Card>
        <CardContent>
          <QuickVehicleForm />
        </CardContent>
      </Card>
    </div>
  );
}
