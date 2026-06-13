import Link from "next/link";
import type { HomeHeroData } from "./types/home-page.types";
import { HeroSearchForm } from "./HeroSearchForm";
import { SearchForm } from "./searchForm";

const BRAND_BLUE = "#0061F2";
const FALLBACK_BACKGROUND =
  "https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=1920&q=80";

type HeroSectionProps = {
  data: HomeHeroData;
};

export function HeroSection({ data }: HeroSectionProps) {
  const primary_action = data.action_links[0];
  const background_image = data.background_image_url ?? FALLBACK_BACKGROUND;

  return (
    <section className="relative min-h-[560px] overflow-hidden rounded-lg">
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url('${background_image}')` }}
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

      <div className="relative mx-auto flex container-custom flex-col gap-10 px-4 py-16 sm:px-6  lg:gap-16 lg:px-8 lg:py-24">
        <div className="text-white space-y-1">
          <h1 className="font-bold lg:text-3xl text-2xl">{data.title}</h1>
          {data.subtitle ? (
            <p className="text-base text-white/90 sm:text-lg">
              {data.subtitle}
            </p>
          ) : null}
          {/* {primary_action ? (
              <Link
                href={primary_action.url}
                className="mt-8 inline-flex h-12 items-center justify-center rounded-lg border-2 border-white px-8 text-sm font-bold text-white transition-colors hover:bg-white/10"
              >
                {primary_action.label}
              </Link>
            ) : null} */}
        </div>

        <SearchForm />
      </div>
    </section>
  );
}
