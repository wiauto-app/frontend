import { getVehicleFinancingQuote } from "@/app/(public)/vehiculos/utils";
import { useMemo, useState } from "react";

export const FinancingSelector = ({
  current_price,
  cuotas,
}: {
  current_price: number;
  cuotas: { value: number }[];
}) => {
  const defaultCuota = cuotas?.[0]?.value ?? null;
  const sortedCuotas = useMemo(() => {
    return cuotas.sort((a, b) => a.value - b.value);
  }, [cuotas]);
  const [selectedCuota, setSelectedCuota] = useState<number | null>(
    defaultCuota,
  );

  const financing = useMemo(() => {
    if (!selectedCuota) return null;

    return getVehicleFinancingQuote(current_price, selectedCuota);
  }, [current_price, selectedCuota]);

  if (!financing || !cuotas?.length) {
    return null;
  }

  return (
    <div className="flex items-center gap-1 text-sm text-muted-foreground">
      <span>Financiamiento desde {financing.monthly_label} a</span>

      <select
        value={String(selectedCuota)}
        onChange={(event) => {
          setSelectedCuota(Number(event.target.value));
        }}
        className="w-auto"
      >
        {sortedCuotas.map((cuota) => (
          <option key={cuota.value} value={String(cuota.value)}>
            {cuota.value}
          </option>
        ))}
      </select>

      <span>meses</span>
    </div>
  );
};
