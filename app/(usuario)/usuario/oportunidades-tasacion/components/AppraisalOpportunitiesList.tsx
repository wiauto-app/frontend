"use client";

import { useState } from "react";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { ChevronRight } from "lucide-react";

import { AppraisalStatusBadge } from "@/components/appraisal/AppraisalStatusBadge";
import { AppraisalVehicleHeading } from "@/components/appraisal/AppraisalVehicleHeading";
import { Button } from "@/components/ui/button";
import { EmptyContent } from "@/components/ui/emptyContent";
import { LoadingComponent } from "@/components/ui/loadingComponent";
import { formatVehiclePriceEur } from "@/components/vehicles/quick-publish/VehiclePriceRecommendation";
import { APPRAISAL_OFFER_STATUS_LABEL } from "@/services/appraisal/appraisal.labels";
import { appraisalOpportunitiesService } from "@/services/appraisal/appraisalService";
import type { AppraisalOpportunityScope } from "@/services/appraisal/types/appraisal.types";

const SCOPES: { value: AppraisalOpportunityScope; label: string }[] = [
  { value: "open", label: "Abiertas" },
  { value: "mine", label: "Mis ofertas" },
];

/** Tasaciones abiertas a ofertas y las que el concesionario ya ofertó. */
export const AppraisalOpportunitiesList = () => {
  const [scope, setScope] = useState<AppraisalOpportunityScope>("open");
  const [page, setPage] = useState(1);

  const { data, isLoading, error } = useQuery({
    queryKey: ["appraisal-opportunities", scope, page],
    queryFn: async () => {
      const response = await appraisalOpportunitiesService.findAll({ scope, page, limit: 12 });
      if (!response.ok) {
        throw new Error(response.message);
      }
      return response.data;
    },
  });

  const totalPages = data ? Math.max(1, Math.ceil(data.total / data.limit)) : 1;

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-bold text-slate-900">Oportunidades de tasación</h1>
        <p className="text-sm text-slate-600">
          Coches tasados por particulares que quieren vender a un profesional. El vendedor
          comparte sus datos solo con el concesionario cuya oferta acepta.
        </p>
      </div>

      <div className="flex gap-2" role="group" aria-label="Filtrar oportunidades">
        {SCOPES.map((item) => (
          <Button
            key={item.value}
            type="button"
            size="sm"
            variant={scope === item.value ? "default" : "outline"}
            aria-pressed={scope === item.value}
            onClick={() => {
              setScope(item.value);
              setPage(1);
            }}
          >
            {item.label}
          </Button>
        ))}
      </div>

      {isLoading ? <LoadingComponent /> : null}

      {error ? (
        <EmptyContent variant="error" title="No pudimos cargar las oportunidades" description={error.message} />
      ) : null}

      {data && data.data.length === 0 ? (
        <EmptyContent
          title={scope === "open" ? "No hay tasaciones abiertas ahora mismo" : "Todavía no has ofertado"}
          description="Te avisaremos cuando un particular pida ofertas por su coche."
        />
      ) : null}

      {data?.data.length ? (
        <ul className="grid gap-3 md:grid-cols-2">
          {data.data.map((opportunity) => (
            <li key={opportunity.id}>
              <Link
                href={`/usuario/oportunidades-tasacion/${opportunity.id}`}
                className="flex h-full items-center gap-4 rounded-2xl border border-slate-200 bg-white p-4 transition-colors hover:border-primary/40"
              >
                <div className="flex flex-1 flex-col gap-3">
                  <div className="flex items-start justify-between gap-2">
                    <AppraisalVehicleHeading vehicle={opportunity.vehicle} estimate={opportunity.estimate} />
                    <AppraisalStatusBadge status={opportunity.status} />
                  </div>
                  <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-slate-600">
                    <span>
                      {opportunity.offers_count}{" "}
                      {opportunity.offers_count === 1 ? "oferta" : "ofertas"}
                    </span>
                    {opportunity.my_offer ? (
                      <span className="font-medium text-slate-900">
                        Tu oferta: {formatVehiclePriceEur(opportunity.my_offer.amount)} (
                        {APPRAISAL_OFFER_STATUS_LABEL[opportunity.my_offer.status].toLowerCase()})
                      </span>
                    ) : null}
                    {opportunity.offers_expire_at ? (
                      <span>
                        Cierra el{" "}
                        {new Date(opportunity.offers_expire_at).toLocaleDateString("es-ES")}
                      </span>
                    ) : null}
                  </div>
                </div>
                <ChevronRight className="size-5 shrink-0 text-slate-400" aria-hidden />
              </Link>
            </li>
          ))}
        </ul>
      ) : null}

      {totalPages > 1 ? (
        <div className="flex items-center justify-center gap-3">
          <Button variant="outline" size="sm" disabled={page <= 1} onClick={() => setPage((p) => p - 1)}>
            Anterior
          </Button>
          <span className="text-sm text-slate-600">
            {page} / {totalPages}
          </span>
          <Button
            variant="outline"
            size="sm"
            disabled={page >= totalPages}
            onClick={() => setPage((p) => p + 1)}
          >
            Siguiente
          </Button>
        </div>
      ) : null}
    </div>
  );
};
