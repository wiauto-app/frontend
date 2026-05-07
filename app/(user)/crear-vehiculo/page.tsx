"use client";

import { useContext } from "react";
import Link from "next/link";
import { ArrowLeft, Car } from "lucide-react";
import { AuthContext } from "@/app/contexts/auth/authContext";
import CrearVehiculoForm from "../components/CrearVehiculoForm";

export default function CrearVehiculoPage() {
  const authContext = useContext(AuthContext);

  if (authContext?.isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-r-transparent" />
          <p className="mt-4 text-gray-500">Cargando...</p>
        </div>
      </div>
    );
  }

  if (!authContext?.isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center bg-white p-8 rounded-xl shadow-sm border border-gray-100 max-w-md">
          <Car className="mx-auto h-12 w-12 text-gray-300" />
          <h2 className="mt-4 text-lg font-semibold text-gray-900">Inicia sesión para publicar</h2>
          <p className="mt-2 text-gray-500">Debes iniciar sesión para publicar un vehículo</p>
          <Link
            href="/iniciar-sesion"
            className="mt-4 inline-flex items-center bg-blue-600 text-white px-6 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
          >
            Iniciar sesión
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
        <div className="mb-8">
          <Link
            href="/perfil"
            className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700 transition-colors mb-4"
          >
            <ArrowLeft className="h-4 w-4" />
            Volver al perfil
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">Publicar vehículo</h1>
          <p className="text-gray-500 mt-1">Completa todos los campos para publicar tu vehículo</p>
        </div>
        <CrearVehiculoForm />
      </div>
    </div>
  );
}
