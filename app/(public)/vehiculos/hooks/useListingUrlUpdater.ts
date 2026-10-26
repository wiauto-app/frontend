"use client";

import { useCallback, useTransition } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";

import type { FindAllVehiclesParams } from "@/interfaces/vehicle.interface";
import {
  buildVehicleListingHref,
  parseVehicleListingUrl,
} from "@/lib/vehicles/listing-url";
import { appendListingUiQuery } from "@/lib/vehicles/listing-url/build-listing-url";

const resolveSlugArray = (slug: string | string[] | undefined): string[] => {
  if (!slug) {
    return [];
  }
  return Array.isArray(slug) ? slug : [slug];
};

export const withPreservedListingUiQuery = (
  href: string,
  searchParams: URLSearchParams,
): string => appendListingUiQuery(href, searchParams);

export const useListingUrlUpdater = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const routeParams = useParams();
  const slug_segments = resolveSlugArray(routeParams.slug);
  const [, startTransition] = useTransition();

  const updateFilters = useCallback(
    (patch: Partial<FindAllVehiclesParams>) => {
      const current = parseVehicleListingUrl(slug_segments, searchParams);
      const next: FindAllVehiclesParams = {
        ...current,
        ...patch,
        page: patch.page ?? 1,
      };
      const href = withPreservedListingUiQuery(
        buildVehicleListingHref(next),
        searchParams,
      );

      startTransition(() => {
        router.push(href, { scroll: false });
      });
    },
    [router, searchParams, slug_segments],
  );

  return { updateFilters };
};
