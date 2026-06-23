import Link from "next/link";
import { ChevronRight, Star } from "lucide-react";
import { BRAND_BLUE } from "@/app/(public)/concesionarias/constants";
import type { DealerProfile } from "../interfaces";

type DealerReviewsSectionProps = {
  dealer: DealerProfile;
};

function RatingBar({
  stars,
  count,
  maxCount,
}: {
  stars: number;
  count: number;
  maxCount: number;
}) {
  const width = maxCount > 0 ? `${(count / maxCount) * 100}%` : "0%";
  return (
    <div className="flex items-center gap-2 text-xs text-slate-500">
      <span className="w-3 shrink-0 text-right font-medium">{stars}</span>
      <Star className="size-3 shrink-0 fill-[#FFB800] text-[#FFB800]" />
      <div className="h-2 flex-1 overflow-hidden rounded-full bg-slate-100">
        <div
          className="h-full rounded-full transition-all duration-500"
          style={{ width, backgroundColor: BRAND_BLUE }}
        />
      </div>
    </div>
  );
}

export function DealerReviewsSection({ dealer }: DealerReviewsSectionProps) {
  if (dealer.reviewCount === 0) {
    return (
      <div
        id="reviews"
        className="mt-6 overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm"
      >
        <div className="p-5 sm:p-6">
          <h2 className="text-lg font-bold text-slate-900">Reseñas de clientes</h2>
          <p className="mt-3 text-sm text-slate-500">
            Esta concesionaria aún no tiene reseñas publicadas.
          </p>
        </div>
      </div>
    );
  }

  const maxCount = Math.max(
    ...(dealer.ratingDistribution ?? []).map((item) => item.count),
    1,
  );

  return (
    <div
      id="reviews"
      className="overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm"
    >
      <div className="p-5 sm:p-6">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between gap-3">
          <h2 className="text-lg font-bold text-slate-900">
            Reseñas de clientes
          </h2>
          <Link
            href={`/concesionaria/${dealer.slug}/reviews`}
            className="inline-flex items-center gap-1 text-sm font-semibold hover:underline"
            style={{ color: BRAND_BLUE }}
          >
            Ver todas ({dealer.reviewCount})
            <ChevronRight className="size-4" />
          </Link>
        </div>

        {/* Two-column layout: rating summary | reviews list */}
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-[200px_1fr]">
          {/* Left: Overall score */}
          <div className="space-y-4">
            <div className="text-center lg:text-left">
              <p className="text-5xl font-extrabold text-slate-900">
                {dealer.rating.toFixed(1)}
              </p>
              <div className="mt-2 flex items-center justify-center gap-0.5 lg:justify-start">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className="size-4 fill-[#FFB800] text-[#FFB800]"
                  />
                ))}
              </div>
              <p className="mt-1 text-sm text-slate-500">
                ({dealer.reviewCount} reseñas)
              </p>
            </div>

            {/* Rating bars */}
            <div className="space-y-1.5">
              {[5, 4, 3, 2, 1].map((stars) => {
                const item = dealer.ratingDistribution?.find(
                  (e) => e.stars === stars,
                );
                return (
                  <RatingBar
                    key={stars}
                    stars={stars}
                    count={item?.count ?? 0}
                    maxCount={maxCount}
                  />
                );
              })}
            </div>
          </div>

          {/* Right: Review cards */}
          <div className="space-y-5">
            {dealer.reviews.length === 0 ? (
              <p className="text-sm text-slate-500">
                Esta concesionaria aún no tiene reseñas publicadas.
              </p>
            ) : (
              dealer.reviews.map((review) => (
              <article
                key={review.id}
                className="flex gap-3 border-b border-slate-100 pb-5 last:border-b-0 last:pb-0"
              >
                {/* Avatar */}
                <div className="size-10 shrink-0 overflow-hidden rounded-full bg-slate-100">
                  {review.avatar ? (
                    <img
                      src={review.avatar}
                      alt={review.author}
                      className="size-full object-cover"
                    />
                  ) : (
                    <div
                      className="flex size-full items-center justify-center text-sm font-bold text-white"
                      style={{ backgroundColor: BRAND_BLUE }}
                    >
                      {review.author.charAt(0)}
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <p className="font-semibold text-slate-900">
                      {review.author}
                    </p>
                    <div className="flex items-center gap-0.5">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          className={`size-3.5 ${
                            i < review.rating
                              ? "fill-[#FFB800] text-[#FFB800]"
                              : "fill-slate-200 text-slate-200"
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                  <p className="mt-1.5 text-sm leading-relaxed text-slate-600">
                    {review.comment}
                  </p>
                </div>
              </article>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
