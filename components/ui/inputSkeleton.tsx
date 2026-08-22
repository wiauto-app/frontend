import { cn } from "@/lib/utils";
import { Skeleton } from "./skeleton";

export const InputSkeleton = ({ className }: { className?: string }) => {
  return <Skeleton className={cn("w-full h-9", className)} />;
};
