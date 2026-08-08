import { SectionContainer } from "./SectionContainer";
import { NewsletterSubscribeForm } from "./NewsletterSubscribeForm";
import { getHomeData } from "./services/homeService";

export async function NewsletterSection() {
  const home_data = await getHomeData();
  const data = home_data.homeNewsletter;
  return (
    <SectionContainer
      className="py-8 bg-primary/10"
    >
      <div className="mx-auto max-w-sm sm:max-w-md md:max-w-xl text-center">
        <div className="flex flex-col gap-1">
          <p
            className="text-xs sm:text-sm md:text-base font-semibold text-primary"
          >
            {data?.subtitle ?? ""}
          </p>
          <p className="text-lg md:text-xl lg:text-2xl font-bold ">
            {data?.title ?? ""}
          </p>
          <p className="mx-auto max-w-lg text-xs leading-relaxed text-slate-800 ">
            {data?.description ?? ""}
          </p>
        </div>
        <NewsletterSubscribeForm />
      </div>
    </SectionContainer>
  );
}
