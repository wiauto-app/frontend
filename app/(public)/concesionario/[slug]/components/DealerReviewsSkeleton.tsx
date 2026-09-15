import {
  Card,
  CardContent,
  CardHeader,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function DealerReviewsSkeleton() {
  return (
    <Card id="reviews" className="scroll-mt-28">
      <CardHeader className="border-b">
        <Skeleton className="h-6 w-48" />
        <Skeleton className="h-4 w-72 max-w-full" />
      </CardHeader>
      <CardContent className="grid gap-6 lg:grid-cols-[220px_1fr]">
        <Skeleton className="h-44 w-full" />
        <div className="flex flex-col gap-5">
          {Array.from({ length: 3 }, (_, index) => (
            <div key={index} className="flex gap-3">
              <Skeleton className="size-10 rounded-full" />
              <div className="flex flex-1 flex-col gap-2">
                <Skeleton className="h-4 w-40" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-4/5" />
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
