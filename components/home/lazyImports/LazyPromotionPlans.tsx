"use client";
import { Skeleton } from "@/components/ui/skeleton";
import { StrapiHero } from "@/interfaces/strapi-components.interface";
import dynamic from "next/dynamic";

const PromotionPlans = dynamic(
  () => import("../promotionPlans").then((mod) => mod.PromotionPlans),
  {
    ssr: false,
    loading: () => <Skeleton className="w-full h-91 lg:h-56" />,
  },
);

export const LazyPromotionPlans = ({
  data,
}: {
  data: StrapiHero | null | undefined;
}) => {
  return <PromotionPlans data={data} />;
};
