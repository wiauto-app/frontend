import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import type { DealerProfile } from "../interfaces";

type DealerProfileHeroProps = {
  dealer: DealerProfile;
};

export function DealerProfileHero({ dealer }: DealerProfileHeroProps) {
  return (
    <section className="relative overflow-hidden">
      {/* Background image */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url('${dealer.banner ?? "https://images.unsplash.com/photo-1562519819-016195667493?auto=format&fit=crop&w=1920&q=80"}')`,
        }}
      />
      {/* Gradient overlays */}
      <div className="absolute inset-0 bg-gradient-to-r from-[#001B3D]/95 via-[#001B3D]/70 to-[#001B3D]/40" />
      <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#001B3D]/60" />

      {/* Decorative glow */}
      <div className="absolute right-16 top-10 size-48 rounded-full bg-[#0061F2]/20 blur-3xl" />

      <div className="relative z-10 container-custom mx-auto px-4 pb-24 pt-5 sm:px-6 sm:pb-28 sm:pt-7">
        {/* Back link */}
        <Link
          href="/concesionarias"
          className="inline-flex items-center gap-1.5 text-sm font-semibold text-white/80 transition-colors hover:text-white"
        >
          <ArrowLeft className="size-4" />
          Volver
        </Link>

        {/* Dealer name + tagline positioned aligned with main content grid */}
        <div className="mt-8 grid grid-cols-1 gap-5 sm:mt-12 lg:grid-cols-12">
          <div className="lg:col-span-8 lg:col-start-5 xl:col-span-9 xl:col-start-4">
            <h1 className="text-3xl font-extrabold uppercase tracking-wide text-white drop-shadow-lg sm:text-4xl lg:text-5xl">
              {dealer.name}
            </h1>
            <p className="mt-2 text-base text-blue-100/90 sm:text-lg">
              {dealer.tagline}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
