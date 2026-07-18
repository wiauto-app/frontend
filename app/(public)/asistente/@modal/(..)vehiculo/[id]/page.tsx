import { notFound } from "next/navigation";

import { VehicleDetailBody } from "@/app/(public)/vehiculo/[id]/components/VehicleDetailBody";
import { VehicleDetailModalShell } from "@/app/(public)/vehiculo/[id]/components/VehicleDetailModalShell";
import { getVehicleData } from "@/app/(public)/vehiculo/[id]/services/getVehicleData";
import { buildVehicleDetailSeo } from "@/lib/seo/build-vehicle-detail-seo";

interface VehicleDetailModalPageProps {
  params: Promise<{ id: string }>;
}

export default async function VehicleDetailModalPage({
  params,
}: VehicleDetailModalPageProps) {
  const { id } = await params;
  const { data, reviews } = await getVehicleData(id);

  if (!data.ok || !data.data) {
    notFound();
  }

  const vehicle = data.data;
  const { breadcrumbItems } = buildVehicleDetailSeo(vehicle);

  return (
    <VehicleDetailModalShell>
      <VehicleDetailBody
        vehicle={vehicle}
        reviews={reviews}
        breadcrumbItems={breadcrumbItems}
      />
    </VehicleDetailModalShell>
  );
}
