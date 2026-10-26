import { cn } from "@/lib/utils";
import type { VehicleFinancingOfferSummary } from "@/interfaces/financing.interface";

interface VehicleFinancingFromProps {
  offer: VehicleFinancingOfferSummary | null | undefined;
  className?: string;
  /** `dark` para tarjetas con fondo oscuro. */
  tone?: "default" | "dark";
}

const formatMonthlyFrom = (monthly: number): string =>
  new Intl.NumberFormat("es-ES", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 0,
  }).format(monthly);

/** Cuota «desde» de la financiación del concesionario en listados. */
export const VehicleFinancingFrom = ({
  offer,
  className,
  tone = "default",
}: VehicleFinancingFromProps) => {
  if (!offer) {
    return null;
  }

  return (
    <p
      className={cn(
        "text-xs font-medium",
        tone === "dark" ? "text-white/90" : "text-slate-600",
        className,
      )}
    >
      Fináncialo desde{" "}
      <span
        className={cn(
          "font-bold",
          tone === "dark" ? "text-white" : "text-primary",
        )}
      >
        {formatMonthlyFrom(offer.monthly_from)}/mes
      </span>
    </p>
  );
};
