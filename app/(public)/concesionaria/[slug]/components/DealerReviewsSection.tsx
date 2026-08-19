import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { dealershipReviewService } from "@/services/dealerships/dealershipReviewService";

import { DealerReviewCard } from "./DealerReviewCard";
import { DealerReviewsEmptyState } from "./DealerReviewsEmptyState";
import { DealerReviewsPagination } from "./DealerReviewsPagination";
import { DealerReviewsSummary } from "./DealerReviewsSummary";

type DealerReviewsSectionProps = {
  dealershipId: string;
  page?: number;
};

const REVIEWS_PER_PAGE = 5;

export async function DealerReviewsSection({
  dealershipId,
  page = 1,
}: DealerReviewsSectionProps) {
  const requested_page = Math.max(1, Math.floor(page));
  let reviews_page = await dealershipReviewService.getByDealershipId({
    dealership_id: dealershipId,
    page: requested_page,
    limit: REVIEWS_PER_PAGE,
    order_by: "created_at",
    order_direction: "DESC",
  });

  const initial_total_pages = Math.max(
    1,
    Math.ceil(reviews_page.total / REVIEWS_PER_PAGE),
  );
  const current_page = Math.min(requested_page, initial_total_pages);

  if (reviews_page.total > 0 && current_page !== requested_page) {
    reviews_page = await dealershipReviewService.getByDealershipId({
      dealership_id: dealershipId,
      page: current_page,
      limit: REVIEWS_PER_PAGE,
      order_by: "created_at",
      order_direction: "DESC",
    });
  }

  const total_pages = Math.max(
    1,
    Math.ceil(reviews_page.total / reviews_page.limit),
  );

  return (
    <Card id="reviews" className="scroll-mt-28">
      <CardHeader className="border-b">
        <CardTitle className="text-lg">Reseñas de clientes</CardTitle>
        <CardDescription>
          Experiencias compartidas por la comunidad de WiAuto.
        </CardDescription>
        <CardAction>
          <Badge variant="secondary">
            {reviews_page.total}{" "}
            {reviews_page.total === 1 ? "reseña" : "reseñas"}
          </Badge>
        </CardAction>
      </CardHeader>

      <CardContent>
        {reviews_page.total === 0 ? (
          <DealerReviewsEmptyState />
        ) : (
          <div className="grid gap-8 lg:grid-cols-[220px_1fr]">
            <DealerReviewsSummary
              averageRating={reviews_page.average_rating}
              total={reviews_page.total}
            />

            <div className="min-w-0">
              {reviews_page.data.map((review, index) => (
                <DealerReviewCard
                  key={review.id}
                  review={review}
                  isLast={index === reviews_page.data.length - 1}
                />
              ))}
            </div>
          </div>
        )}
      </CardContent>

      {total_pages > 1 ? (
        <CardFooter className="justify-center border-t">
          <DealerReviewsPagination
            currentPage={current_page}
            totalPages={total_pages}
          />
        </CardFooter>
      ) : null}
    </Card>
  );
}
