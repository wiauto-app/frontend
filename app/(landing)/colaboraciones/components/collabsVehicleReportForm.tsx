"use client";

import { CircleHelp, ExternalLink, Lock } from "lucide-react";
import Image from "next/image";
import { useState, type FormEvent } from "react";
import { useForm } from "react-hook-form";

import {
  buildCarVerticalReportUrl,
  normalizeCarVerticalSub3,
} from "@/app/(landing)/colaboraciones/utils/buildCarVerticalReportUrl";
import type { VehicleReportMode } from "@/app/(landing)/colaboraciones/utils/resolveVehicleReportMode";
import { Button } from "@/components/ui/button";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import type { StrapiCard } from "@/interfaces/strapi-components.interface";
import { trackLead } from "@/lib/analytics/events";
import type { StrapiMedia } from "@/lib/strapi.types";
import { normalizeLicensePlate } from "@/lib/validations/licensePlate";
import { cn } from "@/lib/utils";

import {
  buildCollabsVehicleReportQuerySchema,
  collabsVehicleReportQueryDefaultValues,
  type CollabsVehicleReportQueryValues,
} from "../schemas/collabs-vehicle-report.schema";

export const COLLABS_VEHICLE_REPORT_FORM_ID = "colabs-vehicle-report-hero-form";

const VIN_LOCATION_HELP =
  "Suele aparecer en el parabrisas inferior del conductor, en el marco de la puerta del conductor, en la ficha técnica o en el permiso de circulación.";

interface CollabsVehicleReportFormProps {
  formId?: string;
  logo?: StrapiMedia | null;
  card?: StrapiCard | null;
  className?: string;
}

interface EuropeanPlateInputProps {
  id: string;
  value: string;
  invalid: boolean;
  describedBy?: string;
  onChange: (value: string) => void;
}

const EuropeanPlateInput = ({
  id,
  value,
  invalid,
  describedBy,
  onChange,
}: EuropeanPlateInputProps) => (
  <div
    className={cn(
      "flex overflow-hidden rounded-lg border-2 border-slate-800 bg-white shadow-sm",
      invalid && "border-red-500 ring-2 ring-red-500/20",
    )}
  >
    <div
      className="flex w-11 shrink-0 flex-col items-center justify-center gap-0.5 bg-[#003399] py-2 text-white"
      aria-hidden
    >
      <span className="text-[10px] font-bold leading-none">E</span>
      <span className="text-[8px] leading-none tracking-widest">★★★</span>
    </div>
    <Input
      id={id}
      value={value}
      autoComplete="off"
      aria-invalid={invalid}
      aria-describedby={describedBy}
      placeholder="1234 ABC"
      className="h-14 flex-1 rounded-none border-0 font-mono text-lg uppercase tracking-wider shadow-none focus-visible:ring-0"
      onChange={(event) => onChange(event.target.value.toUpperCase())}
    />
  </div>
);

