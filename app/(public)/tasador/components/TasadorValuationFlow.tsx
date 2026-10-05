"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "sonner";

import { useUser } from "@/app/contexts/auth/useUser";
import { SignInDialog } from "@/components/auth/signInDialog";
import { appraisalService } from "@/services/appraisal/appraisalService";
import type { AppraisalDetail } from "@/services/appraisal/types/appraisal.types";

import type { StrapiPaginaTasadorResponse } from "../types/strapi-tasador.types";
import { tasadorIconPack } from "../utils/tasadorIconPack";
import {
  clearPendingTasador,
  readPendingTasador,
  savePendingTasador,
  toEstimatePayload,
} from "../utils/tasadorPending";
import type { TasadorFormValues } from "../schemas/tasador.schema";
import { TasadorForm } from "./TasadorForm";
import { TasadorOptions, type RequestOffersState } from "./TasadorOptions";
import { TasadorSidebar } from "./TasadorSidebar";
import { TasadorValuationResult } from "./TasadorValuationResult";

interface TasadorValuationFlowProps {
  content: StrapiPaginaTasadorResponse;
}

/**
 * Formulario → (login si hace falta) → tasación IA → resultado y opciones.
 * Si no hay sesión, se guardan los datos, se abre el login y la tasación se envía sola
 * al iniciar sesión (también al volver de Google/Apple, vía sessionStorage).
 */
export const TasadorValuationFlow = ({ content }: TasadorValuationFlowProps) => {
  const { user } = useUser();
  const topRef = useRef<HTMLDivElement>(null);
  const [formValues, setFormValues] = useState<TasadorFormValues | undefined>();
  const [formKey, setFormKey] = useState(0);
  const [appraisal, setAppraisal] = useState<AppraisalDetail | null>(null);
  const [isEstimating, setIsEstimating] = useState(false);
  const [signInOpen, setSignInOpen] = useState(false);
  const [requestState, setRequestState] = useState<RequestOffersState>("idle");
  const pendingRef = useRef<TasadorFormValues | null>(null);

  const mensajes = content.formulario?.mensajes;

  const estimate = useCallback(
    async (values: TasadorFormValues) => {
      setIsEstimating(true);
      setFormValues(values);
      try {
        const response = await appraisalService.estimate(toEstimatePayload(values));
        if (response.status === 401) {
          pendingRef.current = values;
          savePendingTasador(values);
          setSignInOpen(true);
          return;
        }
        if (!response.ok) {
          toast.error(
            response.status === 429
              ? response.message
              : mensajes?.error_generico || response.message,
          );
          return;
        }

        clearPendingTasador();
        setAppraisal(response.data);
        setRequestState("idle");
        if (mensajes?.exito) {
          toast.success(mensajes.exito);
        }
        topRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      } catch {
        toast.error(mensajes?.error_generico);
      } finally {
        setIsEstimating(false);
      }
    },
    [mensajes],
  );

  const handleSubmit = (values: TasadorFormValues) => {
    if (!user) {
      pendingRef.current = values;
      setFormValues(values);
      savePendingTasador(values);
      setSignInOpen(true);
      return;
    }
    void estimate(values);
  };

  // Vuelta de un login OAuth (redirige fuera de la página): retoma la tasación pendiente.
  useEffect(() => {
    if (!user || appraisal || isEstimating || signInOpen) {
      return;
    }
    const pending = readPendingTasador();
    if (pending) {
      setFormValues(pending);
      setFormKey((key) => key + 1);
      void estimate(pending);
    }
  }, [user, appraisal, isEstimating, signInOpen, estimate]);

  const handleSignInSuccess = async () => {
    const pending = pendingRef.current;
    pendingRef.current = null;
    if (pending) {
      await estimate(pending);
    }
  };

  const handleEdit = () => {
    setAppraisal(null);
    setFormKey((key) => key + 1);
    topRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const handleRequestOffers = async () => {
    if (!appraisal) {
      return;
    }
    setRequestState("loading");
    const response = await appraisalService.requestOffers(appraisal.id).catch(() => null);
    if (!response?.ok) {
      setRequestState("idle");
      toast.error(content.ofertas?.mensajes?.error_generico || response?.message);
      return;
    }
    setAppraisal(response.data);
    setRequestState("sent");
    if (content.ofertas?.mensajes?.exito) {
      toast.success(content.ofertas.mensajes.exito);
    }
  };

  return (
    <div ref={topRef} className="scroll-mt-24">
      {appraisal && content.resultado ? (
        <div className="flex flex-col gap-10">
          <TasadorValuationResult
            appraisal={appraisal}
            content={content.resultado}
            onEdit={handleEdit}
          />
          {content.opciones && content.ofertas ? (
            <TasadorOptions
              appraisalId={appraisal.id}
              opciones={content.opciones}
              ofertas={content.ofertas}
              iconPack={tasadorIconPack}
              requestState={
                appraisal.status === "open_for_offers" ? "sent" : requestState
              }
              onRequestOffers={() => void handleRequestOffers()}
            />
          ) : null}
        </div>
      ) : content.formulario ? (
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <TasadorForm
              key={formKey}
              content={content.formulario}
              defaultValues={formValues}
              isSubmitting={isEstimating}
              onSubmit={handleSubmit}
            />
          </div>
          <TasadorSidebar
            comoFunciona={content.como_funciona}
            avisoPrivacidad={content.aviso_privacidad}
            iconPack={tasadorIconPack}
          />
        </div>
      ) : null}

      <SignInDialog
        open={signInOpen}
        onOpenChange={setSignInOpen}
        onSuccess={handleSignInSuccess}
        returnTo="/tasador"
      />
    </div>
  );
};
