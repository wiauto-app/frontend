"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { ArrowLeft, Car, ShieldAlert } from "lucide-react";
import { useUser } from "@/app/contexts/auth/useUser";
import { useEntitlements } from "@/hooks/useEntitlements";
import { ProfessionalVehicleEditForm } from "@/components/vehicles/professional-edit/ProfessionalVehicleEditForm";

export const EditarVehiculoProfesionalContent = () => {
  const params = useParams<{ id: string }>();
  const { isLoading, isAuthenticated, user } = useUser();
  const { has, isLoading: isEntitlementsLoading } = useEntitlements();
  const vehicleId = params.id;

  if (isLoading || isEntitlementsLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-r-transparent" />
          <p className="mt-4 text-gray-500">Cargando...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    return (
      <div className="mx-auto mt-10 max-w-md rounded-xl border border-gray-100 bg-white p-8 text-center shadow-sm">
        <Car className="mx-auto h-12 w-12 text-gray-300" aria-hidden />
        <h2 className="mt-4 text-lg font-semibold text-gray-900">
          Inicia sesión para editar
        </h2>
        <p className="mt-2 text-gray-500">
          Debes iniciar sesión para editar un vehículo
        </p>
        <Link
          href={`/iniciar-sesion?redirect=/editar-vehiculo-profesional/${vehicleId}`}
          className="mt-4 inline-flex items-center rounded-lg bg-blue-600 px-6 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700"
        >
          Iniciar sesión
        </Link>
      </div>
    );
  }

  if (!has("advanced_listing_editor")) {
    return (
      <div className="mx-auto mt-10 max-w-md rounded-xl border border-gray-100 bg-white p-8 text-center shadow-sm">
        <ShieldAlert className="mx-auto h-12 w-12 text-amber-400" aria-hidden />
        <h2 className="mt-4 text-lg font-semibold text-gray-900">
          Editor avanzado no incluido
        </h2>
        <p className="mt-2 text-gray-500">
          La edición completa forma parte de los planes de concesionaria. Puedes
          usar el editor rápido de tu anuncio o mejorar tu plan en Monetización.
        </p>
        <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:justify-center">
          <Link
            href={`/editar-vehiculo/${vehicleId}`}
            className="inline-flex items-center justify-center rounded-lg bg-blue-600 px-6 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700"
          >
            Ir al editor rápido
          </Link>
          <Link
            href="/usuario/monetizacion"
            className="inline-flex items-center justify-center rounded-lg border border-gray-200 px-6 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
          >
            Ver planes
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-16">
      <div>
        <Link
          href="/usuario/mis-anuncios"
          className="mb-4 inline-flex items-center gap-1.5 text-sm text-gray-500 transition-colors hover:text-gray-700"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden />
          Volver a mis anuncios
        </Link>
        <h1 className="text-2xl font-bold text-gray-900">Edición completa</h1>
        <p className="mt-1 text-gray-500">
          Revisa y actualiza todos los datos de tu vehículo en un solo
          formulario.
        </p>
      </div>

      <ProfessionalVehicleEditForm vehicleId={vehicleId} />
    </div>
  );
};
