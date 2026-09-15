import { VehiclesListingSectionFromFilters } from "@/components/vehicles/listing/VehiclesListingSectionFromFilters";
import { buildVehicleListingHref } from "@/lib/vehicles/listing-url";

export async function FeaturedVehiclesSection() {
  return (
    <VehiclesListingSectionFromFilters
      title={{ lead: "Encuentra tu", highlight: "próximo coche" }}
      variant="grid"
      cardVariant="featured"
      fetchParams={{ is_seller_featured: true, page: 1, limit: 4 }}
      seeMoreHref={buildVehicleListingHref({ is_seller_featured: true })}
    />
  );
}
