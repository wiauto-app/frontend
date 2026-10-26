"use client";

import type { OwnerVehicleListItem } from "@/interfaces/owner-vehicle.interface";
import { MyListingTableRow } from "./MyListingTableRow";

interface MyListingsTableProps {
  listings: OwnerVehicleListItem[];
}

export const MyListingsTable = ({ listings }: MyListingsTableProps) => {
  return (
    <section className="flex flex-col gap-5" aria-label="Tus anuncios">
      {listings.map((listing) => (
        <MyListingTableRow key={listing.id} listing={listing} />
      ))}
    </section>
  );
};
