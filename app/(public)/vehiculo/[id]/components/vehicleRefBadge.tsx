"use client";

import { useState } from "react";
import { Check, Copy, Hash } from "lucide-react";
import { toast } from "sonner";

import { cn } from "@/lib/utils";

interface VehicleRefBadgeProps {
  vehicleRef: string | number;
  className?: string;
  textClassName?: string;
}

const formatVehicleRef = (vehicleRef: string | number): string =>
  String(vehicleRef);

export const VehicleRefBadge = ({
  vehicleRef,
  className,
  textClassName,
}: VehicleRefBadgeProps) => {
  const [copied, setCopied] = useState(false);
  const refLabel = formatVehicleRef(vehicleRef);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(refLabel);
      setCopied(true);
      toast.success("Referencia copiada");
      window.setTimeout(() => {
        setCopied(false);
      }, 1500);
    } catch {
      toast.error("No se pudo copiar la referencia");
    }
  };

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-md border border-slate-200 bg-slate-50 py-0.5 pl-2.5 pr-1 font-mono text-xs font-semibold tracking-wider text-slate-700",
        className,
      )}
      title={`Referencia del anuncio ${refLabel}`}
    >
      <Hash className="size-3.5 shrink-0 text-primary" aria-hidden />
      <span className={textClassName}>Ref. {refLabel}</span>
      <button
        type="button"
        onClick={() => {
          void handleCopy();
        }}
        className="inline-flex size-7 items-center justify-center rounded-md text-slate-500 transition-colors hover:bg-white hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        aria-label={`Copiar referencia ${refLabel}`}
      >
        {copied ? (
          <Check className="size-3.5 text-emerald-600" aria-hidden />
        ) : (
          <Copy className="size-3.5" aria-hidden />
        )}
      </button>
    </span>
  );
};
