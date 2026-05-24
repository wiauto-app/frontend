import Link from "next/link";
import { CarTypeIcon } from "./CarTypeIcon";
import { SectionContainer } from "./SectionContainer";
import { SectionHeading } from "./SectionHeading";
import { BRAND_BLUE_LIGHT, CAR_TYPES } from "./data/home-data";

export function CarTypesSection() {
  return (
    <SectionContainer className="pt-0 pb-12 lg:pb-16">
      <div
        className="rounded-3xl px-4 py-10 sm:px-8 sm:py-12 lg:px-10 lg:py-14"
        style={{ backgroundColor: BRAND_BLUE_LIGHT }}
      >
        <SectionHeading lead="Tipos de" highlight="coches" className="mb-8 sm:mb-10" />

        <div className="-mx-1 flex gap-3 overflow-x-auto pb-1 sm:gap-4 lg:mx-0 lg:grid lg:grid-cols-6 lg:overflow-visible">
          {CAR_TYPES.map((type) => (
            <Link
              key={type.id}
              href={`/vehiculos?tipo=${type.id}`}
              className="flex min-w-[140px] shrink-0 flex-col items-center rounded-2xl bg-white px-4 py-6 text-center shadow-sm transition-shadow hover:shadow-md sm:min-w-[155px] lg:min-w-0"
            >
              <CarTypeIcon type={type.id} className="mb-4 h-10 w-[72px] text-slate-800" />
              <span className="text-sm font-bold text-slate-900">{type.name}</span>
              <span className="mt-1.5 text-[11px] leading-tight text-slate-500 sm:text-xs">
                {type.listings}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </SectionContainer>
  );
}