export const CollabsVehicleReportForm = ({
  formId = COLLABS_VEHICLE_REPORT_FORM_ID,
  logo,
  card,
  className,
}: CollabsVehicleReportFormProps) => {
  const [mode, setMode] = useState<VehicleReportMode>("plate");

  const form = useForm<CollabsVehicleReportQueryValues>({
    defaultValues: collabsVehicleReportQueryDefaultValues,
  });

  const query = form.watch("query");
  const queryError = form.formState.errors.query;
  const errorId = "vehicle-report-query-error";

  const handleTabChange = (value: string | number | null) => {
    const nextMode: VehicleReportMode = value === "vin" ? "vin" : "plate";
    if (nextMode === mode) {
      return;
    }

    setMode(nextMode);
    form.reset(collabsVehicleReportQueryDefaultValues);
    form.clearErrors();
  };

  const handleRedirect = () => {
    const queryValue = form.getValues("query");
    const parsed = buildCollabsVehicleReportQuerySchema(mode).safeParse({
      query: queryValue,
    });

    if (!parsed.success) {
      const message =
        parsed.error.issues[0]?.message ?? "Introduce un valor válido";
      form.setError("query", { type: "manual", message });
      return;
    }

    const sub3 =
      mode === "plate"
        ? normalizeLicensePlate(queryValue)
        : normalizeCarVerticalSub3(queryValue);

    trackLead({
      contentName:
        mode === "plate"
          ? "Informe carVertical (matrícula)"
          : "Informe carVertical (VIN)",
    });
    window.open(
      buildCarVerticalReportUrl(sub3),
      "_blank",
      "noopener,noreferrer",
    );
  };

  const handleFormSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    handleRedirect();
  };

  const cardLogo = logo ?? card?.imagen;

  return (
    <div
      id={formId}
      className={cn(
        "w-full max-w-md scroll-mt-24 rounded-2xl bg-white p-5 shadow-xl sm:p-6",
        className,
      )}
    >
      {cardLogo?.url ? (
        <div className="mb-4 flex justify-center">
          <Image
            src={cardLogo.url}
            alt={cardLogo.alternativeText ?? "carVertical"}
            width={173}
            height={32}
            unoptimized={cardLogo.url.endsWith(".svg")}
            className="h-8 w-auto object-contain"
          />
        </div>
      ) : null}

      {card?.titulo ? (
        <h2 className="text-center text-lg font-bold text-slate-900">
          {card.titulo}
        </h2>
      ) : null}
      {card?.descripcion ? (
        <p className="mt-1 text-center text-sm text-slate-600">
          {card.descripcion}
        </p>
      ) : null}

      <Tabs
        value={mode}
        onValueChange={handleTabChange}
        className={cn(card?.titulo || card?.descripcion ? "mt-4" : "mt-0")}
      >
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="plate">Matrícula</TabsTrigger>
          <TabsTrigger value="vin">Código VIN</TabsTrigger>
        </TabsList>

        <form
          onSubmit={handleFormSubmit}
          className="mt-4 flex flex-col gap-4"
          noValidate
          aria-label="Solicitar informe carVertical"
        >
          <TabsContent value="plate" className="mt-0 flex flex-col gap-2">
            <Field className="gap-2" data-invalid={Boolean(queryError)}>
              <FieldLabel htmlFor="vehicle-report-query-plate">
                Matrícula del vehículo
              </FieldLabel>
              <EuropeanPlateInput
                id="vehicle-report-query-plate"
                value={query}
                invalid={Boolean(queryError)}
                describedBy={queryError ? errorId : undefined}
                onChange={(value) => {
                  form.setValue("query", value, { shouldDirty: true });
                  form.clearErrors("query");
                }}
              />
              {queryError ? (
                <FieldError id={errorId} errors={[queryError]} />
              ) : null}
            </Field>
          </TabsContent>

          <TabsContent value="vin" className="mt-0 flex flex-col gap-2">
            <Field className="gap-2" data-invalid={Boolean(queryError)}>
              <div className="flex items-center gap-1.5">
                <FieldLabel htmlFor="vehicle-report-query-vin">
                  Código VIN
                </FieldLabel>
                <TooltipProvider delay={200}>
                  <Tooltip>
                    <TooltipTrigger
                      render={
                        <button
                          type="button"
                          className="inline-flex shrink-0 rounded-sm text-slate-500 transition-colors hover:text-slate-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                          aria-label="¿Dónde encuentro el VIN?"
                        />
                      }
                    >
                      <CircleHelp className="size-4" aria-hidden />
                    </TooltipTrigger>
                    <TooltipContent
                      side="top"
                      className="max-w-xs text-sm leading-relaxed"
                    >
                      {VIN_LOCATION_HELP}
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
              <div className="relative">
                <Input
                  id="vehicle-report-query-vin"
                  value={query}
                  autoComplete="off"
                  maxLength={17}
                  aria-invalid={Boolean(queryError)}
                  aria-describedby={queryError ? errorId : undefined}
                  placeholder="WVWZZZ3CZWE123456"
                  className="h-12 pr-14 font-mono text-base uppercase tracking-wide"
                  onChange={(event) => {
                    form.setValue(
                      "query",
                      event.target.value.toUpperCase().replace(/\s+/g, ""),
                      { shouldDirty: true },
                    );
                    form.clearErrors("query");
                  }}
                />
                <span
                  className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-xs font-medium text-slate-400"
                  aria-hidden
                >
                  {query.length}/17
                </span>
              </div>
              {queryError ? (
                <FieldError id={errorId} errors={[queryError]} />
              ) : null}
            </Field>
          </TabsContent>

          <Button
            type="submit"
            className="h-11 w-full gap-2 bg-[#0061F2] text-base font-semibold hover:bg-[#0052cc]"
            aria-label="Ver informe en carVertical"
          >
            Ver informe en carVertical
            <ExternalLink className="size-4" aria-hidden />
          </Button>

          <p className="flex items-start gap-2 text-xs text-slate-500">
            <Lock className="mt-0.5 size-3.5 shrink-0" aria-hidden />
            <span>
              Te redirigiremos a carVertical para completar la compra del
              informe.
            </span>
          </p>
        </form>
      </Tabs>
    </div>
  );
};
