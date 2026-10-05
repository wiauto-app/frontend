import { formatVehiclePriceEur } from "@/components/vehicles/quick-publish/VehiclePriceRecommendation";
import { TRANSMISSION_LABEL } from "@/services/appraisal/appraisal.labels";
import type {
  AppraisalEstimate,
  AppraisalVehicleSummary,
} from "@/services/appraisal/types/appraisal.types";

/** Título del vehículo, datos clave y rango estimado, para tarjetas de tasaciones. */
export const AppraisalVehicleHeading = ({
  vehicle,
  estimate,
}: {
  vehicle: AppraisalVehicleSummary;
  estimate: AppraisalEstimate | null;
}) => (
  <div className="flex flex-col gap-1">
    <p className="font-semibold text-slate-900">{vehicle.vehicle_label}</p>
    {vehicle.version_name ? (
      <p className="text-sm text-slate-500">{vehicle.version_name}</p>
    ) : null}
    <p className="text-sm text-slate-600">
      {vehicle.mileage.toLocaleString("es-ES")} km ·{" "}
      {TRANSMISSION_LABEL[vehicle.transmission_type]}
      {vehicle.fuel_type_name ? ` · ${vehicle.fuel_type_name}` : ""}
    </p>
    {estimate ? (
      <p className="text-sm font-semibold text-green-700">
        {formatVehiclePriceEur(estimate.range_min)} – {formatVehiclePriceEur(estimate.range_max)}
      </p>
    ) : null}
  </div>
);
