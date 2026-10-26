"use client";

import { useQuery } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { formatPrice } from "@/app/(public)/vehiculos/utils";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import type { VehiclePriceHistoryItem } from "@/interfaces/vehicle-price.interface";
import { vehiclePriceService } from "@/services/vehiclePriceService";
import { formatFavoritePublishedDate } from "../utils/favorites.utils";

type VehiclePriceHistoryDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  vehicleId: string;
  vehicleTitle: string;
};

const getStatusLabel = (status: VehiclePriceHistoryItem["status"]): string =>
  status === "active" ? "Activo" : "Inactivo";

export const VehiclePriceHistoryDialog = ({
  open,
  onOpenChange,
  vehicleId,
  vehicleTitle,
}: VehiclePriceHistoryDialogProps) => {
  const pricesQuery = useQuery({
    queryKey: ["vehicle-price-history", vehicleId],
    queryFn: async () => {
      const response = await vehiclePriceService.findByVehicleId(vehicleId);
      if (!response.ok) {
        throw new Error(response.message || "No se pudo cargar el historial");
      }
      return response.data;
    },
    enabled: open,
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Historia del precio</DialogTitle>
          <DialogDescription>{vehicleTitle}</DialogDescription>
        </DialogHeader>

        {pricesQuery.isLoading ? (
          <div className="flex items-center justify-center py-10 text-muted-foreground">
            <Loader2 className="size-5 animate-spin" aria-hidden />
            <span className="sr-only">Cargando historial de precios</span>
          </div>
        ) : pricesQuery.isError ? (
          <p className="py-6 text-sm text-red-600">
            No se pudo cargar el historial de precios.
          </p>
        ) : !pricesQuery.data?.length ? (
          <p className="py-6 text-sm text-gray-500">
            Este vehículo no tiene registros de precio todavía.
          </p>
        ) : (
          <div className="max-h-80 overflow-y-auto rounded-lg border">
            <table className="w-full text-sm">
              <thead className="sticky top-0 bg-gray-50 text-left text-xs uppercase tracking-wide text-gray-500">
                <tr>
                  <th className="px-4 py-3 font-medium">Fecha</th>
                  <th className="px-4 py-3 font-medium">Precio</th>
                  <th className="px-4 py-3 font-medium">Estado</th>
                </tr>
              </thead>
              <tbody>
                {pricesQuery.data.map((price) => (
                  <tr key={price.id} className="border-t border-gray-100">
                    <td className="px-4 py-3 text-gray-700">
                      {formatFavoritePublishedDate(price.created_at)}
                    </td>
                    <td className="px-4 py-3 font-semibold text-gray-900">
                      {formatPrice(price.price)}
                    </td>
                    <td className="px-4 py-3 text-gray-600">
                      {getStatusLabel(price.status)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};
