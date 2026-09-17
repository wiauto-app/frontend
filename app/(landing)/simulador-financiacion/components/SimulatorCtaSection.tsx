import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface SimulatorCtaSectionProps {
  titulo: string;
  botonTexto: string;
  botonUrl: string;
}

export const SimulatorCtaSection = ({
  titulo,
  botonTexto,
  botonUrl,
}: SimulatorCtaSectionProps) => {
  const href = botonUrl.trim() || "#simulador";

  return (
    <section className="rounded-2xl bg-blue-600 px-6 py-12 text-center sm:px-10 sm:py-14">
      <h2 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
        {titulo}
      </h2>
      <div className="mt-8">
        <Link
          href={href}
          className={cn(
            buttonVariants({ size: "lg" }),
            "bg-white text-blue-700 hover:bg-blue-50",
          )}
          aria-label={botonTexto}
        >
          {botonTexto}
          <ArrowRight className="size-4" aria-hidden />
        </Link>
      </div>
    </section>
  );
};
