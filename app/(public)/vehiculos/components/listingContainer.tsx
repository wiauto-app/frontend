"use client";

import { cn } from "@/lib/utils";
import { useSearchParams } from "next/navigation";
import { SHOW_MAP_KEY } from "../[[...slug]]/constants/filterKeys.constants";

export const ListingContainer = ({ children }: { children: React.ReactNode }) => {
  const searchParams = useSearchParams();
  const isMapVisible = searchParams.get(SHOW_MAP_KEY) === "true";
  return (
    <div
    className={cn(
      "mx-auto mt-5 flex gap-5",
      !isMapVisible ? "listing-container" : "container-custom-full",
    )}
  >
    {children}
  </div>
  )
}
