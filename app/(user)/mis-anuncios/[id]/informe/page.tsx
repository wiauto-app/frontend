import { notFound, redirect } from "next/navigation";
import type { Metadata } from "next";
import { getVehicleReportData } from "./services/getVehicleReportData.server";
import { VehicleReportView } from "./components/VehicleReportView";

interface VehicleReportPageProps {
  params: Promise<{ id: string }>;
}

export const metadata: Metadata = {
  title: "Informe de anuncio | WiAuto",
};

export default async function VehicleReportPage({ params }: VehicleReportPageProps) {
  const { id } = await params;
  const { ok, status, data } = await getVehicleReportData(id);

  if (status === 401) {
    redirect(`/iniciar-sesion?redirect=/mis-anuncios/${id}/informe`);
  }

  if (!ok || !data) {
    notFound();
  }

  return <VehicleReportView report={data} />;
}
