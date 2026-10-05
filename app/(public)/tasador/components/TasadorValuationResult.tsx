import { Calendar, Cog, Fuel, Gauge, Pencil, Sparkles, Zap } from "lucide-react";

import { StrapiAviso } from "@/components/strapi/StrapiAviso";
import { Button } from "@/components/ui/button";
import { formatVehiclePriceEur } from "@/components/vehicles/quick-publish/VehiclePriceRecommendation";
import type { StrapiTasadorResultado } from "@/interfaces/strapi-components.interface";
import { TRANSMISSION_LABEL } from "@/services/appraisal/appraisal.labels";
import type {
  AppraisalConfidence,
  AppraisalDetail,
} from "@/services/appraisal/types/appraisal.types";

interface TasadorValuationResultProps {
  /** Cualquier vista de tasación con vehículo y estimación (vendedor o concesionario). */
  appraisal: Pick<AppraisalDetail, "vehicle" | "estimate">;
  content: StrapiTasadorResultado;
  /** Si existe, muestra el botón "Modificar datos". */
  onEdit?: () => void;
}

const confidenceLabel = (
  content: StrapiTasadorResultado,
  confidence: AppraisalConfidence | null,
): string | null => {
  if (confidence === "high") return content.confianza_alta;
  if (confidence === "medium") return content.confianza_media;
  if (confidence === "low") return content.confianza_baja;
  return null;
};

/** Valor estimado (rango + precio de mercado + recomendación IA) y datos del vehículo. */
export const TasadorValuationResult = ({
  appraisal,
  content,
  onEdit,
}: TasadorValuationResultProps) => {
  const { estimate, vehicle } = appraisal;
  if (!estimate) {
    return null;
  }

  const span = Math.max(estimate.range_max - estimate.range_min, 1);
  const marketPosition = Math.min(
    100,
    Math.max(0, ((estimate.recommended_price - estimate.range_min) / span) * 100),
  );
  const confidence = confidenceLabel(content, estimate.confidence);

  const specs = [
    { Icon: Calendar, label: String(vehicle.year) },
    { Icon: Gauge, label: `${vehicle.mileage.toLocaleString("es-ES")} km` },
    vehicle.fuel_type_name ? { Icon: Fuel, label: vehicle.fuel_type_name } : null,
    { Icon: Cog, label: TRANSMISSION_LABEL[vehicle.transmission_type] },
    vehicle.power ? { Icon: Zap, label: `${vehicle.power} CV` } : null,
  ].filter((spec) => spec !== null);

  return (
    <div className="grid gap-5 lg:grid-cols-5">
      <section className="flex flex-col gap-5 rounded-2xl border border-green-100 bg-linear-to-br from-green-50/70 to-white p-5 sm:p-6 lg:col-span-3">
        <div className="flex flex-col gap-1">
          <h2 className="text-lg font-semibold text-slate-900">
            {content.encabezado?.titulo}
          </h2>
          <p className="text-4xl font-bold tracking-tight text-green-700 sm:text-5xl">
            {formatVehiclePriceEur(estimate.range_min)} –{" "}
            {formatVehiclePriceEur(estimate.range_max)}
          </p>
        </div>

        <div className="flex flex-col gap-3">
          <div className="relative h-2.5 rounded-full bg-linear-to-r from-green-600 via-green-400 to-green-200">
            <span
              aria-hidden
              className="absolute top-1/2 size-5 -translate-x-1/2 -translate-y-1/2 rounded-full border-4 border-white bg-green-600 shadow"
              style={{ left: `${marketPosition}%` }}
            />
          </div>
          <dl className="grid grid-cols-3 text-sm">
            <div>
              <dt className="text-slate-600">{content.label_precio_bajo}</dt>
              <dd className="font-semibold text-slate-900">
                {formatVehiclePriceEur(estimate.range_min)}
              </dd>
            </div>
            <div className="text-center">
              <dt className="text-slate-600">{content.label_precio_mercado}</dt>
              <dd className="font-semibold text-slate-900">
                {formatVehiclePriceEur(estimate.recommended_price)}
              </dd>
            </div>
            <div className="text-right">
              <dt className="text-slate-600">{content.label_precio_alto}</dt>
              <dd className="font-semibold text-slate-900">
                {formatVehiclePriceEur(estimate.range_max)}
              </dd>
            </div>
          </dl>
        </div>

        {estimate.explanation ? (
          <div className="flex flex-col gap-1 rounded-xl bg-white/80 p-4 ring-1 ring-green-100">
            <p className="flex items-center gap-2 text-sm font-semibold text-slate-900">
              <Sparkles className="size-4 text-primary" aria-hidden />
              {content.titulo_explicacion}
              {confidence ? (
                <span className="ml-auto rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-800">
                  {content.label_confianza}: {confidence}
                </span>
              ) : null}
            </p>
            <p className="text-sm text-slate-600">{estimate.explanation}</p>
          </div>
        ) : null}

        <StrapiAviso content={content.aviso_ia} />
      </section>

      <section className="flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-5 sm:p-6 lg:col-span-2">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">
            {vehicle.make_name} {vehicle.model_name}
          </h2>
          {vehicle.version_name ? (
            <p className="text-slate-500">{vehicle.version_name}</p>
          ) : null}
        </div>
        <ul className="flex flex-col gap-3">
          {specs.map(({ Icon, label }) => (
            <li key={label} className="flex items-center gap-3 text-slate-700">
              <Icon className="size-5 text-slate-400" aria-hidden />
              {label}
            </li>
          ))}
        </ul>
        {onEdit && content.boton_modificar ? (
          <Button type="button" variant="outline" className="mt-auto gap-2 self-start" onClick={onEdit}>
            <Pencil className="size-4" aria-hidden />
            {content.boton_modificar}
          </Button>
        ) : null}
      </section>
    </div>
  );
};
