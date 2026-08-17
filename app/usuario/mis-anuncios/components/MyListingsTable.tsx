"use client";

import type { OwnerVehicleListItem } from "@/interfaces/owner-vehicle.interface";
import { MyListingTableRow } from "./MyListingTableRow";
import { VehicleStatus } from "@/components/vehicles/constants/vehicle-status.constants";

interface MyListingsTableProps {
  listings: OwnerVehicleListItem[];
  onRenew: (id: string) => Promise<void>;
  onFeature: (id: string) => Promise<void>;
  onDuplicate: (id: string) => Promise<void>;
  onSchedule: (listing: OwnerVehicleListItem) => void;
  onRemove: (id: string) => Promise<void>;
  onToggleStatus: (id: string, nextStatus: VehicleStatus) => Promise<void>;
  isMutating?: boolean;
  canUseAdvancedEditor?: boolean;
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
  canUseAdvancedEditor = false,
  featurePriceLabel,
}: MyListingsTableProps) => {
  return (
    <section className="flex flex-col gap-5" aria-label="Tus anuncios">
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
          canUseAdvancedEditor={canUseAdvancedEditor}
          featurePriceLabel={featurePriceLabel}
        />
      ))}
    </section>
  );
};
