"use client";

import { useState } from "react";
import Link from "next/link";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { ArrowLeft, Building2 } from "lucide-react";
import { toast } from "sonner";

import { TasadorOptions, type RequestOffersState } from "@/app/(public)/tasador/components/TasadorOptions";
import { TasadorValuationResult } from "@/app/(public)/tasador/components/TasadorValuationResult";
import type { StrapiPaginaTasadorResponse } from "@/app/(public)/tasador/types/strapi-tasador.types";
import { tasadorIconPack } from "@/app/(public)/tasador/utils/tasadorIconPack";
import { AppraisalStatusBadge } from "@/components/appraisal/AppraisalStatusBadge";
import { StrapiEncabezado } from "@/components/strapi/StrapiEncabezado";
import { Button } from "@/components/ui/button";
import { CustomAlertDialog } from "@/components/ui/customAlertDialog";
import { EmptyContent } from "@/components/ui/emptyContent";
import { LoadingComponent } from "@/components/ui/loadingComponent";
import { formatVehiclePriceEur } from "@/components/vehicles/quick-publish/VehiclePriceRecommendation";
import { appraisalService } from "@/services/appraisal/appraisalService";
import type { AppraisalDetail, AppraisalOffer } from "@/services/appraisal/types/appraisal.types";

import { MY_APPRAISALS_QUERY_KEY } from "./MyAppraisalsList";

interface MyAppraisalDetailProps {
  id: string;
  content: StrapiPaginaTasadorResponse;
}

const appraisalQueryKey = (id: string) => ["appraisals", id] as const;

