import { SectionContainer } from "./SectionContainer";
import { BRAND_BLUE, BRAND_BLUE_LIGHT } from "./data/home-data";
import { NewsletterSubscribeForm } from "./NewsletterSubscribeForm";
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
        <NewsletterSubscribeForm />
      </div>
    </SectionContainer>
  );
}
