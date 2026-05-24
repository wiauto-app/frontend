import Image from "next/image";
import Link from "next/link";
import { Calendar, MessageCircle } from "lucide-react";
import { SectionContainer } from "./SectionContainer";
import { SectionHeading } from "./SectionHeading";
import { RELATED_NEWS } from "./data/home-data";

export function RelatedNewsSection() {
  return (
    <SectionContainer className="bg-white py-12 lg:py-16">
      <SectionHeading lead="Novedades del" highlight="mundo automotriz" className="mb-8 sm:mb-10" />

      <div className="grid gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-4">
        {RELATED_NEWS.map((item) => (
          <Link
            key={item.id}
            href="/blog"
            className="group overflow-hidden rounded-2xl bg-white shadow-[0_4px_20px_rgba(15,23,42,0.08)] transition-shadow hover:shadow-[0_8px_28px_rgba(15,23,42,0.12)]"
          >
            <div className="relative aspect-[4/3] overflow-hidden bg-slate-100">
              <Image
                src={item.imageSrc}
                alt=""
                fill
                className="object-cover transition-transform duration-300 group-hover:scale-105"
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
              />
            </div>
            <div className="p-4">
              <h3 className="line-clamp-3 text-sm font-bold leading-snug text-slate-900 group-hover:text-[#0061F2] sm:text-[15px]">
                {item.title}
              </h3>
              <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-[11px] text-slate-400">
                <span className="inline-flex items-center gap-1">
                  <Calendar className="size-3.5" style={{ color: "#8E9AAF" }} aria-hidden />
                  {item.date}
                </span>
                <span className="inline-flex items-center gap-1">
                  <MessageCircle className="size-3.5" style={{ color: "#8E9AAF" }} aria-hidden />
                  {item.comments}
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </SectionContainer>
  );
}
