import { MessageSquareQuote } from "lucide-react";

export function DealerReviewsEmptyState() {
  return (
    <div className="flex flex-col items-center gap-3 py-12 text-center">
      <div className="flex size-14 items-center justify-center rounded-full bg-muted text-muted-foreground">
        <MessageSquareQuote className="size-6" aria-hidden />
      </div>
      <div className="flex max-w-md flex-col gap-1">
        <h3 className="font-heading text-base font-semibold text-foreground">
          Aún no hay reseñas
        </h3>
        <p className="text-sm leading-6 text-muted-foreground">
          Sé la primera persona en compartir cómo fue su experiencia con esta
          concesionaria.
        </p>
      </div>
    </div>
  );
}
