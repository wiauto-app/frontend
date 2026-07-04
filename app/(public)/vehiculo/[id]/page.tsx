import { notFound } from "next/navigation";
import { Metadata } from "next";
import { buildVehicleDetailSeo } from "@/lib/seo/build-vehicle-detail-seo";
import { JsonLdScript } from "@/lib/seo/json-ld-script";
import { VehicleDetailBody } from "./components/VehicleDetailBody";
import { getVehicleData } from "./services/getVehicleData";

interface VehicleDetailPageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({
  params,
}: VehicleDetailPageProps): Promise<Metadata> {
  const { id } = await params;

  const { data } = await getVehicleData(id);

  if (!data.ok || !data.data) {
    notFound();
  }

  return buildVehicleDetailSeo(data.data).metadata;
}

export default async function VehicleDetailPage({
  params,
}: VehicleDetailPageProps) {
  const { id } = await params;
  const { old, data, reviews } = await getVehicleData(id);

  if (!data.ok || !data.data) {
    notFound();
  }

  const vehicle = data.data;
  const { breadcrumbItems, jsonLdGraph } = buildVehicleDetailSeo(vehicle);

  return (
    <div className="min-h-screen bg-gray-50">
      <JsonLdScript data={jsonLdGraph} />
      <VehicleDetailBody
        vehicle={vehicle}
        old={old}
        reviews={reviews}
        breadcrumbItems={breadcrumbItems}
      />
    </div>
  );
}
