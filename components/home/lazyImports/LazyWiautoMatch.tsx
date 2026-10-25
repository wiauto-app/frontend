"use client";

import { Skeleton } from "@/components/ui/skeleton";
import dynamic from "next/dynamic";

const WiautoMatchForm = dynamic(() => import("../wiautoMatchForm").then((mod) => mod.WiautoMatchForm), {
  ssr: false,   
  loading: () => <Skeleton className="w-full h-91 lg:h-56" />,
});
export const LazyWiautoMatch = () => {
  return (
    <WiautoMatchForm />
  )
}
