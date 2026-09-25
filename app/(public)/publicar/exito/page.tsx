import type { Metadata } from "next";

import { getVehicleInsights } from "@/components/vehicles/listing-insights/services/getVehicleInsights.server";
import type { ListingCheckoutStatus } from "@/components/vehicles/listing-insights/components/ListingInsightsPanel";
import {
  PublishSuccessFallback,
  PublishSuccessView,
} from "./components/PublishSuccessView";

interface CrearVehiculoExitoPageProps {
  searchParams: Promise<{ id?: string; checkout?: string }>;
}

export const metadata: Metadata = {
  title: "Anuncio publicado",
  description: "Tu vehículo se publicó correctamente en WiAuto.",
};

const UUID_PATTERN =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

const parseVehicleId = (raw?: string): string | null => {
  const value = raw?.trim();
  return value && UUID_PATTERN.test(value) ? value : null;
};

const parseCheckoutStatus = (raw?: string): ListingCheckoutStatus | null =>
  raw === "success" || raw === "cancel" ? raw : null;

export default async function CrearVehiculoExitoPage({
  searchParams,
}: CrearVehiculoExitoPageProps) {
  const params = await searchParams;
  const vehicleId = parseVehicleId(params.id);
  const checkoutStatus = parseCheckoutStatus(params.checkout);

  if (!vehicleId) {
    return <PublishSuccessFallback />;
  }

  const insights = await getVehicleInsights(vehicleId);

  return (
    <PublishSuccessView
      vehicleId={vehicleId}
      displayName={insights?.display_name ?? null}
      initialInsights={insights}
      checkoutStatus={checkoutStatus}
    />
  );
}
