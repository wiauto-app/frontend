import Link from "next/link";
import { ArrowRight, Car, Compass, Home } from "lucide-react";

import { BrandLogo } from "@/components/ui/brandLogo";
import { Button } from "@/components/ui/button";

const QUICK_LINKS = [
  { href: "/vehiculos", label: "Comprar vehículos" },
  { href: "/crear-vehiculo", label: "Publicar anuncio" },
  { href: "/concesionarias", label: "Concesionarios" },
  { href: "/tasador", label: "Tasador" },
] as const;

export default function NotFound() {
  return (
    <section
      aria-labelledby="not-found-heading"
      className="relative isolate overflow-hidden bg-[#EEF3FA]"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,_#cfe0ff_0%,_transparent_55%),radial-gradient(ellipse_at_bottom_right,_#dbe8fb_0%,_transparent_45%)]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.35] [background-image:linear-gradient(rgba(2,23,47,0.06)_1px,transparent_1px),linear-gradient(90deg,rgba(2,23,47,0.06)_1px,transparent_1px)] [background-size:48px_48px] [mask-image:radial-gradient(ellipse_at_center,black_35%,transparent_80%)]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -left-24 top-1/3 h-72 w-72 rounded-full bg-[#0061F2]/15 blur-3xl"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -right-16 bottom-10 h-80 w-80 rounded-full bg-[#5fa9fe]/20 blur-3xl"
      />

      <div className="relative mx-auto flex min-h-[min(78vh,820px)] w-full max-w-6xl flex-col justify-center gap-12 px-4 py-16 sm:px-6 lg:flex-row lg:items-center lg:gap-16 lg:px-8 lg:py-24">
        <div className="max-w-xl animate-[fade-up_0.7s_ease-out_both]">
          <BrandLogo className="mb-8 h-11 w-48" />

          <p className="mb-3 text-xs font-semibold tracking-[0.22em] text-[#0061F2] uppercase">
            Error 404
          </p>
          <h1
            id="not-found-heading"
            className="font-heading text-4xl font-extrabold tracking-tight text-[#02172f] sm:text-5xl"
          >
            Esta ruta no aparece en el mapa
          </h1>
          <p className="mt-4 max-w-md text-base leading-relaxed text-slate-600 sm:text-lg">
            La página que buscas no existe, se movió o el enlace está
            incompleto. Vuelve al inicio o sigue explorando vehículos en
            WiAuto.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Button
              size="lg"
              className="h-11 rounded-lg bg-[#0061F2] px-5 text-white hover:bg-[#0052cc]"
              render={<Link href="/" />}
            >
              <Home className="size-4" aria-hidden />
              Ir al inicio
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="h-11 rounded-lg border-slate-300 bg-white/80 px-5 text-[#02172f] backdrop-blur-sm hover:bg-white"
              render={<Link href="/vehiculos" />}
            >
              <Car className="size-4" aria-hidden />
              Explorar vehículos
              <ArrowRight className="size-4" aria-hidden />
            </Button>
          </div>

          <nav aria-label="Enlaces útiles" className="mt-10">
            <p className="mb-3 text-xs font-semibold tracking-wide text-slate-500 uppercase">
              Atajos útiles
            </p>
            <ul className="flex flex-wrap gap-2">
              {QUICK_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="inline-flex items-center rounded-full border border-slate-200 bg-white/70 px-3 py-1.5 text-sm font-medium text-slate-700 transition-colors hover:border-[#0061F2]/40 hover:text-[#0061F2]"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        <div
          aria-hidden
          className="relative mx-auto w-full max-w-md animate-[fade-up_0.85s_ease-out_0.12s_both] lg:mx-0 lg:max-w-lg"
        >
          <div className="relative overflow-hidden rounded-[2rem] border border-white/60 bg-[#02172f] p-8 shadow-[0_30px_80px_-40px_rgba(1,87,235,0.65)] sm:p-10">
            <div className="absolute inset-0 bg-[linear-gradient(160deg,#013585_0%,#02172f_55%,#001533_100%)]" />
            <div className="absolute inset-x-10 top-1/2 h-px -translate-y-1/2 bg-white/15" />
            <div className="absolute inset-y-10 left-1/2 w-px -translate-x-1/2 bg-white/10" />
            <div className="absolute inset-x-0 top-[58%] h-1.5 bg-[#0061F2]/80 [mask-image:repeating-linear-gradient(90deg,black_0_18px,transparent_18px_34px)]" />

            <div className="relative flex flex-col items-center text-center">
              <Compass
                className="mb-4 size-10 text-[#5fa9fe] opacity-90"
                strokeWidth={1.5}
              />
              <p className="font-mono text-[clamp(5.5rem,18vw,8.5rem)] leading-none font-bold tracking-tighter text-white">
                404
              </p>
              <p className="mt-3 max-w-[16rem] text-sm leading-relaxed text-white/70">
                Coordenadas desconocidas. Recalcula tu ruta y vuelve a la
                carretera principal.
              </p>
            </div>
          </div>

          <div className="pointer-events-none absolute -right-3 -bottom-3 h-24 w-24 rounded-3xl border border-[#0061F2]/25 bg-white/40 backdrop-blur-md sm:-right-5 sm:-bottom-5" />
          <div className="pointer-events-none absolute -top-4 -left-4 size-16 rounded-2xl border border-white/50 bg-[#5fa9fe]/25 blur-[1px]" />
        </div>
      </div>
    </section>
  );
}
