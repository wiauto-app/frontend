import type { ApiVehicleResponse } from "@/components/vehicles/services/vehicleIdentificationService";
import { parseDisplacementCc } from "@/components/vehicles/services/vehicleIdentificationService";

interface SourceRowProps {
  label: string;
  value: string | number | null | undefined;
}

const SourceRow = ({ label, value }: SourceRowProps) => {
  if (value == null || value === "") {
    return null;
  }

  return (
    <>
      <dt className="text-muted-foreground">{label}</dt>
      <dd>{value}</dd>
    </>
  );
};

const transmissionLabel = (value: ApiVehicleResponse["transmission_type"]): string =>
  value === "automatic" ? "Automática" : "Manual";

interface QuickVehicleIdentificationPreviewProps {
  result: ApiVehicleResponse | null;
}

export const QuickVehicleIdentificationPreview = ({
  result,
}: QuickVehicleIdentificationPreviewProps) => {
  if (!result) {
    return (
      <div
        className="rounded-lg border border-dashed bg-muted/30 p-4 text-sm text-muted-foreground"
        aria-live="polite"
      >
        Los datos detectados aparecerán aquí tras buscar por matrícula o VIN.
      </div>
    );
  }

  const displacement = parseDisplacementCc(result.displacement);

  return (
    <div className="rounded-lg border bg-card p-4 text-sm" aria-live="polite">
      <p className="mb-2 font-medium">Datos aplicados al formulario</p>
      <p className="mb-3 text-xs text-muted-foreground">
        Marca, modelo, año y versión del catálogo se rellenaron automáticamente.
      </p>
      <dl className="grid grid-cols-1 gap-1 sm:grid-cols-2">
        <SourceRow label="Matrícula" value={result.license_plate} />
        <SourceRow label="VIN" value={result.vin} />
        <SourceRow
          label="Potencia"
          value={result.power != null ? `${result.power} CV` : null}
        />
        <SourceRow
          label="Cilindrada"
          value={displacement != null ? `${displacement} cc` : null}
        />
        <SourceRow
          label="Transmisión"
          value={transmissionLabel(result.transmission_type)}
        />
      </dl>
    </div>
  );
};
