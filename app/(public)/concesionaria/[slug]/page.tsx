import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getDealerBySlug } from "./services/getDealerBySlug.server";
import { DealerProfileHero } from "./components/DealerProfileHero";
import { DealerProfileSidebar } from "./components/DealerProfileSidebar";
import { DealerQuickStatsBar } from "./components/DealerQuickStatsBar";
import { DealerVehiclesSection } from "./components/DealerVehiclesSection";
import { DealerReviewsSection } from "./components/DealerReviewsSection";

type DealerProfilePageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({
  params,
}: DealerProfilePageProps): Promise<Metadata> {
  const { slug } = await params;
  const dealer = await getDealerBySlug(slug);

  if (!dealer) {
    return { title: "Concesionario no encontrado | WiAuto" };
  }

  return {
    title: `${dealer.name} | Concesionarios | WiAuto`,
    description: dealer.tagline,
    openGraph: {
      title: `${dealer.name} | WiAuto`,
      description: dealer.tagline,
      images: dealer.banner ? [{ url: dealer.banner }] : [],
    },
  };
}

export default async function DealerProfilePage({
  params,
}: DealerProfilePageProps) {
  const { slug } = await params;
  const dealer = await getDealerBySlug(slug);

  if (!dealer) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Hero banner (tall, with back link + dealer name) */}
      <DealerProfileHero dealer={dealer} />

      {/* Main layout: sidebar -mt pulls it up to overlap hero */}
      <div className="container-custom mx-auto px-4 pb-16 sm:px-6">
        <div className="grid grid-cols-1 gap-5 lg:grid-cols-12">
          {/* ── Left sidebar ── */}
          <aside className="lg:col-span-4 xl:col-span-3">
            <DealerProfileSidebar dealer={dealer} />
          </aside>

          {/* ── Main content ── */}
          <main className="lg:col-span-8 xl:col-span-9">
            <div className="pt-5 lg:pt-6">
              {/* 4 quick-stat cards */}
              <DealerQuickStatsBar stats={dealer.quickStats} />

              {/* Vehicle grid */}
              <DealerVehiclesSection dealer={dealer} />

              {/* Reviews */}
              <DealerReviewsSection dealer={dealer} />
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
