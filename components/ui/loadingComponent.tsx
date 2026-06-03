import { Loader2 } from "lucide-react";

import { cn } from "@/lib/utils";

export type LoadingComponentProps = {
  /** Texto bajo el spinner. Si es `undefined`, usa "Cargando…". Pasa `null` para ocultarlo. */
  message?: string | null;
  className?: string;
  /** `viewport`: pantalla completa. `container`: cubre el padre con `position: relative`. */
  scope?: "viewport" | "container";
};

export const LoadingComponent = ({
  message,
  className,
  scope = "viewport",
}: LoadingComponentProps) => {
  const label = message === undefined ? "Cargando…" : message;
  const aria_label = label ?? "Cargando";

  return (
    <div
      role="status"
      aria-live="polite"
      aria-busy="true"
      aria-label={aria_label}
      className={cn(
        "flex items-center justify-center",
        scope === "viewport" ? "fixed inset-0 z-50" : "absolute inset-0 z-40",
        "bg-background/55 backdrop-blur-md",
        className,
      )}
    >
      <div
        className={cn(
          "flex flex-col items-center gap-4 rounded-2xl border border-primary/15",
          "bg-background/90 px-8 py-7 shadow-2xl backdrop-blur-sm",
          "ring-1 ring-primary/5",
        )}
      >
        <div className="relative flex size-12 items-center justify-center">
          <span
            className="absolute inset-0 animate-ping rounded-full bg-primary/15"
            aria-hidden
          />
          <span
            className="absolute inset-1 rounded-full border-2 border-primary/20"
            aria-hidden
          />
          <Loader2
            className="relative size-8 animate-spin text-primary"
            aria-hidden
          />
        </div>
        {label ? (
          <p className="text-sm font-medium tracking-tight text-muted-foreground">
            {label}
          </p>
        ) : null}
      </div>
    </div>
  );
};
