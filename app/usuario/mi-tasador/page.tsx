import { createUserAreaMetadata } from "@/lib/metadata/create-user-area-metadata";

import { TasadorForm } from "@/app/(public)/tasador/components/TasadorForm";

export const metadata = createUserAreaMetadata(
  "Tasador",
  "Solicita una tasación prioritaria de tu vehículo con tus datos de contacto.",
);

export default function MiTasadorPage() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-bold text-slate-900">Tasador</h1>
        <p className="text-sm text-slate-600">
          Completa los datos de tu vehículo y te enviaremos una estimación de
          precio con prioridad.
        </p>
      </div>

      <div className="mx-auto w-full max-w-2xl">
        <TasadorForm variant="user" />
      </div>
    </div>
  );
}
