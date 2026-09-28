"use client";

import { Clock, ExternalLink, Lock, ShieldCheck, Gauge } from "lucide-react";
import Image from "next/image";
import { useEffect, useState, type FormEvent } from "react";
import { useForm } from "react-hook-form";

import {
  buildCarVerticalReportUrl,
  normalizeCarVerticalSub3,
} from "@/app/(landing)/colaboraciones/utils/buildCarVerticalReportUrl";
import type { VehicleReportMode } from "@/app/(landing)/colaboraciones/utils/resolveVehicleReportMode";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { trackLead } from "@/lib/analytics/events";
import { normalizeLicensePlate } from "@/lib/validations/licensePlate";
import type { StrapiMedia } from "@/lib/strapi.types";
import { cn } from "@/lib/utils";

import {
  buildCollabsVehicleReportQuerySchema,
  collabsVehicleReportQueryDefaultValues,
  type CollabsVehicleReportQueryValues,
} from "../schemas/collabs-vehicle-report.schema";

interface CollabsVehicleReportDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialMode: VehicleReportMode;
  logo?: StrapiMedia | null;
}

interface ModeCopy {
  title: string;
  description: string;
  fieldLabel: string;
  placeholder: string;
}

const MODE_COPY: Record<VehicleReportMode, ModeCopy> = {
  plate: {
    title: "Consulta por matrícula",
    description:
      "Introduce la matrícula del vehículo para solicitar el informe en carVertical.",
    fieldLabel: "Matrícula del vehículo",
    placeholder: "1234 ABC",
  },
  vin: {
    title: "Consulta por código VIN",
    description:
      "Introduce el VIN de 17 caracteres para solicitar el informe en carVertical.",
    fieldLabel: "Código VIN",
    placeholder: "WVWZZZ3CZWE123456",
  },
};

interface BenefitItemProps {
  icon: typeof Clock;
  label: string;
}

const BenefitItem = ({ icon: Icon, label }: BenefitItemProps) => (
  <li className="flex flex-col items-center gap-1 text-center">
    <span className="flex size-9 items-center justify-center rounded-full bg-[#0061F2]/10 text-[#0061F2]">
      <Icon className="size-4" aria-hidden />
    </span>
    <span className="text-[10px] font-medium leading-tight text-slate-600">
      {label}
    </span>
  </li>
);

interface EuropeanPlateInputProps {
  id: string;
  value: string;
  invalid: boolean;
  describedBy?: string;
  onChange: (value: string) => void;
  onBlur: () => void;
}

const EuropeanPlateInput = ({
  id,
  value,
  invalid,
  describedBy,
  onChange,
  onBlur,
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
      onBlur={onBlur}
    />
  </div>
);

export const CollabsVehicleReportDialog = ({
  open,
  onOpenChange,
  initialMode,
  logo,
}: CollabsVehicleReportDialogProps) => {
  const [mode, setMode] = useState<VehicleReportMode>(initialMode);

  const form = useForm<CollabsVehicleReportQueryValues>({
    defaultValues: collabsVehicleReportQueryDefaultValues,
  });

  const query = form.watch("query");
  const queryError = form.formState.errors.query;
  const errorId = "vehicle-report-query-error";
  const copy = MODE_COPY[mode];

  useEffect(() => {
    if (!open) {
      return;
    }

    setMode(initialMode);
    form.reset(collabsVehicleReportQueryDefaultValues);
    form.clearErrors();
  }, [open, initialMode, form]);

  const handleTabChange = (value: string | number | null) => {
    const nextMode: VehicleReportMode = value === "vin" ? "vin" : "plate";
    if (nextMode === mode) {
      return;
    }

    setMode(nextMode);
    form.reset(collabsVehicleReportQueryDefaultValues);
    form.clearErrors();
  };

  const redirectToCarVertical = (queryValue: string) => {
    const sub3 =
      mode === "plate"
        ? normalizeLicensePlate(queryValue)
        : normalizeCarVerticalSub3(queryValue);

    const url = buildCarVerticalReportUrl(sub3);
    trackLead({
      contentName:
        mode === "plate"
          ? "Informe carVertical (matrícula)"
          : "Informe carVertical (VIN)",
    });
    window.open(url, "_blank", "noopener,noreferrer");
    onOpenChange(false);
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

    redirectToCarVertical(queryValue);
  };

  const handleFormSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    handleRedirect();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[calc(100vh-2rem)] gap-0 overflow-y-auto p-0 sm:max-w-lg">
        <div className="rounded-t-xl bg-linear-to-br from-[#0061F2]/10 via-slate-50 to-white px-6 pb-4 pt-6">
          {logo?.url ? (
            <div className="mb-4 flex justify-center">
              <Image
                src={logo.url}
                alt={logo.alternativeText ?? "carVertical"}
                width={173}
                height={32}
                unoptimized={logo.url.endsWith(".svg")}
                className="h-8 w-auto object-contain"
              />
            </div>
          ) : null}

          <DialogHeader className="gap-1 text-center sm:text-left">
            <DialogTitle className="text-xl font-bold text-slate-900">
              {copy.title}
            </DialogTitle>
            <DialogDescription className="text-slate-600">
              {copy.description}
            </DialogDescription>
          </DialogHeader>
        </div>

        <Tabs value={mode} onValueChange={handleTabChange} className="px-6 pt-4">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="plate">Matrícula</TabsTrigger>
            <TabsTrigger value="vin">Código VIN</TabsTrigger>
          </TabsList>

          <form
            onSubmit={handleFormSubmit}
            className="flex flex-col gap-4 pb-6 pt-4"
            noValidate
            aria-label="Solicitar informe carVertical"
          >
            <TabsContent value="plate" className="mt-0 flex flex-col gap-4">
              <Field className="gap-2" data-invalid={Boolean(queryError)}>
                <FieldLabel htmlFor="vehicle-report-query-plate">
                  {MODE_COPY.plate.fieldLabel}
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
                  onBlur={() => undefined}
                />
                {queryError ? (
                  <FieldError id={errorId} errors={[queryError]} />
                ) : null}
              </Field>
            </TabsContent>

            <TabsContent value="vin" className="mt-0 flex flex-col gap-4">
              <Field className="gap-2" data-invalid={Boolean(queryError)}>
                <FieldLabel htmlFor="vehicle-report-query-vin">
                  {MODE_COPY.vin.fieldLabel}
                </FieldLabel>
                <div className="relative">
                  <Input
                    id="vehicle-report-query-vin"
                    value={query}
                    autoComplete="off"
                    maxLength={17}
                    aria-invalid={Boolean(queryError)}
                    aria-describedby={queryError ? errorId : undefined}
                    placeholder={MODE_COPY.vin.placeholder}
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

              <details className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-600">
                <summary className="cursor-pointer font-medium text-slate-800">
                  ¿Dónde encuentro el VIN?
                </summary>
                <p className="mt-2 leading-relaxed">
                  Suele aparecer en el parabrisas inferior del conductor, en el
                  marco de la puerta del conductor, en la ficha técnica o en el
                  permiso de circulación.
                </p>
              </details>
            </TabsContent>

            <ul className="grid grid-cols-3 gap-2 border-y border-slate-100 py-4">
              <BenefitItem icon={Clock} label="Informe en unos 40 s" />
              <BenefitItem icon={Gauge} label="Kilometraje real" />
              <BenefitItem icon={ShieldCheck} label="Historial de siniestros" />
            </ul>

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
      </DialogContent>
    </Dialog>
  );
};
