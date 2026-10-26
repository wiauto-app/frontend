"use client";

import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { ChevronRight, Plus } from "lucide-react";

import { AppraisalStatusBadge } from "@/components/appraisal/AppraisalStatusBadge";
import { AppraisalVehicleHeading } from "@/components/appraisal/AppraisalVehicleHeading";
import { Button } from "@/components/ui/button";
import { EmptyContent } from "@/components/ui/emptyContent";
import { LoadingComponent } from "@/components/ui/loadingComponent";
import { formatVehiclePriceEur } from "@/components/vehicles/quick-publish/VehiclePriceRecommendation";
import { appraisalService } from "@/services/appraisal/appraisalService";

export const MY_APPRAISALS_QUERY_KEY = ["appraisals", "me"] as const;

/** Historial de tasaciones del usuario con su estado y ofertas. */
export const MyAppraisalsList = () => {
  const { data, isLoading, isError } = useQuery({
    queryKey: MY_APPRAISALS_QUERY_KEY,
    queryFn: async () => {
      const response = await appraisalService.findAllMine();
      if (!response.ok) {
        throw new Error(response.message);
      }
      return response.data;
    },
  });

  const newAppraisal = (
    <Button nativeButton={false} render={<Link href="/tasador" />} className="gap-2">
      <Plus className="size-4" aria-hidden />
      Nueva tasación
    </Button>
  );

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl font-bold text-slate-900">Mis tasaciones</h1>
          <p className="text-sm text-slate-600">
            Revisa el valor estimado de tus coches y las ofertas de los concesionarios.
          </p>
        </div>
        {data?.length ? newAppraisal : null}
      </div>

      {isLoading ? <LoadingComponent /> : null}

      {isError ? (
        <EmptyContent
          variant="error"
          title="No pudimos cargar tus tasaciones"
          description="Inténtalo de nuevo en unos minutos."
        />
      ) : null}

      {data && data.length === 0 ? (
        <EmptyContent
          title="Aún no has tasado ningún coche"
          description="Tasa tu coche gratis en segundos y recibe ofertas de concesionarios."
          action={newAppraisal}
        />
      ) : null}

      {data?.length ? (
        <ul className="flex flex-col gap-3">
          {data.map((appraisal) => (
            <li key={appraisal.id}>
              <Link
                href={`/usuario/mi-tasador/${appraisal.id}`}
                className="flex items-center gap-4 rounded-2xl border border-slate-200 bg-white p-4 transition-colors hover:border-primary/40"
              >
                <div className="flex flex-1 flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                  <AppraisalVehicleHeading vehicle={appraisal.vehicle} estimate={appraisal.estimate} />
                  <div className="flex flex-col gap-1 sm:items-end">
                    <AppraisalStatusBadge status={appraisal.status} />
                    {appraisal.offers_count > 0 ? (
                      <p className="text-sm text-slate-600">
                        {appraisal.offers_count}{" "}
                        {appraisal.offers_count === 1 ? "oferta" : "ofertas"}
                        {appraisal.best_offer_amount
                          ? ` · mejor: ${formatVehiclePriceEur(appraisal.best_offer_amount)}`
                          : ""}
                      </p>
                    ) : null}
                    <p className="text-xs text-slate-400">
                      {new Date(appraisal.created_at).toLocaleDateString("es-ES")}
                    </p>
                  </div>
                </div>
                <ChevronRight className="size-5 shrink-0 text-slate-400" aria-hidden />
              </Link>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
};
