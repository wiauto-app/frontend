"use client";

import type { OwnerVehicleListItem } from "@/interfaces/owner-vehicle.interface";
import { MyListingTableRow } from "./MyListingTableRow";

interface MyListingsTableProps {
  listings: OwnerVehicleListItem[];
  onRenew: (id: string) => Promise<void>;
  onFeature: (id: string) => Promise<void>;
  onDuplicate: (id: string) => Promise<void>;
  onSchedule: (listing: OwnerVehicleListItem) => void;
  onRemove: (id: string) => Promise<void>;
  onToggleStatus: (
    id: string,
    nextStatus: "active" | "inactive",
  ) => Promise<void>;
  isMutating?: boolean;
  isProfessional?: boolean;
  featurePriceLabel?: string | null;
}

export const MyListingsTable = ({
  listings,
  onRenew,
  onFeature,
  onDuplicate,
  onSchedule,
  onRemove,
  onToggleStatus,
  isMutating = false,
  isProfessional = false,
  featurePriceLabel,
}: MyListingsTableProps) => {
  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[720px] text-left">
          <thead>
            <tr className="border-b border-gray-100 bg-gray-50/80">
              <th
                scope="col"
                className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-gray-500"
              >
                Anuncio
              </th>
              <th
                scope="col"
                className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-gray-500 hidden lg:table-cell"
              >
                Rendimiento
              </th>
              <th
                scope="col"
                className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-gray-500"
              >
                Precio
              </th>
              <th
                scope="col"
                className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-gray-500"
              >
                Estado
              </th>
              <th
                scope="col"
                className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-gray-500 text-right"
              >
                Acciones
              </th>
            </tr>
          </thead>
          <tbody>
            {listings.map((listing) => (
              <MyListingTableRow
                key={listing.id}
                listing={listing}
                onRenew={onRenew}
                onFeature={onFeature}
                onDuplicate={onDuplicate}
                onSchedule={onSchedule}
                onRemove={onRemove}
                onToggleStatus={onToggleStatus}
                isMutating={isMutating}
                isProfessional={isProfessional}
                featurePriceLabel={featurePriceLabel}
              />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
