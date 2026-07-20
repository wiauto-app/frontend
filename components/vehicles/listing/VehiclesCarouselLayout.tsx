"use client";

import { useCallback, useEffect, useState } from "react";
import { ChevronRightIcon, Loader2 } from "lucide-react";

import { VehicleGridCard } from "@/app/(public)/vehiculos/components/VehicleGridCard";
import { Button } from "@/components/ui/button";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  type CarouselApi,
} from "@/components/ui/carousel";
import type { VehicleListItem } from "@/interfaces/vehicle.interface";
import { vehicleService } from "@/services/vehicleService";
import { motion } from "motion/react";

import {
  getVariant,
  staggerContainer,
  staggerItem,
} from "@/components/home/motion";
import { usePrefersReducedMotion } from "@/components/home/motion/usePrefersReducedMotion";

const LOAD_MORE_THRESHOLD = 2;

type VehiclesCarouselLayoutProps = {
  initialVehicles: VehicleListItem[];
  vehicleId?: string;
  total: number;
  pageSize: number;
};

const appendUniqueVehicles = (
  current: VehicleListItem[],
  incoming: VehicleListItem[],
): VehicleListItem[] => {
  const existingIds = new Set(current.map((vehicle) => vehicle.id));
  const uniqueIncoming = incoming.filter((vehicle) => !existingIds.has(vehicle.id));

  if (uniqueIncoming.length === 0) {
    return current;
  }

  return [...current, ...uniqueIncoming];
};

export const VehiclesCarouselLayout = ({
  initialVehicles,
  vehicleId,
  total,
  pageSize,
}: VehiclesCarouselLayoutProps) => {
  const prefersReducedMotion = usePrefersReducedMotion();
  const containerVariants = getVariant(staggerContainer, prefersReducedMotion);
  const itemVariants = getVariant(staggerItem, prefersReducedMotion);
  const [api, setApi] = useState<CarouselApi>();
  const [vehicles, setVehicles] = useState(initialVehicles);
  const [page, setPage] = useState(1);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(false);

  useEffect(() => {
    setVehicles(initialVehicles);
    setPage(1);
  }, [initialVehicles, vehicleId]);

  const loadMore = useCallback(async () => {
    if (isLoadingMore || vehicles.length >= total || !vehicleId) {
      return;
    }

    setIsLoadingMore(true);

    try {
      const nextPage = page + 1;
      const response = await vehicleService.vehicles.findSimilar(vehicleId, {
        page: nextPage,
        limit: pageSize,
      });

      if (response.ok && response.data) {
        setVehicles((current) =>
          appendUniqueVehicles(current, response.data.data ?? []),
        );
        setPage(nextPage);
      }
    } finally {
      setIsLoadingMore(false);
    }
  }, [isLoadingMore, page, pageSize, total, vehicleId, vehicles.length]);

  const maybeLoadMore = useCallback(
    async (selectedIndex: number) => {
      const slidesRemaining = vehicles.length - 1 - selectedIndex;

      if (
        slidesRemaining <= LOAD_MORE_THRESHOLD &&
        vehicles.length < total &&
        !isLoadingMore
      ) {
        await loadMore();
      }
    },
    [isLoadingMore, loadMore, total, vehicles.length],
  );

  useEffect(() => {
    if (!api) {
      return;
    }

    const handleSelect = () => {
      const selectedIndex = api.selectedScrollSnap();
      setCanScrollNext(api.canScrollNext() || vehicles.length < total);
      void maybeLoadMore(selectedIndex);
    };

    handleSelect();
    api.on("select", handleSelect);
    api.on("reInit", handleSelect);

    return () => {
      api.off("select", handleSelect);
      api.off("reInit", handleSelect);
    };
  }, [api, maybeLoadMore, vehicles.length, total]);

  useEffect(() => {
    api?.reInit();
  }, [api, vehicles]);

  const handleNextClick = async () => {
    if (!api) {
      return;
    }

    const selectedIndex = api.selectedScrollSnap();
    await maybeLoadMore(selectedIndex);

    if (api.canScrollNext()) {
      api.scrollNext();
      return;
    }

    if (vehicles.length < total && !isLoadingMore) {
      await loadMore();
      requestAnimationFrame(() => {
        api.scrollNext();
      });
    }
  };

  const isNextDisabled =
    isLoadingMore || (!canScrollNext && vehicles.length >= total);

  return (
    <Carousel className="w-full" opts={{ loop: false, align: "start" }} setApi={setApi}>
      <div className="relative px-10 sm:px-12 pb-2">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={containerVariants}
        >
          <CarouselContent className="-ml-3 sm:-ml-4">
            {vehicles.map((vehicle) => (
              <CarouselItem
                key={vehicle.id}
                className="basis-full pl-3 sm:basis-1/2 sm:pl-4 lg:basis-1/4"
              >
                <motion.div variants={itemVariants}>
                  <VehicleGridCard vehicle={vehicle} />
                </motion.div>
              </CarouselItem>
            ))}
          </CarouselContent>
        </motion.div>

        <CarouselPrevious
          aria-label="Ver vehículos anteriores"
          className="left-0 size-9 border-slate-200 bg-white shadow-sm"
        />

        <Button
          type="button"
          variant="outline"
          size="icon-sm"
          aria-label="Ver vehículos siguientes"
          disabled={isNextDisabled}
          onClick={handleNextClick}
          className="absolute top-1/2 -right-0 size-9 -translate-y-1/2 touch-manipulation rounded-full border-slate-200 bg-white shadow-sm"
        >
          {isLoadingMore ? (
            <Loader2 className="size-4 animate-spin" aria-hidden />
          ) : (
            <ChevronRightIcon aria-hidden />
          )}
        </Button>
      </div>
    </Carousel>
  );
};
