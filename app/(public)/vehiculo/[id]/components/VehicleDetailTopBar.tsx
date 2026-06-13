"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { VehicleFavoriteButton } from "@/app/(public)/vehiculos/components/VehicleFavoriteButton";
import { VehicleShareButton } from "@/app/(public)/vehiculos/components/VehicleShareButton";

type VehicleDetailTopBarProps = {
  vehicle_id: string;
  vehicle_title: string;
};

export const VehicleDetailTopBar = ({
  vehicle_id,
  vehicle_title,
}: VehicleDetailTopBarProps) => {
  const router = useRouter();

  return (
    <div className="sticky top-0 z-10 border-b border-gray-200 bg-white">
      <div className="mx-auto container-custom flex items-center justify-between py-3">
        <Button
          type="button"
          onClick={() => router.back()}
          variant="ghost"
          className="gap-2 text-gray-600 hover:text-gray-900"
        >
          <ArrowLeft className="size-4" aria-hidden />
          Volver
        </Button>

        <div className="flex items-center gap-2">
          <VehicleFavoriteButton vehicleId={vehicle_id} />
          <VehicleShareButton vehicleId={vehicle_id} vehicleTitle={vehicle_title} />
        </div>
      </div>
    </div>
  );
};
