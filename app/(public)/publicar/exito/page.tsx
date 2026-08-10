import Link from "next/link";
import { CheckCircle2, Eye, LayoutList, Plus } from "lucide-react";
import type { Metadata } from "next";

import { Button } from "@/components/ui/button";

interface CrearVehiculoExitoPageProps {
  searchParams: Promise<{ id?: string }>;
}

export const metadata: Metadata = {
  title: "Anuncio publicado",
  description: "Tu vehículo se publicó correctamente en WiAuto.",
};

export default async function CrearVehiculoExitoPage({
  searchParams,
}: CrearVehiculoExitoPageProps) {
  const params = await searchParams;
  const vehicleId = params.id?.trim() || null;

  return (
    <div className="flex min-h-[70vh] items-center justify-center  px-4 py-12">
      <div className="w-full max-w-lg rounded-2xl border border-slate-100 bg-white p-8 text-center shadow-[0_8px_30px_rgba(15,23,42,0.06)] sm:p-10">
        <div
          className="mx-auto mb-5 flex size-16 items-center justify-center rounded-full bg-emerald-50 ring-8 ring-emerald-50/60"
          aria-hidden
        >
          <CheckCircle2 className="size-9 text-emerald-600" />
        </div>

        <h1 className="mb-2 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
          ¡Anuncio publicado!
        </h1>

        <p className="mx-auto mb-8 max-w-md text-sm leading-relaxed text-slate-600 sm:text-base">
          Tu vehículo ya está en WiAuto. Puedes revisarlo ahora o gestionar todos
          tus anuncios desde tu panel.
        </p>

        <div className="flex flex-col gap-3">
          {vehicleId ? (
            <Button
              size="lg"
              className="h-11 w-full text-base font-semibold"
              nativeButton={false}
              render={<Link href={`/vehiculo/${vehicleId}`} />}
            >
              <Eye className="size-4" aria-hidden />
              Ver mi anuncio
            </Button>
          ) : null}

          <Button
            variant="outline"
            size="lg"
            className="h-11 w-full text-base font-semibold"
            nativeButton={false}
            render={<Link href="/usuario/mis-anuncios" />}
          >
            <LayoutList className="size-4" aria-hidden />
            Ir a mis anuncios
          </Button>
        </div>

        <p className="mt-8 text-sm text-slate-500">
          <Link
            href="/publicar"
            className="inline-flex items-center gap-1.5 font-medium text-primary hover:underline"
          >
            <Plus className="size-3.5" aria-hidden />
            Publicar otro vehículo
          </Link>
        </p>
      </div>
    </div>
  );
}
