"use client";

import { useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Loader2, Star } from "lucide-react";
import { toast } from "sonner";

import { useUser } from "@/app/contexts/auth/useUser";
import { SignInDialog } from "@/components/auth/signInDialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { CustomSeparator } from "@/components/ui/customSeparator";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { dealershipReviewService } from "@/services/dealerships/dealershipReviewService";

type DealershipReviewFormProps = {
  dealership_id: string;
  dealership_name?: string;
  onCreated?: () => void;
};

const RATING_OPTIONS = [1, 2, 3, 4, 5] as const;

export function DealershipReviewForm({
  dealership_id,
  dealership_name,
  onCreated,
}: DealershipReviewFormProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { isAuthenticated, isLoading } = useUser();
  const [rating, setRating] = useState<number | null>(null);
  const [comment, setComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const normalized_comment = comment.trim();
    if (rating === null || normalized_comment.length === 0) {
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await dealershipReviewService.create({
        dealership_id,
        rating,
        comment: normalized_comment,
      });

      if (!response.ok) {
        toast.error(response.message || "No se pudo enviar la reseña");
        return;
      }

      toast.success("Reseña enviada correctamente");
      setRating(null);
      setComment("");
      onCreated?.();
      router.refresh();
    } catch {
      toast.error("No se pudo enviar la reseña");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8 text-sm text-slate-500">
        <Loader2 className="mr-2 size-4 animate-spin" aria-hidden />
        Cargando...
      </div>
    );
  }

  const isSubmitDisabled =
    isSubmitting || rating === null || comment.trim().length === 0;
  const dealership_label = dealership_name
    ? ` sobre ${dealership_name}`
    : " sobre esta concesionaria";

  return (
    <Card size="sm" className="border-slate-200 shadow-none">
      <CardContent className="space-y-5">
        <div>
          <h2 className="text-lg font-semibold text-slate-900">
            Deja tu reseña
          </h2>
          <p className="mt-1 text-sm text-slate-500">
            Comparte tu experiencia{dealership_label}.
          </p>
        </div>
        <CustomSeparator />

        {!isAuthenticated ? (
          <div className="space-y-3 text-sm text-slate-600">
            <p>Inicia sesión para publicar una reseña.</p>
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
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <fieldset disabled={isSubmitting} className="space-y-2">
              <legend className="text-sm font-medium text-slate-900">
                Valoración
              </legend>
              <div className="flex items-center gap-1">
                {RATING_OPTIONS.map((value) => (
                  <button
                    key={value}
                    type="button"
                    aria-label={`Valorar con ${value} ${value === 1 ? "estrella" : "estrellas"}`}
                    aria-pressed={rating === value}
                    onClick={() => setRating(value)}
                    className="rounded-md p-1 transition-colors hover:bg-amber-50 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <Star
                      className={cn(
                        "size-7 transition-colors",
                        rating !== null && value <= rating
                          ? "fill-amber-400 text-amber-400"
                          : "text-slate-300",
                      )}
                      aria-hidden
                    />
                  </button>
                ))}
              </div>
            </fieldset>

            <div className="space-y-2">
              <Label htmlFor={`dealership-review-comment-${dealership_id}`}>
                Comentario
              </Label>
              <Textarea
                id={`dealership-review-comment-${dealership_id}`}
                value={comment}
                onChange={(event) => setComment(event.target.value)}
                placeholder="Cuéntanos cómo fue tu experiencia"
                rows={4}
                disabled={isSubmitting}
                required
              />
            </div>

            <Button type="submit" className="w-full" disabled={isSubmitDisabled}>
              {isSubmitting ? (
                <>
                  <Loader2 className="animate-spin" aria-hidden />
                  Enviando...
                </>
              ) : (
                "Enviar reseña"
              )}
            </Button>
          </form>
        )}
      </CardContent>
    </Card>
  );
}
