import Link from "next/link";
import { ChevronRight } from "lucide-react";
import type { DealerProfile } from "../interfaces";
import { DealerVehicleCard } from "./DealerVehicleCard";

type DealerVehiclesSectionProps = {
  dealer: DealerProfile;
};

export function DealerVehiclesSection({ dealer }: DealerVehiclesSectionProps) {
  return (
    <div className="mb-6 overflow-hidden rounded-2xl ">
      <div className="p-5 sm:p-6">
        {/* Section header */}
        <div className="mb-5 flex items-center justify-between gap-3">
          <h2 className="text-lg font-bold text-slate-900">
            Vehículos publicados
          </h2>
          <Link
            href={`/vehiculos?dealer=${dealer.slug}`}
            className="inline-flex items-center gap-1 text-sm font-semibold text-[#0061F2] hover:underline"
            id="dealer-see-all-vehicles"
          >
            Ver todos ({dealer.quickStats.publishedVehicles})
            <ChevronRight className="size-4" />
          </Link>
        </div>

        {/* 2-column grid matching screenshot */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {dealer.vehicles.slice(0, 4).map((vehicle) => (
            <DealerVehicleCard key={vehicle.id} vehicle={vehicle} />
          ))}
        </div>
      </div>
    </div>
  );
}
