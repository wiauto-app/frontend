"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { ArrowLeft, Mail, Phone, User } from "lucide-react";
import { toast } from "sonner";

import { TasadorValuationResult } from "@/app/(public)/tasador/components/TasadorValuationResult";
import { AppraisalStatusBadge } from "@/components/appraisal/AppraisalStatusBadge";
import { Button } from "@/components/ui/button";
import { EmptyContent } from "@/components/ui/emptyContent";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { LoadingComponent } from "@/components/ui/loadingComponent";
import { Textarea } from "@/components/ui/textarea";
import { formatVehiclePriceEur } from "@/components/vehicles/quick-publish/VehiclePriceRecommendation";
import type { StrapiTasadorResultado } from "@/interfaces/strapi-components.interface";
import { APPRAISAL_OFFER_STATUS_LABEL } from "@/services/appraisal/appraisal.labels";
import { appraisalOpportunitiesService } from "@/services/appraisal/appraisalService";
import type { AppraisalOpportunity } from "@/services/appraisal/types/appraisal.types";

interface AppraisalOpportunityDetailProps {
  id: string;
  resultado: StrapiTasadorResultado | null;
}

const MIN_OFFER = 100;

/** Detalle para el concesionario: datos del coche, tasación IA y formulario de oferta. */
export const AppraisalOpportunityDetail = ({ id, resultado }: AppraisalOpportunityDetailProps) => {
  const queryClient = useQueryClient();
  const queryKey = ["appraisal-opportunities", "detail", id];
  const [amount, setAmount] = useState("");
  const [message, setMessage] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  const { data: opportunity, isLoading, error } = useQuery({
    queryKey,
    queryFn: async () => {
      const response = await appraisalOpportunitiesService.findOne(id);
      if (!response.ok) {
        throw new Error(response.message);
      }
      return response.data;
    },
  });

  // Precarga el formulario con la oferta vigente del concesionario.
  const myOfferId = opportunity?.my_offer?.id;
  useEffect(() => {
    if (!opportunity?.my_offer) {
      return;
    }
    setAmount(String(opportunity.my_offer.amount));
    setMessage(opportunity.my_offer.message ?? "");
    // eslint-disable-next-line react-hooks/exhaustive-deps -- solo al cambiar de oferta
  }, [myOfferId]);

  const update = (next: AppraisalOpportunity) => {
    queryClient.setQueryData(queryKey, next);
    void queryClient.invalidateQueries({ queryKey: ["appraisal-opportunities"] });
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    const value = Number(amount);
    if (!Number.isInteger(value) || value < MIN_OFFER) {
      toast.error(`Introduce una oferta válida (mínimo ${formatVehiclePriceEur(MIN_OFFER)}).`);
      return;
    }

    setIsSaving(true);
    const response = await appraisalOpportunitiesService
      .upsertOffer(id, { amount: value, message: message.trim() || undefined })
      .catch(() => null);
    setIsSaving(false);

    if (!response?.ok) {
      toast.error(response?.message || "No pudimos enviar tu oferta.");
      return;
    }
    update(response.data);
    toast.success("Oferta enviada al vendedor");
  };

  const handleWithdraw = async () => {
    setIsSaving(true);
    const response = await appraisalOpportunitiesService.withdrawOffer(id).catch(() => null);
    setIsSaving(false);
    if (!response?.ok) {
      toast.error(response?.message || "No pudimos retirar tu oferta.");
      return;
    }
    void queryClient.invalidateQueries({ queryKey: ["appraisal-opportunities"] });
    toast.success("Oferta retirada");
  };

  if (isLoading) {
    return <LoadingComponent />;
  }

  if (error || !opportunity) {
    return (
      <EmptyContent
        variant="error"
        title="No puedes ver esta tasación"
        description={error?.message ?? "Puede que ya se haya cerrado."}
      />
    );
  }

  const isOpen = opportunity.status === "open_for_offers";
  const myOffer = opportunity.my_offer;
  const hasPendingOffer = myOffer?.status === "pending";

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-3">
        <Link
          href="/usuario/oportunidades-tasacion"
          className="inline-flex w-fit items-center gap-1.5 text-sm text-slate-500 hover:text-slate-700"
        >
          <ArrowLeft className="size-4" aria-hidden />
          Oportunidades de tasación
        </Link>
        <div className="flex flex-wrap items-center gap-3">
          <h1 className="text-2xl font-bold text-slate-900">{opportunity.vehicle.vehicle_label}</h1>
          <AppraisalStatusBadge status={opportunity.status} />
        </div>
        <p className="text-sm text-slate-600">
          {opportunity.offers_count}{" "}
          {opportunity.offers_count === 1 ? "oferta recibida" : "ofertas recibidas"}
          {opportunity.offers_expire_at && isOpen
            ? ` · cierra el ${new Date(opportunity.offers_expire_at).toLocaleDateString("es-ES")}`
            : ""}
        </p>
      </div>

      {resultado ? (
        <TasadorValuationResult
          appraisal={opportunity}
          content={resultado}
        />
      ) : null}

      {opportunity.seller_contact ? (
        <section className="flex flex-col gap-3 rounded-2xl bg-emerald-50 p-5 ring-1 ring-emerald-100">
          <h2 className="text-lg font-semibold text-emerald-900">
            ¡El vendedor aceptó tu oferta de {formatVehiclePriceEur(myOffer?.amount ?? 0)}!
          </h2>
          <ul className="flex flex-col gap-2 text-emerald-900">
            <li className="flex items-center gap-2">
              <User className="size-4" aria-hidden />
              {opportunity.seller_contact.name}
            </li>
            <li className="flex items-center gap-2">
              <Phone className="size-4" aria-hidden />
              <a href={`tel:${opportunity.seller_contact.phone_code}${opportunity.seller_contact.phone}`} className="hover:underline">
                {opportunity.seller_contact.phone_code} {opportunity.seller_contact.phone}
              </a>
            </li>
            <li className="flex items-center gap-2">
              <Mail className="size-4" aria-hidden />
              <a href={`mailto:${opportunity.seller_contact.email}`} className="hover:underline">
                {opportunity.seller_contact.email}
              </a>
            </li>
          </ul>
        </section>
      ) : null}

      {myOffer && !hasPendingOffer && !opportunity.seller_contact ? (
        <p className="rounded-2xl bg-slate-50 p-5 text-sm text-slate-700">
          Tu oferta de {formatVehiclePriceEur(myOffer.amount)} está{" "}
          {APPRAISAL_OFFER_STATUS_LABEL[myOffer.status].toLowerCase()}.
        </p>
      ) : null}

      {isOpen ? (
        <form
          onSubmit={(event) => void handleSubmit(event)}
          className="flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-5 sm:p-6"
        >
          <div className="flex flex-col gap-1">
            <h2 className="text-lg font-semibold text-slate-900">
              {hasPendingOffer ? "Actualiza tu oferta" : "Haz tu oferta de compra"}
            </h2>
            <p className="text-sm text-slate-600">
              El vendedor verá el nombre de tu concesionario y el importe. Puedes cambiarla o
              retirarla mientras la tasación siga abierta.
            </p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="flex flex-col gap-2">
              <Label htmlFor="offer-amount">Importe (€) *</Label>
              <Input
                id="offer-amount"
                type="number"
                inputMode="numeric"
                min={MIN_OFFER}
                step={100}
                value={amount}
                onChange={(event) => setAmount(event.target.value)}
                disabled={isSaving}
                required
              />
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="offer-message">Mensaje para el vendedor (opcional)</Label>
            <Textarea
              id="offer-message"
              maxLength={1000}
              value={message}
              onChange={(event) => setMessage(event.target.value)}
              placeholder="Ej: Oferta sujeta a revisión mecánica. Recogemos el coche sin coste."
              disabled={isSaving}
            />
          </div>
          <div className="flex flex-wrap justify-end gap-2">
            {hasPendingOffer ? (
              <Button type="button" variant="outline" disabled={isSaving} onClick={() => void handleWithdraw()}>
                Retirar oferta
              </Button>
            ) : null}
            <Button type="submit" disabled={isSaving}>
              {hasPendingOffer ? "Actualizar oferta" : "Enviar oferta"}
            </Button>
          </div>
        </form>
      ) : null}
    </div>
  );
};
