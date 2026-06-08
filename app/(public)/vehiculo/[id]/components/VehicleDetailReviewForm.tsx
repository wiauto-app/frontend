"use client";

import { useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { Loader2, Star } from "lucide-react";
import { toast } from "sonner";

import { useUser } from "@/app/contexts/auth/useUser";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { reviewService } from "@/services/reviewService";
import { SignInDialog } from "@/components/auth/signInDialog";
import { VehicleDetailCard } from "./VehicleDetailCard";

type VehicleDetailReviewFormProps = {
  vehicle_id: string;
};

const RATING_OPTIONS = [1, 2, 3, 4, 5] as const;

export const VehicleDetailReviewForm = ({
  vehicle_id,
}: VehicleDetailReviewFormProps) => {
  const router = useRouter();
  const pathname = usePathname();
  const { isAuthenticated, isLoading } = useUser();
  const [rating, setRating] = useState<number | null>(null);
  const [comment, setComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleRatingSelect = (value: number) => {
    setRating(value);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (rating === null || !comment.trim()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await reviewService.create({
        vehicle_id,
        rating,
        comment: comment.trim(),
      });

      if (!response.ok) {
        toast.error(response.message || "No se pudo enviar la reseña");
        return;
      }

      toast.success("Reseña enviada correctamente");
      setRating(null);
      setComment("");
      router.refresh();
    } catch {
      toast.error("No se pudo enviar la reseña");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-4 text-sm text-gray-500">
        <Loader2 className="mr-2 size-4 animate-spin" aria-hidden />
        Cargando...
      </div>
    );
  }

  const isSubmitDisabled =
    isSubmitting || rating === null || comment.trim().length === 0;

  return (
    <VehicleDetailCard title="Deja tu reseña">
      <form onSubmit={handleSubmit} className="space-y-4">
        {!isAuthenticated && (
          <div className="space-y-3 text-sm text-gray-600">
            <p>Inicia sesión para dejar una reseña sobre este vehículo.</p>
            <SignInDialog
              returnTo={pathname}
              onSuccess={() => router.refresh()}
              trigger={
                <Button type="button" variant="outline">
                  Iniciar sesión
                </Button>
              }
            />
          </div>
        )}
        {isAuthenticated && (
          <>
            <div className="space-y-2">
              <Label>Valoración</Label>
              <div className="flex items-center gap-1">
                {RATING_OPTIONS.map((value) => (
                  <button
                    key={value}
                    type="button"
                    aria-label={`Valorar con ${value} ${value === 1 ? "estrella" : "estrellas"}`}
                    aria-pressed={rating === value}
                    disabled={isSubmitting}
                    onClick={() => handleRatingSelect(value)}
                    className="rounded p-1 transition-colors hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <Star
                      className={cn(
                        "size-6",
                        rating !== null && value <= rating
                          ? "fill-yellow-400 text-yellow-400"
                          : "text-gray-300",
                      )}
                      aria-hidden
                    />
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="review-comment">Comentario</Label>
              <Textarea
                id="review-comment"
                value={comment}
                onChange={(event) => setComment(event.target.value)}
                placeholder="Cuéntanos tu experiencia con este vehículo"
                rows={3}
                disabled={isSubmitting}
                required
              />
            </div>

            <Button
              type="submit"
              className="w-full"
              disabled={isSubmitDisabled}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="animate-spin" aria-hidden />
                  Enviando...
                </>
              ) : (
                "Enviar reseña"
              )}
            </Button>
          </>
        )}
      </form>
    </VehicleDetailCard>
  );
};
