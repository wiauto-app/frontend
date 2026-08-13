import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";
import { FaCrown } from "react-icons/fa";
import { IoSparkles } from "react-icons/io5";
import { FiCamera, FiVideo, FiTrendingUp, FiArrowRight } from "react-icons/fi";

export const PromotionBanner = () => {
  return (
    <Card className="group relative overflow-hidden border border-purple/20 bg-gradient-to-br from-purple/10 via-background to-purple/5 shadow-sm transition-all duration-300 hover:border-purple/40 hover:shadow-lg">
      {/* Decorative elements */}
      <div className="pointer-events-none absolute -right-16 -top-16 h-40 w-40 rounded-full bg-purple/10 blur-3xl transition-all duration-500 group-hover:bg-purple/20" />

      <CardContent className="relative p-5 sm:p-6">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          
          {/* Left */}
          <div className="flex items-start gap-4">
            {/* Icon */}
            <div className="hidden sm:flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-purple shadow-md shadow-purple/20">
              <IoSparkles className="h-7 w-7 text-white" />
            </div>

            <div className="min-w-0">
              {/* Badge */}
              <div className="mb-2 inline-flex items-center gap-1.5 rounded-full bg-purple/10 px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide text-purple">
                <FaCrown className="h-3 w-3" />
                Potencia tu anuncio
              </div>

              <h3 className="text-xl font-bold tracking-tight text-foreground">
                ¡Haz que tu vehículo destaque!
              </h3>

              <p className="mt-1 max-w-xl text-sm leading-relaxed text-muted-foreground">
                Suscríbete y desbloquea más espacio para{" "}
                <span className="font-semibold text-foreground">
                  fotos y videos
                </span>{" "}
                para mostrar tu vehículo con todo detalle.
              </p>

              {/* Benefits */}
              <div className="mt-4 flex flex-wrap gap-x-5 gap-y-2">
                <div className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
                  <FiCamera className="h-4 w-4 text-purple" />
                  Más fotos
                </div>

                <div className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
                  <FiVideo className="h-4 w-4 text-purple" />
                  Videos
                </div>

                <div className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
                  <FiTrendingUp className="h-4 w-4 text-purple" />
                  Mayor visibilidad
                </div>
              </div>
            </div>
          </div>

          {/* Right / CTA */}
          <div className="flex shrink-0 flex-col gap-2 sm:flex-row lg:flex-col">
            <Link href="/planes">
              <Button
                size="xl"
                className="w-full rounded-xl bg-purple px-6 font-semibold text-white shadow-md shadow-purple/20 transition-all hover:bg-purple/90 hover:shadow-lg hover:shadow-purple/30"
              >
                <FaCrown className="mr-1.5 h-4 w-4" />
                Suscribirme ahora
                <FiArrowRight className="ml-1.5 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>

            <p className="text-center text-[11px] text-muted-foreground">
              Mejora tu anuncio en segundos
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};