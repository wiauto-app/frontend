import {
  formatPrice,
  getVehicleDisplayPrices,
  getVehicleFinancingQuote,
} from "@/app/(public)/vehiculos/utils";
import type { Vehicle } from "@/interfaces/vehicle.interface";
import type { VehiclePriceHistoryItem } from "@/interfaces/vehicle-price.interface";

type VehicleDetailPricingSectionProps = {
  vehicle: Vehicle;
};

const getVehiclePriceHistory = (vehicle: Vehicle): VehiclePriceHistoryItem[] =>
  vehicle.prices ?? vehicle.vehicle_prices ?? [];

export const VehicleDetailPricingSection = ({
  vehicle,
}: VehicleDetailPricingSectionProps) => {
  const price_history = getVehiclePriceHistory(vehicle);
  const { current_price, previous_price } = getVehicleDisplayPrices(
    price_history,
    vehicle.price,
  );
  const financing = getVehicleFinancingQuote(current_price, vehicle.cuotas);

  return (
    <div className="flex flex-col gap-2">
      <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
        <span className="text-3xl font-bold tracking-tight text-gray-900">
          {formatPrice(current_price)}
        </span>
        {previous_price ? (
          <span className="text-xl text-gray-400 line-through">
            {formatPrice(previous_price)}
          </span>
        ) : null}
      </div>

      {financing ? (
        <p className="text-sm text-muted-foreground">
          Financiamiento desde {financing.monthly_label} a {financing.months} meses
        </p>
      ) : null}
    </div>
  );
};
