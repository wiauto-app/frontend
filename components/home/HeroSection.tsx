import Link from "next/link";
import { HeroSearchForm } from "./HeroSearchForm";

const BRAND_BLUE = "#0061F2";

export function HeroSection() {
  return (
    <section className="relative min-h-[560px] overflow-hidden">
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=1920&q=80')`,
        }}
        aria-hidden
      />
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(to right, rgba(10,25,60,0.88) 0%, rgba(10,25,60,0.72) 45%, rgba(10,25,60,0.45) 100%)",
        }}
        aria-hidden
      />
      <div
        className="absolute bottom-0 right-0 h-32 w-48 bg-[#0a193c] sm:h-40 sm:w-64"
        style={{ clipPath: "polygon(100% 0, 100% 100%, 0 100%)" }}
        aria-hidden
      />

      <div className="relative mx-auto flex w-full max-w-7xl flex-col gap-10 px-4 py-16 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:gap-16 lg:px-8 lg:py-24">
        <div className="flex max-w-xl gap-5 sm:gap-6">
          <div
            className="mt-1 w-1.5 shrink-0 self-stretch rounded-full sm:w-2"
            style={{ backgroundColor: BRAND_BLUE }}
            aria-hidden
          />
          <div className="text-white">
            <h1 className="text-3xl font-bold leading-[1.15] tracking-tight sm:text-4xl lg:text-[2.75rem] lg:leading-[1.12]">
              En WiAuto encuentra el auto ideal para tu próximo destino
            </h1>
            <Link
              href="/crear-vehiculo"
              className="mt-8 inline-flex h-12 items-center justify-center rounded-lg border-2 border-white px-8 text-sm font-bold text-white transition-colors hover:bg-white/10"
            >
              Publicar Vehículo
            </Link>
          </div>
        </div>

        <HeroSearchForm />
      </div>
    </section>
  );
}
