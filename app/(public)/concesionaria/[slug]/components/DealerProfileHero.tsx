import type { DealerProfile } from "../interfaces";
import { WiautoImage } from "@/components/ui/wiautoImage";
import { PageBreadcrumbs } from "@/components/navigation/page-breadcrumbs";
import type { BreadcrumbItem } from "@/lib/seo/breadcrumb.types";

type DealerProfileHeroProps = {
  dealer: DealerProfile;
  breadcrumbItems: BreadcrumbItem[];
};

export function DealerProfileHero({
  dealer,
  breadcrumbItems,
}: DealerProfileHeroProps) {
  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0 relative-image" />
      <WiautoImage
        src={dealer.banner ?? ""}
        alt={dealer.name}
        fill
        className="object-cover"
        unoptimized
      />
      <div className="absolute inset-0 bg-gradient-to-r from-[#001B3D]/95 via-[#001B3D]/40 to-[#001B3D]/20" />
      <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#001B3D]/20" />

      <div className="absolute right-16 top-10 size-48 rounded-full bg-[#0061F2]/20 blur-3xl" />

      <div className="relative z-10 container-custom mx-auto px-4 pb-24 pt-5 sm:px-6 sm:pb-28 sm:pt-7">
        <PageBreadcrumbs items={breadcrumbItems} variant="onDark" />

        <div className="mt-8 grid grid-cols-1 gap-5 sm:mt-12 lg:grid-cols-12">
          <div className="lg:col-span-8 lg:col-start-5 xl:col-span-9 xl:col-start-4">
            <h1 className="text-3xl font-extrabold uppercase tracking-wide text-white drop-shadow-lg sm:text-4xl lg:text-5xl">
              {dealer.name}
            </h1>
            {dealer.tagline ? (
              <p className="mt-2 text-base text-blue-100/90 sm:text-lg">
                {dealer.tagline}
              </p>
            ) : null}
          </div>
        </div>
      </div>
    </section>
  );
}
