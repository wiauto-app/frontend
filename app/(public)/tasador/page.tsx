import type { Metadata } from "next";

import { TasadorForm } from "./components/TasadorForm";

export const metadata: Metadata = {
  title: "Tasador de vehículos | WiAuto",
  description:
    "Solicita una tasación gratuita de tu vehículo y recibe un rango de precio estimado de nuestro equipo.",
};

export default function TasadorPage() {
  return (
    <div className="container-custom flex flex-col gap-8 py-10">
      <div className="mx-auto flex max-w-2xl flex-col gap-3 text-center">
        <h1 className="text-3xl font-bold text-slate-900">
          Tasador de vehículos
        </h1>
        <p className="text-slate-600">
          Cuéntanos sobre tu vehículo y te enviaremos un rango de precio
          estimado sin compromiso.
        </p>
      </div>

      <div className="mx-auto w-full max-w-2xl">
        <TasadorForm variant="public" />
      </div>
    </div>
  );
}
