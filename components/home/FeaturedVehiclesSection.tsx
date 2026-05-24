import Link from "next/link";
import { SectionContainer } from "./SectionContainer";
import { SectionHeading } from "./SectionHeading";
import { VehicleCard } from "./VehicleCard";
import { BRAND_BLUE, FEATURED_VEHICLES } from "./data/home-data";

export function FeaturedVehiclesSection() {
  return (
    <SectionContainer className="bg-white py-12 lg:py-16">
      <SectionHeading lead="Encuentra tu" highlight="próximo coche" className="mb-8 sm:mb-10" />

      <div className="grid gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-4">
        {FEATURED_VEHICLES.map((vehicle) => (
          <VehicleCard key={vehicle.id} {...vehicle} href="/vehiculos" />
        ))}
      </div>

      <div className="mt-10 flex justify-center sm:mt-12">
        <Link
          href="/vehiculos"
          className="inline-flex h-12 min-w-[200px] items-center justify-center rounded-xl px-12 text-base font-bold text-white transition-opacity hover:opacity-90 sm:min-w-[240px] sm:px-16"
          style={{ backgroundColor: BRAND_BLUE }}
        >
          Ver más
        </Link>
      </div>
    </SectionContainer>
  );
}
