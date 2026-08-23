"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Hash, Search } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { vehicleService } from "@/services/vehicleService";

const REF_PATTERN = /^\d+$/;

export const HeroReferenceSearch = () => {
  const router = useRouter();
  const [reference, setReference] = useState("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleReferenceChange = (value: string) => {
    const digits_only = value.replace(/\D/g, "");
    setReference(digits_only);
    if (errorMessage) {
      setErrorMessage(null);
    }
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const trimmed = reference.trim();
    if (!trimmed || !REF_PATTERN.test(trimmed)) {
      setErrorMessage("Introduce un número de referencia válido");
      return;
    }

    const ref = Number(trimmed);
    if (!Number.isSafeInteger(ref) || ref <= 0) {
      setErrorMessage("Introduce un número de referencia válido");
      return;
    }

    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      const response = await vehicleService.vehicles.findByRef(ref);
      if (!response.ok || !response.data?.id) {
        if (response.status === 404) {
          setErrorMessage("No encontramos ningún vehículo con esa referencia");
          return;
        }
        setErrorMessage(
          response.message || "No se pudo buscar la referencia. Inténtalo de nuevo.",
        );
        return;
      }

      router.push(`/vehiculo/${response.data.id}`);
    } catch {
      toast.error("No se pudo buscar la referencia. Inténtalo de nuevo.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form className="flex flex-col gap-4 " onSubmit={handleSubmit}>
      <div className="space-y-2">
        <label
          htmlFor="hero-vehicle-ref"
          className="text-sm font-medium text-foreground"
        >
          Número de referencia
        </label>
        <div className="relative">
          <Hash
            className="pointer-events-none absolute top-1/2 left-3 size-3 -translate-y-1/2 text-primary"
            aria-hidden
          />
          <Input
            id="hero-vehicle-ref"
            type="text"
            inputMode="numeric"
            autoComplete="off"
            placeholder="Ej. 10234"
            value={reference}
            onChange={(event) => handleReferenceChange(event.target.value)}
            aria-invalid={Boolean(errorMessage)}
            aria-describedby={
              errorMessage ? "hero-vehicle-ref-error" : "hero-vehicle-ref-hint"
            }
            className="pl-8  "
          />
        </div>
        <p
          id="hero-vehicle-ref-hint"
          className="text-xs text-muted-foreground"
        >
          La referencia aparece en el anuncio del vehículo.
        </p>
        {errorMessage ? (
          <p
            id="hero-vehicle-ref-error"
            role="alert"
            className="text-sm text-destructive"
          >
            {errorMessage}
          </p>
        ) : null}
      </div>
      <Button
        type="submit"
        disabled={isSubmitting || !reference.trim()}
        aria-label="Buscar vehículo por referencia"
      >
        <Search className="size-4" />
        {isSubmitting ? "Buscando..." : "Buscar referencia"}
      </Button>
    </form>
  );
};
