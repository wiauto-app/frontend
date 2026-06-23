import type { VehicleIdentificationLookupResult } from "./hooks/useVehicleIdentificationLookup";

type QuickVehicleIdentificationPreviewProps = {
  result: VehicleIdentificationLookupResult | null;
};

export const QuickVehicleIdentificationPreview = ({
  result,
}: QuickVehicleIdentificationPreviewProps) => {
  if (!result) {
    return (
      <div
        className="rounded-lg border border-dashed bg-muted/30 p-4 text-sm text-muted-foreground"
        aria-live="polite"
      >
        Los datos del vehículo aparecerán aquí cuando la búsqueda por matrícula esté disponible.
      </div>
    );
  }

  const rows = [
    { label: "Marca", value: result.make },
    { label: "Modelo", value: result.model },
    { label: "Año", value: result.year?.toString() },
    { label: "Combustible", value: result.fuel_type },
    { label: "Versión", value: result.version },
  ].filter((row) => row.value);

  return (
    <div className="rounded-lg border bg-card p-4">
      <h4 className="mb-3 text-sm font-semibold">Datos identificados</h4>
      <dl className="grid gap-2 text-sm">
        {rows.map((row) => (
          <div key={row.label} className="flex justify-between gap-4">
            <dt className="text-muted-foreground">{row.label}</dt>
            <dd className="font-medium text-right">{row.value}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
};
