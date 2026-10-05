"use client";

import Link from "next/link";
import { ArrowRight, Loader2 } from "lucide-react";

import { StrapiEncabezado } from "@/components/strapi/StrapiEncabezado";
import { Button } from "@/components/ui/button";
import { IconContainer } from "@/components/ui/iconContainer";
import type {
  StrapiTasadorOfertas,
  StrapiTasadorOpcion,
  StrapiTasadorOpciones,
} from "@/interfaces/strapi-components.interface";
import {
  resolveStrapiIconName,
  type StrapiIconPack,
} from "@/lib/strapi/resolveStrapiIconName";
import { cn } from "@/lib/utils";

interface TasadorOptionCardProps {
  option: StrapiTasadorOpcion;
  iconPack: StrapiIconPack;
  tone: "primary" | "success";
  children: React.ReactNode;
}

const TasadorOptionCard = ({ option, iconPack, tone, children }: TasadorOptionCardProps) => {
  const Icon = resolveStrapiIconName(option.iconName, iconPack);
  const CheckIcon = resolveStrapiIconName("HiCheckCircle", iconPack);

  return (
    <article
      className={cn(
        "flex flex-col gap-5 rounded-2xl border p-5 sm:p-6",
        tone === "primary"
          ? "border-blue-100 bg-linear-to-br from-blue-50/70 to-white"
          : "border-green-100 bg-linear-to-br from-green-50/70 to-white",
      )}
    >
      <div className="flex items-start gap-4">
        <IconContainer
          Icon={Icon}
          rounded
          size="lg"
          className={tone === "primary" ? "bg-blue-100 text-primary" : "bg-green-100 text-green-700"}
        />
        <div className="flex flex-col gap-1">
          {option.badge ? (
            <span className="w-fit rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-semibold text-primary">
              {option.badge}
            </span>
          ) : null}
          <h3 className="text-xl font-bold text-slate-900">{option.titulo}</h3>
          {option.descripcion ? (
            <p className="text-sm text-slate-600">{option.descripcion}</p>
          ) : null}
        </div>
      </div>

      {option.puntos?.length ? (
        <ul className="flex flex-col gap-2">
          {option.puntos.map((point, index) => (
            <li key={`${index}-${point.label}`} className="flex items-center gap-2 text-slate-700">
              {CheckIcon ? (
                <CheckIcon
                  aria-hidden
                  className={cn("size-5 shrink-0", tone === "primary" ? "text-primary" : "text-green-600")}
                />
              ) : null}
              {point.label}
            </li>
          ))}
        </ul>
      ) : null}

      <div className="mt-auto">{children}</div>
    </article>
  );
};

export type RequestOffersState = "idle" | "loading" | "sent";

interface TasadorOptionsProps {
  appraisalId: string;
  opciones: StrapiTasadorOpciones;
  ofertas: StrapiTasadorOfertas;
  iconPack: StrapiIconPack;
  requestState: RequestOffersState;
  onRequestOffers: () => void;
}

/** "¿Qué quieres hacer con tu coche?": publicar el anuncio o recibir ofertas de concesionarios. */
export const TasadorOptions = ({
  appraisalId,
  opciones,
  ofertas,
  iconPack,
  requestState,
  onRequestOffers,
}: TasadorOptionsProps) => {
  const { publicar, recibir_ofertas } = opciones;
  const offersLink = ofertas.enlace_ver_ofertas;

  return (
    <section className="flex flex-col gap-5">
      <StrapiEncabezado
        content={opciones.encabezado}
        className="text-left"
        titleClassName="text-2xl sm:text-3xl"
      />

      <div className="grid gap-5 lg:grid-cols-2">
        {publicar ? (
          <TasadorOptionCard option={publicar} iconPack={iconPack} tone="primary">
            {publicar.boton ? (
              <Button
                size="lg"
                className="w-full gap-2 sm:w-auto"
                nativeButton={false}
                render={
                  <Link
                    href={`${publicar.boton.url}?tasacion=${encodeURIComponent(appraisalId)}`}
                  />
                }
              >
                {publicar.boton.label}
                <ArrowRight className="size-4" aria-hidden />
              </Button>
            ) : null}
          </TasadorOptionCard>
        ) : null}

        {recibir_ofertas ? (
          <TasadorOptionCard option={recibir_ofertas} iconPack={iconPack} tone="success">
            {requestState === "sent" ? (
              <div role="status" className="flex flex-col gap-3 rounded-xl bg-green-50 p-4 ring-1 ring-green-100">
                <StrapiEncabezado
                  content={ofertas.encabezado_enviado}
                  className="text-left"
                  titleClassName="text-lg text-green-800"
                  descriptionClassName="mt-1 text-green-900/80"
                />
                {offersLink ? (
                  <Link
                    href={`${offersLink.url}/${appraisalId}`}
                    className="inline-flex items-center gap-1 text-sm font-semibold text-green-800 hover:underline"
                  >
                    {offersLink.label}
                    <ArrowRight className="size-4" aria-hidden />
                  </Link>
                ) : null}
              </div>
            ) : recibir_ofertas.boton ? (
              <Button
                type="button"
                size="lg"
                className="w-full gap-2 bg-green-600 text-white hover:bg-green-700 sm:w-auto"
                disabled={requestState === "loading"}
                onClick={onRequestOffers}
              >
                {requestState === "loading" ? (
                  <Loader2 className="size-4 animate-spin" aria-hidden />
                ) : null}
                {recibir_ofertas.boton.label}
                {requestState === "loading" ? null : <ArrowRight className="size-4" aria-hidden />}
              </Button>
            ) : null}
          </TasadorOptionCard>
        ) : null}
      </div>
    </section>
  );
};
