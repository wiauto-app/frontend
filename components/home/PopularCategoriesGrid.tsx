import Image from "next/image";
import Link from "next/link";
import { SectionContainer } from "./SectionContainer";
import { SectionHeading } from "./SectionHeading";
import { BRAND_BLUE, CATEGORY_YEAR_TAGS, POPULAR_CATEGORIES_GRID } from "./data/home-data";

function PopularCategoryCard({
  id,
  name,
  image,
}: (typeof POPULAR_CATEGORIES_GRID)[number]) {
  return (
    <Link
      href={`/vehiculos?categoria=${id}`}
      className="group block transition-transform duration-300 hover:-translate-y-1"
    >
      <article className="relative rounded-2xl shadow-[0_8px_24px_rgba(0,97,242,0.12)]">
        <div className="relative rounded-2xl bg-[#0061F2]">
          <div className="relative h-[148px] overflow-hidden rounded-t-2xl sm:h-[156px]">
            <Image
              src={image}
              alt=""
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
              sizes="(max-width: 640px) 50vw, 25vw"
            />
            <div
              className="absolute inset-0 bg-gradient-to-b from-black/10 via-transparent to-[#0061F2]/40"
              aria-hidden
            />
          </div>

          <div className="pointer-events-none absolute inset-x-0 top-[100px] z-10 flex justify-center sm:top-[108px]">
            <Image
              src="/home/car-cutout.svg"
              alt=""
              width={220}
              height={94}
              className="h-auto w-[82%] max-w-[220px] drop-shadow-[0_14px_22px_rgba(0,0,0,0.2)] transition-transform duration-300 group-hover:scale-[1.03]"
            />
          </div>

          <div
            className="relative z-[1] rounded-b-2xl px-4 pb-5 pt-14 sm:px-5 sm:pb-6 sm:pt-16"
            style={{ backgroundColor: BRAND_BLUE }}
          >
            <h3 className="text-xl font-bold text-white sm:text-[1.35rem]">{name}</h3>
            <ul className="mt-3 grid grid-cols-2 gap-1.5 sm:gap-2">
              {CATEGORY_YEAR_TAGS.map((tag, index) => (
                <li key={`${id}-${index}`}>
                  <span className="inline-block rounded-full bg-white/25 px-2.5 py-1 text-[10px] font-medium text-white sm:px-3 sm:text-[11px]">
                    {tag}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </article>
    </Link>
  );
}

export function PopularCategoriesGrid() {
  return (
    <SectionContainer className="py-12 lg:py-16">
      <SectionHeading lead="Categorías" highlight="populares" className="mb-8 sm:mb-10" />

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4 lg:gap-5">
        {POPULAR_CATEGORIES_GRID.map((category) => (
          <PopularCategoryCard key={category.id} {...category} />
        ))}
      </div>
    </SectionContainer>
  );
}
