import { ChevronRight, Star, User } from "lucide-react";
import type { VehicleDetailVerifiedSeller } from "../types/vehicle-detail.types";
import { Separator } from "@/components/ui/separator";
import { VehicleDetailDealership } from "@/interfaces/vehicle.interface";
import { Profile } from "@/components/ui/profile";
import Link from "next/link";

type VehicleDetailVerifiedSellerCardProps = {
  verified_seller: VehicleDetailVerifiedSeller;
  dealership?: VehicleDetailDealership;
};

export const VehicleDetailVerifiedSellerCard = ({
  verified_seller,
  dealership,
}: VehicleDetailVerifiedSellerCardProps) => {
  if (!dealership) {
    return null;
  }
  return (
    <div className="bg-muted rounded-md p-4">
      <div className="mb-4 flex items-center  justify-between gap-2">
        <h3 className="font-semibold text-gray-900">Vendedor verificado</h3>
        <Link href={`/vendedor/${dealership.id}`} className="text-sm text-primary hover:underline flex items-center gap-1">
          Ver perfil <ChevronRight className="size-4" aria-hidden />
        </Link>
      </div>

      <div className="mb-4 flex items-center gap-3">
        <Profile
          name={dealership.name}
          description={dealership.description}
          avatar_url={dealership.avatar_url}
        />
      </div>
      <Separator />
      <div className="mb-4 grid grid-cols-3 gap-3 border-y border-gray-100 py-3">
        <div className="flex items-center  flex-col">
          <div className="flex items-center gap-1 text-base">
            <Star className="size-4 text-primary" aria-hidden />
            <p className="font-bold text-gray-900">{verified_seller.rating}</p>
          </div>
          <p className="text-xs text-gray-500">Rating</p>
        </div>
        <div className="text-center flex flex-col items-center">
          <p className="font-bold text-gray-900 text-base">
            {verified_seller.completed_sales}
          </p>
          <p className="text-xs text-gray-500">Ventas Completadas</p>
        </div>
        <div className="text-center flex flex-col items-center">
          <p className="font-bold text-gray-900 text-base">
            {verified_seller.response_time}
          </p>
          <p className="text-xs text-gray-500">Tiempo De Respuesta</p>
        </div>
      </div>
    </div>
  );
};
