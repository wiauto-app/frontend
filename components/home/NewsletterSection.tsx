import { ChevronRight, Send } from "lucide-react";
import { Input } from "@/components/ui/input";
import { SectionContainer } from "./SectionContainer";
import { BRAND_BLUE, BRAND_BLUE_LIGHT } from "./data/home-data";
import { getHomeData } from "./services/homeService";

export async function NewsletterSection() {
  const home_data = await getHomeData();
  const data = home_data.newsletter;

  return (
    <SectionContainer
      className="py-8"
      style={{ backgroundColor: BRAND_BLUE_LIGHT }}
    >
      <div className="mx-auto max-w-sm sm:max-w-md md:max-w-xl text-center">
        <div className="flex flex-col gap-1">
          <p
            className="text-xs sm:text-sm md:text-base font-semibold"
            style={{ color: BRAND_BLUE }}
          >
            {data.subtitle}
          </p>
          <p className="text-lg md:text-xl lg:text-2xl font-bold ">
            {data.title}
          </p>
          <p className="mx-auto max-w-lg text-xs leading-relaxed text-slate-800 ">
            {data.description}
          </p>
        </div>
        <form className="mx-auto mt-8 flex max-w-md overflow-hidden rounded-lg bg-white shadow-sm">
          <Input
            type="email"
            name="email"
            placeholder="Tu correo electrónico"
            required
            className="h-10 flex-1 border-0 bg-white px-4 text-sm text-slate-700 outline-none placeholder:text-slate-400"
          />
          <button
            type="submit"
            className="flex size-10 shrink-0 items-center justify-center text-white transition-opacity hover:opacity-90"
            style={{ backgroundColor: BRAND_BLUE }}
            aria-label="Suscribirse"
          >
            <ChevronRight className="size-5" aria-hidden />
          </button>
        </form>
      </div>
    </SectionContainer>
  );
}