/** Tasación guardada: resultado, opciones y las ofertas recibidas para aceptar o rechazar. */
export const MyAppraisalDetail = ({ id, content }: MyAppraisalDetailProps) => {
  const queryClient = useQueryClient();
  const [requestState, setRequestState] = useState<RequestOffersState>("idle");
  const [offerToAccept, setOfferToAccept] = useState<AppraisalOffer | null>(null);
  const [busyOfferId, setBusyOfferId] = useState<string | null>(null);
  const ofertas = content.ofertas;

  const { data: appraisal, isLoading, isError } = useQuery({
    queryKey: appraisalQueryKey(id),
    queryFn: async () => {
      const response = await appraisalService.findOne(id);
      if (!response.ok) {
        throw new Error(response.message);
      }
      return response.data;
    },
  });

  const update = (next: AppraisalDetail) => {
    queryClient.setQueryData(appraisalQueryKey(id), next);
    void queryClient.invalidateQueries({ queryKey: MY_APPRAISALS_QUERY_KEY });
  };

  const handleRequestOffers = async () => {
    setRequestState("loading");
    const response = await appraisalService.requestOffers(id).catch(() => null);
    if (!response?.ok) {
      setRequestState("idle");
      toast.error(ofertas?.mensajes?.error_generico || response?.message);
      return;
    }
    update(response.data);
    setRequestState("sent");
  };

  const respond = async (offer: AppraisalOffer, action: "accept" | "reject") => {
    setBusyOfferId(offer.id);
    const response = await (action === "accept"
      ? appraisalService.acceptOffer(id, offer.id)
      : appraisalService.rejectOffer(id, offer.id)
    ).catch(() => null);
    setBusyOfferId(null);
    setOfferToAccept(null);

    if (!response?.ok) {
      toast.error(response?.message || ofertas?.mensajes?.error_generico);
      return;
    }
    update(response.data);
    toast.success(action === "accept" ? "Oferta aceptada" : "Oferta rechazada");
  };

  if (isLoading) {
    return <LoadingComponent />;
  }

  if (isError || !appraisal) {
    return (
      <EmptyContent
        variant="error"
        title="No encontramos esta tasación"
        description="Puede que ya no exista o que no tengas acceso."
      />
    );
  }

  const canRequestOffers = appraisal.status === "estimated" || appraisal.status === "expired";
  const isOpen = appraisal.status === "open_for_offers";
  const pendingOffers = appraisal.offers.filter((offer) => offer.status === "pending");
  const acceptedOffer = appraisal.offers.find((offer) => offer.status === "accepted");

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-3">
        <Link
          href="/usuario/mi-tasador"
          className="inline-flex w-fit items-center gap-1.5 text-sm text-slate-500 hover:text-slate-700"
        >
          <ArrowLeft className="size-4" aria-hidden />
          Mis tasaciones
        </Link>
        <div className="flex flex-wrap items-center gap-3">
          <h1 className="text-2xl font-bold text-slate-900">{appraisal.vehicle.vehicle_label}</h1>
          <AppraisalStatusBadge status={appraisal.status} />
        </div>
        {isOpen && appraisal.offers_expire_at ? (
          <p className="text-sm text-slate-600">
            Recibes ofertas hasta el{" "}
            {new Date(appraisal.offers_expire_at).toLocaleDateString("es-ES", {
              day: "numeric",
              month: "long",
            })}
            .
          </p>
        ) : null}
      </div>

      {content.resultado ? (
        <TasadorValuationResult appraisal={appraisal} content={content.resultado} />
      ) : null}

      {canRequestOffers && content.opciones && ofertas ? (
        <TasadorOptions
          appraisalId={appraisal.id}
          opciones={content.opciones}
          ofertas={ofertas}
          iconPack={tasadorIconPack}
          requestState={requestState}
          onRequestOffers={() => void handleRequestOffers()}
        />
      ) : null}

      {(isOpen || acceptedOffer) && ofertas ? (
        <section className="flex flex-col gap-4">
          <StrapiEncabezado
            content={ofertas.encabezado_ofertas}
            className="text-left"
            titleClassName="text-xl sm:text-2xl"
          />

          {acceptedOffer ? (
            <div className="flex items-start gap-3 rounded-2xl bg-emerald-50 p-5 ring-1 ring-emerald-100">
              <Building2 className="mt-0.5 size-5 text-emerald-700" aria-hidden />
              <div className="flex flex-col gap-1">
                <p className="font-semibold text-emerald-900">
                  Aceptaste la oferta de {acceptedOffer.dealership.name} por{" "}
                  {formatVehiclePriceEur(acceptedOffer.amount)}.
                </p>
                <p className="text-sm text-emerald-900/80">
                  Le compartimos tus datos de contacto; se pondrá en contacto contigo para
                  revisar el coche y cerrar la compra.
                </p>
                <Link
                  href={`/concesionario/${acceptedOffer.dealership.slug}`}
                  className="text-sm font-semibold text-emerald-800 hover:underline"
                >
                  Ver concesionario
                </Link>
              </div>
            </div>
          ) : null}

          {isOpen && pendingOffers.length === 0 ? (
            <p className="rounded-2xl bg-slate-50 p-5 text-sm text-slate-600">{ofertas.sin_ofertas}</p>
          ) : null}

          {isOpen && pendingOffers.length > 0 ? (
            <ul className="flex flex-col gap-3">
              {pendingOffers.map((offer) => (
                <li
                  key={offer.id}
                  className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-4 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div className="flex flex-col gap-1">
                    <p className="text-sm text-slate-600">{offer.dealership.name}</p>
                    <p className="text-2xl font-bold text-slate-900">
                      {formatVehiclePriceEur(offer.amount)}
                    </p>
                    {offer.message ? <p className="text-sm text-slate-600">{offer.message}</p> : null}
                  </div>
                  <div className="flex gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      disabled={busyOfferId !== null}
                      onClick={() => void respond(offer, "reject")}
                    >
                      {ofertas.boton_rechazar}
                    </Button>
                    <Button
                      type="button"
                      className="bg-green-600 text-white hover:bg-green-700"
                      disabled={busyOfferId !== null}
                      onClick={() => setOfferToAccept(offer)}
                    >
                      {ofertas.boton_aceptar}
                    </Button>
                  </div>
                </li>
              ))}
            </ul>
          ) : null}
        </section>
      ) : null}

      <CustomAlertDialog
        open={offerToAccept !== null}
        onOpenChange={(open) => {
          if (!open) setOfferToAccept(null);
        }}
        title={
          offerToAccept
            ? `¿Aceptar ${formatVehiclePriceEur(offerToAccept.amount)} de ${offerToAccept.dealership.name}?`
            : ""
        }
        description={ofertas?.confirmar_aceptar}
        confirmText={ofertas?.boton_aceptar}
        isConfirming={busyOfferId !== null}
        onConfirm={() => (offerToAccept ? respond(offerToAccept, "accept") : undefined)}
      />
    </div>
  );
};
